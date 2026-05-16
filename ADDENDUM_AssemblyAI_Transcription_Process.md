# ADDENDUM: AssemblyAI Transcription Process

**Added:** 2026-05-15
**Applies to:** Convo 1, Step 2 (Spell Check) and Step 3 (Corrected Transcript)
**Script location:** `sitl_vault\Workflows\sitl_transcribe.js`

---

## Overview

Session recordings are now transcribed locally via a Node.js script that calls the AssemblyAI API with campaign-specific vocabulary pre-loaded. This replaces the previous workflow of using raw speech-to-text output from the recording platform and dramatically reduces the number of spelling corrections needed in Step 2.

The script produces a raw transcript saved as `.md` in the vault. This raw transcript is then reviewed, corrected, and moved to the Corrected folder as part of the normal Convo 1 workflow.

---

## Prerequisites

1. **Node.js v18+** installed
2. **AssemblyAI API key** — set as environment variable `ASSEMBLYAI_API_KEY` or hardcoded in the script's `API_KEY` constant
3. **Session recording** (.mp3, .mp4, .m4a, .wav, .webm, .ogg, .flac) placed in `sitl_vault\Session_Sources\Recordings\`

---

## How to Run

### Option A: Interactive Picker (Recommended)
```
cd C:\Users\theli\sitl_vault\Workflows
node sitl_transcribe.js
```
Lists all recordings in the Recordings folder sorted newest-first. Pick by number.

### Option B: Direct Filename
```
node "C:\Users\theli\sitl_vault\Workflows\sitl_transcribe.js" "041226_Sky_Is_The_Limit_Recording.mp3"
```
⚠️ Filenames with spaces **must** be wrapped in quotes.
⚠️ Include the file extension (.mp3, .m4a, etc.).

### What Happens
1. Script uploads the audio file to AssemblyAI
2. Submits transcription request with 206 campaign-specific keyterms and 31 custom spelling corrections
3. Polls until transcription completes (typically 2–5 minutes depending on length)
4. Saves formatted transcript to `sitl_vault\Session_Sources\Transcripts\Raw\[filename]_transcript.md`
5. Prints summary with duration, confidence score, word count, and speaker count

---

## Vault File Flow

```
Session_Sources/
├── Recordings/
│   └── 041226_Sky_Is_The_Limit_Recording.mp3      ← original audio
└── Transcripts/
    ├── Raw/
    │   └── 041226_Sky_Is_The_Limit_Recording_transcript.md  ← script output
    └── Corrected/
        └── 14_041226_corrected.md                  ← after spell check + formatting
```

**Raw → Corrected process:**
1. Run `sitl_transcribe.js` → raw transcript lands in `Transcripts/Raw/`
2. Claude performs Step 2 spell check against the raw transcript
3. Taylor confirms corrections
4. Claude applies corrections, reformats to script format, saves to `Transcripts/Corrected/` as `[Session#]_[MMddyy]_corrected.md`

---

## What the Script Does to Improve Accuracy

### Keyterms Prompt (206 terms)
Tells AssemblyAI's model to prioritize recognizing campaign-specific words during transcription. Organized by category:

- Player characters and player names
- NPC companions, prisoners, antagonists (Ilvara, Jorlan, Derendil, Topsy, Turvy, etc.)
- Demon lords and deities (Lolth, Demogorgon, etc.)
- Major locations (Velkynvelve, Menzoberranzan, Blingdenstone, Gauntlgrym, etc.)
- Underdark regions, sub-locations, materials (Faerzress, Zurkhwood, Feydark)
- Creatures and monsters (quaggoth, chasme, vrock, derro, svirfneblin, kuo-toa, etc.)
- D&D spells used by the party
- D&D mechanics terminology (Battle Master, superiority dice, Wild Shape, etc.)
- Factions and legendary lore NPCs (Drizzt, Bruenor, Society of Brilliance, etc.)

### Custom Spelling Corrections (31 rules)
Post-transcription find-and-replace for known misheard variants. Examples:

| Misheard | Corrected To |
|---|---|
| Banks, Beaks | Binks |
| Aolis, Aolus, Aeolous | Aeolus |
| Sloopidoop, Slooplidoop | Sloobludop |
| Gontulgrim, Gontelgrim | Gauntlgrym |
| Griszt, Drizzit | Drizzt |
| Brunner | Bruenor |
| darrow | derro |
| drought | drow |
| pharezeros, faresrus | Faerzress |

⚠️ **AssemblyAI limitation:** The `custom_spelling` `to` field accepts single words only. Multi-word corrections (e.g., "Faerie Fire", "Asha Vandree") are handled by keyterms instead, which boosts recognition of the correct phrase during transcription.

### Speaker Diarization
Configured to expect 7 speakers (DM + 6 players). AssemblyAI labels speakers as A–G. In practice:

- The model sometimes identifies speakers by character/player name (observed in session 14 .md output)
- Addison (DM) frequently gets split into two speaker labels due to mic quality shifts
- Sirius (Aeolus) and Hannah (Amanita) are the most commonly mislabeled speakers (quieter voices)
- Speaker mapping must be verified each session during the spell check step

---

## Maintaining the Vocabulary

As the campaign progresses, new terms need to be added to the script. Edit `sitl_transcribe.js` directly:

- **New NPCs/locations/creatures:** Add to the appropriate category in `SITL_KEYTERMS`
- **New misheard variants discovered during spell check:** Add to `SITL_CUSTOM_SPELLING`
- Remember: `custom_spelling` `from` and `to` values must each be single words
- Maximum 1,000 keyterms (currently at 206 — plenty of headroom)

After each session's spell check, Claude should recommend any new terms to add based on corrections made.

---

## Recordings Storage

- **Primary (vault):** `C:\Users\theli\sitl_vault\Session_Sources\Recordings\`
- **Original backup (OneDrive):** `C:\Taylor Askew Ritchie\DND\DND\Sky Is The Limit\Sky Is The Limit\Recordings\`

The script points to the vault copy. Originals remain in OneDrive as backup.

---

## Impact on Convo 1 Workflow

The transcription script changes the **input** to Convo 1 but not the process itself:

| Step | Before | After |
|---|---|---|
| **Input** | Raw transcript from recording platform (.docx) | Raw transcript from AssemblyAI via script (.md) |
| **Step 2: Spell Check** | 30+ corrections typical | ~5–10 corrections typical |
| **Step 3: Corrected Transcript** | Apply corrections + reformat | Apply corrections + reformat (same process, less work) |
| **Steps 4–8** | No change | No change |

The spell check step is still required. The script catches most campaign-specific terms but will miss new names, unusual pronunciations, and context-dependent corrections (e.g., "chasm" the geographic feature vs. "chasme" the demon). Claude still performs the full cross-reference against source files.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| "File not found" | Wrap filename in quotes if it has spaces. Include the file extension. |
| "Access denied" | You ran the .js file directly instead of with `node`. Use `node sitl_transcribe.js` |
| "custom_spelling 'to' fields must contain only one word" | A `to` value in `SITL_CUSTOM_SPELLING` has multiple words. Fix it to a single word or remove the rule and rely on keyterms instead. |
| API key error | Set `ASSEMBLYAI_API_KEY` environment variable or edit the `API_KEY` constant in the script |
| Old version running | Make sure you're running the copy in `sitl_vault\Workflows\`, not an old copy elsewhere. Use the full path: `node "C:\Users\theli\sitl_vault\Workflows\sitl_transcribe.js"` |
| Transcripts saving as .txt | Update script — output extension should be `.md` |
| Speaker labels wrong | Speaker diarization varies between runs. Always verify mapping during spell check. |
