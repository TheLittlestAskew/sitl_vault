# HANDOFF — sitl_vault

> Obsidian D&D vault for the "Sky Is The Limit" campaign. Includes Site_HTML, Templates, Workflows.
> Handoff is **enabled** for this repo. Every change updates the DO NEXT block below and prepends a log entry.
> Note: this is a notes/content vault — most session-note edits won't have a "next dev step." Use the DO NEXT block for things like next-session prep if useful, or leave it as "—".

## ▶ DO NEXT
— Run `Workflows/scripts/Install-SITLTask.cmd` from the new vault location (double-click, accept UAC) to re-register the "SITL Pipeline Watcher" logon task; the pre-existing task still points at the old pre-move path and fails silently. Then double-click `start-watcher-hidden.vbs` to start the watcher now. If the old task has a different name, delete the stale one.

---

## Log
<!-- newest first · one entry per logical task/session · timestamp · source · changed · commit · next -->

### 2026-06-29 ET · Claude chat
- **Changed:** Added `Workflows/scripts/Install-SITLTask.cmd` (mirror of the WTFF/Ashfall installer). SITL had the watcher, `start-watcher-hidden.vbs`, and `run-watcher.cmd` but no installer to re-register its Task Scheduler entry. After the vaults moved under `C:\Users\theli\Obsidian Vaults\`, the existing logon task pointed at the old absolute path and failed silently.
- **Commit:** `Add Install-SITLTask.cmd: registers the SITL Pipeline Watcher logon task`
- **Next:** Tayls runs `Install-SITLTask.cmd` from the new location, then starts `start-watcher-hidden.vbs`. Remove the stale old-path task if its name differs from "SITL Pipeline Watcher".

### 2026-06-23 09:37 ET · Claude chat
- **Changed:** Enabled repo handoff — added this `HANDOFF.md` at root.
- **Commit:** `docs: enable repo handoff`
- **Next:** Set by the next real change to the repo.
