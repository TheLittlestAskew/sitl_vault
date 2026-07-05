# HANDOFF — sitl_vault

> Obsidian D&D vault for the "Sky Is The Limit" campaign. Includes Site_HTML, Templates, Workflows.
> Handoff is **enabled** for this repo. Every change updates the DO NEXT block below and prepends a log entry.
> Note: this is a notes/content vault — most session-note edits won't have a "next dev step." Use the DO NEXT block for things like next-session prep if useful, or leave it as "—".

## ▶ DO NEXT — before tomorrow's session (2026-07-05), in order
1. 🚨 **Watcher — check, may already be resolved:** `Get-ScheduledTask` shows "SITL Pipeline Watcher" as `Running` right now, so `Install-SITLTask.cmd` may already have been run. Just confirm it's pointed at the new vault path (not silently stuck on the old one) rather than re-running blind.
2. **Publish command (new):** `Workflows/scripts/Publish-SITL.cmd` commits + pushes all note changes; the site fetches session notes straight from this repo's main, so push = publish (~5 min CDN).
3. **Inside Obsidian (never shell):** move the six root template stubs (Character/Item/Location/NPC/Quest/Session.md) into `Templates/` — they currently appear as phantom blank rows in every DnD.base view.
4. **Kit journal cleanup (inside Obsidian):** merge `02-Character_Journal/` surgery files (`_S09_addition`, `_temp_header`, `_test`, `S09_Journal_INSERT_BEFORE_RELATED`) into `Kit Aluri Journal.md`, then delete the four leftovers.
5. ⚠️ **Verify archive data:** load `/sky-is-the-limit/archive.html` live and confirm the session list populates — it queries Supabase `vtrtyagltwdrbastpppl`, but the MCP connection labeled SystemHorizon (same ref per prior notes) shows no ddb tables; the project↔connection mapping needs confirming in the next Code session.
6. **Site follow-up (rectrixcaedere repo):** `session.html` hardcodes the session list; new sessions need a list entry until the list is generated from a manifest/Supabase.

---

## Log
<!-- newest first · one entry per logical task/session · timestamp · source · changed · commit · next -->

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
