import { readFileSync, writeFileSync } from 'fs';

const WORKSHEET_SEED = 20240602;

const MODES = [
  { id: 'add', name: 'Sčítání', levels: 5 },
  { id: 'subtract', name: 'Odčítání', levels: 5 },
  { id: 'multiply', name: 'Násobení', levels: 5 },
  { id: 'divide', name: 'Dělení', levels: 5 },
  { id: 'power-ten', name: 'Násobení 10, 100 a 1000', levels: 3 },
  { id: 'divide-power-ten', name: 'Dělení 10, 100 a 1000', levels: 3 },
];

const OPERATION_NAMES = {
  add: 'sčítání',
  subtract: 'odčítání',
  multiply: 'násobení',
  divide: 'dělení',
  'power-ten': '×10·100·1000',
  'divide-power-ten': '÷10·100·1000',
};

const COMBINATIONS = [
  { label: 'Sčítání + odčítání', ops: ['add', 'subtract'], level: 3 },
  { label: 'Sčítání + odčítání', ops: ['add', 'subtract'], level: 4 },
  { label: 'Sčítání + násobení', ops: ['add', 'multiply'], level: 2 },
  { label: 'Sčítání + násobení', ops: ['add', 'multiply'], level: 3 },
  { label: 'Sčítání + dělení', ops: ['add', 'divide'], level: 2 },
  { label: 'Sčítání + dělení', ops: ['add', 'divide'], level: 3 },
  { label: 'Odčítání + násobení', ops: ['subtract', 'multiply'], level: 2 },
  { label: 'Odčítání + násobení', ops: ['subtract', 'multiply'], level: 3 },
  { label: 'Odčítání + dělení', ops: ['subtract', 'divide'], level: 2 },
  { label: 'Odčítání + dělení', ops: ['subtract', 'divide'], level: 3 },
  { label: 'Násobení + dělení', ops: ['multiply', 'divide'], level: 2 },
  { label: 'Násobení + dělení', ops: ['multiply', 'divide'], level: 3 },
  { label: 'Sčítání + odčítání + násobení', ops: ['add', 'subtract', 'multiply'], level: 3 },
  { label: 'Sčítání + odčítání + násobení', ops: ['add', 'subtract', 'multiply'], level: 4 },
  { label: 'Sčítání + odčítání + násobení', ops: ['add', 'subtract', 'multiply'], level: 5 },
  { label: 'Sčítání + odčítání + dělení', ops: ['add', 'subtract', 'divide'], level: 3 },
  { label: 'Sčítání + odčítání + dělení', ops: ['add', 'subtract', 'divide'], level: 4 },
  { label: 'Sčítání + násobení + dělení', ops: ['add', 'multiply', 'divide'], level: 3 },
  { label: 'Sčítání + násobení + dělení', ops: ['add', 'multiply', 'divide'], level: 4 },
  { label: 'Odčítání + násobení + dělení', ops: ['subtract', 'multiply', 'divide'], level: 3 },
  { label: 'Odčítání + násobení + dělení', ops: ['subtract', 'multiply', 'divide'], level: 4 },
  { label: 'Všechny čtyři operace', ops: ['add', 'subtract', 'multiply', 'divide'], level: 3 },
  { label: 'Všechny čtyři operace', ops: ['add', 'subtract', 'multiply', 'divide'], level: 4 },
  { label: 'Všechny čtyři operace', ops: ['add', 'subtract', 'multiply', 'divide'], level: 5 },
  { label: 'Všechny čtyři operace (smíšené 2 des. místa)', ops: ['add', 'subtract', 'multiply', 'divide'], level: 6 },
  { label: 'Sčítání + ×10·100·1000', ops: ['add', 'power-ten'], level: 1 },
  { label: 'Násobení + ×10·100·1000', ops: ['multiply', 'power-ten'], level: 2 },
  { label: 'Dělení + ÷10·100·1000', ops: ['divide', 'divide-power-ten'], level: 1 },
  { label: 'Sčítání + odčítání + ×10·100·1000', ops: ['add', 'subtract', 'power-ten'], level: 2 },
  { label: 'Násobení + dělení + ÷10·100·1000', ops: ['multiply', 'divide', 'divide-power-ten'], level: 2 },
];

function loadEngine(worksheetSeed) {
  const source = readFileSync(new URL('./simulate-user.mjs', import.meta.url), 'utf8')
    .replace(/^const SEED = \d+;/m, `const SEED = ${worksheetSeed};`)
    .replace(/^const selectedOperations = modeArg[\s\S]*?^}/m, '')
    .replace(/^const output = simulate\(\);[\s\S]*$/m, '');

  return new Function(`${source}
    return {
      createSingleOperationProblem,
      createMultiOperationProblem,
      formatProblemText,
      formatDecimal,
    };
  `)();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeCsv(text) {
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function formatProblemWithAnswer(problem, formatProblemText, formatDecimal) {
  const expression = formatProblemText(problem).replace(' = ?', '');
  return `${expression} = ${formatDecimal(problem.answer, problem.answerDecimals)}`;
}

function generateUniqueProblems(createFn, formatProblemText, formatDecimal, count, maxAttempts = 5000) {
  const seen = new Set();
  const rows = [];

  for (let attempt = 0; rows.length < count && attempt < maxAttempts; attempt += 1) {
    const problem = createFn();
    const row = formatProblemWithAnswer(problem, formatProblemText, formatDecimal);
    if (seen.has(row)) {
      continue;
    }
    seen.add(row);
    rows.push({
      problem,
      text: row,
      answer: formatDecimal(problem.answer, problem.answerDecimals),
    });
  }

  if (rows.length < count) {
    throw new Error(`Nepodařilo se vygenerovat ${count} různých úloh (vzniklo ${rows.length}).`);
  }

  return rows;
}

const engine = loadEngine(WORKSHEET_SEED);

const singleModeRows = [];
for (const mode of MODES) {
  for (let level = 0; level < mode.levels; level += 1) {
    const problems = generateUniqueProblems(
      () => engine.createSingleOperationProblem(mode.id, level),
      engine.formatProblemText,
      engine.formatDecimal,
      10,
    );

    problems.forEach((item, index) => {
      singleModeRows.push({
        mode: mode.name,
        level: level + 1,
        number: index + 1,
        task: item.text.replace(` = ${item.answer}`, ' = ?'),
        answer: item.answer,
        full: item.text,
      });
    });
  }
}

const combinationRows = COMBINATIONS.map((combo, index) => {
  const problems = generateUniqueProblems(
    () => engine.createMultiOperationProblem(combo.ops, combo.level),
    engine.formatProblemText,
    engine.formatDecimal,
    1,
  )[0];

  return {
    number: index + 1,
    combination: combo.label,
    operations: combo.ops.map((op) => OPERATION_NAMES[op]).join(', '),
    level: combo.level + 1,
    task: problems.text.replace(` = ${problems.answer}`, ' = ?'),
    answer: problems.answer,
    full: problems.text,
  };
});

const csvLines = [
  'Typ;Mod/Kombinace;Úroveň;Číslo;Úloha;Odpověď',
  ...singleModeRows.map((row) => [
    'Jeden mod',
    row.mode,
    row.level,
    row.number,
    row.task,
    row.answer,
  ].map(escapeCsv).join(';')),
  ...combinationRows.map((row) => [
    'Kombinace',
    row.combination,
    row.level,
    row.number,
    row.task,
    row.answer,
  ].map(escapeCsv).join(';')),
];

writeFileSync(new URL('./ulohy-prehled.csv', import.meta.url), `\uFEFF${csvLines.join('\n')}`, 'utf8');

const html = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Přehled úloh – desetinná čísla</title>
  <style>
    :root {
      color: #222;
      font-family: "Segoe UI", system-ui, sans-serif;
      line-height: 1.45;
    }
    body {
      max-width: 980px;
      margin: 0 auto;
      padding: 24px;
    }
    h1, h2, h3 { line-height: 1.2; }
    h1 { margin-bottom: 8px; }
    .intro { color: #555; margin-bottom: 24px; }
    .toc {
      background: #f7f7f7;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 32px;
    }
    .toc ul { columns: 2; margin: 0; padding-left: 20px; }
    section { margin-bottom: 40px; break-inside: avoid-page; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 24px;
      font-size: 0.95rem;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #f0f0f0; }
    td.num, th.num { width: 48px; text-align: center; }
    td.answer { width: 110px; font-weight: 600; }
    .mode-block { margin-bottom: 28px; }
    @media print {
      body { padding: 0; max-width: none; }
      .no-print { display: none; }
      section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <p class="no-print intro">
    Soubor <strong>ulohy-prehled.csv</strong> lze otevřít v Excelu nebo Numbers.
    Tabulku lze také vytisknout (Ctrl/Cmd+P).
  </p>
  <h1>Přehled úloh – procvičování desetinných čísel</h1>
  <p class="intro">
    ${singleModeRows.length} úloh v jednotlivých módech (10 úloh × každá úroveň)
    a ${combinationRows.length} úloh v kombinacích operací. Všechny odpovědi vycházejí přesně.
  </p>

  <nav class="toc no-print">
    <h2>Obsah</h2>
    <ul>
      ${MODES.map((mode) => `<li><a href="#mode-${mode.id}">${escapeHtml(mode.name)}</a></li>`).join('\n      ')}
      <li><a href="#combinations">Kombinace operací</a></li>
    </ul>
  </nav>

  ${MODES.map((mode) => {
    const modeRows = singleModeRows.filter((row) => row.mode === mode.name);
    const levels = [...new Set(modeRows.map((row) => row.level))].sort((a, b) => a - b);
    return `
  <section id="mode-${mode.id}">
    <h2>${escapeHtml(mode.name)}</h2>
    ${levels.map((level) => {
      const rows = modeRows.filter((row) => row.level === level);
      return `
    <div class="mode-block">
      <h3>Úroveň ${level}</h3>
      <table>
        <thead>
          <tr>
            <th class="num">#</th>
            <th>Úloha</th>
            <th class="answer">Odpověď</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
          <tr>
            <td class="num">${row.number}</td>
            <td>${escapeHtml(row.task)}</td>
            <td class="answer">${escapeHtml(row.answer)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
    }).join('')}
  </section>`;
  }).join('')}

  <section id="combinations">
    <h2>Kombinace operací (${combinationRows.length} úloh)</h2>
    <table>
      <thead>
        <tr>
          <th class="num">#</th>
          <th>Kombinace</th>
          <th class="num">Úroveň</th>
          <th>Úloha</th>
          <th class="answer">Odpověď</th>
        </tr>
      </thead>
      <tbody>
        ${combinationRows.map((row) => `
        <tr>
          <td class="num">${row.number}</td>
          <td>${escapeHtml(row.combination)}</td>
          <td class="num">${row.level}</td>
          <td>${escapeHtml(row.task)}</td>
          <td class="answer">${escapeHtml(row.answer)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </section>
</body>
</html>`;

writeFileSync(new URL('./ulohy-prehled.html', import.meta.url), html, 'utf8');

console.log(`Vygenerováno ${singleModeRows.length} úloh v módech a ${combinationRows.length} kombinací.`);
console.log('Soubory: ulohy-prehled.html, ulohy-prehled.csv');
