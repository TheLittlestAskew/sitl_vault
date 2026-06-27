# SITL Convo 2 Instructions — Vault Updates

**Last updated:** 06/21/2026

This document defines the step-by-step workflow for Convo 2: propagating a session across the Obsidian vault and the website after the session note has been written in Convo 1. It is a companion to `Project_Instructions.md` (the master ruleset) and assumes all shared rules, constraints, and definitions from that file apply.

---

## PURPOSE

Convo 2 takes the **session note already written to `01-Sessions/` by Convo 1** (plus the handoff block) and propagates all new information across the rest of the Obsidian vault — and wires the session into the public website — so every page stays current. The vault is the campaign wiki — if it isn't in the vault, it doesn't exist for future reference.

Convo 1 owns the `01-Sessions/` note. Convo 2 **verifies** it exists and then does everything else: dashboard, trackers, character pages, locations, journal, flora/fauna, plus the website's session registry.

---

## PREREQUISITES

Before starting Convo 2, you need:

1. **The Convo 2 Handoff Block** — copy-pasted from the end of Convo 1. Contains session metadata, key events, the Character Descriptors list, flags, DDB archive status, and the `ddb_sessions` registration confirmation.
2. **The session note** — already in `01-Sessions/` (written by Convo 1). Read it from the vault; it is the content source for propagation.
3. **A working vault connection** — Obsidian MCP if responsive (vault name `sitl-vault`); the Filesystem MCP is the reliable fallback when Obsidian times out.

If the vault connection is unresponsive, say so immediately. Do not draft vault updates from memory without verifying current vault state.

---

## VAULT REFERENCE

**Vault name:** `sitl-vault`

**Folder structure:**
```
sitl-vault/
├── 00-Campaign-Hub/
│   ├── Campaign Dashboard.md
│   ├── House Rules & Rulings.md
│   ├── Vault Format Reference.md
│   ├── Vault Sync Status.md
│   └── Trackers/
│       ├── Loot Tracker S01-S15.md
│       ├── Quote Board S01-S15.md
│       ├── Profanity Ledger S01-S15.md
│       └── Roll Statistics S01-S15.md
├── 01-Sessions/
│   └── Session ## — Title.md (one per session — written by Convo 1)
├── 02-Character_Journal/
│   └── Kit Aluri Journal.md (all entries, collapsible sections)
├── 03-Characters/
│   ├── PCs/ (6 PC pages)
│   └── NPCs/ (24+ NPC pages)
├── 04-World-Lore/
│   └── Locations/ (13+ location pages)
├── 05-Mechanics/
│   └── Spell_Usage.md
├── 07-Flora_Fauna/
│   ├── Creatures/ (8+ creature pages)
│   └── Plants_Fungi/ (10+ fungi/plant pages)
├── DND_Sources/
├── Session_Sources/
│   └── Transcripts/
│       ├── Raw_Unedited/
│       ├── Corrected/
│       └── Spell_Check_Logs/
└── Workflows/
```

**Tracker file rotation:** Trackers split every 10 sessions. S01-S15 files are the legacy batch (pre-restructure). Going forward: S16-S25, S26-S35, etc. When the current session exceeds the range of the active tracker file, create a new file (e.g., `Loot Tracker S16-S25.md`) and begin appending there.

---

## VAULT TOOLS

| Tool | Use For |
|---|---|
| Filesystem MCP (preferred) | Reliable reads/writes against `C:\Users\theli\Obsidian Vaults\sitl_vault\…` |
| `obsidian:read-note` / `edit-note` / `create-note` / `search-vault` | Same operations via Obsidian — use when responsive |
| `obsidian:add-tags` / `remove-tags` / `create-directory` / `move-note` / `delete-note` | Tag/structure management (delete with caution) |

**Reliability note:** The Obsidian MCP server frequently times out (4+ minute waits). The phased workflow below is designed around that — and the Filesystem MCP is the reliable fallback for both reads and writes.

---

## PHASED EXECUTION

The workflow is split into three phases to minimize the impact of timeouts. Separating reads from writes means a timeout during reads doesn't lose write progress, and a timeout during writes doesn't require re-reading.

### Phase 1: READ — Phase 2: DRAFT — Phase 3: WRITE
Every successful read/write is logged to `/home/claude/convo2_progress.md` so restarts don't lose progress.

---

## PHASE 1: READ

### Step 0: Receive Handoff & Confirm Connection
1. Read the Convo 2 Handoff Block (pasted by Taylor).
2. Confirm the vault connection (Obsidian `list-available-vaults` shows `sitl-vault`, or Filesystem MCP reaches the vault path).
3. Create `/home/claude/convo2_progress.md`.

### Step 1: Read Core Reference Files
| # | File | Folder | Why |
|---|---|---|---|
| 1 | `Vault Sync Status.md` | `00-Campaign-Hub` | Confirm last synced session, identify gaps |
| 2 | `Vault Format Reference.md` | `00-Campaign-Hub` | Get all append formats and templates in one read |
| 3 | `Campaign Dashboard.md` | `00-Campaign-Hub` | Need current threads, NPCs, timeline to update |
| 4 | `Kit Aluri.md` | `03-Characters/PCs` | Need full Inner Life & Evolution for emotional state update |
| 5 | `Kit Aluri Journal.md` | `02-Character_Journal` | Need collapsible section format and last entry |
| 6 | `01-Sessions/Session ## — Title.md` | `01-Sessions` | The session note from Convo 1 — the content source for propagation |

### Step 2: Conditional Reads
Based on the handoff: read full NPC pages for major status changes (death, capture, revelation); read revisited location pages only if major updates; use `search-vault` to find the last session header on PC pages without reading them fully. State "Phase 1 complete. Read [X] files. Ready to draft updates."

---

## PHASE 2: DRAFT

With vault state saved locally, draft all updates without touching the vault. Produces a complete update plan organized by file.

### 1. Session Note — VERIFY (do not recreate)

**Target:** `01-Sessions/Session ## — Title.md`

Convo 1 already wrote this note. **Confirm it exists and is complete** (all 8 sections, frontmatter, backlinks). Do **not** create or overwrite it. Only create it if it is genuinely missing (Convo 1 was skipped) — and if you do, it must satisfy the **Website Parser Contract** in Convo 1 Step 6 (`##`/`###` headings, the `POV Overview` heading, and `start_location` / `end_location` / `party_present` frontmatter). Never produce a duplicate file.

### 2. Campaign Dashboard Update
**Target:** `00-Campaign-Hub/Campaign Dashboard.md` (EDIT) — Sessions table row; NPCs/Antagonists; Locations; Open Threads (new/resolved/superseded); Timeline (in-game elapsed time).

### 3. Tracker Appends
Using formats from `Vault Format Reference.md`, append a session section to each active tracker: **Loot**, **Quote Board**, **Profanity Ledger**, **Roll Statistics**. If roll data is missing from the handoff, query Supabase directly (`sitl_session_rolls` filtered to session date — a separate connection from the vault MCP).

### 4. House Rules & Rulings
`00-Campaign-Hub/House Rules & Rulings.md` (EDIT — only if new rulings).

### 5. Kit's POV Journal Entry
`02-Character_Journal/Kit Aluri Journal.md` (APPEND) — collapsible section matching the existing format.

### 6. PC Page Updates
**Kit Aluri** → `03-Characters/PCs/Kit Aluri.md` (EDIT) — Inner Life & Evolution (Active Emotional State, Turning Points, Relationship Undercurrents), Inventory/Loot, Key Events, Key Quotes.

**Other PCs** → `03-Characters/PCs/[Name].md` (APPEND)

DESCRIPTOR FILING — From the handoff's "Character Descriptors Surfaced This Session" list, APPEND each detail as a session-tagged bullet to the matching section on that character's page: Appearance / Personality & Quirks / Backstory.
Format: `- (S##) [detail] — [[Session ## — Title|S##]]`
APPEND ONLY — never edit or delete existing bullets; log changes as new bullets. If a PC page lacks these sections, create them (above Inner Life & Evolution) per the Vault Format Reference. Skip characters with no new descriptors.
For each present PC with notable events, also draft a `### S## Key Events` sub-header with key moments and any inventory/relationship/condition updates. Skip PCs who were absent or had nothing notable.

### 7. NPC Page Updates
**Existing NPCs** (EDIT/APPEND) and **New NPCs** (CREATE, template from Vault Format Reference).

DESCRIPTOR FILING — same as PCs: file any surfaced Appearance / Personality & Quirks / Backstory details from the handoff as session-tagged append-only bullets.

### 8. Location Updates
Existing (APPEND) / New (CREATE) → `04-World-Lore/Locations/`.

### 9. Flora & Fauna Updates
New (CREATE) / existing (APPEND) → `07-Flora_Fauna/`. Skip if none.

### 10. Website Session Sync (rectrixcaedere.com)

The SITL site holds **TWO separate hardcoded `ARC` registries** in the **`rectrixcaedere`** repo (public, NOT the vault). A new session does NOT appear until added to **both** — they have different shapes and must stay in lockstep (same `n` / `d` / `lbl` / `t`). Deploy per the `rectrix-caedere-site` skill (SHA-verify the push).

**(a) `sky-is-the-limit/session.html` → the session reader's `ARC`.** Append:
```js
{n:'##',d:'YYYY-MM-DD',lbl:'Month D, YYYY',
 f:'01-Sessions/Session%20##%20%E2%80%94%20<URL-encoded title>.md',
 t:'<display title>',
 rec:'<recording filename in R2>.mp3'},
```
- `f` must be the **exact** `01-Sessions/` filename, URL-encoded (`%20` for space, `%E2%80%94` for the em dash). Mismatch = the note body fails to load.
- `t` is a curated display title (may differ from the note title). `rec` is the audio filename in the R2 `Recordings/sitl/` bucket; omit if none.

**(b) `sky-is-the-limit/archive.html` → the "Descent" timeline's `ARC`** (a *different* array, richer fields). Append:
```js
{n:'##',d:'YYYY-MM-DD',lbl:'Mon D, YYYY',t:'<display title>',
 r:'<region / locale label>',
 arc:'<journey this session, e.g. "A → B">',
 wp:'<waypoint label>',           // optional — milestone marker on the descent
 ev:["<key event 1>","<key event 2>","..."]},   // 2-4 short past-tense beats
```
- Each archive card **links to `session.html?n=##`** — so if (a) is missing, the card dead-links to an "Unknown session" error. Always do (a) and (b) together.
- Mark `fin:true` on the entry if it's a finale/arc-closing card (styles the card gold).
- **Also bump the hardcoded header stats** in `archive.html`: the `<div class="v">N</div>` **Sessions** count, and **Deepest Reach** if the party reached a new deepest locale this session. (Rolls Logged / Nat 20s / Nat 1s are computed live from Supabase — leave those.)

> **Backlog flag (live as of this writing):** the two registries are **out of sync** — `archive.html` is current through **S17** but `session.html` stops at **S15**. So **S16 ("Zone of Truth", 2026-05-24)** and **S17 ("The Big Fish Eat the Little Fish", 2026-06-07)** have archive cards that **dead-link** because they're absent from `session.html`'s `ARC`. Catch `session.html` up (and verify both arrays match) when wiring the next session.

> Note: the site fetches the note body from `raw.githubusercontent.com/.../sitl_vault/main`. That requires `sitl_vault` to be public-readable; if it's private, the body silently fails to the "Failed to load" state. Confirm vault visibility if a session renders empty.

### 11. Vault Sync Status
`00-Campaign-Hub/Vault Sync Status.md` (EDIT — always last) — matrix row (✅/➖) + change-log entry.

After drafting all items, present the update plan to Taylor (Creates / Appends / Edits / Skipped, plus the website `ARC` entries for **both** `session.html` and `archive.html`). Taylor confirms, then proceed to Phase 3.

---

## PHASE 3: WRITE

Execute writes from the plan. Order: **Creates → Appends → Edits → Vault Sync Status last.** The website `ARC` push is a separate deploy to the `rectrixcaedere` repo. Log each completed write. If a write times out: don't retry blindly — verify with `search-vault`, retry once, and after two failures add to a "manual apply" block.

---

## BACKLINK & FILE-NAMING CONVENTIONS

Wiki-links: `[[Kit Aluri]]`, `[[Session 01 — Prisoners of the Underdark]]`, `[[Velkynvelve]]`, `[[Vrock]]`. Display override: `[[Session 11 — Gifts_of_the_Carrion_King|Session 11]]`.

| Type | Convention | Example |
|---|---|---|
| Session notes | `Session ## — Title.md` (em dash) | `Session 14 — Far From the Sun.md` |
| PC / NPC | `Character Name.md` | `Jorlan Duskryn.md` |
| Locations | `Location Name.md` | `Velkynvelve.md` |
| Creatures / Plants | `Name.md` | `Vrock.md` |
| Trackers | `[Tracker Name] S##-S##.md` | `Loot Tracker S16-S25.md` |

---

## COMPLETION CRITERIA

A session is fully synced when ALL of the following are ✅ (or ➖ if N/A):

| # | Item | Target | "Done" Means |
|---|---|---|---|
| 1 | Session Note | `01-Sessions/…` | **Verified present** (written by Convo 1), all 8 sections + backlinks |
| 2 | Corrected Transcript | `Session_Sources/Transcripts/Corrected/` | Present (or S04-style gap noted) |
| 3 | Dashboard | `00-Campaign-Hub/Campaign Dashboard.md` | Sessions row, NPCs, locations, threads, timeline |
| 4 | Loot Tracker | active tracker file | Session section added |
| 5 | Quote Board | active tracker file | Section with verbatim quotes + tags |
| 6 | Profanity Ledger | active tracker file | Section + running totals |
| 7 | Roll Stats | active tracker file | Row, per-character breakdowns, records |
| 8 | POV Journal | `02-Character_Journal/Kit Aluri Journal.md` | Collapsible section added |
| 9 | PC Pages | `03-Characters/PCs/*.md` | Present PCs updated + descriptors filed |
| 10 | NPC Pages | `03-Characters/NPCs/*.md` | New created, existing updated + descriptors filed |
| 11 | Locations | `04-World-Lore/Locations/*.md` | New created, revisited updated |
| 12 | Flora/Fauna | `07-Flora_Fauna/` | New created, existing updated |
| 13 | Mechanics | `00-Campaign-Hub/House Rules & Rulings.md` | New rulings (if any) |
| 14 | Session Registry | `ddb_sessions` (Supabase) | Row exists for this session_date, campaign_id 1 — **if absent, run the Convo 1 Step 7 upsert** (the only Supabase write Convo 2 makes) |
| 15 | Website ARC | `rectrixcaedere` → `session.html` **and** `archive.html` (both `ARC`s + archive header stats) | New entry added to **both** registries (matching `n`/`d`/`lbl`/`t`) + deployed. Catch up the session.html S16/S17 backlog so archive cards stop dead-linking |

Vault Sync Status updated LAST.

---

## WHAT CONVO 2 DOES NOT DO

- **Does not write the session note.** Convo 1 does. Convo 2 verifies it and propagates everywhere else.
- **Does not re-read transcripts.** Content comes from the Convo 1 note and handoff.
- **Does not generate `.docx` files.** The `.docx` path is retired campaign-wide.
- **Does not spell-check.** That's Convo 1's job.
- **Does not write to `ddb_rolls`, Google Drive, or DDB.** The ONLY Supabase write Convo 2 may make is the scoped `ddb_sessions` registry upsert in checklist item 14, and only if Convo 1's registration is missing.

---

## CATCH-UP SESSIONS

If the Vault Sync Status shows gaps, process sessions in chronological order. Taylor may also ask to catch up a single file across multiple sessions (e.g., "Roll Stats is 5 sessions behind") — focus on that one file across the gap rather than full propagation for each.
