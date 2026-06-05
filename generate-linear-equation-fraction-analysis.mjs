import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 100;
const CORRECT_RATE = 0.8;
const SEED = 20250607;
const USER_NAME = 'Fiktivní uživatel – lineární rovnice se zlomky';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const SELECTED_MODES = ['Lineární rovnice se zlomky'];

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
    "const LINEAR_EQUATION_NO_SOLUTION_LABEL = 'nemá řešení';",
    "const LINEAR_EQUATION_INFINITE_SOLUTION_LABEL = 'libovolné číslo';",
    sliceBetween(mainJs, 'const LINEAR_EQUATION_MAX_LEVEL = 3;', 'const DECIMAL_COMPARE_MAX_LEVEL = 5;'),
    sliceBetween(mainJs, 'function randomWhole(min, max)', 'function randomDecimalWithNonZeroHundredths'),
    sliceBetween(mainJs, 'function normalizeSignedFraction(fraction)', 'function isAnswerFractionNegative()'),
    sliceBetween(mainJs, 'function gcd(a, b)', 'function randomProperFraction'),
    sliceBetween(mainJs, 'function reduceFraction(num, den)', 'function buildFractionMultiplyProblem'),
    sliceBetween(mainJs, 'function pickLinearEquationSolutionType(displayLevel)', 'function formatLinearXTermText(coef)'),
    sliceBetween(mainJs, 'function formatLinearSignedConstantText(value, isLeading = false)', 'function formatLinearEquationSideText(xCoef, constant)'),
    sliceBetween(mainJs, 'function randomLinearFractionDenominator(max = LINEAR_EQUATION_FRACTION_DEN_MAX)', 'function linearEquationFractionProblemFromRetry'),
  ].join('\n').replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    `${body}
${ENGINE_STUBS}
      return {
        createLinearEquationFractionProblem,
        formatLinearEquationFractionProblemText,
        LINEAR_EQUATION_FRACTION_MAX_LEVEL,
        LINEAR_EQUATION_NO_SOLUTION_LABEL,
        LINEAR_EQUATION_INFINITE_SOLUTION_LABEL,
        formatSignedFractionText,
        formatLinearEquationFractionDisplayHtml,
      };
    `,
  );

  return factory(random);
}

function getLinearEquationCorrectAnswerLabel(problem, formatSignedFractionText, labels) {
  if (problem.solutionType === 'none') {
    return labels.none;
  }

  if (problem.solutionType === 'infinite') {
    return labels.infinite;
  }

  return formatSignedFractionText({
    num: problem.answerNum,
    den: problem.answerDen,
    negative: problem.answerNegative,
  });
}

function formatLinearEquationSessionAnswer(userAnswer, formatSignedFractionText, labels) {
  if (userAnswer?.kind === 'special') {
    return userAnswer.value === 'none' ? labels.none : labels.infinite;
  }

  if (userAnswer?.kind === 'integer') {
    return String(userAnswer.value);
  }

  if (userAnswer?.kind === 'fraction') {
    return formatSignedFractionText(userAnswer.value);
  }

  return '';
}

function getCorrectUserAnswer(problem) {
  if (problem.solutionType === 'none') {
    return { kind: 'special', value: 'none' };
  }

  if (problem.solutionType === 'infinite') {
    return { kind: 'special', value: 'infinite' };
  }

  return {
    kind: 'fraction',
    value: {
      num: problem.answerNum,
      den: problem.answerDen,
      negative: problem.answerNegative,
    },
  };
}

function getWrongUserAnswer(problem) {
  if (problem.solutionType === 'none') {
    return { kind: 'special', value: 'infinite' };
  }

  if (problem.solutionType === 'infinite') {
    return { kind: 'special', value: 'none' };
  }

  return {
    kind: 'fraction',
    value: {
      num: problem.answerNum + 1,
      den: problem.answerDen,
      negative: problem.answerNegative,
    },
  };
}

function linearEquationFractionProblemFromRetry(dueRetry) {
  return {
    type: 'linear-equation-fraction',
    level: dueRetry.level,
    variant: dueRetry.variant,
    leftTerms: dueRetry.leftTerms.map((term) => ({ ...term })),
    right: { ...dueRetry.right },
    displayLeft: dueRetry.displayLeft,
    displayRight: dueRetry.displayRight,
    solutionType: dueRetry.solutionType,
    answerKind: dueRetry.answerKind,
    answerNum: dueRetry.answerNum,
    answerDen: dueRetry.answerDen,
    answerNegative: dueRetry.answerNegative,
    isRetry: true,
  };
}

function simulate() {
  const random = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);
  const {
    createLinearEquationFractionProblem,
    formatLinearEquationFractionProblemText,
    LINEAR_EQUATION_FRACTION_MAX_LEVEL,
    LINEAR_EQUATION_NO_SOLUTION_LABEL,
    LINEAR_EQUATION_INFINITE_SOLUTION_LABEL,
    formatSignedFractionText,
    formatLinearEquationFractionDisplayHtml,
  } = loadEngine(random);

  const labels = {
    none: LINEAR_EQUATION_NO_SOLUTION_LABEL,
    infinite: LINEAR_EQUATION_INFINITE_SOLUTION_LABEL,
  };

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
      problem = linearEquationFractionProblemFromRetry(dueRetry);
    } else {
      problem = createLinearEquationFractionProblem(difficultyLevel);
    }

    const shouldBeCorrect = outcomePlan[i];
    const userAnswer = shouldBeCorrect
      ? getCorrectUserAnswer(problem)
      : getWrongUserAnswer(problem);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < LINEAR_EQUATION_FRACTION_MAX_LEVEL) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) {
        difficultyLevel -= 1;
      }
      retryQueue.push({
        type: 'linear-equation-fraction',
        variant: problem.variant,
        leftTerms: problem.leftTerms.map((term) => ({ ...term })),
        right: { ...problem.right },
        displayLeft: problem.displayLeft,
        displayRight: problem.displayRight,
        solutionType: problem.solutionType,
        answerKind: problem.answerKind,
        answerNum: problem.answerNum,
        answerDen: problem.answerDen,
        answerNegative: problem.answerNegative,
        level: problem.level,
        problemsRemaining: PROBLEMS_BEFORE_RETRY,
      });
    }

    results.push([
      formatLinearEquationFractionProblemText(problem),
      problem.level,
      formatLinearEquationSessionAnswer(userAnswer, formatSignedFractionText, labels),
      getLinearEquationCorrectAnswerLabel(problem, formatSignedFractionText, labels),
      shouldBeCorrect ? 1 : 0,
      formatLinearEquationFractionDisplayHtml(problem),
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
