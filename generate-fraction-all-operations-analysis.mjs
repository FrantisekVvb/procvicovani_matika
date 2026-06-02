import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 50;
const CORRECT_RATE = 1;
const SEED = 20250606;
const USER_NAME = 'Fiktivní uživatel – všechny operace se zlomky (100 %)';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const FRACTION_MIXED_DISPLAY_LEVEL = 5;
const FRACTION_COMBINED_EXTRA_MIXED_DISPLAY_LEVEL = 6;
const SELECTED_FRACTION_OPS = ['add', 'subtract', 'multiply', 'divide'];

const ENGINE_STUBS = `
const MULTI_OP_MIXED_START_LEVEL = 4;
const MULTI_OP_EXTRA_MIXED_START_LEVEL = 5;
const MIXED_OPERATOR_RATE = 0.8;
const PARENTHESES_RATE = 0.5;

function isAddOrSubtract(op) {
  return op === 'add' || op === 'subtract';
}

function resolveEvaluationGroup(operators, parenthesesGroup) {
  if (parenthesesGroup === 0) {
    return 0;
  }

  if (parenthesesGroup === 1) {
    return 1;
  }

  if (isAddOrSubtract(operators[0]) && !isAddOrSubtract(operators[1])) {
    return 1;
  }

  return 0;
}

function buildPureOperatorPairs(operations) {
  return operations.map((operation) => [operation, operation]);
}

function buildMixedOperatorPairs(operations) {
  const pairs = [];

  for (const first of operations) {
    for (const second of operations) {
      if (first !== second) {
        pairs.push([first, second]);
      }
    }
  }

  return pairs;
}

function pickParenthesesGroup(operators) {
  if (operators[0] === operators[1]) {
    return null;
  }

  const validGroups = [];
  if (isAddOrSubtract(operators[0])) {
    validGroups.push(0);
  }
  if (isAddOrSubtract(operators[1])) {
    validGroups.push(1);
  }

  if (validGroups.length === 0 || Math.random() >= PARENTHESES_RATE) {
    return null;
  }

  return pickRandomItem(validGroups);
}

function resolveParenthesesGroup(operators, parenthesesGroup) {
  if (parenthesesGroup === null) {
    return null;
  }

  if (parenthesesGroup === 0 && isAddOrSubtract(operators[0])) {
    return 0;
  }

  if (parenthesesGroup === 1 && isAddOrSubtract(operators[1])) {
    return 1;
  }

  return null;
}

function pickOperatorsForLevel(level, regularOps) {
  const purePairs = buildPureOperatorPairs(regularOps);
  const mixedPairs = buildMixedOperatorPairs(regularOps);

  if (mixedPairs.length === 0) {
    return pickRandomItem(purePairs);
  }

  if (level >= MULTI_OP_EXTRA_MIXED_START_LEVEL) {
    return pickRandomItem(mixedPairs);
  }

  if (Math.random() < MIXED_OPERATOR_RATE) {
    return pickRandomItem(mixedPairs);
  }

  return pickRandomItem(purePairs);
}

function getSelectedFractionModes() {
  return ['fraction-add', 'fraction-subtract', 'fraction-multiply', 'fraction-divide'];
}

function getSelectedFractionOperations() {
  return ${JSON.stringify(SELECTED_FRACTION_OPS)};
}

function getFractionCombinedMaxLevel() {
  return FRACTION_COMBINED_EXTRA_MAX_LEVEL + 1;
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
  const start = mainJs.indexOf('const FRACTION_ADD_MAX_LEVEL');
  const end = mainJs.indexOf('function applyRationalStep(num, den, operand, op)');
  if (start === -1 || end === -1) {
    throw new Error('Nepodařilo se načíst logiku zlomků z main.js');
  }

  const body = mainJs.slice(start, end)
    .replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
${ENGINE_STUBS}
      return {
        createFractionCombinedProblem,
        getFractionCombinedMaxLevel,
      };
    `,
  );

  function pickRandomItem(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItem);
}

function formatFractionOperatorSymbol(operator, forText = false) {
  if (operator === 'subtract') {
    return forText ? ' - ' : ' - ';
  }

  if (operator === 'multiply') {
    return forText ? ' · ' : ' · ';
  }

  if (operator === 'divide') {
    return forText ? ' : ' : ' : ';
  }

  return forText ? ' + ' : ' + ';
}

function formatFractionAddProblemText(problem) {
  const parts = problem.terms.map((term) => `${term.num}/${term.den}`);

  if (problem.wholeAddend != null) {
    parts.push(String(problem.wholeAddend));
  }

  return `${parts.join(' + ')} =`;
}

function formatFractionSubtractProblemText(problem) {
  if (problem.wholeMinuend != null) {
    return `${problem.wholeMinuend} - ${problem.terms[0].num}/${problem.terms[0].den} =`;
  }

  const parts = problem.terms.map((term) => `${term.num}/${term.den}`);

  if (problem.wholeSubtrahend != null) {
    parts.push(String(problem.wholeSubtrahend));
  }

  return `${parts.join(' - ')} =`;
}

function formatFractionMixedProblemText(problem) {
  const a = `${problem.terms[0].num}/${problem.terms[0].den}`;
  const b = `${problem.terms[1].num}/${problem.terms[1].den}`;
  const c = `${problem.terms[2].num}/${problem.terms[2].den}`;
  const op1 = formatFractionOperatorSymbol(problem.operators[0], true);
  const op2 = formatFractionOperatorSymbol(problem.operators[1], true);

  if (problem.parenthesesGroup === 0) {
    return `(${a}${op1}${b})${op2}${c} =`;
  }

  if (problem.parenthesesGroup === 1) {
    return `${a}${op1}(${b}${op2}${c}) =`;
  }

  return `${a}${op1}${b}${op2}${c} =`;
}

function formatFractionMultiplyProblemText(problem) {
  const parts = problem.terms.map((term) => `${term.num}/${term.den}`);

  if (problem.wholeFactor != null) {
    parts.push(String(problem.wholeFactor));
  }

  return `${parts.join(' · ')} =`;
}

function formatFractionDivideProblemText(problem) {
  if (problem.variant === 'fraction-whole') {
    return `${problem.dividendTerm.num}/${problem.dividendTerm.den} : ${problem.wholeDivisor} =`;
  }

  if (problem.variant === 'whole-fraction') {
    return `${problem.wholeDividend} : ${problem.divisorTerm.num}/${problem.divisorTerm.den} =`;
  }

  return `${problem.dividendTerm.num}/${problem.dividendTerm.den} : ${problem.divisorTerm.num}/${problem.divisorTerm.den} =`;
}

function formatProblemText(problem) {
  if (problem.type === 'fraction-add') {
    return formatFractionAddProblemText(problem);
  }

  if (problem.type === 'fraction-subtract') {
    return formatFractionSubtractProblemText(problem);
  }

  if (problem.type === 'fraction-mixed') {
    return formatFractionMixedProblemText(problem);
  }

  if (problem.type === 'fraction-multiply') {
    return formatFractionMultiplyProblemText(problem);
  }

  if (problem.type === 'fraction-divide') {
    return formatFractionDivideProblemText(problem);
  }

  throw new Error(`Neznámý typ úlohy: ${problem.type}`);
}

function formatFraction(num, den) {
  return `${num}/${den}`;
}

function wrongFractionAnswer(num, den) {
  if (num + 1 <= den * 2) {
    return { num: num + 1, den };
  }
  if (num > 1) {
    return { num: num - 1, den };
  }
  return { num, den: den + 1 };
}

function cloneProblem(problem) {
  if (problem.type === 'fraction-add') {
    return {
      type: 'fraction-add',
      terms: problem.terms.map((term) => ({ ...term })),
      wholeAddend: problem.wholeAddend ?? null,
      answerNum: problem.answerNum,
      answerDen: problem.answerDen,
      level: problem.level,
      isRetry: true,
    };
  }

  if (problem.type === 'fraction-subtract') {
    return {
      type: 'fraction-subtract',
      terms: problem.terms.map((term) => ({ ...term })),
      wholeSubtrahend: problem.wholeSubtrahend ?? null,
      wholeMinuend: problem.wholeMinuend ?? null,
      answerNum: problem.answerNum,
      answerDen: problem.answerDen,
      level: problem.level,
      isRetry: true,
    };
  }

  if (problem.type === 'fraction-multiply') {
    return {
      type: 'fraction-multiply',
      terms: problem.terms.map((term) => ({ ...term })),
      wholeFactor: problem.wholeFactor ?? null,
      answerNum: problem.answerNum,
      answerDen: problem.answerDen,
      level: problem.level,
      isRetry: true,
    };
  }

  if (problem.type === 'fraction-divide') {
    return {
      type: 'fraction-divide',
      variant: problem.variant,
      dividendTerm: problem.dividendTerm ? { ...problem.dividendTerm } : null,
      wholeDividend: problem.wholeDividend ?? null,
      divisorTerm: problem.divisorTerm ? { ...problem.divisorTerm } : null,
      wholeDivisor: problem.wholeDivisor ?? null,
      answerNum: problem.answerNum,
      answerDen: problem.answerDen,
      level: problem.level,
      isRetry: true,
    };
  }

  return {
    type: 'fraction-mixed',
    terms: problem.terms.map((term) => ({ ...term })),
    operators: [...problem.operators],
    parenthesesGroup: problem.parenthesesGroup ?? null,
    answerNum: problem.answerNum,
    answerDen: problem.answerDen,
    level: problem.level,
    isRetry: true,
  };
}

function simulate() {
  const random = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);
  const { createFractionCombinedProblem, getFractionCombinedMaxLevel } = loadEngine(random);
  const maxDifficultyLevel = getFractionCombinedMaxLevel();

  let difficultyLevel = 0;
  let correctStreak = 0;
  let retryQueue = [];
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
    retryQueue.forEach((item) => {
      if (item.problemsRemaining > 0) {
        item.problemsRemaining -= 1;
      }
    });

    let problem;
    const dueRetry = retryQueue.find((item) => item.problemsRemaining <= 0);
    if (dueRetry) {
      retryQueue = retryQueue.filter((item) => item !== dueRetry);
      problem = cloneProblem(dueRetry);
    } else {
      problem = createFractionCombinedProblem(difficultyLevel);
    }

    typeCounts[problem.type] = (typeCounts[problem.type] ?? 0) + 1;

    const shouldBeCorrect = outcomePlan[i];
    const userAnswer = shouldBeCorrect
      ? { num: problem.answerNum, den: problem.answerDen }
      : wrongFractionAnswer(problem.answerNum, problem.answerDen);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < maxDifficultyLevel) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) {
        difficultyLevel -= 1;
      }
      retryQueue.push({
        ...cloneProblem(problem),
        problemsRemaining: PROBLEMS_BEFORE_RETRY,
      });
    }

    results.push([
      formatProblemText(problem),
      problem.level,
      formatFraction(userAnswer.num, userAnswer.den),
      formatFraction(problem.answerNum, problem.answerDen),
      shouldBeCorrect ? 1 : 0,
    ]);
  }

  const correctCount = results.filter((row) => row[4] === 1).length;
  const mixedLevel5Count = results.filter((row) => row[1] === FRACTION_MIXED_DISPLAY_LEVEL).length;
  const mixedLevel6Count = results.filter((row) => row[1] === FRACTION_COMBINED_EXTRA_MIXED_DISPLAY_LEVEL).length;
  const mixedCount = results.filter((row) => row[1] >= FRACTION_MIXED_DISPLAY_LEVEL).length;

  return {
    payload: {
      n: USER_NAME,
      r: results,
    },
    correctCount,
    total: TOTAL_ANSWERS,
    mixedCount,
    mixedLevel5Count,
    mixedLevel6Count,
    typeCounts,
    maxDifficultyLevel,
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
  correctCount,
  total,
  mixedCount,
  mixedLevel5Count,
  mixedLevel6Count,
  typeCounts,
  maxDifficultyLevel,
} = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)} %)`);
console.log(`Max. obtížnost: ${maxDifficultyLevel + 1}. úroveň`);
console.log(`Smíšené úlohy celkem: ${mixedCount} (úroveň 5: ${mixedLevel5Count}, úroveň 6: ${mixedLevel6Count})`);
console.log('Typy úloh:', typeCounts);
console.log(`Odkaz: ${link}`);
