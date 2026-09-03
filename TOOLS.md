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
| **AssemblyAI** | Service | mp3 → session transcript | api.assemblyai.com | ~2026-08-30 | Paid | `3-5-pro` model with `custom_spelling`; driven by `Workflows/sitl_transcribe.js` |
| **SITL Pipeline Watcher** | Task | Watches for new session audio and starts the transcribe→spellcheck→toast flow | Task Scheduler → `start-watcher-hidden.vbs` | 2026-09-02 | Free | State: Running. Log at `_pipeline/watcher.log` |
| **chokidar** | Library | Filesystem watching inside `sitl_pipeline_watch.js` | `Workflows/scripts` `chokidar@^5.0.0` | 2026-09-02 | Free | — |
| **BurntToast** | Library | Windows toast notifications with Review/Approve buttons | PowerShell module, `sitl_notify.ps1` | ~2026-08-31 | Free | The approval step of the pipeline |
| **Cloudflare R2** | Service | Hosting published session recordings | `r2.cloudflarestorage.com` | 2026-08-29 | Free tier | Uploaded by `upload_sitl_recording_to_r2.mjs` |
| **@aws-sdk/client-s3** | Library | S3-compatible client for the R2 upload | `Workflows/scripts` `^3.1121.0` + `lib-storage` | 2026-08-29 | Free | R2 speaks the S3 API |
| **Supabase** | Service | `Rectrix_Caedere` — rolls, sessions, public session index | project `vtrtyagltwdrbastpppl` | 2026-08-30 | Free tier | ⚠️ PostgREST caps at 1000 rows; the S18+ fix paginates (948→1330 rolls) |
| **supabase** | MCP | Vault-scoped MCP server for Supabase reads/writes | `mcp.json` at vault root | ~2026-08-30 | Free | Note: this vault's file is `mcp.json`, not `.mcp.json` like ashfall/wtff |
| **Node.js + npm** | CLI | Running the watcher, publish, and index-generation scripts | local install | 2026-08-31 | Free | — |
| **Python 3** | CLI | Ad-hoc correction scripts in `_pipeline/` | local install | ~2026-06-14 | Free | e.g. `S18/correct_s18.py` |
| **git** | CLI | Version control, handoff motion | `C:\Program Files\Git` | 2026-08-31 | Free | — |
| **GitHub** | Service | Remote host for `TheLittlestAskew/sitl_vault` | github.com | 2026-08-31 | Free | — |
| **Claude Code** | App | Transcription review, session notes, publish waves, handoffs | CLI / IDE extension | 2026-08-31 | Paid | — |
| **session-index-generator** | Skill | Builds the public session index | `Workflows/scripts/generate_public_session_index.mjs` | 2026-08-30 | Free | Ported here from aftermath-atlas |
| **septentrion-sync** | Skill | Feeds handoff state to the vault + SystemHorizon heartbeat | `~/.claude/skills/septentrion-sync` | 2026-09-02 | Free | In both `REPOS` and `TOOLS_REPOS` |

## Retired

| Tool | Type | Was used for | Retired | Why |
|---|---|---|---|---|
| ~~**AssemblyAI `3-pro`**~~ | Service | Transcription model | ~2026-08-01 | ✅ Upgraded to `3-5-pro` |
| ~~**Two-DB roll copy**~~ | Service | Staging rolls before copying to `Rectrix_Caedere` | 2026-07-22 | ✅ `ddb-roll-sync` writes direct now |
