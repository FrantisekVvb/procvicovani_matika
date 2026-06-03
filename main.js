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
const answerFractionEl = document.getElementById('answer-fraction');
const answerFractionSignEl = document.getElementById('answer-fraction-sign');
const answerShapeToggleBtn = document.getElementById('answer-shape-toggle-btn');
const feedbackEl = document.getElementById('feedback');
const primaryActionBtn = document.getElementById('primary-action-btn');
let awaitingNextProblem = false;
const mathKeypadEl = document.getElementById('math-keypad');
const mathKeypadKeys = document.querySelectorAll('.math-keypad__key');
const operationCheckboxes = document.querySelectorAll('#decimal-operation-picker input[type="checkbox"]');
const integerModeCheckboxes = document.querySelectorAll('#integer-operation-picker input[type="checkbox"]');
const powersModeCheckboxes = document.querySelectorAll('#powers-operation-picker input[type="checkbox"]');
const fractionModeCheckboxes = document.querySelectorAll('#fraction-operation-picker input[type="checkbox"]');
const requireBasicFormCheckbox = document.getElementById('require-basic-form-checkbox');

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
const MULTI_OPERAND_DISPLAY_LEVEL = 7;
const MULTI_OPERAND_COUNT = 4;

const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const MIXED_OPERATOR_RATE = 0.8;
const PARENTHESES_RATE = 0.5;

const APP_TITLE = 'Procvičování matematiky';
const DECIMAL_APP_TITLE = 'Početní operace s desetinnými čísly';
const FRACTION_APP_TITLE = 'Početní operace se zlomky';
const INTEGER_APP_TITLE = 'Početní operace se zápornými čísly';
const DECIMAL_FRACTION_COMBINED_APP_TITLE = 'Početní operace s desetinnými čísly a se zlomky';
const POWERS_APP_TITLE = 'Počítání s mocninami a druhou odmocninou';
const POWER_MAX_LEVEL = 4;
const POWER_SQUARE_BASE_MAX = 15;
const POWER_HIGH_EXP_BASE_MAX = 5;
const POWER_ANSWER_MIN = -1000;
const POWER_ANSWER_MAX = 1000;
const INTEGER_ADD_SUBTRACT_MAX_LEVEL = 4;
const INTEGER_MULTIPLY_DIVIDE_MAX_LEVEL = 2;
const INTEGER_COMBINED_MAX_LEVEL = 4;
const INTEGER_COMBINED_MIXED_START_LEVEL = 3;
const INTEGER_COMBINED_CROSS_OPS_DISPLAY_LEVEL = 5;
const INTEGER_OPERAND_MIN = 1;
const INTEGER_OPERAND_MAX = 20;
const INTEGER_ANSWER_MIN = -100;
const INTEGER_ANSWER_MAX = 100;
const NON_INTEGER_ADD_SUBTRACT_MAX_LEVEL = 4;
const NON_INTEGER_MULTIPLY_DIVIDE_MAX_LEVEL = 2;
const NON_INTEGER_DECIMAL_MIN = 0.1;
const NON_INTEGER_DECIMAL_MAX = 9.9;
const NON_INTEGER_FRACTION_DEN_MAX = 12;
const NON_INTEGER_ANSWER_MIN = -100;
const NON_INTEGER_ANSWER_MAX = 100;
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
const FRACTION_COMPOUND_MAX_LEVEL = 4;
const COMPOUND_FRACTION_OPS = ['add', 'subtract', 'multiply', 'divide'];

let activeExerciseMode = 'decimal';
let difficultyLevel = 0;
let correctStreak = 0;
let retryQueue = [];
let currentProblem = null;
let sessionResults = [];
let sessionSelectedModes = [];
let activeExerciseModePool = [];
let currentAnswerInputMode = null;
let viewingSharedAnalysis = false;
let activeFractionInputEl = null;
let fractionAnswerInputShape = 'fraction';

function getSelectedFractionModes() {
  return [...fractionModeCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function getSelectedIntegerModes() {
  return [...integerModeCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function getSelectedPowersModes() {
  return [...powersModeCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function hasPowersMode(selected = getSelectedPowersModes()) {
  return selected.includes('powers');
}

function hasIntegerAddSubtractMode(selected = getSelectedIntegerModes()) {
  return selected.includes('integer-add-subtract');
}

function hasIntegerMultiplyDivideMode(selected = getSelectedIntegerModes()) {
  return selected.includes('integer-multiply-divide');
}

function hasNonIntegerAddSubtractMode(selected = getSelectedIntegerModes()) {
  return selected.includes('non-integer-add-subtract');
}

function hasNonIntegerMultiplyDivideMode(selected = getSelectedIntegerModes()) {
  return selected.includes('non-integer-multiply-divide');
}

function hasIntegerArithmeticCombinedModes(selected = getSelectedIntegerModes()) {
  return hasIntegerAddSubtractMode(selected) && hasIntegerMultiplyDivideMode(selected);
}

function getSelectedIntegerArithmeticOperations(selected = getSelectedIntegerModes()) {
  const operations = [];

  if (hasIntegerAddSubtractMode(selected)) {
    operations.push('add', 'subtract');
  }

  if (hasIntegerMultiplyDivideMode(selected)) {
    operations.push('multiply', 'divide');
  }

  return operations;
}

function hasIntegerOnlySelection() {
  return getSelectedIntegerModes().length > 0
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedPowersModes().length === 0;
}

function hasPowersOnlySelection() {
  return getSelectedPowersModes().length > 0
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0;
}

function hasSetupSelection() {
  return getSelectedOperations().length > 0
    || getSelectedFractionModes().length > 0
    || getSelectedIntegerModes().length > 0
    || getSelectedPowersModes().length > 0;
}

function updateStartButton() {
  startBtn.disabled = getSetupStartBlockReason() !== '';
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
  for (let i = 0; i < operators.length; i += 1) {
    if (operators[i] === 'divide' && !isValidDivideDivisor(operands[i + 1])) {
      return false;
    }
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

function normalizeSignedFraction(fraction) {
  if (typeof fraction.negative === 'boolean') {
    return {
      num: Math.abs(fraction.num),
      den: Math.abs(fraction.den),
      negative: fraction.negative,
    };
  }

  return {
    num: Math.abs(fraction.num),
    den: Math.abs(fraction.den),
    negative: fraction.num < 0,
  };
}

function formatSignedFractionText(fraction) {
  const normalized = normalizeSignedFraction(fraction);
  const prefix = normalized.negative ? '-' : '';

  return `${prefix}${normalized.num}/${normalized.den}`;
}

function isAnswerFractionNegative() {
  return answerFractionEl?.classList.contains('answer-fraction--negative') ?? false;
}

function setAnswerFractionNegative(isNegative) {
  if (!answerFractionEl || !answerFractionSignEl) {
    return;
  }

  answerFractionEl.classList.toggle('answer-fraction--negative', isNegative);
  answerFractionSignEl.textContent = isNegative ? '−' : '';
}

function toggleAnswerFractionNegative() {
  setAnswerFractionNegative(!isAnswerFractionNegative());
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
    || currentProblem?.type === 'fraction-divide'
    || currentProblem?.type === 'fraction-compound'
    || currentProblem?.type === 'decimal-fraction-mixed') {
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
    || problem?.type === 'fraction-divide'
    || problem?.type === 'fraction-compound'
    || problem?.type === 'decimal-fraction-mixed';
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

function getFractionOperationModes(selected = getSelectedFractionModes()) {
  return selected.filter((mode) => mode !== 'basic-form' && mode !== 'fraction-compound');
}

function isCompoundFractionOnlySelection(selected = getSelectedFractionModes()) {
  return selected.includes('fraction-compound') && getFractionOperationModes(selected).length === 0;
}

function hasMultipleFractionOperations(selected = getSelectedFractionModes()) {
  return getSelectedFractionOperations(selected).length >= 2;
}

function getFractionCombinedMaxLevel(selectedOps = getSelectedFractionOperations()) {
  if (selectedOps.length >= 3) {
    return FRACTION_COMBINED_EXTRA_MAX_LEVEL + 1;
  }

  return FRACTION_COMBINED_MAX_LEVEL;
}

function shouldUseMultiOperandCount(displayLevel, selectedOpsCount) {
  return displayLevel >= MULTI_OPERAND_DISPLAY_LEVEL && selectedOpsCount >= 3;
}

function getMixedOperandCount(displayLevel, selectedOpsCount) {
  return shouldUseMultiOperandCount(displayLevel, selectedOpsCount)
    ? MULTI_OPERAND_COUNT
    : 3;
}

function hasCrossTypeSelection() {
  return getSelectedOperations().length > 0 && getSelectedFractionOperations().length > 0;
}

function getCrossTypeOperators() {
  return [...new Set([
    ...getRegularOperations(),
    ...getSelectedFractionOperations(),
  ])];
}

function getDecimalMaxLevelForSelection(selected = getSelectedOperations()) {
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

function getCrossTypePoolMaxLevel() {
  return Math.max(
    getDecimalMaxLevelForSelection(),
    getFractionCombinedMaxLevel(),
  );
}

function getCrossTypeCombinedMaxLevel() {
  return getCrossTypePoolMaxLevel();
}

function shouldUseCrossTypeMixedProblem(difficultyLevel) {
  return difficultyLevel >= getCrossTypePoolMaxLevel();
}

function resolveIntegerExerciseModeFromSelection(integerModes = getSelectedIntegerModes()) {
  if (integerModes.length === 0) {
    return null;
  }

  if (hasNonIntegerMultiplyDivideMode(integerModes) && !hasNonIntegerAddSubtractMode(integerModes)) {
    return 'non-integer-multiply-divide';
  }

  if (hasNonIntegerAddSubtractMode(integerModes)) {
    return 'non-integer-add-subtract';
  }

  if (hasIntegerArithmeticCombinedModes(integerModes)) {
    return 'integer-combined';
  }

  if (hasIntegerMultiplyDivideMode(integerModes)) {
    return 'integer-multiply-divide';
  }

  if (hasIntegerAddSubtractMode(integerModes)) {
    return 'integer-add-subtract';
  }

  return null;
}

function resolveFractionExerciseModeFromSelection(modes = getSelectedFractionModes()) {
  if (modes.length === 0) {
    return null;
  }

  if (modes.includes('basic-form')) {
    return 'basic-form';
  }

  if (isCompoundFractionOnlySelection(modes)) {
    return 'fraction-compound';
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

  if (modes.includes('fraction-compound')) {
    return 'fraction-compound';
  }

  return null;
}

function buildExerciseModePool() {
  if (hasCrossTypeSelection()) {
    return ['decimal-fraction-combined'];
  }

  const pool = [];

  if (hasPowersMode()) {
    pool.push('powers');
  }

  const integerMode = resolveIntegerExerciseModeFromSelection();
  if (integerMode) {
    pool.push(integerMode);
  }

  if (getSelectedOperations().length > 0) {
    pool.push('decimal');
  }

  const fractionMode = resolveFractionExerciseModeFromSelection();
  if (fractionMode) {
    pool.push(fractionMode);
  }

  return pool;
}

function resolveActiveExerciseMode() {
  const pool = buildExerciseModePool();
  if (pool.length === 0) {
    return null;
  }

  if (pool.length === 1) {
    return pool[0];
  }

  return 'multi-mode';
}

function getSetupStartBlockReason() {
  if (!hasSetupSelection()) {
    return 'Vyber alespoň jeden režim procvičování.';
  }

  if (resolveActiveExerciseMode() === null) {
    return 'Vyber alespoň jeden režim procvičování.';
  }

  return '';
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
  if (isMultiModeExercise()) {
    return false;
  }

  return activeExerciseMode !== 'decimal'
    && !isIntegerExerciseMode()
    && activeExerciseMode !== 'non-integer-add-subtract'
    && activeExerciseMode !== 'non-integer-multiply-divide'
    && activeExerciseMode !== 'powers';
}

function isNonIntegerAnswerInputMode() {
  const mode = getActiveAnswerInputMode();
  return mode === 'non-integer-add-subtract' || mode === 'non-integer-multiply-divide';
}

function isNonIntegerMultiplyDivideAnswerInputMode() {
  return getActiveAnswerInputMode() === 'non-integer-multiply-divide';
}

function isFractionAnswerInputMode() {
  const mode = getActiveAnswerInputMode();
  return mode === 'basic-form'
    || mode === 'fraction-add'
    || mode === 'fraction-subtract'
    || mode === 'fraction-combined'
    || mode === 'fraction-multiply'
    || mode === 'fraction-divide'
    || mode === 'fraction-compound'
    || mode === 'decimal-fraction-combined';
}

function isPowersExerciseMode() {
  return activeExerciseMode === 'powers';
}

function isMultiModeExercise() {
  return activeExerciseMode === 'multi-mode';
}

function getExerciseModeForProblem(problem) {
  if (problem?.type === 'powers') {
    return 'powers';
  }

  if (problem?.type === 'integer-add-subtract') {
    return 'integer-add-subtract';
  }

  if (problem?.type === 'integer-multiply-divide') {
    return 'integer-multiply-divide';
  }

  if (problem?.type === 'integer-mixed') {
    return 'integer-combined';
  }

  if (problem?.type === 'non-integer-add-subtract') {
    return 'non-integer-add-subtract';
  }

  if (problem?.type === 'non-integer-multiply-divide') {
    return 'non-integer-multiply-divide';
  }

  if (problem?.type === 'decimal-fraction-mixed') {
    return 'decimal-fraction-combined';
  }

  if (problem?.type === 'basic-form') {
    return 'basic-form';
  }

  if (problem?.type?.startsWith('fraction-')) {
    return problem.type;
  }

  if (problem?.operands) {
    return 'decimal';
  }

  return 'decimal';
}

function setAnswerInputModeForProblem(problem) {
  setAnswerInputMode(getExerciseModeForProblem(problem));
}

function getActiveAnswerInputMode() {
  return currentAnswerInputMode ?? activeExerciseMode;
}

function isIntegerAnswerInputMode() {
  const mode = getActiveAnswerInputMode();
  return mode === 'integer-add-subtract'
    || mode === 'integer-multiply-divide'
    || mode === 'integer-combined';
}

function isPowersAnswerInputMode() {
  return getActiveAnswerInputMode() === 'powers';
}

function usesIntegerAnswerInput() {
  return isIntegerAnswerInputMode() || isPowersAnswerInputMode();
}

function canAnswerProblem(problem) {
  return isFractionAnswerProblem(problem)
    || isIntegerArithmeticProblem(problem)
    || isPowersProblem(problem)
    || problem?.type === 'non-integer-add-subtract'
    || problem?.type === 'non-integer-multiply-divide'
    || Boolean(problem?.operands);
}

function isPowersProblem(problem) {
  return problem?.type === 'powers';
}

function isIntegerArithmeticProblem(problem) {
  return problem?.type === 'integer-add-subtract'
    || problem?.type === 'integer-multiply-divide'
    || problem?.type === 'integer-mixed';
}

function isIntegerExerciseMode() {
  return activeExerciseMode === 'integer-add-subtract'
    || activeExerciseMode === 'integer-multiply-divide'
    || activeExerciseMode === 'integer-combined';
}

function isNonIntegerExerciseMode() {
  return activeExerciseMode === 'non-integer-add-subtract'
    || activeExerciseMode === 'non-integer-multiply-divide';
}

function isNonIntegerMultiplyDivideExerciseMode() {
  return activeExerciseMode === 'non-integer-multiply-divide';
}

function getNonIntegerAnswerKind(problem) {
  if (!problem || problem.type !== 'non-integer-add-subtract') {
    return null;
  }

  return problem.answerKind ?? problem.operandKind;
}

function isNonIntegerDecimalAnswerProblem(problem) {
  return getNonIntegerAnswerKind(problem) === 'decimal';
}

function isNonIntegerFractionAnswerProblem(problem) {
  return problem?.type === 'non-integer-multiply-divide'
    || getNonIntegerAnswerKind(problem) === 'fraction';
}

function fractionAnswersMatch(userFraction, correctFraction) {
  const user = normalizeSignedFraction(userFraction);
  const correct = normalizeSignedFraction(correctFraction);

  return user.negative === correct.negative
    && user.num === correct.num
    && user.den === correct.den;
}

function fractionAnswersEquivalent(userFraction, correctFraction) {
  const user = normalizeSignedFraction(userFraction);
  const correct = normalizeSignedFraction(correctFraction);

  if (user.negative !== correct.negative || user.den === 0 || correct.den === 0) {
    return false;
  }

  return user.num * correct.den === correct.num * user.den;
}

function shouldRequireBasicFormAnswer() {
  if (currentProblem?.type === 'basic-form') {
    return true;
  }

  return requireBasicFormCheckbox?.checked ?? false;
}

function evaluateFractionAnswer(userFraction, correctFraction) {
  if (shouldRequireBasicFormAnswer()
    && !isBasicFormFraction(userFraction.num, userFraction.den)) {
    return {
      isCorrect: false,
      feedbackMessage: BASIC_FORM_REQUIRED_MESSAGE,
    };
  }

  if (fractionAnswersMatch(userFraction, correctFraction)
    || (!shouldRequireBasicFormAnswer() && fractionAnswersEquivalent(userFraction, correctFraction))) {
    return {
      isCorrect: true,
      feedbackMessage: 'Správně!',
    };
  }

  return {
    isCorrect: false,
    feedbackMessage: 'Špatně.',
  };
}

function isFractionAnswerInputShape() {
  return isFractionAnswerInputMode() && fractionAnswerInputShape === 'fraction';
}

function isNonIntegerFractionAnswerInputShape() {
  return currentProblem?.type === 'non-integer-add-subtract'
    && getNonIntegerAnswerKind(currentProblem) === 'fraction';
}

function isNonIntegerMultiplyDivideFractionAnswerInputShape() {
  return isNonIntegerMultiplyDivideAnswerInputMode()
    || isNonIntegerMultiplyDivideExerciseMode();
}

function usesFractionAnswerFields() {
  return isFractionAnswerInputShape()
    || isNonIntegerFractionAnswerInputShape()
    || isNonIntegerMultiplyDivideFractionAnswerInputShape();
}

function isNumberAnswerInputShape() {
  return isFractionAnswerInputMode() && fractionAnswerInputShape === 'number';
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

function finalizeFractionExpressionResult(result) {
  if (!result || result.num <= 0) {
    return null;
  }

  return reduceFraction(result.num, result.den);
}

function evaluateFractionExpression(terms, operators, parenthesesGroup = null) {
  if (terms.length === 2) {
    return finalizeFractionExpressionResult(
      applyFractionBinaryOperation(terms[0], terms[1], operators[0]),
    );
  }

  if (terms.length === 3 && parenthesesGroup !== null) {
    if (parenthesesGroup === 1) {
      const inner = applyFractionBinaryOperation(terms[1], terms[2], operators[1]);
      return finalizeFractionExpressionResult(
        applyFractionBinaryOperation(terms[0], inner, operators[0]),
      );
    }

    const inner = applyFractionBinaryOperation(terms[0], terms[1], operators[0]);
    return finalizeFractionExpressionResult(
      applyFractionBinaryOperation(inner, terms[2], operators[1]),
    );
  }

  const values = terms.map((term) => ({ num: term.num, den: term.den }));
  const result = evaluateExpressionWithOperatorPrecedence(
    values,
    operators,
    (left, right, operator) => applyFractionBinaryOperation(left, right, operator),
  );

  return finalizeFractionExpressionResult(result);
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

function cloneMixedTerm(term) {
  return { ...term };
}

function mixedTermToRational(term) {
  if (term.kind === 'decimal') {
    let num = toScaled(term.value, term.decimals);
    let den = 10 ** term.decimals;

    if (term.wholeFactor != null) {
      num *= term.wholeFactor;
    }

    return { num, den };
  }

  if (term.kind === 'fraction') {
    return { num: term.num, den: term.den };
  }

  if (term.kind === 'whole') {
    return { num: term.value, den: 1 };
  }

  if (term.kind === 'compound') {
    return evaluateCompoundPart({
      type: 'compound',
      numerator: term.numerator,
      denominator: term.denominator,
    });
  }

  return { num: term.value, den: 1 };
}

function rationalToMixedTerm(num, den, maxDen = 12) {
  if (num <= 0) {
    return null;
  }

  const common = gcd(num, den);
  num /= common;
  den /= common;

  if (num < den && den <= maxDen * 2) {
    return { kind: 'fraction', num, den };
  }

  for (let decimals = 1; decimals <= 2; decimals += 1) {
    const scaled = num * 10 ** decimals;
    if (scaled % den !== 0) {
      continue;
    }

    const value = fromScaled(scaled / den, decimals);
    if (value >= 0.1 && value <= 9.99) {
      return { kind: 'decimal', value, decimals };
    }
  }

  return null;
}

function randomMixedDecimalTerm(decimals = null) {
  const useOneDecimal = decimals === 1 || (decimals === null && Math.random() < 0.5);
  const actualDecimals = useOneDecimal ? 1 : 2;
  const min = actualDecimals === 1 ? 0.1 : 0.01;
  const max = actualDecimals === 1 ? 9.9 : 9.99;

  return {
    kind: 'decimal',
    value: randomDecimal(min, max, actualDecimals),
    decimals: actualDecimals,
  };
}

function randomMixedTerm(maxDen, preferDecimal = null) {
  const useDecimal = preferDecimal ?? Math.random() < 0.5;

  if (useDecimal) {
    return randomMixedDecimalTerm();
  }

  const fraction = randomProperFraction(maxDen);
  return { kind: 'fraction', num: fraction.num, den: fraction.den };
}

function mixedTermsIncludeBothTypes(terms) {
  return terms.some((term) => term.kind === 'decimal')
    && terms.some((term) => term.kind === 'fraction');
}

function maybeApplyMixedWholeFactor(terms, operators) {
  for (let i = operators.length - 1; i >= 0; i -= 1) {
    if (operators[i] !== 'multiply' || terms[i + 1].kind !== 'decimal' || terms[i + 1].wholeFactor != null) {
      continue;
    }

    if (Math.random() < 0.45) {
      terms[i + 1].wholeFactor = randomWhole(2, 9);
      return;
    }
  }
}

function evaluateMixedDecimalFractionExpression(terms, operators, parenthesesGroup = null) {
  const rationals = terms.map((term) => mixedTermToRational(term));
  return evaluateFractionExpression(rationals, operators, parenthesesGroup);
}

function generateCrossTypeParenthesisPair(innerOperator, maxDen) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (innerOperator === 'subtract') {
      const second = randomMixedTerm(maxDen);
      const secondRat = mixedTermToRational(second);
      const inner = randomProperFraction(maxDen);

      if (isUnitFraction(inner)) {
        continue;
      }

      const minuendNum = inner.num * secondRat.den + secondRat.num * inner.den;
      const minuendDen = inner.den * secondRat.den;
      const minuend = rationalToMixedTerm(minuendNum, minuendDen, maxDen);

      if (!minuend) {
        continue;
      }

      if (minuend.kind === second.kind) {
        continue;
      }

      return [minuend, cloneMixedTerm(second)];
    }

    const inner = randomProperFraction(maxDen);
    if (isUnitFraction(inner)) {
      continue;
    }

    const first = randomMixedTerm(maxDen);
    const firstRat = mixedTermToRational(first);
    const [secondNum, secondDen] = combineFractions(
      inner.num,
      inner.den,
      firstRat.num,
      firstRat.den,
      'subtract',
    );

    if (secondNum <= 0) {
      continue;
    }

    const second = rationalToMixedTerm(secondNum, secondDen, maxDen);
    if (!second || second.kind === first.kind) {
      continue;
    }

    return [cloneMixedTerm(first), second];
  }

  return null;
}

function pickCrossTypeOperators(difficultyLevel, selectedOps, operandCount = 3) {
  return pickFractionCombinedOperators(difficultyLevel, selectedOps, operandCount);
}

function createCrossTypePoolProblem(difficultyLevel) {
  if (Math.random() < 0.5) {
    const level = Math.min(difficultyLevel, getDecimalMaxLevelForSelection());
    const selected = getSelectedOperations();

    if (selected.length === 1) {
      return createSingleOperationProblem(selected[0], level);
    }

    return createMultiOperationProblem(selected, level);
  }

  const level = Math.min(difficultyLevel, getFractionCombinedMaxLevel());
  return createFractionCombinedProblem(level);
}

function createDecimalFractionMixedProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;
  const maxDen = 12;
  const selectedOps = getCrossTypeOperators();
  const operandCount = getMixedOperandCount(displayLevel, selectedOps.length);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const operators = pickCrossTypeOperators(difficultyLevel, selectedOps, operandCount);
    const useParentheses = operandCount === 3;
    const isMixed = useParentheses && operators[0] !== operators[1];
    const pickedParentheses = isMixed ? pickParenthesesGroup(operators) : null;
    const grouping = isMixed ? resolveParenthesesGroup(operators, pickedParentheses) : null;
    let terms;

    if (operandCount === 3 && grouping === 0) {
      const pair = generateCrossTypeParenthesisPair(operators[0], maxDen);
      if (!pair) {
        continue;
      }
      terms = [pair[0], pair[1], randomMixedTerm(maxDen, pair[0].kind !== 'decimal')];
    } else if (operandCount === 3 && grouping === 1) {
      const pair = generateCrossTypeParenthesisPair(operators[1], maxDen);
      if (!pair) {
        continue;
      }
      terms = [randomMixedTerm(maxDen, pair[0].kind !== 'decimal'), pair[0], pair[1]];
    } else if (operandCount === 3) {
      terms = [
        randomMixedTerm(maxDen, true),
        randomMixedTerm(maxDen, false),
        randomMixedTerm(maxDen),
      ];
    } else {
      terms = [
        randomMixedTerm(maxDen, true),
        randomMixedTerm(maxDen, false),
        randomMixedTerm(maxDen, true),
        randomMixedTerm(maxDen, false),
      ];
    }

    if (!mixedTermsIncludeBothTypes(terms)) {
      continue;
    }

    maybeApplyMixedWholeFactor(terms, operators);

    const answer = evaluateMixedDecimalFractionExpression(terms, operators, grouping);
    if (!answer || answer.num <= 0) {
      continue;
    }

    if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
      continue;
    }

    if (gcd(answer.num, answer.den) !== 1) {
      continue;
    }

    return {
      type: 'decimal-fraction-mixed',
      terms: terms.map(cloneMixedTerm),
      operators,
      parenthesesGroup: grouping,
      answerNum: answer.num,
      answerDen: answer.den,
      level: displayLevel,
      isRetry: false,
    };
  }

  return {
    type: 'decimal-fraction-mixed',
    terms: [
      { kind: 'decimal', value: 0.2, decimals: 1 },
      { kind: 'fraction', num: 3, den: 4 },
      { kind: 'decimal', value: 1.2, decimals: 1, wholeFactor: 3 },
    ],
    operators: ['divide', 'add'],
    parenthesesGroup: null,
    answerNum: 58,
    answerDen: 15,
    level: displayLevel,
    isRetry: false,
  };
}

function createDecimalFractionCombinedProblem(difficultyLevel) {
  if (shouldUseCrossTypeMixedProblem(difficultyLevel)) {
    return createDecimalFractionMixedProblem(difficultyLevel);
  }

  return createCrossTypePoolProblem(difficultyLevel);
}

function pickFractionCombinedOperators(difficultyLevel, selectedOps, operandCount = 3) {
  if (operandCount > 3) {
    return pickOperatorsForMultiOperandProblem(difficultyLevel, selectedOps, operandCount);
  }

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
  const operandCount = getMixedOperandCount(displayLevel, selectedOps.length);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const operators = pickFractionCombinedOperators(difficultyLevel, selectedOps, operandCount);
    const useParentheses = operandCount === 3;
    const isMixed = useParentheses && operators[0] !== operators[1];
    const pickedParentheses = isMixed ? pickParenthesesGroup(operators) : null;
    const grouping = isMixed ? resolveParenthesesGroup(operators, pickedParentheses) : null;
    let terms;

    if (operandCount === 3 && grouping === 0) {
      const pair = generateFractionParenthesisPair(operators[0], maxDen);
      if (!pair) {
        continue;
      }
      terms = [pair[0], pair[1], randomProperFraction(maxDen)];
    } else if (operandCount === 3 && grouping === 1) {
      const pair = generateFractionParenthesisPair(operators[1], maxDen);
      if (!pair) {
        continue;
      }
      terms = [randomProperFraction(maxDen), pair[0], pair[1]];
    } else {
      terms = Array.from({ length: operandCount }, () => randomProperFraction(maxDen));
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

function cloneCompoundPart(part) {
  if (part.type === 'fraction') {
    return { type: 'fraction', num: part.num, den: part.den };
  }

  if (part.type === 'whole') {
    return { type: 'whole', value: part.value };
  }

  if (part.type === 'fraction-expr') {
    return {
      type: 'fraction-expr',
      terms: part.terms.map((term) => ({ ...term })),
      operators: [...part.operators],
      parenthesesGroup: part.parenthesesGroup ?? null,
    };
  }

  if (part.type === 'mixed-expr') {
    return {
      type: 'mixed-expr',
      terms: part.terms.map(cloneCompoundMixedTerm),
      operators: [...part.operators],
      parenthesesGroup: part.parenthesesGroup ?? null,
    };
  }

  if (part.type === 'compound') {
    return {
      type: 'compound',
      numerator: cloneCompoundPart(part.numerator),
      denominator: cloneCompoundPart(part.denominator),
    };
  }

  return part;
}

function cloneCompoundMixedTerm(term) {
  if (term.kind === 'compound') {
    return {
      kind: 'compound',
      numerator: cloneCompoundPart(term.numerator),
      denominator: cloneCompoundPart(term.denominator),
    };
  }

  return cloneMixedTerm(term);
}

function evaluateCompoundPart(part) {
  if (part.type === 'fraction') {
    return reduceFraction(part.num, part.den);
  }

  if (part.type === 'whole') {
    return { num: part.value, den: 1 };
  }

  if (part.type === 'fraction-expr') {
    return evaluateFractionExpression(part.terms, part.operators, part.parenthesesGroup ?? null);
  }

  if (part.type === 'mixed-expr') {
    const rationals = part.terms.map((term) => mixedTermToRational(term));
    return evaluateFractionExpression(rationals, part.operators, part.parenthesesGroup ?? null);
  }

  if (part.type === 'compound') {
    const numerator = evaluateCompoundPart(part.numerator);
    const denominator = evaluateCompoundPart(part.denominator);

    if (!numerator || !denominator || denominator.num <= 0) {
      return null;
    }

    const raw = divideFractionByFraction(numerator, denominator);
    return reduceFraction(raw.num, raw.den);
  }

  return null;
}

function tryBuildCompoundFractionProblem(numerator, denominator, displayLevel) {
  const numRat = evaluateCompoundPart(numerator);
  const denRat = evaluateCompoundPart(denominator);

  if (!numRat || !denRat || numRat.num <= 0 || denRat.num <= 0) {
    return null;
  }

  const raw = divideFractionByFraction(numRat, denRat);
  const answer = reduceFraction(raw.num, raw.den);

  if (answer.num <= 0
    || answer.num > FRACTION_ADD_ANSWER_MAX
    || answer.den > FRACTION_ADD_ANSWER_MAX
    || gcd(answer.num, answer.den) !== 1) {
    return null;
  }

  return {
    type: 'fraction-compound',
    numerator: cloneCompoundPart(numerator),
    denominator: cloneCompoundPart(denominator),
    answerNum: answer.num,
    answerDen: answer.den,
    level: displayLevel,
    isRetry: false,
  };
}

function generateCompoundFractionExpr(maxDen) {
  const operator = pickRandomItem(COMPOUND_FRACTION_OPS);

  for (let attempt = 0; attempt < 150; attempt += 1) {
    const first = randomProperFraction(maxDen);
    const second = randomProperFraction(maxDen);
    const result = applyFractionBinaryOperation(first, second, operator);

    if (!result || result.num <= 0) {
      continue;
    }

    return {
      type: 'fraction-expr',
      terms: [{ num: first.num, den: first.den }, { num: second.num, den: second.den }],
      operators: [operator],
    };
  }

  return null;
}

function generateSimpleCompoundPair() {
  const variant = Math.floor(Math.random() * 3);

  if (variant === 0) {
    const fraction = randomProperFraction(10);
    return {
      numerator: { type: 'fraction', num: fraction.num, den: fraction.den },
      denominator: { type: 'whole', value: randomWhole(2, 9) },
    };
  }

  if (variant === 1) {
    const fraction = randomProperFraction(10);
    return {
      numerator: { type: 'whole', value: randomWhole(2, 9) },
      denominator: { type: 'fraction', num: fraction.num, den: fraction.den },
    };
  }

  const dividend = randomProperFraction(10);
  const divisor = randomProperFraction(10);

  return {
    numerator: { type: 'fraction', num: dividend.num, den: dividend.den },
    denominator: { type: 'fraction', num: divisor.num, den: divisor.den },
  };
}

function compoundMixedSideHasDecimalAndFraction(terms) {
  let hasDecimal = false;
  let hasFraction = false;

  terms.forEach((term) => {
    if (term.kind === 'decimal') {
      hasDecimal = true;
    }

    if (term.kind === 'fraction') {
      hasFraction = true;
    }

    if (term.kind === 'compound') {
      hasFraction = true;
    }
  });

  return hasDecimal && hasFraction;
}

function generateCompoundMixedSideExpr(maxDen, operator, useNestedCompound) {
  for (let attempt = 0; attempt < 150; attempt += 1) {
    let terms;

    if (useNestedCompound) {
      const nested = generateSimpleCompoundPair();
      terms = [
        {
          kind: 'compound',
          numerator: nested.numerator,
          denominator: nested.denominator,
        },
        randomMixedTerm(maxDen, Math.random() < 0.5),
      ];
    } else {
      terms = [
        randomMixedTerm(maxDen, true),
        randomMixedTerm(maxDen, false),
      ];
    }

    if (Math.random() < 0.35) {
      terms[1] = { kind: 'whole', value: randomWhole(1, 9) };
    }

    if (!compoundMixedSideHasDecimalAndFraction(terms)) {
      continue;
    }

    const rationals = terms.map((term) => mixedTermToRational(term));
    const result = evaluateFractionExpression(rationals, [operator]);

    if (!result || result.num <= 0) {
      continue;
    }

    return {
      type: 'mixed-expr',
      terms: terms.map(cloneCompoundMixedTerm),
      operators: [operator],
    };
  }

  return null;
}

function createCompoundFractionLevel1FractionOverWhole(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const wholeDivisor = randomWhole(2, 9);
    const fraction = randomProperFraction(12);
    const problem = tryBuildCompoundFractionProblem(
      { type: 'fraction', num: fraction.num, den: fraction.den },
      { type: 'whole', value: wholeDivisor },
      displayLevel,
    );

    if (problem) {
      return problem;
    }
  }

  return tryBuildCompoundFractionProblem(
    { type: 'fraction', num: 2, den: 3 },
    { type: 'whole', value: 5 },
    displayLevel,
  );
}

function createCompoundFractionLevel1WholeOverFraction(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const divisor = randomProperFraction(12);
    const wholeDividend = randomWhole(2, 12);
    const raw = divideWholeByFraction(wholeDividend, divisor);

    if (gcd(raw.num, raw.den) !== 1) {
      continue;
    }

    const problem = tryBuildCompoundFractionProblem(
      { type: 'whole', value: wholeDividend },
      { type: 'fraction', num: divisor.num, den: divisor.den },
      displayLevel,
    );

    if (problem) {
      return problem;
    }
  }

  return tryBuildCompoundFractionProblem(
    { type: 'whole', value: 6 },
    { type: 'fraction', num: 2, den: 3 },
    displayLevel,
  );
}

function createCompoundFractionLevel1Problem(displayLevel) {
  if (Math.random() < 0.5) {
    return createCompoundFractionLevel1WholeOverFraction(displayLevel);
  }

  return createCompoundFractionLevel1FractionOverWhole(displayLevel);
}

function createCompoundFractionLevel2Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const dividend = randomProperFraction(14);
    const divisor = randomProperFraction(14);
    const problem = tryBuildCompoundFractionProblem(
      { type: 'fraction', num: dividend.num, den: dividend.den },
      { type: 'fraction', num: divisor.num, den: divisor.den },
      displayLevel,
    );

    if (problem) {
      return problem;
    }
  }

  return tryBuildCompoundFractionProblem(
    { type: 'fraction', num: 2, den: 3 },
    { type: 'fraction', num: 4, den: 5 },
    displayLevel,
  );
}

function createCompoundFractionLevel3Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const expr = generateCompoundFractionExpr(14);

    if (!expr) {
      continue;
    }

    const simple = randomProperFraction(14);
    const exprOnTop = Math.random() < 0.5;
    const numerator = exprOnTop
      ? expr
      : { type: 'fraction', num: simple.num, den: simple.den };
    const denominator = exprOnTop
      ? { type: 'fraction', num: simple.num, den: simple.den }
      : expr;
    const problem = tryBuildCompoundFractionProblem(numerator, denominator, displayLevel);

    if (problem) {
      return problem;
    }
  }

  return tryBuildCompoundFractionProblem(
    {
      type: 'fraction-expr',
      terms: [{ num: 1, den: 2 }, { num: 1, den: 3 }],
      operators: ['add'],
    },
    { type: 'fraction', num: 2, den: 5 },
    displayLevel,
  );
}

function createCompoundFractionLevel4Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const numeratorExpr = generateCompoundFractionExpr(16);
    const denominatorExpr = generateCompoundFractionExpr(16);

    if (!numeratorExpr || !denominatorExpr) {
      continue;
    }

    const problem = tryBuildCompoundFractionProblem(numeratorExpr, denominatorExpr, displayLevel);

    if (problem) {
      return problem;
    }
  }

  return tryBuildCompoundFractionProblem(
    {
      type: 'fraction-expr',
      terms: [{ num: 1, den: 2 }, { num: 1, den: 3 }],
      operators: ['add'],
    },
    {
      type: 'fraction-expr',
      terms: [{ num: 2, den: 5 }, { num: 1, den: 4 }],
      operators: ['multiply'],
    },
    displayLevel,
  );
}

function createCompoundFractionLevel5Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const numeratorOperator = pickRandomItem(COMPOUND_FRACTION_OPS);
    let denominatorOperator = pickRandomItem(COMPOUND_FRACTION_OPS);

    for (let pickAttempt = 0; pickAttempt < 20 && denominatorOperator === numeratorOperator; pickAttempt += 1) {
      denominatorOperator = pickRandomItem(COMPOUND_FRACTION_OPS);
    }

    const includeNested = Math.random() < 0.45;
    const numeratorExpr = generateCompoundMixedSideExpr(12, numeratorOperator, includeNested);
    const denominatorExpr = generateCompoundMixedSideExpr(
      12,
      denominatorOperator,
      includeNested && Math.random() < 0.5,
    );

    if (!numeratorExpr || !denominatorExpr) {
      continue;
    }

    const problem = tryBuildCompoundFractionProblem(numeratorExpr, denominatorExpr, displayLevel);

    if (problem) {
      return problem;
    }
  }

  return tryBuildCompoundFractionProblem(
    {
      type: 'mixed-expr',
      terms: [
        {
          kind: 'compound',
          numerator: { type: 'fraction', num: 2, den: 3 },
          denominator: { type: 'whole', value: 5 },
        },
        { kind: 'whole', value: 1 },
      ],
      operators: ['add'],
    },
    {
      type: 'mixed-expr',
      terms: [
        { kind: 'fraction', num: 4, den: 15 },
        { kind: 'fraction', num: 30, den: 80 },
      ],
      operators: ['multiply'],
    },
    displayLevel,
  );
}

function createCompoundFractionProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 1) {
    return createCompoundFractionLevel1Problem(displayLevel);
  }

  if (displayLevel === 2) {
    return createCompoundFractionLevel2Problem(displayLevel);
  }

  if (displayLevel === 3) {
    return createCompoundFractionLevel3Problem(displayLevel);
  }

  if (displayLevel === 4) {
    return createCompoundFractionLevel4Problem(displayLevel);
  }

  return createCompoundFractionLevel5Problem(displayLevel);
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

function isMultiplyOrDivide(op) {
  return op === 'multiply' || op === 'divide';
}

function evaluateExpressionWithOperatorPrecedence(values, operators, applyBinaryOperation) {
  if (values.length === 0) {
    return null;
  }

  if (values.length === 1) {
    return values[0];
  }

  const workingValues = [...values];
  const workingOperators = [...operators];

  for (let i = 0; i < workingOperators.length; ) {
    if (isMultiplyOrDivide(workingOperators[i])) {
      const result = applyBinaryOperation(
        workingValues[i],
        workingValues[i + 1],
        workingOperators[i],
      );

      if (result === null) {
        return null;
      }

      workingValues.splice(i, 2, result);
      workingOperators.splice(i, 1);
    } else {
      i += 1;
    }
  }

  let result = workingValues[0];

  for (let i = 0; i < workingOperators.length; i += 1) {
    result = applyBinaryOperation(result, workingValues[i + 1], workingOperators[i]);

    if (result === null) {
      return null;
    }
  }

  return result;
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
    if (operands.length >= 4) {
      let num = toScaled(operands[0].value, operands[0].decimals);
      let den = 10 ** operands[0].decimals;

      for (let i = 0; i < resolvedOperators.length; i += 1) {
        const nextNum = toScaled(operands[i + 1].value, operands[i + 1].decimals);
        const nextDen = 10 ** operands[i + 1].decimals;
        [num, den] = combineFractions(num, den, nextNum, nextDen, resolvedOperators[i]);

        if (num <= 0) {
          return null;
        }
      }

      return finalizeRationalAnswer(num, den, answerDecimals);
    }

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

  if (operands.length >= 4) {
    const values = operands.map((operand) => operand.value);
    result = evaluateExpressionWithOperatorPrecedence(
      values,
      resolvedOperators,
      (left, right, operator) => applyOperator(left, right, operator),
    );

    if (result === null) {
      return null;
    }

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
  return Math.abs(userAnswer - correctAnswer) <= epsilon;
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

function getMaxDifficultyLevelForMode(mode) {
  if (mode === 'basic-form') {
    return FRACTION_BASIC_FORM_MAX_LEVEL;
  }

  if (mode === 'integer-add-subtract') {
    return INTEGER_ADD_SUBTRACT_MAX_LEVEL;
  }

  if (mode === 'integer-multiply-divide') {
    return INTEGER_MULTIPLY_DIVIDE_MAX_LEVEL;
  }

  if (mode === 'integer-combined') {
    return INTEGER_COMBINED_MAX_LEVEL;
  }

  if (mode === 'non-integer-add-subtract') {
    return NON_INTEGER_ADD_SUBTRACT_MAX_LEVEL;
  }

  if (mode === 'non-integer-multiply-divide') {
    return NON_INTEGER_MULTIPLY_DIVIDE_MAX_LEVEL;
  }

  if (mode === 'powers') {
    return POWER_MAX_LEVEL;
  }

  if (mode === 'decimal-fraction-combined') {
    return getCrossTypeCombinedMaxLevel();
  }

  if (mode === 'fraction-add') {
    return FRACTION_ADD_MAX_LEVEL;
  }

  if (mode === 'fraction-subtract') {
    return FRACTION_SUBTRACT_MAX_LEVEL;
  }

  if (mode === 'fraction-combined') {
    return getFractionCombinedMaxLevel();
  }

  if (mode === 'fraction-multiply') {
    return FRACTION_MULTIPLY_MAX_LEVEL;
  }

  if (mode === 'fraction-divide') {
    return FRACTION_DIVIDE_MAX_LEVEL;
  }

  if (mode === 'fraction-compound') {
    return FRACTION_COMPOUND_MAX_LEVEL;
  }

  if (mode !== 'decimal') {
    return 0;
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

function getMaxDifficultyLevel() {
  if (activeExerciseMode === 'multi-mode') {
    return Math.min(...activeExerciseModePool.map(getMaxDifficultyLevelForMode));
  }

  return getMaxDifficultyLevelForMode(activeExerciseMode);
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

function pickOperatorsForMultiOperandProblem(level, regularOps, operandCount) {
  const operatorCount = operandCount - 1;

  if (operatorCount === 2) {
    return pickOperatorsForLevel(level, regularOps);
  }

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const operators = Array.from({ length: operatorCount }, () => pickRandomItem(regularOps));

    if (level >= MULTI_OP_EXTRA_MIXED_START_LEVEL && new Set(operators).size === 1) {
      continue;
    }

    return operators;
  }

  return Array.from({ length: operatorCount }, (_, index) => regularOps[index % regularOps.length]);
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

function formatIntegerArithmeticOperatorSymbol(operator, forText = false) {
  if (operator === 'subtract') {
    return forText ? ' - ' : ' − ';
  }

  if (operator === 'multiply') {
    return forText ? ' · ' : '·';
  }

  if (operator === 'divide') {
    return forText ? ' : ' : ':';
  }

  return forText ? ' + ' : ' + ';
}

function integerTermNeedsParensAfterOperator(term, precedingOperator) {
  if (!precedingOperator || term.wrapped) {
    return false;
  }

  return getIntegerTermValue(term) < 0;
}

function formatIntegerTermText(term, precedingOperator = null) {
  const value = getIntegerTermValue(term);

  if (term.wrapped && value < 0) {
    return `(${value})`;
  }

  if (integerTermNeedsParensAfterOperator(term, precedingOperator)) {
    return `(${value})`;
  }

  return String(value);
}

function formatIntegerTermHtml(term, precedingOperator = null) {
  return `<span class="problem-expression__term">${escapeHtml(formatIntegerTermText(term, precedingOperator))}</span>`;
}

function toPositiveIntegerTerm(term) {
  return {
    magnitude: term.magnitude,
    sign: 1,
    wrapped: term.wrapped,
  };
}

function toPositiveNonIntegerTerm(term) {
  if (term.kind === 'decimal') {
    return {
      kind: 'decimal',
      magnitude: term.magnitude,
      sign: 1,
      wrapped: term.wrapped,
    };
  }

  return {
    kind: 'fraction',
    num: term.num,
    den: term.den,
    sign: 1,
    wrapped: term.wrapped,
  };
}

function resolveSingleOperatorDisplay(operator, term, getTermValue) {
  const value = getTermValue(term);

  if (term.wrapped) {
    return { operator, term };
  }

  if (operator === 'add' && value < 0) {
    return { operator: 'subtract', term: toPositiveNonIntegerTerm(term) };
  }

  if (operator === 'subtract' && value < 0) {
    return { operator: 'add', term: toPositiveNonIntegerTerm(term) };
  }

  return { operator, term };
}

function resolveSingleIntegerOperatorDisplay(operator, term) {
  const value = getIntegerTermValue(term);

  if (term.wrapped) {
    return { operator, term };
  }

  if (operator === 'add' && value < 0) {
    return { operator: 'subtract', term: toPositiveIntegerTerm(term) };
  }

  if (operator === 'subtract' && value < 0) {
    return { operator: 'add', term: toPositiveIntegerTerm(term) };
  }

  return { operator, term };
}

function formatIntegerArithmeticDisplayHtml(problem) {
  let html = formatIntegerTermHtml(problem.terms[0]);

  if (problem.level === 1 && problem.terms.length === 2
    && (problem.operators[0] === 'add' || problem.operators[0] === 'subtract')) {
    const resolved = resolveSingleIntegerOperatorDisplay(problem.operators[0], problem.terms[1]);
    html += `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(resolved.operator)}</span>${formatIntegerTermHtml(resolved.term)}`;
    return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
  }

  problem.operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(operator)}</span>${formatIntegerTermHtml(problem.terms[index + 1], operator)}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function formatIntegerArithmeticProblemText(problem) {
  let text = formatIntegerTermText(problem.terms[0]);

  if (problem.level === 1 && problem.terms.length === 2
    && (problem.operators[0] === 'add' || problem.operators[0] === 'subtract')) {
    const resolved = resolveSingleIntegerOperatorDisplay(problem.operators[0], problem.terms[1]);
    text += `${formatIntegerArithmeticOperatorSymbol(resolved.operator, true)}${formatIntegerTermText(resolved.term)}`;
    return `${text} =`;
  }

  problem.operators.forEach((operator, index) => {
    text += `${formatIntegerArithmeticOperatorSymbol(operator, true)}${formatIntegerTermText(problem.terms[index + 1], operator)}`;
  });

  return `${text} =`;
}

function formatIntegerAnswer(value) {
  return String(value);
}

function formatNonIntegerDecimalTermText(term) {
  const value = getNonIntegerTermValue(term);

  if (term.wrapped && value < 0) {
    return `(${formatDecimal(value, 1)})`;
  }

  return formatDecimal(value, 1);
}

function formatNonIntegerFractionTermText(term) {
  const value = getNonIntegerTermValue(term);
  const signedText = formatSignedFractionText({
    num: term.num,
    den: term.den,
    negative: value < 0,
  });

  if (term.wrapped && value < 0) {
    return `(${signedText})`;
  }

  return signedText;
}

function formatNonIntegerTermText(term) {
  if (term.kind === 'decimal') {
    return formatNonIntegerDecimalTermText(term);
  }

  return formatNonIntegerFractionTermText(term);
}

function formatNonIntegerFractionSignHtml() {
  return '<span class="problem-expression__operator" aria-hidden="true">−</span>';
}

function formatNonIntegerFractionTermHtml(term) {
  const value = getNonIntegerTermValue(term);
  const fractionHtml = formatSingleFractionHtml(term.num, term.den, false);
  const isNegative = value < 0;

  if (term.wrapped && isNegative) {
    return `<span class="problem-expression__term">(${formatNonIntegerFractionSignHtml()}${fractionHtml})</span>`;
  }

  if (isNegative) {
    return `${formatNonIntegerFractionSignHtml()}${fractionHtml}`;
  }

  return fractionHtml;
}

function formatNonIntegerTermHtml(term) {
  if (term.kind === 'decimal') {
    return `<span class="problem-expression__term">${escapeHtml(formatNonIntegerDecimalTermText(term))}</span>`;
  }

  return formatNonIntegerFractionTermHtml(term);
}

function formatNonIntegerAddSubtractDisplayHtml(problem) {
  let html = formatNonIntegerTermHtml(problem.terms[0]);

  if (problem.level === 1 && problem.terms.length === 2) {
    const resolved = resolveSingleOperatorDisplay(
      problem.operators[0],
      problem.terms[1],
      getNonIntegerTermValue,
    );
    html += `<span class="problem-expression__operator">${formatIntegerOperatorSymbol(resolved.operator)}</span>${formatNonIntegerTermHtml(resolved.term)}`;
    return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
  }

  problem.operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatIntegerOperatorSymbol(operator)}</span>${formatNonIntegerTermHtml(problem.terms[index + 1])}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function formatNonIntegerAddSubtractProblemText(problem) {
  let text = formatNonIntegerTermText(problem.terms[0]);

  if (problem.level === 1 && problem.terms.length === 2) {
    const resolved = resolveSingleOperatorDisplay(
      problem.operators[0],
      problem.terms[1],
      getNonIntegerTermValue,
    );
    text += `${formatIntegerOperatorSymbol(resolved.operator, true)}${formatNonIntegerTermText(resolved.term)}`;
    return `${text} =`;
  }

  problem.operators.forEach((operator, index) => {
    text += `${formatIntegerOperatorSymbol(operator, true)}${formatNonIntegerTermText(problem.terms[index + 1])}`;
  });

  return `${text} =`;
}

function formatNonIntegerMultiplyDivideFractionTermText(term) {
  const numText = term.sign < 0 ? `-${term.num}` : String(term.num);

  return `${numText}/${term.den}`;
}

function formatNonIntegerMultiplyDivideFractionTermHtml(term) {
  const numText = term.sign < 0 ? `-${term.num}` : String(term.num);

  return `<span class="fraction" aria-label="${escapeHtml(numText)}/${escapeHtml(term.den)}"><span class="fraction__num">${escapeHtml(numText)}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${escapeHtml(term.den)}</span></span>`;
}

function formatNonIntegerMultiplyDivideDisplayHtml(problem) {
  let html = `<span class="problem-expression__term">${formatNonIntegerMultiplyDivideFractionTermHtml(problem.terms[0])}</span>`;

  problem.operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(operator)}</span><span class="problem-expression__term">${formatNonIntegerMultiplyDivideFractionTermHtml(problem.terms[index + 1])}</span>`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function formatNonIntegerMultiplyDivideProblemText(problem) {
  let text = formatNonIntegerMultiplyDivideFractionTermText(problem.terms[0]);

  problem.operators.forEach((operator, index) => {
    text += `${formatIntegerArithmeticOperatorSymbol(operator, true)}${formatNonIntegerMultiplyDivideFractionTermText(problem.terms[index + 1])}`;
  });

  return `${text} =`;
}

function parseFractionAnswerWithSignedNumerator(numeratorText, denominatorText) {
  const numText = numeratorText.trim();
  const denText = denominatorText.trim();
  const maxValue = getFractionAnswerMaxValue();

  if (!/^-?\d+$/.test(numText) || !/^\d+$/.test(denText)) {
    return null;
  }

  const parsedNum = Number(numText);
  const den = Number(denText);

  if (den === 0 || Math.abs(parsedNum) > maxValue || den > maxValue) {
    return null;
  }

  if (parsedNum < 0) {
    return {
      num: Math.abs(parsedNum),
      den,
      negative: true,
    };
  }

  return {
    num: parsedNum,
    den,
    negative: false,
  };
}

function parseSignedFractionAnswerFromFields(numeratorText, denominatorText) {
  const parsed = parseFractionAnswerFromFields(numeratorText, denominatorText);

  if (parsed === null) {
    return null;
  }

  return {
    ...parsed,
    negative: isAnswerFractionNegative(),
  };
}

function getNonIntegerFractionAnswerFromInputs() {
  if (isNonIntegerMultiplyDivideFractionAnswerInputShape()) {
    return parseFractionAnswerWithSignedNumerator(answerNumeratorEl.value, answerDenominatorEl.value);
  }

  return parseSignedFractionAnswerFromFields(answerNumeratorEl.value, answerDenominatorEl.value);
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

  for (let i = 0; i < operators.length; i += 1) {
    if (operators[i] === 'multiply' || operators[i] === 'divide') {
      indices.add(i);
      indices.add(i + 1);
    }
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
  for (let i = 0; i < operators.length; i += 1) {
    if (!combinedFriendlyPairIsValid(operands, i, operators[i])) {
      return false;
    }
  }

  return true;
}

function divisorsAreNonZero(operands, operators) {
  for (let i = 0; i < operators.length; i += 1) {
    if (operators[i] === 'divide' && operands[i + 1].value === 0) {
      return false;
    }
  }

  return true;
}

function isMultiOperandProblemValid(
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

function isThreeOperandProblemValid(
  operands,
  operators,
  answer,
  combinedMode,
  answerDecimals,
  parenthesesGroup = null,
) {
  return isMultiOperandProblemValid(
    operands,
    operators,
    answer,
    combinedMode,
    answerDecimals,
    parenthesesGroup,
  );
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

  for (let i = 1; i < operators.length; i += 1) {
    if (operators[i] === 'multiply' && operators[i - 1] !== 'multiply') {
      fillCombinedFriendlyPair(operands, i, config);
    } else if (operators[i] === 'divide' && operators[i - 1] !== 'divide') {
      fillCombinedDividePair(operands, i, config);
    }
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

function createMultiOperandMixedDecimalProblem(
  level,
  config,
  operators,
  combinedMode = false,
  operandCount = 3,
) {
  let operands;
  let answer;
  let parenthesesGroup;
  const restrictedIndices = combinedMode && (operators.includes('multiply') || operators.includes('divide'))
    ? getRestrictedOperandIndices(operators)
    : new Set();

  do {
    const eligibleForTwoDecimals = Array.from({ length: operandCount }, (_, index) => index)
      .filter((index) => !restrictedIndices.has(index));
    const twoDecimalCount = eligibleForTwoDecimals.length === 0
      ? 0
      : Math.min(Math.random() < 0.5 ? 1 : 2, eligibleForTwoDecimals.length);
    const shuffledIndices = [...eligibleForTwoDecimals].sort(() => Math.random() - 0.5);
    const twoDecimalIndices = new Set(shuffledIndices.slice(0, twoDecimalCount));

    operands = Array.from({ length: operandCount }, (__, index) => {
      if (twoDecimalIndices.has(index)) {
        return {
          value: randomDecimal(0.01, 9.99, 2),
          decimals: 2,
        };
      }

      return randomOneDecimalOperand(config);
    });

    parenthesesGroup = operandCount === 3 ? pickParenthesesGroup(operators) : null;

    if (combinedMode) {
      applyCombinedFriendlyRules(operands, operators, config);
    }

    answer = computeAnswer(operands, operators, 2, parenthesesGroup);
  } while (!isMultiOperandProblemValid(operands, operators, answer, combinedMode, 2, parenthesesGroup));

  return buildProblem(operands, operators, 2, level + 1, false, null, parenthesesGroup);
}

function createThreeMixedDecimalProblem(level, config, operators, combinedMode = false) {
  return createMultiOperandMixedDecimalProblem(level, config, operators, combinedMode, 3);
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
  const operandCount = getMixedOperandCount(level + 1, regularOps.length);

  if (operandCount === MULTI_OPERAND_COUNT) {
    const multiOperators = pickOperatorsForMultiOperandProblem(level, regularOps, operandCount);
    return createMultiOperandMixedDecimalProblem(
      level,
      DIFFICULTY_LEVELS[4],
      multiOperators,
      true,
      operandCount,
    );
  }

  if (level >= MULTI_OP_EXTRA_MIXED_START_LEVEL) {
    return createThreeMixedDecimalProblem(level, DIFFICULTY_LEVELS[4], operators, true);
  }

  return createThreeOneDecimalProblem(level, DIFFICULTY_LEVELS[3], operators, true);
}

function getIntegerTermValue(term) {
  return term.sign * term.magnitude;
}

function applyIntegerBinaryOperation(left, right, operator) {
  if (operator === 'add') {
    return left + right;
  }

  if (operator === 'subtract') {
    return left - right;
  }

  if (operator === 'multiply') {
    return left * right;
  }

  if (operator === 'divide') {
    if (right === 0) {
      return null;
    }

    const next = left / right;
    return Number.isInteger(next) ? next : null;
  }

  return null;
}

function evaluateIntegerArithmeticExpression(terms, operators) {
  const values = terms.map(getIntegerTermValue);
  const result = evaluateExpressionWithOperatorPrecedence(
    values,
    operators,
    applyIntegerBinaryOperation,
  );

  if (result === null || !Number.isFinite(result)) {
    return null;
  }

  return result;
}

function evaluateIntegerExpression(terms, operators) {
  return evaluateIntegerArithmeticExpression(terms, operators);
}

function integerExpressionHasNegativeValue(terms) {
  return terms.some((term) => getIntegerTermValue(term) < 0);
}

function createIntegerTerm(magnitude, sign, wrapped = false) {
  return { magnitude, sign, wrapped };
}

function pickIntegerOperator(displayLevel) {
  if (displayLevel === 2 || displayLevel === 4) {
    return 'add';
  }

  return Math.random() < 0.5 ? 'add' : 'subtract';
}

function pickIntegerOperandCount(displayLevel) {
  if (displayLevel === 1 || displayLevel === 3) {
    return 2;
  }

  return Math.random() < 0.5 ? 3 : 4;
}

function integerLevelRequiresWrapped(displayLevel) {
  return displayLevel === 3;
}

function integerLevelRequiresWrappedBetweenAllPairs(displayLevel) {
  return displayLevel === 4;
}

function buildIntegerAddSubtractProblem(terms, operators, displayLevel) {
  return {
    type: 'integer-add-subtract',
    terms,
    operators,
    answer: evaluateIntegerArithmeticExpression(terms, operators),
    level: displayLevel,
    isRetry: false,
  };
}

function buildIntegerMultiplyDivideProblem(terms, operators, displayLevel) {
  return {
    type: 'integer-multiply-divide',
    terms,
    operators,
    answer: evaluateIntegerArithmeticExpression(terms, operators),
    level: displayLevel,
    isRetry: false,
  };
}

function buildIntegerMixedProblem(terms, operators, displayLevel) {
  return {
    type: 'integer-mixed',
    terms,
    operators,
    answer: evaluateIntegerArithmeticExpression(terms, operators),
    level: displayLevel,
    isRetry: false,
  };
}

function isValidIntegerAddSubtractProblem(terms, operators, displayLevel) {
  if (integerLevelRequiresWrappedBetweenAllPairs(displayLevel)) {
    if (operators.some((operator) => operator !== 'add')) {
      return false;
    }

    if (terms.length < 3 || terms[0].wrapped) {
      return false;
    }

    for (let i = 1; i < terms.length; i += 1) {
      if (!terms[i].wrapped || terms[i].sign >= 0) {
        return false;
      }
    }
  } else if (integerLevelRequiresWrapped(displayLevel)) {
    if (terms.length !== 2 || !terms.some((term) => term.wrapped)) {
      return false;
    }
  } else if (terms.some((term) => term.wrapped)) {
    return false;
  }

  const answer = evaluateIntegerExpression(terms, operators);
  if (!Number.isInteger(answer) || answer < INTEGER_ANSWER_MIN || answer > INTEGER_ANSWER_MAX) {
    return false;
  }

  if (!integerExpressionHasNegativeValue(terms) && answer >= 0) {
    return false;
  }

  return true;
}

function generateIntegerLevel4Terms(operandCount) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = [
      createIntegerTerm(
        randomWhole(INTEGER_OPERAND_MIN, INTEGER_OPERAND_MAX),
        Math.random() < 0.5 ? -1 : 1,
        false,
      ),
    ];

    for (let i = 1; i < operandCount; i += 1) {
      terms.push(createIntegerTerm(
        randomWhole(INTEGER_OPERAND_MIN, INTEGER_OPERAND_MAX),
        -1,
        true,
      ));
    }

    const operators = Array.from({ length: operandCount - 1 }, () => 'add');
    if (isValidIntegerAddSubtractProblem(terms, operators, 4)) {
      return { terms, operators };
    }
  }

  return null;
}

function pickIntegerOperatorFromPool(displayLevel, allowedOps = null) {
  if (allowedOps && allowedOps.length > 0) {
    return pickRandomItem(allowedOps);
  }

  return pickIntegerOperator(displayLevel);
}

function generateIntegerTerms(displayLevel, operandCount, allowedOps = null) {
  if (integerLevelRequiresWrappedBetweenAllPairs(displayLevel)) {
    return generateIntegerLevel4Terms(operandCount);
  }

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = [];
    let hasWrapped = false;

    for (let i = 0; i < operandCount; i += 1) {
      const magnitude = randomWhole(INTEGER_OPERAND_MIN, INTEGER_OPERAND_MAX);
      const sign = Math.random() < 0.5 ? -1 : 1;
      let wrapped = false;

      if (integerLevelRequiresWrapped(displayLevel) && i > 0 && Math.random() < 0.7) {
        wrapped = sign < 0;
      } else if (integerLevelRequiresWrapped(displayLevel) && i === operandCount - 1 && !hasWrapped) {
        wrapped = sign < 0;
      }

      if (wrapped) {
        hasWrapped = true;
      }

      terms.push(createIntegerTerm(magnitude, sign, wrapped));
    }

    if (integerLevelRequiresWrapped(displayLevel) && !hasWrapped) {
      const index = randomWhole(1, operandCount - 1);
      terms[index] = createIntegerTerm(
        terms[index].magnitude,
        -1,
        true,
      );
    }

    const operators = Array.from(
      { length: operandCount - 1 },
      () => pickIntegerOperatorFromPool(displayLevel, allowedOps),
    );
    if (isValidIntegerAddSubtractProblem(terms, operators, displayLevel)) {
      return { terms, operators };
    }
  }

  return null;
}

function isValidIntegerMultiplyDivideProblem(terms, operators) {
  if (terms.some((term) => term.magnitude === 0)) {
    return false;
  }

  const answer = evaluateIntegerArithmeticExpression(terms, operators);
  if (answer === null || !Number.isInteger(answer)) {
    return false;
  }

  if (answer < INTEGER_ANSWER_MIN || answer > INTEGER_ANSWER_MAX) {
    return false;
  }

  if (!integerExpressionHasNegativeValue(terms) && answer >= 0) {
    return false;
  }

  return true;
}

function pickIntegerMultiplyDivideOperandCount(displayLevel) {
  return displayLevel === 1 ? 2 : 3;
}

function pickIntegerMultiplyDivideOperators(displayLevel, allowedOps) {
  if (displayLevel === 1) {
    return [pickRandomItem(allowedOps)];
  }

  if (allowedOps.includes('multiply')) {
    return ['multiply', 'multiply'];
  }

  return Array.from({ length: 2 }, () => pickRandomItem(allowedOps));
}

function generateIntegerMultiplyDivideTerms(displayLevel, allowedOps) {
  const operandCount = pickIntegerMultiplyDivideOperandCount(displayLevel);
  const operators = pickIntegerMultiplyDivideOperators(displayLevel, allowedOps);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = Array.from({ length: operandCount }, () => createIntegerTerm(
      randomWhole(INTEGER_OPERAND_MIN, INTEGER_OPERAND_MAX),
      Math.random() < 0.5 ? -1 : 1,
    ));

    if (isValidIntegerMultiplyDivideProblem(terms, operators)) {
      return { terms, operators };
    }
  }

  return null;
}

function createIntegerMultiplyDivideProblem(difficultyLevel, allowedOps = ['multiply', 'divide']) {
  const displayLevel = difficultyLevel + 1;
  const generated = generateIntegerMultiplyDivideTerms(displayLevel, allowedOps);

  if (generated) {
    return buildIntegerMultiplyDivideProblem(generated.terms, generated.operators, displayLevel);
  }

  const fallbacks = {
    1: buildIntegerMultiplyDivideProblem(
      [createIntegerTerm(6, -1), createIntegerTerm(3, 1)],
      ['divide'],
      1,
    ),
    2: buildIntegerMultiplyDivideProblem(
      [createIntegerTerm(2, -1), createIntegerTerm(3, 1), createIntegerTerm(4, -1)],
      ['multiply', 'multiply'],
      2,
    ),
  };

  return fallbacks[displayLevel];
}

function shouldUseIntegerCombinedMixedProblem(difficultyLevel, selectedOps) {
  return difficultyLevel + 1 >= INTEGER_COMBINED_MIXED_START_LEVEL && selectedOps.length >= 2;
}

function integerOperatorsCombineBothKinds(operators) {
  const hasAddSubtract = operators.some((operator) => operator === 'add' || operator === 'subtract');
  const hasMultiplyDivide = operators.some((operator) => operator === 'multiply' || operator === 'divide');

  return hasAddSubtract && hasMultiplyDivide;
}

function pickIntegerCombinedCrossOperators(operandCount, selectedOps) {
  const addSubtractOps = selectedOps.filter((operator) => operator === 'add' || operator === 'subtract');
  const multiplyDivideOps = selectedOps.filter((operator) => operator === 'multiply' || operator === 'divide');
  const operatorSlots = operandCount - 1;
  const operators = Array.from({ length: operatorSlots }, () => null);

  if (addSubtractOps.length === 0 || multiplyDivideOps.length === 0) {
    return Array.from({ length: operatorSlots }, () => pickRandomItem(selectedOps));
  }

  const forcedSlots = [];
  while (forcedSlots.length < 2) {
    const slot = randomWhole(0, operatorSlots - 1);
    if (!forcedSlots.includes(slot)) {
      forcedSlots.push(slot);
    }
  }

  operators[forcedSlots[0]] = pickRandomItem(addSubtractOps);
  operators[forcedSlots[1]] = pickRandomItem(multiplyDivideOps);

  for (let i = 0; i < operatorSlots; i += 1) {
    if (operators[i] === null) {
      operators[i] = pickRandomItem(selectedOps);
    }
  }

  return operators;
}

function pickIntegerCombinedOperandCount(displayLevel) {
  if (displayLevel === 1) {
    return 2;
  }

  if (displayLevel === 2) {
    return 3;
  }

  if (displayLevel >= INTEGER_COMBINED_CROSS_OPS_DISPLAY_LEVEL || displayLevel === 4) {
    return 4;
  }

  return 3;
}

function pickIntegerCombinedOperators(displayLevel, selectedOps, operandCount) {
  if (displayLevel === INTEGER_COMBINED_CROSS_OPS_DISPLAY_LEVEL) {
    return pickIntegerCombinedCrossOperators(operandCount, selectedOps);
  }

  if (displayLevel === 1) {
    return [pickRandomItem(selectedOps)];
  }

  if (displayLevel === 2) {
    const operation = pickRandomItem(selectedOps);

    if (operation === 'multiply') {
      return ['multiply', 'multiply'];
    }

    return Array.from({ length: operandCount - 1 }, () => operation);
  }

  return Array.from(
    { length: operandCount - 1 },
    () => pickRandomItem(selectedOps),
  );
}

function isValidIntegerCombinedProblem(terms, operators, displayLevel) {
  if (displayLevel === INTEGER_COMBINED_CROSS_OPS_DISPLAY_LEVEL
    && !integerOperatorsCombineBothKinds(operators)) {
    return false;
  }

  const onlyAddSubtract = operators.every((operator) => operator === 'add' || operator === 'subtract');

  if (onlyAddSubtract) {
    return isValidIntegerAddSubtractProblem(terms, operators, displayLevel);
  }

  const onlyMultiplyDivide = operators.every((operator) => operator === 'multiply' || operator === 'divide');

  if (onlyMultiplyDivide) {
    return isValidIntegerMultiplyDivideProblem(terms, operators);
  }

  if (terms.some((term) => term.magnitude === 0)) {
    return false;
  }

  const answer = evaluateIntegerArithmeticExpression(terms, operators);
  if (answer === null || !Number.isInteger(answer)) {
    return false;
  }

  if (answer < INTEGER_ANSWER_MIN || answer > INTEGER_ANSWER_MAX) {
    return false;
  }

  if (!integerExpressionHasNegativeValue(terms) && answer >= 0) {
    return false;
  }

  return true;
}

function generateIntegerCombinedTerms(displayLevel, selectedOps) {
  const operandCount = pickIntegerCombinedOperandCount(displayLevel);
  const operators = pickIntegerCombinedOperators(displayLevel, selectedOps, operandCount);
  const onlyAddSubtract = operators.every((operator) => operator === 'add' || operator === 'subtract');
  const onlyMultiplyDivide = operators.every((operator) => operator === 'multiply' || operator === 'divide');
  const requiresCrossOps = displayLevel === INTEGER_COMBINED_CROSS_OPS_DISPLAY_LEVEL;

  if (onlyAddSubtract && !requiresCrossOps) {
    return generateIntegerTerms(displayLevel, operandCount, ['add', 'subtract']);
  }

  if (onlyMultiplyDivide && !requiresCrossOps) {
    return generateIntegerMultiplyDivideTerms(displayLevel, ['multiply', 'divide']);
  }

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = Array.from({ length: operandCount }, () => createIntegerTerm(
      randomWhole(INTEGER_OPERAND_MIN, INTEGER_OPERAND_MAX),
      Math.random() < 0.5 ? -1 : 1,
    ));

    if (isValidIntegerCombinedProblem(terms, operators, displayLevel)) {
      return { terms, operators };
    }
  }

  return null;
}

function createIntegerCombinedMixedProblem(selectedOps, difficultyLevel) {
  const displayLevel = difficultyLevel + 1;
  const generated = generateIntegerCombinedTerms(displayLevel, selectedOps);

  if (generated) {
    return buildIntegerMixedProblem(generated.terms, generated.operators, displayLevel);
  }

  if (displayLevel === INTEGER_COMBINED_CROSS_OPS_DISPLAY_LEVEL) {
    return buildIntegerMixedProblem(
      [
        createIntegerTerm(2, -1),
        createIntegerTerm(3, 1),
        createIntegerTerm(2, 1),
        createIntegerTerm(4, -1),
      ],
      ['multiply', 'subtract', 'add'],
      displayLevel,
    );
  }

  return buildIntegerMixedProblem(
    [createIntegerTerm(2, -1), createIntegerTerm(3, 1), createIntegerTerm(4, -1)],
    ['multiply', 'subtract'],
    displayLevel,
  );
}

function createIntegerCombinedProblem(difficultyLevel) {
  const selectedOps = getSelectedIntegerArithmeticOperations();

  if (shouldUseIntegerCombinedMixedProblem(difficultyLevel, selectedOps)) {
    return createIntegerCombinedMixedProblem(selectedOps, difficultyLevel);
  }

  const operation = pickRandomItem(selectedOps);

  if (operation === 'add' || operation === 'subtract') {
    return createIntegerAddSubtractProblem(difficultyLevel, [operation]);
  }

  return createIntegerMultiplyDivideProblem(difficultyLevel, [operation]);
}

function createIntegerAddSubtractProblem(difficultyLevel, allowedOps = null) {
  const displayLevel = difficultyLevel + 1;
  const operandCount = pickIntegerOperandCount(displayLevel);
  const generated = generateIntegerTerms(displayLevel, operandCount, allowedOps);

  if (generated) {
    return buildIntegerAddSubtractProblem(generated.terms, generated.operators, displayLevel);
  }

  const fallbacks = {
    1: buildIntegerAddSubtractProblem(
      [createIntegerTerm(5, -1), createIntegerTerm(3, 1)],
      ['add'],
      1,
    ),
    2: buildIntegerAddSubtractProblem(
      [
        createIntegerTerm(2, -1),
        createIntegerTerm(4, 1),
        createIntegerTerm(3, -1),
      ],
      ['add', 'add'],
      2,
    ),
    3: buildIntegerAddSubtractProblem(
      [createIntegerTerm(2, -1), createIntegerTerm(3, -1, true)],
      ['add'],
      3,
    ),
    4: buildIntegerAddSubtractProblem(
      [
        createIntegerTerm(2, -1),
        createIntegerTerm(5, -1, true),
        createIntegerTerm(3, -1, true),
      ],
      ['add', 'add'],
      4,
    ),
  };

  return fallbacks[displayLevel];
}

function pickNonIntegerOperandKind() {
  return Math.random() < 0.5 ? 'decimal' : 'fraction';
}

function pickNonIntegerProblemStyle(displayLevel) {
  if (displayLevel === 1) {
    return pickNonIntegerOperandKind();
  }

  if (Math.random() < 0.5) {
    return 'mixed';
  }

  return pickNonIntegerOperandKind();
}

function randomNonIntegerDecimalMagnitude() {
  return randomWhole(
    Math.round(NON_INTEGER_DECIMAL_MIN * 10),
    Math.round(NON_INTEGER_DECIMAL_MAX * 10),
  ) / 10;
}

function createNonIntegerDecimalTerm(sign, wrapped = false) {
  return {
    kind: 'decimal',
    magnitude: randomNonIntegerDecimalMagnitude(),
    sign,
    wrapped,
  };
}

function createNonIntegerFractionTerm(sign, wrapped = false) {
  const den = randomWhole(2, NON_INTEGER_FRACTION_DEN_MAX);
  const num = randomWhole(1, den - 1);

  return {
    kind: 'fraction',
    num,
    den,
    sign,
    wrapped,
  };
}

function createNonIntegerTermWithKind(termKind, sign, wrapped = false) {
  if (termKind === 'decimal') {
    return createNonIntegerDecimalTerm(sign, wrapped);
  }

  return createNonIntegerFractionTerm(sign, wrapped);
}

function createNonIntegerTerm(operandKind, sign, wrapped = false) {
  return createNonIntegerTermWithKind(operandKind, sign, wrapped);
}

function buildTermKindsForProblem(operandCount, operandKind) {
  if (operandKind !== 'mixed') {
    return Array.from({ length: operandCount }, () => operandKind);
  }

  const kinds = Array.from(
    { length: operandCount },
    () => (Math.random() < 0.5 ? 'decimal' : 'fraction'),
  );

  if (!kinds.includes('decimal')) {
    kinds[randomWhole(0, operandCount - 1)] = 'decimal';
  }

  if (!kinds.includes('fraction')) {
    kinds[randomWhole(0, operandCount - 1)] = 'fraction';
  }

  return kinds;
}

function getNonIntegerTermValue(term) {
  if (term.kind === 'decimal') {
    return term.sign * term.magnitude;
  }

  return (term.sign * term.num) / term.den;
}

function evaluateNonIntegerDecimalExpression(terms, operators) {
  let result = getNonIntegerTermValue(terms[0]);

  for (let i = 0; i < operators.length; i += 1) {
    const value = getNonIntegerTermValue(terms[i + 1]);
    if (operators[i] === 'add') {
      result += value;
    } else {
      result -= value;
    }
  }

  return roundToDecimals(result, 1);
}

function evaluateNonIntegerFractionExpression(terms, operators) {
  let current = { num: terms[0].sign * terms[0].num, den: terms[0].den };

  for (let i = 0; i < operators.length; i += 1) {
    const next = {
      num: terms[i + 1].sign * terms[i + 1].num,
      den: terms[i + 1].den,
    };

    if (operators[i] === 'add') {
      current = reduceFraction(
        current.num * next.den + next.num * current.den,
        current.den * next.den,
      );
    } else {
      current = reduceFraction(
        current.num * next.den - next.num * current.den,
        current.den * next.den,
      );
    }
  }

  return current;
}

function rationalFromNonIntegerTerm(term) {
  if (term.kind === 'decimal') {
    const scaled = Math.round(term.sign * term.magnitude * 10);
    return reduceFraction(scaled, 10);
  }

  return reduceFraction(term.sign * term.num, term.den);
}

function evaluateNonIntegerRationalExpression(terms, operators) {
  let current = rationalFromNonIntegerTerm(terms[0]);

  for (let i = 0; i < operators.length; i += 1) {
    const next = rationalFromNonIntegerTerm(terms[i + 1]);

    if (operators[i] === 'add') {
      current = reduceFraction(
        current.num * next.den + next.num * current.den,
        current.den * next.den,
      );
    } else {
      current = reduceFraction(
        current.num * next.den - next.num * current.den,
        current.den * next.den,
      );
    }
  }

  return current;
}

function nonIntegerRationalFitsTenths(answer) {
  if (answer.den === 0) {
    return false;
  }

  const value = answer.num / answer.den;
  const rounded = roundToDecimals(value, 1);

  return Math.abs(value - rounded) < 1e-9 && valueFitsDecimalPlaces(rounded, 1);
}

function nonIntegerExpressionHasNegativeValue(terms) {
  return terms.some((term) => getNonIntegerTermValue(term) < 0);
}

function nonIntegerTermsMatchOperandKind(terms, operandKind) {
  if (operandKind === 'mixed') {
    return terms.some((term) => term.kind === 'decimal')
      && terms.some((term) => term.kind === 'fraction');
  }

  return terms.every((term) => term.kind === operandKind);
}

function applyNonIntegerAnswerToProblem(problem, terms, operators, operandKind) {
  if (operandKind === 'decimal') {
    problem.answerKind = 'decimal';
    problem.answer = evaluateNonIntegerDecimalExpression(terms, operators);
    problem.answerDecimals = 1;
    return;
  }

  if (operandKind === 'fraction') {
    problem.answerKind = 'fraction';
    const answer = normalizeSignedFraction(evaluateNonIntegerFractionExpression(terms, operators));
    problem.answerNum = answer.num;
    problem.answerDen = answer.den;
    problem.answerNegative = answer.negative;
    return;
  }

  const answer = evaluateNonIntegerRationalExpression(terms, operators);

  if (nonIntegerRationalFitsTenths(answer)) {
    problem.answerKind = 'decimal';
    problem.answer = roundToDecimals(answer.num / answer.den, 1);
    problem.answerDecimals = 1;
    return;
  }

  const normalizedAnswer = normalizeSignedFraction(answer);
  problem.answerKind = 'fraction';
  problem.answerNum = normalizedAnswer.num;
  problem.answerDen = normalizedAnswer.den;
  problem.answerNegative = normalizedAnswer.negative;
}

function buildNonIntegerAddSubtractProblem(terms, operators, displayLevel, operandKind) {
  const problem = {
    type: 'non-integer-add-subtract',
    terms,
    operators,
    operandKind,
    level: displayLevel,
    isRetry: false,
  };

  applyNonIntegerAnswerToProblem(problem, terms, operators, operandKind);

  return problem;
}

function isValidNonIntegerAddSubtractProblem(terms, operators, displayLevel, operandKind) {
  if (!nonIntegerTermsMatchOperandKind(terms, operandKind)) {
    return false;
  }

  if (displayLevel === 1 && terms.length !== 2) {
    return false;
  }

  if (integerLevelRequiresWrappedBetweenAllPairs(displayLevel)) {
    if (operators.some((operator) => operator !== 'add')) {
      return false;
    }

    if (terms.length < 3 || terms[0].wrapped) {
      return false;
    }

    for (let i = 1; i < terms.length; i += 1) {
      if (!terms[i].wrapped || terms[i].sign >= 0) {
        return false;
      }
    }
  } else if (integerLevelRequiresWrapped(displayLevel)) {
    if (terms.length !== 2 || !terms.some((term) => term.wrapped)) {
      return false;
    }
  } else if (terms.some((term) => term.wrapped)) {
    return false;
  }

  const answer = operandKind === 'decimal'
    ? { num: Math.round(evaluateNonIntegerDecimalExpression(terms, operators) * 10), den: 10 }
    : evaluateNonIntegerRationalExpression(terms, operators);

  if (answer.den === 0) {
    return false;
  }

  const answerValue = answer.num / answer.den;
  if (!Number.isFinite(answerValue)
    || answerValue < NON_INTEGER_ANSWER_MIN
    || answerValue > NON_INTEGER_ANSWER_MAX) {
    return false;
  }

  if (operandKind === 'decimal') {
    const decimalAnswer = evaluateNonIntegerDecimalExpression(terms, operators);
    if (!valueFitsDecimalPlaces(decimalAnswer, 1)) {
      return false;
    }
  } else if (Math.abs(answer.num) > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
    return false;
  }

  if (!nonIntegerExpressionHasNegativeValue(terms) && answerValue >= 0) {
    return false;
  }

  return true;
}

function generateNonIntegerLevel4Terms(operandCount, operandKind) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const termKinds = buildTermKindsForProblem(operandCount, operandKind);
    const terms = [
      createNonIntegerTermWithKind(
        termKinds[0],
        Math.random() < 0.5 ? -1 : 1,
        false,
      ),
    ];

    for (let i = 1; i < operandCount; i += 1) {
      terms.push(createNonIntegerTermWithKind(termKinds[i], -1, true));
    }

    const operators = Array.from({ length: operandCount - 1 }, () => 'add');
    if (isValidNonIntegerAddSubtractProblem(terms, operators, 4, operandKind)) {
      return { terms, operators };
    }
  }

  return null;
}

function generateNonIntegerTerms(displayLevel, operandCount, operandKind) {
  if (integerLevelRequiresWrappedBetweenAllPairs(displayLevel)) {
    return generateNonIntegerLevel4Terms(operandCount, operandKind);
  }

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const termKinds = buildTermKindsForProblem(operandCount, operandKind);
    const terms = [];
    let hasWrapped = false;

    for (let i = 0; i < operandCount; i += 1) {
      const sign = Math.random() < 0.5 ? -1 : 1;
      let wrapped = false;

      if (integerLevelRequiresWrapped(displayLevel) && i > 0 && Math.random() < 0.7) {
        wrapped = sign < 0;
      } else if (integerLevelRequiresWrapped(displayLevel) && i === operandCount - 1 && !hasWrapped) {
        wrapped = sign < 0;
      }

      if (wrapped) {
        hasWrapped = true;
      }

      terms.push(createNonIntegerTermWithKind(termKinds[i], sign, wrapped));
    }

    if (integerLevelRequiresWrapped(displayLevel) && !hasWrapped) {
      const index = randomWhole(1, operandCount - 1);
      terms[index] = createNonIntegerTermWithKind(termKinds[index], -1, true);
    }

    const operators = Array.from(
      { length: operandCount - 1 },
      () => pickIntegerOperator(displayLevel),
    );

    if (isValidNonIntegerAddSubtractProblem(terms, operators, displayLevel, operandKind)) {
      return { terms, operators };
    }
  }

  return null;
}

function createNonIntegerMultiplyDivideFractionTerm(sign) {
  const den = randomWhole(2, NON_INTEGER_FRACTION_DEN_MAX);
  const num = randomWhole(1, den - 1);

  return {
    kind: 'fraction',
    num,
    den,
    sign,
    wrapped: false,
  };
}

function applyFractionMultiplyDivideBinary(left, right, operator) {
  if (operator === 'multiply') {
    return reduceFraction(left.num * right.num, left.den * right.den);
  }

  if (operator === 'divide') {
    if (right.num === 0) {
      return null;
    }

    return reduceFraction(left.num * right.den, left.den * right.num);
  }

  return null;
}

function evaluateNonIntegerFractionMultiplyDivideExpression(terms, operators) {
  const values = terms.map((term) => ({
    num: term.sign * term.num,
    den: term.den,
  }));
  const result = evaluateExpressionWithOperatorPrecedence(
    values,
    operators,
    applyFractionMultiplyDivideBinary,
  );

  if (!result) {
    return null;
  }

  return normalizeSignedFraction(result);
}

function isValidNonIntegerMultiplyDivideProblem(terms, operators) {
  if (!terms.every((term) => term.kind === 'fraction') || terms.some((term) => term.num === 0)) {
    return false;
  }

  const answer = evaluateNonIntegerFractionMultiplyDivideExpression(terms, operators);
  if (!answer) {
    return false;
  }

  const answerValue = answer.negative
    ? -answer.num / answer.den
    : answer.num / answer.den;

  if (!Number.isFinite(answerValue)
    || answerValue < NON_INTEGER_ANSWER_MIN
    || answerValue > NON_INTEGER_ANSWER_MAX) {
    return false;
  }

  if (answer.num > FRACTION_ADD_ANSWER_MAX || answer.den > FRACTION_ADD_ANSWER_MAX) {
    return false;
  }

  if (!nonIntegerExpressionHasNegativeValue(terms) && answerValue >= 0) {
    return false;
  }

  return true;
}

function pickNonIntegerMultiplyDivideOperandCount(displayLevel) {
  return displayLevel === 1 ? 2 : 3;
}

function pickNonIntegerMultiplyDivideOperators(displayLevel, allowedOps) {
  if (displayLevel === 1) {
    return [pickRandomItem(allowedOps)];
  }

  if (allowedOps.includes('multiply')) {
    return ['multiply', 'multiply'];
  }

  return Array.from({ length: 2 }, () => pickRandomItem(allowedOps));
}

function generateNonIntegerMultiplyDivideTerms(displayLevel, allowedOps) {
  const operandCount = pickNonIntegerMultiplyDivideOperandCount(displayLevel);
  const operators = pickNonIntegerMultiplyDivideOperators(displayLevel, allowedOps);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = Array.from({ length: operandCount }, () => createNonIntegerMultiplyDivideFractionTerm(
      Math.random() < 0.5 ? -1 : 1,
    ));

    if (isValidNonIntegerMultiplyDivideProblem(terms, operators)) {
      return { terms, operators };
    }
  }

  return null;
}

function buildNonIntegerMultiplyDivideProblem(terms, operators, displayLevel) {
  const answer = evaluateNonIntegerFractionMultiplyDivideExpression(terms, operators);

  return {
    type: 'non-integer-multiply-divide',
    terms,
    operators,
    answerNum: answer.num,
    answerDen: answer.den,
    answerNegative: answer.negative,
    level: displayLevel,
    isRetry: false,
  };
}

function createNonIntegerMultiplyDivideProblem(difficultyLevel, allowedOps = ['multiply', 'divide']) {
  const displayLevel = difficultyLevel + 1;
  const generated = generateNonIntegerMultiplyDivideTerms(displayLevel, allowedOps);

  if (generated) {
    return buildNonIntegerMultiplyDivideProblem(generated.terms, generated.operators, displayLevel);
  }

  const fallbacks = {
    1: buildNonIntegerMultiplyDivideProblem(
      [
        createNonIntegerMultiplyDivideFractionTerm(-1),
        createNonIntegerMultiplyDivideFractionTerm(1),
      ],
      ['divide'],
      1,
    ),
    2: buildNonIntegerMultiplyDivideProblem(
      [
        createNonIntegerMultiplyDivideFractionTerm(-1),
        createNonIntegerMultiplyDivideFractionTerm(1),
        createNonIntegerMultiplyDivideFractionTerm(-1),
      ],
      ['multiply', 'multiply'],
      2,
    ),
  };

  return fallbacks[displayLevel];
}

function createNonIntegerAddSubtractProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;
  const operandKind = pickNonIntegerProblemStyle(displayLevel);
  const operandCount = pickIntegerOperandCount(displayLevel);
  const generated = generateNonIntegerTerms(displayLevel, operandCount, operandKind);

  if (generated) {
    return buildNonIntegerAddSubtractProblem(
      generated.terms,
      generated.operators,
      displayLevel,
      operandKind,
    );
  }

  const fallbacks = {
    1: {
      decimal: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'decimal', magnitude: 0.5, sign: -1, wrapped: false },
          { kind: 'decimal', magnitude: 0.3, sign: 1, wrapped: false },
        ],
        ['add'],
        1,
        'decimal',
      ),
      fraction: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'fraction', num: 1, den: 4, sign: -1, wrapped: false },
          { kind: 'fraction', num: 1, den: 2, sign: 1, wrapped: false },
        ],
        ['add'],
        1,
        'fraction',
      ),
    },
    2: {
      decimal: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'decimal', magnitude: 0.2, sign: -1, wrapped: false },
          { kind: 'decimal', magnitude: 0.4, sign: 1, wrapped: false },
          { kind: 'decimal', magnitude: 0.3, sign: -1, wrapped: false },
        ],
        ['add', 'add'],
        2,
        'decimal',
      ),
      fraction: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'fraction', num: 1, den: 3, sign: -1, wrapped: false },
          { kind: 'fraction', num: 1, den: 6, sign: 1, wrapped: false },
          { kind: 'fraction', num: 1, den: 4, sign: -1, wrapped: false },
        ],
        ['add', 'add'],
        2,
        'fraction',
      ),
      mixed: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'decimal', magnitude: 0.5, sign: -1, wrapped: false },
          { kind: 'fraction', num: 1, den: 4, sign: 1, wrapped: false },
          { kind: 'decimal', magnitude: 0.2, sign: -1, wrapped: false },
        ],
        ['add', 'add'],
        2,
        'mixed',
      ),
    },
    3: {
      decimal: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'decimal', magnitude: 0.2, sign: -1, wrapped: false },
          { kind: 'decimal', magnitude: 0.3, sign: -1, wrapped: true },
        ],
        ['add'],
        3,
        'decimal',
      ),
      fraction: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'fraction', num: 1, den: 2, sign: -1, wrapped: false },
          { kind: 'fraction', num: 1, den: 4, sign: -1, wrapped: true },
        ],
        ['add'],
        3,
        'fraction',
      ),
      mixed: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'decimal', magnitude: 0.5, sign: 1, wrapped: false },
          { kind: 'fraction', num: 1, den: 4, sign: -1, wrapped: true },
        ],
        ['add'],
        3,
        'mixed',
      ),
    },
    4: {
      decimal: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'decimal', magnitude: 0.2, sign: -1, wrapped: false },
          { kind: 'decimal', magnitude: 0.5, sign: -1, wrapped: true },
          { kind: 'decimal', magnitude: 0.3, sign: -1, wrapped: true },
        ],
        ['add', 'add'],
        4,
        'decimal',
      ),
      fraction: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'fraction', num: 1, den: 2, sign: -1, wrapped: false },
          { kind: 'fraction', num: 2, den: 5, sign: -1, wrapped: true },
          { kind: 'fraction', num: 1, den: 4, sign: -1, wrapped: true },
        ],
        ['add', 'add'],
        4,
        'fraction',
      ),
      mixed: buildNonIntegerAddSubtractProblem(
        [
          { kind: 'decimal', magnitude: 0.4, sign: -1, wrapped: false },
          { kind: 'fraction', num: 1, den: 5, sign: -1, wrapped: true },
          { kind: 'decimal', magnitude: 0.3, sign: -1, wrapped: true },
        ],
        ['add', 'add'],
        4,
        'mixed',
      ),
    },
  };

  return fallbacks[displayLevel][operandKind];
}

function integerPow(base, exponent) {
  return base ** exponent;
}

function createPowerTerm(base, exponent, {
  baseSign = 1,
  wrapped = false,
  leadingNegative = false,
} = {}) {
  return {
    kind: 'power',
    base,
    exponent,
    baseSign,
    wrapped,
    leadingNegative,
  };
}

function createPlainPowerTerm(value) {
  return {
    kind: 'plain',
    value,
  };
}

function evaluatePowerTerm(term) {
  const magnitudePower = integerPow(term.base, term.exponent);

  if (term.wrapped) {
    return integerPow(term.baseSign * term.base, term.exponent);
  }

  if (term.leadingNegative) {
    return -magnitudePower;
  }

  if (term.baseSign < 0) {
    return -magnitudePower;
  }

  return magnitudePower;
}

function getPowerTermValue(term) {
  if (term.kind === 'plain') {
    return term.value;
  }

  return evaluatePowerTerm(term);
}

function evaluatePowerExpression(terms, operators) {
  if (terms.length === 0) {
    return null;
  }

  if (operators.length === 0) {
    return getPowerTermValue(terms[0]);
  }

  const values = terms.map(getPowerTermValue);
  const result = evaluateExpressionWithOperatorPrecedence(
    values,
    operators,
    applyIntegerBinaryOperation,
  );

  if (result === null || !Number.isFinite(result)) {
    return null;
  }

  return result;
}

function formatPowerExponentText(exponent) {
  return `^${exponent}`;
}

function formatPowerExponentHtml(exponent) {
  return `<sup>${exponent}</sup>`;
}

function powerTermNeedsParensAfterOperator(term, precedingOperator) {
  if (!precedingOperator) {
    return false;
  }

  if (term.kind === 'plain') {
    return term.value < 0;
  }

  return term.leadingNegative || term.baseSign < 0;
}

function formatPowerTermInnerText(term) {
  let text = '';

  if (term.leadingNegative) {
    text += '-';
  }

  if (term.wrapped) {
    text += '(';

    if (!term.leadingNegative && term.baseSign < 0) {
      text += '-';
    }

    text += `${term.base})${formatPowerExponentText(term.exponent)}`;
    return text;
  }

  if (!term.leadingNegative && term.baseSign < 0) {
    text += '-';
  }

  text += `${term.base}${formatPowerExponentText(term.exponent)}`;

  return text;
}

function formatPowerTermInnerHtml(term) {
  let html = '';

  if (term.leadingNegative) {
    html += '−';
  }

  if (term.wrapped) {
    html += '(';

    if (!term.leadingNegative && term.baseSign < 0) {
      html += '−';
    }

    html += `${term.base})${formatPowerExponentHtml(term.exponent)}`;
    return html;
  }

  if (!term.leadingNegative && term.baseSign < 0) {
    html += '−';
  }

  html += `${term.base}${formatPowerExponentHtml(term.exponent)}`;

  return html;
}

function formatPowerTermText(term, precedingOperator = null) {
  if (term.kind === 'plain') {
    const value = term.value;

    if (powerTermNeedsParensAfterOperator(term, precedingOperator)) {
      return `(${value})`;
    }

    return String(value);
  }

  const inner = formatPowerTermInnerText(term);

  if (powerTermNeedsParensAfterOperator(term, precedingOperator)) {
    return `(${inner})`;
  }

  return inner;
}

function formatPowerTermHtml(term, precedingOperator = null) {
  if (term.kind === 'plain') {
    return `<span class="problem-expression__term">${escapeHtml(formatPowerTermText(term, precedingOperator))}</span>`;
  }

  const inner = formatPowerTermInnerHtml(term);
  const content = powerTermNeedsParensAfterOperator(term, precedingOperator)
    ? `(${inner})`
    : inner;

  return `<span class="problem-expression__term problem-expression__power">${content}</span>`;
}

function formatPowersProblemText(problem) {
  let text = formatPowerTermText(problem.terms[0]);

  problem.operators.forEach((operator, index) => {
    text += `${formatIntegerArithmeticOperatorSymbol(operator, true)}${formatPowerTermText(problem.terms[index + 1], operator)}`;
  });

  return `${text} =`;
}

function formatPowersDisplayHtml(problem) {
  let html = formatPowerTermHtml(problem.terms[0]);

  problem.operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(operator)}</span>${formatPowerTermHtml(problem.terms[index + 1], operator)}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function buildPowersProblem(terms, operators, displayLevel) {
  return {
    type: 'powers',
    terms,
    operators,
    answer: evaluatePowerExpression(terms, operators),
    level: displayLevel,
    isRetry: false,
  };
}

function isValidPowersProblem(problem) {
  if (!Number.isInteger(problem.answer)) {
    return false;
  }

  if (problem.answer < POWER_ANSWER_MIN || problem.answer > POWER_ANSWER_MAX) {
    return false;
  }

  return true;
}

function createWrappedNegativeSquareTerm(base) {
  return createPowerTerm(base, 2, { baseSign: -1, wrapped: true });
}

function createUnaryMinusSquareTerm(base) {
  return createPowerTerm(base, 2, { baseSign: -1, wrapped: false, leadingNegative: false });
}

function createPositiveSquareTerm(base) {
  return createPowerTerm(base, 2, { baseSign: 1, wrapped: false });
}

function createHighExponentTerm(base, exponent, allowNegative = false) {
  if (!allowNegative || Math.random() < 0.5) {
    return createPowerTerm(base, exponent, { baseSign: 1, wrapped: false });
  }

  if (Math.random() < 0.5) {
    return createPowerTerm(base, exponent, { baseSign: -1, wrapped: true });
  }

  return createPowerTerm(base, exponent, { baseSign: -1, wrapped: false });
}

function createRandomPowerTermForLevel4() {
  const exponent = Math.random() < 0.5 ? 2 : 3;
  const base = randomWhole(1, POWER_HIGH_EXP_BASE_MAX);
  const allowNegative = Math.random() < 0.4;

  if (exponent === 2 && allowNegative) {
    return Math.random() < 0.5
      ? createWrappedNegativeSquareTerm(base)
      : createUnaryMinusSquareTerm(base);
  }

  return createHighExponentTerm(base, exponent, allowNegative);
}

function createRandomPlainTermForPowers(displayLevel) {
  const maxValue = displayLevel >= 5 ? 20 : 15;
  const magnitude = randomWhole(1, maxValue);
  const sign = Math.random() < 0.5 ? -1 : 1;

  return createPlainPowerTerm(sign * magnitude);
}

function pickPowerBinaryOperator() {
  const operators = ['add', 'subtract', 'multiply', 'divide'];

  return pickRandomItem(operators);
}

function pickPowerOperatorsForLevel5(operandCount) {
  const operators = Array.from({ length: operandCount - 1 }, () => pickRandomItem([
    'add',
    'subtract',
    'multiply',
    'divide',
  ]));

  if (!operators.some((operator) => isMultiplyOrDivide(operator))) {
    operators[0] = Math.random() < 0.5 ? 'multiply' : 'divide';
  }

  if (!operators.some((operator) => isAddOrSubtract(operator))) {
    operators[operators.length - 1] = Math.random() < 0.5 ? 'add' : 'subtract';
  }

  return operators;
}

function pickPowerOperandCount(displayLevel) {
  if (displayLevel <= 4) {
    return 2;
  }

  return Math.random() < 0.5 ? 3 : 4;
}

function generatePowersTerms(displayLevel, operandCount, requirePower = false) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = [];
    let hasPower = false;

    for (let i = 0; i < operandCount; i += 1) {
      const usePower = requirePower
        ? (i === 0 || !hasPower || Math.random() < 0.65)
        : Math.random() < 0.55;

      if (usePower) {
        if (displayLevel <= 2) {
          terms.push(createPositiveSquareTerm(randomWhole(1, POWER_SQUARE_BASE_MAX)));
        } else if (displayLevel === 3) {
          const exponent = Math.random() < 0.5 ? 3 : 4;
          const base = randomWhole(1, POWER_HIGH_EXP_BASE_MAX);
          terms.push(createHighExponentTerm(base, exponent, true));
        } else {
          terms.push(createRandomPowerTermForLevel4());
        }
        hasPower = true;
      } else {
        terms.push(createRandomPlainTermForPowers(displayLevel));
      }
    }

    if (requirePower && !hasPower) {
      terms[0] = displayLevel <= 2
        ? createPositiveSquareTerm(randomWhole(1, POWER_SQUARE_BASE_MAX))
        : createRandomPowerTermForLevel4();
    }

    return terms;
  }

  return [
    createRandomPowerTermForLevel4(),
    createPlainPowerTerm(2),
  ];
}

function createPowersLevel1Problem(displayLevel) {
  const base = randomWhole(1, POWER_SQUARE_BASE_MAX);

  return buildPowersProblem([createPositiveSquareTerm(base)], [], displayLevel);
}

function createPowersLevel2Problem(displayLevel) {
  const base = randomWhole(1, POWER_SQUARE_BASE_MAX);
  const term = Math.random() < 0.5
    ? createWrappedNegativeSquareTerm(base)
    : createUnaryMinusSquareTerm(base);

  return buildPowersProblem([term], [], displayLevel);
}

function createPowersLevel3Problem(displayLevel) {
  const exponent = Math.random() < 0.5 ? 3 : 4;
  const base = randomWhole(1, POWER_HIGH_EXP_BASE_MAX);
  const term = createHighExponentTerm(base, exponent, true);

  return buildPowersProblem([term], [], displayLevel);
}

function createPowersLevel4Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = [
      Math.random() < 0.5 ? createRandomPowerTermForLevel4() : createRandomPlainTermForPowers(displayLevel),
      Math.random() < 0.5 ? createRandomPowerTermForLevel4() : createRandomPlainTermForPowers(displayLevel),
    ];

    if (!terms.some((term) => term.kind === 'power')) {
      terms[0] = createRandomPowerTermForLevel4();
    }

    const operators = [pickPowerBinaryOperator()];
    const problem = buildPowersProblem(terms, operators, displayLevel);

    if (isValidPowersProblem(problem)) {
      return problem;
    }
  }

  return buildPowersProblem(
    [createPositiveSquareTerm(3), createPlainPowerTerm(4)],
    ['add'],
    displayLevel,
  );
}

function createPowersLevel5Problem(displayLevel) {
  const operandCount = pickPowerOperandCount(displayLevel);
  const operators = pickPowerOperatorsForLevel5(operandCount);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = generatePowersTerms(displayLevel, operandCount, true);
    const problem = buildPowersProblem(terms, operators, displayLevel);

    if (isValidPowersProblem(problem)) {
      return problem;
    }
  }

  return buildPowersProblem(
    [
      createWrappedNegativeSquareTerm(2),
      createPlainPowerTerm(-3),
      createPowerTerm(2, 3, { baseSign: 1 }),
    ],
    ['multiply', 'add'],
    displayLevel,
  );
}

function createPowersProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 1) {
    return createPowersLevel1Problem(displayLevel);
  }

  if (displayLevel === 2) {
    return createPowersLevel2Problem(displayLevel);
  }

  if (displayLevel === 3) {
    return createPowersLevel3Problem(displayLevel);
  }

  if (displayLevel === 4) {
    return createPowersLevel4Problem(displayLevel);
  }

  return createPowersLevel5Problem(displayLevel);
}

function createProblemForExerciseMode(mode, level) {
  if (mode === 'basic-form') {
    return createBasicFormProblem(level);
  }

  if (mode === 'integer-add-subtract') {
    return createIntegerAddSubtractProblem(level);
  }

  if (mode === 'integer-multiply-divide') {
    return createIntegerMultiplyDivideProblem(level);
  }

  if (mode === 'integer-combined') {
    return createIntegerCombinedProblem(level);
  }

  if (mode === 'non-integer-add-subtract') {
    return createNonIntegerAddSubtractProblem(level);
  }

  if (mode === 'non-integer-multiply-divide') {
    return createNonIntegerMultiplyDivideProblem(level);
  }

  if (mode === 'powers') {
    return createPowersProblem(level);
  }

  if (mode === 'decimal-fraction-combined') {
    return createDecimalFractionCombinedProblem(level);
  }

  if (mode === 'fraction-add') {
    return createFractionAddProblem(level);
  }

  if (mode === 'fraction-subtract') {
    return createFractionSubtractProblem(level);
  }

  if (mode === 'fraction-combined') {
    return createFractionCombinedProblem(level);
  }

  if (mode === 'fraction-multiply') {
    return createFractionMultiplyProblem(level);
  }

  if (mode === 'fraction-divide') {
    return createFractionDivideProblem(level);
  }

  if (mode === 'fraction-compound') {
    return createCompoundFractionProblem(level);
  }

  if (mode !== 'decimal') {
    return null;
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

function pickExerciseModeForNextProblem() {
  if (activeExerciseMode === 'multi-mode') {
    return pickRandomItem(activeExerciseModePool);
  }

  return activeExerciseMode;
}

function createRandomProblem(level) {
  return createProblemForExerciseMode(pickExerciseModeForNextProblem(), level);
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

function formatThreeOperandExpression(problem) {
  return formatMultiOperandExpression(problem);
}

function formatSingleFractionHtml(num, den, isNegative = false) {
  const displayNum = Math.abs(num);
  const displayDen = Math.abs(den);
  const ariaPrefix = isNegative ? '−' : '';

  if (!isNegative) {
    return `<span class="fraction" aria-label="${escapeHtml(ariaPrefix)}${escapeHtml(displayNum)}/${escapeHtml(displayDen)}"><span class="fraction__num">${escapeHtml(displayNum)}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${escapeHtml(displayDen)}</span></span>`;
  }

  return `<span class="fraction fraction--signed" aria-label="${escapeHtml(ariaPrefix)}${escapeHtml(displayNum)}/${escapeHtml(displayDen)}"><span class="fraction__num">${escapeHtml(displayNum)}</span><span class="fraction__bar-row"><span class="fraction__sign" aria-hidden="true">−</span><span class="fraction__bar" aria-hidden="true"></span></span><span class="fraction__den">${escapeHtml(displayDen)}</span></span>`;
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
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
    const f0 = formatSingleFractionHtml(problem.terms[0].num, problem.terms[0].den);
    const f1 = formatSingleFractionHtml(problem.terms[1].num, problem.terms[1].den);
    const f2 = formatSingleFractionHtml(problem.terms[2].num, problem.terms[2].den);
    const op0 = `<span class="problem-expression__operator">${formatFractionOperatorSymbol(problem.operators[0])}</span>`;
    const op1 = `<span class="problem-expression__operator">${formatFractionOperatorSymbol(problem.operators[1])}</span>`;

    let html;

    if (problem.parenthesesGroup === 0) {
      html = `(${f0}${op0}${f1})${op1}${f2}`;
    } else {
      html = `${f0}${op0}(${f1}${op1}${f2})`;
    }

    return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
  }

  let html = formatSingleFractionHtml(problem.terms[0].num, problem.terms[0].den);
  problem.operators.forEach((operator, index) => {
    const term = problem.terms[index + 1];
    html += `<span class="problem-expression__operator">${formatFractionOperatorSymbol(operator)}</span>${formatSingleFractionHtml(term.num, term.den)}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function formatFractionMixedProblemText(problem) {
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
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
  }

  let text = `${problem.terms[0].num}/${problem.terms[0].den}`;
  problem.operators.forEach((operator, index) => {
    const term = problem.terms[index + 1];
    text += `${formatFractionOperatorSymbol(operator, true)}${term.num}/${term.den}`;
  });

  return `${text} =`;
}

function formatMixedTermHtml(term) {
  if (term.kind === 'decimal') {
    let html = `<span class="problem-expression__term">${escapeHtml(formatDecimal(term.value, term.decimals))}</span>`;

    if (term.wholeFactor != null) {
      html += `<span class="problem-expression__operator">·</span><span class="problem-expression__term">${escapeHtml(term.wholeFactor)}</span>`;
    }

    return html;
  }

  if (term.kind === 'fraction') {
    return formatSingleFractionHtml(term.num, term.den);
  }

  if (term.kind === 'whole') {
    return `<span class="problem-expression__term">${escapeHtml(term.value)}</span>`;
  }

  if (term.kind === 'compound') {
    return formatNestedCompoundPartHtml(term.numerator, term.denominator);
  }

  return `<span class="problem-expression__term">${escapeHtml(term.value)}</span>`;
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

  if (term.kind === 'whole') {
    return String(term.value);
  }

  if (term.kind === 'compound') {
    return formatNestedCompoundPartText(term.numerator, term.denominator);
  }

  return String(term.value);
}

function formatDecimalFractionMixedDisplayHtml(problem) {
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
    const t0 = formatMixedTermHtml(problem.terms[0]);
    const t1 = formatMixedTermHtml(problem.terms[1]);
    const t2 = formatMixedTermHtml(problem.terms[2]);
    const op0 = `<span class="problem-expression__operator">${formatFractionOperatorSymbol(problem.operators[0])}</span>`;
    const op1 = `<span class="problem-expression__operator">${formatFractionOperatorSymbol(problem.operators[1])}</span>`;

    let html;

    if (problem.parenthesesGroup === 0) {
      html = `(${t0}${op0}${t1})${op1}${t2}`;
    } else {
      html = `${t0}${op0}(${t1}${op1}${t2})`;
    }

    return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
  }

  let html = formatMixedTermHtml(problem.terms[0]);
  problem.operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatFractionOperatorSymbol(operator)}</span>${formatMixedTermHtml(problem.terms[index + 1])}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function formatDecimalFractionMixedProblemText(problem) {
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
    const a = formatMixedTermText(problem.terms[0]);
    const b = formatMixedTermText(problem.terms[1]);
    const c = formatMixedTermText(problem.terms[2]);
    const op1 = formatFractionOperatorSymbol(problem.operators[0], true);
    const op2 = formatFractionOperatorSymbol(problem.operators[1], true);

    if (problem.parenthesesGroup === 0) {
      return `(${a}${op1}${b})${op2}${c} =`;
    }

    if (problem.parenthesesGroup === 1) {
      return `${a}${op1}(${b}${op2}${c}) =`;
    }
  }

  let text = formatMixedTermText(problem.terms[0]);
  problem.operators.forEach((operator, index) => {
    text += `${formatFractionOperatorSymbol(operator, true)}${formatMixedTermText(problem.terms[index + 1])}`;
  });

  return `${text} =`;
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

function formatCompoundExprPartHtml(part) {
  if (part.type === 'fraction-expr') {
    let html = formatSingleFractionHtml(part.terms[0].num, part.terms[0].den);
    part.operators.forEach((operator, index) => {
      const term = part.terms[index + 1];
      html += `<span class="problem-expression__operator">${formatFractionOperatorSymbol(operator)}</span>${formatSingleFractionHtml(term.num, term.den)}`;
    });
    return `<span class="problem-expression__inline-expr">${html}</span>`;
  }

  if (part.type === 'mixed-expr') {
    let html = formatMixedTermHtml(part.terms[0]);
    part.operators.forEach((operator, index) => {
      html += `<span class="problem-expression__operator">${formatFractionOperatorSymbol(operator)}</span>${formatMixedTermHtml(part.terms[index + 1])}`;
    });
    return `<span class="problem-expression__inline-expr">${html}</span>`;
  }

  return formatCompoundPartHtml(part);
}

function formatCompoundExprPartText(part) {
  if (part.type === 'fraction-expr') {
    let text = `${part.terms[0].num}/${part.terms[0].den}`;
    part.operators.forEach((operator, index) => {
      const term = part.terms[index + 1];
      text += `${formatFractionOperatorSymbol(operator, true)}${term.num}/${term.den}`;
    });
    return `(${text})`;
  }

  if (part.type === 'mixed-expr') {
    let text = formatMixedTermText(part.terms[0]);
    part.operators.forEach((operator, index) => {
      text += `${formatFractionOperatorSymbol(operator, true)}${formatMixedTermText(part.terms[index + 1])}`;
    });
    return `(${text})`;
  }

  return formatCompoundPartText(part);
}

function formatNestedCompoundPartHtml(numerator, denominator) {
  return `<span class="fraction compound-fraction compound-fraction--nested"><span class="fraction__num">${formatCompoundPartHtml(numerator)}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${formatCompoundPartHtml(denominator)}</span></span>`;
}

function formatNestedCompoundPartText(numerator, denominator) {
  return `(${formatCompoundPartText(numerator)})/(${formatCompoundPartText(denominator)})`;
}

function formatCompoundPartHtml(part) {
  if (part.type === 'fraction') {
    return formatSingleFractionHtml(part.num, part.den);
  }

  if (part.type === 'whole') {
    return `<span class="problem-expression__term">${escapeHtml(part.value)}</span>`;
  }

  if (part.type === 'compound') {
    return formatNestedCompoundPartHtml(part.numerator, part.denominator);
  }

  return formatCompoundExprPartHtml(part);
}

function formatCompoundPartText(part) {
  if (part.type === 'fraction') {
    return `(${part.num}/${part.den})`;
  }

  if (part.type === 'whole') {
    return String(part.value);
  }

  if (part.type === 'compound') {
    return formatNestedCompoundPartText(part.numerator, part.denominator);
  }

  return formatCompoundExprPartText(part);
}

function formatCompoundFractionDisplayHtml(problem) {
  const numeratorHtml = formatCompoundPartHtml(problem.numerator);
  const denominatorHtml = formatCompoundPartHtml(problem.denominator);

  return `<span class="problem-expression problem-expression--compound"><span class="fraction compound-fraction"><span class="fraction__num">${numeratorHtml}</span><span class="fraction__bar compound-fraction__main-bar" aria-hidden="true"></span><span class="fraction__den">${denominatorHtml}</span></span><span class="problem-expression__equals">=</span></span>`;
}

function formatCompoundFractionProblemText(problem) {
  return `${formatCompoundPartText(problem.numerator)}/${formatCompoundPartText(problem.denominator)} =`;
}

function formatProblemText(problem) {
  if (problem.type === 'basic-form') {
    return `${problem.givenNum}/${problem.givenDen} =`;
  }

  if (isIntegerArithmeticProblem(problem)) {
    return formatIntegerArithmeticProblemText(problem);
  }

  if (problem.type === 'non-integer-add-subtract') {
    return formatNonIntegerAddSubtractProblemText(problem);
  }

  if (problem.type === 'non-integer-multiply-divide') {
    return formatNonIntegerMultiplyDivideProblemText(problem);
  }

  if (problem.type === 'powers') {
    return formatPowersProblemText(problem);
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

  if (problem.type === 'fraction-compound') {
    return formatCompoundFractionProblemText(problem);
  }

  if (problem.type === 'decimal-fraction-mixed') {
    return formatDecimalFractionMixedProblemText(problem);
  }

  if (activeExerciseMode === 'decimal' && getSelectedOperations().length === 0) {
    return 'Vyber alespoň jednu operaci s desetinnými čísly.';
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

  if (isIntegerArithmeticProblem(currentProblem) || isPowersProblem(currentProblem)) {
    sessionResults.push({
      uloha: formatProblemText(currentProblem),
      uroven: getDisplayLevel(currentProblem),
      odpoved: formatIntegerAnswer(userAnswer),
      spravne: formatIntegerAnswer(currentProblem.answer),
      vysledek: isCorrect ? 'správně' : 'špatně',
    });
    return;
  }

  if (currentProblem?.type === 'non-integer-add-subtract') {
    if (getNonIntegerAnswerKind(currentProblem) === 'decimal') {
      sessionResults.push({
        uloha: formatProblemText(currentProblem),
        uroven: getDisplayLevel(currentProblem),
        odpoved: formatDecimal(userAnswer, 1),
        spravne: formatDecimal(currentProblem.answer, 1),
        vysledek: isCorrect ? 'správně' : 'špatně',
      });
      return;
    }

    const userFraction = userAnswer;
    sessionResults.push({
      uloha: formatProblemText(currentProblem),
      uroven: getDisplayLevel(currentProblem),
      odpoved: formatSignedFractionText(userFraction),
      spravne: formatSignedFractionText({
        num: currentProblem.answerNum,
        den: currentProblem.answerDen,
        negative: currentProblem.answerNegative,
      }),
      vysledek: isCorrect ? 'správně' : 'špatně',
    });
    return;
  }

  if (currentProblem?.type === 'non-integer-multiply-divide') {
    sessionResults.push({
      uloha: formatProblemText(currentProblem),
      uroven: getDisplayLevel(currentProblem),
      odpoved: formatSignedFractionText(userAnswer),
      spravne: formatSignedFractionText({
        num: currentProblem.answerNum,
        den: currentProblem.answerDen,
        negative: currentProblem.answerNegative,
      }),
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

function getCheckboxLabel(checkbox) {
  const label = checkbox.closest('label');
  if (!label) {
    return checkbox.value;
  }

  const clone = label.cloneNode(true);
  const input = clone.querySelector('input');
  if (input) {
    input.remove();
  }

  return clone.textContent.trim().replace(/\s+/g, ' ');
}

function captureSessionModeSelection() {
  const modes = [];

  operationCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      modes.push(getCheckboxLabel(checkbox));
    }
  });

  integerModeCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      modes.push(getCheckboxLabel(checkbox));
    }
  });

  powersModeCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      modes.push(getCheckboxLabel(checkbox));
    }
  });

  fractionModeCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      modes.push(getCheckboxLabel(checkbox));
    }
  });

  return modes;
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
    m: sessionSelectedModes,
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
    modes: Array.isArray(parsed.m) ? parsed.m.map((mode) => String(mode)) : [],
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

function isSupabaseConfigured() {
  const config = window.SUPABASE_CONFIG;
  return Boolean(config?.url && config?.anonKey && !config.url.includes('YOUR_PROJECT'));
}

function getSupabaseConfigHelpMessage() {
  if (location.hostname.endsWith('github.io')) {
    return 'Supabase není nakonfigurované na GitHub Pages. V repozitáři nastav Actions secrets SUPABASE_URL a SUPABASE_ANON_KEY, nebo nasaď verzi s platným souborem supabase-config.js.';
  }

  return 'Supabase není nakonfigurované. Zkopíruj supabase-config.example.js na supabase-config.js a doplň údaje.';
}

function getSupabaseClient() {
  const config = window.SUPABASE_CONFIG;
  if (!isSupabaseConfigured()) {
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
      analysisLinkFeedbackEl.textContent = getSupabaseConfigHelpMessage();
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
    const { name, modes, results } = await loadAnalysisFromSupabase(id);
    sessionResults = results;
    sessionSelectedModes = modes;
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
    modesLabel: 'Zvolené režimy:',
    modes: [...sessionSelectedModes],
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
  ];

  if (doc.modes.length > 0) {
    lines.push(`${doc.modesLabel} ${doc.modes.join('; ')}`);
  }

  lines.push(`${doc.overallLabel} ${doc.overall}`);

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

  const modesHtml = doc.modes.length > 0
    ? `<div class="analysis__modes-block">
        <p><strong>${escapeHtml(doc.modesLabel)}</strong></p>
        <ul class="analysis__modes">
          ${doc.modes.map((mode) => `<li>${escapeHtml(mode)}</li>`).join('')}
        </ul>
      </div>`
    : '';

  analysisSummaryEl.innerHTML = `${modesHtml}<p><strong>${escapeHtml(doc.overallLabel)}</strong> ${escapeHtml(doc.overall)}</p>`;

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

function showVerifyAction() {
  awaitingNextProblem = false;
  primaryActionBtn.textContent = 'Ověřit';
}

function showNextExampleAction() {
  awaitingNextProblem = true;
  primaryActionBtn.textContent = 'Další';
  primaryActionBtn.disabled = false;
}

function finishAnswerReview(isCorrect) {
  setFormEnabled(false);
  setAnswerFieldHighlight(isCorrect ? 'correct' : 'wrong');
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  showNextExampleAction();
  primaryActionBtn.focus();
}

function setFormEnabled(enabled) {
  inputEl.disabled = !enabled;
  answerNumeratorEl.disabled = !enabled;
  answerDenominatorEl.disabled = !enabled;
  answerShapeToggleBtn.disabled = !enabled;
  if (!awaitingNextProblem) {
    primaryActionBtn.disabled = !enabled;
  }
  mathKeypadKeys.forEach((key) => {
    key.disabled = !enabled;
  });
}

function getActiveAnswerInputEl() {
  if (isNumberAnswerInputShape()) {
    return inputEl;
  }

  if (usesFractionAnswerFields()) {
    return activeFractionInputEl || answerNumeratorEl;
  }

  return inputEl;
}

function clearAnswerFieldHighlight() {
  inputEl.classList.remove('answer-form__input--correct', 'answer-form__input--wrong');
  answerNumeratorEl.classList.remove('answer-form__fraction-input--correct', 'answer-form__fraction-input--wrong');
  answerDenominatorEl.classList.remove('answer-form__fraction-input--correct', 'answer-form__fraction-input--wrong');
}

function isFractionAnswerFieldsVisible() {
  return fractionAnswerWrapEl.classList.contains('is-visible');
}

function setAnswerFieldHighlight(result) {
  clearAnswerFieldHighlight();

  if (!result) {
    return;
  }

  const className = result === 'correct'
    ? 'answer-form__input--correct'
    : 'answer-form__input--wrong';
  const fractionClassName = result === 'correct'
    ? 'answer-form__fraction-input--correct'
    : 'answer-form__fraction-input--wrong';

  if (isFractionAnswerFieldsVisible()) {
    answerNumeratorEl.classList.add(fractionClassName);
    answerDenominatorEl.classList.add(fractionClassName);
    return;
  }

  inputEl.classList.add(className);
}

function showAnswerValidationFeedback() {
  setAnswerFieldHighlight('wrong');
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
}

function clearAnswerInputs() {
  inputEl.value = '';
  answerNumeratorEl.value = '';
  answerDenominatorEl.value = '';
  setAnswerFractionNegative(false);
  clearAnswerFieldHighlight();
}

function focusAnswerInput() {
  if (isNumberAnswerInputShape()) {
    inputEl.focus();
    return;
  }

  if (usesFractionAnswerFields()) {
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

function updateMathKeypadKeys() {
  const commaKey = mathKeypadEl.querySelector('.math-keypad__key[data-value=","]');
  const minusKey = mathKeypadEl.querySelector('.math-keypad__key[data-value="-"]');
  const usesFractionFields = usesFractionAnswerFields() && !isNumberAnswerInputShape();

  if (commaKey) {
    commaKey.hidden = usesFractionFields || isIntegerAnswerInputMode() || isPowersAnswerInputMode();
  }

  if (minusKey) {
    minusKey.hidden = usesFractionFields
      && !isNumberAnswerInputShape()
      && !isNonIntegerMultiplyDivideFractionAnswerInputShape()
      && !isNonIntegerFractionAnswerInputShape();
  }
}

function toggleNegativeSignInInput(target) {
  const current = target.value;

  if (current === '' || current === '-') {
    target.value = current === '-' ? '' : '-';
  } else if (current.startsWith('-')) {
    target.value = current.slice(1);
  } else {
    target.value = `-${current}`;
  }

  target.focus();
}

function updateFractionAnswerShapeUi() {
  if (isIntegerAnswerInputMode() || isPowersAnswerInputMode()) {
    answerShapeToggleBtn.hidden = true;
    setAnswerWrapVisible(decimalAnswerWrapEl, true);
    setAnswerWrapVisible(fractionAnswerWrapEl, false);
    inputEl.required = true;
    inputEl.placeholder = '';
    inputEl.inputMode = 'numeric';
    updateMathKeypadKeys();
    return;
  }

  if (isNonIntegerAnswerInputMode()) {
    answerShapeToggleBtn.hidden = true;

    if (isNonIntegerMultiplyDivideAnswerInputMode()) {
      setAnswerWrapVisible(decimalAnswerWrapEl, false);
      setAnswerWrapVisible(fractionAnswerWrapEl, true);
      inputEl.required = false;
      updateMathKeypadKeys();
      return;
    }

    if (isNonIntegerFractionAnswerProblem(currentProblem)) {
      setAnswerWrapVisible(decimalAnswerWrapEl, false);
      setAnswerWrapVisible(fractionAnswerWrapEl, true);
      inputEl.required = false;
      updateMathKeypadKeys();
      return;
    }

    setAnswerWrapVisible(decimalAnswerWrapEl, true);
    setAnswerWrapVisible(fractionAnswerWrapEl, false);
    inputEl.required = true;
    inputEl.placeholder = '';
    inputEl.inputMode = 'decimal';
    updateMathKeypadKeys();
    return;
  }

  if (!isFractionAnswerInputMode()) {
    answerShapeToggleBtn.hidden = true;
    setAnswerWrapVisible(decimalAnswerWrapEl, true);
    setAnswerWrapVisible(fractionAnswerWrapEl, false);
    inputEl.required = true;
    inputEl.placeholder = '';
    inputEl.inputMode = 'decimal';
    updateMathKeypadKeys();
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

  if (useFractionShape) {
    inputEl.placeholder = '';
    updateMathKeypadKeys();
    return;
  }

  inputEl.placeholder = '';
  inputEl.inputMode = 'decimal';
  updateMathKeypadKeys();
}

function toggleFractionAnswerShape() {
  if (!isFractionAnswerInputMode() || answerShapeToggleBtn.disabled) {
    return;
  }

  fractionAnswerInputShape = fractionAnswerInputShape === 'fraction' ? 'number' : 'fraction';
  clearAnswerInputs();
  updateFractionAnswerShapeUi();
  focusAnswerInput();
}

function setAnswerInputMode(mode) {
  if (mode === 'multi-mode') {
    return;
  }

  currentAnswerInputMode = mode;

  if (mode === 'powers'
    || mode === 'integer-add-subtract'
    || mode === 'integer-multiply-divide'
    || mode === 'integer-combined') {
    fractionAnswerInputShape = 'number';
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'non-integer-add-subtract' || mode === 'non-integer-multiply-divide') {
    fractionAnswerInputShape = 'fraction';
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode !== 'basic-form'
    && mode !== 'fraction-add'
    && mode !== 'fraction-subtract'
    && mode !== 'fraction-combined'
    && mode !== 'fraction-multiply'
    && mode !== 'fraction-divide'
    && mode !== 'fraction-compound'
    && mode !== 'decimal-fraction-combined') {
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

  if (value === '-') {
    if (isNonIntegerMultiplyDivideFractionAnswerInputShape()) {
      toggleNegativeSignInInput(getActiveAnswerInputEl());
      return;
    }

    if (isNonIntegerFractionAnswerInputShape()) {
      toggleAnswerFractionNegative();
      return;
    }

    if (usesFractionAnswerFields() && !isNumberAnswerInputShape()) {
      return;
    }

    toggleNegativeSignInInput(inputEl);
    return;
  }

  if (usesIntegerAnswerInput()) {
    if (value === ',') {
      return;
    }

    inputEl.value = `${inputEl.value}${value}`;
    inputEl.focus();
    return;
  }

  if (isNumberAnswerInputShape()) {
    insertDecimalIntoInput(value);
    return;
  }

  if (usesFractionAnswerFields()) {
    if (value === ',') {
      return;
    }

    if (value === '/') {
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
  } else if (problem.type === 'fraction-compound') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatCompoundFractionDisplayHtml(problem);
  } else if (problem.type === 'decimal-fraction-mixed') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatDecimalFractionMixedDisplayHtml(problem);
  } else if (isIntegerArithmeticProblem(problem)) {
    problemEl.innerHTML = formatIntegerArithmeticDisplayHtml(problem);
  } else if (problem.type === 'non-integer-add-subtract') {
    fractionAnswerInputShape = getNonIntegerAnswerKind(problem) === 'fraction' ? 'fraction' : 'number';
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatNonIntegerAddSubtractDisplayHtml(problem);
    updateFractionAnswerShapeUi();
  } else if (problem.type === 'non-integer-multiply-divide') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length + 1;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = String(FRACTION_ADD_ANSWER_MAX).length;
    problemEl.innerHTML = formatNonIntegerMultiplyDivideDisplayHtml(problem);
    updateFractionAnswerShapeUi();
  } else if (problem.type === 'powers') {
    problemEl.innerHTML = formatPowersDisplayHtml(problem);
  } else {
  problemEl.textContent = formatProblemText(problem);
  }

  if (activeExerciseMode === 'decimal-fraction-combined' && !isFractionAnswerProblem(problem)) {
    fractionAnswerInputShape = 'number';
    updateFractionAnswerShapeUi();
  }

  if (isMultiModeExercise()) {
    setAnswerInputModeForProblem(problem);
  }

  const canAnswer = isMultiModeExercise()
    ? canAnswerProblem(problem)
    : (isFractionExerciseMode()
      || isIntegerExerciseMode()
      || isNonIntegerExerciseMode()
      || isPowersExerciseMode()
      || getSelectedOperations().length > 0);
  setFormEnabled(canAnswer);

  if (canAnswer) {
    clearAnswerInputs();
    focusAnswerInput();
  }

  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  showVerifyAction();
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
  } else if (problem.type === 'fraction-compound') {
    item.type = 'fraction-compound';
    item.numerator = cloneCompoundPart(problem.numerator);
    item.denominator = cloneCompoundPart(problem.denominator);
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
  } else if (problem.type === 'decimal-fraction-mixed') {
    item.type = 'decimal-fraction-mixed';
    item.terms = problem.terms.map(cloneMixedTerm);
    item.operators = [...problem.operators];
    item.parenthesesGroup = problem.parenthesesGroup ?? null;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
  } else if (isIntegerArithmeticProblem(problem)) {
    item.type = problem.type;
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.operators = [...problem.operators];
    item.answer = problem.answer;
  } else if (problem.type === 'non-integer-add-subtract') {
    item.type = 'non-integer-add-subtract';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.operators = [...problem.operators];
    item.operandKind = problem.operandKind;
    item.answerKind = problem.answerKind;
    item.answer = problem.answer;
    item.answerDecimals = problem.answerDecimals;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
    item.answerNegative = problem.answerNegative;
  } else if (problem.type === 'non-integer-multiply-divide') {
    item.type = 'non-integer-multiply-divide';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.operators = [...problem.operators];
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
    item.answerNegative = problem.answerNegative;
  } else if (problem.type === 'powers') {
    item.type = 'powers';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.operators = [...problem.operators];
    item.answer = problem.answer;
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

    if (dueRetry.type === 'fraction-compound') {
      return {
        type: 'fraction-compound',
        numerator: cloneCompoundPart(dueRetry.numerator),
        denominator: cloneCompoundPart(dueRetry.denominator),
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'decimal-fraction-mixed') {
      return {
        type: 'decimal-fraction-mixed',
        terms: dueRetry.terms.map(cloneMixedTerm),
        operators: [...dueRetry.operators],
        parenthesesGroup: dueRetry.parenthesesGroup ?? null,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'integer-add-subtract'
      || dueRetry.type === 'integer-multiply-divide'
      || dueRetry.type === 'integer-mixed') {
      return {
        type: dueRetry.type,
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        answer: dueRetry.answer,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'non-integer-add-subtract') {
      return {
        type: 'non-integer-add-subtract',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        operandKind: dueRetry.operandKind,
        answerKind: dueRetry.answerKind,
        answer: dueRetry.answer,
        answerDecimals: dueRetry.answerDecimals,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        answerNegative: dueRetry.answerNegative,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'non-integer-multiply-divide') {
      return {
        type: 'non-integer-multiply-divide',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        answerNegative: dueRetry.answerNegative,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'powers') {
      return {
        type: 'powers',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        answer: dueRetry.answer,
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
    if (hasCrossTypeSelection()) {
      appTitleEl.textContent = DECIMAL_FRACTION_COMBINED_APP_TITLE;
      return;
    }

    if (hasIntegerOnlySelection()) {
      appTitleEl.textContent = INTEGER_APP_TITLE;
      return;
    }

    if (hasPowersOnlySelection()) {
      appTitleEl.textContent = POWERS_APP_TITLE;
      return;
    }

    appTitleEl.textContent = APP_TITLE;
    return;
  }

  if (isMultiModeExercise()) {
    appTitleEl.textContent = APP_TITLE;
    return;
  }

  if (isPowersExerciseMode()) {
    appTitleEl.textContent = POWERS_APP_TITLE;
    return;
  }

  if (isIntegerExerciseMode() || isNonIntegerExerciseMode()) {
    appTitleEl.textContent = INTEGER_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'basic-form'
    || activeExerciseMode === 'fraction-add'
    || activeExerciseMode === 'fraction-subtract'
    || activeExerciseMode === 'fraction-combined'
    || activeExerciseMode === 'fraction-multiply'
    || activeExerciseMode === 'fraction-divide'
    || activeExerciseMode === 'fraction-compound') {
    appTitleEl.textContent = FRACTION_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'decimal-fraction-combined') {
    appTitleEl.textContent = DECIMAL_FRACTION_COMBINED_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'decimal') {
    appTitleEl.textContent = DECIMAL_APP_TITLE;
    return;
  }

  appTitleEl.textContent = APP_TITLE;
}

function showSetupFeedback(message) {
  setupFeedbackEl.textContent = message;
  setupFeedbackEl.hidden = message === '';
}

function resetSession() {
  sessionResults = [];
  sessionSelectedModes = [];
  activeExerciseModePool = [];
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
  appEl.classList.remove('app--wide', 'app--exercise');
  viewingSharedAnalysis = false;
  activeExerciseMode = null;
  currentAnswerInputMode = null;
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
  const resolvedMode = resolveActiveExerciseMode();
  if (resolvedMode === null) {
    showSetupFeedback(getSetupStartBlockReason());
    return;
  }

  activeExerciseMode = resolvedMode;
  const selectedModes = captureSessionModeSelection();

  hideAllScreens();
  exerciseScreenEl.hidden = false;
  appEl.classList.remove('app--wide');
  appEl.classList.add('app--exercise');
  resetProgress();
  sessionSelectedModes = selectedModes;
  activeExerciseModePool = resolvedMode === 'multi-mode'
    ? buildExerciseModePool()
    : [resolvedMode];
  if (activeExerciseMode !== 'multi-mode') {
    setAnswerInputMode(activeExerciseMode);
  }
  updateTitle();
  newProblem();
}

function showAnalysisScreen() {
  hideAllScreens();
  analysisScreenEl.hidden = false;
  appEl.classList.remove('app--exercise');
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
  updateTitle();
}

function handleIntegerModeSelectionChange() {
  showSetupFeedback('');
  updateStartButton();
  updateTitle();
}

function handlePowersModeSelectionChange() {
  showSetupFeedback('');
  updateStartButton();
  updateTitle();
}

primaryActionBtn.addEventListener('click', () => {
  if (awaitingNextProblem) {
    newProblem();
    return;
  }

  formEl.requestSubmit();
});

formEl.addEventListener('submit', (event) => {
  event.preventDefault();

  if (awaitingNextProblem) {
    return;
  }

  if (isFractionAnswerProblem(currentProblem)) {
    const correctFraction = {
      num: currentProblem.answerNum,
      den: currentProblem.answerDen,
    };

    if (isNumberAnswerInputShape()) {
      const userValue = parseAnswer(inputEl.value);
      if (userValue === null) {
        showAnswerValidationFeedback();
        return;
      }

      const isCorrect = numericAnswerMatchesFraction(
        userValue,
        correctFraction.num,
        correctFraction.den,
      );

      if (isCorrect) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }

      recordSessionAnswer(userValue, isCorrect);
      finishAnswerReview(isCorrect);
      return;
    }

    const userAnswer = getFractionAnswerFromInputs();
    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    let isCorrect = false;
    let feedbackMessage = 'Špatně.';

    if (currentProblem.type === 'basic-form'
      && (!isProductOfBasicFormPrimes(userAnswer.num) || !isProductOfBasicFormPrimes(userAnswer.den))) {
      feedbackMessage = 'Špatně.';
    } else {
      const result = evaluateFractionAnswer(userAnswer, correctFraction);
      isCorrect = result.isCorrect;
      feedbackMessage = result.feedbackMessage;
    }

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isIntegerArithmeticProblem(currentProblem) || isPowersProblem(currentProblem)) {
    const userAnswer = parseAnswer(inputEl.value);
    if (userAnswer === null || !Number.isInteger(userAnswer)) {
      showAnswerValidationFeedback();
      return;
    }

    const isCorrect = userAnswer === currentProblem.answer;

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (currentProblem?.type === 'non-integer-multiply-divide') {
    const userAnswer = getNonIntegerFractionAnswerFromInputs();
    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect, feedbackMessage } = evaluateFractionAnswer(userAnswer, {
      num: currentProblem.answerNum,
      den: currentProblem.answerDen,
      negative: currentProblem.answerNegative,
    });

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (currentProblem?.type === 'non-integer-add-subtract') {
    if (getNonIntegerAnswerKind(currentProblem) === 'decimal') {
      const userAnswer = parseAnswer(inputEl.value);
      if (userAnswer === null) {
        showAnswerValidationFeedback();
        return;
      }

      const isCorrect = answersMatch(
        userAnswer,
        currentProblem.answer,
        currentProblem.answerDecimals,
      );

      if (isCorrect) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }

      recordSessionAnswer(userAnswer, isCorrect);
      finishAnswerReview(isCorrect);
      return;
    }

    const userAnswer = getNonIntegerFractionAnswerFromInputs();
    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect, feedbackMessage } = evaluateFractionAnswer(userAnswer, {
      num: currentProblem.answerNum,
      den: currentProblem.answerDen,
      negative: currentProblem.answerNegative,
    });

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (getSelectedOperations().length === 0) {
    return;
  }

  const userAnswer = parseAnswer(inputEl.value);
  if (userAnswer === null) {
    showAnswerValidationFeedback();
    return;
  }

  const isCorrect = answersMatch(
    userAnswer,
    currentProblem.answer,
    currentProblem.answerDecimals,
  );

  if (isCorrect) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }

  recordSessionAnswer(userAnswer, isCorrect);
  finishAnswerReview(isCorrect);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || exerciseScreenEl.hidden || !awaitingNextProblem) {
    return;
  }

  if (event.target === primaryActionBtn || event.target === backBtn || event.target === finishBtn) {
    return;
  }

  event.preventDefault();
  newProblem();
});

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
  const startBlockReason = getSetupStartBlockReason();
  if (startBlockReason !== '') {
    showSetupFeedback(startBlockReason);
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

integerModeCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', handleIntegerModeSelectionChange);
});

powersModeCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', handlePowersModeSelectionChange);
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
