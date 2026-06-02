const problemEl = document.getElementById('problem');
const problemLevelEl = document.getElementById('problem-level');
const appTitleEl = document.getElementById('app-title');
const appEl = document.querySelector('.app');
const setupScreenEl = document.getElementById('setup-screen');
const setupFeedbackEl = document.getElementById('setup-feedback');
const exerciseScreenEl = document.getElementById('exercise-screen');
const analysisScreenEl = document.getElementById('analysis-screen');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const finishBtn = document.getElementById('finish-btn');
const analysisSummaryEl = document.getElementById('analysis-summary');
const analysisNameInputEl = document.getElementById('analysis-name-input');
const analysisNameDisplayEl = document.getElementById('analysis-name-display');
const analysisLevelsEl = document.getElementById('analysis-levels');
const analysisTableBodyEl = document.getElementById('analysis-table-body');
const analysisDownloadBtn = document.getElementById('analysis-download-btn');
const analysisLinkBtn = document.getElementById('analysis-link-btn');
const analysisLinkFeedbackEl = document.getElementById('analysis-link-feedback');
const analysisLinkWrapEl = document.getElementById('analysis-link-wrap');
const analysisLinkInputEl = document.getElementById('analysis-link-input');
const analysisLinkCopyBtn = document.getElementById('analysis-link-copy-btn');
const analysisBackBtn = document.getElementById('analysis-back-btn');
const formEl = document.getElementById('answer-form');
const inputEl = document.getElementById('answer-input');
const decimalAnswerWrapEl = document.getElementById('decimal-answer-wrap');
const fractionAnswerWrapEl = document.getElementById('fraction-answer-wrap');
const answerNumeratorEl = document.getElementById('answer-numerator');
const answerDenominatorEl = document.getElementById('answer-denominator');
const answerShapeToggleBtn = document.getElementById('answer-shape-toggle-btn');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const mathKeypadEl = document.getElementById('math-keypad');
const mathKeypadKeys = document.querySelectorAll('.math-keypad__key');
const operationCheckboxes = document.querySelectorAll('#decimal-operation-picker input[type="checkbox"]');
const fractionModeCheckboxes = document.querySelectorAll('#fraction-operation-picker input[type="checkbox"]');

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

const APP_TITLE = 'Procvičování matematiky';
const DECIMAL_APP_TITLE = 'Početní operace s desetinnými čísly';
const FRACTION_APP_TITLE = 'Početní operace se zlomky';
const BASIC_FORM_PRIMES = [2, 3, 5, 7];
const FRACTION_BASIC_FORM_MAX_LEVEL = 2;
const BASIC_FORM_MAX_BY_LEVEL = {
  1: 32,
  2: 56,
  3: 100,
};
const FRACTION_ADD_MAX_LEVEL = 3;
const FRACTION_ADD_LCM_MAX = 50;
const FRACTION_ADD_ANSWER_MAX = 100;
const FRACTION_SUBTRACT_MAX_LEVEL = 3;
const FRACTION_COMBINED_MAX_LEVEL = 4;
const FRACTION_MIXED_DISPLAY_LEVEL = 5;
const FRACTION_COMBINED_EXTRA_MAX_LEVEL = 5;
const FRACTION_COMBINED_EXTRA_MIXED_DISPLAY_LEVEL = 6;
const FRACTION_MULTIPLY_MAX_LEVEL = 4;
const FRACTION_MULTIPLY_LEVEL4_MAX_DEN = 24;
const FRACTION_MULTIPLY_LEVEL5_MAX_DEN = 24;
const FRACTION_DIVIDE_MAX_LEVEL = 3;
const FRACTION_DIVIDE_LEVEL3_MAX_DEN = 18;
const FRACTION_DIVIDE_LEVEL3_WHOLE_MAX = 24;
const FRACTION_DIVIDE_LEVEL4_MAX_DEN = 24;

let activeExerciseMode = 'decimal';
let difficultyLevel = 0;
let correctStreak = 0;
let retryQueue = [];
let currentProblem = null;
let sessionResults = [];
let viewingSharedAnalysis = false;
let activeFractionInputEl = null;
let fractionAnswerInputShape = 'fraction';

function getSelectedFractionModes() {
  return [...fractionModeCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function hasSetupSelection() {
  return getSelectedOperations().length > 0 || getSelectedFractionModes().length > 0;
}

function updateStartButton() {
  startBtn.disabled = !hasSetupSelection();
}

function getSelectedOperations() {
  return [...operationCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function getRegularOperations(selected = getSelectedOperations()) {
  return selected.filter((operation) => operation !== 'power-ten' && operation !== 'divide-power-ten');
}

function randomDecimal(min, max, decimals) {
  const factor = 10 ** decimals;
  const minScaled = Math.round(min * factor);
  const maxScaled = Math.round(max * factor);
  const value = minScaled + Math.floor(Math.random() * (maxScaled - minScaled + 1));
  return value / factor;
}

function randomWhole(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
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

function randomDivideDivisor(useDecimal = Math.random() < 0.5) {
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

function parseAnswer(text) {
  const normalized = text.trim().replace(',', '.');
  if (normalized === '' || Number.isNaN(Number(normalized))) {
    return null;
  }
  return Number(normalized);
}

function formatFraction(num, den) {
  return `${num}/${den}`;
}

const BASIC_FORM_REQUIRED_MESSAGE = 'Odpověď musí být zlomek v základním tvaru.';

function getBasicFormMaxValue(displayLevel) {
  return BASIC_FORM_MAX_BY_LEVEL[displayLevel] ?? BASIC_FORM_MAX_BY_LEVEL[3];
}

function getFractionAnswerMaxValue() {
  if (currentProblem?.type === 'basic-form') {
    return getBasicFormMaxValue(getDisplayLevel(currentProblem));
  }

  if (currentProblem?.type === 'fraction-add'
    || currentProblem?.type === 'fraction-subtract'
    || currentProblem?.type === 'fraction-mixed'
    || currentProblem?.type === 'fraction-multiply'
    || currentProblem?.type === 'fraction-divide') {
    return FRACTION_ADD_ANSWER_MAX;
  }

  return BASIC_FORM_MAX_BY_LEVEL[3];
}

function isFractionAnswerProblem(problem) {
  return problem?.type === 'basic-form'
    || problem?.type === 'fraction-add'
    || problem?.type === 'fraction-subtract'
    || problem?.type === 'fraction-mixed'
    || problem?.type === 'fraction-multiply'
    || problem?.type === 'fraction-divide';
}

function getSelectedFractionOperations(selected = getSelectedFractionModes()) {
  const operations = [];

  if (selected.includes('fraction-add')) {
    operations.push('add');
  }

  if (selected.includes('fraction-subtract')) {
    operations.push('subtract');
  }

  if (selected.includes('fraction-multiply')) {
    operations.push('multiply');
  }

  if (selected.includes('fraction-divide')) {
    operations.push('divide');
  }

  return operations;
}

function hasMultipleFractionOperations(selected = getSelectedFractionModes()) {
  return getSelectedFractionOperations(selected).length >= 2;
}

function getFractionCombinedMaxLevel(selectedOps = getSelectedFractionOperations()) {
  if (selectedOps.length >= 3) {
    return FRACTION_COMBINED_EXTRA_MAX_LEVEL;
  }

  return FRACTION_COMBINED_MAX_LEVEL;
}

function resolveActiveExerciseMode() {
  if (getSelectedOperations().length > 0) {
    return 'decimal';
  }

  const modes = getSelectedFractionModes();
  if (modes.includes('basic-form')) {
    return 'basic-form';
  }

  if (hasMultipleFractionOperations(modes)) {
    return 'fraction-combined';
  }

  if (modes.includes('fraction-add')) {
    return 'fraction-add';
  }

  if (modes.includes('fraction-subtract')) {
    return 'fraction-subtract';
  }

  if (modes.includes('fraction-multiply')) {
    return 'fraction-multiply';
  }

  if (modes.includes('fraction-divide')) {
    return 'fraction-divide';
  }

  return 'decimal';
}

function parseFractionAnswerFromFields(numeratorText, denominatorText) {
  const numText = numeratorText.trim();
  const denText = denominatorText.trim();
  const maxValue = getFractionAnswerMaxValue();

  if (!/^\d+$/.test(numText) || !/^\d+$/.test(denText)) {
    return null;
  }

  const num = Number(numText);
  const den = Number(denText);
  if (den === 0 || num > maxValue || den > maxValue) {
    return null;
  }

  return { num, den };
}

function getFractionAnswerFromInputs() {
  return parseFractionAnswerFromFields(answerNumeratorEl.value, answerDenominatorEl.value);
}

function isBasicFormFraction(num, den) {
  return gcd(num, den) === 1;
}

function isFractionExerciseMode() {
  return activeExerciseMode !== 'decimal';
}

function fractionAnswersMatch(userFraction, correctFraction) {
  return userFraction.num === correctFraction.num && userFraction.den === correctFraction.den;
}

function isFractionAnswerInputShape() {
  return isFractionExerciseMode() && fractionAnswerInputShape === 'fraction';
}

function isNumberAnswerInputShape() {
  return isFractionExerciseMode() && fractionAnswerInputShape === 'number';
}

function getFractionAnswerDecimals(num, den, maxDecimals = 6) {
  for (let decimals = 0; decimals <= maxDecimals; decimals += 1) {
    if (Math.abs(roundToDecimals(num / den, decimals) * den - num) < 1e-9) {
      return decimals;
    }
  }

  return maxDecimals;
}

function numericAnswerMatchesFraction(userValue, num, den) {
  return Math.abs(userValue * den - num) < 1e-9;
}

function countPrimeFactorsWithMultiplicity(value) {
  let count = 0;
  let remaining = value;

  for (const prime of BASIC_FORM_PRIMES) {
    while (remaining % prime === 0) {
      count += 1;
      remaining /= prime;
    }
  }

  return count;
}

function isProductOfBasicFormPrimes(value) {
  if (!Number.isInteger(value) || value <= 0) {
    return false;
  }

  let remaining = value;

  for (const prime of BASIC_FORM_PRIMES) {
    while (remaining % prime === 0) {
      remaining /= prime;
    }
  }

  return remaining === 1;
}

function pickTargetFactorCountsForLevel(difficultyLevel) {
  if (difficultyLevel === 0) {
    return { numCount: 2, denCount: 2 };
  }

  if (difficultyLevel === 1) {
    return {
      numCount: randomWhole(3, 4),
      denCount: randomWhole(3, 4),
    };
  }

  return {
    numCount: randomWhole(4, 5),
    denCount: randomWhole(4, 5),
  };
}

function buildNumberWithFactorCount(targetCount, maxValue) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    let value = 1;
    let factorsPlaced = 0;

    for (let i = 0; i < targetCount; i += 1) {
      const available = BASIC_FORM_PRIMES.filter((prime) => value * prime <= maxValue);
      if (available.length === 0) {
        break;
      }

      value *= pickRandomItem(available);
      factorsPlaced += 1;
    }

    if (factorsPlaced === targetCount && countPrimeFactorsWithMultiplicity(value) === targetCount) {
      return value;
    }
  }

  const fallbacks = {
    2: 6,
    3: 8,
    4: 12,
    5: 32,
  };

  return fallbacks[targetCount] ?? 4;
}

function fitsBasicFormMaxValue(currentText, digit) {
  const nextValue = Number(currentText === '' ? digit : `${currentText}${digit}`);
  return nextValue <= getFractionAnswerMaxValue();
}

function factorCountsMatchLevel(numCount, denCount, difficultyLevel) {
  if (difficultyLevel === 0) {
    return numCount === 2 && denCount === 2;
  }

  if (difficultyLevel === 1) {
    return (numCount === 3 || numCount === 4)
      && (denCount === 3 || denCount === 4);
  }

  return (numCount === 4 || numCount === 5)
    && (denCount === 4 || denCount === 5);
}

function createBasicFormProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;
  const maxValue = getBasicFormMaxValue(displayLevel);
  const { numCount, denCount } = pickTargetFactorCountsForLevel(difficultyLevel);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const givenNum = buildNumberWithFactorCount(numCount, maxValue);
    const givenDen = buildNumberWithFactorCount(denCount, maxValue);

    if (givenNum >= givenDen) {
      continue;
    }

    if (givenNum > maxValue || givenDen > maxValue) {
      continue;
    }

    if (!isProductOfBasicFormPrimes(givenNum) || !isProductOfBasicFormPrimes(givenDen)) {
      continue;
    }

    const actualNumCount = countPrimeFactorsWithMultiplicity(givenNum);
    const actualDenCount = countPrimeFactorsWithMultiplicity(givenDen);

    if (!factorCountsMatchLevel(actualNumCount, actualDenCount, difficultyLevel)) {
      continue;
    }

    const common = gcd(givenNum, givenDen);
    if (common === 1) {
      continue;
    }

    const answerNum = givenNum / common;
    const answerDen = givenDen / common;

    if (gcd(answerNum, answerDen) !== 1) {
      continue;
    }

    if (answerNum > maxValue || answerDen > maxValue) {
      continue;
    }

    return {
      type: 'basic-form',
      givenNum,
      givenDen,
      answerNum,
      answerDen,
      level: displayLevel,
      isRetry: false,
    };
  }

  const fallbacks = [
    { givenNum: 4, givenDen: 6, answerNum: 2, answerDen: 3 },
    { givenNum: 8, givenDen: 12, answerNum: 2, answerDen: 3 },
    { givenNum: 32, givenDen: 48, answerNum: 2, answerDen: 3 },
  ];

  const fallback = fallbacks[Math.min(difficultyLevel, fallbacks.length - 1)];

  return {
    type: 'basic-form',
    givenNum: fallback.givenNum,
    givenDen: fallback.givenDen,
    answerNum: fallback.answerNum,
    answerDen: fallback.answerDen,
    level: displayLevel,
    isRetry: false,
  };
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

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function randomProperFraction(maxDen = 12) {
  const den = randomWhole(2, maxDen);
  const num = randomWhole(1, den - 1);
  return { num, den };
}

function sumFractionTerms(terms, wholeAddend = null) {
  let resultNum = 0;
  let resultDen = 1;

  terms.forEach(({ num, den }) => {
    resultNum = resultNum * den + num * resultDen;
    resultDen = resultDen * den;
  });

  if (wholeAddend != null) {
    resultNum += wholeAddend * resultDen;
  }

  const common = gcd(resultNum, resultDen);
  return { num: resultNum / common, den: resultDen / common };
}

function buildFractionAddProblem(terms, wholeAddend, displayLevel) {
  const answer = sumFractionTerms(terms, wholeAddend);

  return {
    type: 'fraction-add',
    terms,
    wholeAddend,
    answerNum: answer.num,
    answerDen: answer.den,
    level: displayLevel,
    isRetry: false,
  };
}

function generateLevel2Denominators() {
  if (Math.random() < 0.5) {
    const base = randomWhole(2, 12);
    const maxFactor = Math.min(4, Math.floor(24 / base));
    const factor = randomWhole(2, maxFactor);
    return [base, base * factor];
  }

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const den1 = randomWhole(2, 15);
    const den2 = randomWhole(2, 15);
    if (den1 === den2) {
      continue;
    }
    if (gcd(den1, den2) !== 1) {
      continue;
    }
    if (lcm(den1, den2) > FRACTION_ADD_LCM_MAX) {
      continue;
    }
    return [den1, den2];
  }

  return [3, 5];
}

function generateLevel3Denominators() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const den1 = randomWhole(4, 18);
    const den2 = randomWhole(4, 18);
    if (den1 === den2) {
      continue;
    }
    if (den1 % den2 === 0 || den2 % den1 === 0) {
      continue;
    }
    if (gcd(den1, den2) <= 1) {
      continue;
    }
    return [den1, den2];
  }

  return [6, 10];
}

function generateTwoFractionTermsForLevel(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    let den1;
    let den2;

    if (displayLevel === 1) {
      den1 = randomWhole(2, 12);
      den2 = den1;
    } else if (displayLevel === 2) {
      [den1, den2] = generateLevel2Denominators();
    } else if (displayLevel === 3) {
      [den1, den2] = generateLevel3Denominators();
  } else {
      return null;
    }

    const num1 = randomWhole(1, den1 - 1);
    const num2 = randomWhole(1, den2 - 1);
    const terms = [{ num: num1, den: den1 }, { num: num2, den: den2 }];
    const answer = sumFractionTerms(terms);

    if (displayLevel === 1 && gcd(num1 + num2, den1) !== 1) {
      continue;
    }

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    return terms;
  }

  return null;
}

function createFractionAddLevel4Problem() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (Math.random() < 0.5) {
      const terms = [
        randomProperFraction(12),
        randomProperFraction(12),
        randomProperFraction(12),
      ];
      const answer = sumFractionTerms(terms);
      if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
        continue;
      }
      return buildFractionAddProblem(terms, null, 4);
    }

    const terms = [randomProperFraction(12)];
    const wholeAddend = randomWhole(1, 9);
    const answer = sumFractionTerms(terms, wholeAddend);
    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }
    return buildFractionAddProblem(terms, wholeAddend, 4);
  }

  return buildFractionAddProblem([{ num: 1, den: 4 }, { num: 1, den: 3 }, { num: 1, den: 6 }], null, 4);
}

function createFractionAddProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 4) {
    return createFractionAddLevel4Problem();
  }

  const terms = generateTwoFractionTermsForLevel(displayLevel);
  if (terms) {
    return buildFractionAddProblem(terms, null, displayLevel);
  }

  const fallbacks = {
    1: buildFractionAddProblem([{ num: 1, den: 5 }, { num: 2, den: 5 }], null, 1),
    2: buildFractionAddProblem([{ num: 1, den: 3 }, { num: 1, den: 6 }], null, 2),
    3: buildFractionAddProblem([{ num: 1, den: 6 }, { num: 1, den: 10 }], null, 3),
  };

  return fallbacks[displayLevel];
}

function subtractFractionTerms(terms, wholeSubtrahend = null) {
  let resultNum = terms[0].num;
  let resultDen = terms[0].den;

  for (let i = 1; i < terms.length; i += 1) {
    const { num, den } = terms[i];
    resultNum = resultNum * den - num * resultDen;
    resultDen = resultDen * den;
    const common = gcd(resultNum, resultDen);
    resultNum /= common;
    resultDen /= common;
  }

  if (wholeSubtrahend != null) {
    resultNum -= wholeSubtrahend * resultDen;
    const common = gcd(resultNum, resultDen);
    resultNum /= common;
    resultDen /= common;
  }

  if (resultNum <= 0) {
    return null;
  }

  return { num: resultNum, den: resultDen };
}

function buildFractionSubtractProblem(terms, wholeSubtrahend, displayLevel) {
  const answer = subtractFractionTerms(terms, wholeSubtrahend);
  if (!answer) {
    return null;
  }

  return {
    type: 'fraction-subtract',
    terms,
    wholeSubtrahend,
    wholeMinuend: null,
    answerNum: answer.num,
    answerDen: answer.den,
    level: displayLevel,
    isRetry: false,
  };
}

function buildWholeMinusFractionProblem(wholeMinuend, fraction, displayLevel) {
  const resultNum = wholeMinuend * fraction.den - fraction.num;
  const resultDen = fraction.den;
  const common = gcd(resultNum, resultDen);

  if (resultNum <= 0) {
    return null;
  }

  return {
    type: 'fraction-subtract',
    terms: [fraction],
    wholeSubtrahend: null,
    wholeMinuend,
    answerNum: resultNum / common,
    answerDen: resultDen / common,
    level: displayLevel,
    isRetry: false,
  };
}

function generateTwoFractionSubtractTermsForLevel(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    let den1;
    let den2;

    if (displayLevel === 1) {
      den1 = randomWhole(2, 12);
      den2 = den1;
    } else if (displayLevel === 2) {
      [den1, den2] = generateLevel2Denominators();
    } else if (displayLevel === 3) {
      [den1, den2] = generateLevel3Denominators();
    } else {
      return null;
    }

    const num1 = randomWhole(1, den1 - 1);
    const num2 = randomWhole(1, den2 - 1);
    if (num1 * den2 <= num2 * den1) {
      continue;
    }

    const terms = [{ num: num1, den: den1 }, { num: num2, den: den2 }];
    const answer = subtractFractionTerms(terms);

    if (!answer) {
      continue;
    }

    if (displayLevel === 1 && gcd(num1 - num2, den1) !== 1) {
      continue;
    }

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    return terms;
  }

  return null;
}

function createFractionSubtractLevel4Problem() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (Math.random() < 0.5) {
      const terms = [
        randomProperFraction(12),
        randomProperFraction(12),
        randomProperFraction(12),
      ];
      const answer = subtractFractionTerms(terms);
      if (!answer || answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
        continue;
      }
      return buildFractionSubtractProblem(terms, null, 4);
    }

    const fraction = randomProperFraction(12);
    const wholeMinuend = randomWhole(2, 9);
    const problem = buildWholeMinusFractionProblem(wholeMinuend, fraction, 4);
    if (!problem || problem.answerNum > FRACTION_ADD_ANSWER_MAX || problem.answerDen > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }
    return problem;
  }

  return buildFractionSubtractProblem([{ num: 5, den: 6 }, { num: 1, den: 6 }, { num: 1, den: 6 }], null, 4);
}

function createFractionSubtractProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 4) {
    return createFractionSubtractLevel4Problem();
  }

  const terms = generateTwoFractionSubtractTermsForLevel(displayLevel);
  if (terms) {
    return buildFractionSubtractProblem(terms, null, displayLevel);
  }

  const fallbacks = {
    1: buildFractionSubtractProblem([{ num: 4, den: 5 }, { num: 1, den: 5 }], null, 1),
    2: buildFractionSubtractProblem([{ num: 2, den: 3 }, { num: 1, den: 6 }], null, 2),
    3: buildFractionSubtractProblem([{ num: 5, den: 6 }, { num: 1, den: 10 }], null, 3),
  };

  return fallbacks[displayLevel];
}

function applyFractionBinaryOperation(left, right, operator) {
  if (operator === 'add') {
    return sumFractionTerms([left, right]);
  }

  if (operator === 'subtract') {
    return subtractFractionTerms([left, right]);
  }

  if (operator === 'multiply') {
    return reduceFraction(left.num * right.num, left.den * right.den);
  }

  if (operator === 'divide') {
    const raw = divideFractionByFraction(left, right);
    return reduceFraction(raw.num, raw.den);
  }

  return null;
}

function evaluateFractionExpression(terms, operators, parenthesesGroup = null) {
  const evaluationGroup = resolveEvaluationGroup(operators, parenthesesGroup);

  if (evaluationGroup === 1) {
    const inner = applyFractionBinaryOperation(terms[1], terms[2], operators[1]);
    if (!inner || inner.num <= 0) {
      return null;
    }

    const result = applyFractionBinaryOperation(terms[0], inner, operators[0]);
    if (!result || result.num <= 0) {
      return null;
    }

    return reduceFraction(result.num, result.den);
  }

  const inner = applyFractionBinaryOperation(terms[0], terms[1], operators[0]);
  if (!inner || inner.num <= 0) {
    return null;
  }

  const result = applyFractionBinaryOperation(inner, terms[2], operators[1]);
  if (!result || result.num <= 0) {
    return null;
  }

  return reduceFraction(result.num, result.den);
}

function evaluateMixedFractionTerms(terms, operators) {
  return evaluateFractionExpression(terms, operators);
}

function isProperFraction({ num, den }) {
  return num > 0 && num < den;
}

function isUnitFraction({ num, den }) {
  return num === den;
}

function generateFractionParenthesisPair(innerOperator, maxDen) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const inner = randomProperFraction(maxDen);

    if (isUnitFraction(inner)) {
      continue;
    }

    if (innerOperator === 'add') {
      const first = randomProperFraction(maxDen);
      const second = subtractFractionTerms([inner, first]);

      if (!second || !isProperFraction(second)) {
        continue;
      }

      return [first, second];
    }

    if (innerOperator === 'subtract') {
      const subtrahend = randomProperFraction(maxDen);
      const minuend = sumFractionTerms([inner, subtrahend]);

      if (!isProperFraction(minuend) || !isProperFraction(subtrahend)) {
        continue;
      }

      return [minuend, subtrahend];
    }
  }

  return null;
}

function pickFractionCombinedOperators(difficultyLevel, selectedOps) {
  const displayLevel = difficultyLevel + 1;
  const mixedPairs = buildMixedOperatorPairs(selectedOps);

  if (selectedOps.length >= 3 && displayLevel >= FRACTION_COMBINED_EXTRA_MIXED_DISPLAY_LEVEL) {
    return mixedPairs.length > 0
      ? pickRandomItem(mixedPairs)
      : pickRandomItem(buildPureOperatorPairs(selectedOps));
  }

  return pickOperatorsForLevel(difficultyLevel, selectedOps);
}

function createFractionProblemForOperation(operation, difficultyLevel) {
  if (operation === 'add') {
    return createFractionAddProblem(difficultyLevel);
  }

  if (operation === 'subtract') {
    return createFractionSubtractProblem(difficultyLevel);
  }

  if (operation === 'multiply') {
    return createFractionMultiplyProblem(difficultyLevel);
  }

  return createFractionDivideProblem(difficultyLevel);
}

function shouldUseFractionCombinedMixedProblem(difficultyLevel, selectedOps) {
  const displayLevel = difficultyLevel + 1;

  if (selectedOps.length >= 3) {
    if (displayLevel >= FRACTION_COMBINED_EXTRA_MIXED_DISPLAY_LEVEL) {
      return true;
    }

    if (displayLevel === FRACTION_MIXED_DISPLAY_LEVEL) {
      return Math.random() < MIXED_OPERATOR_RATE;
    }

    return false;
  }

  return displayLevel >= FRACTION_MIXED_DISPLAY_LEVEL;
}

function createFractionCombinedMixedProblem(selectedOps, difficultyLevel) {
  const displayLevel = difficultyLevel + 1;
  const maxDen = displayLevel >= FRACTION_MIXED_DISPLAY_LEVEL ? 18 : 12;

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const operators = pickFractionCombinedOperators(difficultyLevel, selectedOps);
    const isMixed = operators[0] !== operators[1];
    const pickedParentheses = isMixed ? pickParenthesesGroup(operators) : null;
    const grouping = isMixed ? resolveParenthesesGroup(operators, pickedParentheses) : null;
    let terms;

    if (grouping === 0) {
      const pair = generateFractionParenthesisPair(operators[0], maxDen);
      if (!pair) {
        continue;
      }
      terms = [pair[0], pair[1], randomProperFraction(maxDen)];
    } else if (grouping === 1) {
      const pair = generateFractionParenthesisPair(operators[1], maxDen);
      if (!pair) {
        continue;
      }
      terms = [randomProperFraction(maxDen), pair[0], pair[1]];
    } else {
      terms = [
        randomProperFraction(maxDen),
        randomProperFraction(maxDen),
        randomProperFraction(maxDen),
      ];
    }

    const answer = evaluateFractionExpression(terms, operators, grouping);

    if (!answer) {
      continue;
    }

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    if (gcd(answer.num, answer.den) !== 1) {
      continue;
    }

    return {
      type: 'fraction-mixed',
      terms,
      operators,
      parenthesesGroup: grouping,
      answerNum: answer.num,
      answerDen: answer.den,
      level: displayLevel,
      isRetry: false,
    };
  }

  const fallbackOperators = buildMixedOperatorPairs(selectedOps)[0]
    ?? buildPureOperatorPairs(selectedOps)[0];
  const fallbackGrouping = fallbackOperators[0] !== fallbackOperators[1]
    ? resolveParenthesesGroup(fallbackOperators, pickParenthesesGroup(fallbackOperators))
    : null;
  const fallbackTerms = [{ num: 1, den: 2 }, { num: 1, den: 3 }, { num: 1, den: 6 }];
  const fallbackAnswer = evaluateFractionExpression(fallbackTerms, fallbackOperators, fallbackGrouping);

  return {
    type: 'fraction-mixed',
    terms: fallbackTerms,
    operators: fallbackOperators,
    parenthesesGroup: fallbackGrouping,
    answerNum: fallbackAnswer.num,
    answerDen: fallbackAnswer.den,
    level: displayLevel,
    isRetry: false,
  };
}

function createFractionCombinedProblem(difficultyLevel) {
  const selectedOps = getSelectedFractionOperations();

  if (shouldUseFractionCombinedMixedProblem(difficultyLevel, selectedOps)) {
    return createFractionCombinedMixedProblem(selectedOps, difficultyLevel);
  }

  return createFractionProblemForOperation(pickRandomItem(selectedOps), difficultyLevel);
}

function createFractionMixedProblem(selectedOps = ['add', 'subtract']) {
  return createFractionCombinedMixedProblem(selectedOps, FRACTION_MIXED_DISPLAY_LEVEL - 1);
}

function multiplyFractionTerms(terms, wholeFactor = null) {
  let resultNum = 1;
  let resultDen = 1;

  terms.forEach(({ num, den }) => {
    resultNum *= num;
    resultDen *= den;
  });

  if (wholeFactor != null) {
    resultNum *= wholeFactor;
  }

  return { num: resultNum, den: resultDen };
}

function reduceFraction(num, den) {
  const common = gcd(num, den);
  return { num: num / common, den: den / common };
}

function buildFractionMultiplyProblem(terms, wholeFactor, displayLevel, answer) {
  return {
    type: 'fraction-multiply',
    terms,
    wholeFactor,
    answerNum: answer.num,
    answerDen: answer.den,
    level: displayLevel,
    isRetry: false,
  };
}

function createFractionMultiplyWholeProblem(requireBasicForm, displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const den = randomWhole(2, 12);
    const num = randomWhole(1, den - 1);
    const wholeFactor = randomWhole(2, 9);
    const raw = multiplyFractionTerms([{ num, den }], wholeFactor);
    const isBasic = gcd(raw.num, raw.den) === 1;

    if (requireBasicForm && !isBasic) {
      continue;
    }

    if (!requireBasicForm && isBasic) {
      continue;
    }

    const answer = reduceFraction(raw.num, raw.den);

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    return buildFractionMultiplyProblem([{ num, den }], wholeFactor, displayLevel, answer);
  }

  if (requireBasicForm) {
    return buildFractionMultiplyProblem([{ num: 1, den: 3 }], 2, displayLevel, { num: 2, den: 3 });
  }

  return buildFractionMultiplyProblem([{ num: 2, den: 3 }], 6, displayLevel, { num: 4, den: 1 });
}

function createFractionMultiplyTwoFractionsProblem(requireBasicForm, displayLevel, maxDen = 12) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = [randomProperFraction(maxDen), randomProperFraction(maxDen)];
    const raw = multiplyFractionTerms(terms);
    const isBasic = gcd(raw.num, raw.den) === 1;

    if (requireBasicForm && !isBasic) {
      continue;
    }

    if (!requireBasicForm && isBasic) {
      continue;
    }

    const answer = reduceFraction(raw.num, raw.den);

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    return buildFractionMultiplyProblem(terms, null, displayLevel, answer);
  }

  if (requireBasicForm) {
    return buildFractionMultiplyProblem(
      [{ num: 1, den: 2 }, { num: 3, den: 5 }],
      null,
      displayLevel,
      { num: 3, den: 10 },
    );
  }

  return buildFractionMultiplyProblem(
    [{ num: 2, den: 3 }, { num: 3, den: 4 }],
    null,
    displayLevel,
    { num: 1, den: 2 },
  );
}

function createFractionMultiplyThreeFractionsProblem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = [
      randomProperFraction(FRACTION_MULTIPLY_LEVEL5_MAX_DEN),
      randomProperFraction(FRACTION_MULTIPLY_LEVEL5_MAX_DEN),
      randomProperFraction(FRACTION_MULTIPLY_LEVEL5_MAX_DEN),
    ];
    const raw = multiplyFractionTerms(terms);
    const answer = reduceFraction(raw.num, raw.den);

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    return buildFractionMultiplyProblem(terms, null, displayLevel, answer);
  }

  return buildFractionMultiplyProblem(
    [{ num: 1, den: 2 }, { num: 2, den: 3 }, { num: 1, den: 5 }],
    null,
    displayLevel,
    { num: 1, den: 15 },
  );
}

function createFractionMultiplyProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 1) {
    return createFractionMultiplyWholeProblem(true, displayLevel);
  }

  if (displayLevel === 2) {
    return createFractionMultiplyWholeProblem(false, displayLevel);
  }

  if (displayLevel === 3) {
    return createFractionMultiplyTwoFractionsProblem(true, displayLevel);
  }

  if (displayLevel === 4) {
    return createFractionMultiplyTwoFractionsProblem(
      false,
      displayLevel,
      FRACTION_MULTIPLY_LEVEL4_MAX_DEN,
    );
  }

  return createFractionMultiplyThreeFractionsProblem(displayLevel);
}

function divideFractionByWhole(num, den, wholeDivisor) {
  return { num, den: den * wholeDivisor };
}

function divideWholeByFraction(wholeDividend, fraction) {
  return { num: wholeDividend * fraction.den, den: fraction.num };
}

function divideFractionByFraction(dividend, divisor) {
  return {
    num: dividend.num * divisor.den,
    den: dividend.den * divisor.num,
  };
}

function buildFractionDivideProblem(variant, displayLevel, answer, fields) {
  return {
    type: 'fraction-divide',
    variant,
    dividendTerm: fields.dividendTerm ?? null,
    wholeDividend: fields.wholeDividend ?? null,
    divisorTerm: fields.divisorTerm ?? null,
    wholeDivisor: fields.wholeDivisor ?? null,
    answerNum: answer.num,
    answerDen: answer.den,
    level: displayLevel,
    isRetry: false,
  };
}

function createFractionDivideByWholeProblem(numeratorIsMultiple, displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const wholeDivisor = randomWhole(2, 9);
    const den = randomWhole(2, 12);
    let num;

    if (numeratorIsMultiple) {
      const quotientNumerator = randomWhole(1, 12);
      num = quotientNumerator * wholeDivisor;
    } else {
      num = randomWhole(1, 12);
      if (num % wholeDivisor === 0) {
        continue;
      }
    }

    if (num <= 0) {
      continue;
    }

    const raw = divideFractionByWhole(num, den, wholeDivisor);
    const answer = reduceFraction(raw.num, raw.den);

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    return buildFractionDivideProblem('fraction-whole', displayLevel, answer, {
      dividendTerm: { num, den },
      wholeDivisor,
    });
  }

  if (numeratorIsMultiple) {
    return buildFractionDivideProblem('fraction-whole', displayLevel, { num: 2, den: 7 }, {
      dividendTerm: { num: 6, den: 7 },
      wholeDivisor: 3,
    });
  }

  return buildFractionDivideProblem('fraction-whole', displayLevel, { num: 5, den: 21 }, {
    dividendTerm: { num: 5, den: 7 },
    wholeDivisor: 3,
  });
}

function createFractionDivideWholeByFractionProblem(displayLevel, maxDen = 12, wholeMax = 12) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const divisorTerm = randomProperFraction(maxDen);
    const wholeDividend = randomWhole(2, wholeMax);
    const raw = divideWholeByFraction(wholeDividend, divisorTerm);

    if (gcd(raw.num, raw.den) !== 1) {
      continue;
    }

    const answer = reduceFraction(raw.num, raw.den);

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    return buildFractionDivideProblem('whole-fraction', displayLevel, answer, {
      wholeDividend,
      divisorTerm,
    });
  }

  return buildFractionDivideProblem('whole-fraction', displayLevel, { num: 9, den: 1 }, {
    wholeDividend: 6,
    divisorTerm: { num: 2, den: 3 },
  });
}

function createFractionDivideByFractionProblem(requireBasicForm, displayLevel, maxDen = 12) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const dividendTerm = randomProperFraction(maxDen);
    const divisorTerm = randomProperFraction(maxDen);
    const raw = divideFractionByFraction(dividendTerm, divisorTerm);
    const isBasic = gcd(raw.num, raw.den) === 1;

    if (requireBasicForm && !isBasic) {
      continue;
    }

    if (!requireBasicForm && isBasic) {
      continue;
    }

    const answer = reduceFraction(raw.num, raw.den);

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    return buildFractionDivideProblem('fraction-fraction', displayLevel, answer, {
      dividendTerm,
      divisorTerm,
    });
  }

  if (requireBasicForm) {
    return buildFractionDivideProblem('fraction-fraction', displayLevel, { num: 3, den: 10 }, {
      dividendTerm: { num: 1, den: 2 },
      divisorTerm: { num: 5, den: 3 },
    });
  }

  return buildFractionDivideProblem('fraction-fraction', displayLevel, { num: 1, den: 2 }, {
    dividendTerm: { num: 2, den: 3 },
    divisorTerm: { num: 3, den: 4 },
  });
}

function createFractionDivideLevel3Problem(displayLevel) {
  if (Math.random() < 0.5) {
    return createFractionDivideWholeByFractionProblem(
      displayLevel,
      FRACTION_DIVIDE_LEVEL3_MAX_DEN,
      FRACTION_DIVIDE_LEVEL3_WHOLE_MAX,
    );
  }

  return createFractionDivideByFractionProblem(
    true,
    displayLevel,
    FRACTION_DIVIDE_LEVEL3_MAX_DEN,
  );
}

function createFractionDivideProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 1) {
    return createFractionDivideByWholeProblem(true, displayLevel);
  }

  if (displayLevel === 2) {
    return createFractionDivideByWholeProblem(false, displayLevel);
  }

  if (displayLevel === 3) {
    return createFractionDivideLevel3Problem(displayLevel);
  }

  return createFractionDivideByFractionProblem(
    false,
    displayLevel,
    FRACTION_DIVIDE_LEVEL4_MAX_DEN,
  );
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

function answersMatch(userAnswer, correctAnswer, decimals) {
  const epsilon = 10 ** (-decimals) / 2;
  return Math.abs(userAnswer - correctAnswer) < epsilon;
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

function getMaxDifficultyLevel() {
  if (activeExerciseMode === 'basic-form') {
    return FRACTION_BASIC_FORM_MAX_LEVEL;
  }

  if (activeExerciseMode === 'fraction-add') {
    return FRACTION_ADD_MAX_LEVEL;
  }

  if (activeExerciseMode === 'fraction-subtract') {
    return FRACTION_SUBTRACT_MAX_LEVEL;
  }

  if (activeExerciseMode === 'fraction-combined') {
    return getFractionCombinedMaxLevel();
  }

  if (activeExerciseMode === 'fraction-multiply') {
    return FRACTION_MULTIPLY_MAX_LEVEL;
  }

  if (activeExerciseMode === 'fraction-divide') {
    return FRACTION_DIVIDE_MAX_LEVEL;
  }

  const selected = getSelectedOperations();
  if (selected.length === 0) {
    return 0;
  }

  const regularOps = getRegularOperations(selected);

  if (selected.length === 1) {
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

  if (regularOps.length >= 3) {
    return MULTI_OP_EXTRA_MIXED_START_LEVEL + 1;
  }

  return MULTI_OP_MIXED_START_LEVEL;
}

function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
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

function operationFromOperators(operators) {
  if (operators.every((op) => op === operators[0])) {
    return operators[0];
  }

  return 'mixed';
}

function formatOperatorSymbol(op) {
  if (op === 'subtract') return ' − ';
  if (op === 'multiply') return ' · ';
  if (op === 'divide') return ' : ';
  return ' + ';
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

function createMultiplyByPowerOfTen(level, multiplier) {
  const maxOperandDecimals = Math.log10(multiplier);
  const operandDecimals = Math.floor(Math.random() * (maxOperandDecimals + 1));

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
  const dividendDecimals = Math.floor(Math.random() * (power + 1));

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
        const useHundredthsDividend = Math.random() < 0.5;
        const answerMoreDecimalsThanDividend = Math.random() < 0.5;

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
  if (Math.random() < 0.5) {
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
  if (Math.random() < 0.5) {
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
      : Math.min(Math.random() < 0.5 ? 1 : 2, eligibleForTwoDecimals.length);
    const shuffledIndices = [...eligibleForTwoDecimals].sort(() => Math.random() - 0.5);
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
  if (activeExerciseMode === 'basic-form') {
    return createBasicFormProblem(level);
  }

  if (activeExerciseMode === 'fraction-add') {
    return createFractionAddProblem(level);
  }

  if (activeExerciseMode === 'fraction-subtract') {
    return createFractionSubtractProblem(level);
  }

  if (activeExerciseMode === 'fraction-combined') {
    return createFractionCombinedProblem(level);
  }

  if (activeExerciseMode === 'fraction-multiply') {
    return createFractionMultiplyProblem(level);
  }

  if (activeExerciseMode === 'fraction-divide') {
    return createFractionDivideProblem(level);
  }

  const selected = getSelectedOperations();

  if (selected.length === 0) {
    return {
      operands: [{ value: 0, decimals: 0 }],
      operation: 'add',
      answer: 0,
      answerDecimals: 0,
      level: 1,
      isRetry: false,
    };
  }

  if (selected.length === 1) {
    return createSingleOperationProblem(selected[0], level);
  }

  return createMultiOperationProblem(selected, level);
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

function formatProblemLevel(problem) {
  return `Úroveň ${getDisplayLevel(problem)}`;
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

function formatSingleFractionHtml(num, den) {
  return `<span class="fraction" aria-label="${escapeHtml(num)}/${escapeHtml(den)}"><span class="fraction__num">${escapeHtml(num)}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${escapeHtml(den)}</span></span>`;
}

function formatFractionDisplayHtml(num, den) {
  return `<span class="problem-expression">${formatSingleFractionHtml(num, den)}<span class="problem-expression__equals">=</span></span>`;
}

function formatFractionAddDisplayHtml(problem) {
  const parts = problem.terms.map((term) => formatSingleFractionHtml(term.num, term.den));

  if (problem.wholeAddend != null) {
    parts.push(`<span class="problem-expression__term">${escapeHtml(problem.wholeAddend)}</span>`);
  }

  return `<span class="problem-expression">${parts.join('<span class="problem-expression__operator">+</span>')}<span class="problem-expression__equals">=</span></span>`;
}

function formatFractionAddProblemText(problem) {
  const parts = problem.terms.map((term) => `${term.num}/${term.den}`);

  if (problem.wholeAddend != null) {
    parts.push(String(problem.wholeAddend));
  }

  return `${parts.join(' + ')} =`;
}

function formatFractionSubtractDisplayHtml(problem) {
  if (problem.wholeMinuend != null) {
    return `<span class="problem-expression"><span class="problem-expression__term">${escapeHtml(problem.wholeMinuend)}</span><span class="problem-expression__operator">−</span>${formatSingleFractionHtml(problem.terms[0].num, problem.terms[0].den)}<span class="problem-expression__equals">=</span></span>`;
  }

  const parts = problem.terms.map((term) => formatSingleFractionHtml(term.num, term.den));

  if (problem.wholeSubtrahend != null) {
    parts.push(`<span class="problem-expression__term">${escapeHtml(problem.wholeSubtrahend)}</span>`);
  }

  return `<span class="problem-expression">${parts.join('<span class="problem-expression__operator">−</span>')}<span class="problem-expression__equals">=</span></span>`;
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

function formatFractionOperatorSymbol(operator, forText = false) {
  if (operator === 'subtract') {
    return forText ? ' - ' : '−';
  }

  if (operator === 'multiply') {
    return forText ? ' · ' : '·';
  }

  if (operator === 'divide') {
    return forText ? ' : ' : ':';
  }

  return forText ? ' + ' : '+';
}

function formatFractionMixedDisplayHtml(problem) {
  const f0 = formatSingleFractionHtml(problem.terms[0].num, problem.terms[0].den);
  const f1 = formatSingleFractionHtml(problem.terms[1].num, problem.terms[1].den);
  const f2 = formatSingleFractionHtml(problem.terms[2].num, problem.terms[2].den);
  const op0 = `<span class="problem-expression__operator">${formatFractionOperatorSymbol(problem.operators[0])}</span>`;
  const op1 = `<span class="problem-expression__operator">${formatFractionOperatorSymbol(problem.operators[1])}</span>`;

  let html;

  if (problem.parenthesesGroup === 0) {
    html = `(${f0}${op0}${f1})${op1}${f2}`;
  } else if (problem.parenthesesGroup === 1) {
    html = `${f0}${op0}(${f1}${op1}${f2})`;
  } else {
    html = `${f0}${op0}${f1}${op1}${f2}`;
  }

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
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

function formatFractionMultiplyDisplayHtml(problem) {
  const parts = problem.terms.map((term) => formatSingleFractionHtml(term.num, term.den));

  if (problem.wholeFactor != null) {
    parts.push(`<span class="problem-expression__term">${escapeHtml(problem.wholeFactor)}</span>`);
  }

  return `<span class="problem-expression">${parts.join('<span class="problem-expression__operator">·</span>')}<span class="problem-expression__equals">=</span></span>`;
}

function formatFractionMultiplyProblemText(problem) {
  const parts = problem.terms.map((term) => `${term.num}/${term.den}`);

  if (problem.wholeFactor != null) {
    parts.push(String(problem.wholeFactor));
  }

  return `${parts.join(' · ')} =`;
}

function formatFractionDivideDisplayHtml(problem) {
  let html;

  if (problem.variant === 'fraction-whole') {
    html = formatSingleFractionHtml(problem.dividendTerm.num, problem.dividendTerm.den);
    html += `<span class="problem-expression__operator">:</span><span class="problem-expression__term">${escapeHtml(problem.wholeDivisor)}</span>`;
  } else if (problem.variant === 'whole-fraction') {
    html = `<span class="problem-expression__term">${escapeHtml(problem.wholeDividend)}</span>`;
    html += `<span class="problem-expression__operator">:</span>${formatSingleFractionHtml(problem.divisorTerm.num, problem.divisorTerm.den)}`;
  } else {
    html = formatSingleFractionHtml(problem.dividendTerm.num, problem.dividendTerm.den);
    html += `<span class="problem-expression__operator">:</span>${formatSingleFractionHtml(problem.divisorTerm.num, problem.divisorTerm.den)}`;
  }

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
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
  if (problem.type === 'basic-form') {
    return `${problem.givenNum}/${problem.givenDen} =`;
  }

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

  if (getSelectedOperations().length === 0) {
    return 'Vyber alespoň jednu operaci.';
  }

  if (problem.operators) {
    return `${formatThreeOperandExpression(problem)} =`;
  }

  const operator = formatOperatorSymbol(problem.operation);
  const expression = problem.operands
    .map((operand) => formatDecimal(operand.value, operand.decimals))
    .join(operator);

  return `${expression} =`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function recordSessionAnswer(userAnswer, isCorrect) {
  if (isFractionAnswerProblem(currentProblem)) {
    const answerDecimals = getFractionAnswerDecimals(
      currentProblem.answerNum,
      currentProblem.answerDen,
    );
    const odpoved = isNumberAnswerInputShape()
      ? formatDecimal(userAnswer, answerDecimals)
      : formatFraction(userAnswer.num, userAnswer.den);

    sessionResults.push({
      uloha: formatProblemText(currentProblem),
      uroven: getDisplayLevel(currentProblem),
      odpoved,
      spravne: formatFraction(currentProblem.answerNum, currentProblem.answerDen),
      vysledek: isCorrect ? 'správně' : 'špatně',
    });
    return;
  }

  sessionResults.push({
    uloha: formatProblemText(currentProblem),
    uroven: getDisplayLevel(currentProblem),
    odpoved: formatDecimal(userAnswer, currentProblem.answerDecimals),
    spravne: formatDecimal(currentProblem.answer, currentProblem.answerDecimals),
    vysledek: isCorrect ? 'správně' : 'špatně',
  });
}

function buildAnalysisStats() {
  const correct = sessionResults.filter((row) => row.vysledek === 'správně').length;
  const byLevel = new Map();

  sessionResults.forEach((row) => {
    const stats = byLevel.get(row.uroven) ?? { correct: 0, total: 0 };
    stats.total += 1;
    if (row.vysledek === 'správně') {
      stats.correct += 1;
    }
    byLevel.set(row.uroven, stats);
  });

  return {
    total: sessionResults.length,
    correct,
    byLevel,
  };
}

function formatSuccessRate(correct, total) {
  if (total === 0) {
    return '0/0 (0 %)';
  }

  const percent = Math.round((correct / total) * 100);
  return `${correct}/${total} (${percent} %)`;
}

function buildAnalysisSharePayload() {
  return {
    n: getAnalysisName(),
    r: sessionResults.map((row) => [
      row.uloha,
      row.uroven,
      row.odpoved,
      row.spravne,
      row.vysledek === 'správně' ? 1 : 0,
    ]),
  };
}

function parseAnalysisSharePayload(data) {
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;
  if (!parsed || !Array.isArray(parsed.r)) {
    throw new Error('Neplatná analýza.');
  }

  return {
    name: typeof parsed.n === 'string' ? parsed.n : '',
    results: parsed.r.map((row) => {
      if (!Array.isArray(row) || row.length < 5) {
        throw new Error('Neplatná analýza.');
      }

      return {
        uloha: String(row[0]),
        uroven: Number(row[1]),
        odpoved: String(row[2]),
        spravne: String(row[3]),
        vysledek: row[4] ? 'správně' : 'špatně',
      };
    }),
  };
}

const ANALYSIS_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getSupabaseClient() {
  const config = window.SUPABASE_CONFIG;
  if (!config?.url || !config?.anonKey || config.url.includes('YOUR_PROJECT')) {
    return null;
  }

  if (!window.supabase) {
    return null;
  }

  return window.supabase.createClient(config.url, config.anonKey);
}

function getAnalysisIdFromUrl() {
  const match = location.hash.match(/^#a=(.+)$/);
  if (!match || !ANALYSIS_ID_PATTERN.test(match[1])) {
    return null;
  }

  return match[1];
}

function buildAnalysisShareUrl(id) {
  return `${location.origin}${location.pathname}${location.search}#a=${id}`;
}

function hideAnalysisLinkUi() {
  analysisLinkFeedbackEl.hidden = true;
  analysisLinkWrapEl.hidden = true;
  analysisLinkFeedbackEl.textContent = '';
  analysisLinkFeedbackEl.classList.remove('analysis__link-feedback--error');
  analysisLinkInputEl.value = '';
}

async function copyAnalysisLinkToClipboard(successMessage = 'Odkaz zkopírován do schránky.') {
  const url = analysisLinkInputEl.value.trim();
  if (!url) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(url);
    analysisLinkFeedbackEl.textContent = successMessage;
    analysisLinkFeedbackEl.hidden = false;
    return true;
  } catch {
    analysisLinkInputEl.focus();
    analysisLinkInputEl.select();
    analysisLinkFeedbackEl.textContent = 'Odkaz se nepodařilo zkopírovat – vyber ho z pole ručně.';
    analysisLinkFeedbackEl.hidden = false;
    return false;
  }
}

async function saveAnalysisToSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('missing-config');
  }

  const { data, error } = await supabase
    .from('analyses')
    .insert({ payload: buildAnalysisSharePayload() })
    .select('id')
    .single();

  if (error || !data?.id) {
    throw new Error('save-failed');
  }

  return data.id;
}

async function loadAnalysisFromSupabase(id) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('missing-config');
  }

  const { data, error } = await supabase
    .from('analyses')
    .select('payload')
    .eq('id', id)
    .single();

  if (error || !data?.payload) {
    throw new Error('load-failed');
  }

  return parseAnalysisSharePayload(data.payload);
}

async function generateAnalysisLink() {
  if (!canUseAnalysisLinkButton()) {
    return;
  }

  if (getAnalysisName() === '') {
    analysisLinkFeedbackEl.textContent = 'Pro vygenerování odkazu je potřeba nejprve vyplnit jméno.';
    analysisLinkFeedbackEl.classList.add('analysis__link-feedback--error');
    analysisLinkFeedbackEl.hidden = false;
    analysisNameInputEl.focus();
    return;
  }

  analysisLinkFeedbackEl.classList.remove('analysis__link-feedback--error');
  analysisLinkBtn.disabled = true;
  analysisLinkFeedbackEl.textContent = 'Ukládám analýzu…';
  analysisLinkFeedbackEl.hidden = false;
  analysisLinkWrapEl.hidden = true;

  try {
    const id = await saveAnalysisToSupabase();
    const url = buildAnalysisShareUrl(id);
    location.hash = `a=${id}`;
    analysisLinkInputEl.value = url;
    analysisLinkWrapEl.hidden = false;

    const copied = await copyAnalysisLinkToClipboard('Analýza uložena a odkaz zkopírován do schránky.');
    if (!copied) {
      analysisLinkFeedbackEl.textContent = 'Analýza uložena – zkopíruj odkaz ikonou vedle pole.';
      analysisLinkFeedbackEl.hidden = false;
    }
  } catch (error) {
    if (error.message === 'missing-config') {
      analysisLinkFeedbackEl.textContent = 'Supabase není nakonfigurované. Zkopíruj supabase-config.example.js na supabase-config.js a doplň údaje.';
    } else {
      analysisLinkFeedbackEl.textContent = 'Analýzu se nepodařilo uložit.';
    }
    analysisLinkWrapEl.hidden = true;
  } finally {
    updateAnalysisLinkButton();
  }
}

async function loadAnalysisFromUrl() {
  const id = getAnalysisIdFromUrl();
  if (!id) {
    return false;
  }

  try {
    const { name, results } = await loadAnalysisFromSupabase(id);
    sessionResults = results;
    analysisNameInputEl.value = name;
    viewingSharedAnalysis = true;
    return true;
  } catch {
    viewingSharedAnalysis = false;
    return false;
  }
}

const CSV_FIELD_SEPARATOR = ',';
const ANALYSIS_CSV_HEADER = ['Číslo', 'Úloha', 'Úroveň', 'Správná odpověď', 'Odpověď uživatele', 'Výsledek'];

function escapeCsv(text) {
  const value = String(text ?? '');
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function csvRow(cells) {
  return cells.map(escapeCsv).join(CSV_FIELD_SEPARATOR);
}

function getAnalysisName() {
  return analysisNameInputEl.value.trim();
}

function canUseAnalysisLinkButton() {
  return !viewingSharedAnalysis && sessionResults.length > 0;
}

function updateAnalysisLinkButton() {
  analysisLinkBtn.disabled = !canUseAnalysisLinkButton();
}

function updateAnalysisNameField() {
  if (viewingSharedAnalysis) {
    analysisNameInputEl.hidden = true;
    analysisNameDisplayEl.hidden = false;
    analysisNameDisplayEl.textContent = getAnalysisName() || '—';
    return;
  }

  analysisNameInputEl.hidden = false;
  analysisNameDisplayEl.hidden = true;
}

function sanitizeFilenamePart(text) {
  const cleaned = text.trim().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}\-_]/gu, '');
  return cleaned.slice(0, 50);
}

function buildAnalysisDocument() {
  const stats = buildAnalysisStats();
  const levels = [...stats.byLevel.entries()]
    .sort(([a], [b]) => a - b)
    .map(([level, levelStats]) => ({
      level,
      label: `Úroveň ${level}:`,
      value: formatSuccessRate(levelStats.correct, levelStats.total),
      displayLabel: `Úroveň ${level}: ${formatSuccessRate(levelStats.correct, levelStats.total)}`,
    }));

  return {
    title: 'Analýza',
    nameLabel: 'Jméno',
    name: getAnalysisName(),
    overallLabel: 'Celková úspěšnost:',
    overall: formatSuccessRate(stats.correct, stats.total),
    levelsHeading: 'Úspěšnost podle úrovně',
    levels,
    rows: sessionResults.map((row, index) => ({
      number: index + 1,
      uloha: row.uloha,
      uroven: row.uroven,
      odpoved: row.odpoved,
      spravne: row.spravne,
      vysledek: row.vysledek,
    })),
  };
}

function buildAnalysisSummaryText(doc) {
  const lines = [
    doc.title,
    `${doc.nameLabel}: ${doc.name || '—'}`,
    `${doc.overallLabel} ${doc.overall}`,
  ];

  if (doc.levels.length > 0) {
    lines.push(`${doc.levelsHeading}:`);
    doc.levels.forEach((level) => {
      lines.push(level.displayLabel);
    });
  }

  return lines.join('\n');
}

function buildAnalysisCsv() {
  const doc = buildAnalysisDocument();
  const lines = [
    csvRow(ANALYSIS_CSV_HEADER),
    ...doc.rows.map((row) => csvRow([
      row.number,
      row.uloha,
      row.uroven,
      row.spravne,
      row.odpoved,
      row.vysledek,
    ])),
    '',
    escapeCsv(buildAnalysisSummaryText(doc)),
  ];

  return lines.join('\n');
}

function downloadAnalysisCsv() {
  if (sessionResults.length === 0) {
    return;
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const name = getAnalysisName();
  const namePart = name ? `${sanitizeFilenamePart(name)}-` : '';
  const csvBody = new TextEncoder().encode(buildAnalysisCsv());
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const bytes = new Uint8Array(bom.length + csvBody.length);
  bytes.set(bom);
  bytes.set(csvBody, bom.length);
  const blob = new Blob([bytes], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analyza-${namePart}${stamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function renderAnalysis() {
  if (sessionResults.length === 0) {
    analysisSummaryEl.innerHTML = '<p class="analysis__empty">Zatím nemáš žádné vyhodnocené úlohy.</p>';
    analysisLevelsEl.innerHTML = '';
    analysisTableBodyEl.innerHTML = '';
    analysisDownloadBtn.disabled = true;
    analysisLinkBtn.disabled = true;
    hideAnalysisLinkUi();
    updateAnalysisNameField();
    return;
  }

  const doc = buildAnalysisDocument();

  analysisSummaryEl.innerHTML = `<p><strong>${escapeHtml(doc.overallLabel)}</strong> ${escapeHtml(doc.overall)}</p>`;

  const levelLines = doc.levels
    .map((level) => `<p>${escapeHtml(level.displayLabel)}</p>`)
    .join('');

  analysisLevelsEl.innerHTML = `
    <h3>${escapeHtml(doc.levelsHeading)}</h3>
    ${levelLines}
  `;

  analysisTableBodyEl.innerHTML = doc.rows.map((row) => `
    <tr class="${row.vysledek === 'špatně' ? 'row--wrong' : ''}">
      <td class="num">${row.number}</td>
      <td>${escapeHtml(row.uloha)}</td>
      <td class="num">${row.uroven}</td>
      <td>${escapeHtml(row.odpoved)}</td>
      <td>${escapeHtml(row.spravne)}</td>
      <td>${escapeHtml(row.vysledek)}</td>
    </tr>
  `).join('');

  analysisDownloadBtn.disabled = false;
  updateAnalysisLinkButton();
  updateAnalysisNameField();
}

function hideAllScreens() {
  setupScreenEl.hidden = true;
  exerciseScreenEl.hidden = true;
  analysisScreenEl.hidden = true;
}

function setFormEnabled(enabled) {
  inputEl.disabled = !enabled;
  answerNumeratorEl.disabled = !enabled;
  answerDenominatorEl.disabled = !enabled;
  answerShapeToggleBtn.disabled = !enabled;
  formEl.querySelector('button[type="submit"]').disabled = !enabled;
  mathKeypadKeys.forEach((key) => {
    key.disabled = !enabled;
  });
}

function getActiveAnswerInputEl() {
  if (isNumberAnswerInputShape()) {
    return inputEl;
  }

  if (isFractionAnswerInputShape()) {
    return activeFractionInputEl || answerNumeratorEl;
  }

  return inputEl;
}

function clearAnswerInputs() {
  inputEl.value = '';
  answerNumeratorEl.value = '';
  answerDenominatorEl.value = '';
}

function focusAnswerInput() {
  if (isNumberAnswerInputShape()) {
    inputEl.focus();
    return;
  }

  if (isFractionAnswerInputShape()) {
    activeFractionInputEl = answerNumeratorEl;
    answerNumeratorEl.focus();
    return;
  }

  inputEl.focus();
}

function setAnswerWrapVisible(wrapEl, visible) {
  wrapEl.hidden = !visible;
  wrapEl.classList.toggle('is-visible', visible);
}

function updateFractionAnswerShapeUi() {
  const separatorKey = mathKeypadEl.querySelector('[data-value=","]');

  if (!isFractionExerciseMode()) {
    answerShapeToggleBtn.hidden = true;
    setAnswerWrapVisible(decimalAnswerWrapEl, true);
    setAnswerWrapVisible(fractionAnswerWrapEl, false);
    inputEl.required = true;

    if (separatorKey) {
      separatorKey.hidden = false;
    }

    inputEl.placeholder = '0,0';
    inputEl.inputMode = 'decimal';
    return;
  }

  answerShapeToggleBtn.hidden = false;
  const useFractionShape = fractionAnswerInputShape === 'fraction';

  setAnswerWrapVisible(decimalAnswerWrapEl, !useFractionShape);
  setAnswerWrapVisible(fractionAnswerWrapEl, useFractionShape);
  inputEl.required = !useFractionShape;
  answerShapeToggleBtn.textContent = useFractionShape ? 'Číslo' : 'Zlomek';
  answerShapeToggleBtn.setAttribute(
    'aria-label',
    useFractionShape ? 'Přepnout odpověď na číslo' : 'Přepnout odpověď na zlomek',
  );

  if (separatorKey) {
    separatorKey.hidden = useFractionShape;
  }

  if (useFractionShape) {
    inputEl.placeholder = '';
    return;
  }

  inputEl.placeholder = '0,0';
  inputEl.inputMode = 'decimal';
}

function toggleFractionAnswerShape() {
  if (!isFractionExerciseMode() || answerShapeToggleBtn.disabled) {
    return;
  }

  fractionAnswerInputShape = fractionAnswerInputShape === 'fraction' ? 'number' : 'fraction';
  clearAnswerInputs();
  updateFractionAnswerShapeUi();
  focusAnswerInput();
}

function setAnswerInputMode(mode) {
  if (mode !== 'basic-form'
    && mode !== 'fraction-add'
    && mode !== 'fraction-subtract'
    && mode !== 'fraction-combined'
    && mode !== 'fraction-multiply'
    && mode !== 'fraction-divide') {
    fractionAnswerInputShape = 'fraction';
  }

  updateFractionAnswerShapeUi();
}

function insertDecimalIntoInput(value) {
  const current = inputEl.value;

  if (value === ',') {
    if (current.includes(',')) {
      return;
    }

    inputEl.value = current === '' ? '0,' : `${current},`;
    inputEl.focus();
    return;
  }

  inputEl.value = `${current}${value}`;
  inputEl.focus();
}

function insertIntoAnswer(value) {
  if (getActiveAnswerInputEl().disabled) {
    return;
  }

  if (isNumberAnswerInputShape()) {
    insertDecimalIntoInput(value);
    return;
  }

  if (isFractionAnswerInputShape()) {
    if (value === ',' || value === '/') {
      return;
    }

    const target = getActiveAnswerInputEl();
    if (!fitsBasicFormMaxValue(target.value, value)) {
      return;
    }

    target.value = `${target.value}${value}`;
    target.focus();
    return;
  }

  insertDecimalIntoInput(value);
}

function backspaceAnswer() {
  const target = getActiveAnswerInputEl();

  if (target.disabled) {
    return;
  }

  target.value = target.value.slice(0, -1);
  target.focus();
}

function handleKeypadClick(event) {
  const key = event.currentTarget;
  const action = key.dataset.action;
  const value = key.dataset.value;

  if (action === 'backspace') {
    backspaceAnswer();
    return;
  }

  if (action === 'toggle-answer-shape') {
    toggleFractionAnswerShape();
    return;
  }

  if (value) {
    insertIntoAnswer(value);
  }
}

function showProblem(problem) {
  currentProblem = problem;
  problemLevelEl.textContent = formatProblemLevel(problem);

  if (problem.type === 'basic-form') {
    const maxInputLength = String(getBasicFormMaxValue(getDisplayLevel(problem))).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatFractionDisplayHtml(problem.givenNum, problem.givenDen);
  } else if (problem.type === 'fraction-add') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatFractionAddDisplayHtml(problem);
  } else if (problem.type === 'fraction-subtract') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatFractionSubtractDisplayHtml(problem);
  } else if (problem.type === 'fraction-mixed') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatFractionMixedDisplayHtml(problem);
  } else if (problem.type === 'fraction-multiply') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatFractionMultiplyDisplayHtml(problem);
  } else if (problem.type === 'fraction-divide') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatFractionDivideDisplayHtml(problem);
  } else {
  problemEl.textContent = formatProblemText(problem);
  }

  const canAnswer = isFractionExerciseMode() || getSelectedOperations().length > 0;
  setFormEnabled(canAnswer);

  if (canAnswer) {
    clearAnswerInputs();
    focusAnswerInput();
  }

  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  nextBtn.hidden = true;
}

function queueRetry(problem) {
  const item = {
    level: problem.level,
    problemsRemaining: PROBLEMS_BEFORE_RETRY,
  };

  if (problem.type === 'basic-form') {
    item.type = 'basic-form';
    item.givenNum = problem.givenNum;
    item.givenDen = problem.givenDen;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
  } else if (problem.type === 'fraction-add') {
    item.type = 'fraction-add';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.wholeAddend = problem.wholeAddend ?? null;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
  } else if (problem.type === 'fraction-subtract') {
    item.type = 'fraction-subtract';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.wholeSubtrahend = problem.wholeSubtrahend ?? null;
    item.wholeMinuend = problem.wholeMinuend ?? null;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
  } else if (problem.type === 'fraction-mixed') {
    item.type = 'fraction-mixed';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.operators = [...problem.operators];
    item.parenthesesGroup = problem.parenthesesGroup ?? null;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
  } else if (problem.type === 'fraction-multiply') {
    item.type = 'fraction-multiply';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.wholeFactor = problem.wholeFactor ?? null;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
  } else if (problem.type === 'fraction-divide') {
    item.type = 'fraction-divide';
    item.variant = problem.variant;
    item.dividendTerm = problem.dividendTerm ? { ...problem.dividendTerm } : null;
    item.wholeDividend = problem.wholeDividend ?? null;
    item.divisorTerm = problem.divisorTerm ? { ...problem.divisorTerm } : null;
    item.wholeDivisor = problem.wholeDivisor ?? null;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
  } else {
    item.operands = problem.operands.map((operand) => ({ ...operand }));
    item.operation = problem.operation;
    item.operators = problem.operators ? [...problem.operators] : undefined;
    item.parenthesesGroup = problem.parenthesesGroup ?? null;
    item.answer = problem.answer;
    item.answerDecimals = problem.answerDecimals;
  }

  retryQueue.push(item);
}

function pickNextProblem() {
  retryQueue.forEach((item) => {
    if (item.problemsRemaining > 0) {
      item.problemsRemaining -= 1;
    }
  });

  const dueRetry = retryQueue.find((item) => item.problemsRemaining <= 0);
  if (dueRetry) {
    retryQueue = retryQueue.filter((item) => item !== dueRetry);

    if (dueRetry.type === 'basic-form') {
      return {
        type: 'basic-form',
        givenNum: dueRetry.givenNum,
        givenDen: dueRetry.givenDen,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'fraction-add') {
      return {
        type: 'fraction-add',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        wholeAddend: dueRetry.wholeAddend ?? null,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'fraction-subtract') {
      return {
        type: 'fraction-subtract',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        wholeSubtrahend: dueRetry.wholeSubtrahend ?? null,
        wholeMinuend: dueRetry.wholeMinuend ?? null,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'fraction-mixed') {
      return {
        type: 'fraction-mixed',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        parenthesesGroup: dueRetry.parenthesesGroup ?? null,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'fraction-multiply') {
      return {
        type: 'fraction-multiply',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        wholeFactor: dueRetry.wholeFactor ?? null,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'fraction-divide') {
      return {
        type: 'fraction-divide',
        variant: dueRetry.variant,
        dividendTerm: dueRetry.dividendTerm ? { ...dueRetry.dividendTerm } : null,
        wholeDividend: dueRetry.wholeDividend ?? null,
        divisorTerm: dueRetry.divisorTerm ? { ...dueRetry.divisorTerm } : null,
        wholeDivisor: dueRetry.wholeDivisor ?? null,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    return {
      operands: dueRetry.operands.map((operand) => ({ ...operand })),
      operation: dueRetry.operation,
      operators: dueRetry.operators ? [...dueRetry.operators] : undefined,
      parenthesesGroup: dueRetry.parenthesesGroup ?? null,
      answer: dueRetry.answer,
      answerDecimals: dueRetry.answerDecimals,
      level: dueRetry.level,
      isRetry: true,
    };
  }

  return createRandomProblem(difficultyLevel);
}

function updateTitle() {
  if (exerciseScreenEl.hidden && analysisScreenEl.hidden) {
    appTitleEl.textContent = APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'basic-form'
    || activeExerciseMode === 'fraction-add'
    || activeExerciseMode === 'fraction-subtract'
    || activeExerciseMode === 'fraction-combined'
    || activeExerciseMode === 'fraction-multiply'
    || activeExerciseMode === 'fraction-divide') {
    appTitleEl.textContent = FRACTION_APP_TITLE;
    return;
  }

  appTitleEl.textContent = DECIMAL_APP_TITLE;
}

function showSetupFeedback(message) {
  setupFeedbackEl.textContent = message;
  setupFeedbackEl.hidden = message === '';
}

function resetSession() {
  sessionResults = [];
  analysisNameInputEl.value = '';
  viewingSharedAnalysis = false;
  hideAnalysisLinkUi();
}

function resetProgress() {
  difficultyLevel = 0;
  correctStreak = 0;
  retryQueue = [];
  currentProblem = null;
  fractionAnswerInputShape = 'fraction';
  resetSession();
}

function handleCorrectAnswer() {
  correctStreak += 1;

  if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < getMaxDifficultyLevel()) {
    difficultyLevel += 1;
    correctStreak = 0;
  }
}

function handleWrongAnswer() {
  correctStreak = 0;

  if (difficultyLevel > 0) {
    difficultyLevel -= 1;
  }

  queueRetry(currentProblem);
}

function newProblem() {
  showProblem(pickNextProblem());
}

function showSetupScreen({ preserveAnalysisHash = false } = {}) {
  hideAllScreens();
  setupScreenEl.hidden = false;
  appEl.classList.remove('app--wide');
  viewingSharedAnalysis = false;
  activeExerciseMode = 'decimal';
  setAnswerInputMode('decimal');
  showSetupFeedback('');
  updateStartButton();
  hideAnalysisLinkUi();
  if (location.hash.startsWith('#a=') && !preserveAnalysisHash) {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
  updateTitle();
}

function showExerciseScreen() {
  activeExerciseMode = resolveActiveExerciseMode();

  hideAllScreens();
  exerciseScreenEl.hidden = false;
  appEl.classList.remove('app--wide');
  resetProgress();
  setAnswerInputMode(activeExerciseMode);
  updateTitle();
  newProblem();
}

function showAnalysisScreen() {
  hideAllScreens();
  analysisScreenEl.hidden = false;
  appEl.classList.add('app--wide');
  renderAnalysis();
  if (location.hash.startsWith('#a=')) {
    const id = getAnalysisIdFromUrl();
    if (id) {
      analysisLinkInputEl.value = buildAnalysisShareUrl(id);
      analysisLinkWrapEl.hidden = false;
    }
  }
  updateTitle();
}

function handleOperationSelectionChange() {
  showSetupFeedback('');
  updateStartButton();
  updateTitle();
}

function handleFractionModeSelectionChange() {
  showSetupFeedback('');
  updateStartButton();
}

formEl.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!nextBtn.hidden) {
    newProblem();
    return;
  }

  if (isFractionExerciseMode()) {
    const correctFraction = {
      num: currentProblem.answerNum,
      den: currentProblem.answerDen,
    };

    if (isNumberAnswerInputShape()) {
      const userValue = parseAnswer(inputEl.value);
      if (userValue === null) {
        feedbackEl.textContent = 'Zadej platné číslo (např. 0,75).';
        feedbackEl.className = 'feedback feedback--wrong';
        return;
      }

      const isCorrect = numericAnswerMatchesFraction(
        userValue,
        correctFraction.num,
        correctFraction.den,
      );

      if (isCorrect) {
        handleCorrectAnswer();
        feedbackEl.className = 'feedback feedback--correct';
      } else {
        handleWrongAnswer();
        feedbackEl.className = 'feedback feedback--wrong';
      }

      feedbackEl.textContent = isCorrect ? 'Správně!' : 'Špatně.';
      recordSessionAnswer(userValue, isCorrect);
      setFormEnabled(false);
      nextBtn.hidden = false;
      nextBtn.focus();
      return;
    }

    const userAnswer = getFractionAnswerFromInputs();
    if (userAnswer === null) {
      feedbackEl.textContent = 'Vyplň čitatele a jmenovatele.';
      feedbackEl.className = 'feedback feedback--wrong';
      return;
    }

    let isCorrect = false;
    let feedbackMessage = 'Špatně.';

    if (currentProblem.type === 'basic-form'
      && (!isProductOfBasicFormPrimes(userAnswer.num) || !isProductOfBasicFormPrimes(userAnswer.den))) {
      feedbackMessage = 'Špatně.';
    } else if (!isBasicFormFraction(userAnswer.num, userAnswer.den)) {
      feedbackMessage = BASIC_FORM_REQUIRED_MESSAGE;
    } else if (fractionAnswersMatch(userAnswer, correctFraction)) {
      isCorrect = true;
      feedbackMessage = 'Správně!';
    }

    if (isCorrect) {
      handleCorrectAnswer();
      feedbackEl.className = 'feedback feedback--correct';
    } else {
      handleWrongAnswer();
      feedbackEl.className = 'feedback feedback--wrong';
    }

    feedbackEl.textContent = feedbackMessage;
    recordSessionAnswer(userAnswer, isCorrect);
    setFormEnabled(false);
    nextBtn.hidden = false;
    nextBtn.focus();
    return;
  }

  if (getSelectedOperations().length === 0) {
    return;
  }

  const userAnswer = parseAnswer(inputEl.value);
  if (userAnswer === null) {
    feedbackEl.textContent = 'Zadej platné desetinné číslo (např. 3,5).';
    feedbackEl.className = 'feedback feedback--wrong';
    return;
  }

  const isCorrect = answersMatch(
    userAnswer,
    currentProblem.answer,
    currentProblem.answerDecimals,
  );

  if (isCorrect) {
    handleCorrectAnswer();
    feedbackEl.textContent = 'Správně!';
    feedbackEl.className = 'feedback feedback--correct';
  } else {
    handleWrongAnswer();
    feedbackEl.textContent = 'Špatně.';
    feedbackEl.className = 'feedback feedback--wrong';
  }

  recordSessionAnswer(userAnswer, isCorrect);

  setFormEnabled(false);
  nextBtn.hidden = false;
  nextBtn.focus();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || exerciseScreenEl.hidden || nextBtn.hidden) {
    return;
  }

  if (event.target === nextBtn || event.target === backBtn || event.target === finishBtn) {
    return;
  }

  event.preventDefault();
  newProblem();
});

nextBtn.addEventListener('click', newProblem);

mathKeypadKeys.forEach((key) => {
  key.addEventListener('click', handleKeypadClick);
});

answerNumeratorEl.addEventListener('focus', () => {
  activeFractionInputEl = answerNumeratorEl;
});

answerDenominatorEl.addEventListener('focus', () => {
  activeFractionInputEl = answerDenominatorEl;
});

answerShapeToggleBtn.addEventListener('click', toggleFractionAnswerShape);

startBtn.addEventListener('click', () => {
  if (startBtn.disabled) {
    return;
  }

  showSetupFeedback('');
  showExerciseScreen();
});

finishBtn.addEventListener('click', () => {
  viewingSharedAnalysis = false;
  showAnalysisScreen();
});

backBtn.addEventListener('click', showSetupScreen);

analysisBackBtn.addEventListener('click', showSetupScreen);

analysisDownloadBtn.addEventListener('click', downloadAnalysisCsv);

analysisLinkBtn.addEventListener('click', () => {
  generateAnalysisLink();
});

analysisLinkCopyBtn.addEventListener('click', () => {
  copyAnalysisLinkToClipboard();
});

operationCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', handleOperationSelectionChange);
});

fractionModeCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', handleFractionModeSelectionChange);
});

(async () => {
  const loaded = await loadAnalysisFromUrl();
  if (loaded) {
    showAnalysisScreen();
    return;
  }

  if (getAnalysisIdFromUrl()) {
    showSetupScreen({ preserveAnalysisHash: true });
    showSetupFeedback(
      'Analýzu se nepodařilo načíst. Spusť aplikaci přes lokální server (např. npx serve) a otevři http://localhost, ne soubor file://.',
    );
    return;
  }

  showSetupScreen();
})();
