/**
 * ============================================================
 * SITL AssemblyAI Transcriber
 * ============================================================
 * 
 * Transcribes Sky Is The Limit D&D session recordings using
 * AssemblyAI with campaign-specific vocabulary boosting and
 * custom spelling corrections pre-loaded.
 *
 * PREREQUISITES:
 *   1. Node.js installed (v18+)
 *   2. AssemblyAI API key (https://www.assemblyai.com/app/account)
 *   3. Set your key: ASSEMBLYAI_API_KEY environment variable
 *      or paste it into the API_KEY constant below
 *
 * USAGE:
 *   node sitl_transcribe.js <audio_file_path> [output_path]
 *
 * EXAMPLES:
 *   node sitl_transcribe.js ./session14_recording.mp3
 *   node sitl_transcribe.js ./session14.m4a ./transcripts/session14.txt
 *   node sitl_transcribe.js https://example.com/audio.mp3
 *
 * SUPPORTED FORMATS: mp3, mp4, m4a, wav, webm, ogg, flac
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

// ── CONFIG ──────────────────────────────────────────────────
// Set your API key here OR use the ASSEMBLYAI_API_KEY env var
const API_KEY = process.env.ASSEMBLYAI_API_KEY || "";
const BASE_URL = "https://api.assemblyai.com";

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
];

// ── CUSTOM SPELLING CORRECTIONS ─────────────────────────────
// These fix AFTER transcription — replacing common misheard
// versions with the correct spelling.
//
// Format: { "CorrectSpelling": ["misheard1", "misheard2"] }
// The "from" values are case-insensitive.

const SITL_CUSTOM_SPELLING = [
  // Character names
  { from: ["Banks", "Binks's", "Beaks", "Beaks's"], to: "Binks" },
  { from: ["Aolis", "Aolus", "Aeolous", "Aaylas", "Alist", "alias"], to: "Aeolus" },
  { from: ["Larg", "Black's", "Blacks"], to: "Blarg" },
  { from: ["Manita", "Anita", "Amanina", "Ramanita"], to: "Amanita" },
  { from: ["Hanna"], to: "Hannah" },

  // NPC names
  { from: ["Jorlin", "Jorland"], to: "Jorlan" },
  { from: ["Sareth", "Sarath"], to: "Sarith" },
  { from: ["Darindel", "Derendal"], to: "Derendil" },
  { from: ["Eldith", "eldest"], to: "Eldeth" },
  { from: ["Asha Vandry"], to: "Asha Vandree" },
  { from: ["Shore", "Shure", "Sure Vandree"], to: "Shoor Vandree" },
  { from: ["Jim Jar", "Jimmer"], to: "Jimjar" },
  { from: ["Shushar", "Shu shar"], to: "Shuushar" },
  { from: ["Toppsy", "Tossi", "Dopsy"], to: "Topsy" },
  { from: ["Turby", "Kirby", "Herby", "Pervy", "Tury"], to: "Turvy" },

  // Locations
  { from: ["Belkin Bells", "Belkin valve", "Belkinvelve", "Velkenvelve"], to: "Velkynvelve" },
  { from: ["Mendobarranzan", "Menzobaranzan", "Menzo Baranzan"], to: "Menzoberranzan" },
  { from: ["Blingington Stone", "Blingdonstone", "Blinden stone"], to: "Blingdenstone" },
  { from: ["Sloopludop", "Slew blood up", "Sloop blood up"], to: "Sloobludop" },
  { from: ["Gracklestug", "Grackle stew", "Grackel stug"], to: "Gracklstugh" },

  // Underdark terms
  { from: [
      "phaers ris", "pharezeros", "faresrus", "Ferris Rus",
      "fares wriths", "Pharaoz", "Pharezeros", "Faris Russ",
      "Faeries", "phaser us"
    ], to: "Faerzress" },
  { from: ["Zerkwood", "zerk wood", "Zurk wood"], to: "Zurkhwood" },

  // Creatures
  { from: ["drought", "Drow"], to: "drow" },
  { from: ["kuatoa", "kua toa", "cool-toa", "ku-ah-toa"], to: "kuo-toa" },
  { from: ["quagos", "quaggath", "quag goth"], to: "quaggoth" },
  { from: ["chasm demon", "kazme"], to: "chasme" },
  { from: ["do-air-gar", "dew-air-gar", "Dwuergar"], to: "duergar" },
  { from: ["svirf neblin", "swear neblin", "smurf neblin"], to: "svirfneblin" },
  { from: ["my connid", "mykinid", "meconid"], to: "myconid" },

  // Spells
  { from: ["Augery"], to: "Augury" },
  { from: ["Prestidigitation"], to: "Prestidigitation" },
  { from: ["fairy fire", "fairy Fire"], to: "Faerie Fire" },
  { from: ["Eldritch blast"], to: "Eldritch Blast" },
];


// ── HELPER FUNCTIONS ────────────────────────────────────────

function log(msg) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${msg}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════╗
║   SITL AssemblyAI Transcriber                ║
║   Sky Is The Limit Campaign                  ║
╚══════════════════════════════════════════════╝

Usage: node sitl_transcribe.js <audio_file> [output_file]

Arguments:
  audio_file   Path to local audio file or URL
  output_file  Optional output path (default: same name + .txt)

Examples:
  node sitl_transcribe.js session14.mp3
  node sitl_transcribe.js session14.m4a transcripts/s14.txt
  node sitl_transcribe.js https://example.com/audio.mp3

Vocabulary loaded: ${SITL_KEYTERMS.length} keyterms
Custom spellings: ${SITL_CUSTOM_SPELLING.length} correction rules

Set your API key:
  export ASSEMBLYAI_API_KEY=your_key_here
  — or edit API_KEY in this script
`);
    process.exit(0);
  }

  // Validate API key
  if (API_KEY === "YOUR_API_KEY_HERE") {
    console.error("ERROR: Set your AssemblyAI API key first.");
    console.error("  export ASSEMBLYAI_API_KEY=your_key_here");
    console.error("  — or edit the API_KEY constant in this script.");
    process.exit(1);
  }

  const input = args[0];
  let audioUrl;

  // Determine if input is a URL or local file
  if (input.startsWith("http://") || input.startsWith("https://")) {
    audioUrl = input;
    log(`Using remote URL: ${input}`);
  } else {
    // Local file — upload to AssemblyAI first
    if (!fs.existsSync(input)) {
      console.error(`ERROR: File not found: ${input}`);
      process.exit(1);
    }
    audioUrl = await uploadFile(input);
  }

  // Submit and poll
  const transcriptId = await submitTranscription(audioUrl);
  const result = await pollForCompletion(transcriptId);

  // Format output
  const formatted = formatTranscript(result);

  // Determine output path
  const outputPath = args[1] || input.replace(/\.[^.]+$/, "_transcript.txt");

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
╚══════════════════════════════════════════════╝
`);
}

main().catch(err => {
  console.error(`\nERROR: ${err.message}`);
  process.exit(1);
});
