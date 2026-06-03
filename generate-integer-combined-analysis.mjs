import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 50;
const SEED = 20250604;
const USER_NAME = 'Fiktivní uživatel – sčítání, odčítání, násobení a dělení celých čísel';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const INTEGER_COMBINED_MAX_LEVEL = 4;
const INTEGER_ANSWER_MIN = -100;
const INTEGER_ANSWER_MAX = 100;

const SELECTED_INTEGER_OPS = ['add', 'subtract', 'multiply', 'divide'];

const ENGINE_STUBS = `
function getSelectedIntegerArithmeticOperations() {
  return ${JSON.stringify(SELECTED_INTEGER_OPS)};
}
`;

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
  const end = mainJs.indexOf('function pickNonIntegerOperandKind');
  if (start === -1 || end === -1) {
    throw new Error('Nepodařilo se načíst logiku kombinovaných celých čísel z main.js');
  }

  const body = mainJs.slice(start, end)
    .replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
${ENGINE_STUBS}
      return {
        createIntegerCombinedProblem,
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

function toPositiveIntegerTerm(term) {
  return {
    magnitude: term.magnitude,
    sign: 1,
    wrapped: term.wrapped,
  };
}

function resolveSingleIntegerOperatorDisplay(operator, term, getIntegerTermValue) {
  const value = getIntegerTermValue(term);

  if (term.wrapped) {
    return { operator, term };
  }

  if (operator === 'add' && value < 0) {
    return { operator: 'subtract', term: toPositiveIntegerTerm(term) };
  }

  if (operator === 'subtract' && value < 0) {
    return { operator: 'add', term: toPositiveIntegerTerm(term) };
  }

  return { operator, term };
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

  if (problem.level === 1 && problem.terms.length === 2
    && (problem.operators[0] === 'add' || problem.operators[0] === 'subtract')) {
    const resolved = resolveSingleIntegerOperatorDisplay(
      problem.operators[0],
      problem.terms[1],
      getIntegerTermValue,
    );
    text += `${formatIntegerArithmeticOperatorSymbol(resolved.operator, true)}${formatIntegerTermText(resolved.term, getIntegerTermValue)}`;
    return `${text} =`;
  }

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

function cloneProblemForRetry(problem) {
  return {
    type: problem.type,
    terms: problem.terms.map((term) => ({ ...term })),
    operators: [...problem.operators],
    answer: problem.answer,
    level: problem.level,
    isRetry: true,
  };
}

function simulate() {
  const random = createRng(SEED);
  const { createIntegerCombinedProblem, getIntegerTermValue } = loadEngine(random);

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
      problem = cloneProblemForRetry(dueRetry);
    } else {
      problem = createIntegerCombinedProblem(difficultyLevel);
    }

    const shouldBeCorrect = true;
    const userAnswer = shouldBeCorrect
      ? problem.answer
      : wrongIntegerAnswer(problem.answer);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < INTEGER_COMBINED_MAX_LEVEL) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) {
        difficultyLevel -= 1;
      }
      retryQueue.push({
        type: problem.type,
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
  const level3Count = results.filter((row) => row[1] >= 3).length;
  const level4Count = results.filter((row) => row[1] === 4).length;

  return {
    payload: {
      n: USER_NAME,
      r: results,
    },
    correctCount,
    total: TOTAL_ANSWERS,
    level3Count,
    level4Count,
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

const { payload, correctCount, total, level3Count, level4Count } = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)} %)`);
console.log(`Úroveň 3+: ${level3Count} úloh, úroveň 4: ${level4Count} úloh`);
console.log(`Odkaz: ${link}`);
