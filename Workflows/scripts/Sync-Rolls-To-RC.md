# Sync-Rolls-To-RC — copy new rolls from Aftermath Meridian to the RC site's database

> **Why this exists (2026-07-16):** the DDB roll-sync extension was migrated to the
> Aftermath Meridian Supabase project (`drtvlcgyjlofaffbwael`, table `rolls`) around
> 2026-06-15. Nothing writes to the Rectrix_Caedere project (`vtrtyagltwdrbastpppl`,
> table `ddb_rolls`) anymore — but the public RC site and the SITL archivist both read
> from there (via the `sitl_session_rolls` VIEW over `ddb_rolls`). Until the two are
> unified, run a copy **after each session, for every campaign** (2026-07-17: the gap
> hit Ashfall and P&P too, not just SITL).
>
> **PREFERRED TOOL — the legacy console script** `Workflows/scripts/ddb_sync_supabase.js`
> (the pre-Meridian ritual): grab a Bearer token from DevTools on dndbeyond.com, paste
> the script in the browser console, `await syncAllCampaigns('TOKEN')`. It pulls straight
> from DDB's game-log API for ALL campaigns, upserts on the same unique key, and fills
> the enrichment columns (`is_nat_20`, `is_nat_1`, `dice_type`, …) that the MCP copy
> below leaves NULL. Its upsert (`resolution=merge-duplicates`) will also enrich rows
> this MCP copy inserted earlier. ⚠️ Do NOT load the neighboring `Workflows/ddb-roll-sync/`
> Chrome extension — that's the security-flagged legacy extension; console script only.
>
> **FALLBACK — the MCP copy below** (no DDB token needed, run in Claude Code via the
> `supabase-aftermath-meridian` and `supabase-cutter` MCP connections). No credentials
> in this file. Idempotent: unique key `(campaign_id, roll_id, roll_type, dice_notation)`
> + `ON CONFLICT DO NOTHING`. Campaign ids in BOTH databases: 1 = Sky Is The Limit,
> 2 = Pacts & Power, 3 = Ashfall Britannia, 4 = WtFF/Where the Flowers (RC "Where the
> Flowers Forget"). Limitation: leaves enrichment columns NULL (the SITL site view
> doesn't expose them, so SITL pages are unaffected).

## Step 1 — get the RC-side high-water mark (supabase-cutter → vtrtyagltwdrbastpppl)

```sql
select coalesce(max(timestamp_unix), 0) as cutoff
from ddb_rolls where campaign_id = 1;  -- 1 = Sky Is The Limit
```

## Step 2 — pull newer rolls from Meridian (supabase-aftermath-meridian → drtvlcgyjlofaffbwael)

```sql
select json_agg(json_build_array(
  r.timestamp_iso, r.timestamp_unix, r."character", r.ddb_user_id,
  r.action, r.roll_type, r.roll_kind, r.dice_notation, r.modifier, r.total,
  case when jsonb_typeof(r.individual_values)='string'
       then r.individual_values #>> '{}' else r.individual_values::text end,
  r.source, r.roll_id
))::text
from rolls r join campaigns c on c.id = r.campaign_id
where c.name = 'Sky Is The Limit' and r.timestamp_unix > <CUTOFF FROM STEP 1>;
```

⚠️ Meridian stores `individual_values` as a jsonb **string** (`"[1]"`); the CASE above
normalizes it to array text either way. RC's `ddb_rolls` wants a real jsonb array.

## Step 3 — insert into RC (supabase-cutter → vtrtyagltwdrbastpppl)

Paste the JSON array from Step 2 in place of `<JSON>`:

```sql
insert into ddb_rolls (campaign_id, timestamp_iso, timestamp_unix, "character", user_id,
  action, roll_type, roll_kind, dice_notation, modifier, total, individual_values, source, roll_id)
select 1, (r->>0)::timestamptz, (r->>1)::bigint, r->>2, (r->>3)::bigint,
  r->>4, r->>5, r->>6, r->>7, (r->>8)::int, (r->>9)::int, (r->>10)::jsonb, r->>11, r->>12
from jsonb_array_elements($j$<JSON>$j$::jsonb) r
on conflict (campaign_id, roll_id, roll_type, dice_notation) do nothing;
```

Note the column order here is 13 elements (no session_date — the `sitl_session_rolls`
VIEW derives it from `timestamp_iso` in America/New_York).

## Step 4 — register the session (supabase-cutter)

```sql
insert into ddb_sessions (campaign_id, session_no, session_date, title, source)
select 1, <N>, '<YYYY-MM-DD>', '<Title>', 'vault-sync'
where not exists (select 1 from ddb_sessions where campaign_id = 1 and session_no = <N>);
```

## Step 5 — verify counts match

Per-day `count(*)` + `sum(total)` on both sides must agree (remember: RC view dates are
**Eastern time**, Meridian query dates are UTC — late-evening UTC rolls fold into the
prior ET day).

```sql
-- cutter
select session_date, count(*), sum(total) from sitl_session_rolls
where session_date = '<session date>' group by session_date;
```

## Long-term (decision pending — Tayls)

Options to retire this manual step: (a) the legacy console script above (the old ritual,
~5 min, best data); (b) this MCP runbook (~2 min, no token, unenriched); (c) point the
RC site at a public read-only view in Meridian (schema change, gated by aftermath-atlas
SECURITY.md); (d) Meridian Edge Function on a cron with the RC service key in secrets
(credentials cross-project). Last synced: 2026-07-17 — SITL backfilled 2026-07-16
(82 rolls, S19 = ddb_sessions id 20); Ashfall (151: Jun 23 + Jun 30) and P&P (1: Jun 23)
backfilled 2026-07-17, checksum-verified both sides.
