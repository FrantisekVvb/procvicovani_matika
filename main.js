const problemEl = document.getElementById('problem');
const appTitleEl = document.getElementById('app-title');
const appEl = document.querySelector('.app');
const setupScreenEl = document.getElementById('setup-screen');
const setupFeedbackEl = document.getElementById('setup-feedback');
const exerciseScreenEl = document.getElementById('exercise-screen');
const analysisScreenEl = document.getElementById('analysis-screen');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const finishBtn = document.getElementById('finish-btn');
const exerciseStatsTotalEl = document.getElementById('exercise-stats-total');
const exerciseStatsCorrectEl = document.getElementById('exercise-stats-correct');
const exerciseStatsWrongEl = document.getElementById('exercise-stats-wrong');
const analysisSummaryEl = document.getElementById('analysis-summary');
const analysisNameInputEl = document.getElementById('analysis-name-input');
const analysisNameDisplayEl = document.getElementById('analysis-name-display');
const analysisLevelsEl = document.getElementById('analysis-levels');
const analysisTableBodyEl = document.getElementById('analysis-table-body');
const analysisProblemViewEl = document.getElementById('analysis-problem-view');
const analysisProblemViewButtons = [...document.querySelectorAll('[data-problem-view]')];
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
const setupCategoryRadios = document.querySelectorAll('#setup-category-picker input[type="radio"]');
const combinableSetupPanelsEl = document.getElementById('combinable-setup-panels');
const exclusiveSetupPanelsEl = document.getElementById('exclusive-setup-panels');
const exclusiveModeRadios = document.querySelectorAll('#exclusive-setup-panels input[type="radio"]');
const requireBasicFormOptionEl = document.getElementById('require-basic-form-option');
const requireBasicFormCheckbox = document.getElementById('require-basic-form-checkbox');
const createAssignmentCheckboxEl = document.getElementById('create-assignment-checkbox');
const setupAssignmentOptionsEl = document.getElementById('setup-assignment-options');
const assignmentCountInputEl = document.getElementById('assignment-count-input');
const assignmentLinkFeedbackEl = document.getElementById('assignment-link-feedback');
const assignmentLinkWrapEl = document.getElementById('assignment-link-wrap');
const assignmentLinkInputEl = document.getElementById('assignment-link-input');
const assignmentLinkCopyBtn = document.getElementById('assignment-link-copy-btn');
const assignmentLinkQrBtn = document.getElementById('assignment-link-qr-btn');
const assignmentLinkQrWrapEl = document.getElementById('assignment-link-qr-wrap');
const assignmentLinkQrCanvasEl = document.getElementById('assignment-link-qr-canvas');
const assignmentLinkQrPreviewBtn = document.getElementById('assignment-link-qr-preview-btn');
const assignmentLinkQrLightboxEl = document.getElementById('assignment-link-qr-lightbox');
const assignmentLinkQrLightboxCanvasEl = document.getElementById('assignment-link-qr-lightbox-canvas');
const assignmentLinkQrLightboxCloseBtn = document.getElementById('assignment-link-qr-lightbox-close-btn');
const assignmentDepotLinkWrapEl = document.getElementById('assignment-depot-link-wrap');
const assignmentDepotLinkInputEl = document.getElementById('assignment-depot-link-input');
const assignmentDepotLinkCopyBtn = document.getElementById('assignment-depot-link-copy-btn');
const assignmentDepotLinkDownloadBtn = document.getElementById('assignment-depot-link-download-btn');
const depotScreenEl = document.getElementById('depot-screen');
const depotTableWrapEl = document.getElementById('depot-table-wrap');
const depotEmptyEl = document.getElementById('depot-empty');
const depotRefreshBtn = document.getElementById('depot-refresh-btn');
const linearEquationActionsEl = document.getElementById('linear-equation-actions');
const linearEquationActionButtons = document.querySelectorAll('[data-linear-equation-answer]');
const decimalCompareInequalityEl = document.getElementById('decimal-compare-inequality');
const decimalCompareInequalityButtons = document.querySelectorAll('[data-decimal-compare-sign]');
const decimalCompareSortEl = document.getElementById('decimal-compare-sort');
const decimalCompareSortListEl = document.getElementById('decimal-compare-sort-list');
const answerVariablePrefixEl = document.getElementById('answer-variable-prefix');

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

const WITHIN_PANEL_COMBINATION_LEVEL_BOOST = 1;
const MULTI_MODE_PHASE = {
  INDIVIDUAL: 'individual',
  COMBINATION: 'combination',
};
const USER_VISIBLE_LEVEL_THRESHOLD = 4;
const USER_VISIBLE_MAX_LEVEL = 5;
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
const LINEAR_EQUATION_APP_TITLE = 'Lineární rovnice';
const LINEAR_EQUATION_FRACTION_APP_TITLE = 'Lineární rovnice se zlomky';
const LINEAR_EQUATION_NO_SOLUTION_LABEL = 'nemá řešení';
const LINEAR_EQUATION_INFINITE_SOLUTION_LABEL = 'libovolné číslo';
const POWER_MAX_LEVEL = 4;
const POWER_SQUARE_BASE_MAX = 15;
const POWER_HIGH_EXP_BASE_MAX = 5;
const POWER_ANSWER_MIN = -1000;
const POWER_ANSWER_MAX = 1000;
const POWER_PAREN_OPERAND_MAX = 9;
const SQRT_MAX_LEVEL = 3;
const SQRT_MAX_ROOT = 15;
const SQRT_ANSWER_MIN = -1000;
const SQRT_ANSWER_MAX = 1000;
const POWERS_SQRT_COMBINED_MAX_LEVEL = 3;
const NON_INTEGER_POWERS_MAX_LEVEL = 3;
const NON_INTEGER_POWERS_SQUARE = 2;
const NON_INTEGER_POWERS_DECIMAL_MIN = 0.1;
const NON_INTEGER_POWERS_DECIMAL_MAX = 1.5;
const NON_INTEGER_SQRT_MAX_LEVEL = 3;
const NON_INTEGER_SQRT_DECIMAL_MIN = 0.1;
const NON_INTEGER_SQRT_DECIMAL_MAX = 1.5;
const FRACTION_POWER_STYLES = ['whole', 'numerator', 'denominator'];
const MATH_SURD_PATH = 'M0 5.36 H1.1327 L2.7268 10.35 L6.3869 0 H28';
const MATH_SURD_VIEWBOX = '0 0 28 11';
const MATH_PAREN_LEFT_PATH = 'M3.87 0 H4.83 C2.31 4.17 1.05 8.49 1.05 13.02 C1.05 17.55 2.31 21.87 4.83 26.04 H3.87 C1.29 21.99 0 17.64 0 13.02 C0 8.4 1.29 4.05 3.87 0 Z';
const MATH_PAREN_RIGHT_PATH = 'M0 0 H0.99 C3.57 4.05 4.86 8.4 4.86 13.02 C4.86 17.64 3.57 21.99 0.99 26.04 H0 C2.55 21.9 3.81 17.55 3.81 13.02 C3.81 8.49 2.55 4.14 0 0 Z';
const MATH_PAREN_VIEWBOX = '0 0 5 27';
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
const LINEAR_EQUATION_MAX_LEVEL = 3;
const LINEAR_EQUATION_FRACTION_MAX_LEVEL = 6;
const LINEAR_EQUATION_FRACTION_DEN_MAX = 6;
const LINEAR_EQUATION_FRACTION_LEVEL6_COEF_MAX = 8;
const LINEAR_EQUATION_FRACTION_CONST_MAX = 6;
const LINEAR_EQUATION_FRACTION_UNIQUE_ANSWER_DEN_MAX = 4;
const LINEAR_EQUATION_FRACTION_UNIQUE_ANSWER_NUM_MAX = 10;
const LINEAR_EQUATION_COEF_MAX = 9;
const DECIMAL_COMPARE_MAX_LEVEL = 5;
const DECIMAL_COMPARE_SAME_WHOLE_RATE = 0.65;
const DECIMAL_COMPARE_EQUAL_RATE = 0.15;
const DECIMAL_COMPARE_APP_TITLE = 'Porovnávání desetinných čísel';
const DECIMAL_FRACTION_CONVERT_MAX_LEVEL = 1;
const DECIMAL_FRACTION_CONVERT_APP_TITLE = 'Desetinná čísla a zlomky';
const DECIMAL_FRACTION_CONVERT_DENOMINATORS_COMMON = [10, 100, 1000];
const DECIMAL_FRACTION_CONVERT_DENOMINATORS_SPECIAL = [2, 4, 5, 25, 50];
const DECIMAL_FRACTION_CONVERT_SPECIAL_DEN_RATE = 0.2;
const DECIMAL_FRACTION_CONVERT_MAX_DECIMAL_PLACES = 3;
const DECIMAL_FRACTION_CONVERT_ANSWER_MAX = 1000;
const LENGTH_CONVERT_MAX_LEVEL = 5;
const LENGTH_CONVERT_APP_TITLE = 'Délka';
const LENGTH_UNIT_ORDER = ['mm', 'cm', 'dm', 'm', 'km'];
const LENGTH_UNIT_TO_MM = {
  mm: 1,
  cm: 10,
  dm: 100,
  m: 1000,
  km: 1000000,
};
const LENGTH_CONVERT_ANSWER_MAX = 999999;
const WEIGHT_CONVERT_MAX_LEVEL = 5;
const WEIGHT_CONVERT_APP_TITLE = 'Hmotnost';
const WEIGHT_UNIT_ORDER = ['mg', 'g', 'dag', 'kg', 't'];
const WEIGHT_UNIT_TO_MG = {
  mg: 1,
  g: 1000,
  dag: 10000,
  kg: 1000000,
  t: 1000000000,
};
const WEIGHT_CONVERT_ANSWER_MAX = 999999;
const AREA_CONVERT_MAX_LEVEL = 5;
const AREA_CONVERT_APP_TITLE = 'Obsah';
const AREA_UNIT_ORDER = ['mm2', 'cm2', 'dm2', 'm2', 'km2', 'a', 'ha'];
const AREA_UNIT_LABELS = {
  mm2: 'mm²',
  cm2: 'cm²',
  dm2: 'dm²',
  m2: 'm²',
  km2: 'km²',
  a: 'a',
  ha: 'ha',
};
const AREA_UNIT_TO_MM2 = {
  mm2: 1,
  cm2: 100,
  dm2: 10000,
  m2: 1000000,
  km2: 1000000000000,
  a: 100000000,
  ha: 10000000000,
};
const AREA_CONVERT_ANSWER_MAX = 999999;
const VOLUME_CONVERT_MAX_LEVEL = 5;
const VOLUME_CONVERT_APP_TITLE = 'Objem';
const PERCENT_PART_MAX_LEVEL = 2;
const PERCENT_PART_APP_TITLE = 'Výpočet části celku';
const VOLUME_UNIT_ORDER = ['mm3', 'cm3', 'dm3', 'm3', 'ml', 'cl', 'dl', 'l', 'hl'];
const VOLUME_UNIT_LABELS = {
  mm3: 'mm³',
  cm3: 'cm³',
  dm3: 'dm³',
  m3: 'm³',
  ml: 'ml',
  cl: 'cl',
  dl: 'dl',
  l: 'l',
  hl: 'hl',
};
const VOLUME_UNIT_TO_MM3 = {
  mm3: 1,
  cm3: 1000,
  dm3: 1000000,
  m3: 1000000000,
  ml: 1000,
  cl: 10000,
  dl: 100000,
  l: 1000000,
  hl: 100000000,
};
const VOLUME_CONVERT_ANSWER_MAX = 999999;
const PERCENT_PART_ANSWER_MAX = 999999;
const PERCENT_PART_BASIC_PERCENTS = [1, 10, 20, 25, 50];
const PERCENT_PART_LARGE_PERCENT_MIN = 110;
const PERCENT_PART_LARGE_PERCENT_MAX = 250;
const PERCENT_PART_MAX_SIGNIFICANT_DIGITS = 3;
const INTEGER_COMPARE_MAX_LEVEL = 4;
const INTEGER_COMPARE_VALUE_MIN = -99;
const INTEGER_COMPARE_VALUE_MAX = 99;
const INTEGER_COMPARE_POSITIVE_MAX = 99;
const INTEGER_COMPARE_BOTH_POSITIVE_RATE = 0.1;
const INTEGER_COMPARE_MIXED_SIGN_RATE = 0.1;
const INTEGER_COMPARE_NON_POSITIVE_ZERO_RATE = 0.2;
const INTEGER_COMPARE_EQUAL_RATE = 0.15;
const INTEGER_COMPARE_APP_TITLE = 'Porovnávání celých čísel';
const NON_INTEGER_COMPARE_MAX_LEVEL = 6;
const NON_INTEGER_COMPARE_APP_TITLE = 'Porovnávání necelých čísel';
const FRACTION_COMPARE_MAX_LEVEL = 5;
const FRACTION_COMPARE_EQUAL_RATE = 0.15;
const FRACTION_COMPARE_ORDER_LCM_MAX = 48;
const FRACTION_COMPARE_APP_TITLE = 'Porovnávání zlomků';
const FRACTION_ZLOMEK_MAX_LEVEL = 1;
const FRACTION_ZLOMEK_APP_TITLE = 'Zlomek';
const FRACTION_EXPAND_REDUCE_MAX_LEVEL = 5;
const FRACTION_EXPAND_REDUCE_APP_TITLE = 'Rozšiřování a krácení';
const FRACTION_EXPAND_REDUCE_VALUE_MAX = 20;
const FRACTION_EXPAND_REDUCE_DEN_MAX = 24;
const FRACTION_EXPAND_REDUCE_MULTIPLIER_PAIRS_NON_DIVISIBLE = [
  [2, 3],
  [3, 4],
  [2, 5],
  [3, 5],
  [4, 5],
];
const FRACTION_COMPARE_ORDER_MULTIPLIER_SETS = {
  2: [
    [1, 2],
    [1, 3],
    [2, 3],
    [1, 4],
    [2, 4],
    [3, 4],
  ],
  3: [
    [1, 2, 3],
    [1, 2, 4],
    [1, 3, 6],
    [2, 3, 6],
  ],
  4: [
    [1, 2, 3, 4],
    [1, 2, 3, 6],
    [1, 2, 4, 8],
    [2, 3, 4, 6],
  ],
};
const FRACTION_COMPARE_ORDER_DENOMINATOR_PRESETS = {
  2: [
    [2, 4],
    [3, 5],
    [3, 6],
    [3, 9],
    [5, 10],
    [5, 15],
  ],
  3: [
    [2, 4, 8],
    [3, 5, 9],
    [3, 6, 9],
    [2, 3, 6],
    [5, 10, 15],
  ],
  4: [
    [2, 4, 6, 8],
    [3, 5, 9, 15],
    [2, 3, 6, 9],
    [3, 4, 6, 12],
    [5, 6, 10, 15],
  ],
};
const FRACTION_COMPARE_ORDER_BASES = [2, 3, 5];
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
let shuffledExerciseModeDeck = [];
let lastPickedExerciseMode = null;
let multiModeFocusedModeIndex = 0;
let multiModePhase = MULTI_MODE_PHASE.INDIVIDUAL;
let multiModeIndividualQueue = [];
let multiModeWithinPanelQueue = [];
let multiModeCombinationUseCrossPanel = true;
let shuffledWithinPanelDeck = [];
let lastPickedWithinPanel = null;
let currentAnswerInputMode = null;
let viewingSharedAnalysis = false;
let activeAssignmentConfig = null;
let pendingAssignmentDepotId = null;
let awaitingAssignmentSubmission = false;
let activeDepotId = null;
let activeFractionInputEl = null;
let fractionAnswerInputShape = 'fraction';
let analysisProblemDisplayMode = 'text';
let linearEquationSpecialAnswer = null;
let decimalCompareSelectedSign = null;
let decimalCompareSortOrder = [];
let decimalCompareDragFromIndex = null;

function getSelectedSetupCategory() {
  const selected = [...setupCategoryRadios].find((radio) => radio.checked);

  return selected?.value ?? null;
}

function isCombinableSetupCategory() {
  return getSelectedSetupCategory() === 'combinable';
}

function isExclusiveSetupCategory() {
  return getSelectedSetupCategory() === 'exclusive';
}

function isAssignmentSetupCategory() {
  return createAssignmentCheckboxEl?.checked === true;
}

function getSelectedExclusiveMode() {
  if (activeAssignmentConfig?.exclusiveMode) {
    return activeAssignmentConfig.exclusiveMode;
  }

  if (!isExclusiveSetupCategory()) {
    return null;
  }

  const selected = [...exclusiveModeRadios].find((radio) => radio.checked);

  return selected?.value ?? null;
}

function hasBasicFormMode() {
  return getSelectedExclusiveMode() === 'basic-form';
}

function hasLinearEquationMode() {
  return getSelectedExclusiveMode() === 'linear-equation';
}

function hasLinearEquationFractionMode() {
  return getSelectedExclusiveMode() === 'linear-equation-fraction';
}

function hasDecimalCompareMode() {
  return getSelectedExclusiveMode() === 'decimal-compare';
}

function hasDecimalFractionConvertMode() {
  return getSelectedExclusiveMode() === 'decimal-fraction-convert';
}

function hasIntegerCompareMode() {
  return getSelectedExclusiveMode() === 'integer-compare';
}

function hasNonIntegerCompareMode() {
  return getSelectedExclusiveMode() === 'non-integer-compare';
}

function hasFractionCompareMode() {
  return getSelectedExclusiveMode() === 'fraction-compare';
}

function hasFractionZlomekMode() {
  return getSelectedExclusiveMode() === 'fraction-zlomek';
}

function hasFractionExpandReduceMode() {
  return getSelectedExclusiveMode() === 'fraction-expand-reduce';
}

function hasLengthConvertMode() {
  return getSelectedExclusiveMode() === 'length-convert';
}

function hasWeightConvertMode() {
  return getSelectedExclusiveMode() === 'weight-convert';
}

function hasAreaConvertMode() {
  return getSelectedExclusiveMode() === 'area-convert';
}

function hasVolumeConvertMode() {
  return getSelectedExclusiveMode() === 'volume-convert';
}

function hasPercentPartMode() {
  return getSelectedExclusiveMode() === 'percent-part';
}

function isLinearEquationExerciseMode() {
  return activeExerciseMode === 'linear-equation';
}

function isLinearEquationFractionExerciseMode() {
  return activeExerciseMode === 'linear-equation-fraction';
}

function isDecimalCompareExerciseMode() {
  return activeExerciseMode === 'decimal-compare';
}

function isDecimalFractionConvertExerciseMode() {
  return activeExerciseMode === 'decimal-fraction-convert';
}

function isIntegerCompareExerciseMode() {
  return activeExerciseMode === 'integer-compare';
}

function isNonIntegerCompareExerciseMode() {
  return activeExerciseMode === 'non-integer-compare';
}

function isFractionCompareExerciseMode() {
  return activeExerciseMode === 'fraction-compare';
}

function isFractionZlomekExerciseMode() {
  return activeExerciseMode === 'fraction-zlomek';
}

function isFractionExpandReduceExerciseMode() {
  return activeExerciseMode === 'fraction-expand-reduce';
}

function isLengthConvertExerciseMode() {
  return activeExerciseMode === 'length-convert';
}

function isWeightConvertExerciseMode() {
  return activeExerciseMode === 'weight-convert';
}

function isAreaConvertExerciseMode() {
  return activeExerciseMode === 'area-convert';
}

function isVolumeConvertExerciseMode() {
  return activeExerciseMode === 'volume-convert';
}

function isPercentPartExerciseMode() {
  return activeExerciseMode === 'percent-part';
}

function isCompareExerciseMode() {
  return isDecimalCompareExerciseMode()
    || isIntegerCompareExerciseMode()
    || isNonIntegerCompareExerciseMode()
    || isFractionCompareExerciseMode();
}

function getSelectedFractionModes() {
  if (activeAssignmentConfig) {
    return [...activeAssignmentConfig.fractionModes];
  }

  return [...fractionModeCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function getSelectedIntegerModes() {
  if (activeAssignmentConfig) {
    return [...activeAssignmentConfig.integerModes];
  }

  return [...integerModeCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function getPowersModePickerValues() {
  if (activeAssignmentConfig) {
    return [...activeAssignmentConfig.powersModes];
  }

  return [...powersModeCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function hasPowersMode(selected = getPowersModePickerValues()) {
  return selected.includes('powers');
}

function hasSqrtMode(selected = getPowersModePickerValues()) {
  return selected.includes('sqrt');
}

function hasNonIntegerPowersMode(selected = getPowersModePickerValues()) {
  return selected.includes('non-integer-powers');
}

function hasNonIntegerSqrtMode(selected = getPowersModePickerValues()) {
  return selected.includes('non-integer-sqrt');
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
    && !hasExclusiveModeSelection()
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasExclusiveModeSelection() {
  return getSelectedExclusiveMode() !== null;
}

function hasBasicFormOnlySelection() {
  return hasBasicFormMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasLinearEquationOnlySelection() {
  return hasLinearEquationMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasLinearEquationFractionOnlySelection() {
  return hasLinearEquationFractionMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasDecimalCompareOnlySelection() {
  return hasDecimalCompareMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasDecimalFractionConvertOnlySelection() {
  return hasDecimalFractionConvertMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasIntegerCompareOnlySelection() {
  return hasIntegerCompareMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasNonIntegerCompareOnlySelection() {
  return hasNonIntegerCompareMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasFractionCompareOnlySelection() {
  return hasFractionCompareMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasFractionZlomekOnlySelection() {
  return hasFractionZlomekMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasFractionExpandReduceOnlySelection() {
  return hasFractionExpandReduceMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasLengthConvertOnlySelection() {
  return hasLengthConvertMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasWeightConvertOnlySelection() {
  return hasWeightConvertMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasAreaConvertOnlySelection() {
  return hasAreaConvertMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasVolumeConvertOnlySelection() {
  return hasVolumeConvertMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasPercentPartOnlySelection() {
  return hasPercentPartMode()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode();
}

function hasPowersOnlySelection() {
  return hasPowersMode()
    && !hasSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode()
    && !hasExclusiveModeSelection()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0;
}

function hasSqrtOnlySelection() {
  return hasSqrtMode()
    && !hasPowersMode()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode()
    && !hasExclusiveModeSelection()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0;
}

function hasNonIntegerPowersOnlySelection() {
  return hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode()
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasExclusiveModeSelection()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0;
}

function hasNonIntegerSqrtOnlySelection() {
  return hasNonIntegerSqrtMode()
    && !hasNonIntegerPowersMode()
    && !hasPowersMode()
    && !hasSqrtMode()
    && !hasExclusiveModeSelection()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0;
}

function hasPowersSqrtOnlySelection() {
  return hasPowersSqrtCombinedSelection()
    && !hasNonIntegerPowersMode()
    && !hasNonIntegerSqrtMode()
    && !hasExclusiveModeSelection()
    && getSelectedOperations().length === 0
    && getSelectedFractionModes().length === 0
    && getSelectedIntegerModes().length === 0;
}

function hasSetupSelection() {
  if (isExclusiveSetupCategory()) {
    return hasExclusiveModeSelection();
  }

  return hasCombinableModeSelection();
}

function hasCombinableModeSelection() {
  if (!isCombinableSetupCategory()) {
    return false;
  }

  return getSelectedOperations().length > 0
    || getSelectedFractionModes().length > 0
    || getSelectedIntegerModes().length > 0
    || hasPowersMode()
    || hasSqrtMode()
    || hasNonIntegerPowersMode()
    || hasNonIntegerSqrtMode();
}

function clearCombinableModeSelection() {
  operationCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  integerModeCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  powersModeCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  fractionModeCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

function clearExclusiveModeSelection() {
  exclusiveModeRadios.forEach((radio) => {
    radio.checked = false;
    radio.dataset.wasChecked = 'false';
  });
}

function updateSetupCategoryUi() {
  const combinable = isCombinableSetupCategory();
  const exclusive = isExclusiveSetupCategory();
  const assignment = isAssignmentSetupCategory();

  if (combinableSetupPanelsEl) {
    combinableSetupPanelsEl.hidden = !combinable;
  }

  if (exclusiveSetupPanelsEl) {
    exclusiveSetupPanelsEl.hidden = !exclusive;
  }

  if (requireBasicFormOptionEl) {
    requireBasicFormOptionEl.hidden = !combinable;
  }

  if (setupAssignmentOptionsEl) {
    setupAssignmentOptionsEl.hidden = !assignment;
  }

  startBtn.textContent = assignment ? 'Vytvořit úkol' : 'Spustit';
}

function handleCreateAssignmentChange() {
  hideAssignmentLinkUi();
  showSetupFeedback('');
  updateSetupCategoryUi();
  updateStartButton();
  updateTitle();
}

function hideAssignmentLinkUi() {
  if (!assignmentLinkFeedbackEl || !assignmentLinkWrapEl) {
    return;
  }

  assignmentLinkFeedbackEl.hidden = true;
  assignmentLinkWrapEl.hidden = true;
  assignmentLinkFeedbackEl.textContent = '';
  assignmentLinkFeedbackEl.classList.remove('analysis__link-feedback--error');
  if (assignmentLinkInputEl) {
    assignmentLinkInputEl.value = '';
  }
  if (assignmentDepotLinkWrapEl) {
    assignmentDepotLinkWrapEl.hidden = true;
  }
  if (assignmentDepotLinkInputEl) {
    assignmentDepotLinkInputEl.value = '';
  }
  hideAssignmentLinkQrCode();
  setAssignmentCountInputLocked(false);
}

function hideAssignmentLinkQrCode() {
  hideAssignmentLinkQrLightbox();
  if (assignmentLinkQrWrapEl) {
    assignmentLinkQrWrapEl.hidden = true;
  }
  if (assignmentLinkQrBtn) {
    assignmentLinkQrBtn.setAttribute('aria-expanded', 'false');
  }
}

function hideAssignmentLinkQrLightbox() {
  if (assignmentLinkQrLightboxEl) {
    assignmentLinkQrLightboxEl.hidden = true;
  }
}

let qrCodeLibraryPromise = null;

function loadQrCodeLibrary() {
  if (window.QRCode) {
    return Promise.resolve();
  }

  if (!qrCodeLibraryPromise) {
    qrCodeLibraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('qr-load-failed'));
      document.head.appendChild(script);
    });
  }

  return qrCodeLibraryPromise;
}

async function renderAssignmentLinkQrCanvas(canvasEl, url, width) {
  await loadQrCodeLibrary();
  await window.QRCode.toCanvas(canvasEl, url, {
    width,
    margin: 1,
    errorCorrectionLevel: 'M',
  });
}

async function toggleAssignmentLinkQrCode() {
  const url = assignmentLinkInputEl?.value.trim();
  if (!url || !assignmentLinkQrWrapEl || !assignmentLinkQrCanvasEl) {
    return;
  }

  if (!assignmentLinkQrWrapEl.hidden) {
    hideAssignmentLinkQrCode();
    return;
  }

  try {
    assignmentLinkFeedbackEl.hidden = true;
    assignmentLinkFeedbackEl.textContent = '';
    assignmentLinkFeedbackEl.classList.remove('analysis__link-feedback--error');
    await renderAssignmentLinkQrCanvas(assignmentLinkQrCanvasEl, url, 200);
    assignmentLinkQrWrapEl.hidden = false;
    assignmentLinkQrBtn?.setAttribute('aria-expanded', 'true');
  } catch {
    assignmentLinkFeedbackEl.textContent = 'QR kód se nepodařilo zobrazit.';
    assignmentLinkFeedbackEl.classList.add('analysis__link-feedback--error');
    assignmentLinkFeedbackEl.hidden = false;
  }
}

async function showAssignmentLinkQrLightbox() {
  const url = assignmentLinkInputEl?.value.trim();
  if (!url || !assignmentLinkQrLightboxEl || !assignmentLinkQrLightboxCanvasEl) {
    return;
  }

  try {
    await renderAssignmentLinkQrCanvas(assignmentLinkQrLightboxCanvasEl, url, 360);
    assignmentLinkQrLightboxEl.hidden = false;
    assignmentLinkQrLightboxCloseBtn?.focus();
  } catch {
    assignmentLinkFeedbackEl.textContent = 'QR kód se nepodařilo zobrazit.';
    assignmentLinkFeedbackEl.classList.add('analysis__link-feedback--error');
    assignmentLinkFeedbackEl.hidden = false;
  }
}

function setAssignmentCountInputLocked(locked) {
  if (!assignmentCountInputEl) {
    return;
  }

  assignmentCountInputEl.readOnly = locked;
  assignmentCountInputEl.disabled = locked;
}

function handleSetupCategoryChange() {
  if (isCombinableSetupCategory()) {
    clearExclusiveModeSelection();
  } else if (isExclusiveSetupCategory()) {
    clearCombinableModeSelection();
  }

  hideAssignmentLinkUi();
  updateSetupCategoryUi();
  showSetupFeedback('');
  updateStartButton();
  updateTitle();
}

function handleCombinableModeSelectionChange() {
  hideAssignmentLinkUi();
  showSetupFeedback('');
  updateStartButton();
  updateTitle();
}

function updateStartButton() {
  startBtn.disabled = getSetupStartBlockReason() !== '';
}

function getSelectedOperations() {
  if (activeAssignmentConfig) {
    return [...activeAssignmentConfig.operations];
  }

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
    return getBasicFormMaxValue(getInternalDisplayLevel(currentProblem));
  }

  if (currentProblem?.type === 'fraction-add'
    || currentProblem?.type === 'fraction-subtract'
    || currentProblem?.type === 'fraction-mixed'
    || currentProblem?.type === 'fraction-multiply'
    || currentProblem?.type === 'fraction-divide'
    || currentProblem?.type === 'fraction-compound'
    || currentProblem?.type === 'decimal-fraction-mixed'
    || currentProblem?.type === 'cross-panel-mixed') {
    return FRACTION_ADD_ANSWER_MAX;
  }

  if (currentProblem?.type === 'decimal-fraction-convert') {
    return DECIMAL_FRACTION_CONVERT_ANSWER_MAX;
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
    || problem?.type === 'decimal-fraction-mixed'
    || problem?.type === 'cross-panel-mixed';
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

function hasPowersSqrtCombinedSelection() {
  return hasPowersMode() && hasSqrtMode();
}

function buildExerciseModePool() {
  if (hasCrossTypeSelection()) {
    return ['decimal-fraction-combined'];
  }

  const pool = [];

  if (hasPowersSqrtCombinedSelection()) {
    pool.push('powers-sqrt-combined');
  } else {
    if (hasPowersMode()) {
      pool.push('powers');
    }

    if (hasSqrtMode()) {
      pool.push('sqrt');
    }
  }

  if (hasNonIntegerPowersMode()) {
    pool.push('non-integer-powers');
  }

  if (hasNonIntegerSqrtMode()) {
    pool.push('non-integer-sqrt');
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

  const exclusiveMode = getSelectedExclusiveMode();
  if (exclusiveMode) {
    pool.push(exclusiveMode);
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

  if (isAssignmentSetupCategory()) {
    const count = getAssignmentProblemCount();
    if (!Number.isInteger(count) || count < 1 || count > 200) {
      return 'Zadej počet úloh od 1 do 200.';
    }
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
    && activeExerciseMode !== 'non-integer-powers'
    && activeExerciseMode !== 'non-integer-sqrt'
    && activeExerciseMode !== 'powers'
    && activeExerciseMode !== 'sqrt'
    && activeExerciseMode !== 'powers-sqrt-combined'
    && activeExerciseMode !== 'linear-equation'
    && activeExerciseMode !== 'linear-equation-fraction'
    && activeExerciseMode !== 'decimal-compare'
    && activeExerciseMode !== 'integer-compare'
    && activeExerciseMode !== 'non-integer-compare'
    && activeExerciseMode !== 'fraction-compare'
    && activeExerciseMode !== 'fraction-zlomek'
    && activeExerciseMode !== 'fraction-expand-reduce'
    && activeExerciseMode !== 'decimal-fraction-convert'
    && activeExerciseMode !== 'length-convert'
    && activeExerciseMode !== 'weight-convert'
    && activeExerciseMode !== 'area-convert'
    && activeExerciseMode !== 'volume-convert'
    && activeExerciseMode !== 'percent-part';
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

function hasFractionAnswerShapeToggle() {
  return true;
}

function usesSignedFractionAnswerInput() {
  if (!isFractionAnswerInputShape()) {
    return false;
  }

  if (currentProblem?.type === 'non-integer-multiply-divide') {
    return true;
  }

  if (isLinearEquationFractionAnswerProblem(currentProblem)) {
    return true;
  }

  return currentProblem?.type === 'non-integer-add-subtract'
    && getNonIntegerAnswerKind(currentProblem) === 'fraction';
}

function isNonIntegerPowersExerciseMode() {
  return activeExerciseMode === 'non-integer-powers';
}

function isNonIntegerSqrtExerciseMode() {
  return activeExerciseMode === 'non-integer-sqrt';
}

function isPowersExerciseMode() {
  return activeExerciseMode === 'powers';
}

function isSqrtExerciseMode() {
  return activeExerciseMode === 'sqrt';
}

function isPowersSqrtCombinedExerciseMode() {
  return activeExerciseMode === 'powers-sqrt-combined';
}

function isMultiModeExercise() {
  return activeExerciseMode === 'multi-mode';
}

function getExerciseModeForProblem(problem) {
  if (problem?.type === 'powers') {
    return 'powers';
  }

  if (problem?.type === 'sqrt') {
    return 'sqrt';
  }

  if (problem?.type === 'powers-sqrt-combined') {
    return 'powers-sqrt-combined';
  }

  if (problem?.type === 'non-integer-powers') {
    return 'non-integer-powers';
  }

  if (problem?.type === 'non-integer-sqrt') {
    return 'non-integer-sqrt';
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

  if (problem?.type === 'cross-panel-mixed') {
    return 'fraction-add';
  }

  if (problem?.type === 'basic-form') {
    return 'basic-form';
  }

  if (problem?.type === 'linear-equation') {
    return 'linear-equation';
  }

  if (problem?.type === 'linear-equation-fraction') {
    return 'linear-equation-fraction';
  }

  if (problem?.type === 'decimal-compare') {
    return 'decimal-compare';
  }

  if (problem?.type === 'integer-compare') {
    return 'integer-compare';
  }

  if (problem?.type === 'non-integer-compare') {
    return 'non-integer-compare';
  }

  if (problem?.type === 'fraction-compare') {
    return 'fraction-compare';
  }

  if (problem?.type === 'fraction-zlomek') {
    return 'fraction-zlomek';
  }

  if (problem?.type === 'fraction-expand-reduce') {
    return 'fraction-expand-reduce';
  }

  if (problem?.type === 'decimal-fraction-convert') {
    return 'decimal-fraction-convert';
  }

  if (problem?.type === 'length-convert') {
    return 'length-convert';
  }

  if (problem?.type === 'weight-convert') {
    return 'weight-convert';
  }

  if (problem?.type === 'area-convert') {
    return 'area-convert';
  }

  if (problem?.type === 'volume-convert') {
    return 'volume-convert';
  }

  if (problem?.type === 'percent-part') {
    return 'percent-part';
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

function isNonIntegerPowersAnswerInputMode() {
  return getActiveAnswerInputMode() === 'non-integer-powers';
}

function isNonIntegerSqrtAnswerInputMode() {
  return getActiveAnswerInputMode() === 'non-integer-sqrt';
}

function isPowersAnswerInputMode() {
  return getActiveAnswerInputMode() === 'powers';
}

function isSqrtAnswerInputMode() {
  return getActiveAnswerInputMode() === 'sqrt';
}

function isPowersSqrtCombinedAnswerInputMode() {
  return getActiveAnswerInputMode() === 'powers-sqrt-combined';
}

function usesIntegerAnswerInput() {
  return isIntegerAnswerInputMode()
    || isPowersAnswerInputMode()
    || isSqrtAnswerInputMode()
    || isPowersSqrtCombinedAnswerInputMode();
}

function canAnswerProblem(problem) {
  return isFractionAnswerProblem(problem)
    || isIntegerArithmeticProblem(problem)
    || isPowersProblem(problem)
    || isSqrtProblem(problem)
    || isPowersSqrtCombinedProblem(problem)
    || problem?.type === 'non-integer-add-subtract'
    || problem?.type === 'non-integer-multiply-divide'
    || problem?.type === 'non-integer-powers'
    || problem?.type === 'non-integer-sqrt'
    || isLinearEquationProblem(problem)
    || isCompareProblem(problem)
    || isFractionZlomekProblem(problem)
    || isFractionExpandReduceProblem(problem)
    || isDecimalFractionConvertProblem(problem)
    || isLengthConvertProblem(problem)
    || isWeightConvertProblem(problem)
    || isAreaConvertProblem(problem)
    || isVolumeConvertProblem(problem)
    || isPercentPartProblem(problem)
    || Boolean(problem?.operands);
}

function isNonIntegerPowersProblem(problem) {
  return problem?.type === 'non-integer-powers';
}

function isNonIntegerSqrtProblem(problem) {
  return problem?.type === 'non-integer-sqrt';
}

function getNonIntegerPowersAnswerKind(problem) {
  return problem?.answerKind ?? 'fraction';
}

function isNonIntegerPowersFractionAnswerProblem(problem) {
  return isNonIntegerPowersProblem(problem) && getNonIntegerPowersAnswerKind(problem) === 'fraction';
}

function getNonIntegerPowersCorrectFraction(problem) {
  if (problem.answerKind === 'fraction') {
    return { num: problem.answerNum, den: problem.answerDen };
  }

  const scaled = Math.round(problem.answer * 10 ** problem.answerDecimals);
  return reduceFraction(scaled, 10 ** problem.answerDecimals);
}

function getNonIntegerSqrtCorrectFraction(problem) {
  return getNonIntegerPowersCorrectFraction(problem);
}

function isPowersProblem(problem) {
  return problem?.type === 'powers';
}

function isSqrtProblem(problem) {
  return problem?.type === 'sqrt';
}

function isPowersSqrtCombinedProblem(problem) {
  return problem?.type === 'powers-sqrt-combined';
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

function isCombinableBasicFormScope() {
  if (activeAssignmentConfig) {
    return activeAssignmentConfig.exclusiveMode === null;
  }

  return isCombinableSetupCategory();
}

function isRequireBasicFormEnabledInSetup() {
  if (isExclusiveSetupCategory()) {
    return false;
  }

  return requireBasicFormCheckbox?.checked ?? false;
}

function shouldRequireBasicFormAnswer() {
  if (currentProblem?.type === 'basic-form') {
    return true;
  }

  if (currentProblem?.type === 'fraction-zlomek') {
    return false;
  }

  if (currentProblem?.type === 'fraction-expand-reduce') {
    return false;
  }

  if (currentProblem?.type === 'decimal-fraction-convert') {
    return false;
  }

  if (!isCombinableBasicFormScope()) {
    return false;
  }

  if (activeAssignmentConfig) {
    return activeAssignmentConfig.requireBasicForm !== false;
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
  return fractionAnswerInputShape === 'fraction';
}

function isNonIntegerFractionAnswerInputShape() {
  return usesSignedFractionAnswerInput();
}

function isNonIntegerMultiplyDivideFractionAnswerInputShape() {
  return isFractionAnswerInputShape()
    && (isNonIntegerMultiplyDivideAnswerInputMode()
      || isNonIntegerMultiplyDivideExerciseMode()
      || currentProblem?.type === 'non-integer-multiply-divide');
}

function usesFractionAnswerFields() {
  return isFractionAnswerInputShape();
}

function isNumberAnswerInputShape() {
  return fractionAnswerInputShape === 'number';
}

function getIntegerAnswerFromUserInput() {
  if (isNumberAnswerInputShape()) {
    const value = parseAnswer(inputEl.value);
    return value !== null && Number.isInteger(value) ? value : null;
  }

  const fraction = getFractionAnswerFromInputs();
  if (!fraction || fraction.den === 0 || fraction.num % fraction.den !== 0) {
    return null;
  }

  return fraction.num / fraction.den;
}

function getDecimalProblemCorrectFraction(problem) {
  const scaled = Math.round(problem.answer * 10 ** problem.answerDecimals);
  return reduceFraction(scaled, 10 ** problem.answerDecimals);
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

function randomNonZeroInteger(min = -LINEAR_EQUATION_COEF_MAX, max = LINEAR_EQUATION_COEF_MAX) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const value = randomWhole(min, max);
    if (value !== 0) {
      return value;
    }
  }

  return 1;
}

function randomLinearEquationInnerConstant() {
  let inner = randomWhole(-6, 6);
  if (inner === 0) {
    inner = randomWhole(1, 6) * (Math.random() < 0.5 ? 1 : -1);
  }

  return inner;
}

function pickLinearEquationSolutionType(displayLevel) {
  if (displayLevel <= 1) {
    return 'unique';
  }

  const roll = Math.random();
  if (roll < 0.1) {
    return 'none';
  }

  if (roll < 0.2) {
    return 'infinite';
  }

  return 'unique';
}

function formatLinearXTermText(coef) {
  if (coef === 1) {
    return 'x';
  }

  if (coef === -1) {
    return '−x';
  }

  return `${coef}x`;
}

function formatLinearSignedConstantText(value, isLeading = false) {
  if (value === 0) {
    return '';
  }

  const abs = Math.abs(value);
  if (isLeading) {
    return value < 0 ? `−${abs}` : `${abs}`;
  }

  return value < 0 ? ` − ${abs}` : ` + ${abs}`;
}

function formatLinearEquationSideText(xCoef, constant) {
  return `${formatLinearXTermText(xCoef)}${formatLinearSignedConstantText(constant)}`;
}

function formatLinearEquationLevel1RightText(value) {
  return String(value);
}

function formatLinearParenthesisInnerText(inner) {
  return inner >= 0 ? `(x + ${inner})` : `(x − ${Math.abs(inner)})`;
}

function formatLinearDistributedSideText(outer, inner, addConst) {
  let text = `${outer}·${formatLinearParenthesisInnerText(inner)}`;

  if (addConst !== 0) {
    text += formatLinearSignedConstantText(addConst);
  }

  return text;
}

function formatLinearDistributedSideHtml(outer, inner, addConst) {
  let html = `<span class="problem-expression__term">${escapeHtml(String(outer))}</span><span class="problem-expression__operator">·</span><span class="problem-expression__term">${escapeHtml(formatLinearParenthesisInnerText(inner))}</span>`;

  if (addConst !== 0) {
    html += `<span class="problem-expression__term">${escapeHtml(formatLinearSignedConstantText(addConst))}</span>`;
  }

  return html;
}

function formatLinearEquationSideHtml(xCoef, constant) {
  return `<span class="problem-expression__term">${escapeHtml(formatLinearEquationSideText(xCoef, constant))}</span>`;
}

function formatLinearEquationProblemText(problem) {
  return `${problem.displayLeft} = ${problem.displayRight}`;
}

function formatLinearEquationDisplayHtml(problem) {
  let leftHtml;
  let rightHtml;

  if (problem.variant === 4 && problem.leftInner != null && problem.rightInner != null) {
    leftHtml = formatLinearDistributedSideHtml(problem.k, problem.leftInner, problem.leftExtra);
    rightHtml = formatLinearDistributedSideHtml(problem.l, problem.rightInner, problem.rightExtra);
  } else if (problem.level === 1) {
    leftHtml = formatLinearEquationSideHtml(problem.k, problem.a);
    rightHtml = `<span class="problem-expression__term">${escapeHtml(formatLinearEquationLevel1RightText(problem.b))}</span>`;
  } else {
    leftHtml = formatLinearEquationSideHtml(problem.k, problem.a);
    rightHtml = formatLinearEquationSideHtml(problem.l, problem.b);
  }

  return `<span class="problem-expression problem-expression--linear-equation">${leftHtml}<span class="problem-expression__equals">=</span>${rightHtml}</span>`;
}

function buildLinearEquationProblem({
  displayLevel,
  variant,
  k,
  l,
  a,
  b,
  solutionType,
  answerKind = null,
  answer = null,
  answerNum = null,
  answerDen = null,
  answerNegative = false,
  displayLeft = null,
  displayRight = null,
  leftInner = null,
  leftExtra = null,
  rightInner = null,
  rightExtra = null,
}) {
  const resolvedDisplayLeft = displayLeft ?? (displayLevel === 1
    ? formatLinearEquationSideText(k, a)
    : formatLinearEquationSideText(k, a));
  const resolvedDisplayRight = displayRight ?? (displayLevel === 1
    ? formatLinearEquationLevel1RightText(b)
    : formatLinearEquationSideText(l, b));

  return {
    type: 'linear-equation',
    variant,
    level: displayLevel,
    k,
    l,
    a,
    b,
    displayLeft: resolvedDisplayLeft,
    displayRight: resolvedDisplayRight,
    leftInner,
    leftExtra,
    rightInner,
    rightExtra,
    solutionType,
    answerKind: solutionType === 'unique' ? answerKind : null,
    answer: solutionType === 'unique' && answerKind === 'integer' ? answer : null,
    answerNum: solutionType === 'unique' && answerKind === 'fraction' ? answerNum : null,
    answerDen: solutionType === 'unique' && answerKind === 'fraction' ? answerDen : null,
    answerNegative: solutionType === 'unique' && answerKind === 'fraction' ? answerNegative : false,
    isRetry: false,
  };
}

function randomLinearEquationK(displayLevel) {
  if (displayLevel === 2) {
    return randomWhole(1, LINEAR_EQUATION_COEF_MAX);
  }

  return randomNonZeroInteger();
}

function randomLinearEquationL(displayLevel, k) {
  if (displayLevel === 2) {
    let l = randomWhole(1, LINEAR_EQUATION_COEF_MAX);

    while (l === k) {
      l = randomWhole(1, LINEAR_EQUATION_COEF_MAX);
    }

    return l;
  }

  let l = randomNonZeroInteger();

  while (l === k) {
    l = randomNonZeroInteger();
  }

  return l;
}

function createLinearEquationNoneProblem(displayLevel, variant) {
  const k = randomLinearEquationK(displayLevel);
  const a = randomNonZeroInteger();
  let b = randomNonZeroInteger();

  while (b === a) {
    b = randomNonZeroInteger();
  }

  return buildLinearEquationProblem({
    displayLevel,
    variant,
    k,
    l: k,
    a,
    b,
    solutionType: 'none',
  });
}

function createLinearEquationInfiniteProblem(displayLevel, variant) {
  const k = randomLinearEquationK(displayLevel);
  const a = randomNonZeroInteger();

  return buildLinearEquationProblem({
    displayLevel,
    variant,
    k,
    l: k,
    a,
    b: a,
    solutionType: 'infinite',
  });
}

function createLinearEquationUniqueIntegerProblem(displayLevel, variant) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const k = randomLinearEquationK(displayLevel);
    const l = randomLinearEquationL(displayLevel, k);

    const a = randomNonZeroInteger();
    const x = randomNonZeroInteger(-12, 12);
    const b = k * x + a - l * x;

    if (b === 0) {
      continue;
    }

    return buildLinearEquationProblem({
      displayLevel,
      variant,
      k,
      l,
      a,
      b,
      solutionType: 'unique',
      answerKind: 'integer',
      answer: x,
    });
  }

  return buildLinearEquationProblem({
    displayLevel,
    variant,
    k: 2,
    l: 5,
    a: 1,
    b: -5,
    solutionType: 'unique',
    answerKind: 'integer',
    answer: -2,
  });
}

function createLinearEquationUniqueFractionProblem(displayLevel, variant) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const k = randomNonZeroInteger();
    let l = randomNonZeroInteger();

    while (l === k) {
      l = randomNonZeroInteger();
    }

    const a = randomNonZeroInteger();
    const den = randomWhole(2, 12);
    let num = randomWhole(-den + 1, den - 1);

    if (num === 0 || num % den === 0) {
      continue;
    }

    const b = ((k - l) * num) / den + a;

    if (!Number.isInteger(b) || b === 0) {
      continue;
    }

    const negative = num < 0;
    const reduced = reduceFraction(Math.abs(num), den);

    return buildLinearEquationProblem({
      displayLevel,
      variant,
      k,
      l,
      a,
      b,
      solutionType: 'unique',
      answerKind: 'fraction',
      answerNum: reduced.num,
      answerDen: reduced.den,
      answerNegative: negative,
    });
  }

  return buildLinearEquationProblem({
    displayLevel,
    variant,
    k: 3,
    l: 5,
    a: 2,
    b: 1,
    solutionType: 'unique',
    answerKind: 'fraction',
    answerNum: 1,
    answerDen: 2,
    answerNegative: false,
  });
}

function createLinearEquationTwoSideProblem(displayLevel, variant, preferFraction = false) {
  const solutionType = pickLinearEquationSolutionType(displayLevel);

  if (solutionType === 'none') {
    return createLinearEquationNoneProblem(displayLevel, variant);
  }

  if (solutionType === 'infinite') {
    return createLinearEquationInfiniteProblem(displayLevel, variant);
  }

  if (preferFraction || displayLevel === 3) {
    return createLinearEquationUniqueFractionProblem(displayLevel, variant);
  }

  return createLinearEquationUniqueIntegerProblem(displayLevel, variant);
}

function wrapLinearEquationInDistributiveForm(problem) {
  const leftInner = randomLinearEquationInnerConstant();
  const leftExtra = problem.a - problem.k * leftInner;
  const rightInner = randomLinearEquationInnerConstant();
  const rightExtra = problem.b - problem.l * rightInner;

  return buildLinearEquationProblem({
    displayLevel: problem.level,
    variant: 4,
    k: problem.k,
    l: problem.l,
    a: problem.a,
    b: problem.b,
    solutionType: problem.solutionType,
    answerKind: problem.answerKind,
    answer: problem.answer,
    answerNum: problem.answerNum,
    answerDen: problem.answerDen,
    answerNegative: problem.answerNegative,
    displayLeft: formatLinearDistributedSideText(problem.k, leftInner, leftExtra),
    displayRight: formatLinearDistributedSideText(problem.l, rightInner, rightExtra),
    leftInner,
    leftExtra,
    rightInner,
    rightExtra,
  });
}

function createLinearEquationLevel1Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const k = randomWhole(1, LINEAR_EQUATION_COEF_MAX);
    const a = randomNonZeroInteger();
    const x = randomNonZeroInteger(-12, 12);
    const b = k * x + a;

    if (b < 0) {
      continue;
    }

    return buildLinearEquationProblem({
      displayLevel,
      variant: 1,
      k,
      l: 0,
      a,
      b,
      solutionType: 'unique',
      answerKind: 'integer',
      answer: x,
    });
  }

  return buildLinearEquationProblem({
    displayLevel,
    variant: 1,
    k: 2,
    l: 0,
    a: 4,
    b: 0,
    solutionType: 'unique',
    answerKind: 'integer',
    answer: -2,
  });
}

function createLinearEquationLevel4Problem(displayLevel) {
  const preferFraction = Math.random() < 0.5;
  const base = createLinearEquationTwoSideProblem(displayLevel, 4, preferFraction);
  return wrapLinearEquationInDistributiveForm(base);
}

function createLinearEquationProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 1) {
    return createLinearEquationLevel1Problem(displayLevel);
  }

  if (displayLevel === 2) {
    return createLinearEquationTwoSideProblem(displayLevel, 2, false);
  }

  if (displayLevel === 3) {
    return createLinearEquationTwoSideProblem(displayLevel, 3, true);
  }

  return createLinearEquationLevel4Problem(displayLevel);
}

function randomLinearFractionDenominator(max = LINEAR_EQUATION_FRACTION_DEN_MAX) {
  return randomWhole(2, max);
}

function randomLinearFractionCoef(max = LINEAR_EQUATION_COEF_MAX) {
  return randomWhole(1, max);
}

function randomLinearFractionSignedConstant() {
  let value = randomWhole(-LINEAR_EQUATION_FRACTION_CONST_MAX, LINEAR_EQUATION_FRACTION_CONST_MAX);
  if (value === 0) {
    value = randomWhole(1, LINEAR_EQUATION_FRACTION_CONST_MAX) * (Math.random() < 0.5 ? 1 : -1);
  }

  return value;
}

function randomLinearFractionOpSign() {
  return Math.random() < 0.5 ? 1 : -1;
}

function randomNiceLinearFractionTargetX(displayLevel) {
  const preferInteger = displayLevel <= 4 || Math.random() < 0.72;

  if (preferInteger) {
    let value = randomWhole(-10, 10);
    if (value === 0) {
      value = randomWhole(1, 10) * (Math.random() < 0.5 ? 1 : -1);
    }

    return { num: value, den: 1 };
  }

  const den = randomWhole(2, LINEAR_EQUATION_FRACTION_UNIQUE_ANSWER_DEN_MAX);
  let num = randomWhole(1, den - 1);
  if (Math.random() < 0.4) {
    num = -num;
  }

  const reduced = reduceFraction(Math.abs(num), den);
  return {
    num: num < 0 ? -reduced.num : reduced.num,
    den: reduced.den,
  };
}

function isNiceLinearFractionAnswer(answerNum, answerDen, displayLevel) {
  if (answerDen > LINEAR_EQUATION_FRACTION_UNIQUE_ANSWER_DEN_MAX) {
    return false;
  }

  if (answerNum > LINEAR_EQUATION_FRACTION_UNIQUE_ANSWER_NUM_MAX) {
    return false;
  }

  if (displayLevel <= 2 && answerDen !== 1) {
    return false;
  }

  if (displayLevel <= 4 && answerDen > 4) {
    return false;
  }

  return true;
}

function targetXMatchesAnswer(targetX, answerNum, answerDen, answerNegative) {
  const answerSignedNum = answerNegative ? -answerNum : answerNum;
  return targetX.num * answerDen === answerSignedNum * targetX.den;
}

function evaluateLinearFractionExpressionAtTargetX(terms, targetX) {
  const commonDen = terms.reduce((acc, term) => lcm(acc, term.b * targetX.den), 1);
  let numerator = 0;

  terms.forEach((term) => {
    const mult = commonDen / (term.b * targetX.den);
    numerator += term.sign * mult * (term.k * targetX.num + term.a * targetX.den);
  });

  return { num: numerator, den: commonDen };
}

function computeLevel3ConstantForTargetX(k, l, a, b, targetX) {
  const num = targetX.num * (k * b - l * a);
  const den = targetX.den * a * b;

  if (num % den !== 0) {
    return null;
  }

  const constant = num / den;
  if (constant === 0 || Math.abs(constant) > LINEAR_EQUATION_FRACTION_CONST_MAX) {
    return null;
  }

  return constant;
}

function computeLevel4RightConstantForTargetX(k, l, a, b, d, targetX) {
  const num = d * k * targetX.num + d * a * targetX.den - b * l * targetX.num;
  const den = targetX.den * b;

  if (num % den !== 0) {
    return null;
  }

  const constant = num / den;
  if (Math.abs(constant) > LINEAR_EQUATION_FRACTION_CONST_MAX) {
    return null;
  }

  return constant;
}

function computeRightConstantForTargetX(leftTerms, right, targetX) {
  const lhs = evaluateLinearFractionExpressionAtTargetX(leftTerms, targetX);
  const num = lhs.num * right.f * targetX.den - right.m * targetX.num * lhs.den;
  const den = lhs.den * targetX.den;

  if (num % den !== 0) {
    return null;
  }

  const constant = num / den;
  if (Math.abs(constant) > LINEAR_EQUATION_FRACTION_CONST_MAX) {
    return null;
  }

  return constant;
}

function linearFractionValuesAreDistinct(values) {
  const used = new Set();

  for (const value of values) {
    if (value == null) {
      continue;
    }

    const key = Math.abs(value);
    if (used.has(key)) {
      return false;
    }

    used.add(key);
  }

  return true;
}

function randomLinearFractionCoefDistinct(max = LINEAR_EQUATION_COEF_MAX, exclude = []) {
  const excludeSet = new Set(exclude.map(Math.abs));

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const value = randomLinearFractionCoef(max);
    if (!excludeSet.has(value)) {
      return value;
    }
  }

  for (let value = 1; value <= max; value += 1) {
    if (!excludeSet.has(value)) {
      return value;
    }
  }

  return 1;
}

function randomLinearFractionDenominatorDistinct(max = LINEAR_EQUATION_FRACTION_DEN_MAX, exclude = []) {
  const excludeSet = new Set(exclude.map(Math.abs));

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const value = randomLinearFractionDenominator(max);
    if (!excludeSet.has(value)) {
      return value;
    }
  }

  for (let value = 2; value <= max; value += 1) {
    if (!excludeSet.has(value)) {
      return value;
    }
  }

  return 2;
}

function randomLinearFractionSignedConstantDistinct(exclude = []) {
  const excludeSet = new Set(exclude.map(Math.abs));

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const value = randomLinearFractionSignedConstant();
    if (!excludeSet.has(Math.abs(value))) {
      return value;
    }
  }

  for (let magnitude = 1; magnitude <= 9; magnitude += 1) {
    if (!excludeSet.has(magnitude)) {
      return magnitude * (Math.random() < 0.5 ? 1 : -1);
    }
  }

  return 1;
}

function areLinearFractionProblemValuesDistinct(leftTerms, right) {
  const values = [];

  leftTerms.forEach((term) => {
    values.push(term.k, term.a, term.b);
  });

  if (right) {
    values.push(right.m, right.e, right.f);
  }

  return linearFractionValuesAreDistinct(values);
}

function buildDistinctLinearFractionLeftTerms(specs) {
  const usedValues = [];
  const terms = [];

  for (const spec of specs) {
    let term = null;

    for (let attempt = 0; attempt < 80; attempt += 1) {
      const candidate = {
        k: randomLinearFractionCoef(spec.coefMax),
        a: randomLinearFractionSignedConstant(),
        b: randomLinearFractionDenominator(spec.denMax ?? LINEAR_EQUATION_FRACTION_DEN_MAX),
        sign: spec.sign,
      };

      if (linearFractionValuesAreDistinct([...usedValues, candidate.k, candidate.a, candidate.b])) {
        term = candidate;
        usedValues.push(candidate.k, candidate.a, candidate.b);
        break;
      }
    }

    if (!term) {
      return null;
    }

    terms.push(term);
  }

  return { terms, usedValues };
}

function buildDistinctLinearFractionRight(usedValues, coefMax = LINEAR_EQUATION_COEF_MAX) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const right = {
      m: randomLinearFractionCoef(coefMax),
      e: randomLinearFractionSignedConstant(),
      f: randomLinearFractionDenominator(),
    };

    if (linearFractionValuesAreDistinct([...usedValues, right.m, right.e, right.f])) {
      return right;
    }
  }

  return null;
}

function areLinearFractionDenominatorsDistinct(leftTerms, right) {
  const denominators = [...leftTerms.map((term) => term.b)];

  if (right) {
    denominators.push(right.f);
  }

  return linearFractionValuesAreDistinct(denominators);
}

function buildLinearFractionLeftTermsRelaxed(specs) {
  const usedDenominators = [];
  const terms = [];

  for (const spec of specs) {
    let term = null;

    for (let attempt = 0; attempt < 120; attempt += 1) {
      const denominator = randomLinearFractionDenominator(spec.denMax ?? LINEAR_EQUATION_FRACTION_DEN_MAX);

      if (usedDenominators.includes(denominator)) {
        continue;
      }

      const useConstant = spec.allowConstant === true && Math.random() < 0.4;
      term = {
        k: randomLinearFractionCoef(spec.coefMax),
        a: useConstant ? randomLinearFractionSignedConstant() : 0,
        b: denominator,
        sign: spec.sign,
      };
      usedDenominators.push(denominator);
      break;
    }

    if (!term) {
      return null;
    }

    terms.push(term);
  }

  return { terms, usedDenominators };
}

function buildLinearFractionRightRelaxed(usedDenominators, coefMax = LINEAR_EQUATION_COEF_MAX) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const denominator = randomLinearFractionDenominator();

    if (usedDenominators.includes(denominator)) {
      continue;
    }

    return {
      m: randomLinearFractionCoef(coefMax),
      e: 0,
      f: denominator,
    };
  }

  return null;
}

function buildLinearEquationFractionProblemFromPreset(displayLevel, variant, preset) {
  const built = buildLinearEquationFractionProblem({
    level: displayLevel,
    variant,
    leftTerms: preset.leftTerms,
    right: preset.right,
    solutionType: 'unique',
    displayLeft: preset.displayLeft ?? null,
    displayRight: preset.displayRight ?? null,
  });
  setLinearFractionUniqueAnswer(built, preset.answerNum, preset.answerDen);
  if (preset.answerNegative) {
    built.answerNegative = true;
  }

  return built;
}

const LINEAR_EQUATION_FRACTION_LEVEL5_FALLBACKS = [
  {
    leftTerms: [
      { k: 2, a: 1, b: 3, sign: 1 },
      { k: 1, a: -2, b: 4, sign: -1 },
    ],
    right: { m: 2, e: 1, f: 5 },
    answerNum: 3,
    answerDen: 1,
  },
  {
    leftTerms: [
      { k: 3, a: 0, b: 2, sign: 1 },
      { k: 1, a: 0, b: 5, sign: 1 },
    ],
    right: { m: 2, e: -1, f: 4 },
    answerNum: 2,
    answerDen: 1,
  },
  {
    leftTerms: [
      { k: 2, a: 0, b: 3, sign: 1 },
      { k: 1, a: 0, b: 6, sign: -1 },
    ],
    right: { m: 1, e: 2, f: 5 },
    answerNum: 4,
    answerDen: 1,
  },
];

const LINEAR_EQUATION_FRACTION_LEVEL6_FALLBACKS = [
  {
    leftTerms: [
      { k: 2, a: 1, b: 3, sign: 1 },
      { k: 1, a: -1, b: 4, sign: 1 },
      { k: 1, a: 2, b: 5, sign: -1 },
    ],
    right: { m: 2, e: -1, f: 6 },
    answerNum: 2,
    answerDen: 1,
  },
  {
    leftTerms: [
      { k: 3, a: 0, b: 2, sign: 1 },
      { k: 2, a: 0, b: 5, sign: 1 },
      { k: 1, a: 0, b: 6, sign: -1 },
    ],
    right: { m: 2, e: 1, f: 4 },
    answerNum: 3,
    answerDen: 1,
  },
  {
    leftTerms: [
      { k: 2, a: 0, b: 3, sign: 1 },
      { k: 1, a: 1, b: 4, sign: 1 },
      { k: 2, a: 0, b: 5, sign: -1 },
    ],
    right: { m: 1, e: -2, f: 6 },
    answerNum: 4,
    answerDen: 1,
  },
];

function createLinearEquationFractionLevel5Fallback(displayLevel) {
  const preset = LINEAR_EQUATION_FRACTION_LEVEL5_FALLBACKS[
    randomWhole(0, LINEAR_EQUATION_FRACTION_LEVEL5_FALLBACKS.length - 1)
  ];
  return buildLinearEquationFractionProblemFromPreset(displayLevel, 5, preset);
}

function createLinearEquationFractionLevel6Fallback(displayLevel) {
  const preset = LINEAR_EQUATION_FRACTION_LEVEL6_FALLBACKS[
    randomWhole(0, LINEAR_EQUATION_FRACTION_LEVEL6_FALLBACKS.length - 1)
  ];
  return buildLinearEquationFractionProblemFromPreset(displayLevel, 6, preset);
}

function tryCreateLinearEquationFractionMultiTermUnique(displayLevel, variant, termSpecs, coefMax) {
  for (let attempt = 0; attempt < 1200; attempt += 1) {
    const targetX = randomNiceLinearFractionTargetX(displayLevel);
    const builtLeft = buildLinearFractionLeftTermsRelaxed(termSpecs);

    if (!builtLeft) {
      continue;
    }

    const right = buildLinearFractionRightRelaxed(builtLeft.usedDenominators, coefMax);

    if (!right) {
      continue;
    }

    const constant = computeRightConstantForTargetX(builtLeft.terms, right, targetX);

    if (constant == null || constant === 0) {
      continue;
    }

    const adjustedRight = { ...right, e: constant };

    if (!areLinearFractionDenominatorsDistinct(builtLeft.terms, adjustedRight)) {
      continue;
    }

    const built = buildLinearEquationFractionProblem({
      level: displayLevel,
      variant,
      leftTerms: builtLeft.terms,
      right: adjustedRight,
      solutionType: 'unique',
    });

    if (!setLinearFractionUniqueAnswer(built, targetX.num, targetX.den)) {
      continue;
    }

    if (!targetXMatchesAnswer(targetX, built.answerNum, built.answerDen, built.answerNegative)) {
      continue;
    }

    if (!isNiceLinearFractionAnswer(built.answerNum, built.answerDen, displayLevel)) {
      continue;
    }

    return built;
  }

  return null;
}

function formatLinearFractionNumeratorText(k, a) {
  if (k === 0) {
    return String(a);
  }

  if (a === 0) {
    return k === 1 ? 'x' : `${k}x`;
  }

  const xPart = k === 1 ? 'x' : `${k}x`;
  const inner = `${xPart}${formatLinearSignedConstantText(a)}`;
  return `(${inner})`;
}

function formatLinearFractionTermText(term, isFirst) {
  const frac = `${formatLinearFractionNumeratorText(term.k, term.a)}/${term.b}`;

  if (isFirst) {
    return term.sign < 0 ? `−${frac}` : frac;
  }

  return term.sign < 0 ? ` − ${frac}` : ` + ${frac}`;
}

function formatLinearFractionRightText(right) {
  if (right.m === 0 && right.f === 1) {
    return String(right.e);
  }

  return `${formatLinearFractionNumeratorText(right.m, right.e)}/${right.f}`;
}

function formatLinearFractionEquationText(leftTerms, right) {
  const left = leftTerms.map((term, index) => formatLinearFractionTermText(term, index === 0)).join('');
  return `${left} = ${formatLinearFractionRightText(right)}`;
}

function formatAlgebraicFractionHtml(k, a, den) {
  const numText = formatLinearFractionNumeratorText(k, a);
  const ariaLabel = `${numText}/${den}`;

  return `<span class="fraction" aria-label="${escapeHtml(ariaLabel)}"><span class="fraction__num">${escapeHtml(numText)}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${escapeHtml(String(den))}</span></span>`;
}

function formatLinearFractionTermHtml(term, isFirst) {
  const fracHtml = formatAlgebraicFractionHtml(term.k, term.a, term.b);

  if (isFirst) {
    return term.sign < 0
      ? `<span class="problem-expression__term">−</span>${fracHtml}`
      : fracHtml;
  }

  const op = term.sign < 0 ? '−' : '+';
  return `<span class="problem-expression__operator">${op}</span>${fracHtml}`;
}

function formatLinearFractionRightHtml(right) {
  if (right.m === 0 && right.f === 1) {
    return `<span class="problem-expression__term">${escapeHtml(String(right.e))}</span>`;
  }

  return formatAlgebraicFractionHtml(right.m, right.e, right.f);
}

function formatLinearFractionEquationHtml(leftTerms, right) {
  const leftHtml = leftTerms.map((term, index) => formatLinearFractionTermHtml(term, index === 0)).join('');
  const rightHtml = formatLinearFractionRightHtml(right);
  return `<span class="problem-expression problem-expression--linear-equation">${leftHtml}<span class="problem-expression__equals">=</span>${rightHtml}</span>`;
}

function getLinearFractionEquationCoeffs(leftTerms, right) {
  const dens = [...leftTerms.map((term) => Math.abs(term.b)), Math.abs(right.f)];
  const L = dens.reduce((acc, den) => lcm(acc, den), 1);

  let xCoeff = 0;
  let constTerm = 0;

  leftTerms.forEach((term) => {
    const mult = (L / term.b) * term.sign;
    xCoeff += mult * term.k;
    constTerm += mult * term.a;
  });

  xCoeff -= (L / right.f) * right.m;
  constTerm = (L / right.f) * right.e - constTerm;

  return { xCoeff, constTerm };
}

function setLinearFractionUniqueAnswer(problem, numerator, denominator) {
  if (denominator === 0) {
    return false;
  }

  const negative = numerator * denominator < 0;
  const reduced = reduceFraction(Math.abs(numerator), Math.abs(denominator));
  problem.solutionType = 'unique';
  problem.answerKind = 'fraction';
  problem.answerNum = reduced.num;
  problem.answerDen = reduced.den;
  problem.answerNegative = negative;
  return true;
}

function buildLinearEquationFractionProblem({
  level,
  variant,
  leftTerms,
  right,
  solutionType,
  answerKind = null,
  answerNum = null,
  answerDen = null,
  answerNegative = false,
  displayLeft = null,
  displayRight = null,
}) {
  const resolvedDisplayLeft = displayLeft ?? leftTerms.map((term, index) => formatLinearFractionTermText(term, index === 0)).join('');
  const resolvedDisplayRight = displayRight ?? formatLinearFractionRightText(right);

  return {
    type: 'linear-equation-fraction',
    level,
    variant,
    leftTerms: leftTerms.map((term) => ({ ...term })),
    right: { ...right },
    displayLeft: resolvedDisplayLeft,
    displayRight: resolvedDisplayRight,
    solutionType,
    answerKind: solutionType === 'unique' ? answerKind : null,
    answerNum: solutionType === 'unique' ? answerNum : null,
    answerDen: solutionType === 'unique' ? answerDen : null,
    answerNegative: solutionType === 'unique' ? answerNegative : false,
    isRetry: false,
  };
}

function finalizeLinearEquationFractionProblem(problem, solutionType, leftTerms, right) {
  const { xCoeff, constTerm } = getLinearFractionEquationCoeffs(leftTerms, right);

  if (solutionType === 'none') {
    if (xCoeff !== 0 || constTerm === 0) {
      return null;
    }

    return buildLinearEquationFractionProblem({
      level: problem.level,
      variant: problem.variant,
      leftTerms,
      right,
      solutionType: 'none',
      displayLeft: problem.displayLeft,
      displayRight: problem.displayRight,
    });
  }

  if (solutionType === 'infinite') {
    if (xCoeff !== 0 || constTerm !== 0) {
      return null;
    }

    return buildLinearEquationFractionProblem({
      level: problem.level,
      variant: problem.variant,
      leftTerms,
      right,
      solutionType: 'infinite',
      displayLeft: problem.displayLeft,
      displayRight: problem.displayRight,
    });
  }

  if (xCoeff === 0) {
    return null;
  }

  const answerNum = constTerm;
  const answerDen = xCoeff;
  const built = buildLinearEquationFractionProblem({
    level: problem.level,
    variant: problem.variant,
    leftTerms,
    right,
    solutionType: 'unique',
    displayLeft: problem.displayLeft,
    displayRight: problem.displayRight,
  });

  if (!setLinearFractionUniqueAnswer(built, answerNum, answerDen)) {
    return null;
  }

  if (!isNiceLinearFractionAnswer(built.answerNum, built.answerDen, problem.level)) {
    return null;
  }

  return built;
}

function createLinearEquationFractionLevel1Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const targetX = randomNiceLinearFractionTargetX(displayLevel);
    const a = randomLinearFractionDenominator();

    if (targetX.num % a !== 0) {
      continue;
    }

    const b = targetX.num / a;

    if (b === 0 || !linearFractionValuesAreDistinct([a, b])) {
      continue;
    }

    const x = targetX.num;

    if (x === 0) {
      continue;
    }

    const leftTerms = [{ k: 1, a: 0, b: a, sign: 1 }];
    const right = { m: 0, e: b, f: 1 };
    const built = buildLinearEquationFractionProblem({
      level: displayLevel,
      variant: 1,
      leftTerms,
      right,
      solutionType: 'unique',
      displayLeft: `x/${a}`,
      displayRight: String(b),
    });

    setLinearFractionUniqueAnswer(built, x, 1);
    return built;
  }

  const built = buildLinearEquationFractionProblem({
    level: displayLevel,
    variant: 1,
    leftTerms: [{ k: 1, a: 0, b: 3, sign: 1 }],
    right: { m: 0, e: 5, f: 1 },
    solutionType: 'unique',
    displayLeft: 'x/3',
    displayRight: '5',
  });
  setLinearFractionUniqueAnswer(built, 15, 1);
  return built;
}

function createLinearEquationFractionLevel2Problem(displayLevel) {
  const solutionType = pickLinearEquationSolutionType(displayLevel);

  for (let attempt = 0; attempt < 400; attempt += 1) {
    const a = randomLinearFractionDenominator();
    const k = randomLinearFractionCoef();
    const displayLeft = k === 1 ? `x/${a}` : `${k}x/${a}`;

    if (solutionType === 'unique') {
      const targetX = randomNiceLinearFractionTargetX(displayLevel);
      const bNum = k * targetX.num;
      const bDen = targetX.den * a;

      if (bNum % bDen !== 0) {
        continue;
      }

      const b = bNum / bDen;
      if (b === 0 || Math.abs(b) > LINEAR_EQUATION_COEF_MAX) {
        continue;
      }

      if (!linearFractionValuesAreDistinct([k, a, b])) {
        continue;
      }

      const leftTerms = [{ k, a: 0, b: a, sign: 1 }];
      const right = { m: 0, e: b, f: 1 };
      const built = buildLinearEquationFractionProblem({
        level: displayLevel,
        variant: 2,
        leftTerms,
        right,
        solutionType: 'unique',
        displayLeft,
        displayRight: String(b),
      });

      if (!setLinearFractionUniqueAnswer(built, targetX.num, targetX.den)) {
        continue;
      }

      if (!targetXMatchesAnswer(targetX, built.answerNum, built.answerDen, built.answerNegative)) {
        continue;
      }

      return built;
    }

    const c = solutionType === 'none'
      ? randomLinearFractionSignedConstantDistinct([k, a])
      : 0;
    const leftTerms = [{ k, a: 0, b: a, sign: 1 }, { k, a: 0, b: a, sign: -1 }];
    const right = { m: 0, e: c, f: 1 };
    const displayRight = solutionType === 'infinite'
      ? displayLeft
      : `${displayLeft}${formatLinearSignedConstantText(c)}`;
    const result = finalizeLinearEquationFractionProblem(
      {
        level: displayLevel,
        variant: 2,
        displayLeft,
        displayRight,
      },
      solutionType,
      leftTerms,
      right,
    );

    if (result) {
      result.displayLeft = displayLeft;
      result.displayRight = displayRight;
      return result;
    }
  }

  return createLinearEquationFractionLevel1Problem(displayLevel);
}

function createLinearEquationFractionLevel3Problem(displayLevel) {
  const solutionType = pickLinearEquationSolutionType(displayLevel);

  if (solutionType !== 'unique') {
    for (let attempt = 0; attempt < 400; attempt += 1) {
      const k = randomLinearFractionCoef();
      const l = randomLinearFractionCoefDistinct(LINEAR_EQUATION_COEF_MAX, [k]);
      const a = randomLinearFractionDenominator();
      const b = randomLinearFractionDenominatorDistinct(LINEAR_EQUATION_FRACTION_DEN_MAX, [a]);
      const c = randomLinearFractionSignedConstantDistinct([k, l, a, b]);
      const leftTerms = [{ k, a: 0, b: a, sign: 1 }, { k: l, a: 0, b: b, sign: -1 }];
      const right = { m: 0, e: c, f: 1 };
      const displayLeft = k === 1 ? `x/${a}` : `${k}x/${a}`;
      const displayRight = `${l === 1 ? 'x' : `${l}x`}/${b}${formatLinearSignedConstantText(c)}`;
      const result = finalizeLinearEquationFractionProblem(
        {
          level: displayLevel,
          variant: 3,
          displayLeft,
          displayRight,
        },
        solutionType,
        leftTerms,
        right,
      );

      if (result) {
        result.displayLeft = displayLeft;
        result.displayRight = displayRight;
        return result;
      }
    }
  }

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const targetX = randomNiceLinearFractionTargetX(displayLevel);
    const k = randomLinearFractionCoef();
    const l = randomLinearFractionCoefDistinct(LINEAR_EQUATION_COEF_MAX, [k]);
    const a = randomLinearFractionDenominator();
    const b = randomLinearFractionDenominatorDistinct(LINEAR_EQUATION_FRACTION_DEN_MAX, [a]);
    const c = computeLevel3ConstantForTargetX(k, l, a, b, targetX);

    if (c == null) {
      continue;
    }

    if (!linearFractionValuesAreDistinct([k, l, a, b, c])) {
      continue;
    }

    const leftTerms = [{ k, a: 0, b: a, sign: 1 }, { k: l, a: 0, b: b, sign: -1 }];
    const right = { m: 0, e: c, f: 1 };
    const displayLeft = k === 1 ? `x/${a}` : `${k}x/${a}`;
    const displayRight = `${l === 1 ? 'x' : `${l}x`}/${b}${formatLinearSignedConstantText(c)}`;
    const built = buildLinearEquationFractionProblem({
      level: displayLevel,
      variant: 3,
      leftTerms,
      right,
      solutionType: 'unique',
      displayLeft,
      displayRight,
    });

    if (!setLinearFractionUniqueAnswer(built, targetX.num, targetX.den)) {
      continue;
    }

    if (!targetXMatchesAnswer(targetX, built.answerNum, built.answerDen, built.answerNegative)) {
      continue;
    }

    return built;
  }

  const built = buildLinearEquationFractionProblem({
    level: displayLevel,
    variant: 3,
    leftTerms: [{ k: 2, a: 0, b: 3, sign: 1 }, { k: 1, a: 0, b: 4, sign: -1 }],
    right: { m: 0, e: 5, f: 1 },
    solutionType: 'unique',
    displayLeft: '2x/3',
    displayRight: 'x/4 + 5',
  });
  setLinearFractionUniqueAnswer(built, 12, 1);
  return built;
}

function createLinearEquationFractionLevel4Problem(displayLevel) {
  const solutionType = pickLinearEquationSolutionType(displayLevel);

  if (solutionType !== 'unique') {
    for (let attempt = 0; attempt < 400; attempt += 1) {
      const k = randomLinearFractionCoef();
      const l = randomLinearFractionCoefDistinct(LINEAR_EQUATION_COEF_MAX, [k]);
      const b = randomLinearFractionDenominator();
      const d = randomLinearFractionDenominatorDistinct(LINEAR_EQUATION_FRACTION_DEN_MAX, [b]);
      const a = randomLinearFractionSignedConstantDistinct([k, l, b, d]);
      const c = randomLinearFractionSignedConstantDistinct([k, l, b, d, a]);
      const leftTerms = [{ k, a, b, sign: 1 }];
      const right = { m: l, e: c, f: d };
      const result = finalizeLinearEquationFractionProblem(
        {
          level: displayLevel,
          variant: 4,
          displayLeft: `${formatLinearFractionNumeratorText(k, a)}/${b}`,
          displayRight: `${formatLinearFractionNumeratorText(l, c)}/${d}`,
        },
        solutionType,
        leftTerms,
        right,
      );

      if (result) {
        return result;
      }
    }
  }

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const targetX = randomNiceLinearFractionTargetX(displayLevel);
    const k = randomLinearFractionCoef();
    const l = randomLinearFractionCoefDistinct(LINEAR_EQUATION_COEF_MAX, [k]);
    const b = randomLinearFractionDenominator();
    const d = randomLinearFractionDenominatorDistinct(LINEAR_EQUATION_FRACTION_DEN_MAX, [b]);
    const a = randomLinearFractionSignedConstantDistinct([k, l, b, d]);
    const c = computeLevel4RightConstantForTargetX(k, l, a, b, d, targetX);

    if (c == null) {
      continue;
    }

    if (!linearFractionValuesAreDistinct([k, l, a, c, b, d])) {
      continue;
    }

    const leftTerms = [{ k, a, b, sign: 1 }];
    const right = { m: l, e: c, f: d };
    const built = buildLinearEquationFractionProblem({
      level: displayLevel,
      variant: 4,
      leftTerms,
      right,
      solutionType: 'unique',
      displayLeft: `${formatLinearFractionNumeratorText(k, a)}/${b}`,
      displayRight: `${formatLinearFractionNumeratorText(l, c)}/${d}`,
    });

    if (!setLinearFractionUniqueAnswer(built, targetX.num, targetX.den)) {
      continue;
    }

    if (!targetXMatchesAnswer(targetX, built.answerNum, built.answerDen, built.answerNegative)) {
      continue;
    }

    return built;
  }

  const built = buildLinearEquationFractionProblem({
    level: displayLevel,
    variant: 4,
    leftTerms: [{ k: 2, a: 1, b: 3, sign: 1 }],
    right: { m: 1, e: -2, f: 5 },
    solutionType: 'unique',
    displayLeft: '(2x + 1)/3',
    displayRight: '(x − 3)/5',
  });
  setLinearFractionUniqueAnswer(built, -2, 1);
  return built;
}

function createLinearEquationFractionLevel5Problem(displayLevel) {
  const solutionType = pickLinearEquationSolutionType(displayLevel);

  if (solutionType !== 'unique') {
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const builtLeft = buildLinearFractionLeftTermsRelaxed([
        { coefMax: LINEAR_EQUATION_COEF_MAX, sign: 1, allowConstant: true },
        { coefMax: LINEAR_EQUATION_COEF_MAX, sign: randomLinearFractionOpSign(), allowConstant: true },
      ]);

      if (!builtLeft) {
        continue;
      }

      const right = buildLinearFractionRightRelaxed(builtLeft.usedDenominators, LINEAR_EQUATION_COEF_MAX);

      if (!right) {
        continue;
      }

      right.e = randomLinearFractionSignedConstant();

      const result = finalizeLinearEquationFractionProblem(
        {
          level: displayLevel,
          variant: 5,
        },
        solutionType,
        builtLeft.terms,
        right,
      );

      if (result) {
        return result;
      }
    }
  }

  const uniqueProblem = tryCreateLinearEquationFractionMultiTermUnique(displayLevel, 5, [
    { coefMax: LINEAR_EQUATION_COEF_MAX, sign: 1, allowConstant: true },
    { coefMax: LINEAR_EQUATION_COEF_MAX, sign: randomLinearFractionOpSign(), allowConstant: true },
  ], LINEAR_EQUATION_COEF_MAX);

  if (uniqueProblem) {
    return uniqueProblem;
  }

  return createLinearEquationFractionLevel5Fallback(displayLevel);
}

function createLinearEquationFractionLevel6Problem(displayLevel) {
  const solutionType = pickLinearEquationSolutionType(displayLevel);

  if (solutionType !== 'unique') {
    for (let attempt = 0; attempt < 600; attempt += 1) {
      const builtLeft = buildLinearFractionLeftTermsRelaxed([
        { coefMax: LINEAR_EQUATION_FRACTION_LEVEL6_COEF_MAX, sign: 1, allowConstant: true },
        { coefMax: LINEAR_EQUATION_FRACTION_LEVEL6_COEF_MAX, sign: randomLinearFractionOpSign(), allowConstant: true },
        { coefMax: LINEAR_EQUATION_FRACTION_LEVEL6_COEF_MAX, sign: randomLinearFractionOpSign(), allowConstant: true },
      ]);

      if (!builtLeft) {
        continue;
      }

      const right = buildLinearFractionRightRelaxed(
        builtLeft.usedDenominators,
        LINEAR_EQUATION_FRACTION_LEVEL6_COEF_MAX,
      );

      if (!right) {
        continue;
      }

      right.e = randomLinearFractionSignedConstant();

      const result = finalizeLinearEquationFractionProblem(
        {
          level: displayLevel,
          variant: 6,
        },
        solutionType,
        builtLeft.terms,
        right,
      );

      if (result) {
        return result;
      }
    }
  }

  const uniqueProblem = tryCreateLinearEquationFractionMultiTermUnique(displayLevel, 6, [
    { coefMax: LINEAR_EQUATION_FRACTION_LEVEL6_COEF_MAX, sign: 1, allowConstant: true },
    { coefMax: LINEAR_EQUATION_FRACTION_LEVEL6_COEF_MAX, sign: randomLinearFractionOpSign(), allowConstant: true },
    { coefMax: LINEAR_EQUATION_FRACTION_LEVEL6_COEF_MAX, sign: randomLinearFractionOpSign(), allowConstant: true },
  ], LINEAR_EQUATION_FRACTION_LEVEL6_COEF_MAX);

  if (uniqueProblem) {
    return uniqueProblem;
  }

  return createLinearEquationFractionLevel6Fallback(displayLevel);
}

function createLinearEquationFractionProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 1) {
    return createLinearEquationFractionLevel1Problem(displayLevel);
  }

  if (displayLevel === 2) {
    return createLinearEquationFractionLevel2Problem(displayLevel);
  }

  if (displayLevel === 3) {
    return createLinearEquationFractionLevel3Problem(displayLevel);
  }

  if (displayLevel === 4) {
    return createLinearEquationFractionLevel4Problem(displayLevel);
  }

  if (displayLevel === 5) {
    return createLinearEquationFractionLevel5Problem(displayLevel);
  }

  return createLinearEquationFractionLevel6Problem(displayLevel);
}

function formatLinearEquationFractionProblemText(problem) {
  return `${problem.displayLeft} = ${problem.displayRight}`;
}

function formatLinearEquationFractionLevel2DisplayHtml(leftTerm, constant = null) {
  const leftHtml = formatAlgebraicFractionHtml(leftTerm.k, leftTerm.a, leftTerm.b);
  let rightHtml = formatAlgebraicFractionHtml(leftTerm.k, leftTerm.a, leftTerm.b);

  if (constant !== null && constant !== 0) {
    const op = constant > 0 ? '+' : '−';
    rightHtml += `<span class="problem-expression__operator">${op}</span><span class="problem-expression__term">${escapeHtml(String(Math.abs(constant)))}</span>`;
  }

  return `<span class="problem-expression problem-expression--linear-equation">${leftHtml}<span class="problem-expression__equals">=</span>${rightHtml}</span>`;
}

function formatLinearEquationFractionLevel3DisplayHtml(leftTerm, subTerm, constant) {
  const leftHtml = formatAlgebraicFractionHtml(leftTerm.k, leftTerm.a, leftTerm.b);
  let rightHtml = formatAlgebraicFractionHtml(subTerm.k, subTerm.a, subTerm.b);

  if (constant !== 0) {
    const op = constant > 0 ? '+' : '−';
    rightHtml += `<span class="problem-expression__operator">${op}</span><span class="problem-expression__term">${escapeHtml(String(Math.abs(constant)))}</span>`;
  }

  return `<span class="problem-expression problem-expression--linear-equation">${leftHtml}<span class="problem-expression__equals">=</span>${rightHtml}</span>`;
}

function formatLinearEquationFractionDisplayHtml(problem) {
  if (problem.variant === 2 && problem.leftTerms.length === 1) {
    return formatLinearFractionEquationHtml(problem.leftTerms, problem.right);
  }

  if (problem.variant === 2 && problem.leftTerms.length === 2 && problem.right.m === 0 && problem.right.f === 1) {
    return formatLinearEquationFractionLevel2DisplayHtml(
      problem.leftTerms[0],
      problem.solutionType === 'none' ? problem.right.e : null,
    );
  }

  if (problem.variant === 3 && problem.leftTerms.length === 2 && problem.right.m === 0 && problem.right.f === 1) {
    return formatLinearEquationFractionLevel3DisplayHtml(
      problem.leftTerms[0],
      problem.leftTerms[1],
      problem.right.e,
    );
  }

  return formatLinearFractionEquationHtml(problem.leftTerms, problem.right);
}

function linearEquationFractionProblemFromRetry(dueRetry) {
  const problem = buildLinearEquationFractionProblem({
    level: dueRetry.level,
    variant: dueRetry.variant,
    leftTerms: dueRetry.leftTerms,
    right: dueRetry.right,
    solutionType: dueRetry.solutionType,
    answerKind: dueRetry.answerKind,
    answerNum: dueRetry.answerNum,
    answerDen: dueRetry.answerDen,
    answerNegative: dueRetry.answerNegative,
    displayLeft: dueRetry.displayLeft,
    displayRight: dueRetry.displayRight,
  });
  problem.isRetry = true;
  return problem;
}

function isLinearEquationProblem(problem) {
  return problem?.type === 'linear-equation'
    || problem?.type === 'linear-equation-fraction';
}

function isLinearEquationIntegerAnswerInput() {
  return isLinearEquationProblem(currentProblem)
    && currentProblem.solutionType === 'unique'
    && currentProblem.answerKind === 'integer';
}

function maybeClearLinearEquationSpecialAnswerOnInput() {
  if (!isLinearEquationProblem(currentProblem)) {
    return;
  }

  if (linearEquationSpecialAnswer) {
    clearLinearEquationSpecialAnswer();
  }

  if (inputEl.value === LINEAR_EQUATION_NO_SOLUTION_LABEL
    || inputEl.value === LINEAR_EQUATION_INFINITE_SOLUTION_LABEL) {
    inputEl.value = '';
  }

  updateLinearEquationAnswerInputWidth();
}

function isLinearEquationFractionAnswerProblem(problem) {
  return isLinearEquationProblem(problem)
    && problem.solutionType === 'unique'
    && problem.answerKind === 'fraction';
}

function getLinearEquationCorrectAnswerLabel(problem) {
  if (problem.solutionType === 'none') {
    return LINEAR_EQUATION_NO_SOLUTION_LABEL;
  }

  if (problem.solutionType === 'infinite') {
    return LINEAR_EQUATION_INFINITE_SOLUTION_LABEL;
  }

  if (problem.answerKind === 'fraction') {
    return formatSignedFractionText({
      num: problem.answerNum,
      den: problem.answerDen,
      negative: problem.answerNegative,
    });
  }

  return formatIntegerAnswer(problem.answer);
}

function linearEquationProblemFromRetry(dueRetry) {
  const problem = buildLinearEquationProblem({
    displayLevel: dueRetry.level,
    variant: dueRetry.variant,
    k: dueRetry.k,
    l: dueRetry.l,
    a: dueRetry.a,
    b: dueRetry.b,
    solutionType: dueRetry.solutionType,
    answerKind: dueRetry.answerKind,
    answer: dueRetry.answer,
    answerNum: dueRetry.answerNum,
    answerDen: dueRetry.answerDen,
    answerNegative: dueRetry.answerNegative,
    displayLeft: dueRetry.displayLeft,
    displayRight: dueRetry.displayRight,
    leftInner: dueRetry.leftInner ?? null,
    leftExtra: dueRetry.leftExtra ?? null,
    rightInner: dueRetry.rightInner ?? null,
    rightExtra: dueRetry.rightExtra ?? null,
  });
  problem.isRetry = true;
  return problem;
}

function getLinearEquationSpecialAnswerLabel(kind) {
  return kind === 'none'
    ? LINEAR_EQUATION_NO_SOLUTION_LABEL
    : LINEAR_EQUATION_INFINITE_SOLUTION_LABEL;
}

function getLinearEquationSpecialAnswerFromInput() {
  const text = inputEl.value.trim();

  if (text === LINEAR_EQUATION_NO_SOLUTION_LABEL) {
    return { kind: 'special', value: 'none' };
  }

  if (text === LINEAR_EQUATION_INFINITE_SOLUTION_LABEL) {
    return { kind: 'special', value: 'infinite' };
  }

  return null;
}

function updateLinearEquationAnswerFormUi(problem) {
  const isLinearEquation = isLinearEquationProblem(problem);

  formEl.classList.toggle('answer-form--linear-equation', isLinearEquation);

  if (answerVariablePrefixEl) {
    answerVariablePrefixEl.hidden = !isLinearEquation;
    answerVariablePrefixEl.setAttribute('aria-hidden', isLinearEquation ? 'false' : 'true');
  }

  if (!isLinearEquation) {
    inputEl.classList.remove('answer-form__input--special-answer');
  } else {
    updateLinearEquationAnswerInputWidth();
  }
}

function updateLinearEquationAnswerInputWidth() {
  const isSpecial = inputEl.value === LINEAR_EQUATION_NO_SOLUTION_LABEL
    || inputEl.value === LINEAR_EQUATION_INFINITE_SOLUTION_LABEL
    || linearEquationSpecialAnswer !== null;

  inputEl.classList.toggle('answer-form__input--special-answer', isSpecial);
}

function clearLinearEquationSpecialAnswer() {
  linearEquationSpecialAnswer = null;

  linearEquationActionButtons.forEach((button) => {
    button.classList.remove('is-selected');
  });

  updateLinearEquationAnswerInputWidth();
}

function setLinearEquationSpecialAnswer(kind) {
  linearEquationSpecialAnswer = kind;
  answerNumeratorEl.value = '';
  answerDenominatorEl.value = '';
  setAnswerFractionNegative(false);
  clearAnswerFieldHighlight();

  fractionAnswerInputShape = 'number';
  updateFractionAnswerShapeUi();
  inputEl.value = getLinearEquationSpecialAnswerLabel(kind);
  updateLinearEquationAnswerInputWidth();

  linearEquationActionButtons.forEach((button) => {
    button.classList.toggle(
      'is-selected',
      button.dataset.linearEquationAnswer === kind,
    );
  });
}

function updateLinearEquationActionsUi(problem) {
  if (!linearEquationActionsEl) {
    return;
  }

  const visible = isLinearEquationProblem(problem)
    && !isCompareProblem(problem)
    && !isCompareExerciseMode()
    && problem.level >= 2;
  linearEquationActionsEl.hidden = !visible;

  if (!visible) {
    clearLinearEquationSpecialAnswer();
    return;
  }

  linearEquationActionButtons.forEach((button) => {
    button.classList.toggle(
      'is-selected',
      button.dataset.linearEquationAnswer === linearEquationSpecialAnswer,
    );
  });
}

function evaluateLinearEquationAnswer(problem, userAnswer) {
  if (problem.solutionType === 'none') {
    const isCorrect = userAnswer?.kind === 'special' && userAnswer.value === 'none';
    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  if (problem.solutionType === 'infinite') {
    const isCorrect = userAnswer?.kind === 'special' && userAnswer.value === 'infinite';
    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  if (userAnswer?.kind === 'special') {
    return {
      isCorrect: false,
      feedbackMessage: 'Špatně.',
    };
  }

  if (problem.answerKind === 'integer') {
    const isCorrect = userAnswer?.kind === 'integer' && userAnswer.value === problem.answer;
    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  if (userAnswer?.kind === 'integer') {
    const correctNum = problem.answerNegative ? -problem.answerNum : problem.answerNum;
    const isCorrect = userAnswer.value * problem.answerDen === correctNum;
    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  if (userAnswer?.kind === 'fraction') {
    return evaluateFractionAnswer(userAnswer.value, {
      num: problem.answerNum,
      den: problem.answerDen,
      negative: problem.answerNegative,
    });
  }

  return {
    isCorrect: false,
    feedbackMessage: 'Špatně.',
  };
}

function getLinearEquationUserAnswer(problem) {
  const specialFromInput = getLinearEquationSpecialAnswerFromInput();
  if (specialFromInput) {
    return specialFromInput;
  }

  if (linearEquationSpecialAnswer) {
    return { kind: 'special', value: linearEquationSpecialAnswer };
  }

  if (problem.solutionType !== 'unique') {
    return null;
  }

  if (problem.answerKind === 'fraction') {
    if (isNumberAnswerInputShape()) {
      const userValue = parseAnswer(inputEl.value);
      if (userValue === null) {
        return null;
      }

      return { kind: 'integer', value: userValue };
    }

    const fraction = getNonIntegerFractionAnswerFromInputs();
    if (!fraction) {
      return null;
    }

    return { kind: 'fraction', value: fraction };
  }

  const integer = getIntegerAnswerFromUserInput();
  if (integer === null) {
    return null;
  }

  return { kind: 'integer', value: integer };
}

function formatLinearEquationSessionAnswer(userAnswer) {
  if (userAnswer?.kind === 'special') {
    return userAnswer.value === 'none'
      ? LINEAR_EQUATION_NO_SOLUTION_LABEL
      : LINEAR_EQUATION_INFINITE_SOLUTION_LABEL;
  }

  if (userAnswer?.kind === 'integer') {
    return formatIntegerAnswer(userAnswer.value);
  }

  if (userAnswer?.kind === 'fraction') {
    return formatSignedFractionText(userAnswer.value);
  }

  return '';
}

function isDecimalCompareProblem(problem) {
  return problem?.type === 'decimal-compare';
}

function isIntegerCompareProblem(problem) {
  return problem?.type === 'integer-compare';
}

function isNonIntegerCompareProblem(problem) {
  return problem?.type === 'non-integer-compare';
}

function isFractionCompareProblem(problem) {
  return problem?.type === 'fraction-compare';
}

function isCompareProblem(problem) {
  return isDecimalCompareProblem(problem)
    || isIntegerCompareProblem(problem)
    || isNonIntegerCompareProblem(problem)
    || isFractionCompareProblem(problem);
}

function getCompareOperandValue(operand) {
  if (operand?.kind === 'decimal' || operand?.kind === 'fraction') {
    return getNonIntegerTermValue(operand);
  }

  return operand.value;
}

function compareOperandsEqual(left, right) {
  return Math.abs(getCompareOperandValue(left) - getCompareOperandValue(right)) < 1e-9;
}

function formatCompareOperand(problem, operand) {
  if (isIntegerCompareProblem(problem)) {
    return formatIntegerAnswer(operand.value);
  }

  if (isNonIntegerCompareProblem(problem) || isFractionCompareProblem(problem)) {
    return formatNonIntegerTermText(operand);
  }

  return formatDecimal(operand.value, operand.decimals);
}

function formatCompareOperandHtml(problem, operand) {
  if (isNonIntegerCompareProblem(problem) || isFractionCompareProblem(problem)) {
    return formatNonIntegerTermHtml(operand);
  }

  return escapeHtml(formatCompareOperand(problem, operand));
}

function compareDecimalOperands(left, right) {
  if (left.value < right.value) {
    return '<';
  }

  if (left.value > right.value) {
    return '>';
  }

  return '=';
}

function decimalCompareValuesEqual(left, right) {
  return Math.abs(left - right) < 1e-9;
}

function randomDecimalCompareWholePart() {
  return randomWhole(0, 9);
}

function shouldUseSameDecimalCompareWholePart() {
  return Math.random() < DECIMAL_COMPARE_SAME_WHOLE_RATE;
}

function randomDecimalCompareFractionalPart(decimals) {
  if (decimals === 1) {
    return randomWhole(1, 9) / 10;
  }

  if (decimals === 2) {
    return randomDecimalWithNonZeroLastDigit(0.01, 0.99, 2);
  }

  return randomDecimalWithNonZeroLastDigit(0.001, 0.999, 3);
}

function buildDecimalCompareOperand(whole, decimals) {
  const value = roundToDecimals(whole + randomDecimalCompareFractionalPart(decimals), decimals);

  return { value, decimals };
}

function pickDecimalComparePrecisionPair(displayLevel) {
  if (displayLevel === 1) {
    return [1, 1];
  }

  if (displayLevel === 2) {
    const highPrecisionSide = Math.random() < 0.5 ? 0 : 1;
    const leftDecimals = highPrecisionSide === 0
      ? 2
      : (Math.random() < 0.45 ? 1 : 2);
    const rightDecimals = highPrecisionSide === 1
      ? 2
      : (Math.random() < 0.45 ? 1 : 2);

    return [leftDecimals, rightDecimals];
  }

  const highPrecisionSide = Math.random() < 0.5 ? 0 : 1;
  const pickLowPrecision = () => (Math.random() < 0.5 ? 1 : 2);
  const leftDecimals = highPrecisionSide === 0
    ? 3
    : pickLowPrecision();
  const rightDecimals = highPrecisionSide === 1
    ? 3
    : pickLowPrecision();

  return [leftDecimals, rightDecimals];
}

function pickDecimalCompareOrderExtraPrecision(displayLevel) {
  if (displayLevel === 5) {
    const options = [1, 2, 3];
    return options[randomWhole(0, options.length - 1)];
  }

  return Math.random() < 0.35 ? 1 : 2;
}

function pickDecimalCompareOrderPrecisions(displayLevel) {
  const precisions = displayLevel === 5
    ? [1, 2, 3, pickDecimalCompareOrderExtraPrecision(displayLevel)]
    : [1, 2, pickDecimalCompareOrderExtraPrecision(displayLevel)];

  const requiredPrecisions = displayLevel === 5 ? [1, 2, 3] : [1, 2];

  for (let attempt = 0; attempt < 20; attempt += 1) {
    for (let i = precisions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [precisions[i], precisions[j]] = [precisions[j], precisions[i]];
    }

    if (requiredPrecisions.every((precision) => precisions.includes(precision))) {
      return precisions;
    }
  }

  return displayLevel === 5 ? [1, 2, 3, 2] : [1, 2, 2];
}

function generateDistinctDecimalCompareOperand(whole, decimals, existing = []) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const operand = buildDecimalCompareOperand(whole, decimals);

    if (!existing.some((item) => decimalCompareValuesEqual(item.value, operand.value))) {
      return operand;
    }
  }

  return buildDecimalCompareOperand(whole, decimals);
}

function generateDecimalCompareSignPair(displayLevel) {
  const useSameWhole = shouldUseSameDecimalCompareWholePart();
  const sharedWhole = randomDecimalCompareWholePart();
  const [leftDecimals, rightDecimals] = pickDecimalComparePrecisionPair(displayLevel);
  const leftWhole = useSameWhole ? sharedWhole : randomDecimalCompareWholePart();
  const rightWhole = useSameWhole ? sharedWhole : randomDecimalCompareWholePart();
  const left = buildDecimalCompareOperand(leftWhole, leftDecimals);
  let right = buildDecimalCompareOperand(rightWhole, rightDecimals);

  if (Math.random() < DECIMAL_COMPARE_EQUAL_RATE) {
    right = {
      value: left.value,
      decimals: rightDecimals,
    };
  } else if (decimalCompareValuesEqual(left.value, right.value)) {
    right = generateDistinctDecimalCompareOperand(rightWhole, rightDecimals, [left]);
  }

  return [left, right];
}

function generateDecimalCompareOrderOperands(displayLevel) {
  const useSameWhole = shouldUseSameDecimalCompareWholePart();
  const sharedWhole = randomDecimalCompareWholePart();
  const precisions = pickDecimalCompareOrderPrecisions(displayLevel);
  const operands = [];

  precisions.forEach((decimals) => {
    const whole = useSameWhole ? sharedWhole : randomDecimalCompareWholePart();
    operands.push(generateDistinctDecimalCompareOperand(whole, decimals, operands));
  });

  return operands;
}

function getCompareSignAnswer(left, right) {
  const leftValue = getCompareOperandValue(left);
  const rightValue = getCompareOperandValue(right);

  if (leftValue < rightValue) {
    return '<';
  }

  if (leftValue > rightValue) {
    return '>';
  }

  return '=';
}

function getCompareSortedIndices(operands) {
  return operands
    .map((operand, index) => ({ index, value: getCompareOperandValue(operand) }))
    .sort((a, b) => a.value - b.value)
    .map((item) => item.index);
}

function shuffleIndices(length) {
  const indices = Array.from({ length }, (_, index) => index);

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

function buildDecimalCompareProblem({
  displayLevel,
  variant,
  left = null,
  right = null,
  operands = null,
  answerSign = null,
  correctOrder = null,
  displayOrder = null,
}) {
  return {
    type: 'decimal-compare',
    variant,
    level: displayLevel,
    left,
    right,
    operands,
    answerSign,
    correctOrder,
    displayOrder,
    isRetry: false,
  };
}

function createDecimalCompareSignProblem(displayLevel) {
  const [left, right] = generateDecimalCompareSignPair(displayLevel);

  return buildDecimalCompareProblem({
    displayLevel,
    variant: 'sign',
    left,
    right,
    answerSign: getCompareSignAnswer(left, right),
  });
}

function createDecimalCompareOrderProblem(displayLevel) {
  const operands = generateDecimalCompareOrderOperands(displayLevel);
  let displayOrder = shuffleIndices(operands.length);

  while (displayOrder.every((value, index) => value === getCompareSortedIndices(operands)[index])) {
    displayOrder = shuffleIndices(operands.length);
  }

  return buildDecimalCompareProblem({
    displayLevel,
    variant: 'order',
    operands,
    correctOrder: getCompareSortedIndices(operands),
    displayOrder,
  });
}

function createDecimalCompareProblem(level) {
  const displayLevel = level + 1;

  if (displayLevel <= 3) {
    return createDecimalCompareSignProblem(displayLevel);
  }

  return createDecimalCompareOrderProblem(displayLevel);
}

function buildIntegerCompareOperand(value) {
  return { value };
}

function randomPositiveIntegerCompareValue() {
  return randomWhole(1, INTEGER_COMPARE_POSITIVE_MAX);
}

function randomNegativeIntegerCompareValue() {
  return -randomWhole(1, INTEGER_COMPARE_POSITIVE_MAX);
}

function randomNonPositiveIntegerCompareValue() {
  if (Math.random() < INTEGER_COMPARE_NON_POSITIVE_ZERO_RATE) {
    return 0;
  }

  return randomNegativeIntegerCompareValue();
}

function randomIntegerCompareValue() {
  return randomWhole(INTEGER_COMPARE_VALUE_MIN, INTEGER_COMPARE_VALUE_MAX);
}

function pickCompareOperandSign(mode, { positiveOnLeft = false, side = 'left' } = {}) {
  if (mode === 'both-positive') {
    return 1;
  }

  if (mode === 'both-non-positive') {
    if (Math.random() < INTEGER_COMPARE_NON_POSITIVE_ZERO_RATE) {
      return 0;
    }

    return -1;
  }

  const isPositiveSide = side === 'left' ? positiveOnLeft : !positiveOnLeft;

  if (isPositiveSide) {
    return 1;
  }

  if (Math.random() < INTEGER_COMPARE_NON_POSITIVE_ZERO_RATE) {
    return 0;
  }

  return -1;
}

function pickIntegerCompareSignPairMode() {
  const roll = Math.random();

  if (roll < INTEGER_COMPARE_BOTH_POSITIVE_RATE) {
    return 'both-positive';
  }

  if (roll < INTEGER_COMPARE_BOTH_POSITIVE_RATE + INTEGER_COMPARE_MIXED_SIGN_RATE) {
    return 'mixed';
  }

  return 'both-non-positive';
}

function randomIntegerCompareValueForSignMode(mode, { positiveOnLeft = false, side = 'left' } = {}) {
  const sign = pickCompareOperandSign(mode, { positiveOnLeft, side });

  if (sign === 0) {
    return 0;
  }

  if (sign === 1) {
    return randomPositiveIntegerCompareValue();
  }

  return randomNegativeIntegerCompareValue();
}

function generateDistinctIntegerCompareOperand(existing = [], valuePicker = randomIntegerCompareValue) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const operand = buildIntegerCompareOperand(valuePicker());

    if (!existing.some((item) => compareOperandsEqual(item, operand))) {
      return operand;
    }
  }

  return buildIntegerCompareOperand(valuePicker());
}

function generateDistinctIntegerCompareOperandForSignMode(existing, mode, options) {
  return generateDistinctIntegerCompareOperand(
    existing,
    () => randomIntegerCompareValueForSignMode(mode, options),
  );
}

function finalizeIntegerCompareSignPair(left, right, mode, positiveOnLeft) {
  if (Math.random() < INTEGER_COMPARE_EQUAL_RATE) {
    return [left, buildIntegerCompareOperand(left.value)];
  }

  if (compareOperandsEqual(left, right)) {
    return [
      left,
      generateDistinctIntegerCompareOperandForSignMode(
        [left],
        mode,
        { positiveOnLeft, side: 'right' },
      ),
    ];
  }

  return [left, right];
}

function generateIntegerCompareSignPair() {
  const mode = pickIntegerCompareSignPairMode();
  const positiveOnLeft = Math.random() < 0.5;
  const left = buildIntegerCompareOperand(
    randomIntegerCompareValueForSignMode(mode, { positiveOnLeft, side: 'left' }),
  );
  const right = buildIntegerCompareOperand(
    randomIntegerCompareValueForSignMode(mode, { positiveOnLeft, side: 'right' }),
  );

  return finalizeIntegerCompareSignPair(left, right, mode, positiveOnLeft);
}

function generateIntegerCompareOrderOperands(count) {
  const operands = [];

  while (operands.length < 2) {
    operands.push(generateDistinctIntegerCompareOperand(operands, randomNegativeIntegerCompareValue));
  }

  while (operands.length < count) {
    operands.push(generateDistinctIntegerCompareOperand(operands));
  }

  return operands;
}

function buildIntegerCompareProblem({
  displayLevel,
  variant,
  left = null,
  right = null,
  operands = null,
  answerSign = null,
  correctOrder = null,
  displayOrder = null,
}) {
  return {
    type: 'integer-compare',
    variant,
    level: displayLevel,
    left,
    right,
    operands,
    answerSign,
    correctOrder,
    displayOrder,
    isRetry: false,
  };
}

function createIntegerCompareSignProblem(displayLevel) {
  const [left, right] = generateIntegerCompareSignPair();

  return buildIntegerCompareProblem({
    displayLevel,
    variant: 'sign',
    left,
    right,
    answerSign: getCompareSignAnswer(left, right),
  });
}

function createIntegerCompareOrderProblem(displayLevel, count) {
  const operands = generateIntegerCompareOrderOperands(count);
  let displayOrder = shuffleIndices(operands.length);

  while (displayOrder.every((value, index) => value === getCompareSortedIndices(operands)[index])) {
    displayOrder = shuffleIndices(operands.length);
  }

  return buildIntegerCompareProblem({
    displayLevel,
    variant: 'order',
    operands,
    correctOrder: getCompareSortedIndices(operands),
    displayOrder,
  });
}

function createIntegerCompareProblem(level) {
  const displayLevel = level + 1;

  if (displayLevel <= 2) {
    return createIntegerCompareSignProblem(displayLevel);
  }

  if (displayLevel === 3) {
    return createIntegerCompareOrderProblem(displayLevel, 3);
  }

  return createIntegerCompareOrderProblem(displayLevel, 4);
}

function cloneNonIntegerCompareOperand(operand) {
  return { ...operand };
}

function buildNonIntegerCompareDecimalOperand(sign) {
  if (sign === 0) {
    return { kind: 'decimal', magnitude: 0, sign: 1 };
  }

  return {
    kind: 'decimal',
    magnitude: randomNonIntegerDecimalMagnitude(),
    sign,
  };
}

function buildNonIntegerCompareFractionOperand(sign) {
  if (sign === 0) {
    return { kind: 'fraction', num: 0, den: 1, sign: 1 };
  }

  const den = randomWhole(2, NON_INTEGER_FRACTION_DEN_MAX);
  const num = randomWhole(1, den - 1);

  return {
    kind: 'fraction',
    num,
    den,
    sign,
  };
}

function buildNonIntegerCompareOperand(kind, sign) {
  if (kind === 'decimal') {
    return buildNonIntegerCompareDecimalOperand(sign);
  }

  return buildNonIntegerCompareFractionOperand(sign);
}

function generateDistinctNonIntegerCompareOperand(kind, existing = [], signPicker = null) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const sign = signPicker
      ? signPicker()
      : pickCompareOperandSign(
        pickIntegerCompareSignPairMode(),
        { positiveOnLeft: Math.random() < 0.5, side: 'left' },
      );
    const operand = buildNonIntegerCompareOperand(kind, sign);

    if (!existing.some((item) => compareOperandsEqual(item, operand))) {
      return operand;
    }
  }

  return buildNonIntegerCompareOperand(kind, -1);
}

function buildNonIntegerCompareFractionOperandForDen(sign, den, num = null) {
  if (sign === 0) {
    return { kind: 'fraction', num: 0, den: 1, sign: 1 };
  }

  const resolvedNum = num ?? randomWhole(1, den - 1);

  return {
    kind: 'fraction',
    num: resolvedNum,
    den,
    sign,
  };
}

function pickNonIntegerCompareOperandSign(signPicker = null) {
  if (signPicker) {
    return signPicker();
  }

  return pickCompareOperandSign(
    pickIntegerCompareSignPairMode(),
    { positiveOnLeft: Math.random() < 0.5, side: 'left' },
  );
}

function generateDistinctNonIntegerCompareFractionOperandForDen(den, existing = [], signPicker = null) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const operand = buildNonIntegerCompareFractionOperandForDen(
      pickNonIntegerCompareOperandSign(signPicker),
      den,
    );

    if (!existing.some((item) => compareOperandsEqual(item, operand))) {
      return operand;
    }
  }

  for (let num = 1; num < den; num += 1) {
    const operand = buildNonIntegerCompareFractionOperandForDen(
      pickNonIntegerCompareOperandSign(signPicker),
      den,
      num,
    );

    if (!existing.some((item) => compareOperandsEqual(item, operand))) {
      return operand;
    }
  }

  return buildNonIntegerCompareFractionOperandForDen(-1, den);
}

function finalizeNonIntegerCompareSignPair(left, right, mode, positiveOnLeft, leftKind, rightKind) {
  if (Math.random() < INTEGER_COMPARE_EQUAL_RATE) {
    return [left, cloneNonIntegerCompareOperand(left)];
  }

  if (compareOperandsEqual(left, right)) {
    return [
      left,
      generateDistinctNonIntegerCompareOperand(
        rightKind,
        [left],
        () => pickCompareOperandSign(mode, { positiveOnLeft, side: 'right' }),
      ),
    ];
  }

  return [left, right];
}

function generateNonIntegerCompareSignPair(displayLevel) {
  const mode = pickIntegerCompareSignPairMode();
  const positiveOnLeft = Math.random() < 0.5;
  let leftKind = 'decimal';
  let rightKind = 'decimal';

  if (displayLevel === 2) {
    leftKind = 'fraction';
    rightKind = 'fraction';
  } else if (displayLevel === 3) {
    const fractionOnLeft = Math.random() < 0.5;
    leftKind = fractionOnLeft ? 'fraction' : 'decimal';
    rightKind = fractionOnLeft ? 'decimal' : 'fraction';
  }

  let left;
  let right;

  if (displayLevel === 2) {
    const [leftDen, rightDen] = generateFriendlyFractionCompareDenominators(2);
    left = generateDistinctNonIntegerCompareFractionOperandForDen(
      leftDen,
      [],
      () => pickCompareOperandSign(mode, { positiveOnLeft, side: 'left' }),
    );
    right = generateDistinctNonIntegerCompareFractionOperandForDen(
      rightDen,
      [left],
      () => pickCompareOperandSign(mode, { positiveOnLeft, side: 'right' }),
    );
  } else {
    left = buildNonIntegerCompareOperand(
      leftKind,
      pickCompareOperandSign(mode, { positiveOnLeft, side: 'left' }),
    );
    right = buildNonIntegerCompareOperand(
      rightKind,
      pickCompareOperandSign(mode, { positiveOnLeft, side: 'right' }),
    );
  }

  return finalizeNonIntegerCompareSignPair(
    left,
    right,
    mode,
    positiveOnLeft,
    leftKind,
    rightKind,
  );
}

function getNonIntegerCompareOrderKinds(displayLevel) {
  if (displayLevel === 4) {
    return ['decimal', 'decimal', 'decimal'];
  }

  if (displayLevel === 5) {
    return ['fraction', 'fraction', 'fraction'];
  }

  return ['decimal', 'decimal', 'fraction', 'fraction'];
}

function generateNonIntegerCompareOrderOperands(displayLevel) {
  const kinds = getNonIntegerCompareOrderKinds(displayLevel);
  const operands = [];
  const fractionCount = kinds.filter((kind) => kind === 'fraction').length;
  const friendlyDenominators = fractionCount > 0
    ? generateFriendlyFractionCompareDenominators(fractionCount)
    : [];
  let fractionIndex = 0;

  const addOperand = (kind, signPicker = null) => {
    if (kind === 'fraction') {
      operands.push(
        generateDistinctNonIntegerCompareFractionOperandForDen(
          friendlyDenominators[fractionIndex],
          operands,
          signPicker,
        ),
      );
      fractionIndex += 1;
      return;
    }

    operands.push(generateDistinctNonIntegerCompareOperand(kind, operands, signPicker));
  };

  while (operands.length < 2) {
    addOperand(kinds[operands.length], () => -1);
  }

  while (operands.length < kinds.length) {
    addOperand(kinds[operands.length]);
  }

  return operands;
}

function buildNonIntegerCompareProblem({
  displayLevel,
  variant,
  left = null,
  right = null,
  operands = null,
  answerSign = null,
  correctOrder = null,
  displayOrder = null,
}) {
  return {
    type: 'non-integer-compare',
    variant,
    level: displayLevel,
    left,
    right,
    operands,
    answerSign,
    correctOrder,
    displayOrder,
    isRetry: false,
  };
}

function createNonIntegerCompareSignProblem(displayLevel) {
  const [left, right] = generateNonIntegerCompareSignPair(displayLevel);

  return buildNonIntegerCompareProblem({
    displayLevel,
    variant: 'sign',
    left,
    right,
    answerSign: getCompareSignAnswer(left, right),
  });
}

function createNonIntegerCompareOrderProblem(displayLevel) {
  const operands = generateNonIntegerCompareOrderOperands(displayLevel);
  let displayOrder = shuffleIndices(operands.length);

  while (displayOrder.every((value, index) => value === getCompareSortedIndices(operands)[index])) {
    displayOrder = shuffleIndices(operands.length);
  }

  return buildNonIntegerCompareProblem({
    displayLevel,
    variant: 'order',
    operands,
    correctOrder: getCompareSortedIndices(operands),
    displayOrder,
  });
}

function createNonIntegerCompareProblem(level) {
  const displayLevel = level + 1;

  if (displayLevel <= 3) {
    return createNonIntegerCompareSignProblem(displayLevel);
  }

  return createNonIntegerCompareOrderProblem(displayLevel);
}

function buildFractionCompareProblem({
  displayLevel,
  variant,
  left = null,
  right = null,
  operands = null,
  answerSign = null,
  correctOrder = null,
  displayOrder = null,
}) {
  return {
    type: 'fraction-compare',
    variant,
    level: displayLevel,
    left,
    right,
    operands,
    answerSign,
    correctOrder,
    displayOrder,
    isRetry: false,
  };
}

function buildPositiveFractionCompareOperand(num, den) {
  return { kind: 'fraction', num, den, sign: 1 };
}

function createRandomPositiveProperFractionOperand({ den = null } = {}) {
  const resolvedDen = den ?? randomWhole(2, NON_INTEGER_FRACTION_DEN_MAX);
  const num = randomWhole(1, resolvedDen - 1);
  return buildPositiveFractionCompareOperand(num, resolvedDen);
}

function createRandomDistinctPositiveProperFractionOperand(existing = [], options = {}) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const operand = createRandomPositiveProperFractionOperand(options);
    if (!existing.some((item) => compareOperandsEqual(item, operand))) {
      return operand;
    }
  }

  return createRandomPositiveProperFractionOperand(options);
}

function getArrayLcm(values) {
  return values.reduce((result, value) => lcm(result, value), 1);
}

function isFriendlyFractionCompareDenominatorSet(denominators, count) {
  if (denominators.length !== count) {
    return false;
  }

  if (new Set(denominators).size !== count) {
    return false;
  }

  if (denominators.some((den) => den > NON_INTEGER_FRACTION_DEN_MAX)) {
    return false;
  }

  return getArrayLcm(denominators) <= FRACTION_COMPARE_ORDER_LCM_MAX;
}

function generateFriendlyFractionCompareDenominators(count) {
  const presets = FRACTION_COMPARE_ORDER_DENOMINATOR_PRESETS[count] ?? [];
  const multiplierSets = FRACTION_COMPARE_ORDER_MULTIPLIER_SETS[count] ?? [[1, 2, 3]];

  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (presets.length > 0 && Math.random() < 0.45) {
      const denominators = pickRandomItem(presets);

      if (isFriendlyFractionCompareDenominatorSet(denominators, count)) {
        return denominators;
      }

      continue;
    }

    const base = pickRandomItem(FRACTION_COMPARE_ORDER_BASES);
    const multipliers = pickRandomItem(multiplierSets);
    const denominators = multipliers.map((multiplier) => base * multiplier);

    if (isFriendlyFractionCompareDenominatorSet(denominators, count)) {
      return denominators;
    }
  }

  const fallbackSets = {
    2: [3, 5],
    3: [3, 5, 9],
    4: [3, 5, 9, 15],
  };

  return fallbackSets[count] ?? [3, 5, 9];
}

function createDistinctPositiveProperFractionOperandForDen(den, existing = []) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const num = randomWhole(1, den - 1);
    const operand = buildPositiveFractionCompareOperand(num, den);

    if (!existing.some((item) => compareOperandsEqual(item, operand))) {
      return operand;
    }
  }

  for (let num = 1; num < den; num += 1) {
    const operand = buildPositiveFractionCompareOperand(num, den);

    if (!existing.some((item) => compareOperandsEqual(item, operand))) {
      return operand;
    }
  }

  return buildPositiveFractionCompareOperand(1, den);
}

function createFractionCompareSignPair(displayLevel) {
  if (displayLevel === 1) {
    const den = randomWhole(2, NON_INTEGER_FRACTION_DEN_MAX);
    const left = createRandomDistinctPositiveProperFractionOperand([], { den });

    if (Math.random() < FRACTION_COMPARE_EQUAL_RATE) {
      return [left, buildPositiveFractionCompareOperand(left.num, left.den)];
    }

    return [
      left,
      createRandomDistinctPositiveProperFractionOperand([left], { den }),
    ];
  }

  const [leftDen, rightDen] = generateFriendlyFractionCompareDenominators(2);
  const left = createRandomDistinctPositiveProperFractionOperand([], { den: leftDen });

  if (Math.random() < FRACTION_COMPARE_EQUAL_RATE) {
    return [left, buildPositiveFractionCompareOperand(left.num, left.den)];
  }

  return [
    left,
    createRandomDistinctPositiveProperFractionOperand([left], { den: rightDen }),
  ];
}

function createFractionCompareSignProblem(displayLevel) {
  const [left, right] = createFractionCompareSignPair(displayLevel);

  return buildFractionCompareProblem({
    displayLevel,
    variant: 'sign',
    left,
    right,
    answerSign: getCompareSignAnswer(left, right),
  });
}

function createFractionCompareOrderProblem(displayLevel, count) {
  const denominators = generateFriendlyFractionCompareDenominators(count);
  const operands = [];

  denominators.forEach((den) => {
    operands.push(createDistinctPositiveProperFractionOperandForDen(den, operands));
  });

  let displayOrder = shuffleIndices(operands.length);

  while (displayOrder.every((value, index) => value === getCompareSortedIndices(operands)[index])) {
    displayOrder = shuffleIndices(operands.length);
  }

  return buildFractionCompareProblem({
    displayLevel,
    variant: 'order',
    operands,
    correctOrder: getCompareSortedIndices(operands),
    displayOrder,
  });
}

function createFractionCompareProblem(level) {
  const displayLevel = level + 1;

  if (displayLevel <= 3) {
    return createFractionCompareSignProblem(displayLevel);
  }

  if (displayLevel === 4) {
    return createFractionCompareOrderProblem(displayLevel, 3);
  }

  return createFractionCompareOrderProblem(displayLevel, 4);
}

function isFractionZlomekProblem(problem) {
  return problem?.type === 'fraction-zlomek';
}

function getCzechCountNounForm(count, forms) {
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return forms[2];
  }

  if (count === 1) {
    return forms[0];
  }

  if (count >= 2 && count <= 4) {
    return forms[1];
  }

  return forms[2];
}

function formatCzechNounCount(count, forms) {
  return `${count} ${getCzechCountNounForm(count, forms)}`;
}

function getCzechHourAccusativeForm(count) {
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return 'hodin';
  }

  if (count === 1) {
    return 'hodinu';
  }

  if (count >= 2 && count <= 4) {
    return 'hodiny';
  }

  return 'hodin';
}

function formatCzechHourAccusativeCount(count) {
  return `${count} ${getCzechHourAccusativeForm(count)}`;
}

const FRACTION_ZLOMEK_WEEKEND_SCENARIOS = [
  (sat, sun) => `O víkendu hraješ v sobotu ${sat} a v neděli ${sun} počítačové hry. Jakou část celkového času hraní připadá na neděli? Zapiš zlomkem.`,
  (sat, sun) => `O víkendu čteš v sobotu ${sat} a v neděli ${sun}. Jakou část celkového času čtení připadá na neděli? Zapiš zlomkem.`,
  (sat, sun) => `O víkendu sleduješ televizi v sobotu ${sat} a v neděli ${sun}. Jakou část celkového času u televize připadá na neděli? Zapiš zlomkem.`,
  (sat, sun) => `O víkendu hraješ fotbal v sobotu ${sat} a v neděli ${sun}. Jakou část celkového času stráveného hraním fotbalu připadá na neděli? Zapiš zlomkem.`,
  (sat, sun) => `O víkendu pomáháš doma v sobotu ${sat} a v neděli ${sun}. Jakou část celkového času stráveného pomocí doma připadá na neděli? Zapiš zlomkem.`,
];

function formatCzechWeekendHoursPrompt(saturdayHours, sundayHours) {
  const saturdayText = formatCzechHourAccusativeCount(saturdayHours);
  const sundayText = formatCzechHourAccusativeCount(sundayHours);

  return pickRandomItem(FRACTION_ZLOMEK_WEEKEND_SCENARIOS)(saturdayText, sundayText);
}

function formatCzechMeziPeople(count) {
  const mod100 = count % 100;
  const mod10 = count % 10;

  if (count === 1) {
    return '1 člověka';
  }

  if (mod100 >= 11 && mod100 <= 14) {
    return `${count} lidí`;
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return `${count} lidi`;
  }

  return `${count} lidí`;
}

function usesCzechNominativePluralCount(count) {
  return count >= 2 && count <= 4;
}

function formatCzechFeminineAdjectiveNounCount(count, adjectiveStem, nounForms) {
  const mod100 = count % 100;
  let adjective;
  let noun;

  if (mod100 >= 11 && mod100 <= 14) {
    adjective = `${adjectiveStem}ých`;
    noun = nounForms[2];
  } else if (count === 1) {
    adjective = `${adjectiveStem}á`;
    noun = nounForms[0];
  } else if (count >= 2 && count <= 4) {
    adjective = `${adjectiveStem}é`;
    noun = nounForms[1];
  } else {
    adjective = `${adjectiveStem}ých`;
    noun = nounForms[2];
  }

  return `${count} ${adjective} ${noun}`;
}

function formatCzechTwoColorBallPhrase(count1, adjectiveStem1, count2, adjectiveStem2) {
  const nounForms = ['kulička', 'kuličky', 'kuliček'];

  return `${formatCzechFeminineAdjectiveNounCount(count1, adjectiveStem1, nounForms)} a ${formatCzechFeminineAdjectiveNounCount(count2, adjectiveStem2, nounForms)}`;
}

function formatCzechColoredBallsPrompt(container, count1, adjectiveStem1, count2, adjectiveStem2, askedColorLabel) {
  const verb = usesCzechNominativePluralCount(count1) && usesCzechNominativePluralCount(count2)
    ? 'jsou'
    : 'je';

  return `${container} ${verb} ${formatCzechTwoColorBallPhrase(count1, adjectiveStem1, count2, adjectiveStem2)}. Jakou část tvoří ${askedColorLabel}? Zapiš zlomkem.`;
}

const FRACTION_ZLOMEK_SHARING_NOUNS = [
  { forms: ['chléb', 'chleby', 'chlebů'] },
  { forms: ['jablko', 'jablka', 'jablek'] },
  { forms: ['koláč', 'koláče', 'koláčů'] },
  { forms: ['rohlík', 'rohlíky', 'rohlíků'] },
  { forms: ['pomeranč', 'pomeranče', 'pomerančů'] },
];

function buildFractionZlomekProblem({
  displayLevel,
  variant,
  prompt,
  answerKind,
  answerNum = null,
  answerDen = null,
  answer = null,
  promptNum = null,
  promptDen = null,
  quantity = null,
  partValue = null,
  unitValue = null,
  unitMeasure = null,
  unitLabel = null,
}) {
  return {
    type: 'fraction-zlomek',
    variant,
    level: displayLevel,
    prompt,
    answerKind,
    answerNum,
    answerDen,
    answer,
    promptNum,
    promptDen,
    quantity,
    partValue,
    unitValue,
    unitMeasure,
    unitLabel,
    isRetry: false,
  };
}

function createFractionZlomekPartProblem(displayLevel) {
  const maxTotal = displayLevel <= 2 ? 20 : 40;
  const total = randomWhole(6, maxTotal);
  const part = randomWhole(1, total - 1);
  const other = total - part;

  const prompts = [
    formatCzechColoredBallsPrompt('V sáčku', other, 'bíl', part, 'oranžov', 'oranžové kuličky'),
    `Ve třídě je ${formatCzechNounCount(total, ['žák', 'žáci', 'žáků'])}. ${part} z nich ${part === 1 ? 'je chlapec' : 'jsou chlapci'}. Jakou část tvoří chlapci? Zapiš zlomkem.`,
    formatCzechColoredBallsPrompt('V krabici', other, 'červen', part, 'modr', 'modré kuličky'),
    formatCzechWeekendHoursPrompt(other, part),
  ];

  return buildFractionZlomekProblem({
    displayLevel,
    variant: 'part',
    prompt: pickRandomItem(prompts),
    answerKind: 'fraction',
    answerNum: part,
    answerDen: total,
  });
}

function createFractionZlomekOfNumberProblem(displayLevel) {
  const denMax = displayLevel <= 2 ? 6 : displayLevel <= 4 ? 10 : 12;
  const den = randomWhole(2, denMax);
  const num = randomWhole(1, den - 1);
  const multiplier = randomWhole(2, displayLevel <= 3 ? 8 : 12);
  const quantity = den * multiplier;
  const answer = num * multiplier;

  return buildFractionZlomekProblem({
    displayLevel,
    variant: 'of-number',
    prompt: `Kolik je ${num}/${den} z ${quantity}?`,
    promptNum: num,
    promptDen: den,
    quantity,
    answerKind: 'number',
    answer,
  });
}

function createFractionZlomekUnitProblem(displayLevel) {
  const unitType = pickRandomItem(['cm-m', 'min-hour', 'min-lesson']);

  if (unitType === 'cm-m') {
    const cm = randomWhole(1, 19) * 5;

    return buildFractionZlomekProblem({
      displayLevel,
      variant: 'unit',
      prompt: `${cm} cm = ?/${100} m. Doplň čitatele zlomku.`,
      promptDen: 100,
      unitValue: cm,
      unitMeasure: 'cm',
      unitLabel: 'm',
      answerKind: 'number',
      answer: cm,
    });
  }

  if (unitType === 'min-hour') {
    const minutes = randomWhole(1, 11) * 5;

    return buildFractionZlomekProblem({
      displayLevel,
      variant: 'unit',
      prompt: `${minutes} min = ?/${60} h. Doplň čitatele zlomku.`,
      promptDen: 60,
      unitValue: minutes,
      unitMeasure: 'min',
      unitLabel: 'h',
      answerKind: 'number',
      answer: minutes,
    });
  }

  const minutes = randomWhole(1, 8) * 5;

  return buildFractionZlomekProblem({
    displayLevel,
    variant: 'unit',
    prompt: `${minutes} min = ?/${45} vyučovací hodiny. Doplň čitatele zlomku.`,
    promptDen: 45,
    unitValue: minutes,
    unitMeasure: 'min',
    unitLabel: 'vyučovací hodiny',
    answerKind: 'number',
    answer: minutes,
  });
}

function createFractionZlomekFindWholeProblem(displayLevel) {
  const den = randomWhole(2, displayLevel <= 3 ? 6 : 8);
  const num = randomWhole(1, den - 1);
  const whole = randomWhole(2, displayLevel <= 3 ? 12 : 20) * den;
  const part = (whole * num) / den;

  return buildFractionZlomekProblem({
    displayLevel,
    variant: 'find-whole',
    prompt: `Na tyči bylo natřeno ${part} cm, což je ${num}/${den} celé délky. Jak dlouhá je celá tyč v cm?`,
    promptNum: num,
    promptDen: den,
    partValue: part,
    answerKind: 'number',
    answer: whole,
  });
}

function createFractionZlomekSharingProblem(displayLevel) {
  const people = randomWhole(2, displayLevel <= 3 ? 6 : 9);
  const items = randomWhole(people, displayLevel <= 3 ? 12 : 18);
  const noun = pickRandomItem(FRACTION_ZLOMEK_SHARING_NOUNS);

  return buildFractionZlomekProblem({
    displayLevel,
    variant: 'sharing',
    prompt: `${formatCzechNounCount(items, noun.forms)} se rozdělí rovným dílem mezi ${formatCzechMeziPeople(people)}. Kolik dostane jeden? Zapiš zlomkem.`,
    answerKind: 'fraction',
    answerNum: items,
    answerDen: people,
  });
}

function createFractionZlomekRemainingPartProblem(displayLevel) {
  const total = pickRandomItem([12, 24]);
  const eaten = randomWhole(1, total - 1);
  const remaining = total - eaten;

  return buildFractionZlomekProblem({
    displayLevel,
    variant: 'remaining',
    prompt: `Čokoláda má ${formatCzechNounCount(total, ['čtvereček', 'čtverečky', 'čtverečků'])}. Snězeno jich bylo ${formatCzechNounCount(eaten, ['čtvereček', 'čtverečky', 'čtverečků'])}. Jaká část čokolády zůstala? Zapiš zlomkem.`,
    answerKind: 'fraction',
    answerNum: remaining,
    answerDen: total,
  });
}

function createFractionZlomekEqualsWholeProblem(displayLevel) {
  const whole = randomWhole(2, displayLevel <= 4 ? 8 : 12);
  const den = randomWhole(2, 8);
  const num = whole * den;

  return buildFractionZlomekProblem({
    displayLevel,
    variant: 'equals-whole',
    prompt: `Kolik je ${num}/${den}?`,
    promptNum: num,
    promptDen: den,
    answerKind: 'number',
    answer: whole,
  });
}

function createFractionZlomekProblem(_level) {
  const displayLevel = 1;

  return pickRandomItem([
    () => createFractionZlomekPartProblem(displayLevel),
    () => createFractionZlomekOfNumberProblem(displayLevel),
    () => createFractionZlomekUnitProblem(displayLevel),
    () => createFractionZlomekFindWholeProblem(displayLevel),
    () => createFractionZlomekSharingProblem(displayLevel),
    () => createFractionZlomekRemainingPartProblem(displayLevel),
    () => createFractionZlomekEqualsWholeProblem(displayLevel),
  ])();
}

function fractionZlomekProblemFromRetry(dueRetry) {
  return {
    type: 'fraction-zlomek',
    variant: dueRetry.variant,
    level: dueRetry.level,
    prompt: dueRetry.prompt,
    answerKind: dueRetry.answerKind,
    answerNum: dueRetry.answerNum,
    answerDen: dueRetry.answerDen,
    answer: dueRetry.answer,
    promptNum: dueRetry.promptNum ?? null,
    promptDen: dueRetry.promptDen ?? null,
    quantity: dueRetry.quantity ?? null,
    partValue: dueRetry.partValue ?? null,
    unitValue: dueRetry.unitValue ?? null,
    unitMeasure: dueRetry.unitMeasure ?? null,
    unitLabel: dueRetry.unitLabel ?? null,
    isRetry: true,
  };
}

function formatFractionZlomekProblemText(problem) {
  return problem.prompt;
}

function formatFractionZlomekPromptContentHtml(problem) {
  if (problem.variant === 'of-number') {
    return `Kolik je ${formatSingleFractionHtml(problem.promptNum, problem.promptDen)} z ${escapeHtml(problem.quantity)}?`;
  }

  if (problem.variant === 'unit') {
    return `${escapeHtml(problem.unitValue)} ${escapeHtml(problem.unitMeasure)} = ${formatUnknownNumeratorFractionHtml(problem.promptDen)} ${escapeHtml(problem.unitLabel)}. Doplň čitatele zlomku.`;
  }

  if (problem.variant === 'find-whole') {
    return `Na tyči bylo natřeno ${escapeHtml(problem.partValue)} cm, což je ${formatSingleFractionHtml(problem.promptNum, problem.promptDen)} celé délky. Jak dlouhá je celá tyč v cm?`;
  }

  if (problem.variant === 'equals-whole') {
    return `Kolik je ${formatSingleFractionHtml(problem.promptNum, problem.promptDen)}?`;
  }

  return escapeHtml(problem.prompt);
}

function formatFractionZlomekDisplayHtml(problem) {
  return `<p class="problem-prompt">${formatFractionZlomekPromptContentHtml(problem)}</p>`;
}

function formatFractionZlomekSessionAnswer(userAnswer, problem) {
  if (problem.answerKind === 'number') {
    return formatIntegerAnswer(userAnswer);
  }

  return formatFraction(userAnswer.num, userAnswer.den);
}

function formatFractionZlomekCorrectAnswer(problem) {
  if (problem.answerKind === 'number') {
    return formatIntegerAnswer(problem.answer);
  }

  return formatFraction(problem.answerNum, problem.answerDen);
}

function getFractionUserAnswerFallback() {
  if (isNumberAnswerInputShape()) {
    const value = parseAnswer(inputEl.value);
    if (value !== null && Number.isInteger(value)) {
      return { num: value, den: 1 };
    }
  }

  const numText = answerNumeratorEl.value.trim();
  if (/^\d+$/.test(numText) && answerDenominatorEl.value.trim() === '') {
    return { num: Number(numText), den: 1 };
  }

  return null;
}

function getFractionZlomekUserAnswer(problem) {
  if (problem.answerKind === 'number') {
    const value = parseAnswer(inputEl.value);
    return value !== null && Number.isInteger(value) ? value : null;
  }

  return getFractionAnswerFromInputs() ?? getFractionUserAnswerFallback();
}

function evaluateFractionZlomekAnswer(problem, userAnswer) {
  if (problem.answerKind === 'number') {
    return {
      isCorrect: userAnswer === problem.answer,
      feedbackMessage: userAnswer === problem.answer ? 'Správně!' : 'Špatně.',
    };
  }

  const correctFraction = {
    num: problem.answerNum,
    den: problem.answerDen,
  };

  if (fractionAnswersMatch(userAnswer, correctFraction)
    || fractionAnswersEquivalent(userAnswer, correctFraction)) {
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

function isFractionExpandReduceProblem(problem) {
  return problem?.type === 'fraction-expand-reduce';
}

function buildFractionExpandReduceProblem({
  level,
  leftNum,
  leftDen,
  rightNum,
  rightDen,
  unknownPosition,
  answer,
}) {
  return {
    type: 'fraction-expand-reduce',
    level,
    leftNum,
    leftDen,
    rightNum,
    rightDen,
    unknownPosition,
    answer,
    isRetry: false,
  };
}

function isIntegerMultipleOf(a, b) {
  if (a <= 0 || b <= 0) {
    return false;
  }

  const larger = Math.max(a, b);
  const smaller = Math.min(a, b);
  return larger % smaller === 0;
}

function expandReduceFractionsHaveCorrespondingMultiple(leftNum, leftDen, rightNum, rightDen) {
  return isIntegerMultipleOf(leftNum, rightNum)
    || isIntegerMultipleOf(leftDen, rightDen);
}

function getFractionExpandReduceLevelConfig(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 1) {
    return {
      displayLevel,
      rNumMax: 3,
      rDenMax: 6,
      multiplierPairs: [[1, 2], [1, 3], [2, 4]],
      unknownVariant: 'denominator',
      requireMultiple: true,
    };
  }

  if (displayLevel === 2) {
    return {
      displayLevel,
      rNumMax: 3,
      rDenMax: 6,
      multiplierPairs: [[1, 2], [1, 3], [2, 4]],
      unknownVariant: 'numerator',
      requireMultiple: true,
    };
  }

  if (displayLevel === 3) {
    return {
      displayLevel,
      rNumMax: 4,
      rDenMax: 8,
      multiplierPairs: [[1, 2], [1, 3], [1, 4], [2, 4], [2, 6]],
      unknownVariant: 'any',
      requireMultiple: true,
    };
  }

  if (displayLevel === 4) {
    return {
      displayLevel,
      rNumMax: 5,
      rDenMax: 8,
      multiplierPairs: [[1, 3], [1, 4], [2, 4], [2, 6], [2, 8], [3, 6]],
      unknownVariant: 'any',
      requireMultiple: true,
    };
  }

  return {
    displayLevel,
    rNumMax: 5,
    rDenMax: 8,
    multiplierPairs: FRACTION_EXPAND_REDUCE_MULTIPLIER_PAIRS_NON_DIVISIBLE,
    unknownVariant: 'any',
    requireMultiple: false,
  };
}

function pickExpandReduceUnknownPosition(unknownVariant) {
  if (unknownVariant === 'denominator') {
    return pickRandomItem(['left-den', 'right-den']);
  }

  if (unknownVariant === 'numerator') {
    return pickRandomItem(['left-num', 'right-num']);
  }

  return pickRandomItem(['left-num', 'right-num', 'left-den', 'right-den']);
}

function pickExpandReduceMultipliers(multiplierPairs) {
  const [m1, m2] = pickRandomItem(multiplierPairs);
  return Math.random() < 0.5 ? [m1, m2] : [m2, m1];
}

function getFractionExpandReduceFallbackProblem(displayLevel) {
  const fallbacks = {
    1: {
      leftNum: 1,
      leftDen: 4,
      rightNum: 2,
      rightDen: 8,
      unknownPosition: 'left-den',
      answer: 4,
    },
    2: {
      leftNum: 1,
      leftDen: 4,
      rightNum: 2,
      rightDen: 8,
      unknownPosition: 'right-num',
      answer: 2,
    },
    3: {
      leftNum: 1,
      leftDen: 4,
      rightNum: 2,
      rightDen: 8,
      unknownPosition: 'left-num',
      answer: 1,
    },
    4: {
      leftNum: 2,
      leftDen: 6,
      rightNum: 4,
      rightDen: 12,
      unknownPosition: 'right-den',
      answer: 12,
    },
    5: {
      leftNum: 2,
      leftDen: 8,
      rightNum: 3,
      rightDen: 12,
      unknownPosition: 'left-num',
      answer: 2,
    },
  };

  return fallbacks[displayLevel] ?? fallbacks[1];
}

function createFractionExpandReduceProblem(difficultyLevel) {
  const config = getFractionExpandReduceLevelConfig(difficultyLevel);

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const rNum = randomWhole(1, config.rNumMax);
    const rDen = randomWhole(rNum + 1, config.rDenMax);

    if (gcd(rNum, rDen) !== 1) {
      continue;
    }

    const [m1, m2] = pickExpandReduceMultipliers(config.multiplierPairs);
    const leftNum = rNum * m1;
    const leftDen = rDen * m1;
    const rightNum = rNum * m2;
    const rightDen = rDen * m2;

    if (leftNum > FRACTION_EXPAND_REDUCE_VALUE_MAX
      || rightNum > FRACTION_EXPAND_REDUCE_VALUE_MAX
      || leftDen > FRACTION_EXPAND_REDUCE_DEN_MAX
      || rightDen > FRACTION_EXPAND_REDUCE_DEN_MAX) {
      continue;
    }

    if (leftNum === rightNum && leftDen === rightDen) {
      continue;
    }

    const hasMultiple = expandReduceFractionsHaveCorrespondingMultiple(
      leftNum,
      leftDen,
      rightNum,
      rightDen,
    );

    if (config.requireMultiple && !hasMultiple) {
      continue;
    }

    if (!config.requireMultiple && hasMultiple) {
      continue;
    }

    const unknownPosition = pickExpandReduceUnknownPosition(config.unknownVariant);
    const answer = unknownPosition === 'left-num'
      ? leftNum
      : unknownPosition === 'right-num'
        ? rightNum
        : unknownPosition === 'left-den'
          ? leftDen
          : rightDen;

    return buildFractionExpandReduceProblem({
      level: config.displayLevel,
      leftNum,
      leftDen,
      rightNum,
      rightDen,
      unknownPosition,
      answer,
    });
  }

  const fallback = getFractionExpandReduceFallbackProblem(config.displayLevel);

  return buildFractionExpandReduceProblem({
    level: config.displayLevel,
    ...fallback,
  });
}

function fractionExpandReduceProblemFromRetry(dueRetry) {
  return {
    type: 'fraction-expand-reduce',
    level: dueRetry.level,
    leftNum: dueRetry.leftNum,
    leftDen: dueRetry.leftDen,
    rightNum: dueRetry.rightNum,
    rightDen: dueRetry.rightDen,
    unknownPosition: dueRetry.unknownPosition,
    answer: dueRetry.answer,
    isRetry: true,
  };
}

function formatExpandReduceSideFractionHtml(num, den, unknownPosition, side) {
  if (unknownPosition === `${side}-num`) {
    return formatUnknownNumeratorFractionHtml(den);
  }

  if (unknownPosition === `${side}-den`) {
    return formatUnknownDenominatorFractionHtml(num);
  }

  return formatSingleFractionHtml(num, den);
}

function formatFractionExpandReduceProblemText(problem) {
  const leftText = problem.unknownPosition === 'left-num'
    ? `?/${problem.leftDen}`
    : problem.unknownPosition === 'left-den'
      ? `${problem.leftNum}/?`
      : `${problem.leftNum}/${problem.leftDen}`;
  const rightText = problem.unknownPosition === 'right-num'
    ? `?/${problem.rightDen}`
    : problem.unknownPosition === 'right-den'
      ? `${problem.rightNum}/?`
      : `${problem.rightNum}/${problem.rightDen}`;

  return `${leftText} = ${rightText}`;
}

function formatFractionExpandReduceDisplayHtml(problem) {
  const left = formatExpandReduceSideFractionHtml(
    problem.leftNum,
    problem.leftDen,
    problem.unknownPosition,
    'left',
  );
  const right = formatExpandReduceSideFractionHtml(
    problem.rightNum,
    problem.rightDen,
    problem.unknownPosition,
    'right',
  );

  return `<span class="problem-expression">${left}<span class="problem-expression__operator">=</span>${right}</span>`;
}

function evaluateFractionExpandReduceAnswer(problem, userAnswer) {
  return {
    isCorrect: userAnswer === problem.answer,
    feedbackMessage: userAnswer === problem.answer ? 'Správně!' : 'Špatně.',
  };
}

function isDecimalFractionConvertProblem(problem) {
  return problem?.type === 'decimal-fraction-convert';
}

function pickDecimalFractionConvertDenominator() {
  if (Math.random() < DECIMAL_FRACTION_CONVERT_SPECIAL_DEN_RATE) {
    return pickRandomItem(DECIMAL_FRACTION_CONVERT_DENOMINATORS_SPECIAL);
  }

  return pickRandomItem(DECIMAL_FRACTION_CONVERT_DENOMINATORS_COMMON);
}

function getExactDecimalPlaces(value, maxPlaces) {
  for (let places = 0; places <= maxPlaces; places += 1) {
    if (valueFitsDecimalPlaces(value, places)) {
      return places;
    }
  }

  return null;
}

function buildDecimalFractionConvertProblem({
  level,
  direction,
  num,
  den,
  decimalValue,
  decimalPlaces,
}) {
  return {
    type: 'decimal-fraction-convert',
    level,
    direction,
    num,
    den,
    decimalValue,
    decimalPlaces,
    answerKind: direction === 'decimal-to-fraction' ? 'fraction' : 'decimal',
    answerNum: num,
    answerDen: den,
    answer: decimalValue,
    answerDecimals: decimalPlaces,
    isRetry: false,
  };
}

function createDecimalFractionConvertProblem(_level) {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const den = pickDecimalFractionConvertDenominator();
    const numMax = Math.min(den * 9, DECIMAL_FRACTION_CONVERT_ANSWER_MAX);
    const num = randomWhole(1, numMax);

    if (gcd(num, den) !== 1) {
      continue;
    }

    const decimalValue = num / den;
    const decimalPlaces = getExactDecimalPlaces(
      decimalValue,
      DECIMAL_FRACTION_CONVERT_MAX_DECIMAL_PLACES,
    );

    if (decimalPlaces === null) {
      continue;
    }

    const direction = Math.random() < 0.5
      ? 'decimal-to-fraction'
      : 'fraction-to-decimal';

    return buildDecimalFractionConvertProblem({
      level: 1,
      direction,
      num,
      den,
      decimalValue,
      decimalPlaces,
    });
  }

  return buildDecimalFractionConvertProblem({
    level: 1,
    direction: 'decimal-to-fraction',
    num: 3,
    den: 10,
    decimalValue: 0.3,
    decimalPlaces: 1,
  });
}

function decimalFractionConvertProblemFromRetry(dueRetry) {
  return {
    type: 'decimal-fraction-convert',
    level: dueRetry.level,
    direction: dueRetry.direction,
    num: dueRetry.num,
    den: dueRetry.den,
    decimalValue: dueRetry.decimalValue,
    decimalPlaces: dueRetry.decimalPlaces,
    answerKind: dueRetry.answerKind,
    answerNum: dueRetry.answerNum,
    answerDen: dueRetry.answerDen,
    answer: dueRetry.answer,
    answerDecimals: dueRetry.answerDecimals,
    isRetry: true,
  };
}

function formatDecimalFractionConvertProblemText(problem) {
  if (problem.direction === 'decimal-to-fraction') {
    return `${formatDecimal(problem.decimalValue, problem.decimalPlaces)} =`;
  }

  return `${problem.num}/${problem.den} =`;
}

function formatDecimalFractionConvertDisplayHtml(problem) {
  if (problem.direction === 'decimal-to-fraction') {
    return `<span class="problem-expression"><span class="problem-expression__term">${escapeHtml(formatDecimal(problem.decimalValue, problem.decimalPlaces))}</span><span class="problem-expression__equals">=</span></span>`;
  }

  return `<span class="problem-expression">${formatSingleFractionHtml(problem.num, problem.den)}<span class="problem-expression__equals">=</span></span>`;
}

function evaluateDecimalFractionConvertAnswer(problem, userAnswer) {
  if (problem.answerKind === 'fraction') {
    const isCorrect = userAnswer.num * problem.answerDen === problem.answerNum * userAnswer.den;

    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  const isCorrect = answersMatch(userAnswer, problem.answer, problem.answerDecimals);

  return {
    isCorrect,
    feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
  };
}

function isLengthConvertProblem(problem) {
  return problem?.type === 'length-convert';
}

function isLengthConvertOrderProblem(problem) {
  return isLengthConvertProblem(problem) && problem.variant === 'order';
}

function isWeightConvertProblem(problem) {
  return problem?.type === 'weight-convert';
}

function isWeightConvertOrderProblem(problem) {
  return isWeightConvertProblem(problem) && problem.variant === 'order';
}

function isAreaConvertProblem(problem) {
  return problem?.type === 'area-convert';
}

function isAreaConvertOrderProblem(problem) {
  return isAreaConvertProblem(problem) && problem.variant === 'order';
}

function isVolumeConvertProblem(problem) {
  return problem?.type === 'volume-convert';
}

function isVolumeConvertOrderProblem(problem) {
  return isVolumeConvertProblem(problem) && problem.variant === 'order';
}

function isUnitConvertOrderProblem(problem) {
  return isLengthConvertOrderProblem(problem)
    || isWeightConvertOrderProblem(problem)
    || isAreaConvertOrderProblem(problem)
    || isVolumeConvertOrderProblem(problem);
}

function usesCompareSortOrderUi(problem) {
  return (isCompareProblem(problem) && problem.variant === 'order')
    || isUnitConvertOrderProblem(problem);
}

function lengthToMillimeters(value, unit) {
  return value * LENGTH_UNIT_TO_MM[unit];
}

function convertLengthValue(value, fromUnit, toUnit) {
  return lengthToMillimeters(value, fromUnit) / LENGTH_UNIT_TO_MM[toUnit];
}

function formatLengthWithUnit(value, unit, decimals = null) {
  return `${formatLengthValue(value, decimals)} ${unit}`;
}

function getLengthValueDecimals(value, maxDecimals = 3) {
  if (Number.isInteger(value)) {
    return 0;
  }

  for (let decimals = 1; decimals <= maxDecimals; decimals += 1) {
    if (valueFitsDecimalPlaces(value, decimals)) {
      return decimals;
    }
  }

  return maxDecimals;
}

function formatLengthValue(value, decimals = null) {
  const resolvedDecimals = decimals ?? getLengthValueDecimals(value);

  if (resolvedDecimals === 0) {
    return String(value);
  }

  return formatDecimal(value, resolvedDecimals);
}

function getLengthConvertDecimalPlaces(displayLevel) {
  if (displayLevel === 1) {
    return Math.random() < 0.45 ? 1 : 0;
  }

  if (displayLevel === 2) {
    return pickRandomItem([0, 0, 1, 1]);
  }

  if (displayLevel === 3) {
    return pickRandomItem([0, 1, 1, 2]);
  }

  return pickRandomItem([0, 1, 2, 2, 3]);
}

function pickLengthConvertValue(minValue, maxValue, decimals) {
  if (decimals === 0) {
    return randomWhole(minValue, maxValue);
  }

  return randomDecimal(minValue, maxValue, decimals);
}

function getLengthMillimeterKey(value, unit) {
  return toScaled(lengthToMillimeters(value, unit), 3);
}

function getLengthConvertValueRange(displayLevel) {
  if (displayLevel === 1) {
    return [1, 12];
  }

  if (displayLevel === 2) {
    return [1, 50];
  }

  if (displayLevel === 3) {
    return [1, 80];
  }

  return [1, 150];
}

function getLengthConvertUnitPairs(displayLevel) {
  const pairs = [];

  for (let i = 0; i < LENGTH_UNIT_ORDER.length - 1; i += 1) {
    pairs.push(
      [LENGTH_UNIT_ORDER[i], LENGTH_UNIT_ORDER[i + 1]],
      [LENGTH_UNIT_ORDER[i + 1], LENGTH_UNIT_ORDER[i]],
    );
  }

  if (displayLevel >= 3) {
    for (let i = 0; i < LENGTH_UNIT_ORDER.length - 2; i += 1) {
      pairs.push(
        [LENGTH_UNIT_ORDER[i], LENGTH_UNIT_ORDER[i + 2]],
        [LENGTH_UNIT_ORDER[i + 2], LENGTH_UNIT_ORDER[i]],
      );
    }
  }

  if (displayLevel >= 4) {
    for (let i = 0; i < LENGTH_UNIT_ORDER.length; i += 1) {
      for (let j = 0; j < LENGTH_UNIT_ORDER.length; j += 1) {
        if (i !== j) {
          pairs.push([LENGTH_UNIT_ORDER[i], LENGTH_UNIT_ORDER[j]]);
        }
      }
    }
  }

  return pairs;
}

function getLengthSortedIndices(operands) {
  return operands
    .map((operand, index) => ({
      index,
      value: lengthToMillimeters(operand.value, operand.unit),
    }))
    .sort((a, b) => a.value - b.value)
    .map((item) => item.index);
}

function buildLengthConvertProblem({
  level,
  variant,
  fromValue = null,
  fromUnit = null,
  toUnit = null,
  fromValueDecimals = null,
  answer = null,
  answerDecimals = null,
  operands = null,
  correctOrder = null,
  displayOrder = null,
}) {
  return {
    type: 'length-convert',
    variant,
    level,
    fromValue,
    fromUnit,
    toUnit,
    fromValueDecimals,
    answer,
    answerDecimals,
    operands,
    correctOrder,
    displayOrder,
    isRetry: false,
  };
}

function createLengthConvertConvertProblem(displayLevel) {
  const pairs = getLengthConvertUnitPairs(displayLevel);
  const [minValue, maxValue] = getLengthConvertValueRange(displayLevel);

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const [fromUnit, toUnit] = pickRandomItem(pairs);
    const fromValueDecimals = getLengthConvertDecimalPlaces(displayLevel);
    const fromValue = pickLengthConvertValue(minValue, maxValue, fromValueDecimals);
    const answerRaw = convertLengthValue(fromValue, fromUnit, toUnit);
    const answerDecimals = getExactDecimalPlaces(answerRaw, 3);

    if (answerRaw <= 0 || answerDecimals === null || answerRaw > LENGTH_CONVERT_ANSWER_MAX) {
      continue;
    }

    const answer = fromScaled(toScaled(answerRaw, answerDecimals), answerDecimals);

    return buildLengthConvertProblem({
      level: displayLevel,
      variant: 'convert',
      fromValue,
      fromUnit,
      toUnit,
      fromValueDecimals,
      answer,
      answerDecimals,
    });
  }

  return buildLengthConvertProblem({
    level: displayLevel,
    variant: 'convert',
    fromValue: 2.5,
    fromUnit: 'cm',
    toUnit: 'mm',
    fromValueDecimals: 1,
    answer: 25,
    answerDecimals: 0,
  });
}

function pickLengthConvertOrderOperand(unit) {
  const maxValue = unit === 'km' ? 5 : unit === 'm' ? 90 : unit === 'dm' ? 120 : 250;
  const decimals = pickRandomItem([0, 0, 1, 1, 2]);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const value = pickLengthConvertValue(1, maxValue, decimals);
    const resolvedDecimals = getLengthValueDecimals(value, 2);

    if (value <= 0) {
      continue;
    }

    return {
      value: fromScaled(toScaled(value, resolvedDecimals), resolvedDecimals),
      unit,
      decimals: resolvedDecimals,
    };
  }

  return {
    value: randomWhole(1, Math.min(maxValue, 20)),
    unit,
    decimals: 0,
  };
}

function createLengthConvertOrderProblem(displayLevel) {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const units = shuffleArray([...LENGTH_UNIT_ORDER]).slice(0, 4);
    const operands = [];
    const usedMillimeters = new Set();

    let valid = true;

    units.forEach((unit) => {
      let operand = null;

      for (let innerAttempt = 0; innerAttempt < 40; innerAttempt += 1) {
        const candidate = pickLengthConvertOrderOperand(unit);
        const millimeterKey = getLengthMillimeterKey(candidate.value, candidate.unit);

        if (!usedMillimeters.has(millimeterKey)) {
          usedMillimeters.add(millimeterKey);
          operand = candidate;
          break;
        }
      }

      if (!operand) {
        valid = false;
      } else {
        operands.push(operand);
      }
    });

    if (!valid || operands.length !== 4) {
      continue;
    }

    let displayOrder = shuffleIndices(operands.length);
    const correctOrder = getLengthSortedIndices(operands);

    while (displayOrder.every((value, index) => value === correctOrder[index])) {
      displayOrder = shuffleIndices(operands.length);
    }

    return buildLengthConvertProblem({
      level: displayLevel,
      variant: 'order',
      operands,
      correctOrder,
      displayOrder,
    });
  }

  return buildLengthConvertProblem({
    level: displayLevel,
    variant: 'order',
    operands: [
      { value: 5, unit: 'cm', decimals: 0 },
      { value: 2.5, unit: 'dm', decimals: 1 },
      { value: 3.5, unit: 'mm', decimals: 1 },
      { value: 1.2, unit: 'm', decimals: 1 },
    ],
    correctOrder: [2, 0, 1, 3],
    displayOrder: [0, 2, 1, 3],
  });
}

function createLengthConvertProblem(level) {
  const displayLevel = level + 1;

  if (displayLevel <= 4) {
    return createLengthConvertConvertProblem(displayLevel);
  }

  return createLengthConvertOrderProblem(displayLevel);
}

function lengthConvertProblemFromRetry(dueRetry) {
  const problem = buildLengthConvertProblem({
    level: dueRetry.level,
    variant: dueRetry.variant,
    fromValue: dueRetry.fromValue ?? null,
    fromUnit: dueRetry.fromUnit ?? null,
    toUnit: dueRetry.toUnit ?? null,
    fromValueDecimals: dueRetry.fromValueDecimals ?? null,
    answer: dueRetry.answer ?? null,
    answerDecimals: dueRetry.answerDecimals ?? null,
    operands: dueRetry.operands ? dueRetry.operands.map((operand) => ({ ...operand })) : null,
    correctOrder: dueRetry.correctOrder ? [...dueRetry.correctOrder] : null,
  });

  if (dueRetry.variant === 'order') {
    problem.displayOrder = dueRetry.displayOrder
      ? [...dueRetry.displayOrder]
      : shuffleIndices(problem.operands.length);
  }

  problem.isRetry = true;
  return problem;
}

function formatLengthConvertOperandText(operand) {
  return formatLengthWithUnit(operand.value, operand.unit, operand.decimals);
}

function formatLengthConvertOrderListText(problem, order) {
  return order
    .map((operandIndex) => formatLengthConvertOperandText(problem.operands[operandIndex]))
    .join(' < ');
}

function formatLengthConvertProblemText(problem) {
  if (problem.variant === 'order') {
    const order = problem.displayOrder ?? shuffleIndices(problem.operands.length);
    return `Uspořádej: ${formatLengthConvertOrderListText(problem, order)}`;
  }

  return `${formatLengthWithUnit(problem.fromValue, problem.fromUnit, problem.fromValueDecimals)} = ? ${problem.toUnit}`;
}

function formatLengthConvertDisplayHtml(problem) {
  if (problem.variant === 'order') {
    return '<span class="problem-expression problem-expression--decimal-compare">Uspořádej délky od nejmenší po největší</span>';
  }

  return `<span class="problem-expression"><span class="problem-expression__term">${escapeHtml(formatLengthWithUnit(problem.fromValue, problem.fromUnit, problem.fromValueDecimals))}</span><span class="problem-expression__equals">=</span><span class="problem-expression__term">? ${escapeHtml(problem.toUnit)}</span></span>`;
}

function evaluateLengthConvertAnswer(problem, userAnswer) {
  if (problem.variant === 'convert') {
    const isCorrect = answersMatch(userAnswer, problem.answer, problem.answerDecimals);

    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  const isCorrect = userAnswer?.kind === 'order'
    && userAnswer.order.every((value, index) => value === problem.correctOrder[index]);

  return {
    isCorrect,
    feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
  };
}

function getLengthConvertUserAnswer(problem) {
  if (problem.variant === 'convert') {
    return parseAnswer(inputEl.value);
  }

  if (!Array.isArray(decimalCompareSortOrder) || decimalCompareSortOrder.length !== problem.operands.length) {
    return null;
  }

  return { kind: 'order', order: [...decimalCompareSortOrder] };
}

function weightToMilligrams(value, unit) {
  return value * WEIGHT_UNIT_TO_MG[unit];
}

function convertWeightValue(value, fromUnit, toUnit) {
  return weightToMilligrams(value, fromUnit) / WEIGHT_UNIT_TO_MG[toUnit];
}

function formatWeightWithUnit(value, unit, decimals = null) {
  return `${formatWeightValue(value, decimals)} ${unit}`;
}

function getWeightValueDecimals(value, maxDecimals = 3) {
  if (Number.isInteger(value)) {
    return 0;
  }

  for (let decimals = 1; decimals <= maxDecimals; decimals += 1) {
    if (valueFitsDecimalPlaces(value, decimals)) {
      return decimals;
    }
  }

  return maxDecimals;
}

function formatWeightValue(value, decimals = null) {
  const resolvedDecimals = decimals ?? getWeightValueDecimals(value);

  if (resolvedDecimals === 0) {
    return String(value);
  }

  return formatDecimal(value, resolvedDecimals);
}

function getWeightConvertDecimalPlaces(displayLevel) {
  if (displayLevel === 1) {
    return Math.random() < 0.45 ? 1 : 0;
  }

  if (displayLevel === 2) {
    return pickRandomItem([0, 0, 1, 1]);
  }

  if (displayLevel === 3) {
    return pickRandomItem([0, 1, 1, 2]);
  }

  return pickRandomItem([0, 1, 2, 2, 3]);
}

function pickWeightConvertValue(minValue, maxValue, decimals) {
  if (decimals === 0) {
    return randomWhole(minValue, maxValue);
  }

  return randomDecimal(minValue, maxValue, decimals);
}

function getWeightMilligramKey(value, unit) {
  return toScaled(weightToMilligrams(value, unit), 3);
}

function getWeightConvertValueRange(displayLevel) {
  if (displayLevel === 1) {
    return [1, 12];
  }

  if (displayLevel === 2) {
    return [1, 50];
  }

  if (displayLevel === 3) {
    return [1, 80];
  }

  return [1, 150];
}

function getWeightConvertUnitPairs(displayLevel) {
  const pairs = [];

  for (let i = 0; i < WEIGHT_UNIT_ORDER.length - 1; i += 1) {
    pairs.push(
      [WEIGHT_UNIT_ORDER[i], WEIGHT_UNIT_ORDER[i + 1]],
      [WEIGHT_UNIT_ORDER[i + 1], WEIGHT_UNIT_ORDER[i]],
    );
  }

  if (displayLevel >= 3) {
    for (let i = 0; i < WEIGHT_UNIT_ORDER.length - 2; i += 1) {
      pairs.push(
        [WEIGHT_UNIT_ORDER[i], WEIGHT_UNIT_ORDER[i + 2]],
        [WEIGHT_UNIT_ORDER[i + 2], WEIGHT_UNIT_ORDER[i]],
      );
    }
  }

  if (displayLevel >= 4) {
    for (let i = 0; i < WEIGHT_UNIT_ORDER.length; i += 1) {
      for (let j = 0; j < WEIGHT_UNIT_ORDER.length; j += 1) {
        if (i !== j) {
          pairs.push([WEIGHT_UNIT_ORDER[i], WEIGHT_UNIT_ORDER[j]]);
        }
      }
    }
  }

  return pairs;
}

function getWeightSortedIndices(operands) {
  return operands
    .map((operand, index) => ({
      index,
      value: weightToMilligrams(operand.value, operand.unit),
    }))
    .sort((a, b) => a.value - b.value)
    .map((item) => item.index);
}

function buildWeightConvertProblem({
  level,
  variant,
  fromValue = null,
  fromUnit = null,
  toUnit = null,
  fromValueDecimals = null,
  answer = null,
  answerDecimals = null,
  operands = null,
  correctOrder = null,
  displayOrder = null,
}) {
  return {
    type: 'weight-convert',
    variant,
    level,
    fromValue,
    fromUnit,
    toUnit,
    fromValueDecimals,
    answer,
    answerDecimals,
    operands,
    correctOrder,
    displayOrder,
    isRetry: false,
  };
}

function createWeightConvertConvertProblem(displayLevel) {
  const pairs = getWeightConvertUnitPairs(displayLevel);
  const [minValue, maxValue] = getWeightConvertValueRange(displayLevel);

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const [fromUnit, toUnit] = pickRandomItem(pairs);
    const fromValueDecimals = getWeightConvertDecimalPlaces(displayLevel);
    const fromValue = pickWeightConvertValue(minValue, maxValue, fromValueDecimals);
    const answerRaw = convertWeightValue(fromValue, fromUnit, toUnit);
    const answerDecimals = getExactDecimalPlaces(answerRaw, 3);

    if (answerRaw <= 0 || answerDecimals === null || answerRaw > WEIGHT_CONVERT_ANSWER_MAX) {
      continue;
    }

    const answer = fromScaled(toScaled(answerRaw, answerDecimals), answerDecimals);

    return buildWeightConvertProblem({
      level: displayLevel,
      variant: 'convert',
      fromValue,
      fromUnit,
      toUnit,
      fromValueDecimals,
      answer,
      answerDecimals,
    });
  }

  return buildWeightConvertProblem({
    level: displayLevel,
    variant: 'convert',
    fromValue: 2.5,
    fromUnit: 'g',
    toUnit: 'mg',
    fromValueDecimals: 1,
    answer: 2500,
    answerDecimals: 0,
  });
}

function pickWeightConvertOrderOperand(unit) {
  const maxValue = unit === 't' ? 5 : unit === 'kg' ? 90 : unit === 'dag' ? 120 : 250;
  const decimals = pickRandomItem([0, 0, 1, 1, 2]);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const value = pickWeightConvertValue(1, maxValue, decimals);
    const resolvedDecimals = getWeightValueDecimals(value, 2);

    if (value <= 0) {
      continue;
    }

    return {
      value: fromScaled(toScaled(value, resolvedDecimals), resolvedDecimals),
      unit,
      decimals: resolvedDecimals,
    };
  }

  return {
    value: randomWhole(1, Math.min(maxValue, 20)),
    unit,
    decimals: 0,
  };
}

function createWeightConvertOrderProblem(displayLevel) {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const units = shuffleArray([...WEIGHT_UNIT_ORDER]).slice(0, 4);
    const operands = [];
    const usedMilligrams = new Set();

    let valid = true;

    units.forEach((unit) => {
      let operand = null;

      for (let innerAttempt = 0; innerAttempt < 40; innerAttempt += 1) {
        const candidate = pickWeightConvertOrderOperand(unit);
        const milligramKey = getWeightMilligramKey(candidate.value, candidate.unit);

        if (!usedMilligrams.has(milligramKey)) {
          usedMilligrams.add(milligramKey);
          operand = candidate;
          break;
        }
      }

      if (!operand) {
        valid = false;
      } else {
        operands.push(operand);
      }
    });

    if (!valid || operands.length !== 4) {
      continue;
    }

    let displayOrder = shuffleIndices(operands.length);
    const correctOrder = getWeightSortedIndices(operands);

    while (displayOrder.every((value, index) => value === correctOrder[index])) {
      displayOrder = shuffleIndices(operands.length);
    }

    return buildWeightConvertProblem({
      level: displayLevel,
      variant: 'order',
      operands,
      correctOrder,
      displayOrder,
    });
  }

  return buildWeightConvertProblem({
    level: displayLevel,
    variant: 'order',
    operands: [
      { value: 500, unit: 'mg', decimals: 0 },
      { value: 2.5, unit: 'g', decimals: 1 },
      { value: 3, unit: 'dag', decimals: 0 },
      { value: 1.2, unit: 'kg', decimals: 1 },
    ],
    correctOrder: [0, 1, 2, 3],
    displayOrder: [1, 0, 2, 3],
  });
}

function createWeightConvertProblem(level) {
  const displayLevel = level + 1;

  if (displayLevel <= 4) {
    return createWeightConvertConvertProblem(displayLevel);
  }

  return createWeightConvertOrderProblem(displayLevel);
}

function weightConvertProblemFromRetry(dueRetry) {
  const problem = buildWeightConvertProblem({
    level: dueRetry.level,
    variant: dueRetry.variant,
    fromValue: dueRetry.fromValue ?? null,
    fromUnit: dueRetry.fromUnit ?? null,
    toUnit: dueRetry.toUnit ?? null,
    fromValueDecimals: dueRetry.fromValueDecimals ?? null,
    answer: dueRetry.answer ?? null,
    answerDecimals: dueRetry.answerDecimals ?? null,
    operands: dueRetry.operands ? dueRetry.operands.map((operand) => ({ ...operand })) : null,
    correctOrder: dueRetry.correctOrder ? [...dueRetry.correctOrder] : null,
  });

  if (dueRetry.variant === 'order') {
    problem.displayOrder = dueRetry.displayOrder
      ? [...dueRetry.displayOrder]
      : shuffleIndices(problem.operands.length);
  }

  problem.isRetry = true;
  return problem;
}

function formatWeightConvertOperandText(operand) {
  return formatWeightWithUnit(operand.value, operand.unit, operand.decimals);
}

function formatWeightConvertOrderListText(problem, order) {
  return order
    .map((operandIndex) => formatWeightConvertOperandText(problem.operands[operandIndex]))
    .join(' < ');
}

function formatWeightConvertProblemText(problem) {
  if (problem.variant === 'order') {
    const order = problem.displayOrder ?? shuffleIndices(problem.operands.length);
    return `Uspořádej: ${formatWeightConvertOrderListText(problem, order)}`;
  }

  return `${formatWeightWithUnit(problem.fromValue, problem.fromUnit, problem.fromValueDecimals)} = ? ${problem.toUnit}`;
}

function formatWeightConvertDisplayHtml(problem) {
  if (problem.variant === 'order') {
    return '<span class="problem-expression problem-expression--decimal-compare">Uspořádej hmotnosti od nejmenší po největší</span>';
  }

  return `<span class="problem-expression"><span class="problem-expression__term">${escapeHtml(formatWeightWithUnit(problem.fromValue, problem.fromUnit, problem.fromValueDecimals))}</span><span class="problem-expression__equals">=</span><span class="problem-expression__term">? ${escapeHtml(problem.toUnit)}</span></span>`;
}

function evaluateWeightConvertAnswer(problem, userAnswer) {
  if (problem.variant === 'convert') {
    const isCorrect = answersMatch(userAnswer, problem.answer, problem.answerDecimals);

    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  const isCorrect = userAnswer?.kind === 'order'
    && userAnswer.order.every((value, index) => value === problem.correctOrder[index]);

  return {
    isCorrect,
    feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
  };
}

function getWeightConvertUserAnswer(problem) {
  if (problem.variant === 'convert') {
    return parseAnswer(inputEl.value);
  }

  if (!Array.isArray(decimalCompareSortOrder) || decimalCompareSortOrder.length !== problem.operands.length) {
    return null;
  }

  return { kind: 'order', order: [...decimalCompareSortOrder] };
}

function formatAreaUnit(unit) {
  return AREA_UNIT_LABELS[unit] ?? unit;
}

function areaToSquareMillimeters(value, unit) {
  return value * AREA_UNIT_TO_MM2[unit];
}

function convertAreaValue(value, fromUnit, toUnit) {
  return areaToSquareMillimeters(value, fromUnit) / AREA_UNIT_TO_MM2[toUnit];
}

function formatAreaWithUnit(value, unit, decimals = null) {
  return `${formatAreaValue(value, decimals)} ${formatAreaUnit(unit)}`;
}

function getAreaValueDecimals(value, maxDecimals = 3) {
  if (Number.isInteger(value)) {
    return 0;
  }

  for (let decimals = 1; decimals <= maxDecimals; decimals += 1) {
    if (valueFitsDecimalPlaces(value, decimals)) {
      return decimals;
    }
  }

  return maxDecimals;
}

function formatAreaValue(value, decimals = null) {
  const resolvedDecimals = decimals ?? getAreaValueDecimals(value);

  if (resolvedDecimals === 0) {
    return String(value);
  }

  return formatDecimal(value, resolvedDecimals);
}

function getAreaConvertDecimalPlaces(displayLevel) {
  if (displayLevel === 1) {
    return Math.random() < 0.45 ? 1 : 0;
  }

  if (displayLevel === 2) {
    return pickRandomItem([0, 0, 1, 1]);
  }

  if (displayLevel === 3) {
    return pickRandomItem([0, 1, 1, 2]);
  }

  return pickRandomItem([0, 1, 2, 2, 3]);
}

function pickAreaConvertValue(minValue, maxValue, decimals) {
  if (decimals === 0) {
    return randomWhole(minValue, maxValue);
  }

  return randomDecimal(minValue, maxValue, decimals);
}

function getAreaSquareMillimeterKey(value, unit) {
  return toScaled(areaToSquareMillimeters(value, unit), 3);
}

function getAreaConvertValueRange(displayLevel) {
  if (displayLevel === 1) {
    return [1, 12];
  }

  if (displayLevel === 2) {
    return [1, 50];
  }

  if (displayLevel === 3) {
    return [1, 80];
  }

  return [1, 150];
}

function getAreaConvertUnitPairs(displayLevel) {
  const pairs = [];

  for (let i = 0; i < AREA_UNIT_ORDER.length - 1; i += 1) {
    pairs.push(
      [AREA_UNIT_ORDER[i], AREA_UNIT_ORDER[i + 1]],
      [AREA_UNIT_ORDER[i + 1], AREA_UNIT_ORDER[i]],
    );
  }

  if (displayLevel >= 3) {
    for (let i = 0; i < AREA_UNIT_ORDER.length - 2; i += 1) {
      pairs.push(
        [AREA_UNIT_ORDER[i], AREA_UNIT_ORDER[i + 2]],
        [AREA_UNIT_ORDER[i + 2], AREA_UNIT_ORDER[i]],
      );
    }
  }

  if (displayLevel >= 4) {
    for (let i = 0; i < AREA_UNIT_ORDER.length; i += 1) {
      for (let j = 0; j < AREA_UNIT_ORDER.length; j += 1) {
        if (i !== j) {
          pairs.push([AREA_UNIT_ORDER[i], AREA_UNIT_ORDER[j]]);
        }
      }
    }
  }

  return pairs;
}

function getAreaSortedIndices(operands) {
  return operands
    .map((operand, index) => ({
      index,
      value: areaToSquareMillimeters(operand.value, operand.unit),
    }))
    .sort((a, b) => a.value - b.value)
    .map((item) => item.index);
}

function buildAreaConvertProblem({
  level,
  variant,
  fromValue = null,
  fromUnit = null,
  toUnit = null,
  fromValueDecimals = null,
  answer = null,
  answerDecimals = null,
  operands = null,
  correctOrder = null,
  displayOrder = null,
}) {
  return {
    type: 'area-convert',
    variant,
    level,
    fromValue,
    fromUnit,
    toUnit,
    fromValueDecimals,
    answer,
    answerDecimals,
    operands,
    correctOrder,
    displayOrder,
    isRetry: false,
  };
}

function createAreaConvertConvertProblem(displayLevel) {
  const pairs = getAreaConvertUnitPairs(displayLevel);
  const [minValue, maxValue] = getAreaConvertValueRange(displayLevel);

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const [fromUnit, toUnit] = pickRandomItem(pairs);
    const fromValueDecimals = getAreaConvertDecimalPlaces(displayLevel);
    const fromValue = pickAreaConvertValue(minValue, maxValue, fromValueDecimals);
    const answerRaw = convertAreaValue(fromValue, fromUnit, toUnit);
    const answerDecimals = getExactDecimalPlaces(answerRaw, 3);

    if (answerRaw <= 0 || answerDecimals === null || answerRaw > AREA_CONVERT_ANSWER_MAX) {
      continue;
    }

    const answer = fromScaled(toScaled(answerRaw, answerDecimals), answerDecimals);

    return buildAreaConvertProblem({
      level: displayLevel,
      variant: 'convert',
      fromValue,
      fromUnit,
      toUnit,
      fromValueDecimals,
      answer,
      answerDecimals,
    });
  }

  return buildAreaConvertProblem({
    level: displayLevel,
    variant: 'convert',
    fromValue: 2.5,
    fromUnit: 'cm2',
    toUnit: 'mm2',
    fromValueDecimals: 1,
    answer: 250,
    answerDecimals: 0,
  });
}

function pickAreaConvertOrderOperand(unit) {
  const maxValue = unit === 'ha' ? 5 : unit === 'a' ? 50 : unit === 'km2' ? 3 : unit === 'm2' ? 90 : unit === 'dm2' ? 120 : 250;
  const decimals = pickRandomItem([0, 0, 1, 1, 2]);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const value = pickAreaConvertValue(1, maxValue, decimals);
    const resolvedDecimals = getAreaValueDecimals(value, 2);

    if (value <= 0) {
      continue;
    }

    return {
      value: fromScaled(toScaled(value, resolvedDecimals), resolvedDecimals),
      unit,
      decimals: resolvedDecimals,
    };
  }

  return {
    value: randomWhole(1, Math.min(maxValue, 20)),
    unit,
    decimals: 0,
  };
}

function createAreaConvertOrderProblem(displayLevel) {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const units = shuffleArray([...AREA_UNIT_ORDER]).slice(0, 4);
    const operands = [];
    const usedSquareMillimeters = new Set();

    let valid = true;

    units.forEach((unit) => {
      let operand = null;

      for (let innerAttempt = 0; innerAttempt < 40; innerAttempt += 1) {
        const candidate = pickAreaConvertOrderOperand(unit);
        const squareMillimeterKey = getAreaSquareMillimeterKey(candidate.value, candidate.unit);

        if (!usedSquareMillimeters.has(squareMillimeterKey)) {
          usedSquareMillimeters.add(squareMillimeterKey);
          operand = candidate;
          break;
        }
      }

      if (!operand) {
        valid = false;
      } else {
        operands.push(operand);
      }
    });

    if (!valid || operands.length !== 4) {
      continue;
    }

    let displayOrder = shuffleIndices(operands.length);
    const correctOrder = getAreaSortedIndices(operands);

    while (displayOrder.every((value, index) => value === correctOrder[index])) {
      displayOrder = shuffleIndices(operands.length);
    }

    return buildAreaConvertProblem({
      level: displayLevel,
      variant: 'order',
      operands,
      correctOrder,
      displayOrder,
    });
  }

  return buildAreaConvertProblem({
    level: displayLevel,
    variant: 'order',
    operands: [
      { value: 500, unit: 'mm2', decimals: 0 },
      { value: 2.5, unit: 'cm2', decimals: 1 },
      { value: 3, unit: 'dm2', decimals: 0 },
      { value: 1.2, unit: 'm2', decimals: 1 },
    ],
    correctOrder: [1, 0, 2, 3],
    displayOrder: [0, 2, 1, 3],
  });
}

function createAreaConvertProblem(level) {
  const displayLevel = level + 1;

  if (displayLevel <= 4) {
    return createAreaConvertConvertProblem(displayLevel);
  }

  return createAreaConvertOrderProblem(displayLevel);
}

function areaConvertProblemFromRetry(dueRetry) {
  const problem = buildAreaConvertProblem({
    level: dueRetry.level,
    variant: dueRetry.variant,
    fromValue: dueRetry.fromValue ?? null,
    fromUnit: dueRetry.fromUnit ?? null,
    toUnit: dueRetry.toUnit ?? null,
    fromValueDecimals: dueRetry.fromValueDecimals ?? null,
    answer: dueRetry.answer ?? null,
    answerDecimals: dueRetry.answerDecimals ?? null,
    operands: dueRetry.operands ? dueRetry.operands.map((operand) => ({ ...operand })) : null,
    correctOrder: dueRetry.correctOrder ? [...dueRetry.correctOrder] : null,
  });

  if (dueRetry.variant === 'order') {
    problem.displayOrder = dueRetry.displayOrder
      ? [...dueRetry.displayOrder]
      : shuffleIndices(problem.operands.length);
  }

  problem.isRetry = true;
  return problem;
}

function formatAreaConvertOperandText(operand) {
  return formatAreaWithUnit(operand.value, operand.unit, operand.decimals);
}

function formatAreaConvertOrderListText(problem, order) {
  return order
    .map((operandIndex) => formatAreaConvertOperandText(problem.operands[operandIndex]))
    .join(' < ');
}

function formatAreaConvertProblemText(problem) {
  if (problem.variant === 'order') {
    const order = problem.displayOrder ?? shuffleIndices(problem.operands.length);
    return `Uspořádej: ${formatAreaConvertOrderListText(problem, order)}`;
  }

  return `${formatAreaWithUnit(problem.fromValue, problem.fromUnit, problem.fromValueDecimals)} = ? ${formatAreaUnit(problem.toUnit)}`;
}

function formatAreaConvertDisplayHtml(problem) {
  if (problem.variant === 'order') {
    return '<span class="problem-expression problem-expression--decimal-compare">Uspořádej obsahy od nejmenšího po největší</span>';
  }

  return `<span class="problem-expression"><span class="problem-expression__term">${escapeHtml(formatAreaWithUnit(problem.fromValue, problem.fromUnit, problem.fromValueDecimals))}</span><span class="problem-expression__equals">=</span><span class="problem-expression__term">? ${escapeHtml(formatAreaUnit(problem.toUnit))}</span></span>`;
}

function evaluateAreaConvertAnswer(problem, userAnswer) {
  if (problem.variant === 'convert') {
    const isCorrect = answersMatch(userAnswer, problem.answer, problem.answerDecimals);

    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  const isCorrect = userAnswer?.kind === 'order'
    && userAnswer.order.every((value, index) => value === problem.correctOrder[index]);

  return {
    isCorrect,
    feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
  };
}

function getAreaConvertUserAnswer(problem) {
  if (problem.variant === 'convert') {
    return parseAnswer(inputEl.value);
  }

  if (!Array.isArray(decimalCompareSortOrder) || decimalCompareSortOrder.length !== problem.operands.length) {
    return null;
  }

  return { kind: 'order', order: [...decimalCompareSortOrder] };
}

function formatVolumeUnit(unit) {
  return VOLUME_UNIT_LABELS[unit] ?? unit;
}

function volumeToCubicMillimeters(value, unit) {
  return value * VOLUME_UNIT_TO_MM3[unit];
}

function convertVolumeValue(value, fromUnit, toUnit) {
  return volumeToCubicMillimeters(value, fromUnit) / VOLUME_UNIT_TO_MM3[toUnit];
}

function formatVolumeWithUnit(value, unit, decimals = null) {
  return `${formatVolumeValue(value, decimals)} ${formatVolumeUnit(unit)}`;
}

function getVolumeValueDecimals(value, maxDecimals = 3) {
  if (Number.isInteger(value)) {
    return 0;
  }

  for (let decimals = 1; decimals <= maxDecimals; decimals += 1) {
    if (valueFitsDecimalPlaces(value, decimals)) {
      return decimals;
    }
  }

  return maxDecimals;
}

function formatVolumeValue(value, decimals = null) {
  const resolvedDecimals = decimals ?? getVolumeValueDecimals(value);

  if (resolvedDecimals === 0) {
    return String(value);
  }

  return formatDecimal(value, resolvedDecimals);
}

function getVolumeConvertDecimalPlaces(displayLevel) {
  if (displayLevel === 1) {
    return Math.random() < 0.45 ? 1 : 0;
  }

  if (displayLevel === 2) {
    return pickRandomItem([0, 0, 1, 1]);
  }

  if (displayLevel === 3) {
    return pickRandomItem([0, 1, 1, 2]);
  }

  return pickRandomItem([0, 1, 2, 2, 3]);
}

function pickVolumeConvertValue(minValue, maxValue, decimals) {
  if (decimals === 0) {
    return randomWhole(minValue, maxValue);
  }

  return randomDecimal(minValue, maxValue, decimals);
}

function getVolumeCubicMillimeterKey(value, unit) {
  return toScaled(volumeToCubicMillimeters(value, unit), 3);
}

function getVolumeConvertValueRange(displayLevel) {
  if (displayLevel === 1) {
    return [1, 12];
  }

  if (displayLevel === 2) {
    return [1, 50];
  }

  if (displayLevel === 3) {
    return [1, 80];
  }

  return [1, 150];
}

function getVolumeConvertUnitPairs(displayLevel) {
  const pairs = [];

  for (let i = 0; i < VOLUME_UNIT_ORDER.length - 1; i += 1) {
    pairs.push(
      [VOLUME_UNIT_ORDER[i], VOLUME_UNIT_ORDER[i + 1]],
      [VOLUME_UNIT_ORDER[i + 1], VOLUME_UNIT_ORDER[i]],
    );
  }

  if (displayLevel >= 3) {
    for (let i = 0; i < VOLUME_UNIT_ORDER.length - 2; i += 1) {
      pairs.push(
        [VOLUME_UNIT_ORDER[i], VOLUME_UNIT_ORDER[i + 2]],
        [VOLUME_UNIT_ORDER[i + 2], VOLUME_UNIT_ORDER[i]],
      );
    }
  }

  if (displayLevel >= 4) {
    for (let i = 0; i < VOLUME_UNIT_ORDER.length; i += 1) {
      for (let j = 0; j < VOLUME_UNIT_ORDER.length; j += 1) {
        if (i !== j) {
          pairs.push([VOLUME_UNIT_ORDER[i], VOLUME_UNIT_ORDER[j]]);
        }
      }
    }
  }

  return pairs;
}

function getVolumeSortedIndices(operands) {
  return operands
    .map((operand, index) => ({
      index,
      value: volumeToCubicMillimeters(operand.value, operand.unit),
    }))
    .sort((a, b) => a.value - b.value)
    .map((item) => item.index);
}

function buildVolumeConvertProblem({
  level,
  variant,
  fromValue = null,
  fromUnit = null,
  toUnit = null,
  fromValueDecimals = null,
  answer = null,
  answerDecimals = null,
  operands = null,
  correctOrder = null,
  displayOrder = null,
}) {
  return {
    type: 'volume-convert',
    variant,
    level,
    fromValue,
    fromUnit,
    toUnit,
    fromValueDecimals,
    answer,
    answerDecimals,
    operands,
    correctOrder,
    displayOrder,
    isRetry: false,
  };
}

function createVolumeConvertConvertProblem(displayLevel) {
  const pairs = getVolumeConvertUnitPairs(displayLevel);
  const [minValue, maxValue] = getVolumeConvertValueRange(displayLevel);

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const [fromUnit, toUnit] = pickRandomItem(pairs);
    const fromValueDecimals = getVolumeConvertDecimalPlaces(displayLevel);
    const fromValue = pickVolumeConvertValue(minValue, maxValue, fromValueDecimals);
    const answerRaw = convertVolumeValue(fromValue, fromUnit, toUnit);
    const answerDecimals = getExactDecimalPlaces(answerRaw, 3);

    if (answerRaw <= 0 || answerDecimals === null || answerRaw > VOLUME_CONVERT_ANSWER_MAX) {
      continue;
    }

    const answer = fromScaled(toScaled(answerRaw, answerDecimals), answerDecimals);

    return buildVolumeConvertProblem({
      level: displayLevel,
      variant: 'convert',
      fromValue,
      fromUnit,
      toUnit,
      fromValueDecimals,
      answer,
      answerDecimals,
    });
  }

  return buildVolumeConvertProblem({
    level: displayLevel,
    variant: 'convert',
    fromValue: 2.5,
    fromUnit: 'cm3',
    toUnit: 'mm3',
    fromValueDecimals: 1,
    answer: 2500,
    answerDecimals: 0,
  });
}

function pickVolumeConvertOrderOperand(unit) {
  const maxValue = unit === 'hl' ? 5 : unit === 'l' || unit === 'dm3' ? 50 : unit === 'm3' ? 3 : unit === 'dl' ? 90 : unit === 'cl' ? 120 : 250;
  const decimals = pickRandomItem([0, 0, 1, 1, 2]);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const value = pickVolumeConvertValue(1, maxValue, decimals);
    const resolvedDecimals = getVolumeValueDecimals(value, 2);

    if (value <= 0) {
      continue;
    }

    return {
      value: fromScaled(toScaled(value, resolvedDecimals), resolvedDecimals),
      unit,
      decimals: resolvedDecimals,
    };
  }

  return {
    value: randomWhole(1, Math.min(maxValue, 20)),
    unit,
    decimals: 0,
  };
}

function createVolumeConvertOrderProblem(displayLevel) {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const units = shuffleArray([...VOLUME_UNIT_ORDER]).slice(0, 4);
    const operands = [];
    const usedCubicMillimeters = new Set();

    let valid = true;

    units.forEach((unit) => {
      let operand = null;

      for (let innerAttempt = 0; innerAttempt < 40; innerAttempt += 1) {
        const candidate = pickVolumeConvertOrderOperand(unit);
        const cubicMillimeterKey = getVolumeCubicMillimeterKey(candidate.value, candidate.unit);

        if (!usedCubicMillimeters.has(cubicMillimeterKey)) {
          usedCubicMillimeters.add(cubicMillimeterKey);
          operand = candidate;
          break;
        }
      }

      if (!operand) {
        valid = false;
      } else {
        operands.push(operand);
      }
    });

    if (!valid || operands.length !== 4) {
      continue;
    }

    let displayOrder = shuffleIndices(operands.length);
    const correctOrder = getVolumeSortedIndices(operands);

    while (displayOrder.every((value, index) => value === correctOrder[index])) {
      displayOrder = shuffleIndices(operands.length);
    }

    return buildVolumeConvertProblem({
      level: displayLevel,
      variant: 'order',
      operands,
      correctOrder,
      displayOrder,
    });
  }

  return buildVolumeConvertProblem({
    level: displayLevel,
    variant: 'order',
    operands: [
      { value: 500, unit: 'mm3', decimals: 0 },
      { value: 2.5, unit: 'cm3', decimals: 1 },
      { value: 3, unit: 'dl', decimals: 0 },
      { value: 1.2, unit: 'l', decimals: 1 },
    ],
    correctOrder: [0, 1, 2, 3],
    displayOrder: [1, 0, 2, 3],
  });
}

function createVolumeConvertProblem(level) {
  const displayLevel = level + 1;

  if (displayLevel <= 4) {
    return createVolumeConvertConvertProblem(displayLevel);
  }

  return createVolumeConvertOrderProblem(displayLevel);
}

function volumeConvertProblemFromRetry(dueRetry) {
  const problem = buildVolumeConvertProblem({
    level: dueRetry.level,
    variant: dueRetry.variant,
    fromValue: dueRetry.fromValue ?? null,
    fromUnit: dueRetry.fromUnit ?? null,
    toUnit: dueRetry.toUnit ?? null,
    fromValueDecimals: dueRetry.fromValueDecimals ?? null,
    answer: dueRetry.answer ?? null,
    answerDecimals: dueRetry.answerDecimals ?? null,
    operands: dueRetry.operands ? dueRetry.operands.map((operand) => ({ ...operand })) : null,
    correctOrder: dueRetry.correctOrder ? [...dueRetry.correctOrder] : null,
  });

  if (dueRetry.variant === 'order') {
    problem.displayOrder = dueRetry.displayOrder
      ? [...dueRetry.displayOrder]
      : shuffleIndices(problem.operands.length);
  }

  problem.isRetry = true;
  return problem;
}

function formatVolumeConvertOperandText(operand) {
  return formatVolumeWithUnit(operand.value, operand.unit, operand.decimals);
}

function formatVolumeConvertOrderListText(problem, order) {
  return order
    .map((operandIndex) => formatVolumeConvertOperandText(problem.operands[operandIndex]))
    .join(' < ');
}

function formatVolumeConvertProblemText(problem) {
  if (problem.variant === 'order') {
    const order = problem.displayOrder ?? shuffleIndices(problem.operands.length);
    return `Uspořádej: ${formatVolumeConvertOrderListText(problem, order)}`;
  }

  return `${formatVolumeWithUnit(problem.fromValue, problem.fromUnit, problem.fromValueDecimals)} = ? ${formatVolumeUnit(problem.toUnit)}`;
}

function formatVolumeConvertDisplayHtml(problem) {
  if (problem.variant === 'order') {
    return '<span class="problem-expression problem-expression--decimal-compare">Uspořádej objemy od nejmenšího po největší</span>';
  }

  return `<span class="problem-expression"><span class="problem-expression__term">${escapeHtml(formatVolumeWithUnit(problem.fromValue, problem.fromUnit, problem.fromValueDecimals))}</span><span class="problem-expression__equals">=</span><span class="problem-expression__term">? ${escapeHtml(formatVolumeUnit(problem.toUnit))}</span></span>`;
}

function evaluateVolumeConvertAnswer(problem, userAnswer) {
  if (problem.variant === 'convert') {
    const isCorrect = answersMatch(userAnswer, problem.answer, problem.answerDecimals);

    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  const isCorrect = userAnswer?.kind === 'order'
    && userAnswer.order.every((value, index) => value === problem.correctOrder[index]);

  return {
    isCorrect,
    feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
  };
}

function getVolumeConvertUserAnswer(problem) {
  if (problem.variant === 'convert') {
    return parseAnswer(inputEl.value);
  }

  if (!Array.isArray(decimalCompareSortOrder) || decimalCompareSortOrder.length !== problem.operands.length) {
    return null;
  }

  return { kind: 'order', order: [...decimalCompareSortOrder] };
}

function isPercentPartProblem(problem) {
  return problem?.type === 'percent-part';
}

function formatWholeNumberForPercent(value) {
  if (Number.isInteger(value)) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  }

  const decimals = getExactDecimalPlaces(value, 3) ?? 0;
  return formatDecimal(value, decimals);
}

function getPercentPartPreposition(whole) {
  if (whole >= 100 && whole < 200) {
    return 'ze';
  }

  return 'z';
}

function countPercentPartSignificantDigits(value) {
  let remaining = Math.abs(Math.trunc(value));

  if (remaining === 0) {
    return 1;
  }

  while (remaining >= 10 && remaining % 10 === 0) {
    remaining /= 10;
  }

  return String(remaining).length;
}

function isValidPercentPartPair(percent, whole) {
  return countPercentPartSignificantDigits(percent) + countPercentPartSignificantDigits(whole)
    <= PERCENT_PART_MAX_SIGNIFICANT_DIGITS;
}

function pickPercentPartPercent(displayLevel) {
  if (displayLevel === 1 || displayLevel === 2) {
    return pickRandomItem(PERCENT_PART_BASIC_PERCENTS);
  }

  if (Math.random() < 0.5) {
    return randomWhole(1, 99);
  }

  return randomWhole(
    PERCENT_PART_LARGE_PERCENT_MIN / 10,
    PERCENT_PART_LARGE_PERCENT_MAX / 10,
  ) * 10;
}

function pickPercentPartWhole(displayLevel) {
  if (displayLevel === 1 || displayLevel === 3) {
    return randomWhole(1, 10) * 100;
  }

  if (displayLevel === 2) {
    return randomWhole(1, 99) * 10;
  }

  return randomWhole(1, 10) * 100;
}

function buildPercentPartProblem({
  level,
  percent,
  whole,
  preposition,
  answer,
  answerDecimals,
}) {
  return {
    type: 'percent-part',
    level,
    percent,
    whole,
    preposition,
    answer,
    answerDecimals,
    isRetry: false,
  };
}

function createPercentPartProblem(level) {
  const displayLevel = level + 1;
  const maxAnswerDecimals = 1;

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const percent = pickPercentPartPercent(displayLevel);
    const whole = pickPercentPartWhole(displayLevel);
    const answerRaw = whole * percent / 100;
    const answerDecimals = getExactDecimalPlaces(answerRaw, maxAnswerDecimals);

    if (answerRaw <= 0 || answerDecimals === null || answerRaw > PERCENT_PART_ANSWER_MAX) {
      continue;
    }

    if (!isValidPercentPartPair(percent, whole)) {
      continue;
    }

    const answer = fromScaled(toScaled(answerRaw, answerDecimals), answerDecimals);
    const preposition = getPercentPartPreposition(whole);

    return buildPercentPartProblem({
      level: displayLevel,
      percent,
      whole,
      preposition,
      answer,
      answerDecimals,
    });
  }

  return buildPercentPartProblem({
    level: displayLevel,
    percent: 120,
    whole: 40,
    preposition: 'z',
    answer: 48,
    answerDecimals: 0,
  });
}

function percentPartProblemFromRetry(dueRetry) {
  const problem = buildPercentPartProblem({
    level: dueRetry.level,
    percent: dueRetry.percent,
    whole: dueRetry.whole,
    preposition: dueRetry.preposition,
    answer: dueRetry.answer,
    answerDecimals: dueRetry.answerDecimals,
  });
  problem.isRetry = true;
  return problem;
}

function formatPercentPartExpression(problem) {
  const preposition = problem.preposition ?? getPercentPartPreposition(problem.whole);
  const calculation = `${problem.percent} % ${preposition} ${formatWholeNumberForPercent(problem.whole)}.`;
  return `Urči, kolik je\n${calculation}`;
}

function formatPercentPartProblemText(problem) {
  return formatPercentPartExpression(problem);
}

function formatPercentPartDisplayHtml(problem) {
  const preposition = problem.preposition ?? getPercentPartPreposition(problem.whole);
  const calculation = `${problem.percent} % ${preposition} ${formatWholeNumberForPercent(problem.whole)}.`;
  return `<span class="problem-expression problem-expression--percent-part">Urči, kolik je<br>${escapeHtml(calculation)}</span>`;
}

function evaluatePercentPartAnswer(problem, userAnswer) {
  const isCorrect = answersMatch(userAnswer, problem.answer, problem.answerDecimals);

  return {
    isCorrect,
    feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
  };
}

function getPercentPartUserAnswer() {
  return parseAnswer(inputEl.value);
}

function nonIntegerCompareProblemFromRetry(dueRetry) {
  const problem = buildNonIntegerCompareProblem({
    displayLevel: dueRetry.level,
    variant: dueRetry.variant,
    left: dueRetry.left ? cloneNonIntegerCompareOperand(dueRetry.left) : null,
    right: dueRetry.right ? cloneNonIntegerCompareOperand(dueRetry.right) : null,
    operands: dueRetry.operands ? dueRetry.operands.map(cloneNonIntegerCompareOperand) : null,
    answerSign: dueRetry.answerSign,
    correctOrder: dueRetry.correctOrder ? [...dueRetry.correctOrder] : null,
  });

  if (dueRetry.variant === 'order') {
    problem.displayOrder = dueRetry.displayOrder
      ? [...dueRetry.displayOrder]
      : shuffleIndices(problem.operands.length);
  }

  problem.isRetry = true;
  return problem;
}

function formatCompareSignText(problem, sign = '?') {
  return `${formatCompareOperand(problem, problem.left)} ${sign} ${formatCompareOperand(problem, problem.right)}`;
}

function formatCompareOrderListText(problem, order) {
  return order
    .map((index) => formatCompareOperand(problem, problem.operands[index]))
    .join('; ');
}

function formatCompareProblemText(problem) {
  if (problem.variant === 'sign') {
    return formatCompareSignText(problem, '?');
  }

  const order = problem.displayOrder ?? shuffleIndices(problem.operands.length);
  return `Uspořádej: ${formatCompareOrderListText(problem, order)}`;
}

function formatCompareSignHtml(problem, sign = '?', review = null) {
  const left = formatCompareOperandHtml(problem, problem.left);
  const right = formatCompareOperandHtml(problem, problem.right);
  const slotClasses = ['decimal-compare-sign-slot'];

  if (sign !== '?') {
    slotClasses.push('decimal-compare-sign-slot--filled');
  }

  if (review === 'correct') {
    slotClasses.push('decimal-compare-sign-slot--correct');
  } else if (review === 'wrong') {
    slotClasses.push('decimal-compare-sign-slot--wrong');
  }

  const signHtml = `<span class="${slotClasses.join(' ')}">${escapeHtml(sign)}</span>`;

  return `<span class="problem-expression problem-expression--decimal-compare">${left}${signHtml}${right}</span>`;
}

function renderCompareSignProblem(problem, { sign = null, review = null } = {}) {
  const displaySign = sign ?? decimalCompareSelectedSign ?? '?';
  problemEl.innerHTML = formatCompareSignHtml(problem, displaySign, review);
}

function formatCompareDisplayHtml(problem) {
  if (problem.variant === 'sign') {
    return formatCompareSignHtml(problem, '?');
  }

  return '<span class="problem-expression problem-expression--decimal-compare">Uspořádej čísla od nejmenšího po největší</span>';
}

function formatCompareCorrectAnswer(problem) {
  if (problem.variant === 'sign') {
    return formatCompareSignText(problem, problem.answerSign);
  }

  return formatCompareOrderListText(problem, problem.correctOrder);
}

function formatCompareSessionAnswer(problem, userAnswer) {
  if (problem.variant === 'sign') {
    return formatCompareSignText(problem, userAnswer.sign);
  }

  return formatCompareOrderListText(problem, userAnswer.order);
}

function integerCompareProblemFromRetry(dueRetry) {
  const problem = buildIntegerCompareProblem({
    displayLevel: dueRetry.level,
    variant: dueRetry.variant,
    left: dueRetry.left ? { ...dueRetry.left } : null,
    right: dueRetry.right ? { ...dueRetry.right } : null,
    operands: dueRetry.operands ? dueRetry.operands.map((operand) => ({ ...operand })) : null,
    answerSign: dueRetry.answerSign,
    correctOrder: dueRetry.correctOrder ? [...dueRetry.correctOrder] : null,
  });

  if (dueRetry.variant === 'order') {
    problem.displayOrder = dueRetry.displayOrder
      ? [...dueRetry.displayOrder]
      : shuffleIndices(problem.operands.length);
  }

  problem.isRetry = true;
  return problem;
}

function compareProblemFromRetry(dueRetry) {
  if (dueRetry.type === 'integer-compare') {
    return integerCompareProblemFromRetry(dueRetry);
  }

  if (dueRetry.type === 'non-integer-compare') {
    return nonIntegerCompareProblemFromRetry(dueRetry);
  }

  if (dueRetry.type === 'fraction-compare') {
    const problem = buildFractionCompareProblem({
      displayLevel: dueRetry.level,
      variant: dueRetry.variant,
      left: dueRetry.left ? { ...dueRetry.left } : null,
      right: dueRetry.right ? { ...dueRetry.right } : null,
      operands: dueRetry.operands ? dueRetry.operands.map((operand) => ({ ...operand })) : null,
      answerSign: dueRetry.answerSign,
      correctOrder: dueRetry.correctOrder ? [...dueRetry.correctOrder] : null,
      displayOrder: dueRetry.displayOrder ? [...dueRetry.displayOrder] : null,
    });
    problem.isRetry = true;
    return problem;
  }

  return decimalCompareProblemFromRetry(dueRetry);
}

function decimalCompareProblemFromRetry(dueRetry) {
  const problem = buildDecimalCompareProblem({
    displayLevel: dueRetry.level,
    variant: dueRetry.variant,
    left: dueRetry.left ? { ...dueRetry.left } : null,
    right: dueRetry.right ? { ...dueRetry.right } : null,
    operands: dueRetry.operands ? dueRetry.operands.map((operand) => ({ ...operand })) : null,
    answerSign: dueRetry.answerSign,
    correctOrder: dueRetry.correctOrder ? [...dueRetry.correctOrder] : null,
  });

  if (dueRetry.variant === 'order') {
    problem.displayOrder = dueRetry.displayOrder
      ? [...dueRetry.displayOrder]
      : shuffleIndices(problem.operands.length);
  }

  problem.isRetry = true;
  return problem;
}

function clearDecimalCompareSelectedSign() {
  decimalCompareSelectedSign = null;

  decimalCompareInequalityButtons.forEach((button) => {
    button.classList.remove('is-selected', 'is-correct', 'is-wrong');
  });
}

function setDecimalCompareSelectedSign(sign) {
  decimalCompareSelectedSign = sign;

  decimalCompareInequalityButtons.forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.decimalCompareSign === sign);
  });

  if (isCompareProblem(currentProblem) && currentProblem.variant === 'sign') {
    renderCompareSignProblem(currentProblem);
  }
}

function setDecimalCompareSignReviewHighlight(isCorrect) {
  if (!isCompareProblem(currentProblem) || currentProblem.variant !== 'sign') {
    return;
  }

  renderCompareSignProblem(currentProblem, {
    sign: decimalCompareSelectedSign,
    review: isCorrect ? 'correct' : 'wrong',
  });

  decimalCompareInequalityButtons.forEach((button) => {
    const isChosen = button.dataset.decimalCompareSign === decimalCompareSelectedSign;
    button.classList.remove('is-selected');
    button.classList.toggle('is-correct', isCorrect && isChosen);
    button.classList.toggle('is-wrong', !isCorrect && isChosen);
  });
}

function setDecimalCompareOrderReviewHighlight() {
  if (!usesCompareSortOrderUi(currentProblem)) {
    return;
  }

  renderDecimalCompareSortList(currentProblem, { interactive: false, review: true });
}

function initDecimalCompareSortOrder(problem) {
  decimalCompareSortOrder = problem.displayOrder
    ? [...problem.displayOrder]
    : shuffleIndices(problem.operands.length);
}

function moveDecimalCompareSortItem(fromIndex, insertIndex) {
  if (fromIndex < 0 || insertIndex < 0 || insertIndex > decimalCompareSortOrder.length) {
    return;
  }

  if (fromIndex === insertIndex || fromIndex + 1 === insertIndex) {
    return;
  }

  const nextOrder = [...decimalCompareSortOrder];
  const [moved] = nextOrder.splice(fromIndex, 1);
  const adjustedInsertIndex = insertIndex > fromIndex ? insertIndex - 1 : insertIndex;
  nextOrder.splice(adjustedInsertIndex, 0, moved);
  decimalCompareSortOrder = nextOrder;
}

function clearDecimalCompareDropTargets() {
  decimalCompareSortListEl?.querySelectorAll(
    '.decimal-compare-sort__item, .decimal-compare-sort__edge',
  ).forEach((element) => {
    element.classList.remove('is-drop-target');
  });
}

function bindDecimalCompareDropZone(element, insertIndex) {
  element.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    clearDecimalCompareDropTargets();
    element.classList.add('is-drop-target');
  });
  element.addEventListener('dragleave', () => {
    element.classList.remove('is-drop-target');
  });
  element.addEventListener('drop', (event) => {
    event.preventDefault();
    const fromIndex = Number(event.dataTransfer.getData('text/plain'));
    if (!Number.isInteger(fromIndex)) {
      return;
    }

    moveDecimalCompareSortItem(fromIndex, insertIndex);
    renderDecimalCompareSortList(currentProblem);
  });
}

function renderDecimalCompareSortList(problem, { interactive = true, review = false } = {}) {
  if (!decimalCompareSortListEl) {
    return;
  }

  decimalCompareSortListEl.replaceChildren();
  decimalCompareSortListEl.classList.toggle(
    'decimal-compare-sort__list--four',
    problem.operands.length === 4,
  );

  if (interactive) {
    const startEdge = document.createElement('div');
    startEdge.className = 'decimal-compare-sort__edge decimal-compare-sort__edge--start';
    startEdge.setAttribute('aria-hidden', 'true');
    bindDecimalCompareDropZone(startEdge, 0);
    decimalCompareSortListEl.append(startEdge);
  }

  decimalCompareSortOrder.forEach((operandIndex, position) => {
    const item = document.createElement('div');
    item.className = 'decimal-compare-sort__item';
    item.setAttribute('role', 'listitem');
    item.dataset.position = String(position);

    if (review) {
      const positionCorrect = operandIndex === problem.correctOrder[position];
      item.classList.add(positionCorrect ? 'is-correct' : 'is-wrong');
    }

    if (interactive) {
      item.draggable = true;
    }

    const handle = document.createElement('span');
    handle.className = 'decimal-compare-sort__handle';
    handle.setAttribute('aria-hidden', 'true');
    handle.textContent = '⠿';

    const value = document.createElement('span');
    value.className = 'decimal-compare-sort__value';

    if (isNonIntegerCompareProblem(problem) || isFractionCompareProblem(problem)) {
      value.innerHTML = formatCompareOperandHtml(problem, problem.operands[operandIndex]);
    } else if (isLengthConvertProblem(problem)) {
      value.textContent = formatLengthConvertOperandText(problem.operands[operandIndex]);
    } else if (isWeightConvertProblem(problem)) {
      value.textContent = formatWeightConvertOperandText(problem.operands[operandIndex]);
    } else if (isAreaConvertProblem(problem)) {
      value.textContent = formatAreaConvertOperandText(problem.operands[operandIndex]);
    } else if (isVolumeConvertProblem(problem)) {
      value.textContent = formatVolumeConvertOperandText(problem.operands[operandIndex]);
    } else {
      value.textContent = formatCompareOperand(problem, problem.operands[operandIndex]);
    }

    item.append(handle, value);

    if (interactive) {
      item.addEventListener('dragstart', handleDecimalCompareSortDragStart);
      item.addEventListener('dragend', handleDecimalCompareSortDragEnd);
      item.addEventListener('dragover', handleDecimalCompareSortDragOver);
      item.addEventListener('dragleave', handleDecimalCompareSortDragLeave);
      item.addEventListener('drop', handleDecimalCompareSortDrop);
    }

    decimalCompareSortListEl.append(item);
  });

  if (interactive) {
    const endEdge = document.createElement('div');
    endEdge.className = 'decimal-compare-sort__edge decimal-compare-sort__edge--end';
    endEdge.setAttribute('aria-hidden', 'true');
    bindDecimalCompareDropZone(endEdge, decimalCompareSortOrder.length);
    decimalCompareSortListEl.append(endEdge);
  }
}

function handleDecimalCompareSortDragStart(event) {
  const position = Number(event.currentTarget.dataset.position);
  decimalCompareDragFromIndex = position;
  event.currentTarget.classList.add('is-dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', String(position));
}

function handleDecimalCompareSortDragEnd(event) {
  event.currentTarget.classList.remove('is-dragging');
  decimalCompareDragFromIndex = null;
  clearDecimalCompareDropTargets();
}

function getDecimalCompareInsertIndexFromItemDrop(event) {
  const item = event.currentTarget;
  const position = Number(item.dataset.position);
  const bounds = item.getBoundingClientRect();
  const placeAfter = event.clientX > bounds.left + bounds.width / 2;

  return placeAfter ? position + 1 : position;
}

function handleDecimalCompareSortDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  clearDecimalCompareDropTargets();
  event.currentTarget.classList.add('is-drop-target');
}

function handleDecimalCompareSortDragLeave(event) {
  event.currentTarget.classList.remove('is-drop-target');
}

function handleDecimalCompareSortDrop(event) {
  event.preventDefault();
  const fromIndex = Number(event.dataTransfer.getData('text/plain'));
  const insertIndex = getDecimalCompareInsertIndexFromItemDrop(event);

  if (!Number.isInteger(fromIndex) || !Number.isInteger(insertIndex)) {
    return;
  }

  moveDecimalCompareSortItem(fromIndex, insertIndex);
  renderDecimalCompareSortList(currentProblem);
}

function updateDecimalCompareAnswerUi(problem) {
  const isCompare = isCompareProblem(problem);
  const usesSortOrder = usesCompareSortOrderUi(problem);
  const hidesAnswerForm = isCompare || isUnitConvertOrderProblem(problem);

  formEl.classList.toggle('answer-form--hidden', hidesAnswerForm);
  updateAnswerShapeToggleVisibility(problem);

  if (linearEquationActionsEl) {
    linearEquationActionsEl.hidden = isCompare || !isLinearEquationProblem(problem) || problem?.level < 2;
  }

  if (decimalCompareInequalityEl) {
    decimalCompareInequalityEl.hidden = !isCompare || problem?.variant !== 'sign';
  }

  if (decimalCompareSortEl) {
    decimalCompareSortEl.hidden = !usesSortOrder;
  }

  if (!isCompare && !isUnitConvertOrderProblem(problem)) {
    clearDecimalCompareSelectedSign();
    return;
  }

  if (isUnitConvertOrderProblem(problem)) {
    clearDecimalCompareSelectedSign();
    renderDecimalCompareSortList(problem);
    return;
  }

  if (!isCompare) {
    clearDecimalCompareSelectedSign();
    return;
  }

  if (problem.variant === 'sign') {
    decimalCompareInequalityButtons.forEach((button) => {
      button.classList.toggle('is-selected', button.dataset.decimalCompareSign === decimalCompareSelectedSign);
    });
    renderCompareSignProblem(problem);
    return;
  }

  clearDecimalCompareSelectedSign();
  if (decimalCompareInequalityEl) {
    decimalCompareInequalityEl.hidden = true;
  }
  renderDecimalCompareSortList(problem);
}

function getCompareUserAnswer(problem) {
  if (problem.variant === 'sign') {
    if (!decimalCompareSelectedSign) {
      return null;
    }

    return { kind: 'sign', sign: decimalCompareSelectedSign };
  }

  if (!Array.isArray(decimalCompareSortOrder) || decimalCompareSortOrder.length !== problem.operands.length) {
    return null;
  }

  return { kind: 'order', order: [...decimalCompareSortOrder] };
}

function evaluateCompareAnswer(problem, userAnswer) {
  if (problem.variant === 'sign') {
    const isCorrect = userAnswer?.kind === 'sign' && userAnswer.sign === problem.answerSign;
    return {
      isCorrect,
      feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
    };
  }

  const isCorrect = userAnswer?.kind === 'order'
    && userAnswer.order.every((value, index) => value === problem.correctOrder[index]);

  return {
    isCorrect,
    feedbackMessage: isCorrect ? 'Správně!' : 'Špatně.',
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
  if (activeExerciseMode === 'multi-mode') {
    if (multiModePhase === MULTI_MODE_PHASE.COMBINATION) {
      return createDecimalFractionMixedProblem(difficultyLevel);
    }

    return createCrossTypePoolProblem(difficultyLevel);
  }

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

  if (mode === 'linear-equation') {
    return LINEAR_EQUATION_MAX_LEVEL;
  }

  if (mode === 'linear-equation-fraction') {
    return LINEAR_EQUATION_FRACTION_MAX_LEVEL;
  }

  if (mode === 'decimal-compare') {
    return DECIMAL_COMPARE_MAX_LEVEL;
  }

  if (mode === 'integer-compare') {
    return INTEGER_COMPARE_MAX_LEVEL;
  }

  if (mode === 'non-integer-compare') {
    return NON_INTEGER_COMPARE_MAX_LEVEL;
  }

  if (mode === 'fraction-compare') {
    return FRACTION_COMPARE_MAX_LEVEL;
  }

  if (mode === 'fraction-zlomek') {
    return FRACTION_ZLOMEK_MAX_LEVEL;
  }

  if (mode === 'fraction-expand-reduce') {
    return FRACTION_EXPAND_REDUCE_MAX_LEVEL;
  }

  if (mode === 'decimal-fraction-convert') {
    return DECIMAL_FRACTION_CONVERT_MAX_LEVEL;
  }

  if (mode === 'length-convert') {
    return LENGTH_CONVERT_MAX_LEVEL;
  }

  if (mode === 'weight-convert') {
    return WEIGHT_CONVERT_MAX_LEVEL;
  }

  if (mode === 'area-convert') {
    return AREA_CONVERT_MAX_LEVEL;
  }

  if (mode === 'volume-convert') {
    return VOLUME_CONVERT_MAX_LEVEL;
  }

  if (mode === 'percent-part') {
    return PERCENT_PART_MAX_LEVEL;
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

  if (mode === 'sqrt') {
    return SQRT_MAX_LEVEL;
  }

  if (mode === 'powers-sqrt-combined') {
    return POWERS_SQRT_COMBINED_MAX_LEVEL;
  }

  if (mode === 'non-integer-powers') {
    return NON_INTEGER_POWERS_MAX_LEVEL;
  }

  if (mode === 'non-integer-sqrt') {
    return NON_INTEGER_SQRT_MAX_LEVEL;
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

function getActiveExercisePanels() {
  const panels = [];

  if (getSelectedOperations().length > 0) {
    panels.push('decimal');
  }

  if (getSelectedIntegerModes().length > 0) {
    panels.push('integer');
  }

  if (hasPowersMode() || hasSqrtMode() || hasNonIntegerPowersMode() || hasNonIntegerSqrtMode()) {
    panels.push('powers');
  }

  if (getSelectedFractionModes().length > 0) {
    panels.push('fraction');
  }

  if (hasExclusiveModeSelection()) {
    panels.push('exclusive');
  }

  return panels;
}

function buildMultiModeIndividualQueue() {
  if (hasCrossTypeSelection()) {
    return ['decimal-fraction-combined'];
  }

  const queue = [];

  if (hasPowersMode()) {
    queue.push('powers');
  }

  if (hasSqrtMode()) {
    queue.push('sqrt');
  }

  if (hasNonIntegerPowersMode()) {
    queue.push('non-integer-powers');
  }

  if (hasNonIntegerSqrtMode()) {
    queue.push('non-integer-sqrt');
  }

  const integerMode = resolveIntegerExerciseModeFromSelection();
  if (integerMode) {
    queue.push(integerMode);
  }

  if (getSelectedOperations().length > 0) {
    queue.push('decimal');
  }

  const fractionMode = resolveFractionExerciseModeFromSelection();
  if (fractionMode) {
    queue.push(fractionMode);
  }

  if (hasBasicFormMode()) {
    queue.push('basic-form');
  }

  return queue;
}

function buildMultiModeWithinPanelQueue() {
  const queue = [];

  if (hasPowersSqrtCombinedSelection()) {
    queue.push('powers');
  }

  if (hasMultipleFractionOperations()) {
    queue.push('fraction');
  }

  if (hasIntegerArithmeticCombinedModes()) {
    queue.push('integer');
  }

  if (getSelectedOperations().length > 1) {
    queue.push('decimal');
  }

  return queue;
}

function hasMultiModeCrossPanelCombination() {
  const panels = getActiveExercisePanels();

  if (panels.length < 2) {
    return false;
  }

  const hasDecimal = getSelectedOperations().length > 0;
  const hasFractionOps = getSelectedFractionOperations().length > 0;
  const hasPowersPanel = hasPowersMode() || hasSqrtMode() || hasNonIntegerPowersMode() || hasNonIntegerSqrtMode();
  const hasInteger = getSelectedIntegerModes().length > 0;

  if (hasFractionOps && hasPowersPanel) {
    return true;
  }

  if (hasDecimal && hasPowersPanel) {
    return true;
  }

  if (hasInteger && hasFractionOps) {
    return true;
  }

  if (hasInteger && hasPowersPanel) {
    return true;
  }

  if (hasDecimal && hasInteger) {
    return true;
  }

  return false;
}

function initMultiModeProgress() {
  multiModePhase = MULTI_MODE_PHASE.INDIVIDUAL;
  multiModeIndividualQueue = buildMultiModeIndividualQueue();
  multiModeWithinPanelQueue = buildMultiModeWithinPanelQueue();
  multiModeFocusedModeIndex = 0;
  multiModeCombinationUseCrossPanel = true;
  shuffledWithinPanelDeck = [];
  lastPickedWithinPanel = null;
}

function getMultiModeIndividualMaxDifficulty() {
  const queue = activeExerciseMode === 'multi-mode' && multiModeIndividualQueue.length > 0
    ? multiModeIndividualQueue
    : activeExerciseModePool;

  if (queue.length === 0) {
    return 0;
  }

  return Math.max(...queue.map(getMaxDifficultyLevelForMode));
}

function refillWithinPanelDeck() {
  shuffledWithinPanelDeck = shuffleArray(multiModeWithinPanelQueue);

  if (lastPickedWithinPanel != null
    && shuffledWithinPanelDeck.length > 1
    && shuffledWithinPanelDeck[0] === lastPickedWithinPanel) {
    shuffledWithinPanelDeck.push(shuffledWithinPanelDeck.shift());
  }
}

function pickWithinPanelForNextProblem() {
  if (shuffledWithinPanelDeck.length === 0) {
    refillWithinPanelDeck();
  }

  const panel = shuffledWithinPanelDeck.shift();
  lastPickedWithinPanel = panel;
  return panel;
}

function createMultiModeWithinPanelProblem(panel) {
  const difficultyLevel = getMultiModeIndividualMaxDifficulty();

  if (panel === 'powers') {
    return createPowersSqrtCombinedProblem(POWERS_SQRT_COMBINED_MAX_LEVEL);
  }

  if (panel === 'fraction') {
    return createFractionCombinedMixedProblem(
      getSelectedFractionOperations(),
      FRACTION_MIXED_DISPLAY_LEVEL - 1,
    );
  }

  if (panel === 'integer') {
    return createIntegerCombinedMixedProblem(
      getSelectedIntegerArithmeticOperations(),
      INTEGER_COMBINED_MAX_LEVEL - 1,
    );
  }

  const selected = getSelectedOperations();
  return createMultiOperationProblem(selected, getDecimalMaxLevelForSelection());
}

function createRandomCrossPanelPowerTerm() {
  const options = [];

  if (hasSqrtMode()) {
    options.push(() => createSqrtTerm(randomSqrtRadicand()));
  }

  if (hasPowersMode()) {
    options.push(() => createPositiveSquareTerm(randomWhole(1, POWER_SQUARE_BASE_MAX)));
    options.push(() => {
      const exponent = Math.random() < 0.5 ? 3 : 4;
      return createHighExponentTerm(randomWhole(1, POWER_HIGH_EXP_BASE_MAX), exponent, true);
    });
    options.push(() => createWrappedNegativeSquareTerm(randomWhole(1, POWER_SQUARE_BASE_MAX)));
    options.push(() => createUnaryMinusSquareTerm(randomWhole(1, POWER_SQUARE_BASE_MAX)));
    options.push(() => createRandomPowerTermForLevel4());
  }

  if (options.length === 0) {
    return createSqrtTerm(4);
  }

  return pickRandomItem(options)();
}

function crossPanelTermToRational(term) {
  if (term.kind === 'fraction') {
    return [term.num, term.den];
  }

  const value = getCombinedPowerSqrtTermValue(term);
  if (!Number.isInteger(value)) {
    return null;
  }

  return [value, 1];
}

function createCrossPanelFractionTerm() {
  const properFraction = randomProperFraction(12);
  return { kind: 'fraction', num: properFraction.num, den: properFraction.den };
}

function hasCrossPanelTermMix(terms) {
  const hasFraction = terms.some((term) => term.kind === 'fraction');
  const hasPower = terms.some((term) => term.kind !== 'fraction');
  return hasFraction && hasPower;
}

function pickCrossPanelOperators(operandCount) {
  return pickSqrtOperators(operandCount);
}

function evaluateCrossPanelMultiTermExpression(terms, operators) {
  const resolvedOperators = Array.isArray(operators)
    ? operators
    : [operators];
  const rationals = terms.map(crossPanelTermToRational);

  if (rationals.some((rational) => !rational)) {
    return null;
  }

  const result = evaluateExpressionWithOperatorPrecedence(
    rationals,
    resolvedOperators,
    (left, right, op) => {
      const [answerNum, answerDen] = combineFractions(left[0], left[1], right[0], right[1], op);

      if (answerDen === 0) {
        return null;
      }

      return [answerNum, answerDen];
    },
  );

  if (!result) {
    return null;
  }

  return { answerNum: result[0], answerDen: result[1] };
}

function isValidCrossPanelProblem(problem) {
  if (!problem) {
    return false;
  }

  if (problem.answerNum <= 0) {
    return false;
  }

  return problem.answerNum <= FRACTION_ADD_ANSWER_MAX
    && problem.answerDen <= FRACTION_ADD_ANSWER_MAX;
}

function buildCrossPanelMixedProblem(terms, operators, displayLevel) {
  const resolvedOperators = Array.isArray(operators) ? operators : [operators];
  const answer = evaluateCrossPanelMultiTermExpression(terms, resolvedOperators);

  if (!answer) {
    return null;
  }

  const problem = {
    type: 'cross-panel-mixed',
    terms,
    operators: resolvedOperators,
    answerNum: answer.answerNum,
    answerDen: answer.answerDen,
    level: displayLevel,
    isRetry: false,
  };

  return isValidCrossPanelProblem(problem) ? problem : null;
}

function createFractionPowersCrossPanelProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;
  const termCount = Math.random() < 0.5 ? 3 : 4;

  for (let attempt = 0; attempt < 300; attempt += 1) {
    const terms = [];
    const firstFromFraction = Math.random() < 0.5;
    terms.push(firstFromFraction ? createCrossPanelFractionTerm() : createRandomCrossPanelPowerTerm());
    terms.push(firstFromFraction ? createRandomCrossPanelPowerTerm() : createCrossPanelFractionTerm());

    while (terms.length < termCount) {
      terms.push(Math.random() < 0.5
        ? createCrossPanelFractionTerm()
        : createRandomCrossPanelPowerTerm());
    }

    if (Math.random() < 0.6) {
      shuffleArray(terms);
    }

    if (!hasCrossPanelTermMix(terms)) {
      continue;
    }

    const operators = pickCrossPanelOperators(terms.length);
    const problem = buildCrossPanelMixedProblem(terms, operators, displayLevel);

    if (problem) {
      return problem;
    }
  }

  return buildCrossPanelMixedProblem(
    [
      { kind: 'fraction', num: 1, den: 2 },
      createPositiveSquareTerm(2),
      { kind: 'fraction', num: 1, den: 3 },
    ],
    ['add', 'multiply'],
    displayLevel,
  );
}

function createDecimalFractionCrossPanelProblem(difficultyLevel) {
  return createDecimalFractionMixedProblem(difficultyLevel);
}

function buildMultiModeCrossPanelGenerators() {
  const maxDifficulty = getMultiModeIndividualMaxDifficulty();
  const generators = [];

  if (getSelectedFractionOperations().length > 0 && (hasPowersMode() || hasSqrtMode())) {
    generators.push(() => createFractionPowersCrossPanelProblem(maxDifficulty));
  }

  if (getSelectedOperations().length > 0 && getSelectedFractionOperations().length > 0) {
    generators.push(() => createDecimalFractionCrossPanelProblem(maxDifficulty));
  }

  return generators;
}

function createMultiModeCrossPanelProblem() {
  const generators = buildMultiModeCrossPanelGenerators();

  if (generators.length === 0) {
    throw new Error('Chybí generátor pro kombinaci režimů z různých panelů.');
  }

  return pickRandomItem(generators)();
}

function canUseMultiModeWithinPanelCombination() {
  return multiModeWithinPanelQueue.length > 0;
}

function createMultiModeCombinationProblem() {
  const canWithin = canUseMultiModeWithinPanelCombination();
  const canCross = hasMultiModeCrossPanelCombination();

  if (canWithin && canCross) {
    multiModeCombinationUseCrossPanel = !multiModeCombinationUseCrossPanel;

    if (multiModeCombinationUseCrossPanel) {
      return createMultiModeCrossPanelProblem();
    }

    return createMultiModeWithinPanelProblem(pickWithinPanelForNextProblem());
  }

  if (canCross) {
    return createMultiModeCrossPanelProblem();
  }

  return createMultiModeWithinPanelProblem(pickWithinPanelForNextProblem());
}

function getMaxDifficultyLevel() {
  if (activeExerciseMode === 'multi-mode') {
    if (activeExerciseModePool.length <= 1) {
      const mode = activeExerciseModePool[0] ?? 'decimal';
      return getMaxDifficultyLevelForMode(mode);
    }

    return getMultiModeIndividualMaxDifficulty();
  }

  return getMaxDifficultyLevelForMode(activeExerciseMode);
}

function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleArray(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function refillExerciseModeDeck() {
  shuffledExerciseModeDeck = shuffleArray(activeExerciseModePool);

  if (lastPickedExerciseMode != null
    && shuffledExerciseModeDeck.length > 1
    && shuffledExerciseModeDeck[0] === lastPickedExerciseMode) {
    shuffledExerciseModeDeck.push(shuffledExerciseModeDeck.shift());
  }
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
  if (displayLevel === 4) {
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

function integerLevelUsesPlainAddSubtractChain(displayLevel) {
  return displayLevel === 2;
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
  } else if (integerLevelUsesPlainAddSubtractChain(displayLevel)) {
    if (operators.some((operator) => operator !== 'add' && operator !== 'subtract')) {
      return false;
    }

    if (terms.some((term) => term.wrapped)) {
      return false;
    }

    for (let i = 1; i < terms.length; i += 1) {
      if (terms[i].sign < 0) {
        return false;
      }
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

function generateIntegerLevel2Terms(operandCount) {
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
        1,
        false,
      ));
    }

    const operators = Array.from({ length: operandCount - 1 }, () => (
      Math.random() < 0.5 ? 'add' : 'subtract'
    ));

    if (isValidIntegerAddSubtractProblem(terms, operators, 2)) {
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

  if (integerLevelUsesPlainAddSubtractChain(displayLevel)) {
    return generateIntegerLevel2Terms(operandCount);
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
        createIntegerTerm(6, 1),
        createIntegerTerm(8, 1),
        createIntegerTerm(3, 1),
        createIntegerTerm(5, 1),
      ],
      ['subtract', 'add', 'subtract'],
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

function createParenthesisPowerTerm(left, right, innerOperator, exponent = 2, {
  leadingNegative = false,
} = {}) {
  return {
    kind: 'parenthesis-power',
    left,
    right,
    innerOperator,
    exponent,
    leadingNegative,
  };
}

function evaluatePowerTerm(term) {
  if (term.kind === 'parenthesis-power') {
    const innerValue = term.innerOperator === 'add'
      ? term.left + term.right
      : term.left - term.right;
    const power = integerPow(innerValue, term.exponent);

    return term.leadingNegative ? -power : power;
  }

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

  if (term.kind === 'parenthesis-power') {
    return term.leadingNegative;
  }

  return term.leadingNegative || term.baseSign < 0;
}

function formatParenthesisPowerInnerText(term) {
  const operatorSymbol = formatIntegerArithmeticOperatorSymbol(term.innerOperator, false).trim();

  return `(${term.left} ${operatorSymbol} ${term.right})${formatPowerExponentText(term.exponent)}`;
}

function formatParenthesisPowerInnerHtml(term) {
  const operatorSymbol = formatIntegerArithmeticOperatorSymbol(term.innerOperator);

  return `(${term.left}<span class="problem-expression__operator">${operatorSymbol}</span>${term.right})${formatPowerExponentHtml(term.exponent)}`;
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

  if (term.kind === 'parenthesis-power') {
    let text = formatParenthesisPowerInnerText(term);

    if (term.leadingNegative) {
      text = `-${text}`;
    }

    if (powerTermNeedsParensAfterOperator(term, precedingOperator)) {
      return `(${text})`;
    }

    return text;
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

  if (term.kind === 'parenthesis-power') {
    let inner = formatParenthesisPowerInnerHtml(term);

    if (term.leadingNegative) {
      inner = `−${inner}`;
    }

    const content = powerTermNeedsParensAfterOperator(term, precedingOperator)
      ? `(${inner})`
      : inner;

    return `<span class="problem-expression__term problem-expression__power">${content}</span>`;
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

function createRandomParenthesisPowerTerm() {
  const innerOperator = Math.random() < 0.65 ? 'add' : 'subtract';
  const left = randomWhole(1, POWER_PAREN_OPERAND_MAX);
  const right = randomWhole(1, POWER_PAREN_OPERAND_MAX);

  return createParenthesisPowerTerm(left, right, innerOperator, 2);
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
        } else if (displayLevel >= 5 && Math.random() < 0.45) {
          terms.push(createRandomParenthesisPowerTerm());
        } else {
          terms.push(createRandomPowerTermForLevel4());
        }
        hasPower = true;
      } else {
        terms.push(createRandomPlainTermForPowers(displayLevel));
      }
    }

    if (requirePower && !hasPower) {
      terms[0] = displayLevel >= 5 && Math.random() < 0.45
        ? createRandomParenthesisPowerTerm()
        : (displayLevel <= 2
          ? createPositiveSquareTerm(randomWhole(1, POWER_SQUARE_BASE_MAX))
          : createRandomPowerTermForLevel4());
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

function tryCreatePowersLevel5ParenthesisPowerProblem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const powerTerm = createRandomParenthesisPowerTerm();
    const operators = [Math.random() < 0.75
      ? pickRandomItem(['multiply', 'divide'])
      : pickPowerBinaryOperator()];
    const terms = [
      powerTerm,
      createRandomPlainTermForPowers(displayLevel),
    ];
    const problem = buildPowersProblem(terms, operators, displayLevel);

    if (isValidPowersProblem(problem)) {
      return problem;
    }
  }

  return null;
}

function createPowersLevel5Problem(displayLevel) {
  if (Math.random() < 0.4) {
    const parenthesisProblem = tryCreatePowersLevel5ParenthesisPowerProblem(displayLevel);
    if (parenthesisProblem) {
      return parenthesisProblem;
    }
  }

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
      createParenthesisPowerTerm(2, 3, 'add', 2),
      createPlainPowerTerm(5),
    ],
    ['multiply'],
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

function createFractionPowerTerm(style, num, den) {
  return {
    kind: 'fraction-power',
    style,
    num,
    den,
  };
}

function createRandomFractionPowerTerm() {
  const { num, den } = randomProperFraction(12);
  const style = pickRandomItem(FRACTION_POWER_STYLES);

  if (style === 'numerator' && num * num >= den * NON_INTEGER_FRACTION_DEN_MAX) {
    return createFractionPowerTerm('whole', num, den);
  }

  return createFractionPowerTerm(style, num, den);
}

function createDecimalPowerTerm(magnitude = randomNonIntegerPowersDecimalMagnitude()) {
  return {
    kind: 'decimal-power',
    magnitude,
  };
}

function randomNonIntegerPowersDecimalMagnitude() {
  return randomWhole(
    Math.round(NON_INTEGER_POWERS_DECIMAL_MIN * 10),
    Math.round(NON_INTEGER_POWERS_DECIMAL_MAX * 10),
  ) / 10;
}

function getFractionPowerRational(term) {
  const { num, den, style } = term;

  if (style === 'whole') {
    return reduceFraction(num * num, den * den);
  }

  if (style === 'numerator') {
    return reduceFraction(num * num, den);
  }

  return reduceFraction(num, den * den);
}

function getDecimalPowerRational(term) {
  const scaled = Math.round(term.magnitude * term.magnitude * 100);
  return reduceFraction(scaled, 100);
}

function getNonIntegerPowerTermRational(term) {
  if (term.kind === 'decimal-power') {
    return getDecimalPowerRational(term);
  }

  return getFractionPowerRational(term);
}

function evaluateNonIntegerPowersRationalExpression(terms, operators, parenthesesGroup = null) {
  const applyOp = (left, right, operator) => {
    const [answerNum, answerDen] = combineFractions(
      left.num,
      left.den,
      right.num,
      right.den,
      operator,
    );

    if (answerDen === 0) {
      return null;
    }

    return reduceFraction(answerNum, answerDen);
  };

  if (terms.length === 3 && parenthesesGroup != null) {
    if (parenthesesGroup === 0) {
      const grouped = applyOp(
        getNonIntegerPowerTermRational(terms[0]),
        getNonIntegerPowerTermRational(terms[1]),
        operators[0],
      );

      if (!grouped) {
        return null;
      }

      return applyOp(grouped, getNonIntegerPowerTermRational(terms[2]), operators[1]);
    }

    const grouped = applyOp(
      getNonIntegerPowerTermRational(terms[1]),
      getNonIntegerPowerTermRational(terms[2]),
      operators[1],
    );

    if (!grouped) {
      return null;
    }

    return applyOp(getNonIntegerPowerTermRational(terms[0]), grouped, operators[0]);
  }

  const rationals = terms.map(getNonIntegerPowerTermRational);
  const result = evaluateExpressionWithOperatorPrecedence(
    rationals,
    operators,
    (left, right, operator) => applyOp(left, right, operator),
  );

  return result ?? null;
}

function rationalToDecimalAnswer(fraction, maxDecimals = 4) {
  if (fraction.den === 0) {
    return null;
  }

  const value = fraction.num / fraction.den;

  for (let decimals = 1; decimals <= maxDecimals; decimals += 1) {
    const rounded = roundToDecimals(value, decimals);

    if (Math.abs(value - rounded) < 1e-9 && valueFitsDecimalPlaces(rounded, decimals)) {
      return { answer: rounded, answerDecimals: decimals };
    }
  }

  return null;
}

function applyNonIntegerPowersAnswerToProblem(problem, terms, operators, answerKind, parenthesesGroup = null) {
  if (answerKind === 'decimal') {
    if (operators.length === 0 && terms.length === 1 && terms[0].kind === 'decimal-power') {
      const decimalAnswer = rationalToDecimalAnswer(getDecimalPowerRational(terms[0]), 2);

      if (!decimalAnswer) {
        return false;
      }

      problem.answerKind = 'decimal';
      problem.answer = decimalAnswer.answer;
      problem.answerDecimals = decimalAnswer.answerDecimals;
      return true;
    }

    const rationalAnswer = evaluateNonIntegerPowersRationalExpression(terms, operators, parenthesesGroup);

    if (!rationalAnswer) {
      return false;
    }

    const decimalAnswer = rationalToDecimalAnswer(rationalAnswer, 4);

    if (!decimalAnswer || decimalAnswer.answer <= 0) {
      return false;
    }

    problem.answerKind = 'decimal';
    problem.answer = decimalAnswer.answer;
    problem.answerDecimals = decimalAnswer.answerDecimals;
    return true;
  }

  const rationalAnswer = evaluateNonIntegerPowersRationalExpression(terms, operators, parenthesesGroup);

  if (!rationalAnswer || rationalAnswer.num <= 0 || rationalAnswer.den <= 0) {
    return false;
  }

  problem.answerKind = 'fraction';
  problem.answerNum = rationalAnswer.num;
  problem.answerDen = rationalAnswer.den;
  return true;
}

function buildNonIntegerPowersProblem(terms, operators, displayLevel, answerKind, parenthesesGroup = null) {
  const problem = {
    type: 'non-integer-powers',
    terms: terms.map((term) => ({ ...term })),
    operators: [...operators],
    answerKind,
    level: displayLevel,
    parenthesesGroup,
    isRetry: false,
  };

  if (!applyNonIntegerPowersAnswerToProblem(problem, terms, operators, answerKind, parenthesesGroup)) {
    return null;
  }

  return isValidNonIntegerPowersProblem(problem) ? problem : null;
}

function isValidNonIntegerPowersProblem(problem) {
  if (!problem) {
    return false;
  }

  if (problem.answerKind === 'decimal') {
    return problem.answer > 0
      && problem.answer <= NON_INTEGER_ANSWER_MAX
      && valueFitsDecimalPlaces(problem.answer, problem.answerDecimals);
  }

  return problem.answerNum > 0
    && problem.answerNum <= FRACTION_ADD_ANSWER_MAX
    && problem.answerDen <= FRACTION_ADD_ANSWER_MAX;
}

function formatFractionPowerTermText(term) {
  const exponentText = formatPowerExponentText(NON_INTEGER_POWERS_SQUARE);

  if (term.style === 'whole') {
    return `(${term.num}/${term.den})${exponentText}`;
  }

  if (term.style === 'numerator') {
    return `${term.num}${exponentText}/${term.den}`;
  }

  return `${term.num}/${term.den}${exponentText}`;
}

function formatMathSurdOverlaySvg() {
  return `<svg class="math-sqrt__overlay" xmlns="http://www.w3.org/2000/svg" viewBox="${MATH_SURD_VIEWBOX}" preserveAspectRatio="none" aria-hidden="true"><path d="${MATH_SURD_PATH}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="square" vector-effect="non-scaling-stroke"/></svg>`;
}

function formatMathParenLeftSvg() {
  return `<svg class="math-parens__brace" xmlns="http://www.w3.org/2000/svg" viewBox="${MATH_PAREN_VIEWBOX}" preserveAspectRatio="none" aria-hidden="true"><path d="${MATH_PAREN_LEFT_PATH}" fill="currentColor"/></svg>`;
}

function formatMathParenRightSvg() {
  return `<svg class="math-parens__brace math-parens__brace--close" xmlns="http://www.w3.org/2000/svg" viewBox="${MATH_PAREN_VIEWBOX}" preserveAspectRatio="none" aria-hidden="true"><path d="${MATH_PAREN_RIGHT_PATH}" fill="currentColor"/></svg>`;
}

function formatFractionInParensHtml(num, den) {
  return `<span class="math-parens">${formatMathParenLeftSvg()}<span class="math-parens__body">${formatSingleFractionHtml(num, den)}</span>${formatMathParenRightSvg()}</span>`;
}

function formatSqrtRadicalHtml(innerHtml, ariaLabel = '') {
  const labelAttr = ariaLabel ? ` aria-label="${escapeHtml(ariaLabel)}"` : '';

  return `<span class="math-sqrt"${labelAttr}>${formatMathSurdOverlaySvg()}<span class="math-sqrt__content">${innerHtml}</span></span>`;
}

function formatFractionPowerTermHtml(term) {
  const exponentHtml = formatPowerExponentHtml(NON_INTEGER_POWERS_SQUARE);
  const { num, den, style } = term;

  if (style === 'whole') {
    return `<span class="problem-expression__term problem-expression__power"><span class="fraction-power-whole">${formatFractionInParensHtml(num, den)}</span>${exponentHtml}</span>`;
  }

  if (style === 'numerator') {
    return `<span class="problem-expression__term problem-expression__power"><span class="fraction" aria-label="${escapeHtml(`${num} squared over ${den}`)}"><span class="fraction__num">${escapeHtml(num)}${exponentHtml}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${escapeHtml(den)}</span></span></span>`;
  }

  return `<span class="problem-expression__term problem-expression__power"><span class="fraction" aria-label="${escapeHtml(`${num} over ${den} squared`)}"><span class="fraction__num">${escapeHtml(num)}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${escapeHtml(den)}${exponentHtml}</span></span></span>`;
}

function formatDecimalPowerTermText(term) {
  return `${formatDecimal(term.magnitude, 1)}${formatPowerExponentText(NON_INTEGER_POWERS_SQUARE)}`;
}

function formatDecimalPowerTermHtml(term) {
  return `<span class="problem-expression__term problem-expression__power">${escapeHtml(formatDecimal(term.magnitude, 1))}${formatPowerExponentHtml(NON_INTEGER_POWERS_SQUARE)}</span>`;
}

function formatNonIntegerPowerTermText(term) {
  if (term.kind === 'decimal-power') {
    return formatDecimalPowerTermText(term);
  }

  return formatFractionPowerTermText(term);
}

function formatNonIntegerPowerTermHtml(term) {
  if (term.kind === 'decimal-power') {
    return formatDecimalPowerTermHtml(term);
  }

  return formatFractionPowerTermHtml(term);
}

function formatNonIntegerPowersProblemText(problem) {
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
    const a = formatNonIntegerPowerTermText(problem.terms[0]);
    const b = formatNonIntegerPowerTermText(problem.terms[1]);
    const c = formatNonIntegerPowerTermText(problem.terms[2]);
    const op1 = formatIntegerArithmeticOperatorSymbol(problem.operators[0], true);
    const op2 = formatIntegerArithmeticOperatorSymbol(problem.operators[1], true);

    if (problem.parenthesesGroup === 0) {
      return `(${a}${op1}${b})${op2}${c} =`;
    }

    return `${a}${op1}(${b}${op2}${c}) =`;
  }

  let text = formatNonIntegerPowerTermText(problem.terms[0]);
  problem.operators.forEach((operator, index) => {
    text += `${formatIntegerArithmeticOperatorSymbol(operator, true)}${formatNonIntegerPowerTermText(problem.terms[index + 1])}`;
  });

  return `${text} =`;
}

function formatNonIntegerPowersDisplayHtml(problem) {
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
    const a = formatNonIntegerPowerTermHtml(problem.terms[0]);
    const b = formatNonIntegerPowerTermHtml(problem.terms[1]);
    const c = formatNonIntegerPowerTermHtml(problem.terms[2]);
    const op1 = `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(problem.operators[0])}</span>`;
    const op2 = `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(problem.operators[1])}</span>`;
    const html = problem.parenthesesGroup === 0
      ? `(${a}${op1}${b})${op2}${c}`
      : `${a}${op1}(${b}${op2}${c})`;

    return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
  }

  let html = formatNonIntegerPowerTermHtml(problem.terms[0]);
  problem.operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(operator)}</span>${formatNonIntegerPowerTermHtml(problem.terms[index + 1])}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function pickNonIntegerPowersBinaryOperator() {
  return pickRandomItem(['add', 'subtract', 'multiply', 'divide']);
}

function pickNonIntegerPowersLevel4Operators() {
  const operators = [
    Math.random() < 0.5 ? 'add' : 'subtract',
    Math.random() < 0.5 ? 'multiply' : 'divide',
  ];

  if (Math.random() < 0.5) {
    return operators.reverse();
  }

  return operators;
}

function buildNonIntegerPowersLevel4TermKinds() {
  const kinds = ['decimal-power', 'fraction-power', Math.random() < 0.5 ? 'decimal-power' : 'fraction-power'];

  return shuffleArray(kinds);
}

function createNonIntegerPowersLevel1Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const problem = buildNonIntegerPowersProblem(
      [createRandomFractionPowerTerm()],
      [],
      displayLevel,
      'fraction',
    );

    if (problem) {
      return problem;
    }
  }

  return buildNonIntegerPowersProblem(
    [createFractionPowerTerm('whole', 2, 3)],
    [],
    displayLevel,
    'fraction',
  );
}

function createNonIntegerPowersLevel2Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const problem = buildNonIntegerPowersProblem(
      [createDecimalPowerTerm()],
      [],
      displayLevel,
      'decimal',
    );

    if (problem) {
      return problem;
    }
  }

  return buildNonIntegerPowersProblem(
    [createDecimalPowerTerm(0.3)],
    [],
    displayLevel,
    'decimal',
  );
}

function createNonIntegerPowersLevel3Problem(displayLevel) {
  const answerKind = Math.random() < 0.5 ? 'fraction' : 'decimal';

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const operator = pickNonIntegerPowersBinaryOperator();
    const terms = answerKind === 'fraction'
      ? [createRandomFractionPowerTerm(), createRandomFractionPowerTerm()]
      : [createDecimalPowerTerm(), createDecimalPowerTerm()];
    const problem = buildNonIntegerPowersProblem(terms, [operator], displayLevel, answerKind);

    if (problem) {
      return problem;
    }
  }

  if (answerKind === 'fraction') {
    return buildNonIntegerPowersProblem(
      [createFractionPowerTerm('whole', 2, 3), createFractionPowerTerm('whole', 1, 2)],
      ['add'],
      displayLevel,
      'fraction',
    );
  }

  return buildNonIntegerPowersProblem(
    [createDecimalPowerTerm(0.2), createDecimalPowerTerm(0.3)],
    ['add'],
    displayLevel,
    'decimal',
  );
}

function createNonIntegerPowersLevel4Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const operators = pickNonIntegerPowersLevel4Operators();
    const kinds = buildNonIntegerPowersLevel4TermKinds();
    const terms = kinds.map((kind) => (
      kind === 'decimal-power' ? createDecimalPowerTerm() : createRandomFractionPowerTerm()
    ));
    const isMixed = isAddOrSubtract(operators[0]) !== isAddOrSubtract(operators[1]);
    const parenthesesGroup = isMixed ? pickParenthesesGroup(operators) : null;
    const problem = buildNonIntegerPowersProblem(
      terms,
      operators,
      displayLevel,
      'fraction',
      parenthesesGroup,
    );

    if (problem) {
      return problem;
    }
  }

  return buildNonIntegerPowersProblem(
    [
      createDecimalPowerTerm(0.2),
      createFractionPowerTerm('whole', 1, 2),
      createDecimalPowerTerm(0.3),
    ],
    ['add', 'multiply'],
    displayLevel,
    'fraction',
    0,
  );
}

function createNonIntegerPowersProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 1) {
    return createNonIntegerPowersLevel1Problem(displayLevel);
  }

  if (displayLevel === 2) {
    return createNonIntegerPowersLevel2Problem(displayLevel);
  }

  if (displayLevel === 3) {
    return createNonIntegerPowersLevel3Problem(displayLevel);
  }

  return createNonIntegerPowersLevel4Problem(displayLevel);
}

function randomPerfectSquareRoot(maxRoot = 12) {
  return randomWhole(2, maxRoot);
}

function createFractionSqrtTerm(style, num, den) {
  return {
    kind: 'fraction-sqrt',
    style,
    num,
    den,
  };
}

function createRandomFractionSqrtTerm() {
  const style = pickRandomItem(FRACTION_POWER_STYLES);

  if (style === 'whole') {
    const numRoot = randomPerfectSquareRoot(11);
    const denRoot = randomWhole(numRoot + 1, 12);

    return createFractionSqrtTerm('whole', numRoot * numRoot, denRoot * denRoot);
  }

  if (style === 'numerator') {
    const numRoot = randomPerfectSquareRoot();
    const { num, den } = randomProperFraction(12);

    return createFractionSqrtTerm('numerator', numRoot * numRoot, den);
  }

  const denRoot = randomPerfectSquareRoot();
  const { num, den: _den } = randomProperFraction(12);

  return createFractionSqrtTerm('denominator', num, denRoot * denRoot);
}

function createDecimalSqrtTerm(magnitude = randomNonIntegerSqrtDecimalMagnitude()) {
  return {
    kind: 'decimal-sqrt',
    magnitude,
  };
}

function randomNonIntegerSqrtDecimalMagnitude() {
  const minRoot = Math.ceil(Math.sqrt(NON_INTEGER_SQRT_DECIMAL_MIN) * 10);
  const maxRoot = Math.floor(Math.sqrt(NON_INTEGER_SQRT_DECIMAL_MAX) * 10);
  const rootTenth = randomWhole(minRoot, maxRoot);

  return roundToDecimals((rootTenth / 10) ** 2, 2);
}

function getDecimalSqrtMagnitudeDecimals(magnitude) {
  for (let decimals = 1; decimals <= 2; decimals += 1) {
    if (valueFitsDecimalPlaces(magnitude, decimals)) {
      return decimals;
    }
  }

  return 2;
}

function getFractionSqrtRational(term) {
  const { num, den, style } = term;

  if (style === 'whole') {
    const numRoot = Math.sqrt(num);
    const denRoot = Math.sqrt(den);

    if (!Number.isInteger(numRoot) || !Number.isInteger(denRoot)) {
      return null;
    }

    return reduceFraction(numRoot, denRoot);
  }

  if (style === 'numerator') {
    const numRoot = Math.sqrt(num);

    if (!Number.isInteger(numRoot)) {
      return null;
    }

    return reduceFraction(numRoot, den);
  }

  const denRoot = Math.sqrt(den);

  if (!Number.isInteger(denRoot)) {
    return null;
  }

  return reduceFraction(num, denRoot);
}

function getDecimalSqrtRational(term) {
  const root = Math.sqrt(term.magnitude);

  if (!Number.isFinite(root) || root <= 0) {
    return null;
  }

  for (let decimals = 1; decimals <= 2; decimals += 1) {
    const scaled = Math.round(root * 10 ** decimals);

    if (Math.abs(scaled / 10 ** decimals - root) < 1e-9) {
      return reduceFraction(scaled, 10 ** decimals);
    }
  }

  return null;
}

function getNonIntegerSqrtTermRational(term) {
  if (term.kind === 'decimal-sqrt') {
    return getDecimalSqrtRational(term);
  }

  return getFractionSqrtRational(term);
}

function evaluateNonIntegerSqrtRationalExpression(terms, operators, parenthesesGroup = null) {
  const applyOp = (left, right, operator) => {
    const [answerNum, answerDen] = combineFractions(
      left.num,
      left.den,
      right.num,
      right.den,
      operator,
    );

    if (answerDen === 0) {
      return null;
    }

    return reduceFraction(answerNum, answerDen);
  };

  if (terms.length === 3 && parenthesesGroup != null) {
    if (parenthesesGroup === 0) {
      const grouped = applyOp(
        getNonIntegerSqrtTermRational(terms[0]),
        getNonIntegerSqrtTermRational(terms[1]),
        operators[0],
      );

      if (!grouped) {
        return null;
      }

      return applyOp(grouped, getNonIntegerSqrtTermRational(terms[2]), operators[1]);
    }

    const grouped = applyOp(
      getNonIntegerSqrtTermRational(terms[1]),
      getNonIntegerSqrtTermRational(terms[2]),
      operators[1],
    );

    if (!grouped) {
      return null;
    }

    return applyOp(getNonIntegerSqrtTermRational(terms[0]), grouped, operators[0]);
  }

  const rationals = terms.map(getNonIntegerSqrtTermRational);
  const result = evaluateExpressionWithOperatorPrecedence(
    rationals,
    operators,
    (left, right, operator) => applyOp(left, right, operator),
  );

  return result ?? null;
}

function applyNonIntegerSqrtAnswerToProblem(problem, terms, operators, answerKind, parenthesesGroup = null) {
  if (answerKind === 'decimal') {
    if (operators.length === 0 && terms.length === 1 && terms[0].kind === 'decimal-sqrt') {
      const rationalAnswer = getDecimalSqrtRational(terms[0]);

      if (!rationalAnswer) {
        return false;
      }

      const decimalAnswer = rationalToDecimalAnswer(rationalAnswer, 2);

      if (!decimalAnswer) {
        return false;
      }

      problem.answerKind = 'decimal';
      problem.answer = decimalAnswer.answer;
      problem.answerDecimals = decimalAnswer.answerDecimals;
      return true;
    }

    const rationalAnswer = evaluateNonIntegerSqrtRationalExpression(terms, operators, parenthesesGroup);

    if (!rationalAnswer) {
      return false;
    }

    const decimalAnswer = rationalToDecimalAnswer(rationalAnswer, 4);

    if (!decimalAnswer || decimalAnswer.answer <= 0) {
      return false;
    }

    problem.answerKind = 'decimal';
    problem.answer = decimalAnswer.answer;
    problem.answerDecimals = decimalAnswer.answerDecimals;
    return true;
  }

  const rationalAnswer = evaluateNonIntegerSqrtRationalExpression(terms, operators, parenthesesGroup);

  if (!rationalAnswer || rationalAnswer.num <= 0 || rationalAnswer.den <= 0) {
    return false;
  }

  problem.answerKind = 'fraction';
  problem.answerNum = rationalAnswer.num;
  problem.answerDen = rationalAnswer.den;
  return true;
}

function buildNonIntegerSqrtProblem(terms, operators, displayLevel, answerKind, parenthesesGroup = null) {
  const problem = {
    type: 'non-integer-sqrt',
    terms: terms.map((term) => ({ ...term })),
    operators: [...operators],
    answerKind,
    level: displayLevel,
    parenthesesGroup,
    isRetry: false,
  };

  if (!applyNonIntegerSqrtAnswerToProblem(problem, terms, operators, answerKind, parenthesesGroup)) {
    return null;
  }

  return isValidNonIntegerSqrtProblem(problem) ? problem : null;
}

function isValidNonIntegerSqrtProblem(problem) {
  if (!problem) {
    return false;
  }

  if (problem.answerKind === 'decimal') {
    return problem.answer > 0
      && problem.answer <= NON_INTEGER_ANSWER_MAX
      && valueFitsDecimalPlaces(problem.answer, problem.answerDecimals);
  }

  return problem.answerNum > 0
    && problem.answerNum <= FRACTION_ADD_ANSWER_MAX
    && problem.answerDen <= FRACTION_ADD_ANSWER_MAX;
}

function formatFractionSqrtTermText(term) {
  if (term.style === 'whole') {
    return `√(${term.num}/${term.den})`;
  }

  if (term.style === 'numerator') {
    return `√${term.num}/${term.den}`;
  }

  return `${term.num}/√${term.den}`;
}

function formatFractionSqrtTermHtml(term) {
  const { num, den, style } = term;

  if (style === 'whole') {
    return `<span class="problem-expression__term problem-expression__sqrt">${formatSqrtRadicalHtml(formatSingleFractionHtml(num, den), `odmocnina z ${num}/${den}`)}</span>`;
  }

  if (style === 'numerator') {
    return `<span class="problem-expression__term problem-expression__sqrt"><span class="fraction" aria-label="${escapeHtml(`square root of ${num} over ${den}`)}"><span class="fraction__num">${formatSqrtRadicalHtml(escapeHtml(String(num)))}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${escapeHtml(den)}</span></span></span>`;
  }

  return `<span class="problem-expression__term problem-expression__sqrt"><span class="fraction" aria-label="${escapeHtml(`${num} over square root of ${den}`)}"><span class="fraction__num">${escapeHtml(num)}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${formatSqrtRadicalHtml(escapeHtml(String(den)))}</span></span></span>`;
}

function formatDecimalSqrtTermText(term) {
  return `√${formatDecimal(term.magnitude, getDecimalSqrtMagnitudeDecimals(term.magnitude))}`;
}

function formatDecimalSqrtTermHtml(term) {
  const magnitudeText = formatDecimal(term.magnitude, getDecimalSqrtMagnitudeDecimals(term.magnitude));

  return `<span class="problem-expression__term problem-expression__sqrt">${formatSqrtRadicalHtml(escapeHtml(magnitudeText), `odmocnina z ${magnitudeText}`)}</span>`;
}

function formatNonIntegerSqrtTermText(term) {
  if (term.kind === 'decimal-sqrt') {
    return formatDecimalSqrtTermText(term);
  }

  return formatFractionSqrtTermText(term);
}

function formatNonIntegerSqrtTermHtml(term) {
  if (term.kind === 'decimal-sqrt') {
    return formatDecimalSqrtTermHtml(term);
  }

  return formatFractionSqrtTermHtml(term);
}

function formatNonIntegerSqrtProblemText(problem) {
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
    const a = formatNonIntegerSqrtTermText(problem.terms[0]);
    const b = formatNonIntegerSqrtTermText(problem.terms[1]);
    const c = formatNonIntegerSqrtTermText(problem.terms[2]);
    const op1 = formatIntegerArithmeticOperatorSymbol(problem.operators[0], true);
    const op2 = formatIntegerArithmeticOperatorSymbol(problem.operators[1], true);

    if (problem.parenthesesGroup === 0) {
      return `(${a}${op1}${b})${op2}${c} =`;
    }

    return `${a}${op1}(${b}${op2}${c}) =`;
  }

  let text = formatNonIntegerSqrtTermText(problem.terms[0]);
  problem.operators.forEach((operator, index) => {
    text += `${formatIntegerArithmeticOperatorSymbol(operator, true)}${formatNonIntegerSqrtTermText(problem.terms[index + 1])}`;
  });

  return `${text} =`;
}

function formatNonIntegerSqrtDisplayHtml(problem) {
  if (problem.terms.length === 3 && problem.parenthesesGroup != null) {
    const a = formatNonIntegerSqrtTermHtml(problem.terms[0]);
    const b = formatNonIntegerSqrtTermHtml(problem.terms[1]);
    const c = formatNonIntegerSqrtTermHtml(problem.terms[2]);
    const op1 = `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(problem.operators[0])}</span>`;
    const op2 = `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(problem.operators[1])}</span>`;
    const html = problem.parenthesesGroup === 0
      ? `(${a}${op1}${b})${op2}${c}`
      : `${a}${op1}(${b}${op2}${c})`;

    return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
  }

  let html = formatNonIntegerSqrtTermHtml(problem.terms[0]);
  problem.operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(operator)}</span>${formatNonIntegerSqrtTermHtml(problem.terms[index + 1])}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function pickNonIntegerSqrtBinaryOperator() {
  return pickRandomItem(['add', 'subtract', 'multiply', 'divide']);
}

function pickNonIntegerSqrtLevel4Operators() {
  const operators = [
    Math.random() < 0.5 ? 'add' : 'subtract',
    Math.random() < 0.5 ? 'multiply' : 'divide',
  ];

  if (Math.random() < 0.5) {
    return operators.reverse();
  }

  return operators;
}

function buildNonIntegerSqrtLevel4TermKinds() {
  const kinds = ['decimal-sqrt', 'fraction-sqrt', Math.random() < 0.5 ? 'decimal-sqrt' : 'fraction-sqrt'];

  return shuffleArray(kinds);
}

function createNonIntegerSqrtLevel1Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const problem = buildNonIntegerSqrtProblem(
      [createRandomFractionSqrtTerm()],
      [],
      displayLevel,
      'fraction',
    );

    if (problem) {
      return problem;
    }
  }

  return buildNonIntegerSqrtProblem(
    [createFractionSqrtTerm('whole', 4, 9)],
    [],
    displayLevel,
    'fraction',
  );
}

function createNonIntegerSqrtLevel2Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const problem = buildNonIntegerSqrtProblem(
      [createDecimalSqrtTerm()],
      [],
      displayLevel,
      'decimal',
    );

    if (problem) {
      return problem;
    }
  }

  return buildNonIntegerSqrtProblem(
    [createDecimalSqrtTerm(0.25)],
    [],
    displayLevel,
    'decimal',
  );
}

function createNonIntegerSqrtLevel3Problem(displayLevel) {
  const answerKind = Math.random() < 0.5 ? 'fraction' : 'decimal';

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const operator = pickNonIntegerSqrtBinaryOperator();
    const terms = answerKind === 'fraction'
      ? [createRandomFractionSqrtTerm(), createRandomFractionSqrtTerm()]
      : [createDecimalSqrtTerm(), createDecimalSqrtTerm()];
    const problem = buildNonIntegerSqrtProblem(terms, [operator], displayLevel, answerKind);

    if (problem) {
      return problem;
    }
  }

  if (answerKind === 'fraction') {
    return buildNonIntegerSqrtProblem(
      [createFractionSqrtTerm('whole', 4, 9), createFractionSqrtTerm('whole', 1, 4)],
      ['add'],
      displayLevel,
      'fraction',
    );
  }

  return buildNonIntegerSqrtProblem(
    [createDecimalSqrtTerm(0.16), createDecimalSqrtTerm(0.25)],
    ['add'],
    displayLevel,
    'decimal',
  );
}

function createNonIntegerSqrtLevel4Problem(displayLevel) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const operators = pickNonIntegerSqrtLevel4Operators();
    const kinds = buildNonIntegerSqrtLevel4TermKinds();
    const terms = kinds.map((kind) => (
      kind === 'decimal-sqrt' ? createDecimalSqrtTerm() : createRandomFractionSqrtTerm()
    ));
    const isMixed = isAddOrSubtract(operators[0]) !== isAddOrSubtract(operators[1]);
    const parenthesesGroup = isMixed ? pickParenthesesGroup(operators) : null;
    const problem = buildNonIntegerSqrtProblem(
      terms,
      operators,
      displayLevel,
      'fraction',
      parenthesesGroup,
    );

    if (problem) {
      return problem;
    }
  }

  return buildNonIntegerSqrtProblem(
    [
      createDecimalSqrtTerm(0.16),
      createFractionSqrtTerm('whole', 1, 4),
      createDecimalSqrtTerm(0.25),
    ],
    ['add', 'multiply'],
    displayLevel,
    'fraction',
    0,
  );
}

function createNonIntegerSqrtProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;

  if (displayLevel === 1) {
    return createNonIntegerSqrtLevel1Problem(displayLevel);
  }

  if (displayLevel === 2) {
    return createNonIntegerSqrtLevel2Problem(displayLevel);
  }

  if (displayLevel === 3) {
    return createNonIntegerSqrtLevel3Problem(displayLevel);
  }

  return createNonIntegerSqrtLevel4Problem(displayLevel);
}

function randomSqrtRadicand() {
  const root = randomWhole(1, SQRT_MAX_ROOT);

  return root * root;
}

function createSqrtTerm(radicand) {
  return {
    kind: 'sqrt',
    radicand,
  };
}

function getSqrtRootValue(radicand) {
  return Math.sqrt(radicand);
}

function isValidSqrtRadicand(radicand) {
  const root = getSqrtRootValue(radicand);

  return Number.isInteger(root) && root >= 1 && root < 16;
}

function getSqrtTermValue(term) {
  return getSqrtRootValue(term.radicand);
}

function evaluateSqrtExpression(terms, operators) {
  if (terms.length === 0) {
    return null;
  }

  if (operators.length === 0) {
    return getSqrtTermValue(terms[0]);
  }

  const values = terms.map(getSqrtTermValue);
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

function formatSqrtTermText(term) {
  return `√${term.radicand}`;
}

function formatSqrtTermHtml(term) {
  return `<span class="problem-expression__term problem-expression__sqrt">${formatSqrtRadicalHtml(escapeHtml(String(term.radicand)), `odmocnina z ${term.radicand}`)}</span>`;
}

function formatSqrtProblemText(problem) {
  let text = formatSqrtTermText(problem.terms[0]);

  problem.operators.forEach((operator, index) => {
    text += `${formatIntegerArithmeticOperatorSymbol(operator, true)}${formatSqrtTermText(problem.terms[index + 1])}`;
  });

  return `${text} =`;
}

function formatSqrtDisplayHtml(problem) {
  let html = formatSqrtTermHtml(problem.terms[0]);

  problem.operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(operator)}</span>${formatSqrtTermHtml(problem.terms[index + 1])}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function buildSqrtProblem(terms, operators, displayLevel) {
  return {
    type: 'sqrt',
    terms,
    operators,
    answer: evaluateSqrtExpression(terms, operators),
    level: displayLevel,
    isRetry: false,
  };
}

function isValidSqrtProblem(problem) {
  if (!problem.terms.every((term) => term.kind === 'sqrt')) {
    return false;
  }

  if (!problem.terms.every((term) => isValidSqrtRadicand(term.radicand))) {
    return false;
  }

  if (!Number.isInteger(problem.answer)) {
    return false;
  }

  if (problem.answer < SQRT_ANSWER_MIN || problem.answer > SQRT_ANSWER_MAX) {
    return false;
  }

  return true;
}

function pickSqrtOperators(operandCount) {
  if (operandCount <= 1) {
    return [];
  }

  const operators = Array.from({ length: operandCount - 1 }, () => pickRandomItem([
    'add',
    'subtract',
    'multiply',
    'divide',
  ]));

  if (operandCount >= 3) {
    if (!operators.some((operator) => isMultiplyOrDivide(operator))) {
      operators[0] = Math.random() < 0.5 ? 'multiply' : 'divide';
    }

    if (!operators.some((operator) => isAddOrSubtract(operator))) {
      operators[operators.length - 1] = Math.random() < 0.5 ? 'add' : 'subtract';
    }
  }

  return operators;
}

function generateSqrtTerms(operandCount) {
  return Array.from({ length: operandCount }, () => createSqrtTerm(randomSqrtRadicand()));
}

function createSqrtProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;
  const operandCount = displayLevel;

  if (displayLevel === 1) {
    return buildSqrtProblem([createSqrtTerm(randomSqrtRadicand())], [], displayLevel);
  }

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = generateSqrtTerms(operandCount);
    const operators = pickSqrtOperators(operandCount);
    const problem = buildSqrtProblem(terms, operators, displayLevel);

    if (isValidSqrtProblem(problem)) {
      return problem;
    }
  }

  const fallbacks = {
    2: buildSqrtProblem(
      [createSqrtTerm(4), createSqrtTerm(16)],
      ['add'],
      2,
    ),
    3: buildSqrtProblem(
      [createSqrtTerm(4), createSqrtTerm(9), createSqrtTerm(16)],
      ['add', 'add'],
      3,
    ),
    4: buildSqrtProblem(
      [createSqrtTerm(4), createSqrtTerm(9), createSqrtTerm(16), createSqrtTerm(25)],
      ['add', 'add', 'add'],
      4,
    ),
  };

  return fallbacks[displayLevel];
}

function getCombinedPowerSqrtTermValue(term) {
  if (term.kind === 'sqrt') {
    return getSqrtTermValue(term);
  }

  return getPowerTermValue(term);
}

function evaluateCombinedPowerSqrtExpression(terms, operators) {
  if (terms.length === 0) {
    return null;
  }

  if (operators.length === 0) {
    return getCombinedPowerSqrtTermValue(terms[0]);
  }

  const values = terms.map(getCombinedPowerSqrtTermValue);
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

function formatCombinedPowerSqrtTermText(term, precedingOperator = null) {
  if (term.kind === 'sqrt') {
    return formatSqrtTermText(term);
  }

  return formatPowerTermText(term, precedingOperator);
}

function formatCombinedPowerSqrtTermHtml(term, precedingOperator = null) {
  if (term.kind === 'sqrt') {
    return formatSqrtTermHtml(term);
  }

  return formatPowerTermHtml(term, precedingOperator);
}

function formatPowersSqrtCombinedProblemText(problem) {
  let text = formatCombinedPowerSqrtTermText(problem.terms[0]);

  problem.operators.forEach((operator, index) => {
    text += `${formatIntegerArithmeticOperatorSymbol(operator, true)}${formatCombinedPowerSqrtTermText(problem.terms[index + 1], operator)}`;
  });

  return `${text} =`;
}

function formatPowersSqrtCombinedDisplayHtml(problem) {
  let html = formatCombinedPowerSqrtTermHtml(problem.terms[0]);

  problem.operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(operator)}</span>${formatCombinedPowerSqrtTermHtml(problem.terms[index + 1], operator)}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
}

function buildPowersSqrtCombinedProblem(terms, operators, displayLevel) {
  return {
    type: 'powers-sqrt-combined',
    terms,
    operators,
    answer: evaluateCombinedPowerSqrtExpression(terms, operators),
    level: displayLevel,
    isRetry: false,
  };
}

function isValidCombinedPowerSqrtTerm(term) {
  if (term.kind === 'sqrt') {
    return isValidSqrtRadicand(term.radicand);
  }

  return term.kind === 'power'
    || term.kind === 'plain'
    || term.kind === 'parenthesis-power';
}

function isValidPowersSqrtCombinedProblem(problem, displayLevel) {
  if (!problem.terms.every(isValidCombinedPowerSqrtTerm)) {
    return false;
  }

  if (!Number.isInteger(problem.answer)) {
    return false;
  }

  if (problem.answer < POWER_ANSWER_MIN || problem.answer > POWER_ANSWER_MAX) {
    return false;
  }

  if (displayLevel >= 2) {
    const hasSqrt = problem.terms.some((term) => term.kind === 'sqrt');
    const hasPower = problem.terms.some((term) => term.kind !== 'sqrt');

    if (!hasSqrt || !hasPower) {
      return false;
    }
  }

  return true;
}

function createRandomCombinedPowerTerm(displayLevel) {
  if (displayLevel <= 2) {
    return createPositiveSquareTerm(randomWhole(1, POWER_SQUARE_BASE_MAX));
  }

  if (displayLevel === 3) {
    const exponent = Math.random() < 0.5 ? 3 : 4;
    const base = randomWhole(1, POWER_HIGH_EXP_BASE_MAX);
    return createHighExponentTerm(base, exponent, true);
  }

  if (displayLevel >= 5 && Math.random() < 0.45) {
    return createRandomParenthesisPowerTerm();
  }

  return createRandomPowerTermForLevel4();
}

function generateCombinedPowerSqrtTerms(displayLevel, operandCount, requireBoth = false) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = Array.from({ length: operandCount }, () => (
      Math.random() < 0.5
        ? createSqrtTerm(randomSqrtRadicand())
        : createRandomCombinedPowerTerm(displayLevel)
    ));

    if (requireBoth) {
      const hasSqrt = terms.some((term) => term.kind === 'sqrt');
      const hasPower = terms.some((term) => term.kind !== 'sqrt');

      if (!hasSqrt) {
        terms[randomWhole(0, operandCount - 1)] = createSqrtTerm(randomSqrtRadicand());
      }

      if (!hasPower) {
        const index = randomWhole(0, operandCount - 1);
        terms[index] = createRandomCombinedPowerTerm(displayLevel);
      }
    }

    return terms;
  }

  return [
    createSqrtTerm(4),
    createPositiveSquareTerm(2),
  ];
}

function createPowersSqrtCombinedProblem(difficultyLevel) {
  const displayLevel = difficultyLevel + 1;
  const operandCount = Math.min(displayLevel, 4);
  const requireBoth = displayLevel >= 2;

  if (displayLevel === 1) {
    const term = Math.random() < 0.5
      ? createSqrtTerm(randomSqrtRadicand())
      : createPositiveSquareTerm(randomWhole(1, POWER_SQUARE_BASE_MAX));

    return buildPowersSqrtCombinedProblem([term], [], displayLevel);
  }

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const terms = generateCombinedPowerSqrtTerms(displayLevel, operandCount, requireBoth);
    const operators = pickSqrtOperators(operandCount);
    const problem = buildPowersSqrtCombinedProblem(terms, operators, displayLevel);

    if (isValidPowersSqrtCombinedProblem(problem, displayLevel)) {
      return problem;
    }
  }

  const fallbacks = {
    2: buildPowersSqrtCombinedProblem(
      [createSqrtTerm(4), createPositiveSquareTerm(3)],
      ['add'],
      2,
    ),
    3: buildPowersSqrtCombinedProblem(
      [createSqrtTerm(9), createPositiveSquareTerm(2), createSqrtTerm(16)],
      ['add', 'add'],
      3,
    ),
    4: buildPowersSqrtCombinedProblem(
      [
        createSqrtTerm(4),
        createPositiveSquareTerm(2),
        createSqrtTerm(25),
        createPositiveSquareTerm(3),
      ],
      ['add', 'multiply', 'add'],
      4,
    ),
  };

  return fallbacks[displayLevel];
}

function createProblemForExerciseMode(mode, level) {
  if (mode === 'basic-form') {
    return createBasicFormProblem(level);
  }

  if (mode === 'linear-equation') {
    return createLinearEquationProblem(level);
  }

  if (mode === 'linear-equation-fraction') {
    return createLinearEquationFractionProblem(level);
  }

  if (mode === 'decimal-compare') {
    return createDecimalCompareProblem(level);
  }

  if (mode === 'integer-compare') {
    return createIntegerCompareProblem(level);
  }

  if (mode === 'non-integer-compare') {
    return createNonIntegerCompareProblem(level);
  }

  if (mode === 'fraction-compare') {
    return createFractionCompareProblem(level);
  }

  if (mode === 'fraction-zlomek') {
    return createFractionZlomekProblem(level);
  }

  if (mode === 'fraction-expand-reduce') {
    return createFractionExpandReduceProblem(level);
  }

  if (mode === 'decimal-fraction-convert') {
    return createDecimalFractionConvertProblem(level);
  }

  if (mode === 'length-convert') {
    return createLengthConvertProblem(level);
  }

  if (mode === 'weight-convert') {
    return createWeightConvertProblem(level);
  }

  if (mode === 'area-convert') {
    return createAreaConvertProblem(level);
  }

  if (mode === 'volume-convert') {
    return createVolumeConvertProblem(level);
  }

  if (mode === 'percent-part') {
    return createPercentPartProblem(level);
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

  if (mode === 'sqrt') {
    return createSqrtProblem(level);
  }

  if (mode === 'powers-sqrt-combined') {
    return createPowersSqrtCombinedProblem(level);
  }

  if (mode === 'non-integer-powers') {
    return createNonIntegerPowersProblem(level);
  }

  if (mode === 'non-integer-sqrt') {
    return createNonIntegerSqrtProblem(level);
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
    if (multiModePhase === MULTI_MODE_PHASE.INDIVIDUAL) {
      return multiModeIndividualQueue[multiModeFocusedModeIndex];
    }

    if (shuffledExerciseModeDeck.length === 0) {
      refillExerciseModeDeck();
    }

    const mode = shuffledExerciseModeDeck.shift();
    lastPickedExerciseMode = mode;
    return mode;
  }

  return activeExerciseMode;
}

function createRandomProblem(level) {
  if (activeExerciseMode === 'multi-mode') {
    if (multiModePhase === MULTI_MODE_PHASE.COMBINATION) {
      return createMultiModeCombinationProblem();
    }

    const mode = multiModeIndividualQueue[multiModeFocusedModeIndex];
    return createProblemForExerciseMode(mode, level);
  }

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

function problemCombinesPowersPanelModes(problem) {
  if (problem?.type !== 'powers-sqrt-combined' || !Array.isArray(problem.terms)) {
    return false;
  }

  const hasSqrt = problem.terms.some((term) => term.kind === 'sqrt');
  const hasPower = problem.terms.some((term) => term.kind !== 'sqrt');
  return hasSqrt && hasPower;
}

function getRegimeCombinationLevelBoost(problem) {
  if (!problem) {
    return 0;
  }

  if (problem.type === 'decimal-fraction-mixed' || problem.type === 'cross-panel-mixed') {
    return WITHIN_PANEL_COMBINATION_LEVEL_BOOST;
  }

  if (problem.type === 'fraction-mixed' || problem.type === 'integer-mixed') {
    return WITHIN_PANEL_COMBINATION_LEVEL_BOOST;
  }

  if (problemCombinesPowersPanelModes(problem)) {
    return WITHIN_PANEL_COMBINATION_LEVEL_BOOST;
  }

  return 0;
}

function getCombinationLevelBoost(problem) {
  if (activeExerciseMode === 'multi-mode') {
    if (multiModePhase === MULTI_MODE_PHASE.COMBINATION) {
      return WITHIN_PANEL_COMBINATION_LEVEL_BOOST;
    }

    return 0;
  }

  return getRegimeCombinationLevelBoost(problem);
}

function getInternalDisplayLevel(problem) {
  if (isPowerTenProblem(problem) || isDividePowerTenProblem(problem)) {
    return POWER_TEN_MULTIPLIERS.indexOf(problem.operands[1].value) + 1;
  }

  return problem.level + getCombinationLevelBoost(problem);
}

function getDisplayLevel(problem) {
  const internalLevel = getInternalDisplayLevel(problem);

  if (internalLevel > USER_VISIBLE_LEVEL_THRESHOLD) {
    return USER_VISIBLE_MAX_LEVEL;
  }

  return internalLevel;
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

function formatUnknownNumeratorFractionHtml(den) {
  return `<span class="fraction" aria-label="?/${escapeHtml(den)}"><span class="fraction__num">?</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${escapeHtml(den)}</span></span>`;
}

function formatUnknownDenominatorFractionHtml(num) {
  return `<span class="fraction" aria-label="${escapeHtml(num)}/?"><span class="fraction__num">${escapeHtml(num)}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">?</span></span>`;
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

function cloneCrossPanelTerm(term) {
  if (term.kind === 'fraction') {
    return { kind: 'fraction', num: term.num, den: term.den };
  }

  return { ...term };
}

function formatCrossPanelMixedTermText(term, precedingOperator = null) {
  if (term.kind === 'fraction') {
    return `${term.num}/${term.den}`;
  }

  return formatCombinedPowerSqrtTermText(term, precedingOperator);
}

function formatCrossPanelMixedTermHtml(term, precedingOperator = null) {
  if (term.kind === 'fraction') {
    return formatSingleFractionHtml(term.num, term.den);
  }

  return formatCombinedPowerSqrtTermHtml(term, precedingOperator);
}

function getCrossPanelMixedOperators(problem) {
  if (Array.isArray(problem.operators)) {
    return problem.operators;
  }

  return [problem.operator];
}

function formatCrossPanelMixedProblemText(problem) {
  const operators = getCrossPanelMixedOperators(problem);
  let text = formatCrossPanelMixedTermText(problem.terms[0]);

  operators.forEach((operator, index) => {
    text += `${formatIntegerArithmeticOperatorSymbol(operator, true)}${formatCrossPanelMixedTermText(problem.terms[index + 1], operator)}`;
  });

  return `${text} =`;
}

function formatCrossPanelMixedDisplayHtml(problem) {
  const operators = getCrossPanelMixedOperators(problem);
  let html = formatCrossPanelMixedTermHtml(problem.terms[0]);

  operators.forEach((operator, index) => {
    html += `<span class="problem-expression__operator">${formatIntegerArithmeticOperatorSymbol(operator)}</span>${formatCrossPanelMixedTermHtml(problem.terms[index + 1], operator)}`;
  });

  return `<span class="problem-expression">${html}<span class="problem-expression__equals">=</span></span>`;
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

  if (problem.type === 'sqrt') {
    return formatSqrtProblemText(problem);
  }

  if (problem.type === 'powers-sqrt-combined') {
    return formatPowersSqrtCombinedProblemText(problem);
  }

  if (problem.type === 'non-integer-powers') {
    return formatNonIntegerPowersProblemText(problem);
  }

  if (problem.type === 'non-integer-sqrt') {
    return formatNonIntegerSqrtProblemText(problem);
  }

  if (problem.type === 'linear-equation') {
    return formatLinearEquationProblemText(problem);
  }

  if (problem.type === 'linear-equation-fraction') {
    return formatLinearEquationFractionProblemText(problem);
  }

  if (isCompareProblem(problem)) {
    return formatCompareProblemText(problem);
  }

  if (problem.type === 'fraction-zlomek') {
    return formatFractionZlomekProblemText(problem);
  }

  if (problem.type === 'fraction-expand-reduce') {
    return formatFractionExpandReduceProblemText(problem);
  }

  if (problem.type === 'decimal-fraction-convert') {
    return formatDecimalFractionConvertProblemText(problem);
  }

  if (problem.type === 'length-convert') {
    return formatLengthConvertProblemText(problem);
  }

  if (problem.type === 'weight-convert') {
    return formatWeightConvertProblemText(problem);
  }

  if (problem.type === 'area-convert') {
    return formatAreaConvertProblemText(problem);
  }

  if (problem.type === 'volume-convert') {
    return formatVolumeConvertProblemText(problem);
  }

  if (problem.type === 'percent-part') {
    return formatPercentPartProblemText(problem);
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

  if (problem.type === 'cross-panel-mixed') {
    return formatCrossPanelMixedProblemText(problem);
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

function formatProblemDisplayHtml(problem) {
  if (problem.type === 'basic-form') {
    return formatFractionDisplayHtml(problem.givenNum, problem.givenDen);
  }

  if (problem.type === 'fraction-add') {
    return formatFractionAddDisplayHtml(problem);
  }

  if (problem.type === 'fraction-subtract') {
    return formatFractionSubtractDisplayHtml(problem);
  }

  if (problem.type === 'fraction-mixed') {
    return formatFractionMixedDisplayHtml(problem);
  }

  if (problem.type === 'fraction-multiply') {
    return formatFractionMultiplyDisplayHtml(problem);
  }

  if (problem.type === 'fraction-divide') {
    return formatFractionDivideDisplayHtml(problem);
  }

  if (problem.type === 'fraction-compound') {
    return formatCompoundFractionDisplayHtml(problem);
  }

  if (problem.type === 'decimal-fraction-mixed') {
    return formatDecimalFractionMixedDisplayHtml(problem);
  }

  if (problem.type === 'cross-panel-mixed') {
    return formatCrossPanelMixedDisplayHtml(problem);
  }

  if (isIntegerArithmeticProblem(problem)) {
    return formatIntegerArithmeticDisplayHtml(problem);
  }

  if (problem.type === 'non-integer-add-subtract') {
    return formatNonIntegerAddSubtractDisplayHtml(problem);
  }

  if (problem.type === 'non-integer-multiply-divide') {
    return formatNonIntegerMultiplyDivideDisplayHtml(problem);
  }

  if (problem.type === 'powers') {
    return formatPowersDisplayHtml(problem);
  }

  if (problem.type === 'sqrt') {
    return formatSqrtDisplayHtml(problem);
  }

  if (problem.type === 'powers-sqrt-combined') {
    return formatPowersSqrtCombinedDisplayHtml(problem);
  }

  if (problem.type === 'non-integer-powers') {
    return formatNonIntegerPowersDisplayHtml(problem);
  }

  if (problem.type === 'non-integer-sqrt') {
    return formatNonIntegerSqrtDisplayHtml(problem);
  }

  if (problem.type === 'linear-equation') {
    return formatLinearEquationDisplayHtml(problem);
  }

  if (problem.type === 'linear-equation-fraction') {
    return formatLinearEquationFractionDisplayHtml(problem);
  }

  if (isCompareProblem(problem)) {
    return formatCompareDisplayHtml(problem);
  }

  if (problem.type === 'fraction-zlomek') {
    return formatFractionZlomekDisplayHtml(problem);
  }

  if (problem.type === 'fraction-expand-reduce') {
    return formatFractionExpandReduceDisplayHtml(problem);
  }

  if (problem.type === 'decimal-fraction-convert') {
    return formatDecimalFractionConvertDisplayHtml(problem);
  }

  if (problem.type === 'length-convert') {
    return formatLengthConvertDisplayHtml(problem);
  }

  if (problem.type === 'weight-convert') {
    return formatWeightConvertDisplayHtml(problem);
  }

  if (problem.type === 'area-convert') {
    return formatAreaConvertDisplayHtml(problem);
  }

  if (problem.type === 'volume-convert') {
    return formatVolumeConvertDisplayHtml(problem);
  }

  if (problem.type === 'percent-part') {
    return formatPercentPartDisplayHtml(problem);
  }

  return `<span class="problem-expression problem-expression--plain">${escapeHtml(formatProblemText(problem))}</span>`;
}

function createSessionResultEntry(odpoved, spravne, isCorrect) {
  return {
    uloha: formatProblemText(currentProblem),
    ulohaHtml: formatProblemDisplayHtml(currentProblem),
    uroven: getDisplayLevel(currentProblem),
    odpoved,
    spravne,
    vysledek: isCorrect ? 'správně' : 'špatně',
  };
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

    sessionResults.push(createSessionResultEntry(
      odpoved,
      formatFraction(currentProblem.answerNum, currentProblem.answerDen),
      isCorrect,
    ));
    return;
  }

  if (isIntegerArithmeticProblem(currentProblem) || isPowersProblem(currentProblem) || isSqrtProblem(currentProblem) || isPowersSqrtCombinedProblem(currentProblem)) {
    sessionResults.push(createSessionResultEntry(
      formatIntegerAnswer(userAnswer),
      formatIntegerAnswer(currentProblem.answer),
      isCorrect,
    ));
    return;
  }

  if (isLinearEquationProblem(currentProblem)) {
    sessionResults.push(createSessionResultEntry(
      formatLinearEquationSessionAnswer(userAnswer),
      getLinearEquationCorrectAnswerLabel(currentProblem),
      isCorrect,
    ));
    return;
  }

  if (isCompareProblem(currentProblem)) {
    sessionResults.push(createSessionResultEntry(
      formatCompareSessionAnswer(currentProblem, userAnswer),
      formatCompareCorrectAnswer(currentProblem),
      isCorrect,
    ));
    return;
  }

  if (isFractionZlomekProblem(currentProblem)) {
    sessionResults.push(createSessionResultEntry(
      formatFractionZlomekSessionAnswer(userAnswer, currentProblem),
      formatFractionZlomekCorrectAnswer(currentProblem),
      isCorrect,
    ));
    return;
  }

  if (isFractionExpandReduceProblem(currentProblem)) {
    sessionResults.push(createSessionResultEntry(
      formatIntegerAnswer(userAnswer),
      formatIntegerAnswer(currentProblem.answer),
      isCorrect,
    ));
    return;
  }

  if (isDecimalFractionConvertProblem(currentProblem)) {
    if (currentProblem.answerKind === 'fraction') {
      sessionResults.push(createSessionResultEntry(
        formatFraction(userAnswer.num, userAnswer.den),
        formatFraction(currentProblem.answerNum, currentProblem.answerDen),
        isCorrect,
      ));
      return;
    }

    sessionResults.push(createSessionResultEntry(
      formatDecimal(userAnswer, currentProblem.answerDecimals),
      formatDecimal(currentProblem.answer, currentProblem.answerDecimals),
      isCorrect,
    ));
    return;
  }

  if (isLengthConvertProblem(currentProblem)) {
    if (currentProblem.variant === 'convert') {
      sessionResults.push(createSessionResultEntry(
        formatDecimal(userAnswer, currentProblem.answerDecimals),
        formatDecimal(currentProblem.answer, currentProblem.answerDecimals),
        isCorrect,
      ));
      return;
    }

    sessionResults.push(createSessionResultEntry(
      formatLengthConvertOrderListText(currentProblem, userAnswer.order),
      formatLengthConvertOrderListText(currentProblem, currentProblem.correctOrder),
      isCorrect,
    ));
    return;
  }

  if (isWeightConvertProblem(currentProblem)) {
    if (currentProblem.variant === 'convert') {
      sessionResults.push(createSessionResultEntry(
        formatDecimal(userAnswer, currentProblem.answerDecimals),
        formatDecimal(currentProblem.answer, currentProblem.answerDecimals),
        isCorrect,
      ));
      return;
    }

    sessionResults.push(createSessionResultEntry(
      formatWeightConvertOrderListText(currentProblem, userAnswer.order),
      formatWeightConvertOrderListText(currentProblem, currentProblem.correctOrder),
      isCorrect,
    ));
    return;
  }

  if (isAreaConvertProblem(currentProblem)) {
    if (currentProblem.variant === 'convert') {
      sessionResults.push(createSessionResultEntry(
        formatDecimal(userAnswer, currentProblem.answerDecimals),
        formatDecimal(currentProblem.answer, currentProblem.answerDecimals),
        isCorrect,
      ));
      return;
    }

    sessionResults.push(createSessionResultEntry(
      formatAreaConvertOrderListText(currentProblem, userAnswer.order),
      formatAreaConvertOrderListText(currentProblem, currentProblem.correctOrder),
      isCorrect,
    ));
    return;
  }

  if (isVolumeConvertProblem(currentProblem)) {
    if (currentProblem.variant === 'convert') {
      sessionResults.push(createSessionResultEntry(
        formatDecimal(userAnswer, currentProblem.answerDecimals),
        formatDecimal(currentProblem.answer, currentProblem.answerDecimals),
        isCorrect,
      ));
      return;
    }

    sessionResults.push(createSessionResultEntry(
      formatVolumeConvertOrderListText(currentProblem, userAnswer.order),
      formatVolumeConvertOrderListText(currentProblem, currentProblem.correctOrder),
      isCorrect,
    ));
    return;
  }

  if (isPercentPartProblem(currentProblem)) {
    sessionResults.push(createSessionResultEntry(
      formatDecimal(userAnswer, currentProblem.answerDecimals),
      formatDecimal(currentProblem.answer, currentProblem.answerDecimals),
      isCorrect,
    ));
    return;
  }

  if (currentProblem?.type === 'non-integer-add-subtract') {
    if (isNumberAnswerInputShape()) {
      sessionResults.push(createSessionResultEntry(
        getNonIntegerAnswerKind(currentProblem) === 'decimal'
          ? formatDecimal(userAnswer, 1)
          : formatDecimal(
            userAnswer,
            getFractionAnswerDecimals(currentProblem.answerNum, currentProblem.answerDen),
          ),
        getNonIntegerAnswerKind(currentProblem) === 'decimal'
          ? formatDecimal(currentProblem.answer, 1)
          : formatSignedFractionText({
            num: currentProblem.answerNum,
            den: currentProblem.answerDen,
            negative: currentProblem.answerNegative,
          }),
        isCorrect,
      ));
      return;
    }

    const userFraction = userAnswer;
    sessionResults.push(createSessionResultEntry(
      formatSignedFractionText(userFraction),
      formatSignedFractionText({
        num: currentProblem.answerNum,
        den: currentProblem.answerDen,
        negative: currentProblem.answerNegative,
      }),
      isCorrect,
    ));
    return;
  }

  if (currentProblem?.type === 'non-integer-multiply-divide') {
    if (isNumberAnswerInputShape()) {
      sessionResults.push(createSessionResultEntry(
        formatDecimal(
          userAnswer,
          getFractionAnswerDecimals(currentProblem.answerNum, currentProblem.answerDen),
        ),
        formatSignedFractionText({
          num: currentProblem.answerNum,
          den: currentProblem.answerDen,
          negative: currentProblem.answerNegative,
        }),
        isCorrect,
      ));
      return;
    }

    sessionResults.push(createSessionResultEntry(
      formatSignedFractionText(userAnswer),
      formatSignedFractionText({
        num: currentProblem.answerNum,
        den: currentProblem.answerDen,
        negative: currentProblem.answerNegative,
      }),
      isCorrect,
    ));
    return;
  }

  if (currentProblem?.type === 'non-integer-powers' || currentProblem?.type === 'non-integer-sqrt') {
    const correctFraction = currentProblem.type === 'non-integer-powers'
      ? getNonIntegerPowersCorrectFraction(currentProblem)
      : getNonIntegerSqrtCorrectFraction(currentProblem);

    if (isNumberAnswerInputShape()) {
      sessionResults.push(createSessionResultEntry(
        currentProblem.answerKind === 'decimal'
          ? formatDecimal(userAnswer, currentProblem.answerDecimals)
          : formatDecimal(
            userAnswer,
            getFractionAnswerDecimals(correctFraction.num, correctFraction.den),
          ),
        currentProblem.answerKind === 'decimal'
          ? formatDecimal(currentProblem.answer, currentProblem.answerDecimals)
          : formatFraction(correctFraction.num, correctFraction.den),
        isCorrect,
      ));
      return;
    }

    sessionResults.push(createSessionResultEntry(
      formatFraction(userAnswer.num, userAnswer.den),
      formatFraction(correctFraction.num, correctFraction.den),
      isCorrect,
    ));
    return;
  }

  sessionResults.push(createSessionResultEntry(
    isNumberAnswerInputShape()
      ? formatDecimal(userAnswer, currentProblem.answerDecimals)
      : formatFraction(userAnswer.num, userAnswer.den),
    formatDecimal(currentProblem.answer, currentProblem.answerDecimals),
    isCorrect,
  ));
}

function updateExerciseStatsUi() {
  const total = sessionResults.length;
  const correct = sessionResults.filter((row) => row.vysledek === 'správně').length;
  const wrong = total - correct;
  const limit = getAssignmentProblemLimit();

  exerciseStatsTotalEl.textContent = limit !== null
    ? `${total} / ${limit}`
    : String(total);
  exerciseStatsCorrectEl.textContent = String(correct);
  exerciseStatsWrongEl.textContent = String(wrong);
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

  exclusiveModeRadios.forEach((radio) => {
    if (radio.checked) {
      modes.push(getCheckboxLabel(radio));
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

  const levelSum = sessionResults.reduce((sum, row) => sum + row.uroven, 0);

  return {
    total: sessionResults.length,
    correct,
    byLevel,
    averageLevel: sessionResults.length > 0 ? levelSum / sessionResults.length : null,
  };
}

function formatSuccessRate(correct, total) {
  if (total === 0) {
    return '0/0 (0 %)';
  }

  const percent = Math.round((correct / total) * 100);
  return `${correct}/${total} (${percent} %)`;
}

function formatAverageLevel(averageLevel) {
  if (averageLevel == null) {
    return '—';
  }

  return averageLevel.toFixed(1).replace('.', ',');
}

function splitLinearEquationFractionSideTerms(side) {
  const parts = [];
  let depth = 0;
  let start = 0;
  let pendingOp = '+';

  for (let index = 0; index < side.length; index += 1) {
    const char = side[index];

    if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      depth -= 1;
    } else if (depth === 0 && side.slice(index, index + 3) === ' + ') {
      parts.push({ op: pendingOp, text: side.slice(start, index).trim() });
      pendingOp = '+';
      start = index + 3;
      index += 2;
    } else if (depth === 0 && side.slice(index, index + 3) === ' − ') {
      parts.push({ op: pendingOp, text: side.slice(start, index).trim() });
      pendingOp = '−';
      start = index + 3;
      index += 2;
    }
  }

  parts.push({ op: pendingOp, text: side.slice(start).trim() });
  return parts.filter((part) => part.text !== '');
}

function formatLinearEquationFractionTermFromUloha(termText) {
  const trimmed = termText.trim();

  if (/^-?\d+$/.test(trimmed)) {
    return `<span class="problem-expression__term">${escapeHtml(trimmed)}</span>`;
  }

  const fractionMatch = trimmed.match(/^(.+)\/(\d+)$/);
  if (!fractionMatch) {
    return null;
  }

  const numText = fractionMatch[1];
  const den = fractionMatch[2];
  const ariaLabel = `${numText}/${den}`;

  return `<span class="fraction" aria-label="${escapeHtml(ariaLabel)}"><span class="fraction__num">${escapeHtml(numText)}</span><span class="fraction__bar" aria-hidden="true"></span><span class="fraction__den">${escapeHtml(den)}</span></span>`;
}

function formatLinearEquationFractionSideFromUloha(side) {
  let text = side.trim();

  if (text === '') {
    return '';
  }

  let leadingNegative = false;
  if (text.startsWith('−')) {
    leadingNegative = true;
    text = text.slice(1).trim();
  }

  const terms = splitLinearEquationFractionSideTerms(text);
  if (leadingNegative && terms.length > 0) {
    terms[0].op = '−';
  }

  return terms.map((term, index) => {
    const termHtml = formatLinearEquationFractionTermFromUloha(term.text);
    if (!termHtml) {
      return null;
    }

    if (index === 0) {
      return term.op === '−'
        ? `<span class="problem-expression__term">−</span>${termHtml}`
        : termHtml;
    }

    return `<span class="problem-expression__operator">${term.op}</span>${termHtml}`;
  }).filter(Boolean).join('');
}

function formatLinearEquationFractionUlohaHtml(uloha) {
  const equalsIndex = uloha.indexOf(' = ');
  if (equalsIndex === -1) {
    return null;
  }

  const leftHtml = formatLinearEquationFractionSideFromUloha(uloha.slice(0, equalsIndex));
  const rightHtml = formatLinearEquationFractionSideFromUloha(uloha.slice(equalsIndex + 3));

  if (!leftHtml || !rightHtml) {
    return null;
  }

  return `<span class="problem-expression problem-expression--linear-equation">${leftHtml}<span class="problem-expression__equals">=</span>${rightHtml}</span>`;
}

function reconstructAnalysisProblemHtml(uloha, modes = []) {
  const isLinearEquationFractionMode = modes.some((mode) => mode === LINEAR_EQUATION_FRACTION_APP_TITLE
    || mode === 'Lineární rovnice se zlomky'
    || mode === 'linear-equation-fraction');

  if (isLinearEquationFractionMode || /\bx\b/.test(uloha)) {
    const html = formatLinearEquationFractionUlohaHtml(uloha);
    if (html) {
      return html;
    }
  }

  return '';
}

function buildAnalysisSharePayload() {
  return {
    n: getAnalysisName(),
    m: sessionSelectedModes,
    r: sessionResults.map((row) => {
      const entry = [
        row.uloha,
        row.uroven,
        row.odpoved,
        row.spravne,
        row.vysledek === 'správně' ? 1 : 0,
      ];

      if (row.ulohaHtml) {
        entry.push(row.ulohaHtml);
      }

      return entry;
    }),
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

      const uloha = String(row[0]);
      const modes = Array.isArray(parsed.m) ? parsed.m.map((mode) => String(mode)) : [];

      return {
        uloha,
        uroven: Number(row[1]),
        odpoved: String(row[2]),
        spravne: String(row[3]),
        vysledek: row[4] ? 'správně' : 'špatně',
        ulohaHtml: typeof row[5] === 'string' && row[5] !== ''
          ? row[5]
          : reconstructAnalysisProblemHtml(uloha, modes),
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

function getAssignmentIdFromUrl() {
  const match = location.hash.match(/^#u=(.+)$/);
  if (!match || !ANALYSIS_ID_PATTERN.test(match[1])) {
    return null;
  }

  return match[1];
}

function buildAssignmentShareUrl(id) {
  return `${location.origin}${location.pathname}${location.search}#u=${id}`;
}

function getDepotIdFromUrl() {
  const match = location.hash.match(/^#d=(.+)$/);
  if (!match || !ANALYSIS_ID_PATTERN.test(match[1])) {
    return null;
  }

  return match[1];
}

function buildDepotShareUrl(id) {
  return `${location.origin}${location.pathname}${location.search}#d=${id}`;
}

function formatDepotTimestamp(iso) {
  return new Date(iso).toLocaleString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function summarizeStoredAnalysisPayload(payload) {
  try {
    const parsed = parseAnalysisSharePayload(payload);
    const stats = parsed.results.reduce((acc, row) => {
      acc.total += 1;
      if (row.vysledek === 'správně') {
        acc.correct += 1;
      }
      return acc;
    }, { correct: 0, total: 0 });

    const levelSum = parsed.results.reduce((sum, row) => sum + row.uroven, 0);
    const averageLevel = parsed.results.length > 0 ? levelSum / parsed.results.length : null;

    return {
      name: parsed.name,
      successRate: formatSuccessRate(stats.correct, stats.total),
      averageLevel: formatAverageLevel(averageLevel),
    };
  } catch {
    return {
      name: '',
      successRate: '—',
      averageLevel: '—',
    };
  }
}

async function createAssignmentDepot() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('missing-config');
  }

  const { data, error } = await supabase
    .from('analyses')
    .insert({ payload: { t: 'depot' } })
    .select('id')
    .single();

  if (error || !data?.id) {
    throw new Error('depot-save-failed');
  }

  return data.id;
}

async function saveAssignmentSubmission(depotId, analysisId) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('missing-config');
  }

  const { error } = await supabase
    .from('analyses')
    .insert({
      payload: {
        t: 'submission',
        d: depotId,
        a: analysisId,
      },
    });

  if (error) {
    throw new Error('submission-save-failed');
  }
}

async function loadDepotSubmissions(depotId) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('missing-config');
  }

  const { data: markers, error } = await supabase
    .from('analyses')
    .select('id, created_at, payload')
    .eq('payload->>t', 'submission')
    .eq('payload->>d', depotId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('load-failed');
  }

  if (!markers?.length) {
    return [];
  }

  const analysisIds = markers
    .map((row) => row.payload?.a)
    .filter((id) => typeof id === 'string' && ANALYSIS_ID_PATTERN.test(id));

  const analysesById = new Map();

  if (analysisIds.length > 0) {
    const { data: analyses, error: analysesError } = await supabase
      .from('analyses')
      .select('id, payload')
      .in('id', analysisIds);

    if (analysesError) {
      throw new Error('load-failed');
    }

    (analyses ?? []).forEach((row) => {
      analysesById.set(row.id, row.payload);
    });
  }

  return markers.map((marker) => ({
    id: marker.id,
    created_at: marker.created_at,
    analysis_id: marker.payload?.a ?? null,
    analysis_payload: analysesById.get(marker.payload?.a) ?? null,
  }));
}

async function loadDepotRecord(depotId) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('missing-config');
  }

  const { data, error } = await supabase
    .from('analyses')
    .select('payload')
    .eq('id', depotId)
    .single();

  if (error || data?.payload?.t !== 'depot') {
    throw new Error('load-failed');
  }

  return data;
}

async function copyShareLinkToInput(inputEl, feedbackEl, url, successMessage) {
  if (!inputEl || !url) {
    return false;
  }

  inputEl.value = url;

  try {
    await navigator.clipboard.writeText(url);
    if (feedbackEl) {
      feedbackEl.textContent = successMessage;
      feedbackEl.hidden = false;
    }
    return true;
  } catch {
    if (feedbackEl) {
      feedbackEl.textContent = 'Odkaz vytvořen – zkopíruj ho ikonou vedle pole.';
      feedbackEl.hidden = false;
    }
    return false;
  }
}

function getAssignmentProblemCount() {
  const value = Number(assignmentCountInputEl?.value);
  if (!Number.isFinite(value)) {
    return NaN;
  }

  return Math.trunc(value);
}

function buildAssignmentSharePayload() {
  return {
    t: 'assignment',
    n: '',
    c: getAssignmentProblemCount(),
    r: isRequireBasicFormEnabledInSetup(),
    o: [...operationCheckboxes]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value),
    i: [...integerModeCheckboxes]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value),
    p: [...powersModeCheckboxes]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value),
    f: [...fractionModeCheckboxes]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value),
    e: [...exclusiveModeRadios].find((radio) => radio.checked)?.value ?? null,
  };
}

function parseAssignmentSharePayload(data) {
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;
  if (!parsed || parsed.t !== 'assignment') {
    throw new Error('Neplatný úkol.');
  }

  const count = Number(parsed.c);
  if (!Number.isInteger(count) || count < 1 || count > 200) {
    throw new Error('Neplatný úkol.');
  }

  return {
    name: typeof parsed.n === 'string' ? parsed.n : '',
    count,
    depotId: typeof parsed.d === 'string' && ANALYSIS_ID_PATTERN.test(parsed.d) ? parsed.d : null,
    requireBasicForm: parsed.r !== false,
    operations: Array.isArray(parsed.o) ? parsed.o.map(String) : [],
    integerModes: Array.isArray(parsed.i) ? parsed.i.map(String) : [],
    powersModes: Array.isArray(parsed.p) ? parsed.p.map(String) : [],
    fractionModes: Array.isArray(parsed.f) ? parsed.f.map(String) : [],
    exclusiveMode: typeof parsed.e === 'string' && parsed.e !== '' ? parsed.e : null,
  };
}

function isAssignmentExercise() {
  return activeAssignmentConfig !== null;
}

function getAssignmentProblemLimit() {
  return activeAssignmentConfig?.count ?? null;
}

function captureSessionModeSelectionFromAssignment(config) {
  const modes = [];
  const addLabels = (inputs, values) => {
    inputs.forEach((input) => {
      if (values.includes(input.value)) {
        modes.push(getCheckboxLabel(input));
      }
    });
  };

  addLabels([...operationCheckboxes], config.operations);
  addLabels([...integerModeCheckboxes], config.integerModes);
  addLabels([...powersModeCheckboxes], config.powersModes);
  addLabels([...fractionModeCheckboxes], config.fractionModes);

  if (config.exclusiveMode) {
    const radio = [...exclusiveModeRadios].find((item) => item.value === config.exclusiveMode);
    if (radio) {
      modes.push(getCheckboxLabel(radio));
    }
  }

  return modes;
}

async function saveAssignmentToSupabase(payload = buildAssignmentSharePayload()) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('missing-config');
  }

  const { data, error } = await supabase
    .from('analyses')
    .insert({ payload })
    .select('id')
    .single();

  if (error || !data?.id) {
    throw new Error('save-failed');
  }

  return data.id;
}

async function loadAssignmentFromSupabase(id) {
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

  return parseAssignmentSharePayload(data.payload);
}

async function createAssignmentLink() {
  const blockReason = getSetupStartBlockReason();
  if (blockReason !== '') {
    assignmentLinkFeedbackEl.textContent = blockReason;
    assignmentLinkFeedbackEl.classList.add('analysis__link-feedback--error');
    assignmentLinkFeedbackEl.hidden = false;
    return;
  }

  if (!isSupabaseConfigured()) {
    assignmentLinkFeedbackEl.textContent = getSupabaseConfigHelpMessage();
    assignmentLinkFeedbackEl.classList.add('analysis__link-feedback--error');
    assignmentLinkFeedbackEl.hidden = false;
    return;
  }

  assignmentLinkFeedbackEl.classList.remove('analysis__link-feedback--error');
  startBtn.disabled = true;
  assignmentLinkFeedbackEl.textContent = 'Ukládám úkol…';
  assignmentLinkFeedbackEl.hidden = false;
  assignmentLinkWrapEl.hidden = true;
  hideAssignmentLinkQrCode();
  if (assignmentDepotLinkWrapEl) {
    assignmentDepotLinkWrapEl.hidden = true;
  }

  try {
    const depotId = await createAssignmentDepot();
    const payload = {
      ...buildAssignmentSharePayload(),
      d: depotId,
    };
    const id = await saveAssignmentToSupabase(payload);
    const url = buildAssignmentShareUrl(id);
    assignmentLinkInputEl.value = url;
    assignmentLinkWrapEl.hidden = false;

    if (assignmentDepotLinkInputEl && assignmentDepotLinkWrapEl) {
      assignmentDepotLinkInputEl.value = buildDepotShareUrl(depotId);
      assignmentDepotLinkWrapEl.hidden = false;
    }

    const copied = await copyShareLinkToInput(
      assignmentLinkInputEl,
      assignmentLinkFeedbackEl,
      url,
      'Úkol vytvořen. Odkaz na úkol zkopírován – depozitář je níže.',
    );
    if (!copied) {
      assignmentLinkFeedbackEl.textContent = 'Úkol vytvořen – zkopíruj odkazy ikonami vedle polí.';
    }
    assignmentLinkFeedbackEl.hidden = false;
    setAssignmentCountInputLocked(true);
  } catch (error) {
    if (error.message === 'missing-config') {
      assignmentLinkFeedbackEl.textContent = getSupabaseConfigHelpMessage();
    } else {
      assignmentLinkFeedbackEl.textContent = 'Úkol se nepodařilo uložit. Zkus to znovu.';
    }
    assignmentLinkFeedbackEl.classList.add('analysis__link-feedback--error');
    assignmentLinkFeedbackEl.hidden = false;
  } finally {
    startBtn.disabled = getSetupStartBlockReason() !== '';
  }
}

async function loadAssignmentFromUrl() {
  const id = getAssignmentIdFromUrl();
  if (!id) {
    return false;
  }

  try {
    const config = await loadAssignmentFromSupabase(id);
    activeAssignmentConfig = config;
    startAssignmentExercise();
    return true;
  } catch (error) {
    return false;
  }
}

async function submitAssignmentToDepot() {
  const depotId = pendingAssignmentDepotId;
  if (!depotId || !canUseAnalysisLinkButton()) {
    return;
  }

  if (getAnalysisName() === '') {
    analysisLinkFeedbackEl.textContent = 'Pro odevzdání úkolu je potřeba nejprve vyplnit jméno.';
    analysisLinkFeedbackEl.classList.add('analysis__link-feedback--error');
    analysisLinkFeedbackEl.hidden = false;
    analysisNameInputEl.focus();
    return;
  }

  if (!isSupabaseConfigured()) {
    analysisLinkFeedbackEl.textContent = 'Úkol se nepodařilo odevzdat – Supabase není nakonfigurované.';
    analysisLinkFeedbackEl.classList.add('analysis__link-feedback--error');
    analysisLinkFeedbackEl.hidden = false;
    return;
  }

  analysisLinkFeedbackEl.classList.remove('analysis__link-feedback--error');
  analysisLinkFeedbackEl.textContent = 'Odevzdávám úkol…';
  analysisLinkFeedbackEl.hidden = false;
  analysisLinkBtn.disabled = true;
  hideAnalysisLinkUi();

  try {
    const analysisId = await saveAnalysisToSupabase();
    await saveAssignmentSubmission(depotId, analysisId);
    pendingAssignmentDepotId = null;
    awaitingAssignmentSubmission = false;
    location.hash = `a=${analysisId}`;
    analysisLinkInputEl.value = buildAnalysisShareUrl(analysisId);
    analysisLinkWrapEl.hidden = false;

    const copied = await copyAnalysisLinkToClipboard('Úkol odevzdán do depozitáře a odkaz zkopírován do schránky.');
    if (!copied) {
      analysisLinkFeedbackEl.textContent = 'Úkol odevzdán do depozitáře – zkopíruj odkaz ikonou vedle pole.';
      analysisLinkFeedbackEl.hidden = false;
    }
  } catch (error) {
    if (error.message === 'missing-config') {
      analysisLinkFeedbackEl.textContent = getSupabaseConfigHelpMessage();
    } else {
      analysisLinkFeedbackEl.textContent = 'Úkol se nepodařilo odevzdat do depozitáře.';
    }
    analysisLinkFeedbackEl.classList.add('analysis__link-feedback--error');
    analysisLinkFeedbackEl.hidden = false;
  } finally {
    updateAnalysisLinkButton();
    updateAnalysisNameField();
  }
}

function renderDepotTableHead() {
  return `<thead>
    <tr>
      <th>Čas</th>
      <th>Jméno</th>
      <th>Úspěšnost</th>
      <th class="num">Prům. úroveň</th>
      <th>Analýza</th>
    </tr>
  </thead>`;
}

function renderDepot(submissions) {
  if (!depotTableWrapEl || !depotEmptyEl) {
    return;
  }

  if (submissions.length === 0) {
    depotTableWrapEl.hidden = true;
    depotTableWrapEl.innerHTML = '';
    depotEmptyEl.textContent = 'Zatím nebyl odevzdáný žádný úkol.';
    depotEmptyEl.hidden = false;
    return;
  }

  depotEmptyEl.hidden = true;
  depotTableWrapEl.hidden = false;
  const rows = submissions.map((submission) => {
    const summary = summarizeStoredAnalysisPayload(submission.analysis_payload);
    const name = summary.name.trim() !== '' ? summary.name : '—';

    return `<tr>
      <td>${escapeHtml(formatDepotTimestamp(submission.created_at))}</td>
      <td>${escapeHtml(name)}</td>
      <td>${escapeHtml(summary.successRate)}</td>
      <td class="num">${escapeHtml(summary.averageLevel)}</td>
      <td>${submission.analysis_id
        ? `<a class="depot__analysis-link" href="#a=${escapeHtml(submission.analysis_id)}">Otevřít</a>`
        : '—'}</td>
    </tr>`;
  }).join('');

  depotTableWrapEl.innerHTML = `<table class="depot__table">${renderDepotTableHead()}<tbody>${rows}</tbody></table>`;
}

async function refreshDepotScreen() {
  if (!activeDepotId) {
    return;
  }

  try {
    const submissions = await loadDepotSubmissions(activeDepotId);
    renderDepot(submissions);
  } catch {
    depotTableWrapEl.hidden = true;
    depotEmptyEl.hidden = false;
    depotEmptyEl.textContent = 'Depozitář se nepodařilo načíst.';
  }
}

function showDepotScreen() {
  hideAllScreens();
  depotScreenEl.hidden = false;
  appEl.classList.remove('app--exercise', 'app--decimal-fraction-convert', 'app--length-convert', 'app--weight-convert', 'app--area-convert', 'app--volume-convert', 'app--percent-part', 'app--fraction-expand-reduce');
  appEl.classList.add('app--wide');
  updateTitle();
}

async function loadDepotFromUrl() {
  const id = getDepotIdFromUrl();
  if (!id) {
    return false;
  }

  try {
    await loadDepotRecord(id);
    const submissions = await loadDepotSubmissions(id);
    activeDepotId = id;
    showDepotScreen();
    renderDepot(submissions);
    return true;
  } catch {
    activeDepotId = null;
    return false;
  }
}

function startAssignmentExercise() {
  const resolvedMode = resolveActiveExerciseMode();
  if (resolvedMode === null || !activeAssignmentConfig) {
    activeAssignmentConfig = null;
    showSetupScreen({ preserveAssignmentHash: true });
    showSetupFeedback('Úkol se nepodařilo načíst nebo obsahuje neplatné režimy.');
    return;
  }

  showExerciseScreen({ fromAssignment: true });
}

function isAssignmentProblemLimitReached() {
  if (!isAssignmentExercise()) {
    return false;
  }

  const limit = getAssignmentProblemLimit();
  return limit !== null && sessionResults.length >= limit;
}

function completeAssignmentExercise() {
  showAnalysisScreen({ pendingAssignmentSubmission: true });
}

function showFinishAssignmentAction() {
  awaitingNextProblem = true;
  primaryActionBtn.textContent = 'Dokončit';
  primaryActionBtn.disabled = false;
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

  const payloadType = data.payload?.t;
  if (payloadType === 'depot' || payloadType === 'submission' || payloadType === 'assignment') {
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

function canSubmitAssignment() {
  return canUseAnalysisLinkButton() && getAnalysisName() !== '';
}

function updateAnalysisLinkButton() {
  if (pendingAssignmentDepotId) {
    analysisLinkBtn.textContent = 'Odevzdat úkol';
    analysisLinkBtn.disabled = !canSubmitAssignment();
    return;
  }

  analysisLinkBtn.textContent = 'Vygenerovat odkaz';
  analysisLinkBtn.disabled = !canUseAnalysisLinkButton();
}

async function handleAnalysisLinkButtonClick() {
  if (pendingAssignmentDepotId) {
    await submitAssignmentToDepot();
    return;
  }

  await generateAnalysisLink();
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
  analysisNameInputEl.placeholder = awaitingAssignmentSubmission ? 'Povinné pole' : 'Volitelné';
}

function sanitizeFilenamePart(text) {
  const cleaned = text.trim().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}\-_]/gu, '');
  return cleaned.slice(0, 50);
}

function buildDepotLinkHtmlFile(depotUrl) {
  const safeAttr = escapeHtml(depotUrl);
  const safeJs = JSON.stringify(depotUrl);

  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${safeAttr}">
  <title>Depozitář odevzdaných úkolů</title>
  <script>location.replace(${safeJs});</script>
</head>
<body>
  <p><a href="${safeAttr}">Otevřít depozitář odevzdaných úkolů</a></p>
</body>
</html>`;
}

function downloadDepotLinkFile() {
  const depotUrl = assignmentDepotLinkInputEl?.value.trim();
  if (!depotUrl) {
    return;
  }

  const html = buildDepotLinkHtmlFile(depotUrl);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'depozitar-odevzdanych-ukolu.html';
  link.click();
  URL.revokeObjectURL(objectUrl);
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
    averageLevelLabel: 'Průměrná úroveň úlohy:',
    averageLevel: formatAverageLevel(stats.averageLevel),
    levelsHeading: 'Úspěšnost podle úrovně',
    levels,
    rows: sessionResults.map((row, index) => ({
      number: index + 1,
      uloha: row.uloha,
      ulohaHtml: row.ulohaHtml ?? '',
      uroven: row.uroven,
      odpoved: row.odpoved,
      spravne: row.spravne,
      vysledek: row.vysledek,
    })),
  };
}

function hasFormattedAnalysisProblems() {
  return sessionResults.some((row) => row.ulohaHtml);
}

function formatAnalysisProblemCell(row) {
  if (analysisProblemDisplayMode === 'formatted' && row.ulohaHtml) {
    return `<div class="analysis__problem analysis__problem--formatted" aria-label="${escapeHtml(row.uloha)}">${row.ulohaHtml}</div>`;
  }

  return escapeHtml(row.uloha);
}

function updateAnalysisProblemViewControls() {
  const canShowFormatted = hasFormattedAnalysisProblems();

  if (!canShowFormatted) {
    analysisProblemViewEl.hidden = true;
    analysisProblemDisplayMode = 'text';
    return;
  }

  analysisProblemViewEl.hidden = false;

  analysisProblemViewButtons.forEach((button) => {
    const isFormattedOption = button.dataset.problemView === 'formatted';
    button.disabled = isFormattedOption && !canShowFormatted;
    button.classList.toggle(
      'is-active',
      button.dataset.problemView === analysisProblemDisplayMode,
    );
  });
}

function setAnalysisProblemDisplayMode(mode) {
  if (mode === 'formatted' && !hasFormattedAnalysisProblems()) {
    analysisProblemDisplayMode = 'text';
  } else {
    analysisProblemDisplayMode = mode;
  }

  updateAnalysisProblemViewControls();
  renderAnalysisTableRows();
}

function renderAnalysisTableRows() {
  const doc = buildAnalysisDocument();

  analysisTableBodyEl.innerHTML = doc.rows.map((row) => `
    <tr class="${row.vysledek === 'špatně' ? 'row--wrong' : ''}">
      <td class="num">${row.number}</td>
      <td>${formatAnalysisProblemCell(row)}</td>
      <td class="num">${row.uroven}</td>
      <td>${escapeHtml(row.odpoved)}</td>
      <td>${escapeHtml(row.spravne)}</td>
      <td>${escapeHtml(row.vysledek)}</td>
    </tr>
  `).join('');
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
  lines.push(`${doc.averageLevelLabel} ${doc.averageLevel}`);

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
    analysisProblemViewEl.hidden = true;
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

  analysisSummaryEl.innerHTML = `${modesHtml}<p><strong>${escapeHtml(doc.overallLabel)}</strong> ${escapeHtml(doc.overall)}</p><p><strong>${escapeHtml(doc.averageLevelLabel)}</strong> ${escapeHtml(doc.averageLevel)}</p>`;

  const levelLines = doc.levels
    .map((level) => `<p>${escapeHtml(level.displayLabel)}</p>`)
    .join('');

  analysisLevelsEl.innerHTML = `
    <h3>${escapeHtml(doc.levelsHeading)}</h3>
    ${levelLines}
  `;

  updateAnalysisProblemViewControls();
  renderAnalysisTableRows();

  analysisDownloadBtn.disabled = false;
  updateAnalysisLinkButton();
  updateAnalysisNameField();
}

function hideAllScreens() {
  setupScreenEl.hidden = true;
  exerciseScreenEl.hidden = true;
  analysisScreenEl.hidden = true;
  if (depotScreenEl) {
    depotScreenEl.hidden = true;
  }
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
  updateExerciseStatsUi();
  setFormEnabled(false);

  if (isCompareProblem(currentProblem) && currentProblem.variant === 'sign') {
    setDecimalCompareSignReviewHighlight(isCorrect);
  } else if (isCompareProblem(currentProblem) && currentProblem.variant === 'order') {
    setDecimalCompareOrderReviewHighlight();
  } else if (isLengthConvertOrderProblem(currentProblem)) {
    setDecimalCompareOrderReviewHighlight();
  } else if (isWeightConvertOrderProblem(currentProblem)) {
    setDecimalCompareOrderReviewHighlight();
  } else if (isAreaConvertOrderProblem(currentProblem)) {
    setDecimalCompareOrderReviewHighlight();
  } else if (isVolumeConvertOrderProblem(currentProblem)) {
    setDecimalCompareOrderReviewHighlight();
  } else {
    setAnswerFieldHighlight(isCorrect ? 'correct' : 'wrong');
  }

  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';

  if (isAssignmentProblemLimitReached()) {
    showFinishAssignmentAction();
    primaryActionBtn.focus();
    return;
  }

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
  linearEquationActionButtons.forEach((button) => {
    button.disabled = !enabled;
  });
  decimalCompareInequalityButtons.forEach((button) => {
    button.disabled = !enabled;
  });
  decimalCompareSortListEl?.querySelectorAll('.decimal-compare-sort__item').forEach((item) => {
    item.draggable = enabled;
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
  if (!isCompareProblem(currentProblem)) {
    setAnswerFieldHighlight('wrong');
  }

  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
}

function clearAnswerInputs() {
  inputEl.value = '';
  answerNumeratorEl.value = '';
  answerDenominatorEl.value = '';
  setAnswerFractionNegative(false);
  clearAnswerFieldHighlight();
  clearLinearEquationSpecialAnswer();
  clearDecimalCompareSelectedSign();
  decimalCompareSortOrder = [];
}

function shouldUseKeypadOnlyAnswerInput() {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function applyAnswerInputKeyboardSuppression() {
  const suppressNativeKeyboard = shouldUseKeypadOnlyAnswerInput();

  [inputEl, answerNumeratorEl, answerDenominatorEl].forEach((input) => {
    input.readOnly = suppressNativeKeyboard;
    if (suppressNativeKeyboard) {
      input.inputMode = 'none';
    }
  });
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
  const usesFractionFields = usesFractionAnswerFields();

  if (commaKey) {
    commaKey.hidden = usesFractionFields
      || ((usesIntegerAnswerInput() || isLinearEquationIntegerAnswerInput()) && isNumberAnswerInputShape())
      || (isPowersAnswerInputMode() && isNumberAnswerInputShape())
      || (isSqrtAnswerInputMode() && isNumberAnswerInputShape())
      || (isPowersSqrtCombinedAnswerInputMode() && isNumberAnswerInputShape());
  }

  if (minusKey) {
    minusKey.hidden = usesFractionFields && !usesSignedFractionAnswerInput();
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

function updateAnswerShapeToggleVisibility(problem = currentProblem) {
  if (!problem) {
    answerShapeToggleBtn.hidden = false;
    return;
  }

  if (isCompareProblem(problem)) {
    answerShapeToggleBtn.hidden = true;
    return;
  }

  if (problem.type === 'fraction-zlomek'
    || problem.type === 'fraction-expand-reduce') {
    answerShapeToggleBtn.hidden = true;
    return;
  }

  if (problem.type === 'decimal-fraction-convert') {
    answerShapeToggleBtn.hidden = true;
    return;
  }

  if (problem.type === 'length-convert') {
    answerShapeToggleBtn.hidden = true;
    return;
  }

  if (problem.type === 'weight-convert') {
    answerShapeToggleBtn.hidden = true;
    return;
  }

  if (problem.type === 'area-convert') {
    answerShapeToggleBtn.hidden = true;
    return;
  }

  if (problem.type === 'volume-convert') {
    answerShapeToggleBtn.hidden = true;
    return;
  }

  if (problem.type === 'percent-part') {
    answerShapeToggleBtn.hidden = true;
    return;
  }

  if (problem.type === 'linear-equation') {
    answerShapeToggleBtn.hidden = problem.solutionType !== 'unique';
    return;
  }

  if (problem.type === 'linear-equation-fraction') {
    answerShapeToggleBtn.hidden = problem.solutionType !== 'unique';
    return;
  }

  answerShapeToggleBtn.hidden = false;
}

function updateFractionAnswerShapeUi() {
  const useFractionShape = fractionAnswerInputShape === 'fraction';

  updateAnswerShapeToggleVisibility();
  setAnswerWrapVisible(decimalAnswerWrapEl, !useFractionShape);
  setAnswerWrapVisible(fractionAnswerWrapEl, useFractionShape);
  inputEl.required = !useFractionShape;
  answerShapeToggleBtn.setAttribute(
    'aria-label',
    useFractionShape ? 'Přepnout odpověď na číslo' : 'Přepnout odpověď na zlomek',
  );

  if (!useFractionShape) {
    setAnswerFractionNegative(false);
  }

  inputEl.placeholder = '';
  inputEl.inputMode = (usesIntegerAnswerInput() || isLinearEquationIntegerAnswerInput()) && isNumberAnswerInputShape()
    ? 'numeric'
    : 'decimal';
  updateMathKeypadKeys();
  applyAnswerInputKeyboardSuppression();
}

function toggleFractionAnswerShape() {
  if (answerShapeToggleBtn.disabled || answerShapeToggleBtn.hidden) {
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

  if (mode === 'decimal'
    || mode === 'powers'
    || mode === 'sqrt'
    || mode === 'powers-sqrt-combined'
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

  if (mode === 'non-integer-powers' || mode === 'non-integer-sqrt') {
    fractionAnswerInputShape = 'fraction';
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'linear-equation'
    || mode === 'linear-equation-fraction'
    || mode === 'decimal-compare'
    || mode === 'integer-compare'
    || mode === 'non-integer-compare'
    || mode === 'fraction-compare') {
    fractionAnswerInputShape = 'number';
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'fraction-zlomek') {
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'fraction-expand-reduce') {
    fractionAnswerInputShape = 'number';
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'decimal-fraction-convert') {
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'length-convert') {
    fractionAnswerInputShape = 'number';
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'weight-convert') {
    fractionAnswerInputShape = 'number';
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'area-convert') {
    fractionAnswerInputShape = 'number';
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'volume-convert') {
    fractionAnswerInputShape = 'number';
    updateFractionAnswerShapeUi();
    return;
  }

  if (mode === 'percent-part') {
    fractionAnswerInputShape = 'number';
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

  maybeClearLinearEquationSpecialAnswerOnInput();

  if (value === '-') {
    if (usesSignedFractionAnswerInput()) {
      toggleAnswerFractionNegative();
      return;
    }

    if (usesFractionAnswerFields()) {
      return;
    }

    toggleNegativeSignInInput(inputEl);
    return;
  }

  if ((usesIntegerAnswerInput() || isLinearEquationIntegerAnswerInput()) && isNumberAnswerInputShape()) {
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

  maybeClearLinearEquationSpecialAnswerOnInput();

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
  appEl.classList.toggle('app--decimal-fraction-convert', problem.type === 'decimal-fraction-convert');
  appEl.classList.toggle('app--length-convert', problem.type === 'length-convert');
  appEl.classList.toggle('app--weight-convert', problem.type === 'weight-convert');
  appEl.classList.toggle('app--area-convert', problem.type === 'area-convert');
  appEl.classList.toggle('app--volume-convert', problem.type === 'volume-convert');
  appEl.classList.toggle('app--percent-part', problem.type === 'percent-part');
  appEl.classList.toggle('app--fraction-expand-reduce', problem.type === 'fraction-expand-reduce');

  if (problem.type === 'basic-form') {
    const maxInputLength = String(getBasicFormMaxValue(getInternalDisplayLevel(problem))).length;
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
  } else if (problem.type === 'cross-panel-mixed') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatCrossPanelMixedDisplayHtml(problem);
  } else if (isIntegerArithmeticProblem(problem)) {
    problemEl.innerHTML = formatIntegerArithmeticDisplayHtml(problem);
  } else if (problem.type === 'non-integer-add-subtract') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatNonIntegerAddSubtractDisplayHtml(problem);
  } else if (problem.type === 'non-integer-multiply-divide') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length + 1;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = String(FRACTION_ADD_ANSWER_MAX).length;
    problemEl.innerHTML = formatNonIntegerMultiplyDivideDisplayHtml(problem);
  } else if (problem.type === 'powers') {
    problemEl.innerHTML = formatPowersDisplayHtml(problem);
  } else if (problem.type === 'sqrt') {
    problemEl.innerHTML = formatSqrtDisplayHtml(problem);
  } else if (problem.type === 'powers-sqrt-combined') {
    problemEl.innerHTML = formatPowersSqrtCombinedDisplayHtml(problem);
  } else if (problem.type === 'non-integer-powers') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatNonIntegerPowersDisplayHtml(problem);
  } else if (problem.type === 'non-integer-sqrt') {
    const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    problemEl.innerHTML = formatNonIntegerSqrtDisplayHtml(problem);
  } else if (problem.type === 'linear-equation') {
    if (problem.solutionType === 'unique' && problem.answerKind === 'fraction') {
      const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length + 1;
      answerNumeratorEl.maxLength = maxInputLength;
      answerDenominatorEl.maxLength = String(FRACTION_ADD_ANSWER_MAX).length;
      fractionAnswerInputShape = 'fraction';
    } else {
      fractionAnswerInputShape = 'number';
    }

    problemEl.innerHTML = formatLinearEquationDisplayHtml(problem);
  } else if (problem.type === 'linear-equation-fraction') {
    if (problem.solutionType === 'unique') {
      const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length + 1;
      answerNumeratorEl.maxLength = maxInputLength;
      answerDenominatorEl.maxLength = String(FRACTION_ADD_ANSWER_MAX).length;
    }

    fractionAnswerInputShape = 'number';
    problemEl.innerHTML = formatLinearEquationFractionDisplayHtml(problem);
  } else if (problem.type === 'fraction-zlomek') {
    if (problem.answerKind === 'fraction') {
      const maxInputLength = String(FRACTION_ADD_ANSWER_MAX).length;
      answerNumeratorEl.maxLength = maxInputLength;
      answerDenominatorEl.maxLength = maxInputLength;
      fractionAnswerInputShape = 'fraction';
    } else {
      fractionAnswerInputShape = 'number';
    }

    problemEl.innerHTML = formatFractionZlomekDisplayHtml(problem);
  } else if (problem.type === 'fraction-expand-reduce') {
    fractionAnswerInputShape = 'number';
    problemEl.innerHTML = formatFractionExpandReduceDisplayHtml(problem);
  } else if (problem.type === 'decimal-fraction-convert') {
    const maxInputLength = String(DECIMAL_FRACTION_CONVERT_ANSWER_MAX).length;
    answerNumeratorEl.maxLength = maxInputLength;
    answerDenominatorEl.maxLength = maxInputLength;
    fractionAnswerInputShape = problem.answerKind === 'fraction' ? 'fraction' : 'number';
    problemEl.innerHTML = formatDecimalFractionConvertDisplayHtml(problem);
  } else if (problem.type === 'length-convert') {
    fractionAnswerInputShape = 'number';
    problemEl.innerHTML = formatLengthConvertDisplayHtml(problem);
  } else if (problem.type === 'weight-convert') {
    fractionAnswerInputShape = 'number';
    problemEl.innerHTML = formatWeightConvertDisplayHtml(problem);
  } else if (problem.type === 'area-convert') {
    fractionAnswerInputShape = 'number';
    problemEl.innerHTML = formatAreaConvertDisplayHtml(problem);
  } else if (problem.type === 'volume-convert') {
    fractionAnswerInputShape = 'number';
    problemEl.innerHTML = formatVolumeConvertDisplayHtml(problem);
  } else if (problem.type === 'percent-part') {
    fractionAnswerInputShape = 'number';
    problemEl.innerHTML = formatPercentPartDisplayHtml(problem);
  } else if (isCompareProblem(problem) && problem.variant !== 'sign') {
    problemEl.innerHTML = formatCompareDisplayHtml(problem);
  } else if (!isCompareProblem(problem)) {
  problemEl.textContent = formatProblemText(problem);
  }

  updateLinearEquationAnswerFormUi(problem);
  updateLinearEquationActionsUi(problem);

  if (isMultiModeExercise()) {
    setAnswerInputModeForProblem(problem);
  }

  updateFractionAnswerShapeUi();

  const canAnswer = isMultiModeExercise()
    ? canAnswerProblem(problem)
    : (isFractionExerciseMode()
      || isIntegerExerciseMode()
      || isNonIntegerExerciseMode()
      || isNonIntegerPowersExerciseMode()
      || isNonIntegerSqrtExerciseMode()
      || isPowersExerciseMode()
      || isSqrtExerciseMode()
      || isPowersSqrtCombinedExerciseMode()
      || isLinearEquationExerciseMode()
      || isLinearEquationFractionExerciseMode()
      || isCompareExerciseMode()
      || isFractionZlomekExerciseMode()
      || isFractionExpandReduceExerciseMode()
      || isDecimalFractionConvertExerciseMode()
      || isLengthConvertExerciseMode()
      || isWeightConvertExerciseMode()
      || isAreaConvertExerciseMode()
      || isVolumeConvertExerciseMode()
      || isPercentPartExerciseMode()
      || getSelectedOperations().length > 0);
  setFormEnabled(canAnswer);

  if (canAnswer) {
    clearAnswerInputs();
    if (isCompareProblem(problem) && problem.variant === 'order') {
      initDecimalCompareSortOrder(problem);
    }
    if (isLengthConvertOrderProblem(problem)) {
      initDecimalCompareSortOrder(problem);
    }
    if (isWeightConvertOrderProblem(problem)) {
      initDecimalCompareSortOrder(problem);
    }
    if (isAreaConvertOrderProblem(problem)) {
      initDecimalCompareSortOrder(problem);
    }
    if (isVolumeConvertOrderProblem(problem)) {
      initDecimalCompareSortOrder(problem);
    }
    if (!isCompareProblem(problem)) {
      focusAnswerInput();
    } else {
      primaryActionBtn.focus();
    }
  }

  updateDecimalCompareAnswerUi(problem);

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
  } else if (problem.type === 'linear-equation') {
    item.type = 'linear-equation';
    item.variant = problem.variant;
    item.k = problem.k;
    item.l = problem.l;
    item.a = problem.a;
    item.b = problem.b;
    item.displayLeft = problem.displayLeft;
    item.displayRight = problem.displayRight;
    item.leftInner = problem.leftInner ?? null;
    item.leftExtra = problem.leftExtra ?? null;
    item.rightInner = problem.rightInner ?? null;
    item.rightExtra = problem.rightExtra ?? null;
    item.solutionType = problem.solutionType;
    item.answerKind = problem.answerKind;
    item.answer = problem.answer;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
    item.answerNegative = problem.answerNegative;
  } else if (problem.type === 'linear-equation-fraction') {
    item.type = 'linear-equation-fraction';
    item.variant = problem.variant;
    item.leftTerms = problem.leftTerms.map((term) => ({ ...term }));
    item.right = { ...problem.right };
    item.displayLeft = problem.displayLeft;
    item.displayRight = problem.displayRight;
    item.solutionType = problem.solutionType;
    item.answerKind = problem.answerKind;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
    item.answerNegative = problem.answerNegative;
  } else if (problem.type === 'fraction-zlomek') {
    item.type = 'fraction-zlomek';
    item.variant = problem.variant;
    item.prompt = problem.prompt;
    item.answerKind = problem.answerKind;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
    item.answer = problem.answer;
    item.promptNum = problem.promptNum ?? null;
    item.promptDen = problem.promptDen ?? null;
    item.quantity = problem.quantity ?? null;
    item.partValue = problem.partValue ?? null;
    item.unitValue = problem.unitValue ?? null;
    item.unitMeasure = problem.unitMeasure ?? null;
    item.unitLabel = problem.unitLabel ?? null;
  } else if (problem.type === 'fraction-expand-reduce') {
    item.type = 'fraction-expand-reduce';
    item.leftNum = problem.leftNum;
    item.leftDen = problem.leftDen;
    item.rightNum = problem.rightNum;
    item.rightDen = problem.rightDen;
    item.unknownPosition = problem.unknownPosition;
    item.answer = problem.answer;
  } else if (problem.type === 'decimal-fraction-convert') {
    item.type = 'decimal-fraction-convert';
    item.direction = problem.direction;
    item.num = problem.num;
    item.den = problem.den;
    item.decimalValue = problem.decimalValue;
    item.decimalPlaces = problem.decimalPlaces;
    item.answerKind = problem.answerKind;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
    item.answer = problem.answer;
    item.answerDecimals = problem.answerDecimals;
  } else if (problem.type === 'length-convert') {
    item.type = 'length-convert';
    item.variant = problem.variant;
    item.fromValue = problem.fromValue ?? null;
    item.fromUnit = problem.fromUnit ?? null;
    item.toUnit = problem.toUnit ?? null;
    item.fromValueDecimals = problem.fromValueDecimals ?? null;
    item.answer = problem.answer ?? null;
    item.answerDecimals = problem.answerDecimals ?? null;
    item.operands = problem.operands ? problem.operands.map((operand) => ({ ...operand })) : null;
    item.correctOrder = problem.correctOrder ? [...problem.correctOrder] : null;
    item.displayOrder = problem.displayOrder ? [...problem.displayOrder] : null;
  } else if (problem.type === 'weight-convert') {
    item.type = 'weight-convert';
    item.variant = problem.variant;
    item.fromValue = problem.fromValue ?? null;
    item.fromUnit = problem.fromUnit ?? null;
    item.toUnit = problem.toUnit ?? null;
    item.fromValueDecimals = problem.fromValueDecimals ?? null;
    item.answer = problem.answer ?? null;
    item.answerDecimals = problem.answerDecimals ?? null;
    item.operands = problem.operands ? problem.operands.map((operand) => ({ ...operand })) : null;
    item.correctOrder = problem.correctOrder ? [...problem.correctOrder] : null;
    item.displayOrder = problem.displayOrder ? [...problem.displayOrder] : null;
  } else if (problem.type === 'area-convert') {
    item.type = 'area-convert';
    item.variant = problem.variant;
    item.fromValue = problem.fromValue ?? null;
    item.fromUnit = problem.fromUnit ?? null;
    item.toUnit = problem.toUnit ?? null;
    item.fromValueDecimals = problem.fromValueDecimals ?? null;
    item.answer = problem.answer ?? null;
    item.answerDecimals = problem.answerDecimals ?? null;
    item.operands = problem.operands ? problem.operands.map((operand) => ({ ...operand })) : null;
    item.correctOrder = problem.correctOrder ? [...problem.correctOrder] : null;
    item.displayOrder = problem.displayOrder ? [...problem.displayOrder] : null;
  } else if (problem.type === 'volume-convert') {
    item.type = 'volume-convert';
    item.variant = problem.variant;
    item.fromValue = problem.fromValue ?? null;
    item.fromUnit = problem.fromUnit ?? null;
    item.toUnit = problem.toUnit ?? null;
    item.fromValueDecimals = problem.fromValueDecimals ?? null;
    item.answer = problem.answer ?? null;
    item.answerDecimals = problem.answerDecimals ?? null;
    item.operands = problem.operands ? problem.operands.map((operand) => ({ ...operand })) : null;
    item.correctOrder = problem.correctOrder ? [...problem.correctOrder] : null;
    item.displayOrder = problem.displayOrder ? [...problem.displayOrder] : null;
  } else if (problem.type === 'percent-part') {
    item.type = 'percent-part';
    item.percent = problem.percent;
    item.whole = problem.whole;
    item.preposition = problem.preposition;
    item.answer = problem.answer;
    item.answerDecimals = problem.answerDecimals;
  } else if (isCompareProblem(problem)) {
    item.type = problem.type;
    item.variant = problem.variant;
    item.left = problem.left ? { ...problem.left } : null;
    item.right = problem.right ? { ...problem.right } : null;
    item.operands = problem.operands ? problem.operands.map((operand) => ({ ...operand })) : null;
    item.answerSign = problem.answerSign;
    item.correctOrder = problem.correctOrder ? [...problem.correctOrder] : null;
    item.displayOrder = problem.displayOrder ? [...problem.displayOrder] : null;
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
  } else if (problem.type === 'non-integer-powers') {
    item.type = 'non-integer-powers';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.operators = [...problem.operators];
    item.answerKind = problem.answerKind;
    item.answer = problem.answer;
    item.answerDecimals = problem.answerDecimals;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
    item.parenthesesGroup = problem.parenthesesGroup ?? null;
  } else if (problem.type === 'non-integer-sqrt') {
    item.type = 'non-integer-sqrt';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.operators = [...problem.operators];
    item.answerKind = problem.answerKind;
    item.answer = problem.answer;
    item.answerDecimals = problem.answerDecimals;
    item.answerNum = problem.answerNum;
    item.answerDen = problem.answerDen;
    item.parenthesesGroup = problem.parenthesesGroup ?? null;
  } else if (problem.type === 'powers') {
    item.type = 'powers';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.operators = [...problem.operators];
    item.answer = problem.answer;
  } else if (problem.type === 'sqrt') {
    item.type = 'sqrt';
    item.terms = problem.terms.map((term) => ({ ...term }));
    item.operators = [...problem.operators];
    item.answer = problem.answer;
  } else if (problem.type === 'powers-sqrt-combined') {
    item.type = 'powers-sqrt-combined';
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

    if (dueRetry.type === 'linear-equation') {
      return linearEquationProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'linear-equation-fraction') {
      return linearEquationFractionProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'fraction-zlomek') {
      return fractionZlomekProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'fraction-expand-reduce') {
      return fractionExpandReduceProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'decimal-fraction-convert') {
      return decimalFractionConvertProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'length-convert') {
      return lengthConvertProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'weight-convert') {
      return weightConvertProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'area-convert') {
      return areaConvertProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'volume-convert') {
      return volumeConvertProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'percent-part') {
      return percentPartProblemFromRetry(dueRetry);
    }

    if (dueRetry.type === 'decimal-compare'
      || dueRetry.type === 'integer-compare'
      || dueRetry.type === 'non-integer-compare'
      || dueRetry.type === 'fraction-compare') {
      return compareProblemFromRetry(dueRetry);
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

    if (dueRetry.type === 'cross-panel-mixed') {
      return {
        type: 'cross-panel-mixed',
        terms: dueRetry.terms.map(cloneCrossPanelTerm),
        operators: [...getCrossPanelMixedOperators(dueRetry)],
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

    if (dueRetry.type === 'sqrt') {
      return {
        type: 'sqrt',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        answer: dueRetry.answer,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'powers-sqrt-combined') {
      return {
        type: 'powers-sqrt-combined',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        answer: dueRetry.answer,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'non-integer-powers') {
      return {
        type: 'non-integer-powers',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        answerKind: dueRetry.answerKind,
        answer: dueRetry.answer,
        answerDecimals: dueRetry.answerDecimals,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        parenthesesGroup: dueRetry.parenthesesGroup ?? null,
        level: dueRetry.level,
        isRetry: true,
      };
    }

    if (dueRetry.type === 'non-integer-sqrt') {
      return {
        type: 'non-integer-sqrt',
        terms: dueRetry.terms.map((term) => ({ ...term })),
        operators: [...dueRetry.operators],
        answerKind: dueRetry.answerKind,
        answer: dueRetry.answer,
        answerDecimals: dueRetry.answerDecimals,
        answerNum: dueRetry.answerNum,
        answerDen: dueRetry.answerDen,
        parenthesesGroup: dueRetry.parenthesesGroup ?? null,
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
  if (depotScreenEl && !depotScreenEl.hidden) {
    appTitleEl.hidden = false;
    appTitleEl.textContent = 'Depozitář odevzdaných úkolů';
    return;
  }

  if (!analysisScreenEl.hidden) {
    appTitleEl.hidden = true;
    appTitleEl.textContent = '';
    return;
  }

  appTitleEl.hidden = false;

  if (exerciseScreenEl.hidden && analysisScreenEl.hidden) {
    if (hasCrossTypeSelection()) {
      appTitleEl.textContent = DECIMAL_FRACTION_COMBINED_APP_TITLE;
      return;
    }

    if (hasIntegerOnlySelection()) {
      appTitleEl.textContent = INTEGER_APP_TITLE;
      return;
    }

    if (hasPowersOnlySelection() || hasSqrtOnlySelection() || hasPowersSqrtOnlySelection() || hasNonIntegerPowersOnlySelection() || hasNonIntegerSqrtOnlySelection()) {
      appTitleEl.textContent = POWERS_APP_TITLE;
      return;
    }

    if (hasBasicFormOnlySelection()) {
      appTitleEl.textContent = FRACTION_APP_TITLE;
      return;
    }

    if (hasLinearEquationOnlySelection()) {
      appTitleEl.textContent = LINEAR_EQUATION_APP_TITLE;
      return;
    }

    if (hasLinearEquationFractionOnlySelection()) {
      appTitleEl.textContent = LINEAR_EQUATION_FRACTION_APP_TITLE;
      return;
    }

    if (hasDecimalCompareOnlySelection()) {
      appTitleEl.textContent = DECIMAL_COMPARE_APP_TITLE;
      return;
    }

    if (hasDecimalFractionConvertOnlySelection()) {
      appTitleEl.textContent = DECIMAL_FRACTION_CONVERT_APP_TITLE;
      return;
    }

    if (hasIntegerCompareOnlySelection()) {
      appTitleEl.textContent = INTEGER_COMPARE_APP_TITLE;
      return;
    }

    if (hasNonIntegerCompareOnlySelection()) {
      appTitleEl.textContent = NON_INTEGER_COMPARE_APP_TITLE;
      return;
    }

    if (hasFractionCompareOnlySelection()) {
      appTitleEl.textContent = FRACTION_COMPARE_APP_TITLE;
      return;
    }

    if (hasFractionZlomekOnlySelection()) {
      appTitleEl.textContent = FRACTION_ZLOMEK_APP_TITLE;
      return;
    }

    if (hasFractionExpandReduceOnlySelection()) {
      appTitleEl.textContent = FRACTION_EXPAND_REDUCE_APP_TITLE;
      return;
    }

    if (hasLengthConvertOnlySelection()) {
      appTitleEl.textContent = LENGTH_CONVERT_APP_TITLE;
      return;
    }

    if (hasWeightConvertOnlySelection()) {
      appTitleEl.textContent = WEIGHT_CONVERT_APP_TITLE;
      return;
    }

    if (hasAreaConvertOnlySelection()) {
      appTitleEl.textContent = AREA_CONVERT_APP_TITLE;
      return;
    }

    if (hasVolumeConvertOnlySelection()) {
      appTitleEl.textContent = VOLUME_CONVERT_APP_TITLE;
      return;
    }

    if (hasPercentPartOnlySelection()) {
      appTitleEl.textContent = PERCENT_PART_APP_TITLE;
      return;
    }

    if (isAssignmentSetupCategory()) {
      appTitleEl.textContent = 'Vytvořit úkol';
      return;
    }

    appTitleEl.textContent = APP_TITLE;
    return;
  }

  if (isAssignmentExercise()) {
    appTitleEl.textContent = activeAssignmentConfig.name || 'Úkol';
    return;
  }

  if (isMultiModeExercise()) {
    appTitleEl.textContent = APP_TITLE;
    return;
  }

  if (isPowersExerciseMode() || isSqrtExerciseMode() || isPowersSqrtCombinedExerciseMode() || isNonIntegerPowersExerciseMode() || isNonIntegerSqrtExerciseMode()) {
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

  if (activeExerciseMode === 'linear-equation') {
    appTitleEl.textContent = LINEAR_EQUATION_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'linear-equation-fraction') {
    appTitleEl.textContent = LINEAR_EQUATION_FRACTION_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'decimal-compare') {
    appTitleEl.textContent = DECIMAL_COMPARE_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'decimal-fraction-convert') {
    appTitleEl.textContent = DECIMAL_FRACTION_CONVERT_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'length-convert') {
    appTitleEl.textContent = LENGTH_CONVERT_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'weight-convert') {
    appTitleEl.textContent = WEIGHT_CONVERT_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'area-convert') {
    appTitleEl.textContent = AREA_CONVERT_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'volume-convert') {
    appTitleEl.textContent = VOLUME_CONVERT_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'percent-part') {
    appTitleEl.textContent = PERCENT_PART_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'integer-compare') {
    appTitleEl.textContent = INTEGER_COMPARE_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'non-integer-compare') {
    appTitleEl.textContent = NON_INTEGER_COMPARE_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'fraction-compare') {
    appTitleEl.textContent = FRACTION_COMPARE_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'fraction-zlomek') {
    appTitleEl.textContent = FRACTION_ZLOMEK_APP_TITLE;
    return;
  }

  if (activeExerciseMode === 'fraction-expand-reduce') {
    appTitleEl.textContent = FRACTION_EXPAND_REDUCE_APP_TITLE;
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
  analysisProblemDisplayMode = 'text';
  sessionSelectedModes = [];
  activeExerciseModePool = [];
  analysisNameInputEl.value = '';
  viewingSharedAnalysis = false;
  pendingAssignmentDepotId = null;
  awaitingAssignmentSubmission = false;
  hideAnalysisLinkUi();
}

function clearActiveAssignment() {
  activeAssignmentConfig = null;
}

function resetProgress() {
  difficultyLevel = 0;
  correctStreak = 0;
  retryQueue = [];
  currentProblem = null;
  fractionAnswerInputShape = 'fraction';
  shuffledExerciseModeDeck = [];
  lastPickedExerciseMode = null;
  multiModeFocusedModeIndex = 0;
  multiModePhase = MULTI_MODE_PHASE.INDIVIDUAL;
  multiModeIndividualQueue = [];
  multiModeWithinPanelQueue = [];
  multiModeCombinationUseCrossPanel = true;
  shuffledWithinPanelDeck = [];
  lastPickedWithinPanel = null;
  resetSession();

  if (!isAssignmentExercise()) {
    clearActiveAssignment();
  }
}

function advanceMultiModePhaseAfterIndividualComplete() {
  if (multiModeWithinPanelQueue.length > 0 || hasMultiModeCrossPanelCombination()) {
    multiModePhase = MULTI_MODE_PHASE.COMBINATION;
    multiModeCombinationUseCrossPanel = true;
  }
}

function handleCorrectAnswer() {
  correctStreak += 1;

  if (activeExerciseMode === 'multi-mode'
    && activeExerciseModePool.length > 1
    && multiModePhase === MULTI_MODE_PHASE.INDIVIDUAL) {
    const focusMode = multiModeIndividualQueue[multiModeFocusedModeIndex];
    const modeMax = getMaxDifficultyLevelForMode(focusMode);

    if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel >= modeMax) {
      multiModeFocusedModeIndex += 1;

      if (multiModeFocusedModeIndex >= multiModeIndividualQueue.length) {
        difficultyLevel = getMultiModeIndividualMaxDifficulty();
        advanceMultiModePhaseAfterIndividualComplete();
      } else {
        difficultyLevel = 0;
      }

      correctStreak = 0;
      return;
    }
  }

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

function showSetupScreen({ preserveAnalysisHash = false, preserveAssignmentHash = false, preserveDepotHash = false } = {}) {
  hideAllScreens();
  setupScreenEl.hidden = false;
  appEl.classList.remove('app--wide', 'app--exercise', 'app--decimal-fraction-convert', 'app--length-convert', 'app--weight-convert', 'app--area-convert', 'app--volume-convert', 'app--percent-part', 'app--fraction-expand-reduce');
  viewingSharedAnalysis = false;
  activeExerciseMode = null;
  currentAnswerInputMode = null;
  activeDepotId = null;
  pendingAssignmentDepotId = null;
  awaitingAssignmentSubmission = false;
  clearActiveAssignment();
  setAnswerInputMode('decimal');
  updateSetupCategoryUi();
  showSetupFeedback('');
  updateStartButton();
  hideAnalysisLinkUi();
  if (location.hash.startsWith('#a=') && !preserveAnalysisHash) {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
  if (location.hash.startsWith('#u=') && !preserveAssignmentHash) {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
  if (location.hash.startsWith('#d=') && !preserveDepotHash) {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
  updateTitle();
}

function showExerciseScreen({ fromAssignment = false } = {}) {
  if (!fromAssignment) {
    clearActiveAssignment();
  }

  const resolvedMode = resolveActiveExerciseMode();
  if (resolvedMode === null) {
    if (fromAssignment) {
      clearActiveAssignment();
    }
    showSetupFeedback(getSetupStartBlockReason() || 'Vyber alespoň jeden režim procvičování.');
    return;
  }

  activeExerciseMode = resolvedMode;
  const selectedModes = fromAssignment && activeAssignmentConfig
    ? captureSessionModeSelectionFromAssignment(activeAssignmentConfig)
    : captureSessionModeSelection();

  hideAllScreens();
  exerciseScreenEl.hidden = false;
  appEl.classList.remove('app--wide');
  appEl.classList.add('app--exercise');
  if (resolvedMode === 'fraction-zlomek') {
    appEl.classList.add('app--wide');
  }

  if (resolvedMode === 'fraction-expand-reduce') {
    appEl.classList.remove('app--wide');
  }

  resetProgress();
  sessionSelectedModes = selectedModes;
  if (fromAssignment && activeAssignmentConfig?.name) {
    analysisNameInputEl.value = activeAssignmentConfig.name;
  }
  activeExerciseModePool = resolvedMode === 'multi-mode'
    ? buildExerciseModePool()
    : [resolvedMode];
  if (activeExerciseMode === 'multi-mode') {
    initMultiModeProgress();
  }
  if (activeExerciseMode !== 'multi-mode') {
    setAnswerInputMode(activeExerciseMode);
  }
  updateTitle();
  updateExerciseStatsUi();
  newProblem();
}

function showAnalysisScreen({ pendingAssignmentSubmission = false } = {}) {
  awaitingAssignmentSubmission = pendingAssignmentSubmission;

  if (pendingAssignmentSubmission && activeAssignmentConfig?.depotId) {
    pendingAssignmentDepotId = activeAssignmentConfig.depotId;
  } else if (!pendingAssignmentSubmission) {
    pendingAssignmentDepotId = null;
    awaitingAssignmentSubmission = false;
  }

  hideAllScreens();
  analysisScreenEl.hidden = false;
  appEl.classList.remove('app--exercise', 'app--decimal-fraction-convert', 'app--length-convert', 'app--weight-convert', 'app--area-convert', 'app--volume-convert', 'app--percent-part', 'app--fraction-expand-reduce');
  appEl.classList.add('app--wide');
  clearActiveAssignment();
  renderAnalysis();
  if (!pendingAssignmentDepotId && location.hash.startsWith('#a=')) {
    const id = getAnalysisIdFromUrl();
    if (id) {
      analysisLinkInputEl.value = buildAnalysisShareUrl(id);
      analysisLinkWrapEl.hidden = false;
    }
  }
  updateAnalysisNameField();
  updateTitle();
}

function handleExclusiveModeSelectionChange(event) {
  const radio = event.currentTarget;

  if (radio.dataset.wasChecked === 'true') {
    radio.checked = false;
    radio.dataset.wasChecked = 'false';
    event.preventDefault();
  } else {
    exclusiveModeRadios.forEach((item) => {
      item.dataset.wasChecked = 'false';
    });
    radio.dataset.wasChecked = 'true';
  }

  hideAssignmentLinkUi();
  showSetupFeedback('');
  updateStartButton();
  updateTitle();
}

function handleOperationSelectionChange() {
  hideAssignmentLinkUi();
  handleCombinableModeSelectionChange();
}

function handleFractionModeSelectionChange() {
  hideAssignmentLinkUi();
  handleCombinableModeSelectionChange();
}

function handleIntegerModeSelectionChange() {
  hideAssignmentLinkUi();
  handleCombinableModeSelectionChange();
}

function handlePowersModeSelectionChange() {
  hideAssignmentLinkUi();
  handleCombinableModeSelectionChange();
}

primaryActionBtn.addEventListener('click', () => {
  if (awaitingNextProblem) {
    if (isAssignmentProblemLimitReached()) {
      completeAssignmentExercise();
      return;
    }
    newProblem();
    return;
  }

  if (isCompareProblem(currentProblem)) {
    const userAnswer = getCompareUserAnswer(currentProblem);
    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateCompareAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
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

    const userAnswer = getFractionAnswerFromInputs() ?? getFractionUserAnswerFallback();
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

  if (isIntegerArithmeticProblem(currentProblem) || isPowersProblem(currentProblem) || isSqrtProblem(currentProblem) || isPowersSqrtCombinedProblem(currentProblem)) {
    const userAnswer = getIntegerAnswerFromUserInput();
    if (userAnswer === null) {
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
    if (isNumberAnswerInputShape()) {
      const userValue = parseAnswer(inputEl.value);
      if (userValue === null) {
        showAnswerValidationFeedback();
        return;
      }

      const correctNum = currentProblem.answerNegative
        ? -currentProblem.answerNum
        : currentProblem.answerNum;
      const isCorrect = numericAnswerMatchesFraction(
        userValue,
        correctNum,
        currentProblem.answerDen,
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
    if (isNumberAnswerInputShape()) {
      const userAnswer = parseAnswer(inputEl.value);
      if (userAnswer === null) {
        showAnswerValidationFeedback();
        return;
      }

      let isCorrect = false;

      if (getNonIntegerAnswerKind(currentProblem) === 'decimal') {
        isCorrect = answersMatch(
          userAnswer,
          currentProblem.answer,
          currentProblem.answerDecimals,
        );
      } else {
        const correctNum = currentProblem.answerNegative
          ? -currentProblem.answerNum
          : currentProblem.answerNum;
        isCorrect = numericAnswerMatchesFraction(
          userAnswer,
          correctNum,
          currentProblem.answerDen,
        );
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

  if (currentProblem?.type === 'non-integer-powers' || currentProblem?.type === 'non-integer-sqrt') {
    const correctFraction = currentProblem.type === 'non-integer-powers'
      ? getNonIntegerPowersCorrectFraction(currentProblem)
      : getNonIntegerSqrtCorrectFraction(currentProblem);

    if (isNumberAnswerInputShape()) {
      const userAnswer = parseAnswer(inputEl.value);
      if (userAnswer === null) {
        showAnswerValidationFeedback();
        return;
      }

      let isCorrect = false;

      if (currentProblem.answerKind === 'decimal') {
        isCorrect = answersMatch(
          userAnswer,
          currentProblem.answer,
          currentProblem.answerDecimals,
        );
      } else {
        isCorrect = numericAnswerMatchesFraction(
          userAnswer,
          correctFraction.num,
          correctFraction.den,
        );
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

    const userAnswer = getFractionAnswerFromInputs();
    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateFractionAnswer(userAnswer, correctFraction);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isLinearEquationProblem(currentProblem)) {
    const userAnswer = getLinearEquationUserAnswer(currentProblem);
    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateLinearEquationAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isFractionZlomekProblem(currentProblem)) {
    const userAnswer = getFractionZlomekUserAnswer(currentProblem);

    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateFractionZlomekAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isFractionExpandReduceProblem(currentProblem)) {
    const value = parseAnswer(inputEl.value);
    const userAnswer = value !== null && Number.isInteger(value) ? value : null;

    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateFractionExpandReduceAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isDecimalFractionConvertProblem(currentProblem)) {
    let userAnswer = null;

    if (currentProblem.answerKind === 'fraction') {
      userAnswer = getFractionAnswerFromInputs();
    } else {
      userAnswer = parseAnswer(inputEl.value);
    }

    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateDecimalFractionConvertAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isLengthConvertProblem(currentProblem)) {
    const userAnswer = getLengthConvertUserAnswer(currentProblem);

    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateLengthConvertAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isWeightConvertProblem(currentProblem)) {
    const userAnswer = getWeightConvertUserAnswer(currentProblem);

    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateWeightConvertAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isAreaConvertProblem(currentProblem)) {
    const userAnswer = getAreaConvertUserAnswer(currentProblem);

    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateAreaConvertAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isVolumeConvertProblem(currentProblem)) {
    const userAnswer = getVolumeConvertUserAnswer(currentProblem);

    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateVolumeConvertAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isPercentPartProblem(currentProblem)) {
    const userAnswer = getPercentPartUserAnswer();

    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluatePercentPartAnswer(currentProblem, userAnswer);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }

    recordSessionAnswer(userAnswer, isCorrect);
    finishAnswerReview(isCorrect);
    return;
  }

  if (isCompareProblem(currentProblem)) {
    const userAnswer = getCompareUserAnswer(currentProblem);
    if (userAnswer === null) {
      showAnswerValidationFeedback();
      return;
    }

    const { isCorrect } = evaluateCompareAnswer(currentProblem, userAnswer);

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

  if (isNumberAnswerInputShape()) {
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

  const userAnswer = getFractionAnswerFromInputs();
  if (userAnswer === null) {
    showAnswerValidationFeedback();
    return;
  }

  const correctFraction = getDecimalProblemCorrectFraction(currentProblem);
  const { isCorrect } = evaluateFractionAnswer(userAnswer, correctFraction);

  if (isCorrect) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }

  recordSessionAnswer(userAnswer, isCorrect);
  finishAnswerReview(isCorrect);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || exerciseScreenEl.hidden) {
    return;
  }

  if (event.target === backBtn || event.target === finishBtn) {
    return;
  }

  if (awaitingNextProblem) {
    if (event.target === primaryActionBtn) {
      return;
    }

    if (isAssignmentProblemLimitReached()) {
      event.preventDefault();
      completeAssignmentExercise();
      return;
    }

    event.preventDefault();
    newProblem();
    return;
  }

  const isAnswerInput = event.target === inputEl
    || event.target === answerNumeratorEl
    || event.target === answerDenominatorEl;

  if (isAnswerInput) {
    event.preventDefault();
    formEl.requestSubmit();
  }
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

startBtn.addEventListener('click', async () => {
  const startBlockReason = getSetupStartBlockReason();
  if (startBlockReason !== '') {
    showSetupFeedback(startBlockReason);
    return;
  }

  if (isAssignmentSetupCategory()) {
    showSetupFeedback('');
    await createAssignmentLink();
    return;
  }

  showSetupFeedback('');
  showExerciseScreen();
});

assignmentLinkCopyBtn?.addEventListener('click', async () => {
  const url = assignmentLinkInputEl?.value.trim();
  if (!url) {
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    assignmentLinkFeedbackEl.textContent = 'Odkaz na úkol zkopírován do schránky.';
    assignmentLinkFeedbackEl.hidden = false;
  } catch {
    assignmentLinkInputEl.select();
  }
});

assignmentLinkQrBtn?.addEventListener('click', () => {
  toggleAssignmentLinkQrCode();
});

assignmentLinkQrPreviewBtn?.addEventListener('click', () => {
  showAssignmentLinkQrLightbox();
});

assignmentLinkQrLightboxCloseBtn?.addEventListener('click', () => {
  hideAssignmentLinkQrLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && assignmentLinkQrLightboxEl && !assignmentLinkQrLightboxEl.hidden) {
    hideAssignmentLinkQrLightbox();
  }
});

assignmentDepotLinkCopyBtn?.addEventListener('click', async () => {
  const url = assignmentDepotLinkInputEl?.value.trim();
  if (!url) {
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    assignmentLinkFeedbackEl.textContent = 'Odkaz na depozitář zkopírován do schránky.';
    assignmentLinkFeedbackEl.hidden = false;
  } catch {
    assignmentDepotLinkInputEl.select();
  }
});

assignmentDepotLinkDownloadBtn?.addEventListener('click', () => {
  downloadDepotLinkFile();
});

assignmentCountInputEl?.addEventListener('input', updateStartButton);
assignmentCountInputEl?.addEventListener('change', updateStartButton);

finishBtn.addEventListener('click', () => {
  viewingSharedAnalysis = false;
  showAnalysisScreen();
});

backBtn.addEventListener('click', showSetupScreen);

analysisBackBtn.addEventListener('click', showSetupScreen);

depotRefreshBtn?.addEventListener('click', () => {
  refreshDepotScreen();
});

analysisDownloadBtn.addEventListener('click', downloadAnalysisCsv);

analysisLinkBtn.addEventListener('click', () => {
  handleAnalysisLinkButtonClick();
});

analysisNameInputEl.addEventListener('input', updateAnalysisLinkButton);

analysisLinkCopyBtn.addEventListener('click', () => {
  copyAnalysisLinkToClipboard();
});

analysisProblemViewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setAnalysisProblemDisplayMode(button.dataset.problemView);
  });
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

setupCategoryRadios.forEach((radio) => {
  radio.addEventListener('change', handleSetupCategoryChange);
});

createAssignmentCheckboxEl?.addEventListener('change', handleCreateAssignmentChange);

exclusiveModeRadios.forEach((radio) => {
  radio.addEventListener('click', handleExclusiveModeSelectionChange);
});

linearEquationActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.disabled || !isLinearEquationProblem(currentProblem)) {
      return;
    }

    setLinearEquationSpecialAnswer(button.dataset.linearEquationAnswer);
  });
});

decimalCompareInequalityButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.disabled || !isCompareProblem(currentProblem) || currentProblem.variant !== 'sign') {
      return;
    }

    setDecimalCompareSelectedSign(button.dataset.decimalCompareSign);
  });
});

async function navigateFromAppHash() {
  const assignmentLoaded = await loadAssignmentFromUrl();
  if (assignmentLoaded) {
    return;
  }

  const depotLoaded = await loadDepotFromUrl();
  if (depotLoaded) {
    return;
  }

  const analysisLoaded = await loadAnalysisFromUrl();
  if (analysisLoaded) {
    showAnalysisScreen();
    return;
  }

  if (getAssignmentIdFromUrl()) {
    showSetupScreen({ preserveAssignmentHash: true });
    showSetupFeedback('Odkaz na úkol je neplatný nebo vypršel.');
    return;
  }

  if (getDepotIdFromUrl()) {
    showSetupScreen({ preserveDepotHash: true });
    showSetupFeedback('Odkaz na depozitář je neplatný nebo vypršel.');
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
}

window.addEventListener('hashchange', () => {
  navigateFromAppHash();
});

(async () => {
  await navigateFromAppHash();
})();
