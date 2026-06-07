# SITL Convo 1 Instructions — Session Notes Generation

**Last updated:** 06/07/2026 (reconstructed)

This document defines the step-by-step workflow for **Convo 1**: turning a raw session transcript into a complete, verified, styled session-notes `.docx`. It is a companion to `SKY_IS_THE_LIMIT_PROJECT_INSTRUCTIONS_TRIMMED.md` (the master ruleset) and assumes all shared rules, constraints, definitions, and the Source Authority Hierarchy from that file apply here.

> Convo 1 produces two things: (1) the finished session-notes `.docx`, and (2) the **Convo 2 Handoff Block**. Convo 2 then propagates everything into the Obsidian vault. Convo 1 never touches the vault.

---

## PURPOSE

Convo 1 takes the raw transcript (plus the DDB roll archive and source files) and produces an accurate, fully-populated session-notes document. Accuracy and verbatim canon win over polish everywhere except Kit's POV Journal. Nothing is invented; every data point is tagged to the originating real-world session date.

---

## PREREQUISITES

Before starting Convo 1, you need:

1. **The raw transcript** for the session — from `Session_Sources/Transcripts/Raw_Unedited/`, or pasted/uploaded into this conversation. Filename format: `##_MMddyy_`.
2. **Session identity confirmed** — session number, real-world play date (MMddyy), party present, absent players.
3. **Supabase MCP connected** — for the DDB roll archive (`sitl_session_rolls` view). Confirm Taylor has run the post-session sync (there is a delay after a session before rolls appear).
4. **The `sitl-v8-docx` skill** — the condensed styling reference for the `.docx`. Only read the full `sitl_v8.js` if the skill says to.

If the transcript is missing or the roll archive isn't synced yet, say so immediately. Do not draft notes from memory.

---

## WHAT CONVO 1 DOES NOT DO

- **Does not update the Obsidian vault.** That's Convo 2's job.
- **Does not write to Google Drive or DDB.** Read-only on the roll archive (query, never write).
- **Does not pull from prior sessions to rewrite history.** Sessions are delineated by real-world play date. Preserve and flag discrepancies; never contaminate.
- **Does not invent.** Unknown / missing / ambiguous = `[Unknown/Ambiguous]`. The only narrative-license exception is Kit's POV Journal.

---

## PHASED EXECUTION

Convo 1 runs in seven sequential steps. Steps 1–2 (correction) gate everything: **spell check always precedes notes generation.** Step 3 (roll archive) feeds the Logs section. Steps 4–6 build and render the notes. Step 7 hands off to Convo 2.

Log progress to `/home/claude/convo1_progress.md` as each step completes, so state survives a tool restart.

```
Step 1  Intake & Session Identification
Step 2  Spell Check & Transcript Correction   ← review-before-apply, then save corrected transcript
Step 3  Roll Archive Cross-Reference          ← Supabase sitl_session_rolls
Step 4  Session Notes Drafting                ← 8 sections, content per SECTION BREAKDOWN
Step 5  Title Selection                       ← 5 options, confirm final
Step 6  .docx Generation                      ← sitl-v8-docx skill → sitl_v8.js pipeline
Step 7  Convo 2 Handoff Block
```

---

## STEP 1 — INTAKE & SESSION IDENTIFICATION

1. Confirm: **Session number** (formatted `01`, `02`, …), **session date** (`MM/DD/YYYY`), **party present**, **absent players**.
2. Locate the raw transcript. Reading mechanics:
   - `.docx` transcripts are plain ASCII inside — read with `cat` + `grep -n`, **not** `pandoc` or `python-docx`.
   - Large transcripts (~1700+ paragraphs): read in ~200-line batches via `sed -n 'START,ENDp'`.
3. Note **unusual circumstances** up front: split session, absent players, short run time, guest player (8th speaker). These must surface in the notes and the handoff.
4. **Topsy & Turvy:** Taylor and Matt roll for them. Addison will ask, the player will state it, or infer from initiative order.

---

## STEP 2 — SPELL CHECK & TRANSCRIPT CORRECTION

**No silent fixes.** Every correction is proposed in a table and confirmed by Taylor *before* it is applied.

1. **Build a spell-check table** for review:

   | Line / Context | Heard (raw) | Proposed Correction | Reason |
   |---|---|---|---|
   | … | … | … | canonical spelling / context / mishear |

2. **Correction rules:**
   - **Source material spelling overrides** DM pronunciation and speech-to-text. (DM agreed to this convention.)
   - **Non-native speakers:** Sirius (Aeolus, Poland) and Florian (Blarg, Germany) speak with heavy accents — **prefer context over auto-correction.**
   - **Canonical spellings** (always use): Drow (not "drought"), kuo-toa (not "kuatoa"), Ilvara Mizzrym, Jorlan Duskryn, Shoor Vandree, Sarith, Asha Vandree, Eldeth, Derendil, Stool, Topsy, Turvy, Buppido, Glabbagool; Velkynvelve, Neverlight Grove, Menzoberranzan, Zurkhwood, Sloobludop, Gracklstugh; Vrocks, chasmes, quaggoths, svirfneblin; Longstrider, Faerie Fire, Thaumaturgy, Eldritch Blast, Shocking Grasp, Entangle, Prestidigitation. (Cross-check against `Core_Forgotten_Realms_Underdark_Regions_and_Locations.md` and `Characters_Associated_with_the_Underdark.md`.)
   - **Line-specific replacements** where a word is both a feature and a creature — e.g., "chasm" (geographic, correct) vs. "chasme" (fiend). Never global find-replace these.
   - **Word-boundary regex** to avoid partial corruption: `re.sub(r'\bterm\b', …)` (e.g., `Larg` → `Blarg` must not corrupt an existing `Blarg`).
   - **Vrocks and chasmes are fiends, not undead** — common prior misclassification.
   - **DM audio drops:** Addison has mic issues. Mark clipped/garbled audio `[inaudible/cut off]` and flag — **never guess.**
   - **Attribution:** if a DM line may belong to an NPC, flag and ask. Don't guess.

3. **Apply** only after confirmation.
4. **Save the corrected transcript** to `Session_Sources/Transcripts/Corrected/` as **`[##] - [MMddyy]_corrected.md`** (script/diarized format). Record that this file exists for the handoff block.
5. Set **Spelling Checked = Yes** in the metadata.

---

## STEP 3 — ROLL ARCHIVE CROSS-REFERENCE (SUPABASE)

The DDB roll archive is the **gold standard for roll verification** (verbal transcript can mishear numbers).

1. **Confirm sync first.** There's a delay after a session before rolls land. Check the latest synced roll:
   ```sql
   SELECT MAX(timestamp_iso) FROM sitl_session_rolls;
   ```
   If the session date isn't covered, **flag the gap and ask whether Taylor wants to sync** (browser console + `ddb_sync_supabase.js`). Do not fabricate.

2. **Pull the session's rolls** (Eastern Time `session_date`):
   ```sql
   SELECT * FROM sitl_session_rolls WHERE session_date = 'YYYY-MM-DD';
   -- per character:
   SELECT * FROM sitl_session_rolls WHERE session_date = 'YYYY-MM-DD' AND character = 'Kit Aluri';
   -- counts:
   SELECT character, COUNT(*) AS rolls FROM sitl_session_rolls WHERE session_date = 'YYYY-MM-DD' GROUP BY character ORDER BY rolls DESC;
   ```
   Always use the `sitl_session_rolls` view for this project (it pre-filters to campaign_id = 1 / game_id 6907990 and derives `session_date` in ET).

3. **Cross-reference rules:**

   | Use the Archive for | Use the Transcript for |
   |---|---|
   | Exact roll values, timing, who rolled | Narrative context, DM rulings, in-fiction outcomes, dialogue |

   - Roll in transcript but **not** in archive → flag **"transcript-only."**
   - Roll in archive but **not** in transcript → likely a quick mechanical roll.
   - **Physical dice rolls** (some players use physical dice — won't appear in DDB): if the transcript confirms a result, include it in the Roll Log marked **`physical dice roll`.** Binks (Matt) and Aeolus (Sirius) consistently use physical dice — zero archive entries for them is expected, not an error.

4. **Data quirks to respect:**
   - DM-controlled creatures (Black Pudding, Gelatinous Cube, etc.) appear in the log — they're monsters Addison rolls for, not party members.
   - `action = "custom"` with no name is usually a freeform DM-prompted roll — use the transcript for context.
   - Some early rolls have empty `character` — attribute via transcript cross-reference (and `user_id`: Florian → Blarg, Austin → Darby).
   - Summoned creatures get their own `character` entries.

---

## STEP 4 — SESSION NOTES DRAFTING

**Content authority:** `SESSION_NOTES_SECTION_BREAKDOWN.md`. Do not alter or skip sections. Tables must have **enough rows to cover the full session.** Capture every plot development with equal care — no chronological bias. Every event, roll, quote, and decision is tagged to the correct session date and character.

The notes have **8 sections** (this mapping matches the `sitl_v8.js` structure):

1. **Session Metadata** — vertical table: Campaign, Session Number, Session Date, Start Location, End Location, Party Present, Total Rolls Logged, Party Level (note level-ups), Spelling Checked.
2. **Character POV Journal (Kit Aluri)** — the storytelling exception. In-character, in-world. **Apply the POV Journal Hard Limits** from the master ruleset and use the **`kit-pov-journal` skill** for voice. Before writing, read Kit's **Inner Life & Evolution** state so the entry reflects where she currently is. Never include OOC speech, above-table info, metagame knowledge (dice numbers, spell names as mechanical labels, stats, levels, HP), player process, DM-rulings-as-rulings, or any real-world names/session references. Test: *Could Kit know, feel, or observe this from inside the story?*
3. **Session Analysis** — Narrative Summary (all developments equally, plus table flavor/jokes); Setting (start location + in-game days since story start, if known); Locations table (Location | Description | Notable Details); Quests/Objectives (parent + sub-threads, mark "Completed (This Session)" when resolved); Scene/Timeline Breakdown (bulleted, chronological); Themes & Emotional Beats (motifs, arcs; document dream sequences without asserting unconfirmed meaning).
4. **Character Activity** — Party Structure & Subgroups table (Location | Characters | Objective | Status); NPCs table (Name | Race/Class | Affiliations | Last Interaction | Last Known Location | Status); Reputation & Relationships.
5. **Artifacts** — Loot & Items table (Character/Owner | Item/Artifact | State/Context). Do not invent item properties.
6. **Logs** — Encounters table (Enemies | Location | Party/Allies Present | Trigger | Outcome); Initiative table per combat (Character | Initiative Roll | Turn Order — infer enemy placement from turn order if unstated; opportunity attacks are NOT an initiative change); Encounter Summary (brief results/implications); **Full Roll Log** (Character/NPC | Roll/Check | Result | Context/Outcome — background-fill combat/initiative rows, attribute correctly, note trends).
7. **Quotes & Language** — Quote Board (**verbatim only**, tagged: Funny / Poignant / DM Quip / Banter / Serious / Important to story); Profanity Record table (Speaker | Curse Word | Frequency | Context — one row per speaker/word combo); Alternate Title Options (see Step 5).
8. **Archivist Notes** — Patterns, Progress & Future Implications (tactics, motifs, growth arcs — no metagaming/future-plot prediction); Continuity Flags, Missing Info & Ambiguities (all `[inaudible]` segments, transcript-only rolls, unresolved attributions, suspected spelling issues needing confirmation).

**Feydark time** is temporally isolated from the Underdark clock — never infer in-game time from session count.

---

## STEP 5 — TITLE SELECTION

1. Propose **5 options, one per type:** Humorous, Dramatic, Serious, Straightforward, Quote-based.
2. Present for Taylor's choice (tappable options preferred).
3. **Record the final chosen title** in the Alternate Title Options section ("FINAL CHOSEN TITLE"). Also keep any alternative names suggested during play.

---

## STEP 6 — .docx GENERATION

1. **Read the `sitl-v8-docx` skill first** for the condensed styling reference (palette `C`, fonts `F`, helpers). Only open the full `sitl_v8.js` if the skill directs it. Do not hardcode colors/fonts/sizes inline.
2. Build content using the script's exact constants and cell/table builders.
3. Generate the buffer with `Packer.toBuffer()`, then **run the required `fix_tbl_borders` post-processing** to strip invalid `<w:left>`/`<w:right>` from `<w:tblBorders>`, then repack with `pack.py --original`.
4. **Validate** with `validate.py` before delivering.
5. Copy the final file to `/mnt/user-data/outputs/` and `present_files`.

**File naming:** `SITL_[##]_[MMDDYY]_[Title].docx` (matches the handoff block).

**Styling guardrails (do not override):** section-header rule lives on the blank spacer row, not the fill paragraph; POV/quote body = no fill, gold `#D4A843` 2.25pt left border, `#1E2F6B` text, 9pt Aptos regular; quote "Repeat this block" = `#E8ECF8` fill + gold left border; all table borders white (no grid lines); no header/footer on any page.

---

## STEP 7 — CONVO 2 HANDOFF BLOCK

Output the handoff block (from `CONVO2_HANDOFF_TEMPLATE.md`) for Taylor to copy into a fresh Convo 2 chat:

```
Session [##], Convo 2: Vault updates

**Session Title:** [Final chosen title]
**Session Date:** [MM/DD/YYYY]
**Session File:** SITL_[##]_[MMDDYY]_[Title].docx (generated in Convo 1)

**Corrected transcript location:** Session_Sources/Transcripts/Corrected/[filename]

**Party present:** [list]
**Party level:** [level]
**Absent players:** [list or "none"]

**Key events for vault updates:**
- [2-3 sentence summary of major plot developments]
- [New NPCs introduced or status changes]
- [New locations visited]
- [Notable loot/items]
- [Quests completed or opened]

**Flags from Convo 1:**
- [Any continuity issues, ambiguities, or items needing Taylor's input]
- [Any DDB archive discrepancies]
- [Anything the Archivist flagged for follow-up]

**DDB Roll Archive status:** [X rolls cross-referenced for this session / any gaps noted]
```

---

## CATCH-UP / BATCH NOTES

If multiple sessions need processing, work in **chronological order** by real-world play date — one full Convo 1 per session. Never merge sessions. Preserve and flag any cross-session discrepancies rather than reconciling them silently.

Legacy gap to watch: **S04 corrected transcript** is still missing.

---

## COMPLETION CRITERIA

Convo 1 is done when:

1. ✅ Corrected transcript saved to `Session_Sources/Transcripts/Corrected/`.
2. ✅ Roll archive cross-referenced (or gap explicitly flagged).
3. ✅ All 8 notes sections complete, tables fully populated, every datum date/character-tagged.
4. ✅ POV Journal passes the Hard Limits test.
5. ✅ Final title confirmed and recorded.
6. ✅ `.docx` generated, border-fixed, validated, delivered via `present_files`.
7. ✅ Convo 2 Handoff Block output.
