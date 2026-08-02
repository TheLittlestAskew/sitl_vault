# Auto-publish SITL session notes to rectrixcaedere.com

**Date:** 2026-08-01
**Status:** Approved design, not yet implemented
**Repos touched:** `sitl_vault` (most of the work), `rectrixcaedere` (two files, once)

---

## 1. Problem

Adding a session note to the vault does not put it on the website. Session 20 has been in
`01-Sessions/` since 2026-07-19 and still does not appear at rectrixcaedere.com.

Taylor's requirement: after a note is pushed to GitHub, it should show up on the site with no
command to run and nothing to ask for. Processing delay is acceptable.

## 2. Current state

**Already automatic.** `sky-is-the-limit/session.html` fetches note markdown live from
`raw.githubusercontent.com/TheLittlestAskew/sitl_vault/main/<path>` and renders it with marked.js.
Roll data streams live from Supabase. Editing an already-registered note updates the site by itself.

**Already automatic.** Obsidian Git commits and pushes the vault on its own. From
`.obsidian/plugins/obsidian-git/data.json`:

| Setting | Value | Effect |
|---|---|---|
| `autoSaveInterval` | `10` | auto-backup every 10 minutes |
| `autoBackupAfterFileChange` | `true` | also fires on file change |
| `differentIntervalCommitAndPush` | `false` | auto-backup performs commit **and** push together |
| `autoPullInterval` | `10` | pulls every 10 minutes |
| `pullBeforePush` | `true` | rebases before pushing |

The `vault backup: <timestamp>` commits in the log are this plugin. Not to be confused with
`wip-backup.ps1`, the Task Scheduler snapshotter that was permanently disabled on 2026-07-14 (S-9);
HANDOFF.md's "scheduled backup commit/push is permanently dead" refers only to that script.

**Not automatic.** Each campaign's `session.html` and `archive.html` holds a hardcoded JS array
named `ARC`. A session does not exist to the site until someone hand-writes a row into both files
in a different repo.

```js
// session.html: the registry of which notes exist
{n:'19', d:'2026-07-05', lbl:'July 5, 2026', f:'01-Sessions/Session%2019%20...md', t:'We Are Split in Two'}

// archive.html: the timeline card, with hand-written editorial
{n:'19', d:'2026-07-05', lbl:'Jul 5, 2026', t:'...', r:'Sloobludop', arc:'...', wp:'...', ev:[...]}
```

That is the entire gap.

## 3. Decisions

| Fork | Decision | Why |
|---|---|---|
| Scope | SITL first, then roll out | SITL's frontmatter is already unified; prove the pipeline before spreading it |
| Editorial fields | Note frontmatter (`site_*` keys) | Deterministic, free, no API key, no generated prose published unreviewed. The SITL pipeline already writes the whole note, so it can write these too |
| Mechanism | Action in the vault repo emits `sessions.json`; site fetches it | No cross-repo credentials, no regex surgery on live HTML, works regardless of how the note reached the repo |

Rejected: an LLM summarizer in CI (costs money, needs a secret, publishes non-deterministic text to
a public page with no review gate) and client-side GitHub API listing (unauthenticated limit is 60
requests/hour per visitor IP; one pageview would spend 20+).

## 4. Architecture

```
Session note written into sitl_vault/01-Sessions/
        │
        ▼   Obsidian Git, <= 10 min, automatic
   commit + push to main
        │
        ▼   GitHub Action, on push, paths: 01-Sessions/**
   parse frontmatter -> validate -> write site/sessions.json -> commit if changed
        │
        ▼   raw.githubusercontent, cache-busted with ?t=
   session.html and archive.html fetch sessions.json
        │
        ▼
   Session is live. No human action anywhere in the chain.
```

`rectrixcaedere` is modified once, by this project, and never again for a new session.

**No feedback loop.** The Action's own commit touches `site/sessions.json`, which is outside the
`01-Sessions/**` path filter, so it cannot retrigger itself. GitHub additionally suppresses workflow
triggers for pushes made with the built-in `GITHUB_TOKEN`.

**No local divergence.** The Action commits to `main` while Taylor's vault is open. Obsidian Git's
`autoPullInterval: 10` and `pullBeforePush: true` reconcile that automatically.

---

## 5. Component 1: the frontmatter contract

### Required (already present in every SITL note)

| Key | Type | Notes |
|---|---|---|
| `type` | string | must equal `session`; anything else is skipped, not an error |
| `session_number` | number or string | `20`, or `"04.5"` for later campaigns |
| `session_date` | date | ⚠️ see the date gotcha below |
| `title` | string | |

### Optional site keys

| Key | Site field | Consumer | Absent behavior |
|---|---|---|---|
| `site_region` | `r` | archive card | needs a guard added, see §7 |
| `site_arc` | `arc` | archive card | already guarded, omitted |
| `site_waypoint` | `wp` | timeline divider | already guarded, omitted |
| `site_events` | `ev` | timeline bullets | already guarded, omitted |
| `site_recording` | `rec` | audio player | already guarded, card hides itself |
| `site_finale` | `fin` | finale badge | already guarded, omitted |
| `site_hidden` | n/a | n/a | if `true`, the note is excluded from the manifest entirely |

`site_waypoint` is set only when the campaign **enters** a new region, because it renders as a
section divider above the card. S18 opens Sloobludop and carries it; S19 and S20 do not.

### Validation rules, all fail-loud

1. Missing any required key → fail, naming the file and the key.
2. Duplicate `session_number` across two notes → fail, naming both files.
3. Unparseable YAML → fail, naming the file.
4. `site_events` present but not a list of strings → fail.
5. Zero sessions found → fail. Never publish an empty manifest.

On failure the Action exits non-zero, commits nothing, and the previous good `sessions.json` stays
live. Taylor gets a red X and an email. The site never renders garbage.

### ⚠️ The date gotcha

YAML parsers deserialize an unquoted `2026-07-19` into a **date object**, not a string. Confirmed
against this vault with PyYAML; js-yaml behaves the same way, producing a JS `Date` set to UTC
midnight.

Formatting that with local-time accessors (`getFullYear`, `getMonth`, `getDate`) in any negative UTC
offset, which includes Eastern Time, yields **the previous day**. Every session date on the site
would silently shift back by one, and `rollStats(s.d)` would query Supabase for the wrong day and
report no rolls.

**Rule:** the generator must format dates from UTC accessors only, `toISOString().slice(0,10)` for
`d`, and UTC-based month/day lookup for the labels. This case gets an explicit regression test.

---

## 6. Component 2: the generator

New files in `sitl_vault`:

| File | Purpose |
|---|---|
| `.github/workflows/build-sessions.yml` | `on: push`, `paths: ['01-Sessions/**']`. Runs `npm ci`, then the tests, then the build; commits `site/sessions.json` only if it changed. Needs `permissions: contents: write` |
| `site/build-sessions.mjs` | walks `01-Sessions/*.md`, parses frontmatter, emits `sessions.json` |
| `site/build-sessions.test.mjs` | fixture tests, see below |
| `site/package.json` | pins `js-yaml@^4` |
| `site/package-lock.json` | committed, required by `npm ci` |
| `site/sessions.json` | **generated output, committed by the Action** |

A real YAML parser is required, not a regex. This vault's frontmatter contains quoted strings with
embedded colons, em-dashes, curly apostrophes, parentheses and block sequences; `party_level` on S20
is a 180-character quoted string. Hand-rolling that is a defect farm.

### ⚠️ .gitignore change

`package-lock.json` is gitignored vault-wide, and `npm ci` requires it. Append:

```gitignore
# Build lockfile for the site manifest generator (npm ci needs it committed)
!site/package-lock.json
```

Verify with `git check-ignore -v site/package-lock.json` returning nothing.

### Output schema

```json
{
  "campaign": "Sky Is The Limit",
  "generated": "2026-08-01T14:22:05Z",
  "sessions": [
    {
      "n": "20",
      "d": "2026-07-19",
      "lbl": "July 19, 2026",
      "lblShort": "Jul 19, 2026",
      "f": "01-Sessions/Session%2020%20%E2%80%94%20Not%20My%20Circus...md",
      "t": "Not My Circus, Not My Demogorgon",
      "r": "Sloobludop",
      "arc": "Ploop’s home → the Altar of the Deep Father",
      "ev": ["...", "...", "...", "..."]
    }
  ]
}
```

Sorted by `session_number` ascending. Optional keys are omitted entirely when absent, never emitted
as `null`.

### Field derivation

| Field | Rule |
|---|---|
| `n` | numeric `session_number` → zero-padded to 2 characters (`20`, `04`). Non-numeric → used verbatim (`04.5`). Padding is mandatory: it preserves existing `?n=19` permalinks |
| `d` | `toISOString().slice(0,10)`, UTC only |
| `lbl` | long month, e.g. `July 19, 2026`. Day is not zero-padded. Used by `session.html` |
| `lblShort` | 3-letter month, e.g. `Jul 19, 2026`. Used by `archive.html`. The two pages genuinely use different formats today |
| `f` | path relative to repo root, each segment `encodeURIComponent`-encoded, then `'` additionally replaced with `%27` |

The apostrophe rule exists because neither `encodeURI` nor `encodeURIComponent` escapes `'`, but the
existing hardcoded array does (`Session 04 — Life Isn%27t Faer-zress`). Both forms resolve
identically on raw.githubusercontent; encoding it anyway makes the §8 migration diff byte-identical
instead of merely equivalent.

### Test coverage

`build-sessions.test.mjs` runs on fixtures before the build, and must cover:

- a note with every optional key present, and one with none
- ⚠️ the UTC date regression: a note dated `2026-07-19` must emit `d: "2026-07-19"` when the runner
  is in a negative UTC offset
- unicode in filenames: em-dash, curly apostrophe, double spaces (`Session 09 —  Every Party...`)
- `session_number` as int, as zero-padded string, and as `"04.5"`
- duplicate `session_number` → throws, naming both files
- missing required key → throws, naming file and key
- malformed YAML → throws, naming the file
- `type` other than `session` → skipped silently, not an error
- `site_hidden: true` → excluded
- empty directory → throws

---

## 7. Component 3: site changes

Two files in `rectrixcaedere`, both under the MCP inline-push size limit. `app.js` is untouched.

### Shared loader, added to both files

```js
var ARC=[];
async function loadArc(){
  var r=await fetch(VR+'/site/sessions.json?t='+Date.now());
  if(!r.ok) throw new Error('sessions.json '+r.status);
  var j=await r.json();
  ARC=j.sessions||[];
  if(!ARC.length) throw new Error('sessions.json is empty');
}
```

The `?t=` cache-buster matches what `session.html` already does for note fetches, so CDN behavior is
proven rather than assumed.

### `sky-is-the-limit/session.html`

- Delete the 20-line `var ARC=[...]` literal, insert the loader.
- `init()` is already `async`. Prepend:
  ```js
  try{ await loadArc(); }
  catch(e){ document.getElementById('body').innerHTML='<div class="err">Failed to load the session index. <a href="/sky-is-the-limit/archive.html">Back to The Descent</a></div>'; return; }
  ```
- Uses `lbl` (long form). No other change.

### `sky-is-the-limit/archive.html`

- Delete the `var ARC=[...]` literal, insert the loader.
- `build()` is synchronous and the file ends with four bare calls. Wrap them:
  ```js
  (async function(){
    try{ await loadArc(); }
    catch(e){ document.getElementById('descent').innerHTML='<div class="err">Failed to load the session index.</div>'; return; }
    build(); onScroll(); tallies();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll,{passive:true});
  })();
  ```
- Switch the card's date to `lblShort`.
- ⚠️ **Bug fix required.** `build()` renders `esc(s.r)` unguarded while every sibling field is
  guarded. A note without `site_region` would print the literal string `undefined` on the card.
  Change to `esc(s.r||'')`.

Neither page may render a blank screen on fetch failure. Both get an explicit error card.

---

## 8. Migration and the lossless gate

S01 through S19's editorial fields already exist, inside the current `archive.html` array. Migration
is a one-time scripted lift of `r` / `arc` / `wp` / `ev` from `archive.html` and `rec` / `fin` from
`session.html` into each note's frontmatter.

S20's fields are already written and YAML-validated as of 2026-08-01.

**The gate:** the generated `sessions.json` must reproduce the current hardcoded arrays
field-for-field for S01 through S19. A throwaway diff script compares generated output against the
arrays parsed out of today's HTML and prints any mismatch.

The hardcoded arrays are not deleted until that diff is clean and Taylor has seen it. A dirty diff
means the migration is not finished, not that the diff should be relaxed.

## 9. Verification plan

Each step must actually be observed, not assumed:

1. `npm test` in `site/` passes, including the UTC date regression.
2. `node site/build-sessions.mjs` locally produces 20 sessions, S01 through S20.
3. The §8 diff against the live arrays is clean for S01 through S19.
4. Push a trivial edit to a session note; confirm the Action runs and commits `sessions.json`.
5. Break a note's frontmatter on a branch on purpose; confirm the Action fails, names the file, and
   commits nothing.
6. Load `archive.html` and confirm Session 20's card and its four event bullets render.
7. Load `session.html?n=20` and confirm the note body, the prev/next nav, and the roll pills.
8. Confirm `session.html?n=19` still resolves, proving permalinks survived.
9. Load with the network blocked and confirm the error card appears instead of a blank page.

## 10. Failure modes

| Failure | Result | Visibility |
|---|---|---|
| Bad frontmatter | Action fails, nothing committed, last good manifest stays live | red X, email |
| `sessions.json` fetch fails | error card on the page | visible to visitors |
| Manifest present but empty | loader throws, error card | visible to visitors |
| Note pushed while Obsidian is closed | delayed until Obsidian next opens | none, self-heals |
| Action commit races a local edit | Obsidian Git rebases on next pull | none |

## 11. Out of scope

- **Other three campaigns.** Ashfall uses `session:` / `date:` / `party-level:`, WTFF uses
  `session_number:` as a string plus extra keys, P&P differs again. Rolling out needs a
  frontmatter normalization pass per vault first. The generator is campaign-agnostic apart from key
  names; prefer normalizing the notes to one schema over adding a per-vault key map.
- **`app.js`** and the six dashboard pages. Untouched.
- **S20's `site_recording`.** Deliberately omitted. The note records ~169 minutes of audio, but
  whether the file was uploaded to the R2 bucket is unconfirmed, and a `rec` pointing at a missing
  object breaks the player. The card hides itself when the key is absent. Add it once the upload is
  verified.

## 12. Known risk accepted

`site_events` publishes to the archive's front page with no review step. Whatever the pipeline writes
there is immediately public. Accepted deliberately: the alternative was LLM-generated prose, which
has the same exposure plus non-determinism.
