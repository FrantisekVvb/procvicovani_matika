import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 100;
const SEED = 20260604;

const MODE_CATALOG = {
  decimal: [
    { label: 'Sčítání desetinných čísel', operations: ['add'] },
    { label: 'Odčítání desetinných čísel', operations: ['subtract'] },
    { label: 'Násobení desetinných čísel', operations: ['multiply'] },
    { label: 'Dělení desetinných čísel', operations: ['divide'] },
    { label: '· 10; 100; 1000', operations: ['power-ten'] },
    { label: ': 10; 100; 1000', operations: ['divide-power-ten'] },
  ],
  integer: [
    { label: 'Sčítání a odčítání celých čísel', integerModes: ['integer-add-subtract'] },
    { label: 'Násobení a dělení celých čísel', integerModes: ['integer-multiply-divide'] },
    { label: 'Sčítání a odčítání necelých čísel', integerModes: ['non-integer-add-subtract'] },
    { label: 'Násobení a dělení necelých čísel', integerModes: ['non-integer-multiply-divide'] },
    {
      label: 'Sčítání, odčítání, násobení a dělení celých čísel',
      integerModes: ['integer-add-subtract', 'integer-multiply-divide'],
    },
  ],
  powers: [
    { label: 'Mocniny celých čísel', powersModes: ['powers'] },
    { label: 'Druhá odmocnina', powersModes: ['sqrt'] },
  ],
  fraction: [
    { label: 'Základní tvar', fractionModes: ['basic-form'] },
    { label: 'Sčítání zlomků', fractionModes: ['fraction-add'] },
    { label: 'Odčítání zlomků', fractionModes: ['fraction-subtract'] },
    { label: 'Násobení zlomků', fractionModes: ['fraction-multiply'] },
    { label: 'Dělení zlomků', fractionModes: ['fraction-divide'] },
    { label: 'Složený zlomek', fractionModes: ['fraction-compound'] },
  ],
};

const CATEGORY_ORDER = ['decimal', 'integer', 'powers', 'fraction'];

const FRACTION_ARITHMETIC_MODES = new Set([
  'fraction-add',
  'fraction-subtract',
  'fraction-multiply',
  'fraction-divide',
]);

function fractionModesTriggerCrossType(fractionModes) {
  return fractionModes.some((mode) => FRACTION_ARITHMETIC_MODES.has(mode));
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

function pickRandomItem(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function pickRandomModes(rng) {
  const decimal = pickRandomItem(MODE_CATALOG.decimal, rng);
  let fraction = pickRandomItem(MODE_CATALOG.fraction, rng);
  const integer = pickRandomItem(MODE_CATALOG.integer, rng);
  const powers = pickRandomItem(MODE_CATALOG.powers, rng);

  if (decimal.operations.length > 0 && fractionModesTriggerCrossType(fraction.fractionModes)) {
    const safeFractions = MODE_CATALOG.fraction.filter(
      (item) => !fractionModesTriggerCrossType(item.fractionModes),
    );
    fraction = pickRandomItem(safeFractions, rng);
  }

  return [
    { category: 'decimal', ...decimal },
    { category: 'integer', ...integer },
    { category: 'powers', ...powers },
    { category: 'fraction', ...fraction },
  ];
}

function buildEngineStubs(selection) {
  const operations = selection.find((item) => item.category === 'decimal')?.operations ?? [];
  const integerModes = selection.flatMap((item) => item.integerModes ?? []);
  const powersModes = selection.find((item) => item.category === 'powers')?.powersModes ?? [];
  const fractionModes = selection.find((item) => item.category === 'fraction')?.fractionModes ?? [];

  return `
function getSelectedOperations() {
  return ${JSON.stringify(operations)};
}

function getSelectedIntegerModes() {
  return ${JSON.stringify(integerModes)};
}

function getPowersModePickerValues() {
  return ${JSON.stringify(powersModes)};
}

function getSelectedFractionModes() {
  return ${JSON.stringify(fractionModes)};
}

function queueRetry() {}

activeExerciseMode = 'multi-mode';
activeExerciseModePool = buildExerciseModePool();
shuffledExerciseModeDeck = [];
lastPickedExerciseMode = null;
initMultiModeProgress();
`;
}

function loadEngine(random, engineStubs) {
  const mainJs = readFileSync(new URL('./main.js', import.meta.url), 'utf8');
  const start = mainJs.indexOf('const DIFFICULTY_LEVELS');
  const end = mainJs.indexOf('function recordSessionAnswer(userAnswer, isCorrect)');
  const progressionStart = mainJs.indexOf('function advanceMultiModePhaseAfterIndividualComplete()');
  const progressionEnd = mainJs.indexOf('function newProblem()');
  if (start === -1 || end === -1 || progressionStart === -1 || progressionEnd === -1) {
    throw new Error('Nepodařilo se načíst logiku z main.js');
  }

  const body = `${mainJs.slice(start, end)}${mainJs.slice(progressionStart, progressionEnd)}`
    .replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
${engineStubs}
      return {
        createRandomProblem,
        formatProblemText,
        getDisplayLevel,
        getDifficultyLevel: () => difficultyLevel,
        handleCorrectAnswer,
        buildExerciseModePool,
      };
    `,
  );

  function pickRandomItemFromEngine(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItemFromEngine);
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

  if (problem.type === 'powers' || problem.type === 'sqrt' || problem.type === 'powers-sqrt-combined') {
    return String(problem.answer);
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

  if (problem.answer != null && problem.answerDecimals != null) {
    return formatDecimal(problem.answer, problem.answerDecimals);
  }

  return String(problem.answer);
}

function simulate(selection) {
  const rng = createRng(SEED);
  const engine = loadEngine(rng, buildEngineStubs(selection));
  const modePool = engine.buildExerciseModePool();

  if (modePool.length !== 4) {
    throw new Error(`Očekávány 4 režimy v poolu, získáno: ${modePool.join(', ')}`);
  }

  const results = [];
  const typeCounts = {};

  for (let i = 0; i < TOTAL_ANSWERS; i += 1) {
    const problem = engine.createRandomProblem(engine.getDifficultyLevel());

    if (!problem) {
      throw new Error(`Generátor nevrátil úlohu (obtížnost ${engine.getDifficultyLevel()})`);
    }

    const kind = problem.type ?? 'unknown';
    typeCounts[kind] = (typeCounts[kind] ?? 0) + 1;

    const correctText = getCorrectAnswerText(problem);
    results.push([
      engine.formatProblemText(problem),
      engine.getDisplayLevel(problem),
      correctText,
      correctText,
      1,
    ]);

    engine.handleCorrectAnswer();
  }

  const levelCounts = {};
  results.forEach((row) => {
    levelCounts[row[1]] = (levelCounts[row[1]] ?? 0) + 1;
  });

  const modeLabels = selection.map((item) => item.label);

  return {
    payload: {
      n: `Fiktivní uživatel – 4 náhodné režimy (100 %)`,
      m: modeLabels,
      r: results,
    },
    typeCounts,
    levelCounts,
    modeLabels,
    modePool,
    finalDifficultyLevel: engine.getDifficultyLevel(),
    finalDisplayLevel: results[results.length - 1][1],
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

const rng = createRng(SEED);
const selection = pickRandomModes(rng);
const {
  payload,
  typeCounts,
  levelCounts,
  modeLabels,
  modePool,
  finalDifficultyLevel,
  finalDisplayLevel,
} = simulate(selection);
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${TOTAL_ANSWERS}/${TOTAL_ANSWERS} (100 %)`);
console.log('Vybrané režimy:', modeLabels);
console.log(`Režimy v poolu: ${modePool.join(', ')}`);
console.log(`Konečná vnitřní obtížnost: ${finalDifficultyLevel} (zobrazená úroveň ${finalDisplayLevel})`);
console.log('Typy úloh:', typeCounts);
console.log('Rozložení zobrazených úrovní:', levelCounts);
console.log(`Odkaz: ${link}`);
