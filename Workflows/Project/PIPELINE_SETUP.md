# SITL Pipeline Automation — Setup Runbook

Option B: drop an `.mp3` → auto-transcribe → auto spell-check → **you approve** → auto-apply + auto-propagate + auto-push. No `.docx`.

---

## 1. Where each file goes

| File (from this build) | Put it here in the vault |
|---|---|
| `sitl_pipeline_watch.js` | `Workflows\` (run it from here) |
| `automation\convo1_phaseA.md` | `Workflows\Project\automation\` |
| `automation\convo1_phaseB_apply.md` | `Workflows\Project\automation\` |
| `automation\convo2_propagate.md` | `Workflows\Project\automation\` |
| `mcp.json` | vault root, **renamed to** `.mcp.json` |

The watcher auto-creates `_pipeline\` (scratch/review files) on first run.

---

## 2. One-time setup (≈15 min, do once)

1. **Install Claude Code** if you haven't: `npm install -g @anthropic-ai/claude-code`, then run `claude` once in the vault and log in.
2. **Install the watcher dependency:** open a terminal in `Workflows\` and run `npm install chokidar`.
3. **Supabase token (for unattended roll queries):**
   - Generate a Personal Access Token at `https://supabase.com/dashboard/account/tokens`.
   - Set it as a Windows **user** environment variable named `SUPABASE_ACCESS_TOKEN` (search "Edit environment variables for your account"). Open a fresh terminal after.
   - This keeps the token out of the repo — `.mcp.json` only references `${SUPABASE_ACCESS_TOKEN}`.
4. **Verify the MCP:** in the vault root run `claude` then `/mcp` — `supabase` should show connected. Ask it to run a quick `SELECT COUNT(*) FROM sitl_session_rolls;` to confirm.
5. **Open `sitl_pipeline_watch.js` and check the CONFIG block** — especially `RAW_DIR`. Your Convo 2 doc says the transcriber writes to `Raw_Unedited`; older notes say `Raw`. Set whichever is real, and confirm `TRANSCRIBE_CWD` points at the folder holding `sitl_transcribe.js`.
6. **`.gitignore`:** add `_pipeline/` (transient scratch). `.mcp.json` has no secret in it, so committing it is optional/safe.
7. **Do the `.docx` removal** (next section) — required, or the automated runs will still try to make a `.docx`.

---

## 3. Remove `.docx` from the instructions (run once)

The automation prompts already say "no `.docx`," but your instruction files still describe the `sitl_v8.js` step. Clean them at the source. Open `claude` in the vault root (interactive, so you see diffs) and paste:

```
Strip all .docx generation from the SITL workflow instruction files in Workflows/Project/. Edit:
- SITL_Convo_1_Instructions.md: remove the sitl_v8.js generation, fix_tbl_borders, pack/validate, and "deliver the .docx" steps. The canonical session-notes artifact is now the 01-Sessions markdown note, written during Convo 1.
- SITL_Convo_2_Instructions_v2.md: change the prereq "the .docx from Convo 1" to "the markdown session note from Convo 1"; remove the "Does not generate .docx" line.
- SKY_IS_THE_LIMIT_PROJECT_INSTRUCTIONS_TRIMMED.md: remove .docx / sitl_v8 references from the Source Files table and anywhere else they appear.
- CONVO2_HANDOFF_TEMPLATE.md: remove any .docx path field.
- SITL_Session_Notes_Template_Instructions.md: mark RETIRED at the top — sitl_v8.js is no longer used.
Use surgical edits. Show me a diff of each file before saving. Change nothing else.
```

**Verify after:** grep the five files for `docx` and `sitl_v8` — only the "RETIRED" note should remain. The `sitl-v8-docx` skill is now dead weight; archive it when convenient.

---

## 4. Daily use

1. **Start the watcher** (leave the window open): from `Workflows\` run
   `node sitl_pipeline_watch.js`
2. **Drop the session `.mp3`** into `Session_Sources\Recordings\`.
3. Wait. It transcribes, runs the spell-check pass, then **beeps + prints `READY FOR REVIEW`**.
4. **Review** `_pipeline\S##\spellcheck.md` (and `flags.md`). Edit the table directly if a correction is wrong — your edits are treated as final.
5. **Approve:** run `node sitl_pipeline_watch.js --approve`. It applies corrections, writes the markdown note, propagates the whole vault, and pushes to GitHub.

That's the only manual step: the spell-check glance. Everything else is hands-off.

---

## 5. Two things to know

- **Billing (kicks in June 15, 2026):** headless `claude -p` usage on subscription plans draws from a separate monthly Agent SDK credit pool, distinct from your interactive limits. This whole pipeline runs on `claude -p`, so heavy session-processing pulls from that pool.
- **Permissions:** the watcher uses `--permission-mode acceptEdits` (auto-accepts file edits). If the Phase-B / Convo-2 legs stall asking to confirm a `git push` or bash command, change `CLAUDE_FLAGS` in the watcher to `--dangerously-skip-permissions` (fully unattended) **or** scope it, e.g. add allowed bash like `--allowedTools "Read,Edit,Write,Bash(git*),Bash(node*)"`. Start with acceptEdits; only loosen if it actually blocks.

---

## 6. What changed vs. the old flow

- Vault writes are now **native file edits** in Claude Code — no Obsidian MCP, no 4-minute timeouts, no read/draft/write phasing.
- GitHub is a **plain `git push`** — the old ~21KB inline-push ceiling and blob-SHA ritual were GitHub-*MCP* artifacts and no longer apply.
- Supabase stays via MCP (read-only, scoped to your project).
- Convo 1 now writes the `01-Sessions` markdown note directly (no redundant rebuild in Convo 2), and **no `.docx` is produced anywhere.**
