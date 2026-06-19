---
created_on: 2026-06-07
updated_on: 2026-06-14
type: mechanics
updated: 2026-06-14
sessions_covered: 18
---

# Roll Statistics — S16-S25

> **Active tracker batch (S16–S25).** Earlier sessions and campaign records (S01–S15): [[Roll Statistics S01-S15]]. Rotates every 10 sessions per [[Vault Sync Status]].
> Records/superlatives carried in [[Roll Statistics S01-S15]] still stand until broken — when a record falls, note it here and update there.

---

## Session-by-Session Roll Counts

| Session | Date | Total | Combat | Non-Combat | Nat 20s | Nat 1s | Heaviest Roller | Archive Rows |
|---|---|---|---|---|---|---|---|---|
| [[Session 16 — Zone of Truth\|S16]] | 05/24/26 | 33 (+~7 transcript-only) | 0 | 33 | 1 (Kit Arcana, pt1) | 1 (Kit Survival, pt1) | Kit (17) | DDB + transcript ⚠️ pt1 recording lost — 12 rolls have inferred context |
| [[Session 17 — The Big Fish Eat the Little Fish\|S17]] | 06/07/26 | **47 DDB** (+ Binks physical) | — | — | **0** DDB | **2** DDB | Kit (19) | ✅ cross-referenced 2026-06-14 — 47 rows (Kit 19, DM 12, Amanita 8, Aeolus 4, Darby 4); Binks 0 (physical). 0 nat 20s DDB (Derendil's crit was a DM/off-DDB roll); 2 nat 1s = Amanita Initiative + Darby History. Loot d100s ✓ (Kit 37 Lock of Trickery; DM-rolled 64→Darby/Rope, 70→Blarg/Sand scroll). |
| [[Session 18 — Trust the Whirlpool\|S18]] | 06/14/26 | **82 DDB** (+ Aeolus physical) | —† | —† | **5** ✓DDB‡ | **0** DDB‡ | Kit / Binks (tie, 21 ea.) | ✅ cross-referenced 2026-06-14 — 82 rows, campaign 1 (Kit 21, Binks 21, Amanita 16, Darby 14, DM 10); Aeolus rolled physical |

> † Combat/non-combat is **not cleanly separable** from DDB `roll_type` for S18 (37 roll · 23 check · 16 save · 3 to-hit · 3 damage): the session mixes a non-combat river skill-challenge (saves/checks) with the hag combat. Left blank rather than guessed.
> ‡ **5 nat 20s** (DDB-verified): Kit ×3 (incl. the **greatsword killing-leap** to-hit `1d20+6 = 26`), Binks dex save `23`, and 1 DM/Roxy flat initiative `20`. **0 nat 1s** in DDB — the two transcript nat-1s (Aeolus jump-init; Blarg overboard) were rolled **off-DDB**.

> ✅ **S18 DDB cross-reference complete (2026-06-14):** 82 archive rows, campaign 1 "Sky Is The Limit", `last_synced 2026-06-14 18:44`. The S17/S18 number collision is **resolved** (2026-06-07 chuul = **S17**; 2026-06-14 whirlpool = **S18**) and the `ddb_sessions` registry now matches. ✅ **S17 (06-07) also cross-referenced (2026-06-14):** 47 archive rows; 0 nat 20s / 2 nat 1s DDB-verified. ⚠️ **"Physical-dice" assumption corrected:** participation varies by session — in S18 **Binks rolled 21 on DDB** (incl. a nat-20 save) while **Aeolus rolled physical (0 DDB)**; in S17 the reverse (**Aeolus 4 DDB, Binks 0**). Matt has since **switched to digital rolls** (confirmed by Taylor 2026-06-14). Do **not** treat any player's DDB absence as "expected."
> ⚠️ **Sync data-quality (follow-up):** the DDB sync left `is_nat_20`/`is_nat_1`/`is_critical` **NULL** for these rows (nat-20s above were derived by parsing `individual_values`), and `individual_values` is stored **double-encoded** as a JSON string (`"[20]"`) rather than an array. Fix in the sync script so future cross-references don't need manual parsing.

---

## Update Log

| Session Added | Date Updated | Notes |
|---|---|---|
| S14–S15 backfill + S16 | 2026-06-07 | ⚠️ Audit found S14/S15 rows missing from the session table despite prior log entries — backfilled from log data. S16 row added: 33 DDB rolls (Kit 17, Darby 8, Blarg 7, 1 blank/Florian-user-id 1d6). 12 rolls (15:45–16:32 UTC) predate the surviving pt2 recording — context inferred (pt1 lost). 1 nat 20 (Kit Arcana 22, pt1 — likely horn identification). 1 nat 1 (Kit Survival, pt1). Transcript-only: Aeolus Animal Handling 23; all Binks rolls (Perception 16, Topsy's 8, flat nat 20, WIS save 16, Religion 19, Persuasion 4). Hannah absent — 0 Amanita rolls (Blarg rolled her watches). No combat. |
| S17 | 2026-06-10 | ⚠️ **DDB archive NOT queried** (Supabase `execute_sql` permission denied in the automated phase). Row is **transcript-only** (~45 rolls across two combats + the lair scene); combat/non-combat split and nat-20/nat-1 counts are approximate. Notable: **Derendil's Nat 20 crit dropped Kit to 0** (survived at 1 HP via Orcish/Relentless Endurance), immediately answered by Kit's **31-damage round** (Sneak Attack 25 to hit + Trip + Savage Attacker + Action Surge). **Aeolus's Sleep** ended Combat 2 (Derendil Nat 4 save). Chuul opened with a Nat 1 surprise pincer. Loot d100s: Kit 37 (Lock of Trickery), Blarg 70 (Spell Scroll of Sand), Darby 64 (Rope of Mending). Physical-dice players (Binks/Matt, Aeolus/Sirius) absent from DDB as always. ⚠️ Session-number collision since **resolved** (chuul = S17). Re-run cross-reference once archive access is restored. |
| S17 (DDB cross-ref) | 2026-06-14 | ✅ **DDB cross-reference run.** **47 archive rows** for campaign 1 on 2026-06-07: Kit 19, DM/unattributed 12, Amanita 8, Aeolus 4, Darby 4; **Binks 0 (physical — Matt not yet on digital at S17)**. **0 nat 20s** DDB — Derendil's crit-vs-Kit was a DM/NPC roll made off-DDB (transcript-only). **2 nat 1s** DDB: **Amanita Initiative** `1d20+1=2` and **Darby History** `1d20+1=2` (the "chuul surprise nat 1" was a DM off-DDB roll — count of 2 was coincidental). Loot d100s confirmed: Kit 37 (Lock of Trickery); DM-rolled 64→Darby (Rope of Mending) and 70→Blarg (Spell Scroll of Sand). Kit's 31-damage round verified (Shortsword to-hit 25 at advantage `[15,18]`, Action Surge to-hit 18). Heaviest roller Kit (19) confirmed. ⚠️ Aeolus had 4 DDB rolls — the old "Aeolus = physical dice" tag is wrong for S17. |
| S18 (DDB cross-ref) | 2026-06-14 | ✅ **DDB cross-reference run** (Supabase now accessible). **82 archive rows** for campaign 1 on 2026-06-14: Kit 21, Binks 21, Amanita 16, Darby 14, DM/unattributed 10; Aeolus rolled physical (0 DDB). **5 nat 20s** (Kit ×3 incl. greatsword killing-leap to-hit 26; Binks dex save 23; 1 DM/Roxy flat init 20) — all derived by parsing `individual_values` because the sync left the `is_nat_20` flag NULL. **0 nat 1s** in DDB (the transcript's Aeolus/Blarg nat-1s were off-DDB). Heaviest roller is now a **Kit/Binks tie (21 each)**, not Kit alone. **Corrected the standing "Binks & Aeolus = physical dice" assumption** — Binks rolled digitally this session (confirm Matt switched). `ddb_sessions` registry fixed (06-07→S17, 06-14→S18). ⚠️ Sync bugs noted: NULL crit flags + double-encoded `individual_values`. |
| S18 | 2026-06-14 | ⚠️ **DDB archive NOT queried** (Supabase permission denied; automated phase). Transcript-only (~55 rolls): the river-raft skill challenge (Str/Dex saves, steering checks) + the green sea hag fight. Notable: **Kit's natural-20 killing leap** transformed her greatsword into a trident and pushed her to **Level 5** (chose Dual Wielder); Kit reports **three nat 20s** this session. Aeolus's **Phantasmal Force** landed (hag Int 12 → failed save), **Guiding Bolt** 16 at advantage (Binks), **crocodile grapple** (Amanita) + **pacifying spores** (Stool) controlled the hag. DM's NPC dice ran cold (Blarg's nat-1 overboard; the hag's failed saves). Whirlpool: 7 bludgeoning each + Con saves vs. exhaustion (Amanita failed). Physical-dice players (Binks, Aeolus) absent from DDB as always. **S17/S18 number collision resolved** (chuul=S17, whirlpool=S18). Re-run cross-reference once archive access is restored. |

---

## Related

- [[Campaign Dashboard]]
- [[Roll Statistics S01-S15]]
- [[Session 16 — Zone of Truth]]
- [[Session 17 — The Big Fish Eat the Little Fish]]
- [[Session 18 — Trust the Whirlpool]]

#mechanics #roll-statistics
