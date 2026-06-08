// backfill_annotations.js
// Backfills annotation columns from the Excel "Master Rolls (Clean)" sheet into Supabase.
// Usage: node backfill_annotations.js "path/to/DnD_Annotation_MasterDataset_Expanded__1_.xlsx"
//
// Requires: npm install xlsx

const XLSX = require('xlsx');
const SUPABASE_URL = 'https://vtrtyagltwdrbastpppl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cnR5YWdsdHdkcmJhc3RwcHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTY5NTAsImV4cCI6MjA5MTkzMjk1MH0.hnpwjHGIqiUN_VmmIkOAAFGGCKsyYgl7AO3FW5vDIeM';

const CAMPAIGN_MAP = {
  'Pacts_Power': 2,
  'Sky_Is_The_Limit': 1,
  'Ashfall_Britannia': 3,
};

async function run() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node backfill_annotations.js <path-to-xlsx>');
    process.exit(1);
  }

  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets['Master Rolls (Clean)'];
  if (!ws) {
    console.error('Sheet "Master Rolls (Clean)" not found');
    process.exit(1);
  }

  const rows = XLSX.utils.sheet_to_json(ws);
  console.log(`Loaded ${rows.length} rows from Excel\n`);

  const updates = [];
  for (const row of rows) {
    const campaignId = CAMPAIGN_MAP[row.campaign];
    const rollId = row.rollId;
    if (!campaignId || !rollId) continue;

    const patch = {};

    // Annotation columns
    if (row.actions) patch.action_category = String(row.actions);
    if (row.rolltype) patch.roll_subtype = String(row.rolltype);
    if (row.ability) patch.ability = String(row.ability);
    if (row.skill) patch.skill = String(row.skill);
    if (row.spell) patch.spell = String(row.spell);
    if (row.weapon) patch.weapon = String(row.weapon);
    if (row.feat) patch.feat = String(row.feat);
    if (row.item) patch.item = String(row.item);
    if (row.damage) patch.damage_type = String(row.damage);
    if (row.dice) patch.dice_type = String(row.dice);
    if (row.dicecount != null && !isNaN(row.dicecount)) patch.dice_count = Number(row.dicecount);

    // Detail (keep existing values like "Eldritch Maul", "Amethyst Dragon")
    if (row.detail) patch.detail = String(row.detail);

    // nat20/nat1 → boolean columns
    if (row.nat20_nat1 === 'nat20') {
      patch.is_nat_20 = true;
      patch.is_nat_1 = false;
    } else if (row.nat20_nat1 === 'nat1') {
      patch.is_nat_20 = false;
      patch.is_nat_1 = true;
    } else if (row.nat20_nat1 === 'normal') {
      patch.is_nat_20 = false;
      patch.is_nat_1 = false;
    }
    // If nat20_nat1 is null (non-d20 rolls), leave the booleans as null

    if (Object.keys(patch).length === 0) continue;
    updates.push({ campaignId, rollId, patch });
  }

  console.log(`${updates.length} rows to backfill\n`);

  let success = 0;
  let fail = 0;
  let failedRows = [];
  const BATCH = 50;

  for (let i = 0; i < updates.length; i += BATCH) {
    const batch = updates.slice(i, i + BATCH);

    const promises = batch.map(({ campaignId, rollId, patch }) => {
      const url = `${SUPABASE_URL}/rest/v1/ddb_rolls?campaign_id=eq.${campaignId}&roll_id=eq.${encodeURIComponent(rollId)}`;
      return fetch(url, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(patch),
      }).then(async res => {
        if (res.ok) { success++; }
        else {
          fail++;
          const err = await res.text().catch(() => '');
          failedRows.push({ rollId, campaignId, status: res.status, err });
        }
      }).catch(err => {
        fail++;
        failedRows.push({ rollId, campaignId, err: err.message });
      });
    });

    await Promise.all(promises);

    const progress = Math.min(i + BATCH, updates.length);
    if (progress % 500 === 0 || progress >= updates.length) {
      const pct = Math.round((progress / updates.length) * 100);
      console.log(`  ${progress}/${updates.length} (${pct}%) — ${success} ok, ${fail} fail`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n${'═'.repeat(40)}`);
  console.log(`Done! ${success} updated, ${fail} failed.`);
  if (failedRows.length > 0) {
    console.log(`\nFailed rows (first 10):`);
    failedRows.slice(0, 10).forEach(r => console.log(`  roll_id=${r.rollId} campaign=${r.campaignId} — ${r.err}`));
  }
}

run().catch(console.error);
