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
| [[Session 17 — The Big Fish Eat the Little Fish\|S17]] | 06/07/26 | ~45 (transcript-only) | ~32 | ~13 | 1 (Derendil crit vs Kit) | 2 (chuul surprise Nat 1; party History Nat 1) | Kit | ⚠️ transcript-only — DDB NOT queried this run (Supabase permission denied). Counts approximate. |
| [[Session 18 — Trust the Whirlpool\|S18]] | 06/14/26 | ~55 (transcript-only) | ~25 | ~30 | ≥5 (Kit ×3 incl. killing leap; Roxy flat init 20; Binks raft save 20) | 2 (Aeolus jump-init; Blarg overboard) | Kit | ⚠️ transcript-only — DDB NOT queried (Supabase permission denied). Counts approximate. |

> ⚠️ **DDB archive NOT queried for S17 or S18** (Supabase `execute_sql` permission denied in the automated phase) — counts are transcript-only and not cross-referenced. The earlier S17/S18 number collision is **resolved**: the 2026-06-07 chuul session = **S17**, the 2026-06-14 whirlpool session = **S18**. Binks (Matt) and Aeolus (Sirius) roll physical dice — their zero-DDB presence is expected, not a sync gap.

---

## Update Log

| Session Added | Date Updated | Notes |
|---|---|---|
| S14–S15 backfill + S16 | 2026-06-07 | ⚠️ Audit found S14/S15 rows missing from the session table despite prior log entries — backfilled from log data. S16 row added: 33 DDB rolls (Kit 17, Darby 8, Blarg 7, 1 blank/Florian-user-id 1d6). 12 rolls (15:45–16:32 UTC) predate the surviving pt2 recording — context inferred (pt1 lost). 1 nat 20 (Kit Arcana 22, pt1 — likely horn identification). 1 nat 1 (Kit Survival, pt1). Transcript-only: Aeolus Animal Handling 23; all Binks rolls (Perception 16, Topsy's 8, flat nat 20, WIS save 16, Religion 19, Persuasion 4). Hannah absent — 0 Amanita rolls (Blarg rolled her watches). No combat. |
| S17 | 2026-06-10 | ⚠️ **DDB archive NOT queried** (Supabase `execute_sql` permission denied in the automated phase). Row is **transcript-only** (~45 rolls across two combats + the lair scene); combat/non-combat split and nat-20/nat-1 counts are approximate. Notable: **Derendil's Nat 20 crit dropped Kit to 0** (survived at 1 HP via Orcish/Relentless Endurance), immediately answered by Kit's **31-damage round** (Sneak Attack 25 to hit + Trip + Savage Attacker + Action Surge). **Aeolus's Sleep** ended Combat 2 (Derendil Nat 4 save). Chuul opened with a Nat 1 surprise pincer. Loot d100s: Kit 37 (Lock of Trickery), Blarg 70 (Spell Scroll of Sand), Darby 64 (Rope of Mending). Physical-dice players (Binks/Matt, Aeolus/Sirius) absent from DDB as always. ⚠️ Session-number collision since **resolved** (chuul = S17). Re-run cross-reference once archive access is restored. |
| S18 | 2026-06-14 | ⚠️ **DDB archive NOT queried** (Supabase permission denied; automated phase). Transcript-only (~55 rolls): the river-raft skill challenge (Str/Dex saves, steering checks) + the green sea hag fight. Notable: **Kit's natural-20 killing leap** transformed her greatsword into a trident and pushed her to **Level 5** (chose Dual Wielder); Kit reports **three nat 20s** this session. Aeolus's **Phantasmal Force** landed (hag Int 12 → failed save), **Guiding Bolt** 16 at advantage (Binks), **crocodile grapple** (Amanita) + **pacifying spores** (Stool) controlled the hag. DM's NPC dice ran cold (Blarg's nat-1 overboard; the hag's failed saves). Whirlpool: 7 bludgeoning each + Con saves vs. exhaustion (Amanita failed). Physical-dice players (Binks, Aeolus) absent from DDB as always. **S17/S18 number collision resolved** (chuul=S17, whirlpool=S18). Re-run cross-reference once archive access is restored. |

---

## Related

- [[Campaign Dashboard]]
- [[Roll Statistics S01-S15]]
- [[Session 16 — Zone of Truth]]
- [[Session 17 — The Big Fish Eat the Little Fish]]
- [[Session 18 — Trust the Whirlpool]]

#mechanics #roll-statistics
