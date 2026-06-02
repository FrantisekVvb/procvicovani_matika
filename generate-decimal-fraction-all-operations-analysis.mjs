import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 100;
const PERFECT_LEVEL_MAX = 4;
const HIGH_LEVEL_CORRECT_RATE = 0.8;
const SEED = 20250608;
const USER_NAME = 'Fiktivní uživatel – všechny operace (desetinná + zlomky, 100 % do úr. 4, 80 % od úr. 5)';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;

const SELECTED_DECIMAL_OPS = ['add', 'subtract', 'multiply', 'divide', 'power-ten', 'divide-power-ten'];
const SELECTED_FRACTION_OPS = ['add', 'subtract', 'multiply', 'divide'];

const ENGINE_STUBS = `
activeExerciseMode = 'decimal-fraction-combined';

function getSelectedOperations() {
  return ${JSON.stringify(SELECTED_DECIMAL_OPS)};
}

function getRegularOperations(selected = getSelectedOperations()) {
  return selected.filter((operation) => operation !== 'power-ten' && operation !== 'divide-power-ten');
}

function getSelectedFractionModes() {
  return ['fraction-add', 'fraction-subtract', 'fraction-multiply', 'fraction-divide'];
}

function getSelectedFractionOperations() {
  return ${JSON.stringify(SELECTED_FRACTION_OPS)};
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
  const start = mainJs.indexOf('const DIFFICULTY_LEVELS');
  const end = mainJs.indexOf('function isPowerTenProblem(problem)');
  if (start === -1 || end === -1) {
    throw new Error('Nepodařilo se načíst logiku z main.js');
  }

  const body = mainJs.slice(start, end)
    .replace(/\bMath\.random\(\)/g, 'rand()');

  const factory = new Function(
    'rand',
    'pickRandomItem',
    `${body}
${ENGINE_STUBS}
      return {
        createDecimalFractionCombinedProblem,
        getCrossTypeCombinedMaxLevel,
        getCrossTypePoolMaxLevel,
      };
    `,
  );

  function pickRandomItem(items) {
    return items[Math.floor(random() * items.length)];
  }

  return factory(random, pickRandomItem);
}

function formatDecimal(value, decimals) {
  return value.toFixed(decimals).replace('.', ',');
}

function formatOperatorSymbol(op) {
  if (op === 'subtract') return ' − ';
  if (op === 'multiply') return ' · ';
  if (op === 'divide') return ' : ';
  return ' + ';
}

function formatMultiOperandExpression(problem) {
  const parts = problem.operands.map((operand) => formatDecimal(operand.value, operand.decimals));

  if (problem.operands.length === 3 && problem.parenthesesGroup === 0) {
    return `(${parts[0]}${formatOperatorSymbol(problem.operators[0])}${parts[1]})${formatOperatorSymbol(problem.operators[1])}${parts[2]}`;
  }

  if (problem.operands.length === 3 && problem.parenthesesGroup === 1) {
    return `${parts[0]}${formatOperatorSymbol(problem.operators[0])}(${parts[1]}${formatOperatorSymbol(problem.operators[1])}${parts[2]})`;
  }

  let expression = parts[0];
  for (let i = 0; i < problem.operators.length; i += 1) {
    expression += `${formatOperatorSymbol(problem.operators[i])}${parts[i + 1]}`;
  }

  return expression;
}

function formatFractionOperatorSymbol(operator) {
  if (operator === 'subtract') return ' - ';
  if (operator === 'multiply') return ' · ';
  if (operator === 'divide') return ' : ';
  return ' + ';
}

function formatMixedTermText(term) {
  if (term.kind === 'decimal') {
    let text = formatDecimal(term.value, term.decimals);
    if (term.wholeFactor != null) {
      text += ` · ${term.wholeFactor}`;
    }
    return text;
  }

  if (term.kind === 'fraction') {
    return `${term.num}/${term.den}`;
  }

  return String(term.value);
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
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
    const a = `${problem.terms[0].num}/${problem.terms[0].den}`;
    const b = `${problem.terms[1].num}/${problem.terms[1].den}`;
    const c = `${problem.terms[2].num}/${problem.terms[2].den}`;
    const op1 = formatFractionOperatorSymbol(problem.operators[0]);
    const op2 = formatFractionOperatorSymbol(problem.operators[1]);

    if (problem.parenthesesGroup === 0) {
      return `(${a}${op1}${b})${op2}${c} =`;
    }
    if (problem.parenthesesGroup === 1) {
      return `${a}${op1}(${b}${op2}${c}) =`;
    }
  }

  let text = `${problem.terms[0].num}/${problem.terms[0].den}`;
  problem.operators.forEach((operator, index) => {
    const term = problem.terms[index + 1];
    text += `${formatFractionOperatorSymbol(operator)}${term.num}/${term.den}`;
  });
  return `${text} =`;
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

function formatDecimalFractionMixedProblemText(problem) {
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
    const a = formatMixedTermText(problem.terms[0]);
    const b = formatMixedTermText(problem.terms[1]);
    const c = formatMixedTermText(problem.terms[2]);
    const op1 = formatFractionOperatorSymbol(problem.operators[0]);
    const op2 = formatFractionOperatorSymbol(problem.operators[1]);

    if (problem.parenthesesGroup === 0) {
      return `(${a}${op1}${b})${op2}${c} =`;
    }
    if (problem.parenthesesGroup === 1) {
      return `${a}${op1}(${b}${op2}${c}) =`;
    }
  }

  let text = formatMixedTermText(problem.terms[0]);
  problem.operators.forEach((operator, index) => {
    text += `${formatFractionOperatorSymbol(operator)}${formatMixedTermText(problem.terms[index + 1])}`;
  });
  return `${text} =`;
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
  if (problem.type === 'decimal-fraction-mixed') {
    return formatDecimalFractionMixedProblemText(problem);
  }
  if (problem.operators) {
    return `${formatMultiOperandExpression(problem)} =`;
  }
  const operator = formatOperatorSymbol(problem.operation);
  const expression = problem.operands
    .map((operand) => formatDecimal(operand.value, operand.decimals))
    .join(operator);
  return `${expression} =`;
}

function isFractionLikeProblem(problem) {
  return problem.type === 'fraction-add'
    || problem.type === 'fraction-subtract'
    || problem.type === 'fraction-mixed'
    || problem.type === 'fraction-multiply'
    || problem.type === 'fraction-divide'
    || problem.type === 'decimal-fraction-mixed';
}

function getCorrectAnswerText(problem) {
  if (isFractionLikeProblem(problem)) {
    return `${problem.answerNum}/${problem.answerDen}`;
  }
  return formatDecimal(problem.answer, problem.answerDecimals);
}

function wrongFractionAnswer(num, den) {
  if (num + 1 <= den * 2) {
    return `${num + 1}/${den}`;
  }
  if (num > 1) {
    return `${num - 1}/${den}`;
  }
  return `${num}/${den + 1}`;
}

function wrongDecimalAnswer(answer, answerDecimals) {
  const step = 10 ** -answerDecimals;
  if (answer + step <= 99) {
    return formatDecimal(answer + step, answerDecimals);
  }
  return formatDecimal(Math.max(0, answer - step), answerDecimals);
}

function getWrongAnswerText(problem) {
  if (isFractionLikeProblem(problem)) {
    return wrongFractionAnswer(problem.answerNum, problem.answerDen);
  }
  return wrongDecimalAnswer(problem.answer, problem.answerDecimals);
}

function shouldAnswerCorrect(problemLevel, outcomeRandom) {
  if (problemLevel <= PERFECT_LEVEL_MAX) {
    return true;
  }
  return outcomeRandom() < HIGH_LEVEL_CORRECT_RATE;
}

function cloneMixedTerm(term) {
  return { ...term };
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

  if (problem.type === 'fraction-mixed') {
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

  if (problem.type === 'decimal-fraction-mixed') {
    return {
      type: 'decimal-fraction-mixed',
      terms: problem.terms.map(cloneMixedTerm),
      operators: [...problem.operators],
      parenthesesGroup: problem.parenthesesGroup ?? null,
      answerNum: problem.answerNum,
      answerDen: problem.answerDen,
      level: problem.level,
      isRetry: true,
    };
  }

  return {
    operands: problem.operands.map((operand) => ({ ...operand })),
    operation: problem.operation,
    operators: problem.operators ? [...problem.operators] : undefined,
    parenthesesGroup: problem.parenthesesGroup ?? null,
    answer: problem.answer,
    answerDecimals: problem.answerDecimals,
    level: problem.level,
    isRetry: true,
  };
}

function getProblemKind(problem) {
  if (problem.type === 'decimal-fraction-mixed') {
    return 'decimal-fraction-mixed';
  }
  if (isFractionLikeProblem(problem)) {
    return problem.type ?? 'fraction';
  }
  if (problem.operators) {
    return 'decimal-mixed';
  }
  return 'decimal';
}

function simulate() {
  const random = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);
  const {
    createDecimalFractionCombinedProblem,
    getCrossTypeCombinedMaxLevel,
    getCrossTypePoolMaxLevel,
  } = loadEngine(random);
  const maxDifficultyLevel = getCrossTypeCombinedMaxLevel();
  const crossMixedDisplayLevel = getCrossTypePoolMaxLevel() + 1;

  let difficultyLevel = 0;
  let correctStreak = 0;
  let retryQueue = [];
  const results = [];
  const typeCounts = {};

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
      problem = createDecimalFractionCombinedProblem(difficultyLevel);
    }

    const kind = getProblemKind(problem);
    typeCounts[kind] = (typeCounts[kind] ?? 0) + 1;

    const shouldBeCorrect = shouldAnswerCorrect(problem.level, outcomeRandom);
    const correctText = getCorrectAnswerText(problem);
    const userAnswerText = shouldBeCorrect ? correctText : getWrongAnswerText(problem);

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
      userAnswerText,
      correctText,
      shouldBeCorrect ? 1 : 0,
    ]);
  }

  const correctCount = results.filter((row) => row[4] === 1).length;
  const highLevelRows = results.filter((row) => row[1] >= PERFECT_LEVEL_MAX + 1);
  const highLevelCorrect = highLevelRows.filter((row) => row[4] === 1).length;
  const crossMixedCount = results.filter((row) => row[1] >= crossMixedDisplayLevel).length;

  return {
    payload: {
      n: USER_NAME,
      r: results,
    },
    correctCount,
    total: TOTAL_ANSWERS,
    highLevelCorrect,
    highLevelTotal: highLevelRows.length,
    crossMixedCount,
    crossMixedDisplayLevel,
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
  highLevelCorrect,
  highLevelTotal,
  crossMixedCount,
  crossMixedDisplayLevel,
  typeCounts,
  maxDifficultyLevel,
} = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)} %)`);
console.log(`Úroveň 5+: ${highLevelCorrect}/${highLevelTotal} (${highLevelTotal ? Math.round((highLevelCorrect / highLevelTotal) * 100) : 0} %)`);
console.log(`Max. obtížnost: ${maxDifficultyLevel + 1}. úroveň`);
console.log(`Kombinované desetinná+zlomky (úroveň ${crossMixedDisplayLevel}+): ${crossMixedCount}`);
console.log('Typy úloh:', typeCounts);
console.log(`Odkaz: ${link}`);
