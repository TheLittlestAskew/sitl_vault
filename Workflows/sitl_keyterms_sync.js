#!/usr/bin/env node
/*
 * SITL Keyterms Sync
 * ------------------
 * Scans the vault's proper-noun folders (NPCs, Locations, Flora & Fauna) and
 * appends any NEW page names — plus their frontmatter aliases — to
 * keyterms_extra.json. The transcriber merges that file into word_boost.
 *
 * ADD-ONLY. It never deletes or edits your curated base list (SITL_KEYTERMS
 * in the transcriber). The two lists are combined and de-duplicated at
 * transcription time, so a name appearing in both is harmless.
 *
 * Run manually:  node sitl_keyterms_sync.js
 * Or let the watcher call it automatically before each transcription.
 *
 * keyterms_extra.json must live in THIS folder (next to the transcriber).
 */

const fs = require('fs');
const path = require('path');

// ══ CONFIG ══════════════════════════════════════════════════════
// Vault root derived from this script's location (this file lives in
// <vault>\Workflows\), so moving the vault doesn't break it.
const VAULT_ROOT = path.resolve(__dirname, '..');
const SCAN_FOLDERS = [
  path.join(VAULT_ROOT, '03-Characters', 'NPCs'),
  path.join(VAULT_ROOT, '04-World-Lore', 'Locations'),
  path.join(VAULT_ROOT, '07-Flora_Fauna'),     // includes Creatures/ + Plants_Fungi/
];
const EXTRA_FILE = path.join(__dirname, 'keyterms_extra.json');
const MAX_WORDS_PER_TERM = 6;   // word_boost phrases work best short
const WARN_AT_EXTRA = 700;      // word_boost caps ~1000 total (base + extra)
const SKIP_NAMES = new Set(['index', '_index', 'readme', 'template', 'moc']);
// ════════════════════════════════════════════════════════════════

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) out.push(p);
  }
  return out;
}

// Pull aliases from YAML frontmatter — handles [a, b] and dashed-list forms
function parseAliases(text) {
  const fm = text.match(/^---\s*[\r\n]([\s\S]*?)[\r\n]---/);
  if (!fm) return [];
  const block = fm[1];
  const line = block.match(/^aliases:\s*(.*)$/m);
  if (!line) return [];
  const inline = line[1].trim();
  if (inline.startsWith('[')) {
    return inline.replace(/^\[|\]$/g, '').split(',')
      .map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  const rest = block.slice(block.indexOf(line[0]) + line[0].length).split(/[\r\n]/);
  const items = [];
  for (const r of rest) {
    const m = r.match(/^\s*-\s*(.+?)\s*$/);
    if (m) items.push(m[1].replace(/^["']|["']$/g, ''));
    else if (r.trim() && !/^\s/.test(r)) break; // hit the next top-level key
  }
  return items.filter(Boolean);
}

const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();
const valid = (t) =>
  t &&
  !t.startsWith('_') && !t.startsWith('.') &&
  !SKIP_NAMES.has(t.toLowerCase()) &&
  t.split(' ').length <= MAX_WORDS_PER_TERM;

// Load existing extra list (tolerate missing/empty)
let extra = [];
try { extra = JSON.parse(fs.readFileSync(EXTRA_FILE, 'utf8')); } catch { extra = []; }
const have = new Set(extra.map((t) => t.toLowerCase()));

// Collect candidates: page title + aliases for every page in scan folders
const candidates = [];
for (const file of SCAN_FOLDERS.flatMap((f) => walk(f))) {
  candidates.push(clean(path.basename(file, '.md')));
  try { for (const a of parseAliases(fs.readFileSync(file, 'utf8'))) candidates.push(clean(a)); }
  catch { /* unreadable file — skip its aliases */ }
}

// Append new, valid, de-duplicated terms
const added = [];
for (const c of candidates) {
  if (!valid(c) || have.has(c.toLowerCase())) continue;
  have.add(c.toLowerCase());
  extra.push(c);
  added.push(c);
}

extra.sort((a, b) => a.localeCompare(b)); // alphabetized so it's easy to scan/prune by hand
fs.writeFileSync(EXTRA_FILE, JSON.stringify(extra, null, 2) + '\n');

// Report
const ts = new Date().toLocaleTimeString();
if (added.length) {
  console.log(`[${ts}] Keyterms sync: added ${added.length} new term(s):`);
  added.sort((a, b) => a.localeCompare(b)).forEach((t) => console.log(`    + ${t}`));
} else {
  console.log(`[${ts}] Keyterms sync: no new terms (${extra.length} in extra list).`);
}
if (extra.length >= WARN_AT_EXTRA) {
  console.log(`[${ts}] ⚠️  ${extra.length} auto-terms — with your base list this nears word_boost's ~1000 cap. Prune stale names from keyterms_extra.json.`);
}
