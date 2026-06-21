# SITL Convo 1 Instructions — Session Notes Generation

**Last updated:** 06/21/2026

This document defines the step-by-step workflow for **Convo 1**: turning a raw/unedited session transcript into a complete, verified **session-notes markdown file written to `01-Sessions/`**, plus the registration of the session and the handoff to Convo 2. It is a companion to `Project_Instructions.md` (the master ruleset) and assumes all shared rules, constraints, definitions, and the Source Authority Hierarchy from that file apply here.

> Convo 1 produces three things: (1) the finished session note in `01-Sessions/`, (2) a registered session row in `ddb_sessions` (Supabase), and (3) the **Convo 2 Handoff Block**. Convo 2 then propagates everything else across the rest of the vault and wires the session into the website.

---

## PURPOSE

Convo 1 takes the Raw/Unedited Transcript (plus the DDB roll archive and source files) and produces an accurate, fully-populated session note **in markdown**, written directly to the vault's `01-Sessions/` folder. Accuracy and verbatim canon win over polish everywhere except Kit's POV Journal. Nothing is invented; every data point is tagged to the originating real-world session date.

The session note is **also the source the public website renders from** (`rectrixcaedere.com` reads the note live). That makes a set of heading/frontmatter rules load-bearing — see **Step 6 → Website Parser Contract**. A note can be archive-perfect and still render blank on the site if those rules aren't met.

---

## PREREQUISITES

Before starting Convo 1, you need:

1. **The Raw/Unedited Transcript** for the session — from `Session_Sources/Transcripts/Raw_Unedited/`, or pasted/uploaded into this conversation. Filename format: `##_MMddyy_`.
2. **Session identity confirmed** — session number, real-world play date (MMddyy), party present, absent players.
3. **Supabase MCP connected** — for the DDB roll archive (`sitl_session_rolls` view) and for registering the session (`ddb_sessions`). Confirm Taylor has run the post-session sync (there is a delay after a session before rolls appear).
4. **The vault is reachable** — Convo 1 writes the note to `01-Sessions/`. Use the Filesystem MCP (reliable) or GitHub; the Obsidian MCP is timeout-prone.

If the transcript is missing or the roll archive isn't synced yet, say so immediately. Do not draft notes from memory.

---

## WHAT CONVO 1 DOES NOT DO

- **Does not do full vault propagation.** Convo 1 writes ONLY the `01-Sessions/` note. Dashboard, trackers, character pages, locations, journal, etc. are Convo 2's job.
- **Does not write to Google Drive or DDB.** Read-only on the roll archive (`ddb_rolls` / `sitl_session_rolls` — query, never write). The ONE Supabase write Convo 1 makes is the `ddb_sessions` registry upsert in Step 7.
- **Does not pull from prior sessions to rewrite history.** Sessions are delineated by real-world play date. Preserve and flag discrepancies; never contaminate.
- **Does not invent.** Unknown / missing / ambiguous = `[Unknown/Ambiguous]`. The only narrative-license exception is Kit's POV Journal.

---

## PHASED EXECUTION

Convo 1 runs in eight sequential steps. Steps 1–2 (correction) gate everything: **spell check always precedes notes generation.** Step 3 (roll archive) feeds the Logs section. Steps 4–6 build the note and write it to the vault. Step 7 registers the session. Step 8 hands off to Convo 2.

Log progress to `/home/claude/convo1_progress.md` as each step completes, so state survives a tool restart.

```
Step 1  Intake & Session Identification
Step 2  Spell Check & Transcript Correction   ← review-before-apply, then save corrected transcript
Step 3  Roll Archive Cross-Reference          ← Supabase sitl_session_rolls
Step 4  Session Notes Drafting                ← 8 sections, content per SECTION BREAKDOWN
Step 5  Title Selection                       ← 5 options, confirm final
Step 6  Write Session Note                    ← markdown → 01-Sessions/, MUST satisfy the Website Parser Contract
Step 7  Register Session                      ← ddb_sessions upsert (Supabase)
Step 8  Convo 2 Handoff Block
```

---

## STEP 1 — INTAKE & SESSION IDENTIFICATION

1. Confirm: **Session number** (formatted `01`, `02`, …), **session date** (`MM/DD/YYYY`), **party present**, **absent players**.
2. Locate the Raw/Unedited Transcript. Reading mechanics:
   - `.docx` transcripts are plain ASCII inside — read with `cat` + `grep -n`, **not** `pandoc` or `python-docx`.
   - Large transcripts (~1700+ paragraphs): read in ~200-line batches via `sed -n 'START,ENDp'`.
3. Note **unusual circumstances** up front: split session, absent players, short run time, guest player (8th speaker). These must surface in the note and the handoff.
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

The note has **8 sections** (this mapping matches the SECTION BREAKDOWN):

1. **Session Metadata** — Campaign, Session Number, Session Date, Start Location, End Location, Party Present, Total Rolls Logged, Party Level (note level-ups), Spelling Checked.
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

## STEP 6 — WRITE SESSION NOTE (MARKDOWN → `01-Sessions/`)

Write the full markdown session note to the vault. This is the archive record **and** the website's source, so it must satisfy the Website Parser Contract below or sections render blank on the live site.

**Target:** `01-Sessions/Session ## — Title.md`
- Use an **em dash (—)**, not a hyphen, in the filename.
- Match the exact final title from Step 5.

**Content:** all 8 sections from Step 4, in markdown, with Obsidian backlinks:
- `[[Character Name]]` for all PCs and NPCs
- `[[Location Name]]` for all locations
- `[[Session ## — Title]]` for cross-session references

### ⚠️ Website Parser Contract — LOAD-BEARING

`rectrixcaedere.com` reads this note live and extracts sections by scanning for an **H2 or H3 heading that *contains* a keyword**, grabbing everything until the next H2/H3. Three rules are non-obvious and silently break rendering if missed:

1. **Section headings MUST be `##` or `###`** — never `#`, `####`, bold-only, or ALL-CAPS plain text. The parser only matches `##`/`###` lines.
2. **The POV section heading MUST contain the words `POV Overview`** (e.g. `## POV Overview`), with the journal's evocative title as an `###` sub-heading beneath it. A heading like "Kit Aluri POV Journal" alone will NOT match — the hero/journal zone goes blank.
3. **Frontmatter MUST include these YAML keys** (the site reads them for the "At a glance" panel): `start_location:`, `end_location:`, `party_present:` (list or comma-separated), plus `session_date` and `session_number`.

**Required heading keywords** (each as an `##`/`###` heading containing the word — case-insensitive):

| Site zone | Heading must contain | Shape |
|---|---|---|
| Hero / Kit's journal | `POV Overview` | H2/H3 + an H3 title sub-line |
| Narrative | `Narrative Summary` (or `Session Analysis`) | prose |
| Scene/timeline | `Scene` | prose (zone hidden if absent) |
| Themes | `Themes` | prose |
| Quests | `Quests` | `- **Name**` bullets; "Completed" → marked done |
| NPCs | `NPCs` | pipe table (col 0 = name, last col = status) |
| Locations | `Locations` | table or prose |
| Loot | `Loot` | table (owner/item/state) or prose |
| Quotes | `Quote Board` | table (speaker/quote/tag) |
| Profanity | `Profanity` | table (speaker/word/freq) |
| Encounters | `Encounters` | table |
| Initiative | `Initiative` | table |
| Encounter summary | `Encounter Summary` | prose |
| Patterns | `Patterns` | prose |
| Continuity/flags | `Continuity` | prose |

### Validation before moving on
After writing the note, verify the contract mechanically. Example:
```bash
F="01-Sessions/Session ## — Title.md"
for h in "POV Overview" "Narrative Summary" "Themes" "Quests" "NPCs" "Locations" "Loot" "Quote Board" "Profanity" "Encounters" "Patterns" "Continuity"; do
  grep -qiE "^#{2,3}[^\n]*$h" "$F" || echo "MISSING heading: $h";
done
for k in start_location end_location party_present session_date session_number; do
  grep -qE "^$k:" "$F" || echo "MISSING frontmatter: $k";
done
```
Any `MISSING` line = fix the note before handoff. (Scene/Initiative/Encounter Summary zones self-hide when absent, so they're allowed to be missing if the session genuinely had none.)

---

## STEP 7 — REGISTER SESSION (SUPABASE)

Once the note is written and the title is final, register the session in the canonical session registry. A registered session is recognized by the character-snapshot system **regardless of roll count**, so low-combat / physical-dice nights are never dropped.

**This is Convo 1's ONLY Supabase write.** The roll archive (`ddb_rolls` / `sitl_session_rolls`) stays strictly read-only.

Run via Supabase MCP `execute_sql` (campaign_id 1 = SITL). **Double any single quote in the title** (e.g. `'Life Isn''t Faer-zress'`):

```sql
INSERT INTO ddb_sessions (campaign_id, session_no, session_date, title, source)
VALUES (1, <NN>, '<YYYY-MM-DD>', '<Title>', 'pipeline')
ON CONFLICT (campaign_id, session_date)
DO UPDATE SET session_no = EXCLUDED.session_no,
              title      = EXCLUDED.title,
              source     = EXCLUDED.source;
```

Idempotent — safe to re-run; a re-processed session just updates its own row. Confirm one row affected, then proceed to the handoff.

---

## STEP 8 — CONVO 2 HANDOFF BLOCK

Output the handoff block (the authoritative template is `Convo2_Handoff_Template.md`) for Taylor to copy into a fresh Convo 2 chat. It MUST include the "Character Descriptors Surfaced This Session" list (Convo 2 files those onto character pages):

```
Session [##], Convo 2: Vault updates

**Session Title:** [Final chosen title]
**Session Date:** [MM/DD/YYYY]
**Session Note:** 01-Sessions/Session ## — Title.md  (written in Convo 1)

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

**Character Descriptors Surfaced This Session:**
- [Character] — [Appearance / Personality & Quirks / Backstory] — [detail]
- (omit the line if none surfaced)

**Flags from Convo 1:**
- [continuity issues, ambiguities, or items needing Taylor's input]
- [DDB archive discrepancies]
- [anything the Archivist flagged]

**DDB Roll Archive status:** [X rolls cross-referenced / any gaps]
**Session registered in ddb_sessions:** [Yes — S## / YYYY-MM-DD]
```

---

## CATCH-UP / BATCH NOTES

If multiple sessions need processing, work in **chronological order** by real-world play date — one full Convo 1 per session. Never merge sessions. Preserve and flag any cross-session discrepancies rather than reconciling them silently.

**S04 note:** Session 04 (2025-11-23, "Life Isn't Faer-zress") was **not recorded** — Taylor was on vacation and only logged in briefly at the end. There is no corrected transcript and there never will be; its canonical source is **[Notes from Addison]**. This is an expected permanent gap, not something to chase. (Roll data exists for the date from her brief login.)

---

## COMPLETION CRITERIA

Convo 1 is done when:

1. ✅ Corrected transcript saved to `Session_Sources/Transcripts/Corrected/` (or S04-style gap explicitly noted).
2. ✅ Roll archive cross-referenced (or gap explicitly flagged).
3. ✅ All 8 note sections complete, tables fully populated, every datum date/character-tagged.
4. ✅ POV Journal passes the Hard Limits test.
5. ✅ Final title confirmed and recorded.
6. ✅ **Session note written** to `01-Sessions/Session ## — Title.md`, and the **Website Parser Contract validation passes** (all required `##`/`###` headings + frontmatter keys present).
7. ✅ **Session registered in `ddb_sessions`** (number, date, title).
8. ✅ Convo 2 Handoff Block output (including the Character Descriptors list).

---

## DEPRECATED

The `.docx` output path is retired. The `sitl-v8-docx` skill and `sitl_v8.js` generator are **deprecated, retained for reference only** — do not generate a `.docx` as part of the pipeline. The session note is markdown in `01-Sessions/`.
