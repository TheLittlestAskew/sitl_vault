# HANDOFF — sitl_vault

> Obsidian D&D vault for the "Sky Is The Limit" campaign. Includes Site_HTML, Templates, Workflows.
> Handoff is **enabled** for this repo. Every change updates the Status/Next Steps below and prepends a log entry.
> Note: this is a notes/content vault — most session-note edits won't have a "next dev step."

## Status

S19's roll-sync gap is repaired (backfilled + registered in `ddb_sessions`); ongoing per-session sync and vault-cleanup items remain open.

## Next Steps

- [ ] After every SITL session, run `Workflows/scripts/Sync-Rolls-To-RC.md` (roll copy Meridian→RC + `ddb_sessions` registration) — the DDB extension writes only to Aftermath Meridian now
- [ ] Inside Obsidian (never shell), move the six root template stubs (Character/Item/Location/NPC/Quest/Session.md) into `Templates/`
- [ ] Inside Obsidian, merge `02-Character_Journal/` surgery files (`_S09_addition`, `_temp_header`, `_test`, `S09_Journal_INSERT_BEFORE_RELATED`) into `Kit Aluri Journal.md`, then delete the four leftovers
- [ ] Re-run the Supabase cross-reference for the Full Roll Log in `Session 19 — We Are Split in Two.md` (56 rolls now in `sitl_session_rolls`, S19 registered as `ddb_sessions` id 20)
- [ ] Publish notes via `Workflows/scripts/Publish-SITL.cmd` (or a manual push) — the scheduled backup commit/push is permanently dead (S-9)

## Context

Long-term roll-sync automation decision still open (options listed in `Workflows/scripts/Sync-Rolls-To-RC.md`).

---

## Log
<!-- newest first · one entry per logical task/session · timestamp · source · changed · commit · next -->

### 2026-07-16 · Claude Code
- **Changed:** Root-caused and repaired the "DDB roll sync malfunctioning" report. Root cause: the roll pipeline MOVED, it didn't break — the extension has written only to Aftermath Meridian (`drtvlcgyjlofaffbwael.rolls`) since ~2026-06-15, while the RC site + archivist read the Rectrix_Caedere project (`vtrtyagltwdrbastpppl`), where `sitl_session_rolls` turned out to be a VIEW over `ddb_rolls` (ET-timezone session dates). Repair: backfilled all 82 missing SITL rolls (S19's 56 + June/July strays) into `ddb_rolls` with idempotent ON CONFLICT dedup; per-day count+sum(total) checksums verified against Meridian; registered S19 in `ddb_sessions` (id 20); confirmed 56 rolls anon-visible via the site's exact REST query. Wrote the repeatable per-session runbook `Workflows/scripts/Sync-Rolls-To-RC.md`. Also resolved the old DO NEXT 5 mystery: the correct MCP connection for `vtrtyagltwdrbastpppl` is `supabase-cutter` (project "Rectrix_Caedere"), not SystemHorizon. Old DO NEXT items 1 (watcher path ✓ verified), 2, 5, 6 closed (6 was done earlier today: S19 wired into the RC site pages, commit `0384631` in rectrixcaedere).
- **Commit:** this commit (runbook + HANDOFF), pushed manually — no auto-backup exists anymore.
- **Next:** DO NEXT 1 becomes part of the post-session ritual; Tayls to pick the long-term sync automation option (runbook §Long-term).
- **Watch out:** Meridian `rolls.individual_values` is stored as a jsonb STRING (`"[1]"`), RC `ddb_rolls` wants a real array — the runbook's Step 2 CASE handles it; don't skip it.

### 2026-07-05 ET · Claude Code
- **Changed:** Completed DO NEXT item 3 from the 2026-07-04 audit — unified all 18 `01-Sessions/*.md` notes to the adopted schema: added `campaign: Sky Is The Limit` (0/18 had it), renamed `date:` → `session_date:` (12/18 needed it), merged `tags: [session, sitl]` into existing/new tags blocks. Also added `type: session` to the 13/18 notes that were missing it entirely — without it, `DnD.base`'s Sessions view (`filters: type == "session"`) wouldn't have shown those rows at all, so the DO NEXT item as literally written wouldn't have "lit up the Sessions view fully" as promised. Verified all 18 frontmatter blocks still parse as valid YAML after edits. Renumbered DO NEXT accordingly and noted the SITL watcher task is currently `Running` per `Get-ScheduledTask` (item 1 may already be resolved — needs a path confirmation, not a blind re-run).
- **Commit:** picked up automatically by the vault's scheduled backup commit/push (not committed manually this session).
- **Next:** Open the vault in Obsidian and confirm the Sessions view in DnD.base now shows all 18 rows ordered by session_date. Then proceed to items 1 (path check) and 3–4 (Obsidian-only moves) above.

### 2026-07-04 ET · Claude chat
- **Changed:** Added `Workflows/scripts/Publish-SITL.cmd` (one-command note publish). Rewrote DO NEXT as the pre-session work order from the 2026-07-04 three-vault consistency audit (frontmatter drift, phantom stub rows, Kit journal cruft, archive-data verification).
- **Commit:** `Add Publish-SITL.cmd; DO NEXT = pre-session work order (vault audit)`
- **Next:** Items 1–2 tonight (60 seconds each); item 3 in Claude Code before tomorrow if possible.
- **Watch out:** items 4–5 must happen inside Obsidian so wikilinks update; never via shell or file tools.

### 2026-06-29 ET · Claude chat
- **Changed:** Added `Workflows/scripts/Install-SITLTask.cmd` (mirror of the WTFF/Ashfall installer). SITL had the watcher, `start-watcher-hidden.vbs`, and `run-watcher.cmd` but no installer to re-register its Task Scheduler entry. After the vaults moved under `C:\Users\theli\Obsidian Vaults\`, the existing logon task pointed at the old absolute path and failed silently.
- **Commit:** `Add Install-SITLTask.cmd: registers the SITL Pipeline Watcher logon task`
- **Next:** Tayls runs `Install-SITLTask.cmd` from the new location, then starts `start-watcher-hidden.vbs`. Remove the stale old-path task if its name differs from "SITL Pipeline Watcher".

### 2026-06-23 09:37 ET · Claude chat
- **Changed:** Enabled repo handoff — added this `HANDOFF.md` at root.
- **Commit:** `docs: enable repo handoff`
- **Next:** Set by the next real change to the repo.
