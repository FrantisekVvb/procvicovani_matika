import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 100;
const SEED = 20250612;
const USER_NAME = 'Fiktivní uživatel – výběr všech režimů (100 %)';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const GLOBAL_MAX_DIFFICULTY_LEVEL = 6;

const ALL_DECIMAL_OPS = ['add', 'subtract', 'multiply', 'divide', 'power-ten', 'divide-power-ten'];
const ALL_FRACTION_OPS = ['add', 'subtract', 'multiply', 'divide'];
const ALL_INTEGER_ARITHMETIC_OPS = ['add', 'subtract', 'multiply', 'divide'];

const NEGATIVE_MODE_LABELS = [
  'integer-add-subtract',
  'integer-multiply-divide',
  'integer-combined',
  'non-integer-add-subtract',
  'non-integer-multiply-divide',
];

const COMMON_ENGINE_HELPERS = `
function formatIntegerOperatorSymbol(operator, forText = false) {
  return formatIntegerArithmeticOperatorSymbol(operator, forText);
}

function getDisplayLevel(problem) {
  if (!problem) {
    return 1;
  }

  const powerTenDivisors = [10, 100, 1000];

  if (problem.operands?.length === 2
    && problem.operation === 'multiply'
    && powerTenDivisors.includes(problem.operands[1].value)) {
    return powerTenDivisors.indexOf(problem.operands[1].value) + 1;
  }

  if (problem.operands?.length === 2
    && problem.operation === 'divide'
    && powerTenDivisors.includes(problem.operands[1].value)) {
    return powerTenDivisors.indexOf(problem.operands[1].value) + 1;
  }

  return problem.level;
}
`;

const MODE_DEFINITIONS = [
  {
    label: 'integer-add-subtract',
    minDifficulty: 0,
    useCombinedDecimal: false,
    isNegative: true,
    stubs: `
activeExerciseMode = 'integer-add-subtract';
`,
  },
  {
    label: 'non-integer-add-subtract',
    minDifficulty: 0,
    useCombinedDecimal: false,
    isNegative: true,
    stubs: `
activeExerciseMode = 'non-integer-add-subtract';
`,
  },
  {
    label: 'integer-multiply-divide',
    minDifficulty: 1,
    useCombinedDecimal: false,
    isNegative: true,
    stubs: `
activeExerciseMode = 'integer-multiply-divide';
`,
  },
  {
    label: 'non-integer-multiply-divide',
    minDifficulty: 2,
    useCombinedDecimal: false,
    isNegative: true,
    stubs: `
activeExerciseMode = 'non-integer-multiply-divide';
`,
  },
  {
    label: 'integer-combined',
    minDifficulty: 3,
    useCombinedDecimal: false,
    isNegative: true,
    stubs: `
activeExerciseMode = 'integer-combined';
function getSelectedIntegerArithmeticOperations() {
  return ${JSON.stringify(ALL_INTEGER_ARITHMETIC_OPS)};
}
`,
  },
  {
    label: 'decimal-fraction-combined',
    minDifficulty: 4,
    useCombinedDecimal: true,
    isNegative: false,
    stubs: `
activeExerciseMode = 'decimal-fraction-combined';
function getSelectedOperations() {
  return ${JSON.stringify(ALL_DECIMAL_OPS)};
}
function getRegularOperations(selected = getSelectedOperations()) {
  return selected.filter((operation) => operation !== 'power-ten' && operation !== 'divide-power-ten');
}
function getSelectedFractionModes() {
  return ['fraction-add', 'fraction-subtract', 'fraction-multiply', 'fraction-divide'];
}
function getSelectedFractionOperations() {
  return ${JSON.stringify(ALL_FRACTION_OPS)};
}
`,
  },
];

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

function loadEngine(random, segmentStubs) {
  const mainJs = readFileSync(new URL('./main.js', import.meta.url), 'utf8');
  const start = mainJs.indexOf('const DIFFICULTY_LEVELS');
  const end = mainJs.indexOf('function recordSessionAnswer(userAnswer, isCorrect)');
  if (start === -1 || end === -1) {
    throw new Error('Nepodařilo se načíst logiku z main.js');
  }

  const body = mainJs.slice(start, end)
    .replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
${COMMON_ENGINE_HELPERS}
${segmentStubs}
      return {
        createRandomProblem,
        createDecimalFractionCombinedProblem,
        formatProblemText,
        getDisplayLevel,
        getMaxDifficultyLevel,
      };
    `,
  );

  function pickRandomItem(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItem);
}

function buildEngines() {
  const engines = new Map();

  MODE_DEFINITIONS.forEach((mode, index) => {
    engines.set(
      mode.label,
      loadEngine(createRng(SEED + index * 1000), mode.stubs),
    );
  });

  return engines;
}

function pickRandomItem(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function getAvailableModes(difficultyLevel) {
  return MODE_DEFINITIONS.filter((mode) => difficultyLevel >= mode.minDifficulty);
}

function pickModeForAnswer(difficultyLevel, rng) {
  const available = getAvailableModes(difficultyLevel);
  const negativeModes = available.filter((mode) => mode.isNegative);
  const advancedNegative = negativeModes.filter((mode) => mode.minDifficulty >= 3);
  const decimalModes = available.filter((mode) => !mode.isNegative);

  if (difficultyLevel >= 5 && advancedNegative.length > 0) {
    if (rng() < 0.7) {
      return pickRandomItem(advancedNegative, rng);
    }

    if (decimalModes.length > 0) {
      return decimalModes[0];
    }

    return pickRandomItem(advancedNegative, rng);
  }

  if (difficultyLevel >= 4 && negativeModes.length > 0) {
    if (rng() < 0.55) {
      const hardNegative = negativeModes.filter((mode) => mode.minDifficulty >= 2);
      return pickRandomItem(hardNegative.length > 0 ? hardNegative : negativeModes, rng);
    }

    if (decimalModes.length > 0) {
      return decimalModes[0];
    }
  }

  return pickRandomItem(available, rng);
}

function formatDecimal(value, decimals) {
  return value.toFixed(decimals).replace('.', ',');
}

function formatSignedFractionText(fraction) {
  const prefix = fraction.negative ? '-' : '';
  return `${prefix}${fraction.num}/${fraction.den}`;
}

function getNonIntegerAnswerKind(problem) {
  if (!problem || problem.type !== 'non-integer-add-subtract') {
    return null;
  }

  return problem.answerKind ?? problem.operandKind;
}

function isIntegerArithmeticProblem(problem) {
  return problem?.type === 'integer-add-subtract'
    || problem?.type === 'integer-multiply-divide'
    || problem?.type === 'integer-mixed';
}

function getCorrectAnswerText(problem) {
  if (problem.type === 'basic-form') {
    return `${problem.answerNum}/${problem.answerDen}`;
  }

  if (problem.type === 'non-integer-add-subtract') {
    if (getNonIntegerAnswerKind(problem) === 'decimal') {
      return formatDecimal(problem.answer, problem.answerDecimals);
    }

    return formatSignedFractionText({
      num: problem.answerNum,
      den: problem.answerDen,
      negative: problem.answerNegative,
    });
  }

  if (problem.type === 'non-integer-multiply-divide') {
    return formatSignedFractionText({
      num: problem.answerNum,
      den: problem.answerDen,
      negative: problem.answerNegative,
    });
  }

  if (isIntegerArithmeticProblem(problem)) {
    return String(problem.answer);
  }

  if (problem.answerNum != null && problem.answerDen != null) {
    return `${problem.answerNum}/${problem.answerDen}`;
  }

  return formatDecimal(problem.answer, problem.answerDecimals);
}

function getProblemKind(problem) {
  return problem.type
    ?? (problem.operators ? 'decimal-mixed' : 'decimal');
}

function getDifficultyLevelForMode(engine, difficultyLevel) {
  return Math.min(difficultyLevel, engine.getMaxDifficultyLevel());
}

function createProblem(engine, mode, difficultyLevel) {
  const levelForMode = getDifficultyLevelForMode(engine, difficultyLevel);

  if (mode.useCombinedDecimal) {
    return engine.createDecimalFractionCombinedProblem(levelForMode);
  }

  return engine.createRandomProblem(levelForMode);
}

function simulate() {
  const rng = createRng(SEED);
  const engines = buildEngines();
  const results = [];
  const typeCounts = {};
  const modeCounts = Object.fromEntries(NEGATIVE_MODE_LABELS.map((label) => [label, 0]));
  modeCounts['decimal-fraction-combined'] = 0;

  let difficultyLevel = 0;
  let correctStreak = 0;
  let previousDifficultyLevel = 0;

  for (let i = 0; i < TOTAL_ANSWERS; i += 1) {
    if (difficultyLevel < previousDifficultyLevel) {
      throw new Error(`Vnitřní obtížnost klesla (${previousDifficultyLevel} → ${difficultyLevel})`);
    }

    previousDifficultyLevel = difficultyLevel;

    const mode = pickModeForAnswer(difficultyLevel, rng);
    const engine = engines.get(mode.label);
    const problem = createProblem(engine, mode, difficultyLevel);

    if (!problem) {
      throw new Error(`Generátor nevrátil úlohu (${mode.label}, obtížnost ${difficultyLevel})`);
    }

    const kind = getProblemKind(problem);
    typeCounts[kind] = (typeCounts[kind] ?? 0) + 1;
    modeCounts[mode.label] = (modeCounts[mode.label] ?? 0) + 1;

    const correctText = getCorrectAnswerText(problem);
    results.push([
      engine.formatProblemText(problem),
      engine.getDisplayLevel(problem),
      correctText,
      correctText,
      1,
    ]);

    correctStreak += 1;
    if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < GLOBAL_MAX_DIFFICULTY_LEVEL) {
      difficultyLevel += 1;
      correctStreak = 0;
    }
  }

  const levelCounts = {};
  results.forEach((row) => {
    levelCounts[row[1]] = (levelCounts[row[1]] ?? 0) + 1;
  });

  const highLevelRows = results.filter((row) => row[1] >= 5);
  const highLevelNegative = highLevelRows.filter((row) => {
    const text = row[0];
    return /-\d/.test(text) || text.includes('(-') || text.includes('-(');
  }).length;

  const negativeCount = NEGATIVE_MODE_LABELS.reduce(
    (sum, label) => sum + (modeCounts[label] ?? 0),
    0,
  );

  return {
    payload: {
      n: USER_NAME,
      r: results,
    },
    typeCounts,
    modeCounts,
    levelCounts,
    negativeCount,
    highLevelNegative,
    highLevelTotal: highLevelRows.length,
    finalDisplayLevel: results[results.length - 1][1],
    finalDifficultyLevel: difficultyLevel,
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

const {
  payload,
  typeCounts,
  modeCounts,
  levelCounts,
  negativeCount,
  highLevelNegative,
  highLevelTotal,
  finalDisplayLevel,
  finalDifficultyLevel,
} = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${TOTAL_ANSWERS}/${TOTAL_ANSWERS} (100 %)`);
console.log(`Úlohy se zápornými čísly: ${negativeCount}/${TOTAL_ANSWERS}`);
console.log(`Záporné u úrovně 5+: ${highLevelNegative}/${highLevelTotal}`);
console.log(`Konečná vnitřní obtížnost: ${finalDifficultyLevel} (zobrazená úroveň ${finalDisplayLevel})`);
console.log('Režimy:', modeCounts);
console.log('Typy úloh:', typeCounts);
console.log('Rozložení zobrazených úrovní:', levelCounts);
console.log(`Odkaz: ${link}`);
