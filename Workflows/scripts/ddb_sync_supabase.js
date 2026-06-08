// ═══════════════════════════════════════════════════════════════════
// DDB Roll Sync → Supabase
// Version: 1.0
// 
// WHAT THIS DOES:
// Pulls dice roll history from D&D Beyond's game log API and 
// writes it directly to your Supabase database. Replaces the old
// Excel-based workflow entirely.
//
// HOW TO USE:
// 1. Open D&D Beyond in your browser
// 2. Open DevTools (F12) → Network tab
// 3. Find any request with an "Authorization: Bearer ..." header
// 4. Copy that Bearer token
// 5. Open the Console tab
// 6. Paste this entire script
// 7. Call: await syncAllCampaigns('YOUR_BEARER_TOKEN_HERE')
//    Or for a single campaign: await syncCampaign('Sky Is The Limit', 'YOUR_BEARER_TOKEN')
//
// SAFE TO RE-RUN:
// The script uses upsert with a unique constraint, so re-running 
// with the same data won't create duplicates.
// ═══════════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://vtrtyagltwdrbastpppl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cnR5YWdsdHdkcmJhc3RwcHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTY5NTAsImV4cCI6MjA5MTkzMjk1MH0.hnpwjHGIqiUN_VmmIkOAAFGGCKsyYgl7AO3FW5vDIeM';
const DDB_USER_ID = 107965379;  // Taylor's DDB userId

// ─── Campaign Registry ───────────────────────────────────────────
// game_id values: Replace the 0s with your actual DDB campaign IDs.
// Find them in the URL: dndbeyond.com/campaigns/XXXXXXX
// Or in the _config sheet of your existing Excel file.
const CAMPAIGNS = {
  'Sky Is The Limit':           { supabaseId: 1, gameId: 6907990, status: 'active' },
  'Pacts & Power':              { supabaseId: 2, gameId: 3661522, status: 'active' },
  'Ashfall Brittania':          { supabaseId: 3, gameId: 7170962, status: 'active' },
  'Where the Flowers Remember': { supabaseId: 4, gameId: 0,       status: 'paused' },
};

// ─── Supabase helpers ────────────────────────────────────────────

async function supabaseRequest(path, method, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'resolution=merge-duplicates,return=minimal' : 'return=minimal',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${method} ${path}: ${res.status} ${err}`);
  }
  return res;
}

async function getLastSyncedUnix(campaignId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ddb_rolls?campaign_id=eq.${campaignId}&select=timestamp_unix&order=timestamp_unix.desc&limit=1`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  const data = await res.json();
  return data.length > 0 ? data[0].timestamp_unix : 0;
}

async function upsertRolls(rows) {
  // Supabase REST API has a practical limit per request; batch in chunks of 500
  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    await supabaseRequest('ddb_rolls', 'POST', chunk);
    inserted += chunk.length;
    if (rows.length > BATCH) {
      console.log(`  ↳ Upserted ${inserted}/${rows.length} rolls...`);
    }
  }
  return inserted;
}

async function updateCampaignSync(campaignId, lastUnix) {
  const iso = new Date(lastUnix).toISOString();
  await supabaseRequest(
    `ddb_campaigns?id=eq.${campaignId}`,
    'PATCH',
    { last_synced_iso: iso, last_synced_unix: lastUnix }
  );
}

// ─── DDB API helpers ─────────────────────────────────────────────

async function fetchDDBRolls(gameId, bearerToken, afterUnix = 0) {
  // DDB game log API: paginated, returns newest first
  // We paginate until we hit rolls older than afterUnix
  const allRolls = [];
  let nextUrl = `https://game-log-rest-live.dndbeyond.com/v1/game-log/${gameId}/rolls?userId=${DDB_USER_ID}&limit=100`;
  let page = 0;
  let done = false;

  while (nextUrl && !done) {
    page++;
    console.log(`  ↳ Fetching page ${page}...`);

    const res = await fetch(nextUrl, {
      headers: { 'Authorization': `Bearer ${bearerToken}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`DDB API error: ${res.status} ${errText}`);
    }

    const data = await res.json();
    const rolls = data.data || [];

    if (rolls.length === 0) break;

    for (const roll of rolls) {
      const ts = roll.dateTime ? new Date(roll.dateTime).getTime() : (roll.timestamp || 0);
      if (ts <= afterUnix) {
        done = true;
        break;
      }
      allRolls.push(roll);
    }

    // DDB pagination: check for a "next" link or cursor
    nextUrl = data.pagination?.next || null;

    // Safety valve: don't infinite-loop
    if (page > 200) {
      console.warn('  ⚠️ Hit 200 page safety limit');
      break;
    }

    // Be nice to the API
    await new Promise(r => setTimeout(r, 300));
  }

  return allRolls;
}

function normalizeDDBRoll(raw, campaignId) {
  // Normalize a single DDB roll object into our Supabase schema
  const ts = raw.dateTime ? new Date(raw.dateTime).getTime() : (raw.timestamp || 0);

  // Extract individual die values
  let individualValues = null;
  if (raw.rolls && Array.isArray(raw.rolls)) {
    individualValues = raw.rolls.flatMap(r =>
      (r.dice || []).flatMap(d => d.results || [])
    );
  } else if (raw.result?.values) {
    individualValues = raw.result.values;
  }

  return {
    campaign_id: campaignId,
    timestamp_iso: new Date(ts).toISOString(),
    timestamp_unix: ts,
    character: raw.context?.characterName || raw.characterName || null,
    user_id: raw.userId || raw.context?.userId || null,
    action: raw.context?.action || raw.action || 'custom',
    roll_type: raw.rollType || raw.context?.rollType || 'roll',
    roll_kind: raw.rollKind || raw.context?.rollKind || '',
    dice_notation: raw.diceNotation || raw.notation || null,
    modifier: raw.modifier || 0,
    total: raw.result?.total ?? raw.total ?? null,
    individual_values: individualValues ? JSON.stringify(individualValues) : null,
    source: raw.source || 'web',
    set_id: raw.setId || null,
    roll_id: raw.rollId || raw.id || null,
  };
}

// ─── Main sync functions ─────────────────────────────────────────

async function syncCampaign(campaignName, bearerToken) {
  const cfg = CAMPAIGNS[campaignName];
  if (!cfg) {
    console.error(`Unknown campaign: "${campaignName}". Available: ${Object.keys(CAMPAIGNS).join(', ')}`);
    return;
  }
  if (cfg.status !== 'active') {
    console.log(`⏩ Skipping "${campaignName}" (status: ${cfg.status})`);
    return;
  }
  if (!cfg.gameId || cfg.gameId === 0) {
    console.error(`❌ No gameId set for "${campaignName}". Update the CAMPAIGNS object with the DDB campaign ID.`);
    return;
  }

  console.log(`\n🎲 Syncing: ${campaignName} (gameId: ${cfg.gameId})`);

  // Get the timestamp of the most recent roll we already have
  const lastUnix = await getLastSyncedUnix(cfg.supabaseId);
  if (lastUnix > 0) {
    console.log(`  ↳ Last synced roll: ${new Date(lastUnix).toISOString()}`);
  } else {
    console.log(`  ↳ No existing rolls — full sync`);
  }

  // Fetch new rolls from DDB
  const rawRolls = await fetchDDBRolls(cfg.gameId, bearerToken, lastUnix);
  console.log(`  ↳ Found ${rawRolls.length} new rolls`);

  if (rawRolls.length === 0) {
    console.log(`  ✅ Already up to date`);
    return;
  }

  // Normalize and upsert
  const rows = rawRolls.map(r => normalizeDDBRoll(r, cfg.supabaseId));
  const count = await upsertRolls(rows);

  // Update campaign sync timestamp
  const maxUnix = Math.max(...rows.map(r => r.timestamp_unix));
  await updateCampaignSync(cfg.supabaseId, maxUnix);

  console.log(`  ✅ Synced ${count} rolls. Latest: ${new Date(maxUnix).toISOString()}`);
}

async function syncAllCampaigns(bearerToken) {
  console.log('═══════════════════════════════════════════');
  console.log('DDB Roll Sync → Supabase');
  console.log('═══════════════════════════════════════════');

  for (const name of Object.keys(CAMPAIGNS)) {
    await syncCampaign(name, bearerToken);
  }

  console.log('\n🏁 Sync complete.');
}

// ─── Utility: Import from existing Excel ─────────────────────────
// Use this ONE TIME to bulk-import from your existing .xlsx
// Run in Node.js (not browser), requires: npm install xlsx

async function importFromExcel(filePath) {
  const XLSX = require('xlsx');
  const wb = XLSX.readFile(filePath);

  for (const [sheetName, cfg] of Object.entries(CAMPAIGNS)) {
    const ws = wb.Sheets[sheetName];
    if (!ws) {
      console.log(`⏩ Sheet "${sheetName}" not found, skipping`);
      continue;
    }

    console.log(`\n📊 Importing sheet: ${sheetName}`);
    const jsonRows = XLSX.utils.sheet_to_json(ws);
    console.log(`  ↳ ${jsonRows.length} rows found`);

    if (jsonRows.length === 0) continue;

    // Map Excel column names to our Supabase schema
    const rows = jsonRows.map(row => ({
      campaign_id: cfg.supabaseId,
      timestamp_iso: row.timestamp_iso || new Date(row.timestamp_unix || 0).toISOString(),
      timestamp_unix: row.timestamp_unix || 0,
      character: row.character || null,
      user_id: row.userId || null,
      action: row.action || 'custom',
      roll_type: row.rollType || 'roll',
      roll_kind: row.rollKind || '',
      dice_notation: row.diceNotation || null,
      modifier: row.modifier || 0,
      total: row.total || null,
      individual_values: row.individualValues || null,
      source: row.source || 'web',
      set_id: row.setId || null,
      roll_id: row.rollId || null,
    }));

    const count = await upsertRolls(rows);
    console.log(`  ✅ Imported ${count} rolls`);

    // Update sync timestamp
    const maxUnix = Math.max(...rows.map(r => r.timestamp_unix).filter(Boolean));
    if (maxUnix > 0) {
      await updateCampaignSync(cfg.supabaseId, maxUnix);
    }
  }

  console.log('\n🏁 Excel import complete.');
}

// ─── Quick reference ─────────────────────────────────────────────
console.log(`
╔═══════════════════════════════════════════════════╗
║  DDB Roll Sync → Supabase loaded!                ║
║                                                   ║
║  Usage:                                           ║
║    await syncAllCampaigns('BEARER_TOKEN')         ║
║    await syncCampaign('Sky Is The Limit', 'TOKEN')║
║                                                   ║
║  First time? Upload Excel first:                  ║
║    (in Node.js) await importFromExcel('path.xlsx')║
╚═══════════════════════════════════════════════════╝
`);
