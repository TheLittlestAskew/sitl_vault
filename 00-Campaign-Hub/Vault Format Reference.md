# Vault Format Reference

> **Purpose:** Single source of truth for all append formats, table structures, and new-page templates used in Convo 2 vault updates. Claude reads this file once at the start of Convo 2 instead of reading each tracker individually to check formatting.
>
> **Rule:** If a format here conflicts with what's in the actual vault file, the vault file wins. Update this reference to match.

---

## Tracker Append Formats

All trackers live in `00-Campaign-Hub/Trackers/`. Files rotate every 10 sessions: S01-S15 (legacy), S16-S25, S26-S35, etc. When the current session exceeds the active file's range, create a new file with the next range and begin appending there.

---

### Loot Tracker

**Session header:** `## Session ## — Title`

**Main table (per-session or per-subsection):**

```markdown
|Character|Item|Properties / Notes|Status|
|---|---|---|---|
|[[Character Name]]|Item name|Context, properties, acquisition details|Carried / Equipped / Attuned / Given away / Lost / etc.|
```

**Subsections** (use when loot comes from multiple sources in one session):

```markdown
### From [Source Name]

|Character|Item|Properties / Notes|Status|
|---|---|---|---|
```

**Item Updates subsection** (for status changes to items from prior sessions):

```markdown
### Item Updates from This Session

|Character|Item|Update|Status|
|---|---|---|---|
|[[Character Name]]|Item name|**What changed** (corrected/attuned/identified/etc.)|New status|
```

**No-loot session:**

```markdown
## Session ## — Title

|Character|Item|Properties / Notes|Status|
|---|---|---|---|
|No new loot acquired|—|Session focused on [brief reason]|—|
```

**Session-end note** (optional, italic, after tables):

```markdown
_Note: [Contextual notes about inspiration, conditions, or loot-adjacent events not captured in the table.]_
```

---

### Quote Board

**Session header:** `## Session ## — Title`

**Entry format** (one block per quote):

```markdown
**[[Character Name]] · [Tag]**
"Verbatim quote exactly as spoken"
```

**Tags:** `[Funny]`, `[Poignant]`, `[DM Quip]`, `[Banter]`, `[Serious]`, `[Important to Story]`

Multiple tags allowed: `[Funny/Banter]`, `[Serious/Tactical]`

**Separator:** `---` between sessions.

**Notes:**
- Quotes are NOT italicized in the vault version (unlike the .docx template which uses italic).
- Character names use `[[wiki-link]]` syntax.
- One blank line between entries within a session.
- DM quotes attributed to NPCs use the NPC name: `**[[Stool]] · [Funny]**`
- DM quotes as DM use: `**Addison (DM) · [DM Quip]**`

---

### Profanity Ledger

**Session header:** `## Session ## — Title`

**Session table:**

```markdown
| Speaker | Curse Word | Frequency | Context |
|---|---|---|---|
| Character Name (Player Name) | "word" | # | Context quote or description |
```

**Speaker format:** `Character Name (Player Name)` — e.g., `Kit Aluri (Taylor)`, `Addison (DM)`
- OOC profanity uses: `Player Name (OOC)` — e.g., `Austin (OOC)`
- NPC profanity uses: `NPC Name (Addison/NPC)` — e.g., `Turvy (Addison/NPC)`

**Session-end note** (optional, italic):

```markdown
_Note: [Any caveats about profanity count — conservative estimate, transcript-only source, etc.]_
```

**Running Totals table** (after the latest session section):

```markdown
## Running Totals (Through S##)

| Speaker | shit | fuck/fucking | damn | hell | ass | Other | Total |
|---|---|---|---|---|---|---|---|
| Kit Aluri (Taylor) | # | # | # | # | # | — | # |
| [next speaker] | ... |
```

**Running totals note** (italic, after table):

```markdown
*[Brief narrative commentary on totals — who's climbing, notable milestones, session vibe reflected in profanity levels.]*
```

Speakers ordered by total count (highest first). Use `—` for zero, not `0`.

---

### Roll Statistics

The Roll Statistics file has multiple sections. When adding a new session, update these areas:

**1. Session-by-Session Roll Counts table** — add a new row:

```markdown
| [[Session ## — Title\|S##]] | MM/DD/YY | # | # | # | # | # | Character (#) | DDB |
```

Columns: Session link | Date | Total | Combat | Non-Combat | Nat 20s | Nat 1s | Heaviest Roller | Archive Rows

**2. Per-Character Breakdown** — each PC has their own subsection with a metric table and a Notable blockquote. Update the totals and add session-specific notes:

```markdown
### [[Character Name]]

| Metric | Value |
|---|---|
| Total rolls | # |
| Nat 20s | # |
| Nat 1s | # |
| Heaviest session | S## — # rolls |

> **Notable:** [Running commentary on patterns, streaks, clutch moments.]
```

**3. Campaign Totals table** — update running totals:

```markdown
| Metric | Value |
|---|---|
| Total rolls logged | # |
| Sessions covered | # |
| Average rolls per session | #.# |
| Total combat rolls | # |
| Total non-combat rolls | # |
| Campaign nat 20s | # |
| Campaign nat 1s | # |
```

**4. Records & Superlatives** — check and update if a new record was set:

```markdown
| Record | Holder | Value | Session |
|---|---|---|---|
| Most rolls in a session (any PC) | Character | # | S## |
| Most nat 20s in a session | Multiple/Character | # (party-wide) | S## |
| Most nat 1s in a session | Multiple/Character | # (party-wide) | S## |
```

**5. Update Log** — add row:

```markdown
| S## | YYYY-MM-DD | [Summary: DDB roll count, physical dice count, transcript-only count, key rolls, nat 20/1 highlights, anomalies.] |
```

**6. Roll Type Distribution** — update if doing a full audit (otherwise skip; table uses approximate percentages).

**Notes from actual file:**
- Nat 20/nat 1 counts marked with `*` when pending `individual_values` audit
- Sessions where players rolled physical dice note "0 DDB entries" and cite transcript-only rolls separately
- The `Archive Rows` column references row ranges in the original Excel (legacy); for new sessions just use `DDB` or `DDB + transcript`

---

### House Rules & Rulings

**New rulings are added under the appropriate category heading**, not as a new session section. Categories:

- Combat Mechanics
- Lycanthropy
- Exploration & Skills
- Spellcasting
- Wild Shape (2024 Rules)
- Homebrew Items & Features
- Campaign Setting
- Retcons

**If a session's rulings warrant their own subsection** (multiple rulings in the same category), use:

```markdown
### Session ## Rulings
- **[Ruling name] (S##):** Description of ruling, context, and precedent.
```

**Ruling format within existing categories:**

```markdown
- **[Ruling name] (S##):** Description. Context. Precedent or exception notes.
```

---

## Kit's POV Journal — Entry Format

**Target file:** `02-Character_Journal/Kit Aluri Journal.md`

**Entry structure:**

```markdown
---

## Session ## — Title

<details><summary>[Day description — e.g., "Day 5 through Day 8 of freedom — somewhere between Velkynvelve and Sloobludop"]</summary>

**THE THINGS WE CARRIED IN THE DARK: A SOLDIER'S MEMOIR**

**Day ##:**

[Journal entry text in Kit's first-person voice...]

</details>

**
```

**Format notes:**
- Sessions S01–S13 used plain text with `**` delimiters and no collapsible wrapper. S14+ use `<details><summary>` tags.
- Going forward, always use the `<details><summary>` format.
- The `<summary>` text should be descriptive (day range + location context), not generic ("Click to expand").
- The `**` on its own line after `</details>` is a legacy artifact from the original formatting. Include it for consistency with existing entries.
- The `---` horizontal rule separates entries between sessions.
- The memoir title `THE THINGS WE CARRIED IN THE DARK: A SOLDIER'S MEMOIR` appears inside each collapsible section, bolded.
- Day numbering continues the in-game timeline from prior entries.

---

## New Page Templates

### NPC — Major (recurring, plot-relevant)

```markdown
---
tags: [npc, sitl]
aliases: []
status: [Alive/Dead/Missing/Unknown]
race: 
affiliations: 
first_appearance: "[[Session ## — Title]]"
last_known_location: 
---

# [NPC Name]

## Description / Appearance

## Backstory

## Personality

## Key Events

### S## Key Events
- [Event details with session backlinks]

## Relationships

## Key Quotes

## Related
```

### NPC — Minor (one-off, low detail)

```markdown
---
tags: [npc, sitl]
status: [Alive/Dead/Missing/Unknown]
first_appearance: "[[Session ## — Title]]"
---

# [NPC Name]

## Key Events
- [Event details]

## Related
```

### Location

```markdown
---
tags: [location, sitl, underdark]
first_appearance: "[[Session ## — Title]]"
region: [Upperdark/Middledark/Lowerdark/Feydark/Surface]
---

# [Location Name]

## Description

## Notable Features

## Events
- [[Session ## — Title]]: [What happened here]

## Related
```

### Creature

```markdown
---
tags: [creature, sitl]
first_appearance: "[[Session ## — Title]]"
type: [beast/fiend/monstrosity/ooze/plant/undead/etc.]
---

# [Creature Name]

## Description

## Abilities / Behavior

## Encounters
- [[Session ## — Title]]: [Encounter details]

## Related
```

### Plant / Fungus

```markdown
---
tags: [flora, sitl, underdark]
first_appearance: "[[Session ## — Title]]"
---

# [Plant/Fungus Name]

## Description

## Properties / Uses

## Encounters
- [[Session ## — Title]]: [Discovery/use context]

## Related
```

---

## Campaign Dashboard — Append Formats

The Dashboard is edited in place, not appended. These are the formats for each section that gets updated:

**Sessions table row:**

```markdown
| ## | MM/DD/YYYY | Title | [[Session ## — Title]] |
```

**NPC Companions entry:**

```markdown
- [[NPC Name]] — Race/type, brief description. Key status. Current situation. (S##)
```

**Key Antagonists entry (alive):**

```markdown
- [[NPC Name]] — Description. Current status/threat. Last known action. (S##)
```

**Key Antagonists entry (dead):**

```markdown
- ~~[[NPC Name]]~~ — **DEAD (S##).** Description. How they died. Killed by whom.
```

**Locations entry:**

```markdown
- [[04-World-Lore/Locations/Location Name]] — Description and session context (S##)
```

Or for locations without a vault page yet:

```markdown
- [Location Name] — Description and session context (S##)
```

**Open Threads entry:**

```markdown
- [ ] Thread Name — Description. Key details. Session references. (S##)
```

**Completed thread (move from Active to Completed):**

```markdown
- [x] Thread Name — **Completed (S##).** Resolution summary.
```

**Timeline row:**

```markdown
| Phase description | S## | Estimated in-game time |
```

---

## Vault Sync Status — Update Formats

**Matrix row:**

```markdown
| S## | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅/➖ | ✅/➖ |
```

Use ✅ for updated, ➖ for not applicable (no relevant content), ❌ for not yet done.

**Update Log entry:**

```markdown
| YYYY-MM-DD | Claude (Convo 2, S##) | [Detailed summary: files updated, characters affected, NPCs status-changed, new pages created, roll count, notable items/corrections.] |
```

---

## Related
[[Vault Sync Status]] · [[Campaign Dashboard]]
