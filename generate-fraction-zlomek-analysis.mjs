import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 100;
const CORRECT_RATE = 0.8;
const SEED = 20250608;
const USER_NAME = 'Fiktivní uživatel – Zlomek';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const SELECTED_MODES = ['Zlomek'];

const ENGINE_STUBS = `
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatIntegerAnswer(value) {
  return String(value);
}

function shouldRequireBasicFormAnswer() {
  return false;
}

function isBasicFormFraction() {
  return true;
}

const BASIC_FORM_REQUIRED_MESSAGE = '';
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
    'const FRACTION_ZLOMEK_MAX_LEVEL = 1;',
    sliceBetween(mainJs, 'function randomWhole(min, max)', 'function randomDecimalWithNonZeroHundredths'),
    sliceBetween(mainJs, 'function formatFraction(num, den)', 'function formatSignedFractionText(fraction)'),
    sliceBetween(mainJs, 'function fractionAnswersMatch(userFraction, correctFraction)', 'function shouldRequireBasicFormAnswer()'),
    sliceBetween(mainJs, 'function evaluateFractionAnswer(userFraction, correctFraction)', 'function isFractionAnswerInputShape()'),
    sliceBetween(mainJs, 'function pickRandomItem(items)', 'function shuffleArray'),
    sliceBetween(mainJs, 'function formatSingleFractionHtml(num, den, isNegative = false)', 'function formatFractionDisplayHtml(num, den)'),
    sliceBetween(mainJs, 'function isFractionZlomekProblem(problem)', 'function nonIntegerCompareProblemFromRetry'),
  ].join('\n').replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
${ENGINE_STUBS}
      return {
        createFractionZlomekProblem,
        formatFractionZlomekProblemText,
        formatFractionZlomekSessionAnswer,
        formatFractionZlomekCorrectAnswer,
        formatFractionZlomekDisplayHtml,
        FRACTION_ZLOMEK_MAX_LEVEL,
      };
    `,
  );

  function pickRandomItem(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItem);
}

function getCorrectUserAnswer(problem) {
  if (problem.answerKind === 'number') {
    return problem.answer;
  }

  return {
    num: problem.answerNum,
    den: problem.answerDen,
  };
}

function getWrongUserAnswer(problem) {
  if (problem.answerKind === 'number') {
    return problem.answer + 1;
  }

  return {
    num: problem.answerNum + 1,
    den: problem.answerDen,
  };
}

function fractionZlomekProblemFromRetry(dueRetry) {
  return {
    type: 'fraction-zlomek',
    variant: dueRetry.variant,
    level: dueRetry.level,
    prompt: dueRetry.prompt,
    answerKind: dueRetry.answerKind,
    answerNum: dueRetry.answerNum,
    answerDen: dueRetry.answerDen,
    answer: dueRetry.answer,
    promptNum: dueRetry.promptNum ?? null,
    promptDen: dueRetry.promptDen ?? null,
    quantity: dueRetry.quantity ?? null,
    partValue: dueRetry.partValue ?? null,
    unitValue: dueRetry.unitValue ?? null,
    unitMeasure: dueRetry.unitMeasure ?? null,
    unitLabel: dueRetry.unitLabel ?? null,
    isRetry: true,
  };
}

function simulate() {
  const random = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);
  const {
    createFractionZlomekProblem,
    formatFractionZlomekProblemText,
    formatFractionZlomekSessionAnswer,
    formatFractionZlomekCorrectAnswer,
    formatFractionZlomekDisplayHtml,
    FRACTION_ZLOMEK_MAX_LEVEL,
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
      problem = fractionZlomekProblemFromRetry(dueRetry);
    } else {
      problem = createFractionZlomekProblem(difficultyLevel);
    }

    const shouldBeCorrect = outcomePlan[i];
    const userAnswer = shouldBeCorrect
      ? getCorrectUserAnswer(problem)
      : getWrongUserAnswer(problem);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < FRACTION_ZLOMEK_MAX_LEVEL) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) {
        difficultyLevel -= 1;
      }
      retryQueue.push({
        type: 'fraction-zlomek',
        variant: problem.variant,
        prompt: problem.prompt,
        answerKind: problem.answerKind,
        answerNum: problem.answerNum,
        answerDen: problem.answerDen,
        answer: problem.answer,
        promptNum: problem.promptNum ?? null,
        promptDen: problem.promptDen ?? null,
        quantity: problem.quantity ?? null,
        partValue: problem.partValue ?? null,
        unitValue: problem.unitValue ?? null,
        unitMeasure: problem.unitMeasure ?? null,
        unitLabel: problem.unitLabel ?? null,
        level: problem.level,
        problemsRemaining: PROBLEMS_BEFORE_RETRY,
      });
    }

    results.push([
      formatFractionZlomekProblemText(problem),
      problem.level,
      formatFractionZlomekSessionAnswer(userAnswer, problem),
      formatFractionZlomekCorrectAnswer(problem),
      shouldBeCorrect ? 1 : 0,
      formatFractionZlomekDisplayHtml(problem),
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
