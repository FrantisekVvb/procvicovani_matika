import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 20;
const SEED = 202606091;
const USER_NAME = 'Fiktivní uživatel – mocniny celých čísel a sčítání zlomků (100 %)';
const START_DISPLAY_LEVEL = 5;
const MIN_DISPLAY_LEVEL = 5;
const INTERNAL_LEVEL = START_DISPLAY_LEVEL - 1;

const SELECTED_MODE_LABELS = [
  'Mocniny celých čísel',
  'Sčítání zlomků',
];

const ENGINE_STUBS = `
function getSelectedExclusiveMode() {
  return null;
}

function getSelectedOperations() {
  return [];
}

function getSelectedIntegerModes() {
  return [];
}

function getPowersModePickerValues() {
  return ['powers'];
}

function getSelectedFractionModes() {
  return ['fraction-add'];
}

function queueRetry() {}

activeExerciseMode = 'multi-mode';
activeExerciseModePool = buildExerciseModePool();
shuffledExerciseModeDeck = [];
lastPickedExerciseMode = null;
initMultiModeProgress();
difficultyLevel = ${INTERNAL_LEVEL};
exerciseMinDifficultyLevel = ${MIN_DISPLAY_LEVEL - 1};
initMultiModeFocusedModeIndexAtCurrentLevel();
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
${ENGINE_STUBS}
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

  function pickRandomItem(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItem);
}

function getCorrectAnswerText(problem) {
  if (problem.type === 'fraction-add') {
    return `${problem.answerNum}/${problem.answerDen}`;
  }

  if (problem.type === 'powers' || problem.type === 'sqrt' || problem.type === 'powers-sqrt-combined') {
    return String(problem.answer);
  }

  if (problem.answerNum != null && problem.answerDen != null) {
    return `${problem.answerNum}/${problem.answerDen}`;
  }

  return String(problem.answer);
}

function simulate() {
  const random = createRng(SEED);
  const engine = loadEngine(random);
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

  return {
    payload: {
      n: USER_NAME,
      m: SELECTED_MODE_LABELS,
      r: results,
    },
    typeCounts,
    levelCounts,
    finalDifficultyLevel: engine.getDifficultyLevel(),
    finalDisplayLevel: results[results.length - 1][1],
    modePool: engine.buildExerciseModePool(),
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

const {
  payload,
  typeCounts,
  levelCounts,
  finalDifficultyLevel,
  finalDisplayLevel,
  modePool,
} = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${TOTAL_ANSWERS}/${TOTAL_ANSWERS} (100 %)`);
console.log(`Počáteční a minimální úroveň: ${START_DISPLAY_LEVEL}`);
console.log(`Režimy v poolu: ${modePool.join(', ')}`);
console.log(`Konečná vnitřní obtížnost: ${finalDifficultyLevel} (zobrazená úroveň ${finalDisplayLevel})`);
console.log('Typy úloh:', typeCounts);
console.log('Rozložení zobrazených úrovní:', levelCounts);
console.log(`Odkaz: ${link}`);
