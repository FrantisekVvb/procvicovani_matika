import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 50;
const CORRECT_RATE = 1;
const SEED = 20250605;
const USER_NAME = 'Fiktivní uživatel – porovnávání zlomků';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const SELECTED_MODES = ['Porovnávání zlomků'];

const ENGINE_STUBS = `
function isDecimalCompareProblem(problem) {
  return false;
}

function isIntegerCompareProblem(problem) {
  return false;
}

function isNonIntegerCompareProblem(problem) {
  return false;
}

function isFractionCompareProblem(problem) {
  return problem?.type === 'fraction-compare';
}

function formatIntegerAnswer(value) {
  return String(value);
}

function formatDecimal(value, decimals) {
  return value.toFixed(decimals).replace('.', ',');
}

function formatNonIntegerDecimalTermText(term) {
  const value = getNonIntegerTermValue(term);
  return formatDecimal(value, 1);
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

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Nepodařilo se načíst úsek mezi ${startMarker} a ${endMarker}`);
  }
  return source.slice(start, end);
}

function loadEngine(random) {
  const mainJs = readFileSync(new URL('./main.js', import.meta.url), 'utf8');

  const body = [
    sliceBetween(mainJs, 'const NON_INTEGER_FRACTION_DEN_MAX = 12;', 'const BASIC_FORM_MAX_BY_LEVEL'),
    sliceBetween(mainJs, 'function randomWhole(min, max)', 'function randomDecimalWithNonZeroHundredths'),
    sliceBetween(mainJs, 'function normalizeSignedFraction(fraction)', 'function formatSignedFractionText(fraction)'),
    'function formatSignedFractionText(fraction) {',
    mainJs.slice(
      mainJs.indexOf('function formatSignedFractionText(fraction)'),
      mainJs.indexOf('function isAnswerFractionNegative()'),
    ).replace(/^function formatSignedFractionText\(fraction\) \{\n/, ''),
    sliceBetween(mainJs, 'function getNonIntegerTermValue(term)', 'function evaluateNonIntegerDecimalExpression'),
    sliceBetween(mainJs, 'function formatNonIntegerFractionTermText(term)', 'function formatNonIntegerFractionSignHtml'),
    sliceBetween(mainJs, 'function formatNonIntegerTermText(term)', 'function formatNonIntegerFractionSignHtml'),
    sliceBetween(mainJs, 'function isFractionCompareProblem(problem)', 'function compareDecimalOperands'),
    sliceBetween(mainJs, 'function getCompareSignAnswer(left, right)', 'function buildDecimalCompareProblem'),
    sliceBetween(mainJs, 'function gcd(a, b)', 'function randomProperFraction'),
    sliceBetween(mainJs, 'function pickRandomItem(items)', 'function shuffleArray'),
    sliceBetween(mainJs, 'function buildFractionCompareProblem({', 'function nonIntegerCompareProblemFromRetry'),
    sliceBetween(mainJs, 'function formatCompareSignText(problem, sign = \'?\')', 'function formatCompareSignHtml'),
    sliceBetween(mainJs, 'function formatCompareCorrectAnswer(problem)', 'function formatCompareSessionAnswer(problem, userAnswer)'),
    'function formatCompareSessionAnswer(problem, userAnswer) {',
    mainJs.slice(
      mainJs.indexOf('function formatCompareSessionAnswer(problem, userAnswer)'),
      mainJs.indexOf('function integerCompareProblemFromRetry'),
    ).replace(/^function formatCompareSessionAnswer\(problem, userAnswer\) \{\n/, ''),
  ].join('\n').replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
${ENGINE_STUBS}
      return {
        createFractionCompareProblem,
        formatCompareProblemText,
        formatCompareSessionAnswer,
        formatCompareCorrectAnswer,
        FRACTION_COMPARE_MAX_LEVEL,
      };
    `,
  );

  function pickRandomItem(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItem);
}

function getCompareUserAnswer(problem) {
  if (problem.variant === 'sign') {
    return { kind: 'sign', sign: problem.answerSign };
  }

  return { kind: 'order', order: [...problem.correctOrder] };
}

function fractionCompareProblemFromRetry(dueRetry) {
  const problem = {
    type: 'fraction-compare',
    variant: dueRetry.variant,
    level: dueRetry.level,
    left: dueRetry.left ? { ...dueRetry.left } : null,
    right: dueRetry.right ? { ...dueRetry.right } : null,
    operands: dueRetry.operands ? dueRetry.operands.map((operand) => ({ ...operand })) : null,
    answerSign: dueRetry.answerSign,
    correctOrder: dueRetry.correctOrder ? [...dueRetry.correctOrder] : null,
    displayOrder: dueRetry.displayOrder ? [...dueRetry.displayOrder] : null,
    isRetry: true,
  };

  return problem;
}

function simulate() {
  const random = createRng(SEED);
  const {
    createFractionCompareProblem,
    formatCompareProblemText,
    formatCompareSessionAnswer,
    formatCompareCorrectAnswer,
    FRACTION_COMPARE_MAX_LEVEL,
  } = loadEngine(random);

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
      problem = fractionCompareProblemFromRetry(dueRetry);
    } else {
      problem = createFractionCompareProblem(difficultyLevel);
    }

    const userAnswer = getCompareUserAnswer(problem);
    const shouldBeCorrect = true;

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < FRACTION_COMPARE_MAX_LEVEL) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) {
        difficultyLevel -= 1;
      }
      retryQueue.push({
        type: 'fraction-compare',
        variant: problem.variant,
        left: problem.left ? { ...problem.left } : null,
        right: problem.right ? { ...problem.right } : null,
        operands: problem.operands ? problem.operands.map((operand) => ({ ...operand })) : null,
        answerSign: problem.answerSign,
        correctOrder: problem.correctOrder ? [...problem.correctOrder] : null,
        displayOrder: problem.displayOrder ? [...problem.displayOrder] : null,
        level: problem.level,
        problemsRemaining: PROBLEMS_BEFORE_RETRY,
      });
    }

    results.push([
      formatCompareProblemText(problem),
      problem.level,
      formatCompareSessionAnswer(problem, userAnswer),
      formatCompareCorrectAnswer(problem),
      shouldBeCorrect ? 1 : 0,
    ]);
  }

  const correctCount = results.filter((row) => row[4] === 1).length;
  return {
    payload: {
      n: USER_NAME,
      m: SELECTED_MODES,
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
