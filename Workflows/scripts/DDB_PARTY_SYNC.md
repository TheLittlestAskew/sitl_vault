# DDB Party Sheet Sync

Pulls **full character sheets for the whole party** from D&D Beyond and drops them
into the vault — the sheet-data companion to `ddb_sync_supabase.js` (which does rolls).

It uses DDB's **public character service** (`character-service.dndbeyond.com/character/v5/...`),
so there's **no login and no token**: it only ever sees sheets players have shared.

## One-time setup: get the character IDs

The fetch needs each PC's **`characterId`** — the number in the sheet URL
`dndbeyond.com/characters/<characterId>`. This is **not** the `userId` recorded in
your PC notes; it's a different number.

1. Open the campaign page on DDB (`dndbeyond.com/campaigns/6907990`).
2. Each listed character links to `/characters/<id>` — grab the `<id>` from each link.
3. Put them in **`ddb_party.json`**, replacing the `0` placeholders.

> **Sharing requirement:** a sheet is only fetchable if its owner set sharing to
> **Public** or **Campaign Only** (Character Sheet → ⚙ → Character Privacy).
> **Private** sheets return HTTP 403 and are skipped (the run reports which ones).

## Run it

```powershell
node ddb_party_sync.js
```

Output (overwritten each run; your hand-written PC notes are never touched):

- `03-Characters/PCs/Party Character Sheets/_raw/<Name>.json` — full raw sheet JSON (source of truth)
- `03-Characters/PCs/Party Character Sheets/<Name> (DDB).md` — readable sheet (abilities, HP, inventory, spells…)

## Automatic refresh

`sitl_pipeline_watch.js` calls this script on every new session recording (right after
the keyterms refresh). It's **non-fatal** — an unfilled ID or a network hiccup logs a
warning and the transcription pipeline carries on.

## Notes & limits

- The markdown is a **best-effort render**. DDB doesn't expose a fully-computed sheet,
  so derived numbers (HP, and especially AC, which isn't rendered) are approximate.
  When precision matters, read the raw JSON.
- Ability scores fold in racial/feat bonuses found in the `modifiers` buckets, plus
  any `overrideStats` — good for the common cases, not a full rules engine.

## Want Private sheets too? (future upgrade)

Switch to authenticated fetches using **your** DDB **Cobalt** session cookie:
1. POST your `cobalt` cookie value to `https://auth-service.dndbeyond.com/v1/cobalt-token`
   to get a short-lived Bearer token.
2. Send `Authorization: Bearer <token>` on the character-service request.

That lets the DM pull every sheet regardless of each player's sharing setting. It's
opt-in because it involves handling your login credential — treat the cobalt value
like a password (store it in `.env`, never commit it).
