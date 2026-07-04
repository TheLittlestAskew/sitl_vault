# HANDOFF — sitl_vault

> Obsidian D&D vault for the "Sky Is The Limit" campaign. Includes Site_HTML, Templates, Workflows.
> Handoff is **enabled** for this repo. Every change updates the DO NEXT block below and prepends a log entry.
> Note: this is a notes/content vault — most session-note edits won't have a "next dev step." Use the DO NEXT block for things like next-session prep if useful, or leave it as "—".

## ▶ DO NEXT — before tomorrow's session (2026-07-05), in order
1. 🚨 **Watcher still broken:** run `Workflows/scripts/Install-SITLTask.cmd` (double-click, accept UAC) to re-register the "SITL Pipeline Watcher" logon task (old task points at the pre-move path, fails silently). Then double-click `start-watcher-hidden.vbs`. Delete the stale old-path task if named differently.
2. **Publish command (new):** `Workflows/scripts/Publish-SITL.cmd` commits + pushes all note changes; the site fetches session notes straight from this repo's main, so push = publish (~5 min CDN).
3. **Claude Code migration (from 2026-07-04 audit):** unify 18 session notes to the adopted superset schema — add `campaign: Sky Is The Limit` and `tags: [session, sitl]`; rename `date:` → `session_date:`. DnD.base already orders by `session_date`, so this lights up the Sessions view fully.
4. **Inside Obsidian (never shell):** move the six root template stubs (Character/Item/Location/NPC/Quest/Session.md) into `Templates/` — they currently appear as phantom blank rows in every DnD.base view.
5. **Kit journal cleanup (inside Obsidian):** merge `02-Character_Journal/` surgery files (`_S09_addition`, `_temp_header`, `_test`, `S09_Journal_INSERT_BEFORE_RELATED`) into `Kit Aluri Journal.md`, then delete the four leftovers.
6. ⚠️ **Verify archive data:** load `/sky-is-the-limit/archive.html` live and confirm the session list populates — it queries Supabase `vtrtyagltwdrbastpppl`, but the MCP connection labeled SystemHorizon (same ref per prior notes) shows no ddb tables; the project↔connection mapping needs confirming in the next Code session.
7. **Site follow-up (rectrixcaedere repo):** `session.html` hardcodes the session list; new sessions need a list entry until the list is generated from a manifest/Supabase.

---

## Log
<!-- newest first · one entry per logical task/session · timestamp · source · changed · commit · next -->

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
