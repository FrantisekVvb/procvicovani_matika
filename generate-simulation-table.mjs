import { readFileSync, writeFileSync } from 'fs';

const TOTAL_ANSWERS = 100;
const ALL_OPERATIONS = ['add', 'subtract', 'multiply', 'divide', 'power-ten', 'divide-power-ten'];

const SIMULATIONS = [
  { seed: 42, correctRate: 0.8, outputBasename: 'simulace-vsechny-operace-100' },
  { seed: 172, correctRate: 0.8, outputBasename: 'simulace-vsechny-operace-100-2' },
  { seed: 314, correctRate: 1, outputBasename: 'simulace-vsechny-operace-100-3' },
];

function simulateFixedDifficulty(seed, correctRate) {
  const source = readFileSync(new URL('./simulate-user.mjs', import.meta.url), 'utf8')
    .replace(/^const SEED = \d+;/m, `const SEED = ${seed};`)
    .replace(/^const TOTAL_ANSWERS = \d+;/m, `const TOTAL_ANSWERS = ${TOTAL_ANSWERS};`)
    .replace(/^const CORRECT_RATE = [\d.]+;/m, `const CORRECT_RATE = ${correctRate};`)
    .replace(/^const selectedOperations = modeArg[\s\S]*?^}/m, `const selectedOperations = ${JSON.stringify(ALL_OPERATIONS)};`)
    .replace(
      /if \(correctStreak >= CORRECT_STREAK_TO_LEVEL_UP && difficultyLevel < getMaxDifficultyLevel\(\)\) \{[\s\S]*?\}/,
      '// obtížnost se nemění',
    )
    .replace(
      /if \(difficultyLevel > 0\) \{\s*difficultyLevel -= 1;\s*\}/,
      '// obtížnost se nemění',
    )
    .replace(
      'let difficultyLevel = 0;',
      'let difficultyLevel = getMaxDifficultyLevel();',
    )
    .replace(
      'aktivniObtiznostPo: difficultyLevel + 1,',
      'aktivniObtiznostPo: getMaxDifficultyLevel() + 1,',
    )
    .replace(/^const output = simulate\(\);[\s\S]*$/m, '');

  const run = new Function(`${source}
    return simulate();
  `);

  return run();
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeCsv(text) {
  const value = String(text);
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function rowClass(result, retry) {
  if (result === 'špatně') return 'row--wrong';
  if (retry === 'ano') return 'row--retry';
  return '';
}

function writeSimulation(data, outputBasename) {
  const correctCount = data.correctCount;
  const successRate = Math.round((correctCount / data.total) * 100);

  const csvLines = [
    'Číslo;Operace;Úloha;Úroveň;Opakování;Správná odpověď;Odpověď uživatele;Výsledek;Aktivní obtížnost po',
    ...data.results.map((row) => [
      row.cislo,
      row.operace,
      row.uloha,
      row.uroven,
      row.opakovani,
      row.spravnaOdpoved,
      row.odpovedUzivatele,
      row.vysledek,
      row.aktivniObtiznostPo,
    ].map(escapeCsv).join(';')),
  ];

  writeFileSync(
    new URL(`./${outputBasename}.csv`, import.meta.url),
    `\uFEFF${csvLines.join('\n')}`,
    'utf8',
  );

  const html = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulace fiktivního uživatele – všechny operace</title>
  <style>
    :root {
      color: #222;
      font-family: "Segoe UI", system-ui, sans-serif;
      line-height: 1.45;
    }
    body { max-width: 1100px; margin: 0 auto; padding: 24px; }
    h1 { margin-bottom: 8px; }
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin: 16px 0 24px;
    }
    .stat {
      background: #f7f7f7;
      border-radius: 8px;
      padding: 12px 16px;
      min-width: 140px;
    }
    .stat strong { display: block; font-size: 1.25rem; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 7px 9px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #f0f0f0; }
    td.num, th.num { text-align: center; white-space: nowrap; }
    tr.row--wrong { background: #ffebe9; }
    tr.row--retry { background: #fff8c5; }
    @media print {
      body { padding: 0; max-width: none; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <p class="no-print" style="color:#555;">Ke stažení je také soubor <strong>${outputBasename}.csv</strong>.</p>
  <h1>Simulace fiktivního uživatele</h1>
  <p>Všechny početní operace, ${data.total} odpovědí, úspěšnost ${successRate}&nbsp;%, obtížnost neměněna podle výsledků.</p>

  <div class="summary">
    <div class="stat"><span>Správně</span><strong>${correctCount} / ${data.total}</strong></div>
    <div class="stat"><span>Úspěšnost</span><strong>${successRate} %</strong></div>
    <div class="stat"><span>Operace</span><strong>${ALL_OPERATIONS.length}</strong></div>
    <div class="stat"><span>Aktivní obtížnost</span><strong>${data.results[0]?.aktivniObtiznostPo ?? '—'}</strong></div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="num">#</th>
        <th>Operace</th>
        <th>Úloha</th>
        <th class="num">Úroveň</th>
        <th class="num">Opak.</th>
        <th>Správná odpověď</th>
        <th>Odpověď uživatele</th>
        <th>Výsledek</th>
      </tr>
    </thead>
    <tbody>
      ${data.results.map((row) => `
      <tr class="${rowClass(row.vysledek, row.opakovani)}">
        <td class="num">${row.cislo}</td>
        <td>${escapeHtml(row.operace)}</td>
        <td>${escapeHtml(row.uloha)}</td>
        <td class="num">${row.uroven}</td>
        <td class="num">${escapeHtml(row.opakovani)}</td>
        <td>${escapeHtml(row.spravnaOdpoved)}</td>
        <td>${escapeHtml(row.odpovedUzivatele)}</td>
        <td>${escapeHtml(row.vysledek)}</td>
      </tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;

  writeFileSync(new URL(`./${outputBasename}.html`, import.meta.url), html, 'utf8');

  console.log(`${outputBasename}: ${correctCount}/${data.total} správně (${successRate} %)`);
}

for (const simulation of SIMULATIONS) {
  writeSimulation(
    simulateFixedDifficulty(simulation.seed, simulation.correctRate),
    simulation.outputBasename,
  );
}

console.log(`Soubory: ${SIMULATIONS.map((s) => `${s.outputBasename}.html, ${s.outputBasename}.csv`).join('; ')}`);
