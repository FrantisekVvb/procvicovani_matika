import { readFileSync } from 'node:fs';

const TOTAL_ANSWERS = 50;
const CORRECT_RATE = 0.8;
const SEED = 20250603;
const USER_NAME = 'Fiktivní uživatel – odčítání zlomků';
const CORRECT_STREAK_TO_LEVEL_UP = 2;
const PROBLEMS_BEFORE_RETRY = 3;
const FRACTION_SUBTRACT_MAX_LEVEL = 3;
const FRACTION_SUBTRACT_LCM_MAX = 50;
const FRACTION_SUBTRACT_ANSWER_MAX = 100;

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

let random = createRng(SEED);

function randomWhole(min, max) {
  return min + Math.floor(random() * (max - min + 1));
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
    wholeMinuend,
    wholeSubtrahend: null,
    answerNum: resultNum / common,
    answerDen: resultDen / common,
    level: displayLevel,
    isRetry: false,
  };
}

function generateLevel2Denominators() {
  if (random() < 0.5) {
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
    if (lcm(den1, den2) > FRACTION_SUBTRACT_LCM_MAX) {
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

    if (answer.num > FRACTION_SUBTRACT_ANSWER_MAX || answer.den > FRACTION_SUBTRACT_ANSWER_MAX) {
      continue;
    }

    return terms;
  }

  return null;
}

function createFractionSubtractLevel4Problem() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (random() < 0.5) {
      const terms = [
        randomProperFraction(12),
        randomProperFraction(12),
        randomProperFraction(12),
      ];
      const answer = subtractFractionTerms(terms);
      if (!answer || answer.num > FRACTION_SUBTRACT_ANSWER_MAX || answer.den > FRACTION_SUBTRACT_ANSWER_MAX) {
        continue;
      }
      return buildFractionSubtractProblem(terms, null, 4);
    }

    const fraction = randomProperFraction(12);
    const wholeMinuend = randomWhole(2, 9);
    const problem = buildWholeMinusFractionProblem(wholeMinuend, fraction, 4);
    if (!problem || problem.answerNum > FRACTION_SUBTRACT_ANSWER_MAX || problem.answerDen > FRACTION_SUBTRACT_ANSWER_MAX) {
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

  const terms = generateTwoFractionTermsForLevel(displayLevel);
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

function simulate() {
  random = createRng(SEED);
  const outcomeRandom = createRng(SEED + 999);

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
      problem = createFractionSubtractProblem(difficultyLevel);
    }

    const shouldBeCorrect = outcomePlan[i];
    const userAnswer = shouldBeCorrect
      ? { num: problem.answerNum, den: problem.answerDen }
      : wrongFractionAnswer(problem.answerNum, problem.answerDen);

    if (shouldBeCorrect) {
      correctStreak += 1;
      if (correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < FRACTION_SUBTRACT_MAX_LEVEL) {
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
      formatFractionSubtractProblemText(problem),
      problem.level,
      formatFraction(userAnswer.num, userAnswer.den),
      formatFraction(problem.answerNum, problem.answerDen),
      shouldBeCorrect ? 1 : 0,
    ]);
  }

  const correctCount = results.filter((row) => row[4] === 1).length;
  return {
    payload: {
      n: USER_NAME,
      r: results,
    },
    correctCount,
    total: TOTAL_ANSWERS,
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

const { payload, correctCount, total } = simulate();
const id = await saveAnalysis(payload);
const link = buildShareUrl(id);

console.log(`Analýza: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)} %)`);
console.log(`Odkaz: ${link}`);
