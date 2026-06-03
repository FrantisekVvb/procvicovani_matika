import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 50;
const SEED = 20250603;
const USER_NAME = 'Fiktivní uživatel – násobení a dělení celých čísel';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const INTEGER_MULTIPLY_DIVIDE_MAX_LEVEL = 2;
const INTEGER_ANSWER_MIN = -100;
const INTEGER_ANSWER_MAX = 100;

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
  const start = mainJs.indexOf('const INTEGER_MULTIPLY_DIVIDE_MAX_LEVEL');
  const end = mainJs.indexOf('function shouldUseIntegerCombinedMixedProblem');
  if (start === -1 || end === -1) {
    throw new Error('Nepodařilo se načíst logiku násobení a dělení celých čísel z main.js');
  }

  const body = mainJs.slice(start, end)
    .replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
      return {
        createIntegerMultiplyDivideProblem,
        getIntegerTermValue,
      };
    `,
  );

  function pickRandomItem(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItem);
}

function formatIntegerArithmeticOperatorSymbol(operator, forText = false) {
  if (operator === 'subtract') {
    return forText ? ' - ' : ' − ';
  }

  if (operator === 'multiply') {
    return forText ? ' · ' : '·';
  }

  if (operator === 'divide') {
    return forText ? ' : ' : ':';
  }

  return forText ? ' + ' : ' + ';
}

function integerTermNeedsParensAfterOperator(term, precedingOperator, getIntegerTermValue) {
  if (!precedingOperator || term.wrapped) {
    return false;
  }

  return getIntegerTermValue(term) < 0;
}

function formatIntegerTermText(term, getIntegerTermValue, precedingOperator = null) {
  const value = getIntegerTermValue(term);

  if (term.wrapped && value < 0) {
    return `(${value})`;
  }

  if (integerTermNeedsParensAfterOperator(term, precedingOperator, getIntegerTermValue)) {
    return `(${value})`;
  }

  return String(value);
}

function formatIntegerArithmeticProblemText(problem, getIntegerTermValue) {
  let text = formatIntegerTermText(problem.terms[0], getIntegerTermValue);

  problem.operators.forEach((operator, index) => {
    text += `${formatIntegerArithmeticOperatorSymbol(operator, true)}${formatIntegerTermText(problem.terms[index + 1], getIntegerTermValue, operator)}`;
  });

  return `${text} =`;
}

function formatIntegerAnswer(value) {
  return String(value);
}

function wrongIntegerAnswer(correct) {
  if (correct + 1 <= INTEGER_ANSWER_MAX) {
    return correct + 1;
  }

  if (correct - 1 >= INTEGER_ANSWER_MIN) {
    return correct - 1;
  }

  return correct + 2;
}

function simulate() {
  const random = createRng(SEED);
  const { createIntegerMultiplyDivideProblem, getIntegerTermValue } = loadEngine(random);

  let difficultyLevel = 0;
  let correctStreak = 0;
  let retryQueue = [];
  const results = [];

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
        type: 'integer-multiply-divide',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        answer: dueRetry.answer,
        level: dueRetry.level,
        isRetry: true,
      };
    } else {
      problem = createIntegerMultiplyDivideProblem(difficultyLevel);
    }

    const shouldBeCorrect = true;
    const userAnswer = shouldBeCorrect
      ? problem.answer
      : wrongIntegerAnswer(problem.answer);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < INTEGER_MULTIPLY_DIVIDE_MAX_LEVEL) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) {
        difficultyLevel -= 1;
      }
      retryQueue.push({
        terms: problem.terms.map((term) => ({ ...term })),
        operators: [...problem.operators],
        answer: problem.answer,
        level: problem.level,
        problemsRemaining: PROBLEMS_BEFORE_RETRY,
      });
    }

    results.push([
      formatIntegerArithmeticProblemText(problem, getIntegerTermValue),
      problem.level,
      formatIntegerAnswer(userAnswer),
      formatIntegerAnswer(problem.answer),
      shouldBeCorrect ? 1 : 0,
    ]);
  }

  const correctCount = results.filter((row) => row[4] === 1).length;
  const level2Count = results.filter((row) => row[1] === 2).length;

  return {
    payload: {
      n: USER_NAME,
      r: results,
    },
    correctCount,
    total: TOTAL_ANSWERS,
    level2Count,
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

const { payload, correctCount, total, level2Count } = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)} %)`);
console.log(`Úroveň 2+: ${level2Count} úloh`);
console.log(`Odkaz: ${link}`);
