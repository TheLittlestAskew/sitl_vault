# Vault Sync Status

> **Purpose:** Single source of truth for which sessions have been fully propagated across the vault. Updated at the end of every Convo 2 session.
>
> **Rule:** A session is not "done" until every row in the matrix below is checked off. If a file shows a gap, that's where Convo 2 resumes.

---

## Sync Matrix

Each column = a vault file or file group. Each row = a session. ✅ = updated, ❌ = not yet updated, ➖ = not applicable (no relevant content for that session).

| Session | Session Note | Corrected Transcript | Dashboard | Loot Tracker | Quote Board | Profanity Ledger | Roll Stats | POV Journal | PC Pages | NPC Pages | Locations | Flora/Fauna | Mechanics |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S01 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| S02 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| S03 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| S04 | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| S05 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| S06 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| S07 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| S08 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| S09 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ |
| S10 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| S11 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ |
| S12 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ |
| S13 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ |
| S14 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| S15 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Column Definitions

| Column | Vault File(s) | What "Updated" Means |
|---|---|---|
| **Session Note** | `01-Sessions/Session ## — Title.md` | Full session notes markdown exists with all 8 sections and backlinks |
| **Corrected Transcript** | `Session_Sources/Transcripts/Corrected/` | Script-formatted, spell-checked transcript saved to vault |
| **Dashboard** | `00-Campaign-Hub/Campaign Dashboard.md` | Sessions table row complete, NPCs/antagonists/locations/threads/timeline updated |
| **Loot Tracker** | `00-Campaign-Hub/Loot Tracker.md` | Session section added with all items |
| **Quote Board** | `00-Campaign-Hub/Quote Board Master.md` | Session section added with all verbatim quotes and tags |
| **Profanity Ledger** | `00-Campaign-Hub/Profanity Ledger.md` | Session section added, running totals updated |
| **Roll Stats** | `05-Mechanics/Roll_Statistics.md` | Session row in session-by-session table, per-character breakdowns updated, records/superlatives checked |
| **POV Journal** | `02-Character_Journal/Kit Aluri Journal.md` | Collapsible section added for this session |
| **PC Pages** | `03-Characters/PCs/*.md` | All PCs updated with new info from this session (abilities, inventory, relationships, events, quotes) |
| **NPC Pages** | `03-Characters/NPCs/*.md` | New NPCs created, existing NPCs updated with session info |
| **Locations** | `04-World-Lore/Locations/*.md` | New locations created, existing updated with events/inhabitants/connections |
| **Flora/Fauna** | `07-Flora_Fauna/**/*.md` | New creatures/plants documented, existing updated with encounter info |
| **Mechanics** | `05-Mechanics/*.md` | New rulings, class features, spell usage documented. Also includes `House Rules & Rulings.md` and `Spell_Usage.md` |

---

## Dependency Map

When a session is processed, these files MUST be updated together. This is the propagation chain — missing any link creates drift.

```
Session Notes (.docx from Convo 1)
    │
    ├── 01-Sessions/ session markdown (with backlinks)
    │
    ├── 00-Campaign-Hub/
    │   ├── Campaign Dashboard (sessions table, NPCs, antagonists, locations, threads, timeline)
    │   ├── Loot Tracker (new session section)
    │   ├── Quote Board Master (new session section)
    │   └── Profanity Ledger (new session section + running totals)
    │
    ├── 02-Character_Journal/
    │   └── Kit Aluri Journal (new collapsible section)
    │
    ├── 03-Characters/
    │   ├── PCs/ (update all with new session info)
    │   └── NPCs/ (create new, update existing)
    │
    ├── 04-World-Lore/
    │   ├── Locations/ (create new, update existing)
    │   ├── Regions/ (if applicable)
    │   └── Factions/ (if applicable)
    │
    ├── 05-Mechanics/
    │   ├── Roll_Statistics.md (session row + per-character + records)
    │   ├── Spell_Usage.md (if applicable)
    │   └── House Rules & Rulings.md (if new rulings)
    │
    └── 07-Flora_Fauna/
        ├── Creatures/ (create new, update existing)
        └── Plants_Fungi/ (create new, update existing)
```

---

## How To Use This File

### During Convo 2
1. Claude reads this file at the start of every Convo 2
2. Identifies the first ❌ in the matrix — that's where work begins
3. Works through the 19-item checklist for that session
4. Updates this matrix as each column is completed
5. If MCP times out, the matrix shows exactly where to resume

### Between Sessions
If Taylor notices a gap (like Roll Stats being 7 sessions behind), this matrix makes it immediately visible and tells Claude exactly what needs catching up.

### Audit Check
Run periodically: read this file and spot-check a few ✅ cells to confirm the vault file actually has the content. If a ✅ is wrong, downgrade to ❌ and flag it.

---

## Current Gaps Summary

**Fully synced through:** S15 (all applicable columns ✅)

**Partially synced:** None

**Not started:** None

**Priority catch-up order:**
1. S04 corrected transcript still missing (legacy gap)

---

## Update Log

| Date | Updated By | Changes |
|---|---|---|
| 2026-05-14 | Claude (vault audit) | Initial matrix created from vault inspection. S01–S08 marked fully synced. S09–S11 marked partial. S12–S15 marked not started. S04 corrected transcript missing noted. |
| 2026-05-14 | Claude (Convo 2, S12) | S12 fully synced. Session note, dashboard, loot, quotes, profanity, journal, all PC pages (Kit/Binks/Aeolus/Darby/Amanita/Blarg), NPC pages (Shoor/Asha/Ilvara/Stool/Topsy), Velkynvelve location, roll stats (S12 row), house rules all updated. Flora/Fauna marked N/A (pure combat session). |
| 2026-05-15 | Claude (Convo 2, S13) | S13 fully synced. Session note, corrected transcript (confirmed in vault), dashboard, loot, quotes, profanity, journal, all PC pages (Kit/Binks/Aeolus/Blarg/Amanita/Darby), all NPC pages (Ilvara→Dead, Shoor→Dead, Jorlan→Alive, Derendil→Rescued, Stool→0HP, Roxy kill update, Topsy/Turvy leveled), Velkynvelve location, roll stats (S13 row, 63 DDB rolls). Flora/Fauna marked N/A (pure combat session). House rules updated (S13 rulings + trinket stat bonuses). Jorlan status clarified (alive — no death ever narrated). Binks trinket accepted as confirmed from S11. |
| 2026-05-15 | Claude (Convo 2, S14) | S14 fully synced. Session note, corrected transcript (confirmed in vault from Convo 1), dashboard (S14 row, NPCs/antagonists/locations/threads/timeline all updated), loot tracker (4 subsections: Jorlan/Shoor/Ilvara/armory), quote board (~35 quotes), profanity ledger (Kit hits 30, Binks jumps to 8), house rules (6 S14 rulings), journal (S14 collapsible entry), all PC pages (Kit: Bracers+weapons+Jorlan lore+Persuasion speech; Binks: Command+Ceremony+madness; Blarg: moonstone+Religion 21; Darby: killed Asha; Amanita: Spare the Dying+vrock exam; Aeolus: NPC'd), NPC pages (Jorlan→Dead, Asha→Dead, Artaxle NEW, Garruk NEW, Derendil updated, Stool→healed), roll stats (S14 row, 20 DDB + 5 transcript-only). Flora/Fauna ✅ (vrock exam noted on Amanita page; riding lizard noted on Garruk page — no standalone creature pages needed). Mechanics ✅ (house rules covers S14 rulings). |
| 2026-05-15 | Claude (Convo 2, S15) | S15 fully synced. Session note created (SITL_15_050326_The_Long_Road_to_Sloobludop.md). Corrected transcript confirmed in vault from Convo 1. Dashboard updated: S15 row, Sloobludop distance corrected 8→7 days, Fungal Cavern added to locations, 7 new/updated open threads (Travel, Cloak of Elvenkind, Déjà Vu, Bracers +1 AC, Ring of Spell Storing, Darkness Safety Word, Topsy/Turvy rummaging), old Jorlan's Cloak thread removed (superseded), timeline through S15 (~7–8 days post-escape). Loot tracker: S15 section with full armory inventory, Ormu harvest, Fungal Cavern fungi, bracers/cloak corrections applied to S14 entries. Quote board: ~20 quotes. Profanity: Kit to 33, Darby ties Addison at 7. House rules: 5 S15 rulings (24hr Bless, +1 AC bracers, Cloak attunement, Bless on skill checks, Sloobludop distance). Journal: S15 collapsible entry. All 6 PC pages updated (Kit: Cloak/bracers/déjà vu/humming; Blarg: Ormu/botany; Amanita: Fungal Cavern/teaching; Binks: language class/Ring discussion; Darby: nat 20 Undercommon; Aeolus: AC 12 flagged/Sylvan/Ring). NPC pages: Topsy + Turvy updated (rummaging). Location: Fungal Cavern (Day 4) page created. Flora/Fauna: Ormu, Tongue of Madness, Nightlight, Waterorb pages created; Timmask updated with S15 encounter. Roll stats: S15 row (28 DDB, 0 nat 20s DDB, 3 nat 1s). Mechanics: house rules covers S15 rulings. |
