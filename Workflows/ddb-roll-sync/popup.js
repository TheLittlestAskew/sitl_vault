// popup.js — DDB Roll Sync with auto-enrichment

// ─── Config ──────────────────────────────────────────────────────
const SUPABASE_URL = 'https://vtrtyagltwdrbastpppl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cnR5YWdsdHdkcmJhc3RwcHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTY5NTAsImV4cCI6MjA5MTkzMjk1MH0.hnpwjHGIqiUN_VmmIkOAAFGGCKsyYgl7AO3FW5vDIeM';
const DDB_USER_ID = 107965379;
const TOKEN_MAX_AGE_MS = 4 * 60 * 1000;

const CAMPAIGNS = {
  'Sky Is The Limit':           { supabaseId: 1, gameId: 6907990, status: 'active' },
  'Pacts & Power':              { supabaseId: 2, gameId: 3661522, status: 'active' },
  'Ashfall Brittania':          { supabaseId: 3, gameId: 7170962, status: 'active' },
  'Where the Flowers Remember': { supabaseId: 4, gameId: 0,       status: 'paused' },
};

// ─── Auto-enrichment lookups ─────────────────────────────────────
const SKILL_ABILITY = {
  'acrobatics':'DEX','animal handling':'WIS','arcana':'INT','athletics':'STR',
  'deception':'CHA','history':'INT','insight':'WIS','intimidation':'CHA',
  'investigation':'INT','medicine':'WIS','nature':'INT','perception':'WIS',
  'performance':'CHA','persuasion':'CHA','religion':'INT',
  'sleight of hand':'DEX','stealth':'DEX','survival':'WIS',
};
const SKILL_NAMES = Object.keys(SKILL_ABILITY);

const ABILITY_NAMES = ['strength','dexterity','constitution','intelligence','wisdom','charisma',
                       'str','dex','con','int','wis','cha'];
const ABILITY_SHORT = {
  'strength':'STR','str':'STR','dexterity':'DEX','dex':'DEX',
  'constitution':'CON','con':'CON','intelligence':'INT','int':'INT',
  'wisdom':'WIS','wis':'WIS','charisma':'CHA','cha':'CHA',
};

// Known spells (from your Excel data + common cantrips/spells)
const KNOWN_SPELLS = new Set([
  'aid','burning hands','channel divinity: radiance of the dawn','chill touch',
  'chromatic orb','cure wounds','divine intervention','eldritch blast',
  'ensnaring strike','fire bolt','fireball','flame blade','flaming sphere',
  'frostbite','guiding bolt','hail of thorns','halo of spores','healing word',
  'holy word','hunter\'s mark','lightning bolt','magic missile','magic weapon',
  'mass cure wounds','mass healing word','mind sliver','moonbeam','poison spray',
  'prayer of healing','primal savagery','raulothim\'s psychic lance','sacred flame',
  'scorching ray','searing smite','shatter','shillelagh','shocking grasp',
  'spell attack','spellfire flare','spirit guardians','spiritual weapon',
  'starry wisp','steps of the fey','tasha\'s mind whip','thorn whip',
  'thunderwave','toll the dead','vicious mockery','wall of fire','witch bolt',
]);

// Known feats/features
const KNOWN_FEATS = new Set([
  'bardic inspiration','breath weapon','force breath','lunar vitality',
  'sneak attack','stone\'s endurance','superiority dice','tactical mind',
]);

function enrichRoll(row) {
  // row has: action, roll_type, roll_kind, dice_notation, modifier, total, individual_values
  const action = (row.action || 'custom').trim();
  const actionLower = action.toLowerCase().replace(/\s*\([^)]*\)\s*/g, '').replace(/[*,]/g, '').trim();
  const rollType = (row.roll_type || 'roll').toLowerCase();

  const enriched = {};

  // dice_raw_total
  if (row.total != null) {
    enriched.dice_raw_total = (row.total || 0) - (row.modifier || 0);
  }

  // Parse dice_type and dice_count from dice_notation (e.g. "1d20+5" or "2d6")
  const notation = row.dice_notation || '';
  const diceMatch = notation.match(/(\d+)d(\d+)/i);
  if (diceMatch) {
    enriched.dice_count = parseInt(diceMatch[1], 10);
    enriched.dice_type = 'd' + diceMatch[2];
  }

  // nat20/nat1 detection (only for single d20 rolls)
  if (enriched.dice_type === 'd20' && enriched.dice_count === 1) {
    const rawVal = enriched.dice_raw_total;
    enriched.is_nat_20 = rawVal === 20;
    enriched.is_nat_1 = rawVal === 1;
  }

  // ─── Classification logic ───────────────────────────────────
  // 1. Skills
  const skillMatch = SKILL_NAMES.find(s => actionLower === s || actionLower.startsWith(s + ' '));
  if (skillMatch) {
    enriched.action_category = 'Skill';
    enriched.roll_subtype = 'skill check';
    enriched.skill = skillMatch.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    enriched.ability = SKILL_ABILITY[skillMatch];
    return enriched;
  }

  // 2. Initiative
  if (actionLower === 'initiative') {
    enriched.action_category = 'Initiative';
    enriched.roll_subtype = 'Ability Check';
    enriched.ability = 'DEX';
    return enriched;
  }

  // 3. Ability checks and saves
  for (const ab of ABILITY_NAMES) {
    if (actionLower === ab || actionLower.startsWith(ab + ' ')) {
      enriched.ability = ABILITY_SHORT[ab];
      if (actionLower.includes('save') || actionLower.includes('saving')) {
        enriched.action_category = 'Ability';
        enriched.roll_subtype = 'Saving Throw';
      } else {
        enriched.action_category = 'Ability';
        enriched.roll_subtype = 'Ability Check';
      }
      return enriched;
    }
  }
  // Short-form ability saves from DDB (e.g. action="wis", roll_type="save")
  if (ABILITY_SHORT[actionLower] && rollType === 'save') {
    enriched.action_category = 'Ability';
    enriched.roll_subtype = 'Saving Throw';
    enriched.ability = ABILITY_SHORT[actionLower];
    return enriched;
  }
  if (ABILITY_SHORT[actionLower] && rollType === 'check') {
    enriched.action_category = 'Ability';
    enriched.roll_subtype = 'Ability Check';
    enriched.ability = ABILITY_SHORT[actionLower];
    return enriched;
  }

  // 4. Death Saving Throw
  if (actionLower === 'death saving throw') {
    enriched.action_category = 'Death Saving Throw';
    enriched.roll_subtype = 'Saving Throw';
    return enriched;
  }

  // 5. Hit Dice
  if (actionLower.startsWith('hit dic') || actionLower === 'hit die' || actionLower === 'abovevtt') {
    enriched.action_category = 'Hit Dice';
    enriched.roll_subtype = 'heal';
    return enriched;
  }

  // 6. Spells
  if (KNOWN_SPELLS.has(actionLower)) {
    enriched.action_category = 'Spell';
    enriched.roll_subtype = rollType; // preserve to hit / damage / heal
    enriched.spell = action.replace(/\s*\([^)]*\)\s*$/, '').trim();
    return enriched;
  }

  // 7. Known feats/features
  const featMatch = [...KNOWN_FEATS].find(f => actionLower === f || actionLower.startsWith(f));
  if (featMatch) {
    enriched.action_category = 'Feat';
    enriched.roll_subtype = rollType;
    enriched.feat = featMatch.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    return enriched;
  }

  // 8. Potion of Healing
  if (actionLower === 'potion of healing') {
    enriched.action_category = 'Object Interaction';
    enriched.roll_subtype = 'heal';
    enriched.item = 'Potion of Healing';
    return enriched;
  }

  // 9. Weapons (anything with roll_type "to hit" or "damage" that isn't a spell/feat/skill)
  if (rollType === 'to hit' || rollType === 'damage') {
    enriched.action_category = 'Attack';
    enriched.roll_subtype = rollType;
    if (actionLower !== 'custom' && actionLower !== 'roll') {
      enriched.weapon = action.replace(/\s*\([^)]*\)\s*$/, '').replace(/[*]/g, '').trim();
    }
    return enriched;
  }

  // 10. Ability Score rolls (character creation)
  if (actionLower === 'ability score') {
    enriched.action_category = 'Custom';
    enriched.roll_subtype = 'roll';
    return enriched;
  }

  // 11. Fallback: Custom
  enriched.action_category = 'Custom';
  enriched.roll_subtype = rollType || 'roll';
  return enriched;
}

// ─── Logging ─────────────────────────────────────────────────────
const logEl = document.getElementById('log');
function log(msg, type = 'info') {
  const line = document.createElement('div');
  line.className = type;
  line.textContent = msg;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}
function clearLog() { logEl.innerHTML = ''; }

// ─── UI ──────────────────────────────────────────────────────────
function renderCampaigns() {
  const container = document.getElementById('campaign-list');
  container.innerHTML = '';
  for (const [name, cfg] of Object.entries(CAMPAIGNS)) {
    const row = document.createElement('div');
    row.className = 'campaign-row';
    row.id = `campaign-${cfg.supabaseId}`;
    row.innerHTML = `
      <span class="name">${name}</span>
      <span class="badge ${cfg.status}">${cfg.status}</span>
      <span class="sync-status" id="status-${cfg.supabaseId}">—</span>
    `;
    container.appendChild(row);
  }
}

function setCampaignStatus(id, msg, type = 'info') {
  const el = document.getElementById(`status-${id}`);
  if (el) {
    el.textContent = msg;
    el.style.color = type === 'ok' ? '#4d4' : type === 'error' ? '#f66' : '#888';
  }
}

function updateTokenStatus(token, capturedAt) {
  const el = document.getElementById('token-status');
  const btn = document.getElementById('btn-sync-all');
  if (!token) {
    el.className = 'token-status warn';
    el.textContent = '⏳ No token yet — open any D&D Beyond campaign page.';
    btn.disabled = true;
    return;
  }
  const ageMin = Math.round((Date.now() - (capturedAt || 0)) / 60000);
  const fresh = (Date.now() - (capturedAt || 0)) < TOKEN_MAX_AGE_MS;
  el.className = fresh ? 'token-status ok' : 'token-status warn';
  el.textContent = fresh
    ? `✅ Token ready (${ageMin}m old)`
    : `⚠️ Token is ${ageMin}m old — will auto-refresh on sync.`;
  btn.disabled = false;
}

// ─── Token management ────────────────────────────────────────────
async function ensureFreshToken() {
  const result = await chrome.storage.local.get(['ddb_bearer_token', 'ddb_token_captured_at']);
  const age = Date.now() - (result?.ddb_token_captured_at || 0);
  if (result?.ddb_bearer_token && age < TOKEN_MAX_AGE_MS) return result.ddb_bearer_token;

  log('  ↳ Refreshing token…', 'warn');
  const refreshed = await new Promise(resolve => {
    chrome.runtime.sendMessage({ type: 'refreshToken' }, resolve);
  });
  if (refreshed?.error) throw new Error(`Token refresh failed: ${refreshed.error}`);
  if (!refreshed?.ddb_bearer_token) throw new Error('No token captured. Open a DDB campaign page first.');
  log('  ↳ Fresh token captured', 'ok');
  updateTokenStatus(refreshed.ddb_bearer_token, refreshed.ddb_token_captured_at);
  return refreshed.ddb_bearer_token;
}

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
    { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
  );
  const data = await res.json();
  return data.length > 0 ? data[0].timestamp_unix : 0;
}

async function upsertRolls(rows) {
  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    await supabaseRequest('ddb_rolls', 'POST', chunk);
    inserted += chunk.length;
    if (rows.length > BATCH) log(`  ↳ Upserted ${inserted}/${rows.length}…`);
  }
  return inserted;
}

async function updateCampaignSync(campaignId, lastUnix) {
  await supabaseRequest(
    `ddb_campaigns?id=eq.${campaignId}`, 'PATCH',
    { last_synced_iso: new Date(lastUnix).toISOString(), last_synced_unix: lastUnix }
  );
}

// ─── DDB fetch via background proxy ─────────────────────────────
async function fetchDDBPage(url, token) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'fetchDDB', url, token }, (response) => {
      if (response?.error) reject(new Error(response.error));
      else resolve(response.data);
    });
  });
}

async function fetchDDBRolls(gameId, token, afterUnix = 0) {
  const allRolls = [];
  let nextUrl = `https://game-log-rest-live.dndbeyond.com/v1/getmessages?gameId=${gameId}&userId=${DDB_USER_ID}`;
  let page = 0;
  let done = false;

  while (nextUrl && !done) {
    page++;
    log(`  ↳ Fetching page ${page}…`);

    const data = await fetchDDBPage(nextUrl, token);
    const messages = data.data || [];
    if (messages.length === 0) break;

    for (const msg of messages) {
      if (msg.eventType !== 'dice/roll/fulfilled') continue;
      const ts = msg.dateTime ? parseInt(msg.dateTime, 10) : 0;
      if (afterUnix > 0 && ts <= afterUnix) { done = true; break; }

      const rollData = msg.data || {};
      const rolls = rollData.rolls || [];

      for (const roll of rolls) {
        allRolls.push({
          dateTime: msg.dateTime,
          gameId: msg.gameId,
          userId: msg.userId,
          source: msg.source || 'Web',
          context: {
            characterName: rollData.context?.name || null,
            action: rollData.action || 'custom',
            userId: parseInt(msg.userId, 10),
          },
          rollId: rollData.rollId || msg.id,
          rollType: roll.rollType || 'roll',
          rollKind: roll.rollKind || '',
          diceNotation: roll.result?.text || null,
          modifier: roll.diceNotation?.constant || 0,
          result: {
            total: roll.result?.total ?? null,
            values: roll.result?.values || null,
          },
          setId: rollData.setId || null,
          // Pass the full dice notation object for parsing
          _diceNotationObj: roll.diceNotation || null,
        });
      }
    }

    if (data.lastKey) {
      const key = data.lastKey;
      const lastEvalKey = `${key.dateTime_eventType_userId || key.dateTime + '-dice/roll/fulfilled-' + key.userId}`;
      nextUrl = `https://game-log-rest-live.dndbeyond.com/v1/getmessages?lastEvaluatedKey=${encodeURIComponent(lastEvalKey)}&gameId=${gameId}&userId=${DDB_USER_ID}`;
    } else {
      nextUrl = null;
    }

    if (page > 200) { log('  ⚠️ Hit 200 page limit', 'warn'); break; }
    await new Promise(r => setTimeout(r, 300));
  }

  return allRolls;
}

function normalizeDDBRoll(raw, campaignId) {
  const ts = raw.dateTime ? parseInt(raw.dateTime, 10) : 0;
  let individualValues = null;
  if (raw.result?.values) {
    individualValues = raw.result.values;
  }

  // Build the base notation string from the dice notation object
  let diceNotationStr = raw.diceNotation || null;
  const diceObj = raw._diceNotationObj;
  let parsedDiceType = null;
  let parsedDiceCount = null;
  if (diceObj && diceObj.set && diceObj.set.length > 0) {
    const firstSet = diceObj.set[0];
    parsedDiceType = firstSet.dieType || null;
    parsedDiceCount = firstSet.count || null;
    if (parsedDiceType && parsedDiceCount && diceObj.constant != null) {
      diceNotationStr = diceNotationStr || `${parsedDiceCount}${parsedDiceType}${diceObj.constant > 0 ? '+' + diceObj.constant : diceObj.constant < 0 ? diceObj.constant : ''}`;
    }
  }

  const base = {
    campaign_id: campaignId,
    timestamp_iso: new Date(ts).toISOString(),
    timestamp_unix: ts,
    character: raw.context?.characterName || null,
    user_id: raw.context?.userId || (raw.userId ? parseInt(raw.userId, 10) : null),
    action: raw.context?.action || raw.action || 'custom',
    roll_type: raw.rollType || 'roll',
    roll_kind: raw.rollKind || '',
    dice_notation: diceNotationStr,
    modifier: raw.modifier || 0,
    total: raw.result?.total ?? null,
    individual_values: individualValues ? JSON.stringify(individualValues) : null,
    source: (raw.source || 'web').toLowerCase(),
    set_id: raw.setId || null,
    roll_id: raw.rollId || null,
  };

  // Auto-enrich
  const enrichment = enrichRoll(base);
  return { ...base, ...enrichment };
}

// ─── Sync ────────────────────────────────────────────────────────
async function syncCampaign(campaignName, token) {
  const cfg = CAMPAIGNS[campaignName];
  if (cfg.status !== 'active') { setCampaignStatus(cfg.supabaseId, 'skipped'); return; }
  if (!cfg.gameId) { log(`❌ No gameId for "${campaignName}"`, 'error'); setCampaignStatus(cfg.supabaseId, 'no gameId', 'error'); return; }

  log(`\n🎲 ${campaignName}`, 'head');
  setCampaignStatus(cfg.supabaseId, 'syncing…');

  try {
    const lastUnix = await getLastSyncedUnix(cfg.supabaseId);
    log(lastUnix > 0
      ? `  ↳ Last sync: ${new Date(lastUnix).toISOString()}`
      : '  ↳ Full sync (no existing data)');

    const rawRolls = await fetchDDBRolls(cfg.gameId, token, lastUnix);
    log(`  ↳ ${rawRolls.length} new rolls found`);

    if (rawRolls.length === 0) {
      log('  ✅ Up to date', 'ok');
      setCampaignStatus(cfg.supabaseId, 'up to date', 'ok');
      return;
    }

    const rows = rawRolls.map(r => normalizeDDBRoll(r, cfg.supabaseId));
    const count = await upsertRolls(rows);
    const maxUnix = Math.max(...rows.map(r => r.timestamp_unix));
    await updateCampaignSync(cfg.supabaseId, maxUnix);

    log(`  ✅ Synced ${count} rolls (auto-enriched)`, 'ok');
    setCampaignStatus(cfg.supabaseId, `+${count}`, 'ok');
  } catch (e) {
    log(`  ❌ ${e.message}`, 'error');
    setCampaignStatus(cfg.supabaseId, 'error', 'error');
  }
}

async function syncAll() {
  const btn = document.getElementById('btn-sync-all');
  btn.disabled = true;
  btn.textContent = '⏳ Syncing…';
  clearLog();
  log('══════════════════════════════', 'head');
  log('DDB Roll Sync → Supabase', 'head');
  log('══════════════════════════════', 'head');

  try {
    const token = await ensureFreshToken();
    for (const name of Object.keys(CAMPAIGNS)) {
      await syncCampaign(name, token);
    }
  } catch (e) {
    log(`\n❌ ${e.message}`, 'error');
  }

  log('\n🏁 Sync complete!', 'ok');
  btn.disabled = false;
  btn.textContent = '⚡ Sync All Campaigns';
}

// ─── Init ────────────────────────────────────────────────────────
renderCampaigns();
chrome.storage.local.get(['ddb_bearer_token', 'ddb_token_captured_at'], (r) => {
  updateTokenStatus(r.ddb_bearer_token, r.ddb_token_captured_at);
});
document.getElementById('btn-sync-all').addEventListener('click', syncAll);
document.getElementById('btn-clear-log').addEventListener('click', clearLog);
