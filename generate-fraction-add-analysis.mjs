import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 50;
const CORRECT_RATE = 0.8;
const SEED = 20250602;
const USER_NAME = 'Fiktivní uživatel – sčítání zlomků';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const FRACTION_ADD_MAX_LEVEL = 3;

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
    throw new Error('Nepodařilo se načíst logiku sčítání zlomků z main.js');
  }

  const body = mainJs.slice(start, end)
    .replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
      return {
        createFractionAddProblem,
        gcd,
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

function simulate() {
  const random = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);
  const { createFractionAddProblem } = loadEngine(random);

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
      problem = {
        type: 'fraction-add',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        wholeAddend: dueRetry.wholeAddend ?? null,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        level: dueRetry.level,
        isRetry: true,
      };
    } else {
      problem = createFractionAddProblem(difficultyLevel);
    }

    const shouldBeCorrect = outcomePlan[i];
    const userAnswer = shouldBeCorrect
      ? { num: problem.answerNum, den: problem.answerDen }
      : wrongFractionAnswer(problem.answerNum, problem.answerDen);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < FRACTION_ADD_MAX_LEVEL) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) {
        difficultyLevel -= 1;
      }
      retryQueue.push({
        type: 'fraction-add',
        terms: problem.terms.map((term) => ({ ...term })),
        wholeAddend: problem.wholeAddend ?? null,
        answerNum: problem.answerNum,
        answerDen: problem.answerDen,
        level: problem.level,
        problemsRemaining: PROBLEMS_BEFORE_RETRY,
      });
    }

    results.push([
      formatFractionAddProblemText(problem),
      problem.level,
      formatFraction(userAnswer.num, userAnswer.den),
      formatFraction(problem.answerNum, problem.answerDen),
      shouldBeCorrect ? 1 : 0,
    ]);
  }

  const correctCount = results.filter((row) => row[4] === 1).length;
  return {
    payload: {
      n: USER_NAME,
      r: results,
    },
    correctCount,
    total: TOTAL_ANSWERS,
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

const { payload, correctCount, total } = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)} %)`);
console.log(`Odkaz: ${link}`);
