---
created_on: 2026-05-14
updated_on: 2026-08-29
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
| S19 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ |
| S20 ⚠️ | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| S21 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| S22 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

> ⚠️ **S20 row added 2026-08-16 during the S21 sync — it had no row at all, despite being largely propagated.** An audit during the S21 pass found S20's propagation stopped partway: the four trackers, the POV Journal, NPC pages, Locations and Flora/Fauna were all done, but **PC pages, House Rules, Open Threads, and the Dashboard Sessions-table row were never completed**, and no matrix row or change-log entry was ever written. The S21 pass filled in what it could verify without re-reading S20's note (Dashboard S20 row and timeline entry; Derendil/Ploop/Glug/Hemeth/Indigo/Demogorgon S20→S21 continuity), and left explicit `⚠️ Gap` markers on every page that still needs S18–S20 backfill. **🟡 Dashboard = partial** (Sessions row and timeline now present; S20's own threads/antagonist changes not extracted). **❌ PC Pages and Mechanics remain genuinely undone for S20.** Do not treat S20 as synced.

> ✅ **S22 fully synced 2026-08-29.** All thirteen columns complete. DDB roll archive **cross-referenced (68 rows)**; session **registered in `ddb_sessions` as id 23**. ⚠️ **A ✅ in the PC Pages column means S22's own beats are written up — it does not mean those pages are complete.** ✅ **Resolved by a follow-up pass the same day** — all 34 missing S15–S21 entries were backfilled from the session notes, so the PC Pages column is now honest for every row S15–S22. ⚠️ That pass also corrected this note's own arithmetic: **four** pages stopped at S14 (Binks, Amanita, Aeolus, Darby), not five; [[Blarg]] was missing S18–S20 and [[Kit Aluri]] S15/S18/S20. ⚠️ The "two legacy holes" flagged alongside that pass were **both false alarms** (investigated 2026-08-29): Kit's S11 had been **merged into her S12 entry** and is now split back out, and **Binks was absent from S01** so correctly has no entry. **All six PC pages now run S01→S22 unbroken**, bar Binks's legitimate S01/S09/S10 absences and Darby's S09. See the Gaps Summary.

> ⚠️ **S17 has no row in this matrix and never has.** The table runs S16 → S18. S17 *was* cross-referenced (2026-06-14, 47 archive rows) and has a session note and corrected transcript, so this is a missing row rather than missing work — but it has gone unnoticed through four sync passes. Noticed 2026-08-29 during the S22 sync; **not back-filled here**, because asserting thirteen column states for a session this pass did not audit would be a guess.

> ✅ **S21 fully synced 2026-08-16** (automated Convo 2 pass). All thirteen columns complete. DDB roll archive **queried and cross-referenced (87 rows)**; session **registered in `ddb_sessions` as id 22**. See the change-log entry below.

> ✅ **S19 numbering resolved (2026-07-05, per Taylor).** The 2026-07-05 play session ("We Are Split in Two") was filed under the pipeline's working name "S20"; Phase A flagged it as a likely direct continuation of S18 that might properly be S19, with the vault's `19-060726` transcript slot occupied by a duplicate/mislabeled recording of S17. Taylor confirmed it is a distinct **Session 19** — session note, pipeline folder (`_pipeline/S19/`), and transcripts renamed accordingly; the orphaned duplicate relocated to `_pipeline/_ORPHANED_dup-of-S17_060726/`.
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

**Fully synced:** S01–S19, **S21** and **S22**. ⚠️ **S17 has no matrix row** — see the note above the Gaps section.

**Partially synced:** ⚠️ **S20** — trackers, journal, NPCs, locations and flora/fauna done; **PC pages, House Rules and Open Threads never completed**, Dashboard partial. See the matrix note.

**Not started:** None

**Priority catch-up order:**
1. ✅ **DONE 2026-08-29 — the PC-page gap is closed. All six PC pages now run continuously S01→S22** (bar two legacy holes, below). **34 entries were backfilled** from the session notes in a dedicated catch-up pass; every inline `⚠️ Gap` marker on a PC page is now marked closed.
   ⚠️ **The gap was bigger than recorded, and my own first count of it was also wrong — here is the audited truth.** The standing note said Binks, Amanita, Blarg and Aeolus were missing **S18–S20**. The S22 sync then overstated it as "five of six pages stopping at S14." Actually: **[[Binks Stonevein]], [[Amanita de'Champignon]], [[Aeolus]] and [[Darby Stonefeather]] stopped at S14** (seven sessions missing each, and **Darby was never on the gap list at all**); **[[Blarg]]** had S15–S17 and S21 but was missing **S18–S20**; **[[Kit Aluri]]** was missing **S15, S18 and S20** specifically. Four pages stopped at S14, not five.
   ✅ **The "two legacy holes" flagged alongside that pass turned out not to be holes at all** — both were investigated on 2026-08-29 and neither needed writing:
   - **[[Kit Aluri]] S11 was never missing — it was *merged*.** The whole S11 account (the Carrion King nightmare, the undead soldiers, the natural-20 death save, the **Doll of the Fallen Soldier**, seeing [[Topsy]] alive, the **Fey Touched** grant, the vote and the Nexus Pool) had been **concatenated onto the end of her S12 entry**, with the seam visible mid-sentence at *"Two drow kills fighting blind. — surrounded by undead soldiers."* **Split back out as its own S11 entry**, wording preserved and wikilinks added. **Her Key Events now run S01→S22 unbroken.**
   - ⭐ **[[Binks Stonevein]] has no S01 entry because he was not in Session 01.** The S01 note's frontmatter reads `absent: ["Binks Stonevein"]`, its party table marks him Absent, and the note states "Will appear S02." **His page is correct as it stands** — this was never a gap, and the earlier flag was wrong.
2. ✅ **DONE 2026-08-29 — S20 House Rules and S20 Open Threads are extracted.** Eight S20 rulings written up, including 🛑 **the discovery that DC 30 as the "miracle" threshold first appears in S20**, not S21 — S21's entry already referred back to "the same figure Addison quoted in S20" without that ruling ever being recorded. Six S20-specific open threads added ([[Hemeth]]'s unrecovered weapons; Kit's weapon-feature rules text living only in DMs; her ambiguous madness count; [[Clib]]'s true name; [[Glug]] asserted-but-never-shown; the [[Limu Gugun]] spelling ruling) and two closed (freeing the duergar; escaping [[Sloobludop]]).
   ✅ **The Aplopod → [[Bloppblippodd]] naming migration is also done** — **seven broken `[[Aplopod]]` wikilinks** (no such page exists) across the Dashboard, Open Threads and [[Sloobludop]] were repointed. Session notes and transcripts left verbatim as historical record.
   ✅ **DONE 2026-08-30 — S20's antagonist/thread changes are on the Dashboard.** [[Bloppblippodd]] rewritten from a live S19 antagonist to **dead (S20), killed by her own father**, with the full altar account; [[Clib]] added (he was never listed); [[Glug]] linked and given his S20 asserted-but-never-shown status; [[Limu Gugun]] added as the **revealed identity of [[Demogorgon]]**; [[Hemeth]] rewritten to record that the party freed him in S20. **The S20 backlog is now fully closed.** (The Dashboard's Open Threads section is a pure pointer to this file, so nothing to sync there.)
3. ✅ **DONE 2026-08-29 — the [[Roxy]] and [[Derendil]] NPC gap markers are closed.** Roxy gained **S18–S20** (the twin-raft form at 20 HP each, the boulder strike, Kit fighting from her horns, the shrine "offering" that earned a giggle from the idol, and the S20 stampede that demolished a building); Derendil gained **S19–S20** (non-functional and carried; then the full altar-battle frenzy).
4. 🔴 **NEW 2026-08-30 — 22 actively-linked concept pages do not exist.** Found while sweeping the Dashboard for broken links; **verified by direct file/alias lookup, not by regex.** Every one of these is `[[linked]]` from live vault pages and resolves to nothing:
   **Deities & factions:** `Lolth` (8 files), `Bregan D'aerthe` (9), `Blibdoolpoolp` — the Sea Mother, linked as both `[[Blibdoolpoolp]]` and `[[Blibdoolpoolp|the Sea Mother]]` — `Zhentarim` (3), `Jarlaxle`, `Grazilaxx`, `Silofirst` (3 — spelling also unresolved).
   **Concepts & regions:** `faerzress` (3 — arguably the campaign's central mechanic), `Gauntlgrym` (3), `Evermoors`, `Upperdark`, `Middledark`, `Lowerdark`, `The Northdark`, `svirfneblin`.
   **Creatures, items & mechanics:** `Sea Hag` (6), `Crocodile`, `Phantasmal Force`, `Longstrider`, `Silvered Crowbar`, `Path of the Wild Heart`, `Shuushar the Awakened` (an alias of the existing [[Shuushar]] — a one-line frontmatter fix).
   ⚠️ **Several are cheap alias fixes rather than new pages** (`Shuushar the Awakened`, `Gauntlgrym` if it belongs on an existing location). Others — `Lolth`, `faerzress`, `Blibdoolpoolp` — are load-bearing lore that deserve real pages rather than stubs. **Not created unilaterally; Taylor's call on scope and priority.**
   📌 **Method note for whoever picks this up:** an inline regex link-checker gave two *wrong* answers during this sweep — it mis-parsed `[[Target\|Alias]]` in tables and ignored `aliases:` frontmatter, producing both false positives and false negatives. **Verify any candidate with a direct file-and-alias lookup before acting on it.**
5. ⚠️ **Resolve the S17/S18 session-number collision** (human decision) and retire duplicate 06/07/2026 transcripts/pipeline folders.
3. ✅ **RESOLVED 2026-08-29 — the website publishes itself now.** `Workflows/scripts/generate_public_session_index.mjs` emits `00-Campaign-Hub/Public Session Index.json`, and both `sky-is-the-limit/session.html` and `archive.html` fetch it and merge it into their `ARC` arrays (`sitl_vault@bbea7a7`, `rectrixcaedere@5d2be07`). **S20, S21 and S22 are live**; the hardcoded Sessions count and Deepest Reach now derive from the registry. ⚠️ The old backlog figure recorded here ("S16–S21") was **wrong on both ends** — S16–S19 were already registered and S22 was also missing; the real gap was S20–S22. **From now on, publishing a session = writing its `site_region` / `site_arc` / `site_events` frontmatter and running the generator.** 🔵 Remaining: S16–S19 still have their editorial hardcoded in the site rather than in frontmatter, which also requires ruling on the **S09/S10 title divergence** before `FIRST_PUBLISHED` can be lowered.
4. ⚠️ **Sync-script data-quality bugs still unfixed** (flagged 2026-06-14, re-confirmed 2026-08-16 during the S21 cross-reference): `is_nat_20`/`is_nat_1`/`is_critical` come through **NULL**, and `individual_values` is stored **double-encoded** as a JSON string. Every nat-20 count since S18 has been derived by hand.
5. 🟡 **Three items need a human, not a pass:** (a) [[Indigo]]'s surname — "de Charmed" is unverifiable and in no vault source, **needs Addison**; (b) the S21 closing-beat attribution — whether *"Kit pulls out a shotgun"* is Addison narrating or Taylor's OOC line bleeding into the DM's segment, **needs Taylor's ear on the recording**; (c) [[Aeolus]]'s **Repelling Blast** cantrip, **needs Sirius**.
6. S04 corrected transcript still missing (legacy gap).

**Resolved:**
- ✅ **S19 session-numbering resolved (2026-07-05, per Taylor):** the 2026-07-05 session ("We Are Split in Two") is confirmed as Session 19, not a continuation of S18 or a duplicate. Session note, `_pipeline/S19/` folder, and corrected/raw transcripts renamed from the pipeline's working "S20" label; orphaned duplicate-of-S17 pipeline artifacts relocated to `_pipeline/_ORPHANED_dup-of-S17_060726/`. All ~15 vault files referencing "Session 20"/"S20" swept and corrected.
- ✅ Tracker restructure **completed 2026-06-07**: content split into `Trackers/` batch files (`* S01-S15.md` archives + `* S16-S25.md` active). Hub-root files (`Loot Tracker.md`, `Quote Board Master.md`, `Profanity Ledger.md`, `05-Mechanics/Roll_Statistics.md`) are now pointer stubs so legacy links resolve. Misnamed empty `Loot Tracker S16-S30.md` placeholder and duplicate hub-root `Exhaustion & Madness Tracker.md` deleted (canonical copy lives in `Trackers/`). Dashboard Quick References/Quick Links updated to active batches.
- ✅ Party level **resolved 2026-06-07 (per Taylor)**: level-up NOT complete — party is Level 4; Addison is giving the option to take Level 5 in the near future, timed by the players' feel (at/after Sloobludop). Erroneous Open Threads "Completed" entry corrected.

---

## Update Log

| Date | Updated By | Changes |
|---|---|---|
| 2026-08-29 | Claude Code (Convo 2, S22) | **S22 fully synced — all 13 columns ✅.** Session note + corrected transcript (`22 - 081626_corrected.md`) verified present from Convo 1; `validate_note.js` still reports **CONTRACT PASS** after the frontmatter additions. **Roll archive: 68 rows** for 2026-08-16, **12:22–15:06 ET** (Kit 20, Darby 15, Amanita 13, Binks 11, unattributed 9; **Aeolus 0, Blarg 0**), session **registered as `ddb_sessions` id 23**. **New pages created (6):** [[The Mermaid Cove]] (location), [[Merfolk Stormcaller]], [[Merfolk Wave Bender]], [[Merfolk Skirmisher]], [[Grinning Cat]] (creatures — these pages **establish the vault spellings**, lifting the ≤60% proper-noun confidence cap from S23), and [[Blue Lichen]] (flagged stub — nothing established). **Trackers (S16-S25):** Loot (**no new loot** — inventory reconciliation, the identified waterskin, the sword's Strength-save cost, Binks's lute, Darby's mace turning on her, Summon Fey, Stool's level-up), Quote Board (~90 quotes), Profanity (Kit → **77**; the *hell* column moves for four speakers; 2 censored instances logged not counted), Roll Stats (S22 row + full cross-reference entry). **Exhaustion & Madness:** 🛑 **two PCs end the session under ACTIVE short-term madness with combat live** — Darby (own mace, Int save 7, d100 70) and Kit (**requested**, d100 55), plus Topsy/Turvy stuck in wererat hybrid form. First session in the campaign to end with madness running. **Dashboard:** S22 row, Nanny Plunk → **DEAD**, the **escaped hag** added as a new active antagonist, the charmed merfolk added, Demogorgon's severed link, Indigo/Topsy/Turvy/Stool/Glabbagool/Roxy/Sloopidoop companion updates, timeline (same in-world day as S21 — adds no days). **Open Threads:** closed **Nanny Plunk** and **the storm ritual**; opened 9 (the escaped hag/next Nanny Plunk, the restrained hag, freeing the charmed merfolk, Indigo's people and the two priests, Topsy/Turvy's hybrid form, the party's madness, the never-run dream sequences, the never-held status round, the lute/Loot Pick naming question). **House Rules:** 11 S22 rulings incl. **non-lethal damage on request (standing)**, **Hunter's Mark overrides misleading Insight**, **madness awarded on request**, holding initiative via a group Wisdom check, and the mace forcing a save on its own wielder. **POV Journal:** S22 collapsible entry, verbatim; file verified intact afterwards (1045 lines, 8/8 `<details>` balanced). **All 6 PC pages** updated with S22 key events + 9 character descriptors + backlinks. **NPCs (9):** Nanny Plunk (**status → Dead**, full death account), Indigo, Sloopidoop (**alive — the S18 cliffhanger resolves**), Stool, Topsy, Turvy, Roxy, Glabbagool, Demogorgon. **Locations:** The Mermaid Cove created; The Darklake (**the lake is inhabited**), The Bone Teeth, Location Index. **Mechanics:** House Rules covers S22. **Three cross-reference findings the Convo 1 pass could not see** (it ran against the stale 11-row pull): (1) ⭐ **[[Amanita de'Champignon]]'s "NAT20" Insight is real and in the archive** (`1d20+5 = 25`, 14:37 ET) — the session note's Continuity Flag #2 logged it as existing in neither transcript nor archive and **can be closed**; (2) ⭐ **[[Kit Aluri]]'s decisive Insight was a natural 1** (`1d20+1 = 2`, 14:49 ET, three minutes before the killing blow) — the note describes it as misleading her but never records it as a nat 1, and it makes the session's title mechanically earned; (3) ⭐ **[[Darby Stonefeather]]'s Hold Person break was a genuine natural 20** (14:43 ET). **Deliberately NOT done:** the session note's stale per-row `✅ archive` / `transcript-only` tags were **not** auto-flipped (re-deriving needs timestamp matching, not a character-and-total guess); the **fog-origin contradiction** and the **"lute pick" vs "Loot Pick"** rename were **left open for Taylor**; `mithril` → `mithral` **was** normalised as approved. ⚠️ **Audit findings:** the PC-page gap is **S15–S21 across five pages**, not S18–S20 across four, and **[[Darby Stonefeather]] was never on the gap list**; **S17 has no matrix row.** |
| 2026-08-16 | Claude (Convo 2, S21 — automated) | **S21 fully synced — all 13 columns ✅.** Session note + corrected transcript (`21 - 080226_corrected.md`) verified present from Convo 1. **DDB gap closed:** 87 archive rows cross-referenced for 2026-08-02 (Binks 27, Kit 18, Amanita 16, Darby 15, unattributed 11; **Aeolus 0, Blarg 0 — both entirely off-DDB**), and the session is **registered in `ddb_sessions` as id 22**. **New pages created (6):** [[Nanny Plunk]] (green hag, first direct appearance, session cliffhanger), [[Garl Glittergold]] (Binks's deity — answered two prayers this session), [[Selûne]] (Blarg's deity, named on record for the first time), [[Clib]] (minor kuo-toa; resolved a dead link), [[The Sheltered Cove]] and [[The Bone Teeth]] (locations). **Trackers (S16-S25 batch):** Loot (retconned Sloobludop treasure in its own subsection; the two new vessels; the permanent Garl shrine; mace 1d4→1d6 fire; Amanita's lost shield; Binks's tripled stunt doubles; Kit's three borrowed weapons), Quote Board (~70 quotes), Profanity (Kit crosses **70**; Addison to 24; 8 STT-dropped instances logged but uncounted per the S20 convention), Roll Stats (S21 row + full cross-reference entry). **Exhaustion & Madness:** party-wide exhaustion **clear** logged; the DC-12 mass madness save logged as the campaign's closest call — everyone passed, two heroic inspirations and a superiority die deep. **Dashboard:** S20 **and** S21 Sessions rows (S20's was missing entirely), Indigo added as companion #11, Derendil/Jimjar/Hemeth moved to Former/Departed, Roxy ship-form, Demogorgon added to Key Antagonists, Nanny Plunk upgraded to active, timeline through S21 with the **~Day 21–30 range flagged as a range, not a value**. **Open Threads:** closed Level 5, Derendil's Curse (there was never a curse), the Sloobludop civil war and the Deep Father ritual; **reopened [[Shuushar]]'s fate**; opened 9 new threads (warn the Underdark, reach Mantol-Derith, reunite with Jimjar/Hemeth, consequences of the middle finger, the golden shrine, Kit's attunement experiment, Roxy's ship-form, Indigo's six-fingered man, Ploop's fate, Repelling Blast). **House Rules:** 12 S21 rulings including the **Daggerheart Hope/Fear d12 import** (used twice; declare-before-rolling is load-bearing), DC 30 as the miracle threshold, prayer without a named god, the vehicle HP/AC subsystem, and the retcon + the **oryx/rothe contextual naming rule**. **POV Journal:** S21 collapsible entry, verbatim. **All 6 PC pages** updated with S21 key events, descriptors, quotes and backlinks; Kit's Inner Life & Evolution rewritten for S21 (Active Emotional State, a new Turning Point, Relationship Undercurrents) with the S19 state preserved beneath. **NPCs:** Indigo (full name, backstory, mercenary, six-fingered man, knows Nanny Plunk), Demogorgon (destroyed Sloobludop; **can be made to pause**), Derendil (**written out** — ruled a true quaggoth), Ploop (**status unknown**), Jimjar + Hemeth (**separated**), Roxy (ship-form + glowing filaments), Stool (nat-20 survival), Topsy, Turvy, Shuushar (**reopened**), Echo (invoked and answered), Glug. **Locations:** [[Sloobludop]] **marked DESTROYED**, The Darklake expanded into a navigable region with travel pace and sub-locations, Mantol-Derith given its full S21 briefing, plus Blingdenstone/Gracklstugh/Menzoberranzan/Neverlight Grove travel times and status; Location Index rewritten. **Flora/Fauna:** Quaggoth (the false-memory ruling; "Derendil was never an exception"), Zurkhwood (boatbuilding), Ixitxachitl. **Three cross-reference findings worth carrying forward:** (1) **"dirty 20" ≠ natural 20 at this table** — five S21 instances resolve to a *total* of 20, only one to a real nat 20; (2) **Binks's 27 archive rows include Topsy/Turvy proxy saves** as composite `2d20` customs that decompose exactly against the transcript, resolving the Convo 1 physical-dice flag; (3) the **session actually ran ≈11:49 AM – 3:50 PM ET**, not the 9:07 AM start Convo 1 inferred — Addison was quoting Pacific time. ⚠️ **Audit finding: S20 was never given a matrix row and its propagation is incomplete** — see the matrix note and Gaps Summary. ⚠️ Website `ARC` registries not touched (out of scope, separate repo). |
| 2026-07-05 | Claude (S19 numbering fix) | **S19 added to sync matrix, fully synced.** The 2026-07-05 session ("We Are Split in Two") was processed by the pipeline under the working label "S20" with a Phase A flag questioning whether it was really S19 (direct continuation of S18) or a duplicate of the orphaned `19-060726` transcript (itself confirmed a mislabeled dupe of S17). Taylor confirmed: distinct **Session 19**. Renamed: session note (`01-Sessions/Session 19 — We Are Split in Two.md`), `_pipeline/S20/`→`_pipeline/S19/`, corrected + raw transcripts (`20-070526`→`19-070526`). Orphaned duplicate relocated to `_pipeline/_ORPHANED_dup-of-S17_060726/` and `..._ORPHANED_dup-of-S17_19-060726_raw_transcript.md`. Swept and corrected "Session 20"/"S20" references across Campaign Dashboard, House Rules, Location Index, Open Threads, all 4 active Trackers, Kit's Journal, PC pages (Aeolus/Darby/Kit), and 4 Location pages (Fungal Cavern/Mantol-Derith/Menzoberranzan/Sloobludop). `_pipeline/state.json` and `status.json` paths/numbers updated to match. |
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
