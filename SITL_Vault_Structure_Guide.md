# SITL Obsidian Vault — Structure & Content Guide

> **Vault name:** `sitl_vault`
> **Local path:** `C:\Users\theli\sitl_vault`
> **GitHub repo:** https://github.com/TheLittlestAskew/sitl_vault (private)

This document defines every folder, file, and section in the Sky Is The Limit Obsidian vault. It serves as the authoritative reference for what goes where during Convo 2 vault updates.

---

## Vault Map

```
sitl_vault/
├── 00-Campaign-Hub/
│   ├── Campaign Dashboard.md
│   ├── House Rules & Rulings.md
│   ├── Loot Tracker.md
│   ├── Quote Board Master.md
│   └── Profanity Ledger.md
├── 01-Sessions/
│   └── Session [##] — [Title].md
├── 02-Character_Journal/
│   └── Kit Aluri Journal.md
├── 03-Characters/
│   ├── PCs/
│   │   ├── [Character Name].md
│   │   └── [Character Name].pdf  (character sheet snapshots)
│   └── NPCs/
│       └── [NPC Name].md
├── 04-World-Lore/
│   ├── Locations/
│   │   └── [Location Name].md
│   ├── Regions/
│   │   └── [Region Name].md
│   └── Factions/
│       └── [Faction Name].md
├── 05-Mechanics/
│   ├── Roll_Statistics.md
│   └── Spell_Usage.md
├── 06-Media/
│   └── [All images, maps, and media files]
├── 07-Flora_Fauna/
│   ├── Creatures/
│   │   └── [Creature Name].md
│   └── Plants_Fungi/
│       └── [Plant or Fungus Name].md
├── Session_Sources/
│   ├── Recordings/
│   ├── Transcripts/
│   │   ├── Raw_Unedited/
│   │   │   └── [##]-[MMddyy]_raw_transcript.md
│   │   ├── Corrected/
│   │   │   └── [##] - [MMddyy]_corrected.md
│   │   ├── Spelling_Corrected_Formatted/
│   │   └── Spell_Check_Logs/
│   │       └── [MMddyy]_Spell_Check_Log.md
├── DND_Sources/
│   ├── Notes from Addison.md
│   ├── Characters Associated with the Underdark.md
│   ├── Core Forgotten Realms Underdark Regions and Locations.md
│   ├── DND 5e 2024 Players Handbook.pdf
│   ├── SRD_CC_v5.2.1.pdf
│   ├── Underdark.pdf
│   ├── DnD_SpellLists_1.0.pdf
│   ├── dnd_glossary_2022.pdf
│   └── races.pdf
└── Templates/
    ├── Session Notes Template.md
    ├── NPC Template.md
    └── Location Template.md
```

---

## Folder-by-Folder Breakdown

---

### `00-Campaign-Hub/`

The central command center for the entire campaign. Every other vault file links back here. Updated after every session.

---

#### `Campaign Dashboard.md`

The single most important file in the vault. Central hub that links to everything.

**Sections:**

**Sessions Table**
Running log of all sessions played.

| Column | Content |
|---|---|
| Session # | Zero-padded (01, 02, etc.) |
| Date | MM/DD/YYYY |
| Title | Final chosen session title (must match the session notes file exactly) |
| Notes Link | `[[Session ## — Title]]` |
| Summary | 1–2 sentence session summary |

**NPC Companions**
Tracks NPCs currently traveling with or allied to the party.

| Column | Content |
|---|---|
| Name | NPC name, backlinked: `[[NPC Name]]` |
| Status | Active / Left / Dead / Missing / Captured |
| Joined | Session # when they joined the party |
| Notes | Current role, relationship to party, notable changes |

**Key Antagonists**
Tracks known enemies, threats, and opposing forces.

| Column | Content |
|---|---|
| Name | Antagonist name, backlinked |
| Affiliation | Faction, group, or independent |
| Status | Active / Defeated / Unknown / Fled |
| Last Seen | Session # and location |
| Notes | Threat level, motives, abilities observed |

**Locations**
Master list of all locations the party has visited or learned about.

| Column | Content |
|---|---|
| Location | Name, backlinked: `[[Location Name]]` |
| Region | Parent region if applicable |
| First Visited | Session # |
| Status | Explored / Partially Explored / Known But Unvisited / Hostile / Safe |
| Notes | Key details, who/what is there |

**Open Threads**
Running tracker of unresolved storylines, mysteries, and objectives.

| Column | Content |
|---|---|
| Thread | Description of the open question or objective |
| Introduced | Session # |
| Status | Open / In Progress / Completed (Session #) / Abandoned |
| Related | Backlinks to characters, locations, sessions involved |

**In-Game Timeline**
Tracks elapsed in-story time. Cross-reference with `dnd_elapsed_time_from_transcripts_reliability_ranked`.

| Column | Content |
|---|---|
| Phase | Narrative phase description (e.g., "Prison captivity," "Escape to safe house") |
| Sessions | Session range (e.g., S03–S04) |
| In-Game Time | Estimated elapsed time |
| Notes | Special rules (e.g., "Feydark time is non-linear") |

---

#### `House Rules & Rulings.md`

Every DM ruling, homebrew decision, or house rule Addison has made during play. These override the 2024 PHB per Source Authority Hierarchy.

**Section structure:**
- Organized by topic (combat, spellcasting, resting, exploration, social, etc.)
- Each entry includes: the ruling, session it was made, context/trigger, and any clarifications

**Example entry:**
```markdown
### Combat — Opportunity Attacks
**Ruling:** [Description of Addison's ruling]
**Session:** [[Session 05 — Silvered]]
**Context:** [What prompted the ruling]
```

---

#### `Loot Tracker.md`

Cumulative record of every item the party has acquired, lost, or interacted with.

**Structure:** One section per session, in reverse chronological order (newest first).

**Section header format:** `## Session [##] — [Title] ([MM/DD/YYYY])`

**Table columns per session:**

| Column | Content |
|---|---|
| Item Name | Name of the item or artifact |
| Acquired By | Who picked it up or received it |
| Current Holder | Who has it now (may differ from acquired by) |
| Status | Held / Equipped / Lost / Destroyed / Given Away / Stored |
| Notes | Properties, abilities, context of acquisition |
| Session Acquired | Session # (redundant with section header but useful for search) |

---

#### `Quote Board Master.md`

Cumulative collection of notable quotes from every session. Verbatim only.

**Structure:** One section per session, in reverse chronological order (newest first).

**Section header format:** `## Session [##] — [Title] ([MM/DD/YYYY])`

**Entry format:**
```markdown
**[CHARACTER NAME] · [Tag]**
> "[Verbatim quote]"
```

**Valid tags:** `[Funny]`, `[Poignant]`, `[DM Quip]`, `[Banter]`, `[Serious]`, `[Important to Story]`

**Rules:**
- Quotes must be verbatim from the transcript
- Attribute to the character (in-character speech) or player name + (OOC) for out-of-character
- Preserve order of occurrence within each session

---

#### `Profanity Ledger.md`

Tracks all profanity across the campaign.

**Structure:** One section per session, plus a running totals section at the top.

**Running Totals (top of file):**

| Column | Content |
|---|---|
| Speaker | Player/character name |
| Campaign Total | Running count across all sessions |
| Most Common | Their most-used curse word |

**Per-session section header format:** `## Session [##] — [Title] ([MM/DD/YYYY])`

**Per-session table columns:**

| Column | Content |
|---|---|
| Speaker | Who said it |
| Curse Word | The word used |
| Frequency | Count within this session |
| Context | Brief description of the moment |

---

### `01-Sessions/`

One markdown file per session containing the full session notes adapted for Obsidian.

**Filename format:** `Session [##] — [Title].md`
- Session number zero-padded to 2 digits
- Em dash between number and title
- Title matches the final chosen title exactly

**Examples from vault:**
- `Session 01 — Prisoners of the Underdark.md`
- `Session 06 — The Long Way Down.md`
- `Session 09 —  Every Party Needs A "Little Guy".md`

**Content:** Full session notes in markdown, matching all 8 sections from the session notes template (Metadata, POV Journal, Session Analysis, Character Activity, Artifacts, Logs, Quotes & Language, Archivist Notes). Adapted from the `.docx` output to markdown with `[[backlinks]]` to all characters, locations, and items mentioned.

**Backlink rules within session files:**
- Every character name (PC and NPC) gets a backlink on first mention: `[[Kit Aluri]]`, `[[Ilvara Mizzrym]]`
- Every location gets a backlink on first mention: `[[Velkynvelve]]`
- Every significant item gets a backlink if it has its own page
- Link to other sessions when cross-referencing: `[[Session 05 — Silvered]]`

---

### `02-Character_Journal/`

Kit Aluri's in-character POV journal entries, collected across all sessions.

**Primary file:** `Kit Aluri Journal.md` (single file, growing over time with collapsible sections per session)

**Section format:**
```markdown
## Session [##] — [Title] ([MM/DD/YYYY])

> [!note]- Kit's Journal Entry
> [Full POV journal entry exactly as it appears in the session notes — no modifications]
```

**Rules:**
- Paste the POV journal entry exactly as generated in Convo 1
- Do not edit, summarize, or modify the text
- All POV Journal Hard Limits still apply (no OOC, no metagaming, no mechanical language)
- Use Obsidian callout syntax for collapsible sections

**Housekeeping note:** This folder may contain working/temp files from previous update attempts (e.g., `_S09_addition.md`, `_temp_header.md`). These are artifacts of past edits and should be cleaned up when possible — all journal content should live in the single primary file.

---

### `03-Characters/`

Individual pages for every PC and NPC encountered in the campaign.

---

#### `03-Characters/PCs/`

One file per player character, plus their character sheet PDF snapshots.

**Current files:**
- `Kit Aluri.md` + `Kit.pdf`
- `Binks Stonevein.md` + `Binks.pdf`
- `Aeolus.md` + `Aeolus.pdf`
- `Blarg.md` + `Blarg CS.pdf`
- `Darby Stonefeather.md` + `Darby.pdf`
- `Amanita de'Champignon.md` (no PDF — sheet missing)

**Frontmatter:**
```yaml
---
type: pc
race: [Race]
class: [Class/Subclass]
affiliation: [Faction, group, or allegiance]
status: [Alive / Dead / Missing / Captured / Cursed / Unknown]
player: [Player name]
first_appearance: "[[Session 01 — Prisoners of the Underdark]]"
location: [Last known location]
---
```

**Sections (in order — skip if no info yet):**

1. **Description / Appearance** — Physical description, notable features, armor/gear appearance
2. **Backstory** — Known backstory elements revealed through play or character details docs
3. **Personality** — Behavioral traits, mannerisms, speech patterns, quirks
4. **Abilities & Class Features** — Class features, spells, wild shape forms, fighting styles used during play. Character sheet PDFs = baseline; transcript = authority for anything during play
5. **Inventory / Loot** — Items currently held or previously held. Note session acquired and current status (Held / Equipped / Lost / Given Away)
6. **Relationships** — Connections to other PCs, NPCs, factions. Note how relationships have evolved by session
7. **Key Events** — Major moments involving this character, organized by session with `[[backlinks]]`
8. **Key Quotes** — Verbatim quotes attributed to this character, with session attribution
9. **Related** — Backlinks to sessions, locations, connected characters

**Update rules:**
- Only add information directly supported by transcript or source files
- When info updates or contradicts a previous entry, update the existing entry (do not duplicate). Note the session where the change occurred
- Character sheet PDFs = baseline stats; transcript = authority for anything during play

---

#### `03-Characters/NPCs/`

One file per NPC encountered in the campaign.

**Current NPCs:** Asha Vandree, Buppido, Carbra, Chris, Derendil, Echo, Eldeth, Glabbagool, Ilvara Mizzrym, Jimjar, Jorlan Duskryn, Naos, Psilofyr, Ront, Roxy, Sarith Kzekarit, Shoor Vandree, Shuushar, Stool, Topsy, Turvy

**Frontmatter:**
```yaml
---
type: npc
race: [Race, if known]
class: [Class/role, if known]
affiliation: [Faction, group, or allegiance]
status: [Alive / Dead / Missing / Captured / Imprisoned / In Hiding / On the Run / Unknown]
first_appearance: "[[Session ## — Title]]"
location: [Last known location]
---
```

**Sections:** Same structure as PCs (minus `player` in frontmatter), populated only with known information. Many NPCs start sparse and grow over time.

**Special rules for DM-voiced NPCs:**
- Attribute quotes carefully — only add quotes when the speaker is clearly identified in the transcript
- If Addison's lines could belong to multiple NPCs, flag in the Archivist Notes rather than guessing

**Housekeeping note:** Patch files (e.g., `Glabbagool_S09_PATCH.md`, `S10_PC_PATCH_NOTES.md`) are working artifacts from previous updates. Their content should be merged into the primary character file and the patch files removed.

---

### `04-World-Lore/`

Everything about the world: places, regions, and political/social groups.

---

#### `04-World-Lore/Locations/`

One file per specific location (a building, a cave, a room, a landmark).

**Current locations:** Blingdenstone, Gracklstugh, Mantol-Derith, Menzoberranzan, Neverlight Grove, Nexus Pools Glade, Oozing Temple, The Darklake, The Feydark, The Silken Paths, Upper Cavern, Velkynvelve

**Sections:**
1. **Description** — Physical description as revealed in play
2. **Notable Features** — Landmarks, hazards, resources, magical properties
3. **Inhabitants** — Who lives/works/guards here. Backlinked
4. **History** — What the party has learned about this place's past
5. **Events** — What happened here, organized by session with backlinks
6. **Connections** — Passages, portals, or routes to other locations. Backlinked
7. **Related** — Backlinks to sessions, characters, factions

**Spelling:** Use canonical Underdark/Forgotten Realms spellings from `Characters Associated with the Underdark.md` and `Core Forgotten Realms Underdark Regions and Locations.md` in `DND_Sources/`

---

#### `04-World-Lore/Regions/`

Broader geographic areas that contain multiple locations (e.g., the Underdark itself, the Feydark as a region).

**Currently empty** (`.gitkeep` only). Populate as the campaign expands geographically.

**Sections:**
1. **Overview** — General description
2. **Sub-Locations** — List of specific locations within this region, backlinked
3. **Notable Features** — Climate, hazards, navigation challenges
4. **Factions Present** — Which groups operate here, backlinked
5. **Related** — Backlinks

---

#### `04-World-Lore/Factions/`

Political, religious, military, or social groups the party has encountered or learned about.

**Currently empty** (`.gitkeep` only). Populate when faction dynamics become relevant.

**Sections:**
1. **Overview** — What this faction is and what they want
2. **Leadership** — Known leaders, backlinked
3. **Members** — Known members encountered, backlinked
4. **Territory** — Where they operate, backlinked
5. **Relationship to Party** — Current standing (Hostile / Neutral / Friendly / Allied / Unknown), how it has evolved by session
6. **Key Events** — Faction-related events, by session with backlinks
7. **Related** — Backlinks

---

### `05-Mechanics/`

Game mechanics, class features, and rules references relevant to play.

**Current files:**
- `Roll_Statistics.md` — Roll trends and stats across sessions
- `Spell_Usage.md` — Spell usage tracking

**Additional use cases:**
- A class feature used for the first time in play (document how it worked, any DM rulings)
- Multiclass interaction notes
- Homebrew mechanics or modified rules
- Attunement tracking
- Wild shape forms and their stats as used in play

**Sections vary by topic but generally include:**
1. **Description** — What the mechanic is
2. **How It Played** — How it was used in session, any DM rulings
3. **Source** — PHB 2024 page ref, DM ruling session #, or homebrew
4. **Related** — Backlinks to characters who use it, sessions where it came up

---

### `06-Media/`

Central storage for all images, maps, screenshots, and media files used throughout the vault.

**Current contents:** NPC character art, session-specific images, maps (Underdark overlay, Velkynvelve map)

**File naming conventions:**
- NPC art: descriptive name matching the character(s) depicted (e.g., `Buppido Derendil Eldeth.png`)
- Session images: `[MMddyy] img.png`
- Maps: descriptive name (e.g., `Underdark_Map_-_Basic_Overlay.jpg`, `Velkynvelve_map.png`)

**Obsidian setting:** Set `Settings > Files & Links > Default location for new attachments` to `06-Media` so all new attachments are automatically stored here. Any images pasted or dragged into notes will go directly to this folder.

**Embedding images in notes:**
```markdown
![[Velkynvelve_map.png]]
![[Ilvara.png|300]]   ← with width constraint
```

**Rule:** All images and media should live in `06-Media/`, not at the vault root. Root-level images are considered misplaced and should be moved here.

---

### `07-Flora_Fauna/`

This campaign is heavily Underdark-themed with significant fungi and creature content. Err on the side of documenting too much.

---

#### `07-Flora_Fauna/Creatures/`

Any creature, beast, monster, or entity that is NOT a playable race in D&D 5E/2024.

**Current creatures:** Black Pudding, Chasme, Fire Beetle, Giant Spider, Gray Ooze, Myconid, Quaggoth, Vrock

**Sections:**
1. **Classification** — Type (beast, monstrosity, ooze, aberration, etc.)
2. **Physical Description** — As described in play or source material
3. **Abilities Observed** — What the party has seen it do (attacks, resistances, special traits)
4. **Behavior** — Temperament, tactics, patterns observed
5. **Threat Level** — Estimated danger based on encounters
6. **Encounters** — When and where the party fought or encountered this creature, by session with backlinks
7. **Location** — Where this creature is typically found
8. **Related** — Backlinks

---

#### `07-Flora_Fauna/Plants_Fungi/`

Any plant, fungus, mushroom, moss, or similar organism encountered. **This campaign features heavy fungi/plant content — document generously.**

**Current plants/fungi:** Feydark Flora, Fire Lichen, Rapport Spores, Timmask, Underdark Bioluminescent Fungi, Zurkhwood

**Sections:**
1. **Physical Description** — Appearance, size, color, growth patterns
2. **Properties** — Edible / Poisonous / Magical / Medicinal / Bioluminescent / Other
3. **Uses** — How the party or NPCs have used it; known applications
4. **Location Found** — Where this grows, backlinked
5. **Encounters** — Sessions where this appeared, with context
6. **Related** — Backlinks

---

### `Session_Sources/`

Raw and processed source material for session notes generation.

---

#### `Session_Sources/Recordings/`

Placeholder for session recordings if they ever become available. Currently empty.

---

#### `Session_Sources/Transcripts/`

Contains all transcript-related files organized by processing stage.

---

##### `Session_Sources/Transcripts/Raw_Unedited/`

Original, unedited speech-to-text transcripts exactly as they came out of transcription.

**Filename format:** `[##]-[MMddyy]_raw_transcript.md`

**Examples:** `01-101226_Raw_Transcript.md`, `15-050326_raw_transcript.md`

**Rules:** These are READ ONLY source material. Never edit the raw transcripts.

---

##### `Session_Sources/Transcripts/Corrected/`

Corrected, script-formatted transcripts produced during Convo 1 after spell check is confirmed.

**Filename format:** `[##] - [MMddyy]_corrected.md`
- Session number zero-padded to 2 digits
- Space-dash-space between session number and date
- Date in MMddyy format

**Examples:** `01 - 101225_corrected.md`, `09 - 020126_corrected.md`

**Content:** The full transcript after spell corrections have been applied, formatted as a script:

```
[Timestamp] SPEAKER NAME: Dialogue or action text.

[Timestamp] SPEAKER NAME: Dialogue or action text.
```

**Speaker label conventions:**
- Character names in ALL CAPS for in-character speech: `KIT:`, `BINKS:`, `ILVARA:`
- Player names + (OOC) for out-of-character speech: `TAYLOR (OOC):`, `MATT (OOC):`
- `ADDISON (DM):` for DM narration
- `NPC NAME:` when Addison is voicing a specific, identified NPC
- `[inaudible/cut off]` markers retained as-is
- Blank line between each speaker entry
- Original timestamps preserved

---

##### `Session_Sources/Transcripts/Spelling_Corrected_Formatted/`

Intermediate stage for transcripts that have had spelling corrections applied but may not yet be in final script format. Currently empty.

---

##### `Session_Sources/Transcripts/Spell_Check_Logs/`

Spell check tables generated during Convo 1 transcript review.

**Filename format:** `[MMddyy]_Spell_Check_Log.md`

**Content:** The structured spell check table:

| Speaker (timestamp) | Transcript spelling | Suggested change | Confidence % | Source |

---

### `DND_Sources/`

Reference material and DM-provided information. Read-only during Convo 2 (except `Notes from Addison.md` which may be updated with new DM input).

**Current files:**

| File | Purpose |
|---|---|
| `Notes from Addison.md` | Direct DM input — **top authority**, read before every vault update |
| `Characters Associated with the Underdark.md` | NPC name reference for spell checking |
| `Core Forgotten Realms Underdark Regions and Locations.md` | Location name reference for spell checking |
| `DND 5e 2024 Players Handbook.pdf` | Rules reference (context only, not canon) |
| `SRD_CC_v5.2.1.pdf` | System Reference Document |
| `Underdark.pdf` | Official Underdark source material (Out of the Abyss) |
| `DnD_SpellLists_1.0.pdf` | Spell list reference |
| `dnd_glossary_2022.pdf` | D&D terminology glossary |
| `races.pdf` | Race reference |

---

### `Templates/`

Obsidian template files used by the Templates core plugin (or Templater community plugin) for creating new vault notes with consistent structure. When creating a new note of a given type, apply the matching template to pre-populate the sections and frontmatter.

**Current templates:**
- `Session Notes Template.md` — Scaffolding for new session note files in `01-Sessions/`
- `NPC Template.md` — Scaffolding for new NPC files in `03-Characters/NPCs/`
- `Location Template.md` — Scaffolding for new location files in `04-World-Lore/Locations/`

**Templates that could be added:**
- PC Template
- Creature Template
- Plant/Fungus Template
- Faction Template

---

## Root-Level Files (Vault Housekeeping)

The following files currently exist at the vault root. Most should be moved or cleaned up:

| File | Status | Action |
|---|---|---|
| `README.md` | Vault readme | ✅ Keep at root |
| `Claude_Project_Instructions.md` | Reference copy of project instructions | ✅ Keep at root or move to `DND_Sources/` |
| `moon-linked gemstone flask.md` | Stray item note | ⚠️ Move to appropriate location or integrate into Loot Tracker |
| `Session 01.md` | Stray session file | ⚠️ Likely duplicate of `01-Sessions/Session 01 — Prisoners of the Underdark.md` — verify and delete |
| `Untitled.md` | Empty/stray file | 🗑️ Delete |
| `sitl_vault_starter.zip` | Original vault scaffold | 🗑️ Archive or delete |
| `sitl_vault/` (subfolder) | Old/duplicate vault structure with outdated folder numbering | 🗑️ Delete after confirming nothing unique inside |
| `{00-Campaign-Hub,01-Sessions,02-World-Lore` (folder) | Malformed folder from failed batch mkdir | 🗑️ Delete |
| Root-level `.png` files (7 duplicates + 3 unique) | Images that belong in `06-Media/` | ⚠️ Move unique files to `06-Media/`, delete root copies — see Image Cleanup section |

### Image Cleanup

**Already in both root and `06-Media/` (delete from root):**
- `Buppido Derendil Eldeth.png`
- `eldeth.png`
- `Ilvara.png`
- `jimjar ront sarith.png`
- `Shushar stool topsy turvy.png`
- `stool.png`
- `topsy_and_turvy.png`

**In root only (move to `06-Media/`):**
- `Ilvara 1.png`
- `Screenshot 2025-09-28 133542 1.png`
- `Screenshot 2025-09-28 133542.png`

**⚠️ Before moving/deleting:** Check if any vault notes embed root-level images with `![[filename]]`. If so, update those links after moving, or set Obsidian's attachment search to all folders (`Settings > Files & Links > Attachment folder path > 06-Media`, and ensure "Detect all file links" is on).

---

## Backlink Conventions

Backlinks are the connective tissue of the vault. Every note should link to related content.

| Content Type | Backlink Format | Example |
|---|---|---|
| PC names | `[[Character Name]]` | `[[Kit Aluri]]`, `[[Binks Stonevein]]` |
| NPC names | `[[NPC Name]]` | `[[Ilvara Mizzrym]]`, `[[Stool]]` |
| Locations | `[[Location Name]]` | `[[Velkynvelve]]`, `[[The Feydark]]` |
| Sessions | `[[Session ## — Title]]` | `[[Session 06 — The Long Way Down]]` |
| Factions | `[[Faction Name]]` | `[[House Mizzrym]]` |
| Creatures | `[[Creature Name]]` | `[[Gelatinous Cube]]` |
| Plants/Fungi | `[[Plant Name]]` | `[[Zurkhwood]]` |

**Rules:**
- Backlink on first mention within a section (not every single occurrence)
- Campaign Dashboard links to everything — it is the central hub
- Every page includes a `## Related` section at the bottom with relevant backlinks

---

## File Naming Conventions Summary

| Type | Format | Example |
|---|---|---|
| Session Notes | `Session [##] — [Title].md` | `Session 06 — The Long Way Down.md` |
| Raw Transcripts | `[##]-[MMddyy]_raw_transcript.md` | `06-122125_raw_transcript.md` |
| Corrected Transcripts | `[##] - [MMddyy]_corrected.md` | `06 - 122125_corrected.md` |
| Spell Check Logs | `[MMddyy]_Spell_Check_Log.md` | `122125_Spell_Check_Log.md` |
| PCs | `[Character Name].md` | `Kit Aluri.md` |
| NPCs | `[NPC Name].md` | `Ilvara Mizzrym.md` |
| Locations | `[Location Name].md` | `Velkynvelve.md` |
| Regions | `[Region Name].md` | `The Underdark.md` |
| Factions | `[Faction Name].md` | `House Mizzrym.md` |
| Creatures | `[Creature Name].md` | `Gelatinous Cube.md` |
| Plants/Fungi | `[Plant or Fungus Name].md` | `Zurkhwood.md` |
| Media | Descriptive name | `Velkynvelve_map.png` |

---

## Update Cadence

Every file in the vault is updated as part of the **Convo 2 — Post-Session Update Checklist** (19 mandatory items). The checklist ensures nothing is missed. See the master project instructions for the full numbered checklist.

**Pre-update requirement:** Before writing any vault files, always read:
1. All files in `DND_Sources/` (especially `Notes from Addison.md`)
2. `00-Campaign-Hub/Campaign Dashboard.md`

**Post-update:** Git plugin auto-commits and pushes to GitHub every 10 minutes. No manual backup step needed.
