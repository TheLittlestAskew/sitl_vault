/**
 * ============================================================
 * SITL AssemblyAI Transcriber
 * ============================================================
 * 
 * Transcribes Sky Is The Limit D&D session recordings using
 * AssemblyAI with campaign-specific vocabulary boosting and
 * custom spelling corrections pre-loaded.
 *
 * LOCATION:
 *   C:\Users\theli\sitl_vault\Workflows\sitl_transcribe\sitl_transcribe.js
 *
 * PREREQUISITES:
 *   1. Node.js installed (v18+)
 *   2. AssemblyAI API key (https://www.assemblyai.com/app/account)
 *   3. Set your key in .env at the vault root: ASSEMBLYAI_API_KEY=your_key
 *   4. npm install dotenv (from the Workflows folder)
 *   4. Session recordings in: sitl_vault\Session_Sources\Recordings\
 *
 * USAGE:
 *   cd C:\Users\theli\sitl_vault\Workflows\sitl_transcribe
 *   node sitl_transcribe.js                          (interactive picker)
 *   node sitl_transcribe.js session14.mp3             (by filename)
 *   node sitl_transcribe.js "C:\path\to\audio.mp3"   (full path)
 *
 * SUPPORTED FORMATS: mp3, mp4, m4a, wav, webm, ogg, flac
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

// ── Load .env from vault root ───────────────────────────────
const dotenvPath = path.resolve(__dirname, '..', '.env');
require('dotenv').config({ path: dotenvPath });

// ── CONFIG ──────────────────────────────────────────────────
const API_KEY = process.env.ASSEMBLYAI_API_KEY;
const BASE_URL = "https://api.assemblyai.com";

if (!API_KEY) {
  console.error('ERROR: Missing ASSEMBLYAI_API_KEY.');
  console.error('Make sure .env exists in the vault root with the key set.');
  process.exit(1);
}

// Default directories — all paths relative to the sitl_vault
const VAULT_ROOT = String.raw`C:\Users\theli\sitl_vault`;
const SCRIPT_DIR = path.join(VAULT_ROOT, "Workflows");
const RECORDINGS_DIR = path.join(VAULT_ROOT, "Session_Sources", "Recordings");
const TRANSCRIPTS_DIR = path.join(VAULT_ROOT, "Session_Sources", "Transcripts", "Raw");

// Audio file extensions to look for when listing recordings
const AUDIO_EXTENSIONS = [".mp3", ".mp4", ".m4a", ".wav", ".webm", ".ogg", ".flac"];

// ── SITL CAMPAIGN VOCABULARY ────────────────────────────────
// These are the words/phrases AssemblyAI should prioritize
// recognizing. Up to 1,000 terms for Universal-3 Pro.
// 
// Organized by category for easy maintenance.
// Add new terms as the campaign progresses.

const SITL_KEYTERMS = [

  // ── Player Characters ──
  "Kit Aluri",
  "Binks Stonevein",
  "Aeolus",
  "Blarg",
  "Amanita de Champignon",
  "Amanita",
  "Darby Stonefeather",

  // ── Player Names (OOC) ──
  "Addison",
  "Taylor",
  "Sirius",
  "Florian",
  "Hannah",
  "Austin",

  // ── NPC Companions / Prisoners ──
  "Topsy",
  "Turvy",
  "Stool",
  "Jimjar",
  "Shuushar",
  "Buppido",
  "Derendil",
  "Eldeth Feldrun",
  "Eldeth",
  "Sarith Kzekarit",
  "Sarith",
  "Glabbagool",

  // ── Drow Antagonists ──
  "Ilvara Mizzrym",
  "Ilvara",
  "Jorlan Duskryn",
  "Jorlan",
  "Shoor Vandree",
  "Shoor",
  "Asha Vandree",
  "Xalith",

  // ── Duergar / Gracklstugh NPCs ──
  "Themberchaud",
  "Errde Blackskull",
  "Gartokkar Xundorn",
  "Droki",
  "Narrak",

  // ── Deep Gnome / Blingdenstone NPCs ──
  "Dorbo Diggermattock",
  "Senni Diggermattock",
  "Kazook Pickshine",
  "Nomi Pathshutter",
  "Yantha Coaxrock",

  // ── Kuo-Toa NPCs ──
  "Ploopploopeen",
  "Bloppblippodd",
  "Sloopidoop",

  // ── Myconid NPCs ──
  "Basidia",
  "Rumpadump",
  "Yestabrod",

  // ── Other Key NPCs ──
  "Vizeran DeVir",
  "Grin Ousstyl",
  "Karazikar",
  "Artaxel",
  "Garruk",

  // ── Demon Lords ──
  "Demogorgon",
  "Orcus",
  "Juiblex",
  "Zuggtmoy",
  "Baphomet",
  "Yeenoghu",
  "Graz'zt",

  // ── Deities ──
  "Lolth",
  "Eilistraee",
  "Blibdoolpoolp",
  "Laduguer",
  "Deep Duerra",
  "Callarduran Smoothhands",
  "Garl Glittergold",

  // ── Major Locations ──
  "Velkynvelve",
  "Blingdenstone",
  "Gracklstugh",
  "Menzoberranzan",
  "Sloobludop",
  "Neverlight Grove",
  "Mantol-Derith",
  "The Darklake",
  "Darklake",
  "The Silken Paths",
  "Silken Paths",
  "The Wormwrithings",
  "The Labyrinth",
  "Whorlstone Tunnels",
  "Gauntlgrym",

  // ── Blingdenstone Locations ──
  "Rockblight",
  "Pickshine Mines",
  "The Singing Stones",
  "The Ruby in the Rough",
  "The Warrens",

  // ── Underdark Regions ──
  "Underdark",
  "Upperdark",
  "Middledark",
  "Lowerdark",
  "Northdark",
  "Faerzress",
  "The Feydark",
  "Feydark",

  // ── Myconid / Fungal Locations ──
  "Yggmorgus",
  "Araumycos",

  // ── Creatures / Monsters ──
  "quaggoth",
  "quaggoths",
  "svirfneblin",
  "duergar",
  "kuo-toa",
  "myconid",
  "myconids",
  "chasme",
  "chasmes",
  "vrock",
  "vrocks",
  "drider",
  "driders",
  "gelatinous cube",
  "black pudding",
  "gray ooze",
  "ochre jelly",
  "hook horror",
  "derro",
  "troglodyte",

  // ── Underdark Materials / Flora ──
  "Zurkhwood",
  "zurkhwood",
  "faerzress",

  // ── D&D Spells (commonly used by party) ──
  "Eldritch Blast",
  "Faerie Fire",
  "Thaumaturgy",
  "Prestidigitation",
  "Shocking Grasp",
  "Longstrider",
  "Entangle",
  "Toll the Dead",
  "Guiding Bolt",
  "Healing Word",
  "Shield of Faith",
  "Spiritual Weapon",
  "Cure Wounds",
  "Tasha's Hideous Laughter",
  "Misty Step",
  "Hold Person",
  "Moonbeam",
  "Flame Blade",
  "Warding Wind",
  "Dust Devil",
  "Earthbind",
  "Spider Climb",
  "Phantasmal Force",
  "Calm Emotions",
  "Augury",
  "Witch Bolt",
  "Armor of Agathys",
  "Hellish Rebuke",
  "Command",
  "Sanctuary",
  "Protection from Evil and Good",
  "Detect Magic",
  "Find Familiar",
  "Wild Shape",
  "Speak with Animals",
  "Barkskin",
  "Summon Beast",
  "Pass without Trace",
  "Invisibility",
  "Charm Person",
  "Disguise Self",
  "Bless",
  "Bane",
  "Sleep",

  // ── D&D Mechanics ──
  "Battle Master",
  "Trickery Domain",
  "Circle of the Moon",
  "Circle of Spores",
  "Path of the Wild Heart",
  "Archfey Patron",
  "superiority dice",
  "superiority die",
  "Sneak Attack",
  "Action Surge",
  "Second Wind",
  "Rage",
  "Wild Shape",
  "Spore Druid",
  "multiclass",
  "short rest",
  "long rest",
  "death save",
  "death saves",
  "opportunity attack",
  "saving throw",
  "ability check",
  "initiative",
  "darkvision",
  "cantrip",
  "concentration",
  "attunement",
  "proficiency",
  "disadvantage",
  "advantage",

  // ── Races ──
  "tiefling",
  "goliath",

  // ── D&D Factions / Groups ──
  "Bregan D'aerthe",
  "House Baenre",
  "House Do'Urden",
  "House Mizzrym",
  "Society of Brilliance",

  // ── Legendary / Lore NPCs ──
  "Drizzt Do'Urden",
  "Drizzt",
  "Bruenor Battlehammer",
  "Bruenor",
];

// ── CUSTOM SPELLING CORRECTIONS ─────────────────────────────
// These fix AFTER transcription — replacing common misheard
// versions with the correct spelling.
//
// Format: { "CorrectSpelling": ["misheard1", "misheard2"] }
// The "from" values are case-insensitive.

const SITL_CUSTOM_SPELLING = [
  // ── IMPORTANT: AssemblyAI requires 'to' values to be ONE word only.
  // Multi-word corrections (Asha Vandree, Shoor Vandree, Faerie Fire, etc.)
  // are handled by keyterms_prompt instead, which boosts recognition of
  // the correct multi-word phrase during transcription.

  // Character names
  { from: ["Banks", "Beaks"], to: "Binks" },
  { from: ["Aolis", "Aolus", "Aeolous", "Aaylas", "Alist"], to: "Aeolus" },
  { from: ["Larg"], to: "Blarg" },
  { from: ["Manita", "Anita", "Amanina", "Ramanita"], to: "Amanita" },
  { from: ["Hanna"], to: "Hannah" },

  // NPC names
  { from: ["Jorlin", "Jorland"], to: "Jorlan" },
  { from: ["Sareth", "Sarath"], to: "Sarith" },
  { from: ["Darindel", "Derendal"], to: "Derendil" },
  { from: ["Eldith"], to: "Eldeth" },
  { from: ["Jimmer"], to: "Jimjar" },
  { from: ["Shushar"], to: "Shuushar" },
  { from: ["Toppsy", "Tossi", "Dopsy"], to: "Topsy" },
  { from: ["Turby", "Kirby", "Herby", "Tury"], to: "Turvy" },

  // Locations
  { from: ["Belkinvelve", "Velkenvelve"], to: "Velkynvelve" },
  { from: ["Mendobarranzan", "Menzobaranzan"], to: "Menzoberranzan" },
  { from: ["Blingdonstone"], to: "Blingdenstone" },
  { from: ["Sloopludop", "Sloopidoop", "Slooplidoop", "Slooploopeen"], to: "Sloobludop" },
  { from: ["Gracklestug"], to: "Gracklstugh" },
  { from: ["Gontulgrim", "Gontelgrim", "Gontalgrim"], to: "Gauntlgrym" },

  // Underdark terms
  { from: ["pharezeros", "faresrus", "Pharaoz", "Pharezeros"], to: "Faerzress" },
  { from: ["Zerkwood"], to: "Zurkhwood" },

  // Creatures
  { from: ["drought"], to: "drow" },
  { from: ["kuatoa"], to: "kuo-toa" },
  { from: ["quagos", "quaggath"], to: "quaggoth" },
  { from: ["kazme"], to: "chasme" },
  { from: ["Dwuergar"], to: "duergar" },
  { from: ["mykinid", "meconid"], to: "myconid" },
  { from: ["darrow"], to: "derro" },

  // Legendary NPCs
  { from: ["Griszt", "Drizzit"], to: "Drizzt" },
  { from: ["Brunner"], to: "Bruenor" },

  // Spells
  { from: ["Augery"], to: "Augury" },
];


// ── HELPER FUNCTIONS ────────────────────────────────────────

const readline = require("readline");

function log(msg) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${msg}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Prompt the user for input on the command line.
 */
function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * List audio files in the recordings directory.
 * Returns an array of { name, fullPath, size, modified }.
 */
function listRecordings() {
  if (!fs.existsSync(RECORDINGS_DIR)) {
    return [];
  }

  return fs.readdirSync(RECORDINGS_DIR)
    .filter(f => AUDIO_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .map(f => {
      const fullPath = path.join(RECORDINGS_DIR, f);
      const stats = fs.statSync(fullPath);
      return {
        name: f,
        fullPath,
        sizeMB: (stats.size / (1024 * 1024)).toFixed(1),
        modified: stats.mtime,
      };
    })
    .sort((a, b) => b.modified - a.modified); // newest first
}

/**
 * Upload a local file to AssemblyAI's servers.
 * Returns the upload URL to use for transcription.
 */
async function uploadFile(filePath) {
  log(`Uploading ${path.basename(filePath)}...`);

  const fileData = fs.readFileSync(filePath);
  const response = await fetch(`${BASE_URL}/v2/upload`, {
    method: "POST",
    headers: {
      Authorization: API_KEY,
      "Content-Type": "application/octet-stream",
    },
    body: fileData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  log(`Upload complete. URL: ${data.upload_url.substring(0, 60)}...`);
  return data.upload_url;
}

/**
 * Submit a transcription request with SITL vocabulary config.
 * Returns the transcript ID for polling.
 */
async function submitTranscription(audioUrl) {
  log("Submitting transcription with SITL vocabulary...");

  const requestBody = {
    audio_url: audioUrl,

    // Use Universal-3 Pro for best accuracy + keyterms support,
    // fall back to Universal-2 if U3 Pro can't handle the audio
    speech_models: ["universal-3-pro", "universal-2"],

    // ── SITL Campaign Vocabulary ──
    // Boosts recognition of all campaign-specific terms
    keyterms_prompt: SITL_KEYTERMS,

    // ── Custom Spelling Corrections ──
    // Post-transcription find-and-replace for common misheard words
    custom_spelling: SITL_CUSTOM_SPELLING,

    // ── Speaker Diarization ──
    // Identifies different speakers (DM + up to 6 players)
    speaker_labels: true,
    speakers_expected: 7,

    // ── General Settings ──
    language_code: "en_us",
    punctuate: true,
    format_text: true,
  };

  const response = await fetch(`${BASE_URL}/v2/transcript`, {
    method: "POST",
    headers: {
      Authorization: API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Submission failed: ${response.status} — ${errorBody}`);
  }

  const data = await response.json();
  log(`Transcription queued. ID: ${data.id}`);
  return data.id;
}

/**
 * Poll until the transcription is complete.
 * Returns the full transcript response object.
 */
async function pollForCompletion(transcriptId) {
  log("Waiting for transcription to complete...");

  const pollUrl = `${BASE_URL}/v2/transcript/${transcriptId}`;
  let dots = 0;

  while (true) {
    const response = await fetch(pollUrl, {
      headers: { Authorization: API_KEY },
    });

    const data = await response.json();

    if (data.status === "completed") {
      log("Transcription complete!");
      return data;
    }

    if (data.status === "error") {
      throw new Error(`Transcription failed: ${data.error}`);
    }

    // Still processing — wait and poll again
    dots = (dots + 1) % 4;
    process.stdout.write(`\r[${new Date().toLocaleTimeString()}] Processing${".".repeat(dots + 1)}${" ".repeat(3 - dots)}`);
    await sleep(5000);
  }
}

/**
 * Format the transcript with speaker labels and timestamps.
 * Outputs in script format compatible with the SITL workflow.
 */
function formatTranscript(transcriptData) {
  const lines = [];

  lines.push("# SITL Session Transcript");
  lines.push(`# Transcribed: ${new Date().toISOString()}`);
  lines.push(`# Audio duration: ${Math.round(transcriptData.audio_duration / 60)} minutes`);
  lines.push(`# Model: ${transcriptData.speech_model || "universal-3-pro"}`);
  lines.push(`# Confidence: ${(transcriptData.confidence * 100).toFixed(1)}%`);
  lines.push("");
  lines.push("---");
  lines.push("");

  if (transcriptData.utterances && transcriptData.utterances.length > 0) {
    // Speaker-labeled format
    for (const utterance of transcriptData.utterances) {
      const startTime = formatTimestamp(utterance.start);
      const speaker = utterance.speaker || "UNKNOWN";
      const confidence = (utterance.confidence * 100).toFixed(0);

      lines.push(`[${startTime}] SPEAKER ${speaker}: ${utterance.text}`);
      lines.push("");
    }
  } else {
    // Plain text fallback (no speaker labels)
    lines.push(transcriptData.text);
  }

  return lines.join("\n");
}

/**
 * Convert milliseconds to HH:MM:SS timestamp format.
 */
function formatTimestamp(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// ── MAIN ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  // Validate API key early
  if (API_KEY === "YOUR_API_KEY_HERE") {
    console.error("ERROR: Set your AssemblyAI API key first.");
    console.error("  set ASSEMBLYAI_API_KEY=your_key_here");
    console.error("  — or edit the API_KEY constant in this script.");
    process.exit(1);
  }

  let input;
  let outputPath;

  if (args.length === 0) {
    // ── Interactive mode: list recordings and let user pick ──
    console.log(`
╔══════════════════════════════════════════════╗
║   SITL AssemblyAI Transcriber                ║
║   Sky Is The Limit Campaign                  ║
╚══════════════════════════════════════════════╝
`);
    console.log(`Recordings folder: ${RECORDINGS_DIR}`);
    console.log(`Vocabulary loaded:  ${SITL_KEYTERMS.length} keyterms`);
    console.log(`Custom spellings:   ${SITL_CUSTOM_SPELLING.length} correction rules\n`);

    const recordings = listRecordings();

    if (recordings.length === 0) {
      console.log("No audio files found in the recordings folder.");
      console.log(`Looked in: ${RECORDINGS_DIR}`);
      console.log(`\nYou can also pass a file path directly:`);
      console.log(`  node sitl_transcribe.js "C:\\path\\to\\recording.mp3"\n`);
      process.exit(0);
    }

    console.log("Available recordings (newest first):\n");
    recordings.forEach((r, i) => {
      const date = r.modified.toLocaleDateString("en-US", {
        month: "2-digit", day: "2-digit", year: "2-digit"
      });
      console.log(`  [${i + 1}]  ${r.name}  (${r.sizeMB} MB, ${date})`);
    });

    console.log(`\n  [0]  Enter a custom file path`);
    console.log("");

    const choice = await prompt("Pick a file number: ");
    const choiceNum = parseInt(choice, 10);

    if (choiceNum === 0) {
      input = await prompt("Enter file path or URL: ");
    } else if (choiceNum >= 1 && choiceNum <= recordings.length) {
      input = recordings[choiceNum - 1].fullPath;
    } else {
      console.error("Invalid selection.");
      process.exit(1);
    }

    console.log("");
  } else {
    // ── CLI mode: file path passed as argument ──
    input = args[0];
    outputPath = args[1] || null;
  }

  let audioUrl;

  // Determine if input is a URL or local file
  if (input.startsWith("http://") || input.startsWith("https://")) {
    audioUrl = input;
    log(`Using remote URL: ${input}`);
  } else {
    // If just a filename (no path separators), look in RECORDINGS_DIR
    if (!input.includes(path.sep) && !input.includes("/")) {
      const inRecordings = path.join(RECORDINGS_DIR, input);
      if (fs.existsSync(inRecordings)) {
        input = inRecordings;
      }
    }

    if (!fs.existsSync(input)) {
      console.error(`ERROR: File not found: ${input}`);
      console.error(`Also checked: ${path.join(RECORDINGS_DIR, path.basename(input))}`);
      process.exit(1);
    }
    audioUrl = await uploadFile(input);
  }

  // Submit and poll
  const transcriptId = await submitTranscription(audioUrl);
  const result = await pollForCompletion(transcriptId);

  // Format output
  const formatted = formatTranscript(result);

  // Determine output path — default to Transcripts subfolder
  if (!outputPath) {
    // Create Transcripts subfolder if it doesn't exist
    if (!fs.existsSync(TRANSCRIPTS_DIR)) {
      fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });
      log(`Created output folder: ${TRANSCRIPTS_DIR}`);
    }
    const baseName = path.basename(input).replace(/\.[^.]+$/, "");
    outputPath = path.join(TRANSCRIPTS_DIR, `${baseName}_transcript.md`);
  }

  fs.writeFileSync(outputPath, formatted, "utf-8");
  log(`Transcript saved to: ${outputPath}`);

  // Print summary
  console.log(`
╔══════════════════════════════════════════════╗
║   Transcription Complete                     ║
╠══════════════════════════════════════════════╣
║  Duration:    ${String(Math.round(result.audio_duration / 60) + " minutes").padEnd(30)}║
║  Confidence:  ${String((result.confidence * 100).toFixed(1) + "%").padEnd(30)}║
║  Words:       ${String(result.words?.length || "N/A").padEnd(30)}║
║  Speakers:    ${String(result.utterances?.length ? new Set(result.utterances.map(u => u.speaker)).size : "N/A").padEnd(30)}║
║  Output:      ${String(path.basename(outputPath)).padEnd(30)}║
║  Saved to:    ${String(path.dirname(outputPath)).substring(0, 30).padEnd(30)}║
╚══════════════════════════════════════════════╝
`);
}

main().catch(err => {
  console.error(`\nERROR: ${err.message}`);
  process.exit(1);
});
