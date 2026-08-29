#!/usr/bin/env node
/**
 * Publishes one approved Sky Is The Limit session recording to the existing
 * Cloudflare R2 public bucket. It is intentionally dry-run by default.
 *
 * Usage:
 *   node Workflows/scripts/upload_sitl_recording_to_r2.mjs --session 23 --file "Session_Sources/Recordings/082926 Sky Is The Limit Recording.mp3" --upload
 *   node Workflows/scripts/upload_sitl_recording_to_r2.mjs --self-test
 *
 * Required environment values, normally in the vault's ignored .env:
 *   CLOUDFLARE_R2_ACCOUNT_ID
 *   CLOUDFLARE_R2_ACCESS_KEY_ID
 *   CLOUDFLARE_R2_SECRET_ACCESS_KEY
 * Optional: R2_BUCKET (default recordings), SITL_R2_PUBLIC_BASE_URL.
 */
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const vaultRoot = path.resolve(scriptDir, '..', '..');
const DEFAULT_PUBLIC_BASE = 'https://pub-33596be843004e7282ae8a9069ae9b82.r2.dev/Recordings/sitl/';
const BUCKET = process.env.R2_BUCKET || 'recordings';
const PUBLIC_BASE = ensureSlash(process.env.SITL_R2_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE);

function ensureSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function required(value, label) {
  if (!value || !String(value).trim()) throw new Error(`Missing ${label}. Add it to the vault's ignored .env or your environment.`);
  return String(value).trim();
}

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

function sessionNumber(value) {
  const raw = String(value || '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(raw)) throw new Error(`--session must be a number, received: ${value || '(missing)'}`);
  return raw.padStart(2, '0');
}

function safeRecordingName(file) {
  const supplied = String(file).replace(/\\/g, '/');
  if (supplied.split('/').includes('..')) throw new Error('--file cannot traverse outside its supplied folder.');
  const name = path.basename(file);
  if (!/\.mp3$/i.test(name)) throw new Error('Only .mp3 recordings can be published.');
  if (!name || name === '.' || name === '..') throw new Error('Invalid recording filename.');
  return name;
}

function objectKey(file) {
  return `Recordings/sitl/${safeRecordingName(file)}`;
}

function publicUrl(file) {
  return encodeURI(`${PUBLIC_BASE}${safeRecordingName(file)}`);
}

async function loadDotEnv() {
  const envPath = path.join(vaultRoot, '.env');
  let text;
  try { text = await readFile(envPath, 'utf8'); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match || process.env[match[1]]) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
    process.env[match[1]] = value;
  }
}

function client() {
  const accountId = required(process.env.CLOUDFLARE_R2_ACCOUNT_ID, 'CLOUDFLARE_R2_ACCOUNT_ID');
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: required(process.env.CLOUDFLARE_R2_ACCESS_KEY_ID, 'CLOUDFLARE_R2_ACCESS_KEY_ID'),
      secretAccessKey: required(process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY, 'CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
    },
  });
}

async function remoteSize(s3, key) {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return Number(head.ContentLength);
  } catch (error) {
    const status = error?.$metadata?.httpStatusCode;
    if (status === 404 || error?.name === 'NotFound') return null;
    throw error;
  }
}

async function verifyPublic(url, expectedSize) {
  const response = await fetch(url, { method: 'HEAD' });
  const length = Number(response.headers.get('content-length'));
  if (!response.ok) throw new Error(`Public R2 verification failed with HTTP ${response.status}: ${url}`);
  if (!Number.isFinite(length) || length !== expectedSize) {
    throw new Error(`Public R2 size mismatch: expected ${expectedSize} bytes, received ${Number.isFinite(length) ? length : 'no Content-Length'}.`);
  }
}

async function publish(options) {
  const session = sessionNumber(options.session);
  if (!options.file) throw new Error('--file is required.');
  const source = path.resolve(vaultRoot, options.file);
  if (!path.isAbsolute(options.file) && path.relative(vaultRoot, source).startsWith('..')) {
    throw new Error('--file must resolve inside the vault when using a relative path.');
  }
  const name = safeRecordingName(options.file);
  const sourceStats = await stat(source);
  if (!sourceStats.isFile()) throw new Error(`Recording is not a file: ${source}`);
  if (sourceStats.size === 0) throw new Error(`Recording is empty: ${source}`);
  const key = objectKey(options.file);
  const url = publicUrl(options.file);
  const result = { session, source, key, url, bytes: sourceStats.size, status: options.upload ? 'pending' : 'dry-run' };

  if (!options.upload) return result;
  const s3 = client();
  const existing = await remoteSize(s3, key);
  if (existing !== null && existing !== sourceStats.size && !options.replace) {
    throw new Error(`R2 already has ${key} at ${existing} bytes, not ${sourceStats.size}. Refusing to overwrite it. Inspect it, then rerun with --replace only if it is the intended replacement.`);
  }
  if (existing !== sourceStats.size) {
    const transfer = new Upload({
      client: s3,
      params: { Bucket: BUCKET, Key: key, Body: (await import('node:fs')).createReadStream(source), ContentType: 'audio/mpeg' },
      queueSize: 4,
      partSize: 8 * 1024 * 1024,
      leavePartsOnError: false,
    });
    await transfer.done();
  }
  const verifiedSize = await remoteSize(s3, key);
  if (verifiedSize !== sourceStats.size) throw new Error(`R2 object size mismatch after upload: expected ${sourceStats.size}, received ${verifiedSize}.`);
  await verifyPublic(url, sourceStats.size);
  return { ...result, status: existing === sourceStats.size ? 'already-published' : 'published' };
}

function selfTest() {
  assert.equal(sessionNumber('7'), '07');
  assert.equal(sessionNumber('22'), '22');
  assert.throws(() => sessionNumber('S22'));
  assert.equal(safeRecordingName('082926 Sky Is The Limit Recording.mp3'), '082926 Sky Is The Limit Recording.mp3');
  assert.equal(safeRecordingName('Session_Sources/Recordings/session.mp3'), 'session.mp3');
  assert.equal(safeRecordingName('C:\\recordings\\session.mp3'), 'session.mp3');
  assert.throws(() => safeRecordingName('../session.mp3'));
  assert.throws(() => safeRecordingName('session.wav'));
  assert.equal(objectKey('session.mp3'), 'Recordings/sitl/session.mp3');
  assert.equal(publicUrl('space name.mp3'), `${DEFAULT_PUBLIC_BASE}space%20name.mp3`);
  console.log('upload_sitl_recording_to_r2: self-test passed');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.selfTest) return selfTest();
  await loadDotEnv();
  const result = await publish(options);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => { console.error(`upload_sitl_recording_to_r2: ${error.message}`); process.exitCode = 1; });
