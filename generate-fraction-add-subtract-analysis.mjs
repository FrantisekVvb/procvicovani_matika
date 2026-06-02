import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 50;
const CORRECT_RATE = 0.8;
const SEED = 20250604;
const USER_NAME = 'Fiktivní uživatel – sčítání a odčítání zlomků';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const FRACTION_COMBINED_MAX_LEVEL = 4;
const FRACTION_MIXED_DISPLAY_LEVEL = 5;

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
  const mainJs = readFileSync(new URL('./main.js', import.meta.url), 'utf8');
  const start = mainJs.indexOf('const FRACTION_ADD_MAX_LEVEL');
  const end = mainJs.indexOf('function applyRationalStep(num, den, operand, op)');
  if (start === -1 || end === -1) {
    throw new Error('Nepodařilo se načíst logiku zlomků z main.js');
  }

  const body = mainJs.slice(start, end)
    .replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
      return {
        createFractionCombinedProblem,
      };
    `,
  );

  function pickRandomItem(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItem);
}

function formatFractionAddProblemText(problem) {
  const parts = problem.terms.map((term) => `${term.num}/${term.den}`);

  if (problem.wholeAddend != null) {
    parts.push(String(problem.wholeAddend));
  }

  return `${parts.join(' + ')} =`;
}

function formatFractionSubtractProblemText(problem) {
  if (problem.wholeMinuend != null) {
    return `${problem.wholeMinuend} - ${problem.terms[0].num}/${problem.terms[0].den} =`;
  }

  const parts = problem.terms.map((term) => `${term.num}/${term.den}`);

  if (problem.wholeSubtrahend != null) {
    parts.push(String(problem.wholeSubtrahend));
  }

  return `${parts.join(' - ')} =`;
}

function formatFractionMixedProblemText(problem) {
  let text = `${problem.terms[0].num}/${problem.terms[0].den}`;

  problem.operators.forEach((operator, index) => {
    const symbol = operator === 'add' ? ' + ' : ' - ';
    const term = problem.terms[index + 1];
    text += `${symbol}${term.num}/${term.den}`;
  });

  return `${text} =`;
}

function formatProblemText(problem) {
  if (problem.type === 'fraction-add') {
    return formatFractionAddProblemText(problem);
  }

  if (problem.type === 'fraction-subtract') {
    return formatFractionSubtractProblemText(problem);
  }

  return formatFractionMixedProblemText(problem);
}

function formatFraction(num, den) {
  return `${num}/${den}`;
}

function wrongFractionAnswer(num, den) {
  if (num + 1 <= den * 2) {
    return { num: num + 1, den };
  }
  if (num > 1) {
    return { num: num - 1, den };
  }
  return { num, den: den + 1 };
}

function cloneProblem(problem) {
  if (problem.type === 'fraction-add') {
    return {
      type: 'fraction-add',
      terms: problem.terms.map((term) => ({ ...term })),
      wholeAddend: problem.wholeAddend ?? null,
      answerNum: problem.answerNum,
      answerDen: problem.answerDen,
      level: problem.level,
      isRetry: true,
    };
  }

  if (problem.type === 'fraction-subtract') {
    return {
      type: 'fraction-subtract',
      terms: problem.terms.map((term) => ({ ...term })),
      wholeSubtrahend: problem.wholeSubtrahend ?? null,
      wholeMinuend: problem.wholeMinuend ?? null,
      answerNum: problem.answerNum,
      answerDen: problem.answerDen,
      level: problem.level,
      isRetry: true,
    };
  }

  return {
    type: 'fraction-mixed',
    terms: problem.terms.map((term) => ({ ...term })),
    operators: [...problem.operators],
    parenthesesGroup: problem.parenthesesGroup ?? null,
    answerNum: problem.answerNum,
    answerDen: problem.answerDen,
    level: problem.level,
    isRetry: true,
  };
}

function simulate() {
  const random = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);
  const { createFractionCombinedProblem } = loadEngine(random);

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
      problem = createFractionCombinedProblem(difficultyLevel);
    }

    const shouldBeCorrect = outcomePlan[i];
    const userAnswer = shouldBeCorrect
      ? { num: problem.answerNum, den: problem.answerDen }
      : wrongFractionAnswer(problem.answerNum, problem.answerDen);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < FRACTION_COMBINED_MAX_LEVEL) {
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
      formatProblemText(problem),
      problem.level,
      formatFraction(userAnswer.num, userAnswer.den),
      formatFraction(problem.answerNum, problem.answerDen),
      shouldBeCorrect ? 1 : 0,
    ]);
  }

  const correctCount = results.filter((row) => row[4] === 1).length;
  const mixedCount = results.filter((row) => row[1] >= FRACTION_MIXED_DISPLAY_LEVEL).length;

  return {
    payload: {
      n: USER_NAME,
      r: results,
    },
    correctCount,
    total: TOTAL_ANSWERS,
    mixedCount,
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

const DEFAULT_APP_BASE_URL = 'http://localhost:8000';

function buildShareUrl(id) {
  const appBase = (process.env.APP_BASE_URL ?? DEFAULT_APP_BASE_URL).replace(/\/$/, '');
  return `${appBase}/#a=${id}`;
}

const { payload, correctCount, total, mixedCount } = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)} %)`);
console.log(`Smíšené úlohy (úroveň 5): ${mixedCount}`);
console.log(`Odkaz: ${link}`);
