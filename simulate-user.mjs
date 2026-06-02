const DIFFICULTY_LEVELS = [
  { type: 'two', min: 0.1, max: 9.9, decimals: 1, decimalPartsSumBelowOne: true },
  { type: 'two', min: 0.1, max: 9.9, decimals: 1, decimalPartsSumAtLeastOne: true },
  { type: 'two', min: 0.01, max: 9.99, decimals: 2 },
  { type: 'three-one-decimal', min: 0.1, max: 9.9 },
  { type: 'three-mixed-decimals', min: 0.1, max: 9.9 },
];

const MAX_NON_MULTIPLY_LEVEL = 4;
const MAX_REGULAR_MULTIPLY_LEVEL = 4;
const MAX_REGULAR_DIVIDE_LEVEL = 4;
const POWER_TEN_BASE_INDEX = 5;
const POWER_TEN_MULTIPLIERS = [10, 100, 1000];
const MULTI_OP_MIXED_START_LEVEL = 4;
const MULTI_OP_EXTRA_MIXED_START_LEVEL = 5;

const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const MIXED_OPERATOR_RATE = 0.8;
const PARENTHESES_RATE = 0.5;
const TOTAL_ANSWERS = 50;
const CORRECT_RATE = 0.8;
const SEED = 42;

const VALID_OPERATIONS = ['add', 'subtract', 'multiply', 'divide', 'power-ten', 'divide-power-ten'];
const modeArg = process.argv[2] || 'add';
const selectedOperations = modeArg.split(',')
  .map((item) => item.trim())
  .filter((item) => VALID_OPERATIONS.includes(item));

if (selectedOperations.length === 0) {
  selectedOperations.push('add');
}

function getRegularOperations(selected = selectedOperations) {
  return selected.filter((operation) => operation !== 'power-ten' && operation !== 'divide-power-ten');
}

function operationFromOperators(operators) {
  if (operators.every((op) => op === operators[0])) {
    return operators[0];
  }

  return 'mixed';
}

function isPowerTenProblem(problem) {
  return problem.operation === 'multiply'
    && problem.operands.length === 2
    && POWER_TEN_MULTIPLIERS.includes(problem.operands[1].value);
}

function isDividePowerTenProblem(problem) {
  return problem.operation === 'divide'
    && problem.operands.length === 2
    && POWER_TEN_MULTIPLIERS.includes(problem.operands[1].value);
}

function getDisplayLevel(problem) {
  if (isPowerTenProblem(problem) || isDividePowerTenProblem(problem)) {
    return POWER_TEN_MULTIPLIERS.indexOf(problem.operands[1].value) + 1;
  }

  return problem.level;
}

function operationLabel(problem) {
  if (problem.operation === 'mixed') return 'smíšené';
  if (isDividePowerTenProblem(problem)) return 'dělení 10, 100 a 1000';
  if (isPowerTenProblem(problem)) return 'násobení 10, 100 a 1000';
  if (problem.operation === 'subtract') return 'odčítání';
  if (problem.operation === 'multiply') return 'násobení';
  if (problem.operation === 'divide') return 'dělení';
  return 'sčítání';
}

function formatOperatorSymbol(op) {
  if (op === 'subtract') return ' − ';
  if (op === 'multiply') return ' · ';
  if (op === 'divide') return ' : ';
  return ' + ';
}

function getMaxDifficultyLevel() {
  if (selectedOperations.length === 1) {
    const regularOps = getRegularOperations();

    if (regularOps.length === 0) {
      return POWER_TEN_MULTIPLIERS.length - 1;
    }

    if (regularOps[0] === 'multiply') {
      return MAX_REGULAR_MULTIPLY_LEVEL;
    }

    if (regularOps[0] === 'divide') {
      return MAX_REGULAR_DIVIDE_LEVEL;
    }

    return MAX_NON_MULTIPLY_LEVEL;
  }

  if (getRegularOperations().length >= 3) {
    return MULTI_OP_EXTRA_MIXED_START_LEVEL + 1;
  }

  return MULTI_OP_MIXED_START_LEVEL;
}

function pickRandomItem(items) {
  return items[Math.floor(random() * items.length)];
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

  if (validGroups.length === 0 || random() >= PARENTHESES_RATE) {
    return null;
  }

  return pickRandomItem(validGroups);
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

  if (random() < MIXED_OPERATOR_RATE) {
    return pickRandomItem(mixedPairs);
  }

  return pickRandomItem(purePairs);
}

function createRng(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}

const random = createRng(SEED);
const outcomeRandom = createRng(SEED + 999);

function randomDecimal(min, max, decimals) {
  const factor = 10 ** decimals;
  const minScaled = Math.round(min * factor);
  const maxScaled = Math.round(max * factor);
  const value = minScaled + Math.floor(random() * (maxScaled - minScaled + 1));
  return value / factor;
}

function randomWhole(min, max) {
  return min + Math.floor(random() * (max - min + 1));
}

function randomDecimalWithNonZeroHundredths(min, max) {
  return randomDecimalWithNonZeroLastDigit(min, max, 2);
}

function randomDecimalWithNonZeroLastDigit(min, max, decimals) {
  let value;

  do {
    value = randomDecimal(min, max, decimals);
  } while (Math.round(value * 10 ** decimals) % 10 === 0);

  return value;
}

function valueFitsDecimalPlaces(value, decimals) {
  return fromScaled(toScaled(value, decimals), decimals) === value;
}

function valueHasNonZeroTenths(value) {
  return getFractionalPart(value, 1) > 0;
}

function formatDecimal(value, decimals) {
  return value.toFixed(decimals).replace('.', ',');
}

function roundToDecimals(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function toScaled(value, decimals) {
  return Math.round(value * 10 ** decimals);
}

function fromScaled(scaled, decimals) {
  return scaled / 10 ** decimals;
}

function buildExactDivideFromAnswer(
  divisorValue,
  divisorDecimals,
  answerValue,
  answerDecimals,
  level,
  dividendDisplayDecimals = null,
) {
  const fullDividendDecimals = divisorDecimals + answerDecimals;
  const dividendValue = fromScaled(
    toScaled(divisorValue, divisorDecimals) * toScaled(answerValue, answerDecimals),
    fullDividendDecimals,
  );
  const displayDecimals = dividendDisplayDecimals ?? fullDividendDecimals;
  const displayedDividendValue = fromScaled(toScaled(dividendValue, displayDecimals), displayDecimals);

  return buildProblem(
    [
      { value: displayedDividendValue, decimals: displayDecimals },
      { value: divisorValue, decimals: divisorDecimals },
    ],
    'divide',
    answerDecimals,
    level + 1,
    false,
    answerValue,
  );
}

function isValidDivideDivisor(operand) {
  const { value, decimals } = operand;

  if (value === 1) {
    return false;
  }

  if (decimals === 0 && Number.isInteger(value) && value >= 2 && value <= 9) {
    return true;
  }

  if (decimals === 1 && value >= 0.1 && value < 1) {
    return true;
  }

  return false;
}

function randomDivideDivisorWhole() {
  return { value: randomWhole(2, 9), decimals: 0 };
}

function randomDivideDivisorDecimal() {
  return { value: randomDecimal(0.1, 0.9, 1), decimals: 1 };
}

function randomDivideDivisor(useDecimal = random() < 0.5) {
  return useDecimal ? randomDivideDivisorDecimal() : randomDivideDivisorWhole();
}

function divideDivisorsAreValid(operands, operators) {
  if (operators[0] === 'divide' && !isValidDivideDivisor(operands[1])) {
    return false;
  }

  if (operators[1] === 'divide' && !isValidDivideDivisor(operands[2])) {
    return false;
  }

  return true;
}

function applyOperator(result, value, op) {
  if (op === 'add') {
    return result + value;
  }

  if (op === 'multiply') {
    return result * value;
  }

  if (op === 'divide') {
    return result / value;
  }

  return result - value;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    [x, y] = [y, x % y];
  }

  return x;
}

function applyRationalStep(num, den, operand, op) {
  const operandScaled = toScaled(operand.value, operand.decimals);
  const operandDen = 10 ** operand.decimals;

  if (op === 'add') {
    num = num * operandDen + operandScaled * den;
    den *= operandDen;
  } else if (op === 'subtract') {
    num = num * operandDen - operandScaled * den;
    den *= operandDen;
  } else if (op === 'multiply') {
    num *= operandScaled;
    den *= operandDen;
  } else if (op === 'divide') {
    num *= operandDen;
    den *= operandScaled;
  }

  const common = gcd(num, den);
  return [num / common, den / common];
}

function combineFractions(aNum, aDen, bNum, bDen, op) {
  let num;
  let den;

  if (op === 'add') {
    num = aNum * bDen + bNum * aDen;
    den = aDen * bDen;
  } else if (op === 'subtract') {
    num = aNum * bDen - bNum * aDen;
    den = aDen * bDen;
  } else if (op === 'multiply') {
    num = aNum * bNum;
    den = aDen * bDen;
  } else if (op === 'divide') {
    num = aNum * bDen;
    den = aDen * bNum;
  }

  const common = gcd(num, den);
  return [num / common, den / common];
}

function finalizeRationalAnswer(num, den, answerDecimals) {
  const scaledAtAnswer = num * 10 ** answerDecimals;
  if (scaledAtAnswer % den !== 0) {
    return null;
  }

  return fromScaled(scaledAtAnswer / den, answerDecimals);
}

function computeExactAnswerRational(operands, operators, answerDecimals, parenthesesGroup = null) {
  const resolvedOperators = Array.isArray(operators)
    ? operators
    : Array(operands.length - 1).fill(operators);

  if (operands.length === 2) {
    const [num, den] = combineFractions(
      toScaled(operands[0].value, operands[0].decimals),
      10 ** operands[0].decimals,
      toScaled(operands[1].value, operands[1].decimals),
      10 ** operands[1].decimals,
      resolvedOperators[0],
    );

    return finalizeRationalAnswer(num, den, answerDecimals);
  }

  if (operands.length !== 3) {
    return null;
  }

  const evaluationGroup = resolveEvaluationGroup(resolvedOperators, parenthesesGroup);

  let num;
  let den;

  if (evaluationGroup === 1) {
    [num, den] = combineFractions(
      toScaled(operands[1].value, operands[1].decimals),
      10 ** operands[1].decimals,
      toScaled(operands[2].value, operands[2].decimals),
      10 ** operands[2].decimals,
      resolvedOperators[1],
    );

    [num, den] = combineFractions(
      toScaled(operands[0].value, operands[0].decimals),
      10 ** operands[0].decimals,
      num,
      den,
      resolvedOperators[0],
    );
  } else {
    [num, den] = combineFractions(
      toScaled(operands[0].value, operands[0].decimals),
      10 ** operands[0].decimals,
      toScaled(operands[1].value, operands[1].decimals),
      10 ** operands[1].decimals,
      resolvedOperators[0],
    );

    [num, den] = combineFractions(
      num,
      den,
      toScaled(operands[2].value, operands[2].decimals),
      10 ** operands[2].decimals,
      resolvedOperators[1],
    );
  }

  return finalizeRationalAnswer(num, den, answerDecimals);
}

function computeExactDivide(dividendOperand, divisorOperand, answerDecimals) {
  const dividendScaled = toScaled(dividendOperand.value, dividendOperand.decimals);
  const divisorScaled = toScaled(divisorOperand.value, divisorOperand.decimals);
  const numerator = dividendScaled * 10 ** (divisorOperand.decimals + answerDecimals);
  const denominator = divisorScaled * 10 ** dividendOperand.decimals;

  return fromScaled(numerator / denominator, answerDecimals);
}

function computeAnswer(operands, operators, answerDecimals, parenthesesGroup = null) {
  const resolvedOperators = Array.isArray(operators)
    ? operators
    : Array(operands.length - 1).fill(operators);
  const evaluationGroup = resolveEvaluationGroup(resolvedOperators, parenthesesGroup);

  const exactAnswer = computeExactAnswerRational(
    operands,
    resolvedOperators,
    answerDecimals,
    parenthesesGroup,
  );
  if (exactAnswer !== null) {
    return exactAnswer;
  }

  const factor = 10 ** answerDecimals;
  let result;

  if (operands.length === 2) {
    result = applyOperator(operands[0].value, operands[1].value, resolvedOperators[0]);
    return Math.round(result * factor) / factor;
  }

  if (evaluationGroup === 1) {
    const inner = applyOperator(
      operands[1].value,
      operands[2].value,
      resolvedOperators[1],
    );
    result = applyOperator(operands[0].value, inner, resolvedOperators[0]);
  } else {
    const inner = applyOperator(
      operands[0].value,
      operands[1].value,
      resolvedOperators[0],
    );
    result = applyOperator(inner, operands[2].value, resolvedOperators[1]);
  }

  return Math.round(result * factor) / factor;
}

function getFractionalPart(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) % factor;
}

function decimalPartsSumBelowOne(a, b, decimals) {
  return getFractionalPart(a, decimals) + getFractionalPart(b, decimals) < 10 ** decimals;
}

function decimalPartsDiffNoBorrow(a, b, decimals) {
  return getFractionalPart(a, decimals) >= getFractionalPart(b, decimals);
}

function matchesTwoOperandConstraints(a, b, config, operation) {
  if (operation === 'add') {
    const belowOne = decimalPartsSumBelowOne(a, b, config.decimals);
    if (config.decimalPartsSumBelowOne && !belowOne) return false;
    if (config.decimalPartsSumAtLeastOne && belowOne) return false;
    return true;
  }

  if (operation === 'subtract') {
    const noBorrow = decimalPartsDiffNoBorrow(a, b, config.decimals);
    if (config.decimalPartsSumBelowOne && !noBorrow) return false;
    if (config.decimalPartsSumAtLeastOne && noBorrow) return false;
    return true;
  }

  return true;
}

function createMultiplyByPowerOfTen(level, multiplier) {
  const maxOperandDecimals = Math.log10(multiplier);
  const operandDecimals = Math.floor(random() * (maxOperandDecimals + 1));

  const value = operandDecimals === 0
    ? randomWhole(1, 99)
    : randomDecimal(10 ** -operandDecimals, (10 ** maxOperandDecimals - 1) / 10 ** operandDecimals, operandDecimals);

  const answerDecimals = Math.max(0, operandDecimals - maxOperandDecimals);

  return buildProblem(
    [
      { value, decimals: operandDecimals },
      { value: multiplier, decimals: 0 },
    ],
    'multiply',
    answerDecimals,
    level + 1,
  );
}

function createDivideByPowerOfTen(level, divisor) {
  const power = Math.log10(divisor);
  const dividendDecimals = Math.floor(random() * (power + 1));

  const value = dividendDecimals === 0
    ? randomWhole(1, 99)
    : randomDecimal(10 ** -dividendDecimals, (10 ** power - 1) / 10 ** dividendDecimals, dividendDecimals);

  const answerDecimals = dividendDecimals + power;
  const answerValue = fromScaled(toScaled(value, dividendDecimals), answerDecimals);

  return buildExactDivideFromAnswer(divisor, 0, answerValue, answerDecimals, level, dividendDecimals);
}

function createMultiplyProblem(level) {
  switch (level) {
    case 0:
      return buildProblem(
        [
          { value: randomDecimal(0.1, 0.9, 1), decimals: 1 },
          { value: randomWhole(1, 9), decimals: 0 },
        ],
        'multiply',
        1,
        level + 1,
      );
    case 1:
      return buildProblem(
        [
          { value: randomDecimal(1.0, 9.9, 1), decimals: 1 },
          { value: randomWhole(1, 9), decimals: 0 },
        ],
        'multiply',
        1,
        level + 1,
      );
    case 2:
      return buildProblem(
        [
          { value: randomDecimal(0.1, 0.9, 1), decimals: 1 },
          { value: randomDecimal(0.1, 0.9, 1), decimals: 1 },
        ],
        'multiply',
        2,
        level + 1,
      );
    case 3:
      return buildProblem(
        [
          { value: randomDecimal(1.0, 9.9, 1), decimals: 1 },
          { value: randomDecimal(0.1, 0.9, 1), decimals: 1 },
        ],
        'multiply',
        2,
        level + 1,
      );
    case 4: {
      const operands = Array.from({ length: 3 }, () => ({
        value: randomDecimal(0.1, 9.9, 1),
        decimals: 1,
      }));

      return buildProblem(operands, 'multiply', 2, level + 1);
    }
    default:
      return createMultiplyProblem(4);
  }
}

function createDivideProblem(level) {
  switch (level) {
    case 0: {
      let answerValue;
      let divisor;

      do {
        answerValue = roundToDecimals(randomWhole(1, 9) / 10, 1);
        divisor = randomWhole(2, 9);
      } while (toScaled(divisor, 0) * toScaled(answerValue, 1) < 1);

      return buildExactDivideFromAnswer(divisor, 0, answerValue, 1, level);
    }
    case 1: {
      let answerValue;
      let divisor;
      let dividendValue;
      let answerDecimals;
      let dividendDecimals;

      do {
        divisor = randomWhole(2, 9);
        const useHundredthsDividend = random() < 0.5;
        const answerMoreDecimalsThanDividend = random() < 0.5;

        dividendDecimals = useHundredthsDividend ? 2 : 1;
        answerDecimals = answerMoreDecimalsThanDividend
          ? dividendDecimals + 1
          : dividendDecimals;

        answerValue = randomDecimalWithNonZeroLastDigit(
          10 ** -answerDecimals,
          10 - 10 ** -answerDecimals,
          answerDecimals,
        );

        dividendValue = fromScaled(
          toScaled(divisor, 0) * toScaled(answerValue, answerDecimals),
          answerDecimals,
        );

        if (!valueFitsDecimalPlaces(dividendValue, dividendDecimals)) {
          continue;
        }
      } while (
        dividendValue === undefined
        || dividendValue <= divisor
        || dividendValue < 10
      );

      return buildExactDivideFromAnswer(
        divisor,
        0,
        answerValue,
        answerDecimals,
        level,
        dividendDecimals,
      );
    }
    case 2: {
      while (true) {
        const divisorValue = randomDecimal(0.1, 0.9, 1);
        const answerValue = randomDecimal(0.1, 9.9, 1);
        const dividendValue = fromScaled(
          toScaled(divisorValue, 1) * toScaled(answerValue, 1),
          2,
        );

        if (!valueFitsDecimalPlaces(dividendValue, 1)) {
          continue;
        }

        if (!valueHasNonZeroTenths(dividendValue)) {
          continue;
        }

        if (dividendValue <= divisorValue) {
          continue;
        }

        return buildExactDivideFromAnswer(divisorValue, 1, answerValue, 1, level, 1);
      }
    }
    case 3: {
      let answerValue;
      let divisorValue;
      let dividendValue;

      do {
        divisorValue = randomDecimal(0.1, 0.9, 1);
        answerValue = randomDecimalWithNonZeroHundredths(0.01, 9.99);
        const productScaled = toScaled(divisorValue, 1) * toScaled(answerValue, 2);
        if (productScaled % 10 !== 0) {
          continue;
        }

        dividendValue = fromScaled(productScaled, 3);
      } while (dividendValue === undefined || dividendValue <= divisorValue);

      return buildExactDivideFromAnswer(divisorValue, 1, answerValue, 2, level, 2);
    }
    case 4: {
      let answerValue;
      let divisorValue;
      let dividendValue;

      do {
        divisorValue = randomDecimal(0.1, 0.9, 1);
        answerValue = randomDecimal(0.1, 0.9, 1);
        dividendValue = fromScaled(toScaled(divisorValue, 1) * toScaled(answerValue, 1), 2);
      } while (dividendValue >= divisorValue);

      return buildExactDivideFromAnswer(divisorValue, 1, answerValue, 1, level);
    }
    default:
      return createDivideProblem(4);
  }
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

function buildProblem(
  operands,
  operators,
  answerDecimals,
  level,
  isRetry = false,
  exactAnswer = null,
  parenthesesGroup = null,
) {
  const resolvedOperators = Array.isArray(operators)
    ? operators
    : Array(operands.length - 1).fill(operators);
  const isMixed = resolvedOperators.length > 1 && resolvedOperators[0] !== resolvedOperators[1];
  const grouping = isMixed ? resolveParenthesesGroup(resolvedOperators, parenthesesGroup) : null;

  return {
    operands,
    operation: Array.isArray(operators) ? operationFromOperators(operators) : operators,
    operators: Array.isArray(operators) ? resolvedOperators : undefined,
    parenthesesGroup: grouping,
    answer: exactAnswer ?? computeAnswer(operands, resolvedOperators, answerDecimals, grouping),
    answerDecimals,
    level,
    isRetry,
  };
}

function createTwoOperandProblem(level, config, operation) {
  let a;
  let b;

  do {
    a = randomDecimal(config.min, config.max, config.decimals);
    b = randomDecimal(config.min, config.max, config.decimals);

    if (operation === 'subtract' && a < b) {
      [a, b] = [b, a];
    }
  } while (!matchesTwoOperandConstraints(a, b, config, operation));

  return buildProblem(
    [
      { value: a, decimals: config.decimals },
      { value: b, decimals: config.decimals },
    ],
    operation,
    config.decimals,
    level + 1,
  );
}

function getRestrictedOperandIndices(operators) {
  const indices = new Set();

  if (operators[0] === 'multiply' || operators[0] === 'divide') {
    indices.add(0);
    indices.add(1);
  }

  if (operators[1] === 'multiply' || operators[1] === 'divide') {
    indices.add(1);
    indices.add(2);
  }

  return indices;
}

function isValidCombinedFriendlyOperand(operand) {
  const { value } = operand;

  if (Number.isInteger(value) && value >= 1) {
    return true;
  }

  return value > 0 && value < 1;
}

function combinedFriendlyPairIsValid(operands, firstIndex, operator) {
  if (operator !== 'multiply' && operator !== 'divide') {
    return true;
  }

  return isValidCombinedFriendlyOperand(operands[firstIndex])
    || isValidCombinedFriendlyOperand(operands[firstIndex + 1]);
}

function combinedFriendlyPairsAreValid(operands, operators) {
  return combinedFriendlyPairIsValid(operands, 0, operators[0])
    && combinedFriendlyPairIsValid(operands, 1, operators[1]);
}

function divisorsAreNonZero(operands, operators) {
  if (operators[0] === 'divide' && operands[1].value === 0) {
    return false;
  }

  if (operators[1] === 'divide' && operands[2].value === 0) {
    return false;
  }

  return true;
}

function isThreeOperandProblemValid(
  operands,
  operators,
  answer,
  combinedMode,
  answerDecimals,
  parenthesesGroup = null,
) {
  if (answer < 0 || !Number.isFinite(answer)) {
    return false;
  }

  if (computeExactAnswerRational(operands, operators, answerDecimals, parenthesesGroup) === null) {
    return false;
  }

  if (!divisorsAreNonZero(operands, operators)) {
    return false;
  }

  if (!divideDivisorsAreValid(operands, operators)) {
    return false;
  }

  if (combinedMode && (operators.includes('multiply') || operators.includes('divide'))
    && !combinedFriendlyPairsAreValid(operands, operators)) {
    return false;
  }

  return true;
}

function randomCombinedFriendlyOperand() {
  if (random() < 0.5) {
    return { value: randomWhole(1, 9), decimals: 0 };
  }

  return { value: randomDecimal(0.1, 0.9, 1), decimals: 1 };
}

function randomOneDecimalOperand(config) {
  return {
    value: randomDecimal(config.min, config.max, 1),
    decimals: 1,
  };
}

function fillCombinedFriendlyPair(operands, firstIndex, config) {
  if (random() < 0.5) {
    operands[firstIndex] = randomCombinedFriendlyOperand();
    operands[firstIndex + 1] = randomOneDecimalOperand(config);
    return;
  }

  operands[firstIndex] = randomOneDecimalOperand(config);
  operands[firstIndex + 1] = randomCombinedFriendlyOperand();
}

function fillCombinedDividePair(operands, firstIndex, config) {
  let divisorOperand;
  let answerValue;
  let dividendValue;

  do {
    divisorOperand = randomDivideDivisor();
    answerValue = randomDecimal(0.1, 0.9, 1);
    dividendValue = fromScaled(
      toScaled(divisorOperand.value, divisorOperand.decimals) * toScaled(answerValue, 1),
      divisorOperand.decimals + 1,
    );
  } while (dividendValue >= divisorOperand.value);

  operands[firstIndex + 1] = divisorOperand;
  operands[firstIndex] = {
    value: dividendValue,
    decimals: divisorOperand.decimals + 1,
  };
}

function applyCombinedFriendlyRules(operands, operators, config) {
  if (operators[0] === 'multiply' && operators[1] !== 'multiply') {
    fillCombinedFriendlyPair(operands, 0, config);
  } else if (operators[0] === 'divide' && operators[1] !== 'divide') {
    fillCombinedDividePair(operands, 0, config);
  }

  if (operators[1] === 'multiply' && operators[0] !== 'multiply') {
    fillCombinedFriendlyPair(operands, 1, config);
  } else if (operators[1] === 'divide' && operators[0] !== 'divide') {
    fillCombinedDividePair(operands, 1, config);
  }
}

function createThreeOneDecimalProblem(level, config, operators, combinedMode = false) {
  let operands;
  let answer;
  let parenthesesGroup;

  do {
    operands = Array.from({ length: 3 }, () => randomOneDecimalOperand(config));
    parenthesesGroup = pickParenthesesGroup(operators);

    if (combinedMode) {
      applyCombinedFriendlyRules(operands, operators, config);
    }

    answer = computeAnswer(operands, operators, 1, parenthesesGroup);
  } while (!isThreeOperandProblemValid(operands, operators, answer, combinedMode, 1, parenthesesGroup));

  return buildProblem(operands, operators, 1, level + 1, false, null, parenthesesGroup);
}

function createThreeMixedDecimalProblem(level, config, operators, combinedMode = false) {
  let operands;
  let answer;
  let parenthesesGroup;
  const restrictedIndices = combinedMode && (operators.includes('multiply') || operators.includes('divide'))
    ? getRestrictedOperandIndices(operators)
    : new Set();

  do {
    const eligibleForTwoDecimals = [0, 1, 2].filter((index) => !restrictedIndices.has(index));
    const twoDecimalCount = eligibleForTwoDecimals.length === 0
      ? 0
      : Math.min(random() < 0.5 ? 1 : 2, eligibleForTwoDecimals.length);
    const shuffledIndices = [...eligibleForTwoDecimals].sort(() => random() - 0.5);
    const twoDecimalIndices = new Set(shuffledIndices.slice(0, twoDecimalCount));

    operands = [0, 1, 2].map((index) => {
      if (twoDecimalIndices.has(index)) {
        return {
          value: randomDecimal(0.01, 9.99, 2),
          decimals: 2,
        };
      }

      return randomOneDecimalOperand(config);
    });

    parenthesesGroup = pickParenthesesGroup(operators);

    if (combinedMode) {
      applyCombinedFriendlyRules(operands, operators, config);
    }

    answer = computeAnswer(operands, operators, 2, parenthesesGroup);
  } while (!isThreeOperandProblemValid(operands, operators, answer, combinedMode, 2, parenthesesGroup));

  return buildProblem(operands, operators, 2, level + 1, false, null, parenthesesGroup);
}

function createSingleOperationProblem(operation, level) {
  if (operation === 'power-ten') {
    const clampedLevel = Math.min(level, POWER_TEN_MULTIPLIERS.length - 1);
    return createMultiplyByPowerOfTen(
      POWER_TEN_BASE_INDEX + clampedLevel,
      POWER_TEN_MULTIPLIERS[clampedLevel],
    );
  }

  if (operation === 'divide-power-ten') {
    const clampedLevel = Math.min(level, POWER_TEN_MULTIPLIERS.length - 1);
    return createDivideByPowerOfTen(
      POWER_TEN_BASE_INDEX + clampedLevel,
      POWER_TEN_MULTIPLIERS[clampedLevel],
    );
  }

  if (operation === 'multiply') {
    return createMultiplyProblem(Math.min(level, MAX_REGULAR_MULTIPLY_LEVEL));
  }

  if (operation === 'divide') {
    return createDivideProblem(Math.min(level, MAX_REGULAR_DIVIDE_LEVEL));
  }

  const config = DIFFICULTY_LEVELS[Math.min(level, MAX_NON_MULTIPLY_LEVEL)];

  switch (config.type) {
    case 'three-one-decimal':
      return createThreeOneDecimalProblem(level, config, [operation, operation]);
    case 'three-mixed-decimals':
      return createThreeMixedDecimalProblem(level, config, [operation, operation]);
    default:
      return createTwoOperandProblem(level, config, operation);
  }
}

function createMultiOperationProblem(selected, level) {
  const regularOps = getRegularOperations(selected);
  const hasPowerTen = selected.includes('power-ten');
  const hasDividePowerTen = selected.includes('divide-power-ten');

  if (level < 3) {
    const pool = [...regularOps];
    if (hasPowerTen) {
      pool.push('power-ten');
    }
    if (hasDividePowerTen) {
      pool.push('divide-power-ten');
    }

    const operation = pickRandomItem(pool);

    if (operation === 'power-ten') {
      const powerLevel = Math.min(level, POWER_TEN_MULTIPLIERS.length - 1);
      return createMultiplyByPowerOfTen(
        POWER_TEN_BASE_INDEX + powerLevel,
        POWER_TEN_MULTIPLIERS[powerLevel],
      );
    }

    if (operation === 'divide-power-ten') {
      const powerLevel = Math.min(level, POWER_TEN_MULTIPLIERS.length - 1);
      return createDivideByPowerOfTen(
        POWER_TEN_BASE_INDEX + powerLevel,
        POWER_TEN_MULTIPLIERS[powerLevel],
      );
    }

    if (operation === 'multiply') {
      return createMultiplyProblem(Math.min(level, 2));
    }

    if (operation === 'divide') {
      return createDivideProblem(Math.min(level, 2));
    }

    const config = DIFFICULTY_LEVELS[level];
    return createTwoOperandProblem(level, config, operation);
  }

  if (level === 3) {
    const operation = pickRandomItem(regularOps);
    return createThreeOneDecimalProblem(level, DIFFICULTY_LEVELS[3], [operation, operation], true);
  }

  const operators = pickOperatorsForLevel(level, regularOps);

  if (level >= MULTI_OP_EXTRA_MIXED_START_LEVEL) {
    return createThreeMixedDecimalProblem(level, DIFFICULTY_LEVELS[4], operators, true);
  }

  return createThreeOneDecimalProblem(level, DIFFICULTY_LEVELS[3], operators, true);
}

function createRandomProblem(level) {
  if (selectedOperations.length === 1) {
    return createSingleOperationProblem(selectedOperations[0], level);
  }

  return createMultiOperationProblem(selectedOperations, level);
}

function formatThreeOperandExpression(problem) {
  const a = formatDecimal(problem.operands[0].value, problem.operands[0].decimals);
  const b = formatDecimal(problem.operands[1].value, problem.operands[1].decimals);
  const c = formatDecimal(problem.operands[2].value, problem.operands[2].decimals);
  const op1 = formatOperatorSymbol(problem.operators[0]);
  const op2 = formatOperatorSymbol(problem.operators[1]);

  if (problem.parenthesesGroup === 0) {
    return `(${a}${op1}${b})${op2}${c}`;
  }

  if (problem.parenthesesGroup === 1) {
    return `${a}${op1}(${b}${op2}${c})`;
  }

  return `${a}${op1}${b}${op2}${c}`;
}

function formatProblemText(problem) {
  if (problem.operators) {
    return `${formatThreeOperandExpression(problem)} = ?`;
  }

  const operator = formatOperatorSymbol(problem.operation);
  return `${problem.operands.map((o) => formatDecimal(o.value, o.decimals)).join(operator)} = ?`;
}

function wrongAnswer(correct, answerDecimals) {
  const step = 10 ** -answerDecimals;
  return Math.round((correct + step) * 10 ** answerDecimals) / 10 ** answerDecimals;
}

function simulate() {
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
      if (item.problemsRemaining > 0) item.problemsRemaining -= 1;
    });

    let problem;
    const dueRetry = retryQueue.find((item) => item.problemsRemaining <= 0);
    if (dueRetry) {
      retryQueue = retryQueue.filter((item) => item !== dueRetry);
      problem = {
        operands: dueRetry.operands.map((o) => ({ ...o })),
        operation: dueRetry.operation,
        operators: dueRetry.operators ? [...dueRetry.operators] : undefined,
        parenthesesGroup: dueRetry.parenthesesGroup ?? null,
        answer: dueRetry.answer,
        answerDecimals: dueRetry.answerDecimals,
        level: dueRetry.level,
        isRetry: true,
      };
    } else {
      problem = createRandomProblem(difficultyLevel);
    }

    const shouldBeCorrect = outcomePlan[i];
    const userAnswer = shouldBeCorrect
      ? problem.answer
      : wrongAnswer(problem.answer, problem.answerDecimals);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < getMaxDifficultyLevel()) {
        difficultyLevel += 1;
        correctStreak = 0;
      }
    } else {
      correctStreak = 0;
      if (difficultyLevel > 0) difficultyLevel -= 1;
      retryQueue.push({
        operands: problem.operands.map((o) => ({ ...o })),
        operation: problem.operation,
        operators: problem.operators ? [...problem.operators] : undefined,
        parenthesesGroup: problem.parenthesesGroup ?? null,
        answer: problem.answer,
        answerDecimals: problem.answerDecimals,
        level: problem.level,
        problemsRemaining: PROBLEMS_BEFORE_RETRY,
      });
    }

    results.push({
      cislo: i + 1,
      operace: operationLabel(problem),
      uloha: formatProblemText(problem),
      uroven: getDisplayLevel(problem),
      opakovani: problem.isRetry ? 'ano' : 'ne',
      spravnaOdpoved: formatDecimal(problem.answer, problem.answerDecimals),
      odpovedUzivatele: formatDecimal(userAnswer, problem.answerDecimals),
      vysledek: shouldBeCorrect ? 'správně' : 'špatně',
      aktivniObtiznostPo: difficultyLevel + 1,
    });
  }

  const correctCount = results.filter((r) => r.vysledek === 'správně').length;
  return { operations: selectedOperations, correctCount, total: TOTAL_ANSWERS, results };
}

const output = simulate();
console.log(JSON.stringify(output, null, 2));
