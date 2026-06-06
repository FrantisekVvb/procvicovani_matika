import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 50;
const CORRECT_RATE = 1;
const SEED = 20250613;
const USER_NAME = 'Fiktivní uživatel – Určení velikosti celku';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const SELECTED_MODES = ['Určení velikosti celku'];

const ENGINE_STUBS = `
const PERCENT_PART_MAX_LEVEL = 2;
const PERCENT_PART_ANSWER_MAX = 999999;
const PERCENT_PART_BASIC_PERCENTS = [1, 10, 20, 25, 50];
const PERCENT_PART_LARGE_PERCENT_MIN = 110;
const PERCENT_PART_LARGE_PERCENT_MAX = 250;
const PERCENT_PART_MAX_SIGNIFICANT_DIGITS = 3;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
    sliceBetween(mainJs, 'function randomWhole(min, max)', 'function buildExactDivideFromAnswer'),
    sliceBetween(mainJs, 'function getExactDecimalPlaces(value, maxPlaces)', 'function buildDecimalFractionConvertProblem({'),
    sliceBetween(mainJs, 'function answersMatch(userAnswer, correctAnswer, decimals)', 'function getFractionalPart(value, decimals)'),
    sliceBetween(mainJs, 'function pickRandomItem(items)', 'function shuffleArray'),
    sliceBetween(mainJs, 'function isPercentPartProblem(problem)', 'function nonIntegerCompareProblemFromRetry'),
  ].join('\n').replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
${ENGINE_STUBS}
      return {
        createPercentWholeProblem,
        formatPercentWholeProblemText,
        formatPercentWholeDisplayHtml,
        formatDecimal,
        fromScaled,
        toScaled,
        PERCENT_PART_MAX_LEVEL,
      };
    `,
  );

  function pickRandomItem(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItem);
}

function formatPercentWholeSessionAnswer(userAnswer, problem, formatDecimal) {
  return formatDecimal(userAnswer, problem.answerDecimals);
}

function getCorrectUserAnswer(problem) {
  return problem.answer;
}

function getWrongUserAnswer(problem, { fromScaled, toScaled }) {
  if (problem.answerDecimals === 0) {
    return problem.answer + 1;
  }

  return fromScaled(toScaled(problem.answer, problem.answerDecimals) + 1, problem.answerDecimals);
}

function percentWholeProblemFromRetry(dueRetry) {
  return {
    type: 'percent-whole',
    level: dueRetry.level,
    percent: dueRetry.percent,
    part: dueRetry.part,
    answer: dueRetry.answer,
    answerDecimals: dueRetry.answerDecimals,
    isRetry: true,
  };
}

function simulate() {
  const random = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);
  const {
    createPercentWholeProblem,
    formatPercentWholeProblemText,
    formatPercentWholeDisplayHtml,
    formatDecimal,
    fromScaled,
    toScaled,
    PERCENT_PART_MAX_LEVEL,
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
      problem = percentWholeProblemFromRetry(dueRetry);
    } else {
      problem = createPercentWholeProblem(difficultyLevel);
    }

    const shouldBeCorrect = outcomePlan[i];
    const userAnswer = shouldBeCorrect
      ? getCorrectUserAnswer(problem)
      : getWrongUserAnswer(problem, { fromScaled, toScaled });

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < PERCENT_PART_MAX_LEVEL) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) {
        difficultyLevel -= 1;
      }
      retryQueue.push({
        type: 'percent-whole',
        percent: problem.percent,
        part: problem.part,
        answer: problem.answer,
        answerDecimals: problem.answerDecimals,
        level: problem.level,
        problemsRemaining: PROBLEMS_BEFORE_RETRY,
      });
    }

    results.push([
      formatPercentWholeProblemText(problem),
      problem.level,
      formatPercentWholeSessionAnswer(userAnswer, problem, formatDecimal),
      formatPercentWholeSessionAnswer(problem.answer, problem, formatDecimal),
      shouldBeCorrect ? 1 : 0,
      formatPercentWholeDisplayHtml(problem),
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

const DEFAULT_APP_BASE_URL = 'http://localhost:3000';

function buildShareUrl(id) {
  const appBase = (process.env.APP_BASE_URL ?? DEFAULT_APP_BASE_URL).replace(/\/$/, '');
  return `${appBase}/#a=${id}`;
}

const { payload, correctCount, total } = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)} %)`);
console.log(`Odkaz: ${link}`);
