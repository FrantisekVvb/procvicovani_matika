import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 100;
const CORRECT_RATE = 0.8;
const SEED = 202606083;
const USER_NAME = 'Fiktivní uživatel – mocniny celých čísel a druhá odmocnina (80 %)';
const PROBLEMS_BEFORE_RETRY = 3;

const SELECTED_OPERATIONS = [];
const SELECTED_INTEGER_MODES = [];
const SELECTED_POWERS_MODES = ['powers', 'sqrt'];
const SELECTED_FRACTION_MODES = [];

const MODE_LABELS = [
  'Mocniny celých čísel',
  'Druhá odmocnina',
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

function buildEngineStubs() {
  return `
function formatIntegerOperatorSymbol(operator, forText = false) {
  return formatIntegerArithmeticOperatorSymbol(operator, forText);
}

function getSelectedExclusiveMode() {
  return null;
}

function getSelectedOperations() {
  return ${JSON.stringify(SELECTED_OPERATIONS)};
}

function getSelectedIntegerModes() {
  return ${JSON.stringify(SELECTED_INTEGER_MODES)};
}

function getPowersModePickerValues() {
  return ${JSON.stringify(SELECTED_POWERS_MODES)};
}

function getSelectedFractionModes() {
  return ${JSON.stringify(SELECTED_FRACTION_MODES)};
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
        formatProblemDisplayHtml,
        getDisplayLevel,
        getDifficultyLevel: () => difficultyLevel,
        getMultiModePhase: () => multiModePhase,
        getFocusedMode: () => multiModeIndividualQueue[multiModeFocusedModeIndex],
        handleCorrectAnswer,
        handleWrongAnswer,
        buildExerciseModePool,
        buildMultiModeIndividualQueue,
        buildMultiModeWithinPanelQueue,
      };
    `,
  );

  function pickRandomItemFromEngine(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItemFromEngine);
}

function formatProblemTextForAnalysis(formatProblemText, problem) {
  return formatProblemText(problem).replace(' = ?', ' =');
}

function getCorrectAnswerText(problem) {
  if (problem.type === 'powers' || problem.type === 'sqrt' || problem.type === 'powers-sqrt-combined') {
    return String(problem.answer);
  }

  return String(problem.answer);
}

function wrongIntegerAnswer(correctText) {
  const value = Number(correctText);
  if (Number.isFinite(value)) {
    return String(value + 1);
  }

  return `${correctText}?`;
}

function simulate() {
  const rng = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);
  const engine = loadEngine(rng, buildEngineStubs());
  const modePool = engine.buildExerciseModePool();
  const individualQueue = engine.buildMultiModeIndividualQueue();
  const withinPanelQueue = engine.buildMultiModeWithinPanelQueue();
  const results = [];
  const typeCounts = {};

  const outcomePlan = Array.from(
    { length: TOTAL_ANSWERS },
    (_, i) => i < Math.round(TOTAL_ANSWERS * CORRECT_RATE),
  );
  for (let i = outcomePlan.length - 1; i > 0; i -= 1) {
    const j = Math.floor(outcomeRandom() * (i + 1));
    [outcomePlan[i], outcomePlan[j]] = [outcomePlan[j], outcomePlan[i]];
  }

  for (let i = 0; i < TOTAL_ANSWERS; i += 1) {
    const problem = engine.createRandomProblem(engine.getDifficultyLevel());

    if (!problem) {
      throw new Error(`Generátor nevrátil úlohu (obtížnost ${engine.getDifficultyLevel()})`);
    }

    const kind = problem.type ?? 'unknown';
    typeCounts[kind] = (typeCounts[kind] ?? 0) + 1;

    const shouldBeCorrect = outcomePlan[i];
    const correctText = getCorrectAnswerText(problem);
    const userAnswerText = shouldBeCorrect ? correctText : wrongIntegerAnswer(correctText);

    if (shouldBeCorrect) {
      engine.handleCorrectAnswer();
    } else {
      engine.handleWrongAnswer();
    }

    results.push([
      formatProblemTextForAnalysis(engine.formatProblemText, problem),
      engine.getDisplayLevel(problem),
      userAnswerText,
      correctText,
      shouldBeCorrect ? 1 : 0,
    ]);
  }

  const levelCounts = {};
  results.forEach((row) => {
    levelCounts[row[1]] = (levelCounts[row[1]] ?? 0) + 1;
  });

  const correctCount = results.filter((row) => row[4] === 1).length;

  return {
    payload: {
      n: USER_NAME,
      m: MODE_LABELS,
      r: results,
    },
    correctCount,
    typeCounts,
    levelCounts,
    modePool,
    individualQueue,
    withinPanelQueue,
    finalDifficultyLevel: engine.getDifficultyLevel(),
    finalPhase: engine.getMultiModePhase(),
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

const {
  payload,
  correctCount,
  typeCounts,
  levelCounts,
  modePool,
  individualQueue,
  withinPanelQueue,
  finalDifficultyLevel,
  finalPhase,
  finalDisplayLevel,
} = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${TOTAL_ANSWERS} (${Math.round((correctCount / TOTAL_ANSWERS) * 100)} %)`);
console.log('Zvolené režimy:', MODE_LABELS.join(', '));
console.log(`Režimy v poolu: ${modePool.join(', ')}`);
console.log(`Individuální fronta: ${individualQueue.join(', ')}`);
console.log(`Kombinace v rámci panelů: ${withinPanelQueue.join(', ') || '—'}`);
console.log(`Konečná fáze: ${finalPhase}, vnitřní obtížnost: ${finalDifficultyLevel} (poslední zobrazená úroveň ${finalDisplayLevel})`);
console.log('Typy úloh:', typeCounts);
console.log('Rozložení zobrazených úrovní:', levelCounts);
console.log(`Odkaz: ${link}`);
