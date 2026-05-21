# SITL Convo 2 Instructions — Vault Updates

**Last updated:** 05/21/2026

This document defines the step-by-step workflow for Convo 2: updating the Obsidian vault after session notes have been generated in Convo 1. It is a companion to `SKY_IS_THE_LIMIT_PROJECT_INSTRUCTIONS_TRIMMED.md` (the master ruleset) and assumes all shared rules, constraints, and definitions from that file apply here.

---

## PURPOSE

Convo 2 takes the completed session notes (.docx from Convo 1) and propagates all new information across the Obsidian vault so every page stays current. The vault is the campaign wiki — if it isn't in the vault, it doesn't exist for future reference.

---

## PREREQUISITES

Before starting Convo 2, you need:

1. **The Convo 2 Handoff Block** — copy-pasted from the end of Convo 1. Contains session metadata, key events summary, flags, and DDB archive status.
2. **The completed session notes** — either the .docx from Convo 1 or the content pasted/uploaded into this conversation.
3. **Obsidian MCP connected and responsive** — vault name is `sitl-vault`.

If the MCP is unresponsive, say so immediately. Do not attempt to draft vault updates from memory without verifying current vault state.

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
│   └── Session ## — Title.md (one per session)
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

## MCP TOOLS AVAILABLE

| Tool | Use For |
|---|---|
| `obsidian:read-note` | Read a specific file (filename + folder) |
| `obsidian:edit-note` | Append, prepend, or replace content in an existing file |
| `obsidian:create-note` | Create a new file (new NPC, new location, new tracker file, etc.) |
| `obsidian:search-vault` | Search by content, filename, or tags within a path |
| `obsidian:add-tags` / `obsidian:remove-tags` | Manage frontmatter/content tags |
| `obsidian:create-directory` | Create new folders if needed |
| `obsidian:move-note` | Move/rename files |
| `obsidian:delete-note` | Delete files (use with caution) |

**MCP reliability note:** The Obsidian MCP server frequently times out (4+ minute waits). The workflow is designed around this — see Phased Execution and Handling MCP Failures below.

---

## PHASED EXECUTION

The workflow is split into three phases to minimize the impact of MCP timeouts. Separating reads from writes means a timeout during reads doesn't lose write progress, and a timeout during writes doesn't require re-reading.

### Phase 1: READ

Read everything needed from the vault and save it locally. Every successful read gets logged to `/home/claude/convo2_progress.md` so restarts don't lose progress.

### Phase 2: DRAFT

With all vault state saved locally, draft ALL updates as structured blocks. No MCP calls in this phase. Present the full update plan to Taylor for review before any writes happen.

### Phase 3: WRITE

Execute all writes in sequence. If one times out, the plan shows exactly where to resume.

---

## PHASE 1: READ

### Step 0: Receive Handoff & Confirm Connection

1. Read the Convo 2 Handoff Block (pasted by Taylor).
2. Confirm the MCP is connected: call `obsidian:list-available-vaults` and verify `sitl-vault` appears.
3. Create `/home/claude/convo2_progress.md` to track progress through restarts.

### Step 1: Read Core Reference Files

These reads are required every session:

| # | File | Folder | Why |
|---|---|---|---|
| 1 | `Vault Sync Status.md` | `00-Campaign-Hub` | Confirm last synced session, identify gaps |
| 2 | `Vault Format Reference.md` | `00-Campaign-Hub` | Get all append formats and templates in one read |
| 3 | `Campaign Dashboard.md` | `00-Campaign-Hub` | Need current threads, NPCs, timeline to update |
| 4 | `Kit Aluri.md` | `03-Characters/PCs` | Need full Inner Life & Evolution for emotional state update |
| 5 | `Kit Aluri Journal.md` | `02-Character_Journal` | Need collapsible section format and last entry |

That's 5 reads. Log each one to the progress file as it completes.

### Step 2: Conditional Reads

Based on the handoff block, determine which additional reads are needed:

**NPC pages with major status changes** (death, capture, major revelation): Read the full page so the update is accurate. The handoff block identifies which NPCs had status changes.

**Existing location pages being revisited with significant new events:** Read if major updates needed. Skip if the session just passed through.

**Other PC pages:** Use `search-vault` to find the last session header on each page (e.g., search for `### S15` in `03-Characters/PCs`). This confirms the page exists and where to append, without reading the full page. One search call covers all PC pages at once.

**Roll Statistics:** Only if the format reference note doesn't already contain the table structure. Otherwise skip — the format reference has what's needed.

After all reads are complete, state: "Phase 1 complete. Read [X] files. Ready to draft updates."

---

## PHASE 2: DRAFT

With vault state saved locally, draft all updates without touching the MCP. This phase produces a complete update plan organized by file.

Work through the following in order. For each item, write the exact content that will be written to the vault.

### 1. Session Notes Markdown

**Target:** `01-Sessions/Session ## — Title.md` (CREATE)

Create the full markdown version of the session notes for the vault. This is the complete session notes content (all 8 sections) adapted for markdown with Obsidian backlinks:

- Frontmatter (tags, aliases, session date, session number)
- `[[Character Name]]` links for all PCs and NPCs mentioned
- `[[Location Name]]` links for all locations
- `[[Session ## — Title]]` links for cross-session references

**File naming:** `Session ## — Title.md`
- Use an em dash (—), not a hyphen
- Match the exact title from Convo 1

### 2. Campaign Dashboard Update

**Target:** `00-Campaign-Hub/Campaign Dashboard.md` (EDIT)

Draft updates to:
1. **Sessions table** — new row (number, date, title, backlink)
2. **NPCs / Antagonists section** — new NPCs, status updates
3. **Locations section** — new locations
4. **Open Threads** — new threads, resolved threads, superseded threads removed
5. **Timeline** — in-game elapsed time through this session

### 3. Tracker Appends

For each tracker, draft the session section using the formats from `Vault Format Reference.md`:

**Loot Tracker** → `00-Campaign-Hub/Trackers/[active file]` (APPEND)
- Session section with items table
- If no new loot: session header + "No new loot acquired — [reason]"
- Note any prior-session item status changes (these go in the current session section as updates, not edited into prior entries)

**Quote Board** → `00-Campaign-Hub/Trackers/[active file]` (APPEND)
- Session section with all verbatim quotes, tagged by character and type

**Profanity Ledger** → `00-Campaign-Hub/Trackers/[active file]` (APPEND)
- Session section with profanity table + updated running totals

**Roll Statistics** → `00-Campaign-Hub/Trackers/[active file]` (APPEND)
- Session row in summary table
- Per-character breakdowns
- Records/superlatives updates

If roll data is missing from the handoff, query Supabase directly (`sitl_session_rolls` view filtered to session date). Supabase is a separate connection from the Obsidian MCP and does not affect MCP stability.

### 4. House Rules & Rulings

**Target:** `00-Campaign-Hub/House Rules & Rulings.md` (EDIT — only if new rulings)

If new DM rulings this session, draft a new session subsection. If none, skip.

### 5. Kit's POV Journal Entry

**Target:** `02-Character_Journal/Kit Aluri Journal.md` (APPEND)

Draft the journal entry as a collapsible section matching the format from the read in Phase 1.

### 6. PC Page Updates

**Kit Aluri** → `03-Characters/PCs/Kit Aluri.md` (EDIT)

Draft updates to:
- **Inner Life & Evolution → Active Emotional State** — where Kit's head is after this session
- **Inner Life & Evolution → Turning Points** — if applicable
- **Inner Life & Evolution → Relationship Undercurrents** — if relationships shifted
- **Inventory / Loot** — new/changed items
- **Key Events** — session sub-header with key moments
- **Key Quotes** — notable quotes

**Other PCs** → `03-Characters/PCs/[Name].md` (APPEND)

For each present PC with notable events, draft:
- `### S## Key Events` sub-header with key moments
- Inventory, relationship, conditions updates if applicable

Skip PCs who were absent or had nothing notable happen.

### 7. NPC Page Updates

**Existing NPCs** → `03-Characters/NPCs/[Name].md` (EDIT or APPEND)
- Major status changes: draft the full edit (requires Phase 1 read of that page)
- Minor appearances: draft an append to Key Events

**New NPCs** → `03-Characters/NPCs/[Name].md` (CREATE)
- Use template from `Vault Format Reference.md`, scaled to NPC importance

### 8. Location Updates

**Existing locations** → `04-World-Lore/Locations/[Name].md` (APPEND)
- New events or discoveries

**New locations** → `04-World-Lore/Locations/[Name].md` (CREATE)
- Use template from `Vault Format Reference.md`

### 9. Flora & Fauna Updates

**New creatures/plants** → `07-Flora_Fauna/[subfolder]/[Name].md` (CREATE)
**Existing with new info** → `07-Flora_Fauna/[subfolder]/[Name].md` (APPEND)

Skip entirely if no new flora/fauna this session.

### 10. Vault Sync Status

**Target:** `00-Campaign-Hub/Vault Sync Status.md` (EDIT — always last)

Draft:
- Matrix row with ✅/➖ for all columns
- Change log entry summarizing everything updated

---

After drafting all items, present the update plan to Taylor. Format:

```
## Update Plan — Session [##]

**Creates:** [count] new files
  - [list each new file with path]

**Appends:** [count] files
  - [list each file]

**Edits:** [count] files
  - [list each file with brief description of what changes]

**Skipped (N/A this session):**
  - [list any skipped items and why]

Ready to execute writes?
```

Taylor confirms, then proceed to Phase 3.

---

## PHASE 3: WRITE

Execute all writes from the draft plan. Order:

1. **Creates first** (session note, new NPCs, new locations, new flora/fauna, new tracker files if range exceeded)
2. **Appends second** (trackers, journal, PC Key Events)
3. **Edits last** (Dashboard, Kit Aluri Inner Life, NPC status changes, House Rules)
4. **Vault Sync Status always final**

Log each completed write to `/home/claude/convo2_progress.md`.

If a write times out:
1. Do NOT retry immediately
2. After Taylor restarts, verify with `search-vault` whether the content landed
3. If it landed, log and move on
4. If it didn't, retry once
5. If it fails twice, add to a "manual apply" block at the end for Taylor

---

## BACKLINK CONVENTIONS

All vault pages use Obsidian `[[wiki-link]]` syntax:

- **Characters:** `[[Kit Aluri]]`, `[[Binks Stonevein]]`, `[[Jorlan Duskryn]]`
- **Sessions:** `[[Session 01 — Prisoners of the Underdark]]`
- **Locations:** `[[Velkynvelve]]`, `[[The Feydark]]`
- **Creatures/Plants:** `[[Vrock]]`, `[[Zurkhwood]]`

Display text override: `[[Session 11 — Gifts_of_the_Carrion_King|Session 11]]`

---

## FILE NAMING CONVENTIONS

| Type | Convention | Example |
|---|---|---|
| Session notes | `Session ## — Title.md` | `Session 14 — Far From the Sun.md` |
| PC pages | `Character Name.md` | `Kit Aluri.md` |
| NPC pages | `Character Name.md` | `Jorlan Duskryn.md` |
| Locations | `Location Name.md` | `Velkynvelve.md` |
| Creatures | `Creature Name.md` | `Vrock.md` |
| Plants/Fungi | `Plant Name.md` | `Zurkhwood.md` |
| Trackers | `[Tracker Name] S##-S##.md` | `Loot Tracker S16-S25.md` |

Use the em dash (—) in session note filenames. Match existing vault conventions.

---

## HANDLING MCP FAILURES

1. **Phase 1 (reads):** If a read times out, ask Taylor to restart. Use `search-vault` as a fallback — it returns line numbers and content snippets, often enough to proceed. Log every successful read so restarts don't repeat work.
2. **Phase 2 (drafting):** No MCP calls. Cannot fail.
3. **Phase 3 (writes):** If a write times out, do NOT retry blindly. Verify first with `search-vault`. If the content is there, move on. If not, retry once. Two failures on the same file → add to "manual apply" block.
4. **If the MCP is completely down for the entire session:** Draft all updates in Phase 2 and present them as structured blocks (file path, operation, full content) so Taylor can apply them manually or the next Convo 2 can execute them.
5. **Progress tracking:** `/home/claude/convo2_progress.md` tracks completed reads and writes across restarts.

---

## CATCH-UP SESSIONS

If the Vault Sync Status shows gaps for prior sessions, process sessions in chronological order.

Taylor may also ask to catch up a specific file across multiple sessions (e.g., "Roll Stats is 5 sessions behind"). In that case, focus on that single file across the gap sessions rather than full propagation for each.

---

## COMPLETION CRITERIA

A session is fully synced when ALL of the following are ✅ (or ➖ if not applicable):

| # | Item | Target File | "Done" Means |
|---|---|---|---|
| 1 | Session Note | `01-Sessions/Session ## — Title.md` | Full markdown with all 8 sections and backlinks |
| 2 | Corrected Transcript | `Session_Sources/Transcripts/Corrected/` | Confirmed present in vault (from Convo 1) |
| 3 | Dashboard | `00-Campaign-Hub/Campaign Dashboard.md` | Sessions row, NPCs, locations, threads, timeline updated |
| 4 | Loot Tracker | `00-Campaign-Hub/Trackers/[active file]` | Session section added with all items |
| 5 | Quote Board | `00-Campaign-Hub/Trackers/[active file]` | Session section with all verbatim quotes and tags |
| 6 | Profanity Ledger | `00-Campaign-Hub/Trackers/[active file]` | Session section added, running totals updated |
| 7 | Roll Stats | `00-Campaign-Hub/Trackers/[active file]` | Session row, per-character breakdowns, records checked |
| 8 | POV Journal | `02-Character_Journal/Kit Aluri Journal.md` | Collapsible section added for this session |
| 9 | PC Pages | `03-Characters/PCs/*.md` | All present PCs updated with new info |
| 10 | NPC Pages | `03-Characters/NPCs/*.md` | New NPCs created, existing NPCs updated |
| 11 | Locations | `04-World-Lore/Locations/*.md` | New locations created, revisited locations updated |
| 12 | Flora/Fauna | `07-Flora_Fauna/` | New creatures/plants created, existing updated |
| 13 | Mechanics | `00-Campaign-Hub/House Rules & Rulings.md` | New rulings added (if any) |

Vault Sync Status updated LAST with ✅/➖ for all columns and a change log entry.

---

## WHAT CONVO 2 DOES NOT DO

- **Does not re-read transcripts.** All session content comes from the Convo 1 notes and handoff block.
- **Does not generate .docx files.** That's Convo 1's job.
- **Does not spell-check.** That's Convo 1's job.
- **Does not modify files outside the vault** (no Google Drive, no DDB, no Supabase writes).
- **Can query Supabase if roll data is missing** from the handoff. This uses a separate connection and does not affect MCP stability.
