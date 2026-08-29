#!/usr/bin/env node
/**
 * Builds the public session registry consumed live by rectrixcaedere.com.
 *
 * The site's sky-is-the-limit/session.html and archive.html fetch this file
 * from raw.githubusercontent.com and merge it into their hardcoded ARC arrays,
 * so adding a session note to the vault is all it takes to publish a session.
 *
 * Sessions before S20 are deliberately NOT emitted. Their editorial is curated
 * in the site's ARC arrays, and several of their vault titles disagree with the
 * published ones (S09 is "Adopt-a-Rothe" on the site and "Every Party Needs A
 * Little Guy" in the vault; S10's filename is a date slug). Emitting them would
 * silently overwrite the published titles. From S20 on the note frontmatter is
 * the source of truth and must carry site_region / site_arc / site_events.
 *
 * Note-body structure (the Website Parser Contract headings) is NOT checked
 * here -- _pipeline/S<n>/validate_note.js already gates that before a note is
 * banked, and duplicating it would give two places to keep in sync.
 *
 * Run:  node Workflows/scripts/generate_public_session_index.mjs
 * Test: node Workflows/scripts/generate_public_session_index.mjs --self-test
 */
import assert from 'node:assert/strict';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const vaultRoot = path.resolve(scriptDir, '..', '..');
const sessionsDir = path.join(vaultRoot, '01-Sessions');
const outputPath = path.join(vaultRoot, '00-Campaign-Hub', 'Public Session Index.json');

/** First session whose editorial lives in frontmatter rather than in the site's HTML. */
const FIRST_PUBLISHED = 20;
const NOTE_PATTERN = /^Session\s+(\d+(?:\.\d+)?)\s+—\s+(.+)\.md$/;
const REQUIRED_SITE_KEYS = ['site_region', 'site_arc', 'site_events'];

/** Only an R2 object filename may be published from note frontmatter. */
function recordingName(value) {
  const name = String(value).trim();
  if (!name) return null;
  if (name !== path.basename(name) || !/\.mp3$/i.test(name)) {
    throw new Error(`site_recording must be an MP3 filename, received: ${value}`);
  }
  return name;
}

function normalizeSessionNumber(value) {
  const raw = String(value).trim();
  if (!/^\d+(?:\.\d+)?$/.test(raw)) throw new Error(`Invalid session number: ${value}`);
  const [whole, fraction] = raw.split('.');
  return `${whole.padStart(2, '0')}${fraction ? `.${fraction}` : ''}`;
}

/**
 * Strips one layer of YAML quoting.
 * Backslash escapes are refused rather than guessed at -- this is a deliberately
 * small parser, and mangling an escaped value silently would be worse than failing.
 */
function unquote(value) {
  const raw = value.trim();
  const quoted = /^"([\s\S]*)"$/.exec(raw) || /^'([\s\S]*)'$/.exec(raw);
  if (!quoted) return raw;
  if (quoted[1].includes('\\')) throw new Error(`Backslash escapes are not supported in frontmatter: ${raw}`);
  return quoted[1];
}

/** Parses scalars and block sequences out of a note's frontmatter. Dates stay strings. */
function frontmatter(markdown) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!block) throw new Error('note has no YAML frontmatter block');
  const data = {};
  let listKey = null;
  for (const line of block[1].split(/\r?\n/)) {
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item && listKey) {
      data[listKey].push(unquote(item[1]));
      continue;
    }
    const pair = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!pair) continue;
    listKey = null;
    if (pair[2].trim() === '') {
      listKey = pair[1];
      data[listKey] = [];
    } else {
      data[pair[1]] = unquote(pair[2]);
    }
  }
  return data;
}

/**
 * Formats a YYYY-MM-DD session date for display.
 * Everything runs in UTC on purpose: formatting an ET session date in local time
 * rolls it back a day, which would make the site query the wrong day's rolls.
 */
function sessionDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!match) throw new Error(`session_date must be YYYY-MM-DD, received: ${value}`);
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day)) {
    throw new Error(`Invalid calendar date: ${value}`);
  }
  const fmt = (monthStyle) => date.toLocaleDateString('en-US', { month: monthStyle, day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  return { iso: `${year}-${month}-${day}`, label: fmt('long'), labelShort: fmt('short') };
}

function buildEntry(file, note) {
  const [, rawNumber] = NOTE_PATTERN.exec(file);
  const n = normalizeSessionNumber(rawNumber);
  const fm = frontmatter(note);
  const declared = fm.session_number ?? fm.session;
  if (declared !== undefined && normalizeSessionNumber(declared) !== n) {
    throw new Error(`frontmatter says session ${declared} but the filename says ${n}`);
  }
  if (!fm.title) throw new Error('frontmatter has no title');
  const missing = REQUIRED_SITE_KEYS.filter((key) => !fm[key] || !fm[key].length);
  if (missing.length) throw new Error(`frontmatter is missing ${missing.join(', ')}`);
  if (!Array.isArray(fm.site_events)) throw new Error('site_events must be a YAML list');
  const date = sessionDate(fm.session_date);
  const rec = fm.site_recording ? recordingName(fm.site_recording) : null;
  return {
    n,
    t: fm.title,
    d: date.iso,
    lbl: date.label,
    lbl_short: date.labelShort,
    f: encodeURI(`01-Sessions/${file}`),
    r: fm.site_region,
    arc: fm.site_arc,
    ...(fm.site_waypoint ? { wp: fm.site_waypoint } : {}),
    ...(rec ? { rec } : {}),
    ev: fm.site_events,
  };
}

async function buildIndex() {
  const files = (await readdir(sessionsDir)).filter((file) => NOTE_PATTERN.test(file));
  const sessions = [];
  const failures = [];
  for (const file of files.sort()) {
    const [, rawNumber] = NOTE_PATTERN.exec(file);
    const n = normalizeSessionNumber(rawNumber);
    if (Number.parseFloat(n) < FIRST_PUBLISHED) continue;
    try {
      sessions.push(buildEntry(file, await readFile(path.join(sessionsDir, file), 'utf8')));
    } catch (error) {
      failures.push(`S${n}: ${error.message}.`);
    }
  }
  if (failures.length) throw new Error(`Public session index not written:\n- ${failures.join('\n- ')}`);
  if (!sessions.length) throw new Error(`No publishable session notes found at or after S${FIRST_PUBLISHED}.`);
  sessions.sort((a, b) => Number.parseFloat(a.n) - Number.parseFloat(b.n));
  return { version: 1, generated_at: new Date().toISOString(), first_published_session: normalizeSessionNumber(FIRST_PUBLISHED), sessions };
}

function selfTest() {
  assert.equal(normalizeSessionNumber('7'), '07');
  assert.equal(normalizeSessionNumber('22'), '22');
  assert.equal(normalizeSessionNumber('04.5'), '04.5');
  assert.throws(() => normalizeSessionNumber('twenty'));
  assert.equal(recordingName('081626 Sky Is The Limit Recording.mp3'), '081626 Sky Is The Limit Recording.mp3');
  assert.throws(() => recordingName('../unsafe.mp3'));
  assert.throws(() => recordingName('recording.wav'));

  // The whole point of the UTC handling: an ET session date must not roll back a day.
  assert.equal(sessionDate('2026-08-16').iso, '2026-08-16');
  assert.equal(sessionDate('2026-08-16').label, 'August 16, 2026');
  assert.equal(sessionDate('2026-08-16').labelShort, 'Aug 16, 2026');
  assert.equal(sessionDate('2026-01-01').label, 'January 1, 2026');
  assert.throws(() => sessionDate('08/16/2026'));
  assert.throws(() => sessionDate('2026-02-30'));

  const fm = frontmatter('---\ntitle: "Quoted — Title"\nsession_date: 2026-08-16\nsite_events:\n  - "first beat"\n  - second beat\ntags: [session]\n---\nbody\n');
  assert.equal(fm.title, 'Quoted — Title');
  assert.equal(fm.session_date, '2026-08-16');
  assert.deepEqual(fm.site_events, ['first beat', 'second beat']);
  assert.throws(() => frontmatter('no frontmatter here'));
  assert.throws(() => unquote('"has a \\\\ backslash"'));

  const note = '---\nsession_number: 22\nsession_date: 2026-08-16\ntitle: Blind Faith\nsite_region: The Mermaid Cove\nsite_waypoint: The Mermaid Cove\nsite_arc: "Into the fog → the shallows"\nsite_recording: 081626 Sky Is The Limit Recording.mp3\nsite_events:\n  - "a beat"\n---\n';
  const entry = buildEntry('Session 22 — Blind Faith.md', note);
  assert.equal(entry.n, '22');
  assert.equal(entry.d, '2026-08-16');
  assert.equal(entry.wp, 'The Mermaid Cove');
  assert.equal(entry.rec, '081626 Sky Is The Limit Recording.mp3');
  assert.equal(entry.f, '01-Sessions/Session%2022%20%E2%80%94%20Blind%20Faith.md');
  assert.deepEqual(entry.ev, ['a beat']);

  // A note that never got its editorial must fail loudly, not publish a blank card.
  assert.throws(() => buildEntry('Session 23 — Untitled.md', '---\nsession_number: 23\nsession_date: 2026-08-30\ntitle: Untitled\n---\n'), /site_region/);
  // A mislabelled note must fail rather than publish under the wrong number.
  assert.throws(() => buildEntry('Session 23 — Wrong.md', '---\nsession_number: 24\nsession_date: 2026-08-30\ntitle: Wrong\nsite_region: X\nsite_arc: Y\nsite_events:\n  - z\n---\n'), /filename/);

  console.log('generate_public_session_index: self-test passed');
}

async function main() {
  if (process.argv.includes('--self-test')) return selfTest();
  const index = await buildIndex();
  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  console.log(`generate_public_session_index: wrote ${index.sessions.length} sessions (S${index.sessions[0].n}-S${index.sessions[index.sessions.length - 1].n}) to ${path.relative(vaultRoot, outputPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
