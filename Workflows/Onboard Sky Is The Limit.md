Onboard Sky Is The Limit onto the rectrixcaedere site, modeled on the existing pacts-and-power/session.html + archive.html. Create sky-is-the-limit/session.html and sky-is-the-limit/archive.html.
Data wiring: vault = sitl_vault (raw base https://raw.githubusercontent.com/TheLittlestAskew/sitl_vault/main); Supabase roll-view = sitl_session_rolls (already exists; same anon key/URL as PP).
Build the ARC manifest from the 15 notes in sitl_vault/01-Sessions/ (Session NN — Title.md): read each note's frontmatter for session, date, and title; use the exact filename for the fetch path. SITL is ongoing, so no finale flag.
Adapt for SITL's leaner template (it differs from PP's):

POV hero band is titled "Things We Learned In The Dark", POV character is Kit. Match the ## Character POV Journal — Kit Aluri heading (PP looks for "POV Overview") and strip the "See full journal entry in .docx…" boilerplate, showing the summary.
Auto-hide any card whose section is empty — SITL notes have no Quote Board, Profanity, Themes, Scene/Timeline, Patterns, or Continuity, so those cards should not render at all (rather than showing "—").
NPC table is 4 columns — pick the status cell by matching the "Status" header instead of a fixed column index.
For archive.html, drop PP's "Early Campaign / Lost Sessions" era and the 72/16/~35 stat bar (those are PP lore); SITL's archive is just its session timeline + a simple stat bar (session count + date range).

Then commit/push, and confirm the page loads for ?n=01 and the newest session.