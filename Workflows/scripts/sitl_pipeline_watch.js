#!/usr/bin/env node
/*
 * SITL Pipeline Watcher  —  Option B (review checkpoint)
 * ------------------------------------------------------
 * WATCH MODE (default):  node sitl_pipeline_watch.js
 *   Watches the Recordings folder. When a new .mp3 finishes copying it:
 *     1. transcribes it (your existing sitl_transcribe.js)
 *     2. runs Convo 1 — Phase A (spell-check ONLY) via headless Claude Code
 *     3. STOPS and pings you. Nothing is applied yet.
 *
 * APPROVE MODE:  node sitl_pipeline_watch.js --approve
 *   After you've reviewed (and optionally edited) the spell-check file, this:
 *     4. runs Convo 1 — Phase B (apply corrections + generate the markdown note)
 *     5. runs Convo 2 (propagate across the vault + git commit/push)
 *
 * Processes one session at a time. No .docx is ever produced.
 *
 * Requires: Node 18+, `npm install chokidar` in this folder, Claude Code on PATH.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const chokidar = require('chokidar');

// ══════════════════════════════════════════════════════════════════
//  CONFIG  —  edit these to match your machine, then never touch again
// ══════════════════════════════════════════════════════════════════
const VAULT_ROOT    = 'C:\\Users\\theli\\sitl_vault';
const RECORDINGS    = path.join(VAULT_ROOT, 'Session_Sources', 'Recordings');

// IMPORTANT: confirm this matches where sitl_transcribe.js actually writes.
// Your instructions say "Raw_Unedited"; older notes say "Raw". Set the real one.
const RAW_DIR       = path.join(VAULT_ROOT, 'Session_Sources', 'Transcripts', 'Raw_Unedited');

const PIPELINE_DIR  = path.join(VAULT_ROOT, '_pipeline');                       // scratch / review files
const PROMPTS_DIR   = path.join(VAULT_ROOT, 'Workflows', 'Project', 'automation'); // the 3 prompt templates

// Transcriber location + entry file (set to wherever sitl_transcribe.js lives)
const TRANSCRIBE_CWD = path.join(VAULT_ROOT, 'Workflows', 'sitl_transcribe');
const TRANSCRIBE_JS  = 'sitl_transcribe.js';

// Headless Claude permission flags.  acceptEdits = auto-accept file edits.
// If git push / bash prompts during unattended runs, see PIPELINE_SETUP.md
// ("Permissions") — you may switch the Phase-B/Convo-2 legs to
// --dangerously-skip-permissions.
const CLAUDE_FLAGS = '--permission-mode acceptEdits';
// ══════════════════════════════════════════════════════════════════

const isWin  = process.platform === 'win32';
const catCmd = isWin ? 'type' : 'cat';

const log    = (m) => console.log(`[${new Date().toLocaleTimeString()}] ${m}`);
const banner = (m) => console.log('\n' + '═'.repeat(64) + `\n  ${m}\n` + '═'.repeat(64) + '\n');

function notify(message) {
  banner(message);
  process.stdout.write('\x07'); // terminal bell
}

// Newest .md/.txt in a directory (the transcript we just made)
function newestTranscript(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .filter((f) => /\.(md|txt)$/i.test(f))
    .map((f) => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  return files.length ? path.join(dir, files[0].f) : null;
}

// Pull session number + date out of a filename like "16_031526_..." or "16 - 031526"
function parseSession(basename) {
  const m = basename.match(/(\d{1,2})\D+(\d{6})/);
  if (!m) return { nn: 'XX', mmddyy: 'UNKNOWN', iso: 'UNKNOWN' };
  const nn = m[1].padStart(2, '0');
  const d  = m[2];
  return { nn, mmddyy: d, iso: `20${d.slice(4, 6)}-${d.slice(0, 2)}-${d.slice(2, 4)}` };
}

// Read a prompt template, substitute {{VARS}}, write a temp prompt file, return its path
function buildPrompt(templateName, vars) {
  let tpl = fs.readFileSync(path.join(PROMPTS_DIR, templateName), 'utf8');
  for (const [k, v] of Object.entries(vars)) tpl = tpl.split(`{{${k}}}`).join(String(v));
  const dir = vars.PIPELINE_DIR || PIPELINE_DIR;
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `_prompt_${templateName.replace(/\W+/g, '_')}.txt`);
  fs.writeFileSync(out, tpl);
  return out;
}

// Pipe a prompt file into headless Claude Code, running in the vault root
function runClaude(promptFile) {
  const cmd = `${catCmd} "${promptFile}" | claude -p ${CLAUDE_FLAGS}`;
  const r = spawnSync(cmd, { cwd: VAULT_ROOT, shell: true, stdio: 'inherit' });
  return r.status === 0;
}

// ── WATCH-MODE handler: new recording → transcribe → Phase A → stop ──
function processRecording(mp3) {
  banner(`New recording: ${path.basename(mp3)}`);

  log('Refreshing keyterms from vault…');
  spawnSync(`node "sitl_keyterms_sync.js"`, { cwd: TRANSCRIBE_CWD, shell: true, stdio: 'inherit' });

  log('Transcribing… (this can take several minutes)');
  const t = spawnSync(`node "${TRANSCRIBE_JS}" "${mp3}"`,
    { cwd: TRANSCRIBE_CWD, shell: true, stdio: 'inherit' });
  if (t.status !== 0) return notify('Transcription FAILED — see console output above.');

  const transcript = newestTranscript(RAW_DIR);
  if (!transcript) return notify(`No transcript found in ${RAW_DIR} — check the transcriber output path in CONFIG.`);

  const sess = parseSession(path.basename(transcript));
  const pdir = path.join(PIPELINE_DIR, `S${sess.nn}`);
  fs.mkdirSync(pdir, { recursive: true });

  log(`Running Convo 1 — Phase A (spell-check) for S${sess.nn}…`);
  const prompt = buildPrompt('convo1_phaseA.md', {
    TRANSCRIPT_PATH: transcript, NN: sess.nn, DATE: sess.mmddyy,
    ISO_DATE: sess.iso, PIPELINE_DIR: pdir,
  });
  const ok = runClaude(prompt);

  fs.writeFileSync(path.join(PIPELINE_DIR, 'state.json'),
    JSON.stringify({ pendingFolder: pdir, transcript, ...sess, stage: 'awaiting_approval' }, null, 2));

  if (!ok) return notify('Phase A FAILED — see console output above.');
  notify(
    `READY FOR REVIEW — Session ${sess.nn}\n` +
    `  Review:   ${path.join(pdir, 'spellcheck.md')}\n` +
    `  Flags:    ${path.join(pdir, 'flags.md')}\n` +
    `  Then run: node sitl_pipeline_watch.js --approve`
  );
}

// ── APPROVE-MODE handler: Phase B + Convo 2 ──
function approve() {
  const statePath = path.join(PIPELINE_DIR, 'state.json');
  if (!fs.existsSync(statePath)) return log('No pending session to approve.');
  const st = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const pdir = st.pendingFolder;

  banner(`Approving Session ${st.nn} — Phase B (apply + notes), then Convo 2`);

  log('Convo 1 — Phase B: applying corrections + generating the session note…');
  const pB = buildPrompt('convo1_phaseB_apply.md', {
    TRANSCRIPT_PATH: st.transcript, NN: st.nn, DATE: st.mmddyy,
    ISO_DATE: st.iso, PIPELINE_DIR: pdir,
  });
  if (!runClaude(pB)) return notify('Phase B FAILED — see console output above.');

  log('Convo 2: propagating across the vault + git push…');
  const p2 = buildPrompt('convo2_propagate.md', {
    NN: st.nn, ISO_DATE: st.iso, PIPELINE_DIR: pdir,
  });
  if (!runClaude(p2)) return notify('Convo 2 FAILED — see console output above.');

  st.stage = 'complete';
  fs.writeFileSync(statePath, JSON.stringify(st, null, 2));
  notify(`Session ${st.nn} fully synced to the vault and pushed to GitHub.`);
}

// ── MAIN ──
if (process.argv.includes('--approve')) { approve(); process.exit(0); }

fs.mkdirSync(PIPELINE_DIR, { recursive: true });
banner('SITL Pipeline Watcher — Option B  (watching for new .mp3)');
log(`Watching: ${RECORDINGS}`);
log('Leave this window open. Ctrl+C to stop.');

const seen = new Set();
chokidar
  .watch(path.join(RECORDINGS, '*.mp3'), {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 5000, pollInterval: 500 }, // wait for copy to finish
  })
  .on('add', (p) => {
    if (seen.has(p)) return;
    seen.add(p);
    processRecording(p);
  });
