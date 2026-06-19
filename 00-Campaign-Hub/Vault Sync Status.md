---
created_on: 2026-05-14
updated_on: 2026-06-10
---

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
| S16 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| S18 ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

> ⚠️ **No S17 row — session-number collision (unresolved).** The 2026-06-07 play session is filed as **S18** per operator instruction but is most plausibly **S17** by play-date ordering (the same date was staged as S16/S17/S18 in pipeline folders; the vault's [[Session 16 — Zone of Truth]] is a *different*, earlier session played 2026-05-24). There is no separate S17 session. **Human decision needed** to set the true number and retire the duplicate transcripts/pipeline folders before this is finalized. The **S18 DDB roll archive is now cross-referenced** (2026-06-14): 82 rows, campaign 1, no sync gap — Roll Stats updated. **S17 (06-07) is now cross-referenced too** (47 rows). ⚠️ Note: this revealed the "Binks/Aeolus = physical dice" rule is unreliable — in S18 Binks rolled digitally (Aeolus physical), in S17 the reverse (Aeolus 4 DDB, Binks 0). **Matt has since switched to digital rolls (confirmed by Taylor 2026-06-14).**

---

## Column Definitions

| Column | Vault File(s) | What "Updated" Means |
|---|---|---|
| **Session Note** | `01-Sessions/Session ## — Title.md` | Full session notes markdown exists with all 8 sections and backlinks |
| **Corrected Transcript** | `Session_Sources/Transcripts/Corrected/` | Script-formatted, spell-checked transcript saved to vault |
| **Dashboard** | `00-Campaign-Hub/Campaign Dashboard.md` | Sessions table row complete, NPCs/antagonists/locations/threads/timeline updated |
| **Loot Tracker** | `00-Campaign-Hub/Trackers/` (active file) | Session section added with all items |
| **Quote Board** | `00-Campaign-Hub/Trackers/` (active file) | Session section added with all verbatim quotes and tags |
| **Profanity Ledger** | `00-Campaign-Hub/Trackers/` (active file) | Session section added, running totals updated |
| **Roll Stats** | `00-Campaign-Hub/Trackers/` (active file) | Session row in session-by-session table, per-character breakdowns updated, records/superlatives checked |
| **POV Journal** | `02-Character_Journal/Kit Aluri Journal.md` | Collapsible section added for this session |
| **PC Pages** | `03-Characters/PCs/*.md` | All PCs updated with new info from this session (abilities, inventory, relationships, events, quotes) |
| **NPC Pages** | `03-Characters/NPCs/*.md` | New NPCs created, existing NPCs updated with session info |
| **Locations** | `04-World-Lore/Locations/*.md` | New locations created, existing updated with events/inhabitants/connections |
| **Flora/Fauna** | `07-Flora_Fauna/**/*.md` | New creatures/plants documented, existing updated with encounter info |
| **Mechanics** | `00-Campaign-Hub/House Rules & Rulings.md` + `05-Mechanics/Spell_Usage.md` | New rulings, class features, spell usage documented |

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
    │   ├── Vault Format Reference (update if formats change)
    │   └── Trackers/
    │       ├── Loot Tracker (active file — new session section)
    │       ├── Quote Board (active file — new session section)
    │       ├── Profanity Ledger (active file — new session section + running totals)
    │       └── Roll Statistics (active file — session row + per-character + records)
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
    │   └── Spell_Usage.md (if applicable)
    │
    ├── 00-Campaign-Hub/
    │   └── House Rules & Rulings.md (if new rulings)
    │
    └── 07-Flora_Fauna/
        ├── Creatures/ (create new, update existing)
        └── Plants_Fungi/ (create new, update existing)
```

---

## Tracker File Rotation

Tracker files in `00-Campaign-Hub/Trackers/` rotate every 10 sessions. The legacy batch covers S01-S15 (pre-restructure). Going forward: S16-S25, S26-S35, etc.

**Active tracker files (as of 2026-06-07):**
- `Loot Tracker S16-S25.md` (archive: `Loot Tracker S01-S15.md`)
- `Quote Board S16-S25.md` (archive: `Quote Board S01-S15.md`)
- `Profanity Ledger S16-S25.md` — carries running totals (archive: `Profanity Ledger S01-S15.md`)
- `Roll Statistics S16-S25.md` (archive incl. campaign records: `Roll Statistics S01-S15.md`)
- `Exhaustion & Madness Tracker.md` (cumulative — does not rotate)

Hub-root `Loot Tracker.md`, `Quote Board Master.md`, `Profanity Ledger.md`, and `05-Mechanics/Roll_Statistics.md` are pointer stubs — do not append session content there.

When the current session exceeds the active file's range, create the next file and begin appending there. Carry forward running totals (Profanity Ledger) and records (Roll Statistics) into the new file's header.

---

## How To Use This File

### During Convo 2
1. Claude reads this file at the start of every Convo 2
2. Identifies the first ❌ in the matrix — that's where work begins
3. Works through the propagation chain for that session
4. Updates this matrix as each column is completed
5. If MCP times out, the matrix shows exactly where to resume

### Between Sessions
If Taylor notices a gap (like Roll Stats being 7 sessions behind), this matrix makes it immediately visible and tells Claude exactly what needs catching up.

### Audit Check
Run periodically: read this file and spot-check a few ✅ cells to confirm the vault file actually has the content. If a ✅ is wrong, downgrade to ❌ and flag it.

---

## Current Gaps Summary

**Fully synced through:** S18 (all applicable columns ✅ — filed under disputed number; see collision note)

**Partially synced:** None

**Not started:** None

**Priority catch-up order:**
1. ⚠️ **Resolve the S17/S18 session-number collision** (human decision) and retire duplicate 06/07/2026 transcripts/pipeline folders.
2. ✅ **S17 + S18 DDB roll cross-references done** (2026-06-14) — both Roll Stats rows reconciled; Matt's switch to digital rolls confirmed. Remaining: fix the sync-script data-quality bugs (NULL crit flags; double-encoded `individual_values`).
3. S04 corrected transcript still missing (legacy gap).

**Resolved:**
- ✅ Tracker restructure **completed 2026-06-07**: content split into `Trackers/` batch files (`* S01-S15.md` archives + `* S16-S25.md` active). Hub-root files (`Loot Tracker.md`, `Quote Board Master.md`, `Profanity Ledger.md`, `05-Mechanics/Roll_Statistics.md`) are now pointer stubs so legacy links resolve. Misnamed empty `Loot Tracker S16-S30.md` placeholder and duplicate hub-root `Exhaustion & Madness Tracker.md` deleted (canonical copy lives in `Trackers/`). Dashboard Quick References/Quick Links updated to active batches.
- ✅ Party level **resolved 2026-06-07 (per Taylor)**: level-up NOT complete — party is Level 4; Addison is giving the option to take Level 5 in the near future, timed by the players' feel (at/after Sloobludop). Erroneous Open Threads "Completed" entry corrected.

---

## Update Log

| Date | Updated By | Changes |
|---|---|---|
| 2026-06-14 | Claude (S17 DDB cross-reference) | **S17 DDB roll archive cross-referenced** (47 rows, campaign 1, 2026-06-07). Roll Stats S17 row + session-note Full Roll Log reconciled: total now 47 DDB (Kit 19, DM 12, Amanita 8, Aeolus 4, Darby 4) + Binks physical; **0 nat 20s / 2 nat 1s** DDB-verified (Derendil's crit + chuul nat-1 were DM/off-DDB). Loot d100s and Kit's 31-damage round confirmed. **Aeolus rolled digitally at S17** (4 rows) — old physical-dice tag corrected; Binks still physical here (switched at S18). |
| 2026-06-14 | Claude (S18 DDB cross-reference) | **S18 DDB roll archive cross-referenced** (was transcript-only). 82 rows, campaign 1 "Sky Is The Limit", `last_synced 2026-06-14 18:44`, no sync gap. Roll Stats S18 row + session-note Full Roll Log reconciled: total now 82 DDB (Kit 21, Binks 21, Amanita 16, Darby 14, DM 10) + Aeolus physical; 5 nat 20s / 0 nat 1s (DDB-verified). **Heaviest roller corrected** Kit→Kit/Binks tie. **Corrected the "Binks & Aeolus = physical dice" assumption** — Binks rolled digitally in S18 (Aeolus physical); reversed in S17. **`ddb_sessions` registry fixed**: 06-07→S17, 06-14→S18 (was 06-07 mislabeled S18, no 06-14 row). ⚠️ Follow-ups: confirm Matt switched to digital; fix sync-script NULL crit flags + double-encoded `individual_values`; cross-reference S17. |
| 2026-05-14 | Claude (vault audit) | Initial matrix created from vault inspection. S01–S08 marked fully synced. S09–S11 marked partial. S12–S15 marked not started. S04 corrected transcript missing noted. |
| 2026-05-14 | Claude (Convo 2, S12) | S12 fully synced. Session note, dashboard, loot, quotes, profanity, journal, all PC pages (Kit/Binks/Aeolus/Darby/Amanita/Blarg), NPC pages (Shoor/Asha/Ilvara/Stool/Topsy), Velkynvelve location, roll stats (S12 row), house rules all updated. Flora/Fauna marked N/A (pure combat session). |
| 2026-05-15 | Claude (Convo 2, S13) | S13 fully synced. Session note, corrected transcript (confirmed in vault), dashboard, loot, quotes, profanity, journal, all PC pages (Kit/Binks/Aeolus/Blarg/Amanita/Darby), all NPC pages (Ilvara→Dead, Shoor→Dead, Jorlan→Alive, Derendil→Rescued, Stool→0HP, Roxy kill update, Topsy/Turvy leveled), Velkynvelve location, roll stats (S13 row, 63 DDB rolls). Flora/Fauna marked N/A (pure combat session). House rules updated (S13 rulings + trinket stat bonuses). Jorlan status clarified (alive — no death ever narrated). Binks trinket accepted as confirmed from S11. |
| 2026-05-15 | Claude (Convo 2, S14) | S14 fully synced. Session note, corrected transcript (confirmed in vault from Convo 1), dashboard (S14 row, NPCs/antagonists/locations/threads/timeline all updated), loot tracker (4 subsections: Jorlan/Shoor/Ilvara/armory), quote board (~35 quotes), profanity ledger (Kit hits 30, Binks jumps to 8), house rules (6 S14 rulings), journal (S14 collapsible entry), all PC pages (Kit: Bracers+weapons+Jorlan lore+Persuasion speech; Binks: Command+Ceremony+madness; Blarg: moonstone+Religion 21; Darby: killed Asha; Amanita: Spare the Dying+vrock exam; Aeolus: NPC'd), NPC pages (Jorlan→Dead, Asha→Dead, Artaxle NEW, Garruk NEW, Derendil updated, Stool→healed), roll stats (S14 row, 20 DDB + 5 transcript-only). Flora/Fauna ✅ (vrock exam noted on Amanita page; riding lizard noted on Garruk page — no standalone creature pages needed). Mechanics ✅ (house rules covers S14 rulings). |
| 2026-05-15 | Claude (Convo 2, S15) | S15 fully synced. Session note created (SITL_15_050326_The_Long_Road_to_Sloobludop.md). Corrected transcript confirmed in vault from Convo 1. Dashboard updated: S15 row, Sloobludop distance corrected 8→7 days, Fungal Cavern added to locations, 7 new/updated open threads (Travel, Cloak of Elvenkind, Déjà Vu, Bracers +1 AC, Ring of Spell Storing, Darkness Safety Word, Topsy/Turvy rummaging), old Jorlan's Cloak thread removed (superseded), timeline through S15 (~7–8 days post-escape). Loot tracker: S15 section with full armory inventory, Ormu harvest, Fungal Cavern fungi, bracers/cloak corrections applied to S14 entries. Quote board: ~20 quotes. Profanity: Kit to 33, Darby ties Addison at 7. House rules: 5 S15 rulings (24hr Bless, +1 AC bracers, Cloak attunement, Bless on skill checks, Sloobludop distance). Journal: S15 collapsible entry. All 6 PC pages updated (Kit: Cloak/bracers/déjà vu/humming; Blarg: Ormu/botany; Amanita: Fungal Cavern/teaching; Binks: language class/Ring discussion; Darby: nat 20 Undercommon; Aeolus: AC 12 flagged/Sylvan/Ring). NPC pages: Topsy + Turvy updated (rummaging). Location: Fungal Cavern (Day 4) page created. Flora/Fauna: Ormu, Tongue of Madness, Nightlight, Waterorb pages created; Timmask updated with S15 encounter. Roll stats: S15 row (28 DDB, 0 nat 20s DDB, 3 nat 1s). Mechanics: house rules covers S15 rulings. |
| 2026-05-21 | Claude + Taylor (vault restructure) | Tracker files moved from hub root to `00-Campaign-Hub/Trackers/`. Files renamed with S01-S15 suffix. Roll Statistics moved from `05-Mechanics/` to Trackers. Vault Format Reference created in `00-Campaign-Hub/`. Column definitions and dependency map updated to reflect new paths. Tracker file rotation: S01-S15 (legacy batch), then every 10 sessions (S16-S25, S26-S35, etc.). |
| 2026-06-07 | Claude (post-S16 follow-ups) | **Tracker migration completed:** root tracker content split into `Trackers/` batches (S01-S15 archive + S16-S25 active for Loot/Quotes/Profanity/Roll Stats); root files converted to pointer stubs; `Loot Tracker S16-S30.md` placeholder and duplicate root Exhaustion tracker deleted; Dashboard + Session 16 note links updated. **Level discrepancy resolved per Taylor:** party is Level 4, Level 5 pending at player-chosen time near future — Open Threads corrected. **Transcription vocab updated** in `sitl_transcribe.js`: +10 keyterms (Clementine, Roxanne, Roxy, Terrestor, Psilofyr, Carrion King, carrion crawler/s, violet fungus/fungi), Artaxel keyterm fixed to Artaxle, +3 custom-spelling rules (Terastor/Terrastor→Terrestor; Silith/Sylophir/Sylophyr→Psilofyr; Artaxel→Artaxle) and Darendil/Sloopladop variants added to existing rules. Horn origin expected in next session's recap (per Taylor). |
| 2026-06-10 | Claude (Convo 2, S18 — automated) | **S18 fully synced** (filed under disputed number — see ⚠️ collision note). Session note + corrected transcript confirmed present (from Convo 1). **New pages created:** [[Sloopidoop]] (kuo-toa Society of Brilliance priest), [[Wazalax]] (referenced mind flayer), [[Society of Brilliance]] (faction), [[Sloobludop]] (location), [[Darklake Approach Pool]] (location + submerged lair), [[Chuul]] (creature). **Dashboard:** S18 row (with collision note), Derendil→Captured/Restrained + identity debunked, Roxy→stored in horn, Sloopidoop added as transactional ally, timeline through S18 (~10–11 days post-escape). **Trackers (S16-S25 active batch):** Loot (lair haul + horn-attuned update), Quote Board (~20 quotes), Profanity (Kit→56, Addison→14 passing Binks; self-censored entries logged not counted), Roll Stats (S18 transcript-only row + ⚠️ no-S17 / DDB-not-queried notes). **House Rules:** S18 rulings (Hold Person fails on quaggoth/monstrosity; War Caster Thorn Whip reposition; NPC loot ID; armor classification + "Sand" scroll pending). **Open Threads:** Society of Brilliance bargain opened, Derendil curse darkened + kingdom debunked, Sea Mother gurgle, Sand-scroll/armor flags, Clementine re-raised, horn storage completed, Darkness safe word still open; Sloobludop travel updated. **Location Index** updated. **POV Journal:** S18 collapsible entry (verbatim). **All 6 PC pages** updated (Kit: emotional state, turning point, Lock of Trickery, downed-by-Derendil event, personality descriptors; Blarg: Bless/Persuasion/Hold-Person-fail/heal; Binks: Guiding Bolt 20 + heal + exhaustion; Amanita: returned, hooked + Thorn-Whipped the chuul, gems + scale armor; Aeolus: fishing + Eldritch Blast + clutch Sleep; Darby: late arrival, Roxy gore, horn attuned, Rope of Mending, smitten with Sloopidoop). **NPCs:** Derendil (major — bound/debunked), Topsy, Turvy (both off-screen → bound Derendil), Roxy (horn-stored), Stool (chuul slam), Glabbagool (bait + engulf), Shuushar (referenced — at the village), Clementine (re-raised, no context). **Flora/Fauna:** Chuul created; Quaggoth updated with the Derendil reveal. **Mechanics:** House Rules covers S18. ⚠️ DDB archive NOT queried (Supabase permission denied); Roll Log transcript-only. ⚠️ Session-number collision unresolved — no S17 row exists. |
| 2026-06-07 | Claude (Convo 2, S16) | S16 fully synced. ⚠️ Session pt1 recording lost — notes reconstruct pt1 partially from 12 DDB rolls; pt2 transcript via AssemblyAI. Hannah absent. Session note created (Session 16 — Zone of Truth). Corrected transcript 16_052426_corrected.md (from Convo 1). Dashboard: S16 row, Derendil/Clementine/Roxanne companion updates, Lolth added to antagonists, timeline through S16 (~9–10 days post-escape). Open Threads: 5 new threads (Horn/Roxy Storage, Shelter Form, Binks's Real Name, Derendil Curse-Breaking, Dream Journaling, Level 5 at Sloobludop), 4 updated (Madness, Shrine Desecration→Lolth confirmed, Travel, Sylophir/Psilofyr), level-5 discrepancy flagged. House Rules: 7 S16 rulings. Loot Tracker (hub root): horn + Roxy shelter form. Quote Board (hub root): ~30 quotes. Profanity (hub root): Kit +17 → 50; Binks 12; first Aeolus f-bomb. Roll Stats (05-Mechanics): S16 row + S14/S15 missing-row backfill (drift found). Exhaustion & Madness: S16 avoided-madness entry (both copies synced). Journal: S16 entry. All 6 PC pages. NPCs: Derendil (Terrestor, episode, passed save), Clementine page CREATED, Topsy, Turvy, Roxy (horn + shelter). Locations: The Darklake (region entered), Fungal Cavern S16 camp, Location Index. Flora/Fauna: Violet Fungus + Carrion Crawler pages created. ⚠️ Discovered Trackers/ restructure incomplete (0-byte placeholders) — S16 content appended to hub-root files; see Gaps. |
