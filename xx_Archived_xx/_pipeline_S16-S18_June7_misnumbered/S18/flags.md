# S18 — Flags: Ambiguities & Attribution Issues (Phase A)

Nothing applied. These need human/DM input before correction or script-formatting in a later phase.

## 1. ⚠️ DUPLICATE SESSION / NUMBERING COLLISION — TOP PRIORITY, UNRESOLVED
The `18-060726_raw_transcript.md` content is **not a new session.** Evidence:
- `18-060726_raw_transcript.md` and `17-060726_raw_transcript.md` are **byte-identical except for one line** — the transcription timestamp header (`17` = transcribed 2026-06-08T22:41:37Z; `18` = transcribed 2026-06-10T16:19:11Z). Same 114,025 bytes, same 1966 lines, same MD5-distinguishing diff confined to line 2.
- A completed Phase A already exists at `_pipeline/S16/` for the **same content**; its `spellcheck.md` cites `16-060726_raw_transcript.md` — a file that **no longer exists** in `Raw_Unedited/` (only `17-` and `18-` remain).
- All three are dated **060726 (June 7, 2026)** and describe the identical play session (chuul fishing ambush, Sloopidoop, Derendil hold-person/sleep, June-21/Juneteenth close).

So the **same real-world session is filed under session numbers 16, 17, and 18.** This violates the project's "Sessions are delineated by real-world play date / No Session Contamination" rule.
**Action needed (human, not the archivist):** Decide the true session number for this play date and delete/retire the duplicate transcripts and pipeline folders. Do NOT generate notes for S18 as a distinct session until this is resolved. I have **not** resolved it (per instructions).

## 2. Speaker → identity mapping is inferred, not given
The transcript uses anonymized labels SPEAKER A–G. Mapping (inferred from context, rolls, and DM address):
- **SPEAKER A = Addison (DM)** — narration + all NPC voices.
- **SPEAKER B = Taylor / Kit** (invisibility scout recap, Hunter's Mark, Trip Attack, Action Surge, Orcish/Relentless Endurance).
- **SPEAKER C = Florian / Blarg** (Bless, Hold Person, Cure Wounds, Wild Shape; DM addresses him "Florian" at 1449, 1601; name rendered "Blarg/Blog/Block/Barg/blar").
- **SPEAKER D = Matt / Binks** (Guiding Bolt; the "real name" bit at 113–135, stated as "Ormix" at 127).
- **SPEAKER E = Hannah / Amanita** (Thorn Whip fishing, Chill Touch, Halo of Spores; DM calls her "Hannah" at 341 — was absent last session, present this one).
- **SPEAKER F = Sirius / Aeolus** (Eldritch Blast, Sleep; on mobile, accent, rolls relayed by others).
- **SPEAKER G = Austin / Darby** (arrives late ~1:06:40 "jet lagged, slept 11 hours"; Roxy gore; DM calls him "Austin" at 777, 1589).
**Action needed:** Confirm this mapping before any script-format pass.

## 3. NPC name vs. destination city — conflation risk
"Sloopidoop" (the kuo-toa **priest NPC** introduced this session) and "Sloobludop" (the **kuo-toa city** the party is heading to / the NPC's home village) sound nearly identical and the STT blurs them. Late-session tokens ("Slupada," "Slupadab," "Luplada"; 1891/1929) are the *village*; the introduction tokens (1315, 1431, 1661) are the *NPC*. Confirm line-by-line before applying.

## 4. Homebrew proper nouns — unverifiable, DM confirmation required
Not present in `Characters Associated with the Underdark.md` or `Core Forgotten Realms Underdark Regions and Locations.md`. Proposed at ≤60% or left unresolved:
- **Mind-flayer ally / Society of Brilliance colleague:** "Grazilax" (1313) / "Wazalax" (1315) / "Rasa Lax" (1891) — three spellings, one entity.
- **Derendil's claimed elven kingdom:** "Nel Rinden Vain" / "Nil Ren" / "Nell Wind in Vain" / "Nel Rinned in vain" (1797, 1805).
- **Evil wizard who cursed Derendil:** "Pterostor" (1805) / "terroristor" (1779).
- **Archfey patron** (Amanita/Aeolus; life-death "network"/cycle, "Silofirst"/"Silo Fear", 1853, 1873, 1875).
- **Binks's deity:** "Garl Glittergold" (from "Garled glitter gold," 29) — a real D&D gnome god, but absent from the supplied source files, so capped ≤60%.

## 5. Intentional jokes — do NOT auto-correct
- **"Early Binks"** (105) and **"Bing"** (113) — riffs during the real-name bit; Binks's stated real name is "Ormix" (127).
- **"Carl Glimmercald"** (1429) — Matt jokingly *guessing* the kuo-toa's god; not a real name, not a mishearing.
- **"Get over here" / "Mortal Kom[bat]"** (743–745) — a Mortal Kombat reference when Amanita uses Thorn Whip to drag the chuul; not a name.
- The varied "Snoopy Doop / super dupe / Flippy Dupe / slip-a-dude" renderings double as in-character mockery of the NPC's name — preserve the comedic beat even after normalizing the canonical name to Sloopidoop.

## 6. Kuo-toa "gillish" gibberish is intentional, not [inaudible]
Lines ~1431 ("blip doo boop," "Mother blip blib blib D") are the DM deliberately voicing untranslatable kuo-toa speech for the sea-mother deity's name (canonically **Blibdoolpoolp**, "the Sea Mother"). Do not mark inaudible or "fix"; the gurgle is the joke. "the sea Mother" (1431, 1903) is already correct.

## 7. All NPC dialogue is delivered under SPEAKER A (the DM)
Per the attribution rule, NPC lines voiced by Addison must be re-attributed to the NPC (Sloopidoop, the chuul, Topsy/Turvy relayed by DM) during script-formatting — and flagged where genuinely ambiguous. Sloopidoop's many lines (1315–1925) are the main case.

## 8. Unclear / possibly garbled DM lines (mic issues per project note) — do NOT guess
- **"The Awoks"** (1669): "The Awoks quite a fascinating creature. I would love to study them further." Sloopidoop appears to mean **Roxy** (Darby's mushroom mount). "Awok" unexplained — possibly a creature/term mis-transcription. Roxy's own creature type is never stated.
- **"the piece of death"** (1043): likely **"the peace of death"** (killing Derendil ends the curse). Semantic, low confidence — not corrected.
- **"tools do not pack which isolationary"** (1401): garbled; intended sense unclear ("chuuls do not pack…"?).
- **"learn more of these oasis intentions"** (1363): "oasis" likely a mis-transcription (these creatures'/aberrations' intentions?).
- **"rock and attempt at birdie, perhaps back at the village"** (1673): likely "he'll attempt a **burial**…".
- **"the west of the booty of this kwicha"** (1673): "west" → "rest"; "kwicha" → "kuo-toa/creature".
- Mark these `[inaudible/cut off]` per the DM-audio-drop rule rather than inventing text.

## 9. Loot-item names/identities uncertain (for the later Logs/Loot phase)
Sloopidoop identifies recovered items in accented in-character speech: a **"lock of twickery"** (1911, → "Lock of Trickery"?), a **"rope of mending"** ("wope is a rope of mending," 1915), and a **"spell scroll of sand / spell squall"** (1919) called "first level." No standard 1st-level spell named "Sand" — confirm intended spell. Also: a pristine deadbolt lock (Kit, roll 37), a magically-enhanced rope (Darby, roll 64), a spell scroll (Florian, roll 70), 5 gems (~50 gp each, Amanita), plus a non-magical Kuo-toa trident (bone + Zurkhwood), Kuo-toa scale armor (teeth/shell), and a fishing net.

## 10. No transcriber [inaudible] markers present
Despite 95.5% stated confidence the transcriber inserted no `[inaudible]` tags. The low-clarity spots are item 8 above; none appear to be hard audio drops this session. Recording runs continuously 00:00:00 → 02:54:41.

## 11. Continuity datum — "Clementine" (225)
Aeolus lists open concerns: the spider-entity stalking Binks, an unset "safe word" for Aeolus's Darkness, and **"Clementine"** ("what are we doing about Clementine?"). No context in this session for who/what Clementine is. Flag for continuity / prior-session cross-check.

## 12. Madness/exhaustion bookkeeping stated mid-session (not a correction)
DM and Taylor reconcile current madness (361): cleared for Kit/Aeolus/Blarg (S10), Amanita (S5), Darby (S10); only **Binks** still has madness. Binks and Derendil each gain **1 level of exhaustion** this session. Recorded as a continuity datum for later phases.

## 13. Topsy & Turvy did not roll / were off-screen
T&T went to explore the left-hand cave while the party fished and **did not participate in the chuul combat** (1087–1099); they return near the end (1099, 1281–1305) and later stay back to guard Derendil (1759). Relevant to roll attribution: expect **no T&T rolls** for this session.
