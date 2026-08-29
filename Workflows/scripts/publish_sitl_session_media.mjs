#!/usr/bin/env node
/**
 * The single post-approval media step for a completed SITL session note.
 * It publishes the MP3, verifies the public R2 URL, records the filename in
 * the matching note's frontmatter, then rebuilds Public Session Index.json.
 *
 * Run only after the note and all Convo 2 campaign updates are approved:
 * node Workflows/scripts/publish_sitl_session_media.mjs --session 23 --file "Session_Sources/Recordings/082926 Sky Is The Limit Recording.mp3" --upload
 */
import assert from 'node:assert/strict';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const vaultRoot = path.resolve(scriptDir, '..', '..');
const sessionsDir = path.join(vaultRoot, '01-Sessions');

function parseArgs(args) {
  const out = { upload: false, replace: false, selfTest: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--upload') out.upload = true;
    else if (arg === '--replace') out.replace = true;
    else if (arg === '--self-test') out.selfTest = true;
    else if (arg === '--session' || arg === '--file') {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`${arg} needs a value.`);
      out[arg.slice(2)] = args[++i];
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  return out;
}

function normalizedSession(value) {
  const raw = String(value || '').trim();
  if (!/^\d+$/.test(raw)) throw new Error(`--session must be a whole number, received: ${value || '(missing)'}`);
  return raw.padStart(2, '0');
}

function recordingName(file) {
  const supplied = String(file).replace(/\\/g, '/');
  if (supplied.split('/').includes('..')) throw new Error('--file cannot traverse outside its supplied folder.');
  const name = path.basename(file);
  if (!/\.mp3$/i.test(name)) throw new Error('Only .mp3 recordings can be published.');
  return name;
}

function setRecordingFrontmatter(markdown, filename) {
  const match = /^(---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))/.exec(markdown);
  if (!match) throw new Error('Session note has no YAML frontmatter block.');
  const replacement = `site_recording: ${filename}`;
  const body = /^site_recording:\s*.*$/m.test(match[2])
    ? match[2].replace(/^site_recording:\s*.*$/m, replacement)
    : `${match[2]}\n${replacement}`;
  return `${match[1]}${body}${match[3]}${markdown.slice(match[0].length)}`;
}

function runNode(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: vaultRoot, windowsHide: true });
    let stdout = ''; let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve(stdout) : reject(new Error(stderr.trim() || `Command failed with exit code ${code}.`)));
  });
}

async function noteForSession(session) {
  const files = await readdir(sessionsDir);
  const match = files.find((file) => new RegExp(`^Session ${session} — .+\\.md$`).test(file));
  if (!match) throw new Error(`No session note found for S${session}. Complete and save the note before publishing audio.`);
  return path.join(sessionsDir, match);
}

async function publish(options) {
  if (!options.upload) throw new Error('This command makes a public release. Rerun with --upload after Convo 2 is complete and approved.');
  if (!options.file) throw new Error('--file is required.');
  const session = normalizedSession(options.session);
  const notePath = await noteForSession(session);
  const uploadArgs = [path.join(scriptDir, 'upload_sitl_recording_to_r2.mjs'), '--session', session, '--file', options.file, '--upload'];
  if (options.replace) uploadArgs.push('--replace');
  const upload = JSON.parse(await runNode(uploadArgs));
  if (!['published', 'already-published'].includes(upload.status)) throw new Error('R2 uploader did not return a verified publish state.');
  const original = await readFile(notePath, 'utf8');
  const updated = setRecordingFrontmatter(original, recordingName(options.file));
  await writeFile(notePath, updated, 'utf8');
  await runNode([path.join(scriptDir, 'generate_public_session_index.mjs')]);
  return { session, note: path.relative(vaultRoot, notePath), recording: upload.key, url: upload.url, status: upload.status };
}

function selfTest() {
  assert.equal(normalizedSession('7'), '07');
  assert.throws(() => normalizedSession('07.5'));
  assert.equal(recordingName('Session_Sources/Recordings/session.mp3'), 'session.mp3');
  assert.throws(() => recordingName('../session.mp3'));
  const original = '---\ntitle: Test\nsite_arc: Into the dark\n---\n# Note\n';
  assert.match(setRecordingFrontmatter(original, 'test.mp3'), /site_recording: test\.mp3/);
  assert.equal((setRecordingFrontmatter('---\nsite_recording: old.mp3\n---\n', 'new.mp3').match(/site_recording:/g) || []).length, 1);
  assert.throws(() => setRecordingFrontmatter('# no frontmatter', 'test.mp3'));
  console.log('publish_sitl_session_media: self-test passed');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.selfTest) return selfTest();
  console.log(JSON.stringify(await publish(options), null, 2));
}

main().catch((error) => { console.error(`publish_sitl_session_media: ${error.message}`); process.exitCode = 1; });
