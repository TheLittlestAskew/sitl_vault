# TOOLS — sitl_vault

> What this project uses and what for. Maintained by the handoff motion: whenever
> a tool is used here, add or bump its row.
> Types: `Skill` · `MCP` · `CLI` · `App` · `Service` · `Site` · `Library` · `Data` · `Task`
> A `~` before a date means inferred, not observed. `—` means unknown.

## Active

| Tool | Type | Used for | Access | Last used | Cost | Notes |
|---|---|---|---|---|---|---|
| **Obsidian** | App | The vault itself — session notes, character journals, world lore | desktop | 2026-08-31 | Free | 9 plugins enabled, the most of any campaign vault |
| **obsidian-git** | Library | Auto-commit/backup of the vault | Obsidian plugin | ~2026-08-31 | Free | Many `HANDOFF` log entries are its automated commits, not deliberate work |
| **dataview** | Library | Queried session/roll tables inside notes | Obsidian plugin | ~2026-07-05 | Free | — |
| **templater-obsidian** | Library | Session/NPC/Item note templates | Obsidian plugin | ~2026-05-13 | Free | Backs the root `Session.md`, `NPC.md`, `Character.md` templates |
| **smart-connections** | Library | Semantic search across the vault | Obsidian plugin | ~2026-05-13 | Free | Builds `.smart-env` |
| **obsidian-5e-statblocks** | Library | Rendering monster/NPC statblocks | Obsidian plugin | ~2026-05-09 | Free | — |
| **obsidian-linter** | Library | Markdown normalisation | Obsidian plugin | ~2026-06-13 | Free | — |
| **obsidian-local-rest-api** | Library | Local HTTP access into the vault | Obsidian plugin | ~2026-05-13 | Free | Paired with `mcp-tools` |
| **mcp-tools** | MCP | Exposes the vault to Claude as MCP tools | Obsidian plugin | ~2026-05-13 | Free | Depends on `obsidian-local-rest-api` |
| **script-launcher** | Library | Firing the pipeline scripts from inside Obsidian | Obsidian plugin | ~2026-06-13 | Free | — |
| **AssemblyAI** | Service | mp3 → session transcript | api.assemblyai.com | 2026-09-13 | Paid | `3-5-pro` model with `custom_spelling`; driven by `Workflows/sitl_transcribe.js`. ⚠️ S24's header reports `speech_model: unknown (missing from API response)` — the model field is not always returned |
| **SITL Pipeline Watcher** | Task | Watches for new session audio and starts the transcribe→spellcheck→toast flow | Task Scheduler → `start-watcher-hidden.vbs` | 2026-09-13 | Free | State: Running (PID 11796, up since 09-09). Date NOT bumped on 09-14: the script was **repaired**, not run. 🛑 **It holds `_pipeline/watcher.log` open**, so the separate `--approve` process gets EBUSY on every write — that log records the watcher's side only, never the approve side. ⚠️ `runClaude` was capped at 20 min and is now **90** (`SITL_CLAUDE_TIMEOUT_MIN`); its timeout kills the shell but **not** the `claude` child, which keeps writing after "FAILED" is reported |
| **ddb_party_sync.js** | CLI | Pulls all six PC sheets from D&D Beyond into `03-Characters/PCs/Party Character Sheets/` (+ `_raw/*.json`) | `Workflows/` | 2026-09-13 | Free | Needs a fresh Cobalt/Bearer token from the browser. Writes a `synced:` frontmatter stamp — that stamp is how you date a run |
| **chokidar** | Library | Filesystem watching inside `sitl_pipeline_watch.js` | `Workflows/scripts` `chokidar@^5.0.0` | 2026-09-02 | Free | — |
| **BurntToast** | Library | Windows toast notifications with Review/Approve buttons | PowerShell module, `sitl_notify.ps1` | ~2026-08-31 | Free | The approval step of the pipeline |
| **Cloudflare R2** | Service | Hosting published session recordings | `r2.cloudflarestorage.com` | 2026-08-29 | Free tier | Uploaded by `upload_sitl_recording_to_r2.mjs` |
| **@aws-sdk/client-s3** | Library | S3-compatible client for the R2 upload | `Workflows/scripts` `^3.1121.0` + `lib-storage` | 2026-08-29 | Free | R2 speaks the S3 API |
| **Supabase** | Service | `Rectrix_Caedere` — rolls, sessions, public session index | project `vtrtyagltwdrbastpppl` | 2026-09-13 | Free tier | ⚠️ PostgREST caps at 1000 rows; the S18+ fix paginates (948→1330 rolls). 📌 **The anon-key PostgREST path is the primary route for roll reads, not the MCP** — `_pipeline/S2x/query_rolls.js` has worked first try for S20–S24 |
| **supabase** | MCP | Vault-scoped MCP server for Supabase reads/writes | `mcp.json` at vault root | ~2026-08-30 | Free | Note: this vault's file is `mcp.json`, not `.mcp.json` like ashfall/wtff. 🛑 **Unusable non-interactively** — `supabase-account2` and `supabase-cutter` were both **permission-blocked** again on 2026-09-13 (S24), same as S23. Date NOT bumped: it was invoked and denied, which is not a use |
| **Node.js + npm** | CLI | Running the watcher, publish, party-sync and index-generation scripts | local install | 2026-09-14 | Free | `node --check` before running any edited pipeline script |
| **Python 3** | CLI | Ad-hoc correction scripts in `_pipeline/` | local install | ~2026-06-14 | Free | e.g. `S18/correct_s18.py` |
| **PowerShell** | CLI | Toasts, the status window, and the shell the pipeline's `.cmd` files run under | `pwsh` 7+ / Windows PowerShell | 2026-09-14 | Free | Backs `sitl_notify.ps1` + `sitl_status_window.ps1` and BurntToast. ⚠️ Closing `'@` of a here-string must be at **column 0**, and a here-string piped to a native exe is passed as an argument, not on stdin |
| **cmd.exe** | CLI | Runs `Approve-SITL.cmd`, `Publish-SITL.cmd`, `run-watcher.cmd` | Windows shell | 2026-09-14 | Free | 🛑 **Batch files MUST be CRLF.** cmd.exe seeks by byte offset assuming CRLF; with bare LF the offset drifts and it re-executes fragments of earlier lines, so `if/else` blocks run **both** branches and emit `'errorlevel' is not recognized`. Pinned by the repo's `.gitattributes` since 2026-09-14 — do not remove it |
| **git** | CLI | Version control, handoff motion | `C:\Program Files\Git` | 2026-09-14 | Free | ✅ **The seven-session `git commit` block did NOT recur on 2026-09-14** — `git commit -F <file>` and `git commit -m` both worked first try via PowerShell, as did `git -C <path>` and compound `&&` invocations. Confirm before assuming the old constraint still holds. ⚠️ Passing a message via a PowerShell here-string to `commit -F -` does **not** pipe — git reads it as a pathspec and errors. Write the message to a file and pass the path |
| **GitHub** | Service | Remote host for `TheLittlestAskew/sitl_vault` | github.com | 2026-09-14 | Free | ⚠️ Public repo — keep DM medical details and personal contact info out of committed artifacts |
| **Claude Code** | App | Transcription review, session notes, publish waves, handoffs | CLI / IDE extension | 2026-09-14 | Paid | — |
| **/handoff** | Skill | Banking work, the DO NEXT pointer, friction log, this table | `~/.claude/skills/handoff` | 2026-09-14 | Free | Enforced here by the Stop hook `~/.claude/hooks/handoff-guard.ps1` |
| **/kit-pov-journal** | Skill | Kit Aluri's in-character voice for Section 2 of the session notes | `~/.claude/skills/kit-pov-journal` | 2026-09-13 | Free | Read Kit's **Inner Life & Evolution** before writing. Hard Exclusions (no dice, spell names, stats, player names, session refs) are auditable — S24 scripted the check. Stated length band 600–1000 words, 1200 for heavy sessions |
| **session-index-generator** | Skill | Builds the public session index | `Workflows/scripts/generate_public_session_index.mjs` | 2026-09-14 | Free | Ported here from aftermath-atlas. 🛑 **The site reads this index and nothing else for the session list** — a committed note that is not in the index is invisible. Skipping it stranded S23 (08-31) and S24 (09-13). Safe to run standalone: it only rewrites the JSON, it does not commit |
| **septentrion-sync** | Skill | Feeds handoff state to the vault + SystemHorizon heartbeat | `~/.claude/skills/septentrion-sync` | 2026-09-02 | Free | In both `REPOS` and `TOOLS_REPOS` |

## Retired

| Tool | Type | Was used for | Retired | Why |
|---|---|---|---|---|
| ~~**AssemblyAI `3-pro`**~~ | Service | Transcription model | ~2026-08-01 | ✅ Upgraded to `3-5-pro` |
| ~~**Two-DB roll copy**~~ | Service | Staging rolls before copying to `Rectrix_Caedere` | 2026-07-22 | ✅ `ddb-roll-sync` writes direct now |
