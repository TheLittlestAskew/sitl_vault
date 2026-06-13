# Project/ — Claude Project-Knowledge Mirror

This folder is a **git backup** of the Claude project-knowledge instruction documents for this campaign. These docs define how Claude turns raw sessions into the Obsidian vault.

## Why this exists

The instruction docs live inside the Claude project, where no MCP tool can read or write them — they are maintained by hand, which makes them easy to lose (it has happened). Mirroring them here gives:

- A version-controlled backup and history
- A public reference for the DM and players
- A recovery source if a project doc is deleted or corrupted

## Source of truth

**The Claude project is canonical.** This folder is a copy. When you edit an instruction doc in the project, paste the new version here too. If the two ever disagree, the project wins — *unless* the project copy was lost, in which case this folder is the recovery source.

## Standard contents

Every campaign vault uses the same filenames in this folder. A campaign may not need every doc (e.g. one where you play rather than DM); mark those `n/a` instead of deleting the slot, so the structure stays uniform across vaults.

| Standard filename | Mirrors project doc | Purpose |
|---|---|---|
| `Project_Instructions.md` | master ruleset | Shared rules, constraints, campaign reference |
| `Convo_1_Instructions.md` | Convo 1 instructions | Session-notes generation workflow |
| `Convo_2_Instructions.md` | Convo 2 instructions | Vault-update workflow |
| `Session_Notes_Section_Breakdown.md` | section breakdown | What goes in each notes section |
| `Session_Notes_Template_Instructions.md` | template instructions | Using the notes generator |
| `Convo2_Handoff_Template.md` | handoff template | The Convo 1 → Convo 2 bridge block |

## This vault's current status

| Standard filename | Status |
|---|---|
| `Project_Instructions.md` | ✅ Present (standard name) |
| `Convo_1_Instructions.md` | ✅ Present (standard name) |
| `Convo_2_Instructions.md` | ✅ Present (standard name) |
| `Session_Notes_Section_Breakdown.md` | ✅ Present (standard name) |
| `Session_Notes_Template_Instructions.md` | ✅ Present (standard name) — RETIRED stub; `.docx`/`sitl_v8.js` no longer used |
| `Convo2_Handoff_Template.md` | ✅ Present (standard name) |

### Also present (beyond the standard set — pending review)

- `ADDENDUM_AssemblyAI_Transcription_Process.md` — transcription process notes (tooling doc, may belong with automation rather than here)
- `SITL_Vault_Structure_Guide.md` — vault structure reference
- `Vault Format Reference.md` — **copy of a live vault file** (`00-Campaign-Hub/Vault Format Reference.md`); duplicate, drift risk
- `sitl_transcribe.js` — **duplicate** of the automation script in `Workflows/` root

## See also

- [`../TRIGGERABLE_ACTIONS.md`](../TRIGGERABLE_ACTIONS.md) — index of every triggerable
  action in `Workflows/` (the session pipeline, transcription, roll & party sheet sync, the
  DDB Roll Sync extension, the scheduled task, and local Supabase): what each does and how to
  fire it.

## Sync discipline

Whenever you change an instruction doc in the Claude project:

1. Copy the full new text.
2. Replace the matching file here.
3. Commit (Obsidian Git auto-commits within ~10 min, or push manually).
