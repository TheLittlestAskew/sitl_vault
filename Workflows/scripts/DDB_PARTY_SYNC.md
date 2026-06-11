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

## Authenticated mode (unlocks Campaign-Only sheets) — built in

By default the sync is **anonymous** and only sees **Public** sheets. To also pull
**Campaign-Only** sheets (the common case — visible to you in the app because you're
a campaign member), authenticate as yourself with your **Cobalt** session cookie:

1. Log in to D&D Beyond in a browser.
2. **F12 → Application → Cookies → `https://www.dndbeyond.com`** → copy the value of
   **`CobaltSession`**. (DevTools can read it even though it's an HttpOnly cookie that
   page scripts can't — which is also why the roll-sync extension can't grab it.)
3. Put it in the vault `.env`:  `DDB_COBALT=<value>`  (a commented placeholder is
   already there). `.env` is gitignored — **keep it secret; it is your live login.**
4. Re-run `node ddb_party_sync.js`. It now reports `🔑 authenticating as you` and
   fetches Campaign-Only sheets across **any** campaign you're a member of.

How it works: the script POSTs your Cobalt cookie to
`auth-service.dndbeyond.com/v1/cobalt-token`, gets back a short-lived **Bearer** token
(the kind that rotates every few minutes), and sends it on each character request. It
mints a fresh Bearer **every run**, so you never chase the rotating token — you only
re-paste the Cobalt cookie every few weeks when it eventually expires (fetches 403 again).

**Limits:** this authenticates as *you*, a player. It unlocks Public + Campaign-Only,
**not** other players' truly-**Private** sheets (those are invisible even to you in the
app). Bypassing genuine Private requires the character's owner or the DM's account.

If `DDB_COBALT` is absent or expired, the script logs a warning and falls back to
anonymous (public-only) — it never hard-fails.
