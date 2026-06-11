#!/usr/bin/env node
/*
 * DDB Party Sheet Sync  —  public character fetch (no login)
 * ----------------------------------------------------------
 *   node ddb_party_sync.js
 *
 * Reads ddb_party.json (a registry of PC name -> DDB characterId) and, for each
 * character whose DDB sheet is set to Public or Campaign-Only, pulls the full
 * sheet JSON from D&D Beyond's public character service and writes:
 *
 *   03-Characters/PCs/Party Character Sheets/_raw/<Name>.json   (full raw JSON)
 *   03-Characters/PCs/Party Character Sheets/<Name> (DDB).md    (readable sheet)
 *
 * Private sheets return HTTP 403 and are skipped with a note — nothing crashes.
 * Re-running overwrites the two files; it never touches your hand-written PC
 * notes (Aeolus.md etc.). The raw JSON is always the source of truth; the
 * markdown is a best-effort render (DDB doesn't expose a fully-computed sheet,
 * so a few derived numbers — AC especially — are approximate; verify if it matters).
 *
 * This is the "party info" companion to ddb_sync_supabase.js (which does rolls).
 * No auth, no Cobalt token: it only ever sees what players have shared. To also
 * pull Private sheets you'd add a Cobalt-token auth step (see DDB_PARTY_SYNC.md).
 *
 * Requires: Node 18+ (built-in fetch). No npm deps.
 */

const path = require('path');
const fs = require('fs');

const VAULT_ROOT = 'C:\\Users\\theli\\sitl_vault';
const CONFIG     = path.join(__dirname, 'ddb_party.json');
const OUT_DIR    = path.join(VAULT_ROOT, '03-Characters', 'PCs', 'Party Character Sheets');
const RAW_DIR    = path.join(OUT_DIR, '_raw');
const CHAR_API   = (id) => `https://character-service.dndbeyond.com/character/v5/character/${id}`;

const ABILITIES = [
  { id: 1, key: 'strength',     abbr: 'STR' },
  { id: 2, key: 'dexterity',    abbr: 'DEX' },
  { id: 3, key: 'constitution', abbr: 'CON' },
  { id: 4, key: 'intelligence', abbr: 'INT' },
  { id: 5, key: 'wisdom',       abbr: 'WIS' },
  { id: 6, key: 'charisma',     abbr: 'CHA' },
];

const log = (m) => console.log(m);
const mod = (score) => Math.floor((score - 10) / 2);
const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);
const safe = (s) => String(s).replace(/[\\/:*?"<>|]/g, '_').trim();

// Walk every modifier bucket (race/class/background/item/feat/condition) and
// collect entries matching a predicate — used to fold ability-score bonuses in.
function allModifiers(char) {
  const m = char.modifiers || {};
  return Object.values(m).filter(Array.isArray).flat();
}

function computeAbility(char, ab) {
  const find = (arr) => (arr || []).find((s) => s && s.id === ab.id);
  const base = find(char.stats)?.value ?? 10;
  const bonus = find(char.bonusStats)?.value ?? 0;
  const override = find(char.overrideStats)?.value;

  let modSum = 0;
  let setVal = null;
  for (const m of allModifiers(char)) {
    if (m.subType === `${ab.key}-score`) {
      if (m.type === 'bonus' && typeof m.value === 'number') modSum += m.value;
      if (m.type === 'set' && typeof m.value === 'number') setVal = Math.max(setVal ?? 0, m.value);
    }
  }
  let score = base + bonus + modSum;
  if (setVal !== null) score = Math.max(score, setVal);
  if (override !== null && override !== undefined) score = override;
  return score;
}

function totalLevel(char) {
  return (char.classes || []).reduce((n, c) => n + (c.level || 0), 0);
}

function profBonus(level) {
  return Math.ceil(level / 4) + 1;
}

function classLine(char) {
  return (char.classes || [])
    .map((c) => {
      const name = c.definition?.name || 'Class';
      const sub = c.subclassDefinition?.name ? ` (${c.subclassDefinition.name})` : '';
      return `${name}${sub} ${c.level || '?'}`;
    })
    .join(' / ') || '—';
}

function raceLine(char) {
  return char.race?.fullName || char.race?.baseRaceName || char.race?.baseName || '—';
}

function backgroundLine(char) {
  return char.background?.definition?.name
      || char.background?.customBackground?.name
      || '—';
}

function maxHp(char, conMod, level) {
  if (typeof char.overrideHitPoints === 'number') return char.overrideHitPoints;
  const base = char.baseHitPoints || 0;
  const bonus = char.bonusHitPoints || 0;
  return base + conMod * level + bonus;
}

function spellNames(char) {
  const out = [];
  const push = (arr) => (arr || []).forEach((s) => {
    const def = s.definition || s;
    if (def?.name) out.push({ name: def.name, level: def.level ?? 0 });
  });
  const sp = char.spells || {};
  ['race', 'class', 'background', 'item', 'feat'].forEach((k) => push(sp[k]));
  (char.classSpells || []).forEach((cs) => push(cs.spells));
  // de-dup by name
  const seen = new Set();
  return out.filter((s) => (seen.has(s.name) ? false : seen.add(s.name)));
}

function renderMarkdown(char, meta) {
  const level = totalLevel(char);
  const pb = profBonus(level);
  const scores = {};
  ABILITIES.forEach((ab) => (scores[ab.abbr] = computeAbility(char, ab)));
  const conMod = mod(scores.CON);
  const hp = maxHp(char, conMod, level);

  const L = [];
  L.push('---');
  L.push('type: pc-sheet');
  L.push('source: dndbeyond');
  L.push(`ddb_character_id: ${meta.characterId}`);
  L.push(`ddb_url: https://www.dndbeyond.com/characters/${meta.characterId}`);
  L.push(`synced: ${meta.syncedIso}`);
  L.push(`generated_by: ddb_party_sync.js`);
  L.push('---');
  L.push('');
  L.push(`# ${char.name || meta.name} — DDB Sheet`);
  L.push('');
  L.push('> [!warning] Auto-generated from D&D Beyond — do not hand-edit (overwritten on each sync).');
  L.push(`> Some derived values are approximate. Source of truth: \`_raw/${safe(meta.name)}.json\`.`);
  L.push('');
  L.push(`- **Race:** ${raceLine(char)}`);
  L.push(`- **Class:** ${classLine(char)}`);
  L.push(`- **Total Level:** ${level}  ·  **Proficiency Bonus:** ${signed(pb)}`);
  L.push(`- **Background:** ${backgroundLine(char)}`);
  L.push(`- **Max HP (approx):** ${hp}`);
  if (char.currencies) {
    const c = char.currencies;
    L.push(`- **Currency:** ${c.pp || 0}pp ${c.gp || 0}gp ${c.ep || 0}ep ${c.sp || 0}sp ${c.cp || 0}cp`);
  }
  L.push('');
  L.push('## Ability Scores');
  L.push('');
  L.push('| Ability | Score | Mod |');
  L.push('| --- | :---: | :---: |');
  ABILITIES.forEach((ab) => {
    const s = scores[ab.abbr];
    L.push(`| ${ab.abbr} | ${s} | ${signed(mod(s))} |`);
  });
  L.push('');

  const inv = (char.inventory || []).filter((i) => i.definition?.name);
  if (inv.length) {
    L.push(`## Inventory (${inv.length})`);
    L.push('');
    inv.forEach((i) => {
      const qty = i.quantity && i.quantity > 1 ? ` ×${i.quantity}` : '';
      const eq = i.equipped ? ' *(equipped)*' : '';
      L.push(`- ${i.definition.name}${qty}${eq}`);
    });
    L.push('');
  }

  const spells = spellNames(char);
  if (spells.length) {
    L.push(`## Spells (${spells.length})`);
    L.push('');
    const byLevel = {};
    spells.forEach((s) => ((byLevel[s.level] ||= []).push(s.name)));
    Object.keys(byLevel).map(Number).sort((a, b) => a - b).forEach((lv) => {
      const label = lv === 0 ? 'Cantrips' : `Level ${lv}`;
      L.push(`- **${label}:** ${byLevel[lv].sort().join(', ')}`);
    });
    L.push('');
  }

  if (Array.isArray(char.conditions) && char.conditions.length) {
    L.push('## Conditions');
    L.push('');
    char.conditions.forEach((c) => L.push(`- ${c.definition?.name || c.id}`));
    L.push('');
  }

  if (char.notes?.personalPossessions || char.notes?.otherNotes || char.traits?.personalityTraits) {
    L.push('## Notes / Traits');
    L.push('');
    const t = char.traits || {};
    if (t.personalityTraits) L.push(`- **Personality:** ${t.personalityTraits}`);
    if (t.ideals)  L.push(`- **Ideals:** ${t.ideals}`);
    if (t.bonds)   L.push(`- **Bonds:** ${t.bonds}`);
    if (t.flaws)   L.push(`- **Flaws:** ${t.flaws}`);
    L.push('');
  }

  return L.join('\n');
}

async function fetchCharacter(id) {
  const res = await fetch(CHAR_API(id), { headers: { 'Accept': 'application/json' } });
  let body = null;
  try { body = await res.json(); } catch { /* non-json */ }
  return { status: res.status, body };
}

async function main() {
  if (!fs.existsSync(CONFIG)) {
    log(`❌ Missing config: ${CONFIG}`);
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
  const chars = (cfg.characters || []).filter((c) => c.characterId && c.characterId !== 0);
  const unset = (cfg.characters || []).filter((c) => !c.characterId || c.characterId === 0);

  log('═══════════════════════════════════════════');
  log(`DDB Party Sheet Sync  ·  ${cfg.campaign || ''}`);
  log('═══════════════════════════════════════════');

  if (unset.length) {
    log(`⚠️  ${unset.length} character(s) have no characterId yet (skipped): ${unset.map((c) => c.name).join(', ')}`);
    log('    Add their IDs in ddb_party.json — see the _README in that file.');
  }
  if (!chars.length) {
    log('Nothing to fetch. Fill in at least one characterId, then re-run.');
    return;
  }

  fs.mkdirSync(RAW_DIR, { recursive: true });
  const syncedIso = new Date().toISOString();
  let ok = 0, priv = 0, fail = 0;

  for (const c of chars) {
    process.stdout.write(`• ${c.name} (#${c.characterId})… `);
    try {
      const { status, body } = await fetchCharacter(c.characterId);
      if (status === 403 || (body && body.success === false)) {
        log('🔒 private/unauthorized — skipped');
        priv++;
        continue;
      }
      if (status !== 200 || !body || !body.data) {
        log(`⚠️ HTTP ${status} — skipped`);
        fail++;
        continue;
      }
      const char = body.data;
      const rawPath = path.join(RAW_DIR, `${safe(c.name)}.json`);
      const mdPath  = path.join(OUT_DIR, `${safe(c.name)} (DDB).md`);
      fs.writeFileSync(rawPath, JSON.stringify(char, null, 2));
      fs.writeFileSync(mdPath, renderMarkdown(char, { ...c, syncedIso }));
      log(`✅ ${char.name || c.name} → JSON + markdown`);
      ok++;
    } catch (e) {
      log(`❌ ${e.message}`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 300)); // be polite
  }

  log('───────────────────────────────────────────');
  log(`Done. ${ok} synced, ${priv} private, ${fail} failed, ${unset.length} unset.`);
  if (priv) log('Private sheets: ask those players to set sharing to "Campaign Only" or "Public" on DDB.');
}

main().catch((e) => { console.error(e); process.exit(1); });
