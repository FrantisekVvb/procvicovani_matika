import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 100;
const CORRECT_RATE = 0.8;
const SEED = 20250606;
const USER_NAME = 'Fiktivní uživatel – sčítání, odčítání, násobení a dělení desetinných čísel (80 %)';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const SELECTED_OPERATIONS = ['add', 'subtract', 'multiply', 'divide'];

const USER_VISIBLE_LEVEL_THRESHOLD = 4;
const USER_VISIBLE_MAX_LEVEL = 5;

function getDisplayLevel(problem) {
  const internalLevel = problem.level;
  if (internalLevel > USER_VISIBLE_LEVEL_THRESHOLD) {
    return USER_VISIBLE_MAX_LEVEL;
  }
  return internalLevel;
}

function readSupabaseConfig() {
  const source = readFileSync(new URL('./supabase-config.js', import.meta.url), 'utf8');
  const urlMatch = source.match(/url:\s*'([^']+)'/);
  const keyMatch = source.match(/anonKey:\s*'([^']+)'/);
  if (!urlMatch || !keyMatch || urlMatch[1].includes('YOUR_PROJECT')) {
    throw new Error('Chybí platný supabase-config.js');
  }
  return { url: urlMatch[1], anonKey: keyMatch[1] };
}

function createRng(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}

function loadEngine(random) {
  let source = readFileSync(new URL('./simulate-user.mjs', import.meta.url), 'utf8');
  source = source
    .replace(/^const TOTAL_ANSWERS = \d+;\n/m, '')
    .replace(/^const CORRECT_RATE = [\d.]+;\n/m, '')
    .replace(/^const SEED = \d+;\n/m, '')
    .replace(/^const VALID_OPERATIONS[\s\S]*?^}/m, '')
    .replace(/^const modeArg[\s\S]*?^}/m, '')
    .replace(/^if \(selectedOperations\.length === 0\)[\s\S]*?^}/m, '')
    .replace(/^const random = createRng\(SEED\);\nconst outcomeRandom = createRng\(SEED \+ 999\);\n/m, '')
    .replace(/^const output = simulate\(\);[\s\S]*$/m, '');

  const factory = new Function(
    'rand',
    'outcomeRandom',
    `
    const selectedOperations = ${JSON.stringify(SELECTED_OPERATIONS)};
    const random = rand;
    ${source}
    return {
      createRandomProblem,
      getMaxDifficultyLevel,
      formatProblemText,
      formatDecimal,
    };
  `,
  );

  return factory(random, createRng(SEED + 999));
}

function formatProblemTextForAnalysis(formatProblemText, problem) {
  return formatProblemText(problem).replace(' = ?', ' =');
}

function wrongDecimalAnswer(formatDecimal, answer, answerDecimals) {
  const step = 10 ** -answerDecimals;
  if (answer + step <= 99) {
    return formatDecimal(answer + step, answerDecimals);
  }
  return formatDecimal(Math.max(0, answer - step), answerDecimals);
}

function cloneProblem(problem) {
  return {
    operands: problem.operands.map((operand) => ({ ...operand })),
    operation: problem.operation,
    operators: problem.operators ? [...problem.operators] : undefined,
    parenthesesGroup: problem.parenthesesGroup ?? null,
    answer: problem.answer,
    answerDecimals: problem.answerDecimals,
    level: problem.level,
    isRetry: true,
  };
}

function simulate() {
  const random = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);
  const {
    createRandomProblem,
    getMaxDifficultyLevel,
    formatProblemText,
    formatDecimal,
  } = loadEngine(random);

  let difficultyLevel = 0;
  let correctStreak = 0;
  let retryQueue = [];
  const results = [];

  const outcomePlan = Array.from(
    { length: TOTAL_ANSWERS },
    (_, i) => i < Math.round(TOTAL_ANSWERS * CORRECT_RATE),
  );
  for (let i = outcomePlan.length - 1; i > 0; i -= 1) {
    const j = Math.floor(outcomeRandom() * (i + 1));
    [outcomePlan[i], outcomePlan[j]] = [outcomePlan[j], outcomePlan[i]];
  }

  for (let i = 0; i < TOTAL_ANSWERS; i += 1) {
    retryQueue.forEach((item) => {
      if (item.problemsRemaining > 0) {
        item.problemsRemaining -= 1;
      }
    });

    let problem;
    const dueRetry = retryQueue.find((item) => item.problemsRemaining <= 0);
    if (dueRetry) {
      retryQueue = retryQueue.filter((item) => item !== dueRetry);
      problem = cloneProblem(dueRetry);
    } else {
      problem = createRandomProblem(difficultyLevel);
    }

    const shouldBeCorrect = outcomePlan[i];
    const correctText = formatDecimal(problem.answer, problem.answerDecimals);
    const userAnswerText = shouldBeCorrect
      ? correctText
      : wrongDecimalAnswer(formatDecimal, problem.answer, problem.answerDecimals);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < getMaxDifficultyLevel()) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) {
        difficultyLevel -= 1;
      }
      retryQueue.push({
        ...cloneProblem(problem),
        problemsRemaining: PROBLEMS_BEFORE_RETRY,
      });
    }

    results.push([
      formatProblemTextForAnalysis(formatProblemText, problem),
      getDisplayLevel(problem),
      userAnswerText,
      correctText,
      shouldBeCorrect ? 1 : 0,
    ]);
  }

  const correctCount = results.filter((row) => row[4] === 1).length;
  const visibleLevelCounts = {};
  results.forEach((row) => {
    visibleLevelCounts[row[1]] = (visibleLevelCounts[row[1]] ?? 0) + 1;
  });
  const mixedCount = results.filter((row) => row[1] === USER_VISIBLE_MAX_LEVEL).length;

  return {
    payload: {
      n: USER_NAME,
      r: results,
    },
    correctCount,
    total: TOTAL_ANSWERS,
    mixedCount,
    visibleLevelCounts,
    maxDifficultyLevel: getMaxDifficultyLevel(),
  };
}

async function saveAnalysis(payload) {
  const { url, anonKey } = readSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/analyses`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ payload }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Uložení selhalo (${response.status}): ${body}`);
  }

  const [row] = await response.json();
  if (!row?.id) {
    throw new Error('Supabase nevrátilo ID analýzy.');
  }

  return row.id;
}

const DEFAULT_APP_BASE_URL = 'http://localhost:3000';

function buildShareUrl(id) {
  const appBase = (process.env.APP_BASE_URL ?? DEFAULT_APP_BASE_URL).replace(/\/$/, '');
  return `${appBase}/#a=${id}`;
}

const { payload, correctCount, total, mixedCount, visibleLevelCounts, maxDifficultyLevel } = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)} %)`);
console.log(`Max. obtížnost: ${maxDifficultyLevel + 1}. úroveň`);
console.log(`Úlohy na zobrazené úrovni 5: ${mixedCount}`);
console.log('Zobrazené úrovně:', visibleLevelCounts);
console.log(`Odkaz: ${link}`);
