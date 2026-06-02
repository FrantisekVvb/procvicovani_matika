import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF ?? 'jjpiguuubvmiobmixwgh';
const PROJECT_URL = process.env.SUPABASE_URL ?? `https://${PROJECT_REF}.supabase.co`;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;

function writeConfig(url, anonKey) {
  const contents = `window.SUPABASE_CONFIG = {
  url: '${url}',
  anonKey: '${anonKey}',
};
`;
  writeFileSync(new URL('./supabase-config.js', import.meta.url), contents, 'utf8');
  console.log('supabase-config.js updated.');
}

async function runSchemaSql() {
  const query = readFileSync(new URL('./supabase/schema.sql', import.meta.url), 'utf8');
  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SQL failed (${response.status}): ${body}`);
  }
}

async function fetchAnonKey() {
  if (ANON_KEY) {
    return ANON_KEY;
  }

  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API keys fetch failed (${response.status}): ${body}`);
  }

  const keys = await response.json();
  const anonKey = keys.find((key) => key.name === 'anon')?.api_key;
  if (!anonKey) {
    throw new Error('Anon key not found.');
  }

  return anonKey;
}

async function main() {
  if (!ACCESS_TOKEN) {
    console.error('Missing SUPABASE_ACCESS_TOKEN.');
    console.error('Create one at https://supabase.com/dashboard/account/tokens');
    console.error('Then run: SUPABASE_ACCESS_TOKEN=... node setup-supabase.mjs');
    process.exit(1);
  }

  console.log(`Applying schema to ${PROJECT_REF}…`);
  await runSchemaSql();

  const anonKey = await fetchAnonKey();
  writeConfig(PROJECT_URL, anonKey);

  console.log('Done. Analyses table is ready.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
