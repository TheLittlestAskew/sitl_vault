const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  LevelFormat
} = require('docx');
const fs = require('fs');

// ─── FONT NOTE ───────────────────────────────────────────────────
// Aptos is specified. docx-js embeds font names as strings; Word will
// resolve "Aptos" if installed, otherwise falls back to the theme body font.
// "Semi-Bold" has no separate slot in OpenXML — we use bold:true which
// maps to the Bold weight. If Word shows full Bold instead of Semi-Bold,
// the user can manually adjust the weight via Format > Font.
const F = {
  body:     "Aptos",   // Falls back to Arial if Aptos not installed
  bold:     "Aptos",
  expand3:  60,   // 3pt character spacing = 60 twentieths-of-a-point
  // Sizes in half-points (docx unit = pt * 2)
  szBody:   18,   // 9pt  — all body text, table cells, placeholders
  szSub:    20,   // 10pt — sub headers, cream headers, subtitle line
  szSection:24,   // 12pt — section chapter headers
  szTitle:  48,   // 24pt — session title (kept large, proportional)
};

// ─── PALETTE ────────────────────────────────────────────────────
const C = {
  // Title
  titleText:      "263D7E",

  // Section Header (dusty rose — back to D7C9D6)
  sectionFill:    "D7C9D6",
  sectionText:    "1E2F6B",
  sectionRule:    "F08479",

  // Sub Header (periwinkle fill)
  subFill:        "E4E7F4",
  subText:        "3552A2",
  subRule:        "3552A2",

  // Cream inline blocks (memoir title line + quote entry block)
  creamFill:      "F3E7CD",
  creamText:      "1E2F6B",
  creamRule:      "D4A843",

  // Metadata table
  metaLabelFill:  "3552A2",
  metaLabelText:  "FFFFFF",
  metaValueFill:  "C5CFED",
  metaValueText:  "1A2962",

  // All other tables
  tableHeaderFill:"3552A2",
  tableHeaderText:"FFFFFF",
  evenRow:        "E8ECF8",
  oddRow:         "C5CFED",
  tableBodyText:  "1A2962",

  // General
  bodyText:       "1A2962",
  mutedText:      "4A5578",
  subtitleText:   "E8ECF8",
  journalText:    "1E2F6B",
  quoteNameText:  "1E2F6B",
  endText:        "8A90C7",
  gold:           "D4A843",
  lavender:       "9BA8D8",
  white:          "FFFFFF",
};

// ─── BORDERS ────────────────────────────────────────────────────
const noBorder    = { style: BorderStyle.NONE,   size: 0, color: "FFFFFF" };
const whiteBorder = { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" };
const allWhite    = { top: whiteBorder, bottom: whiteBorder, left: whiteBorder, right: whiteBorder };
const noTblBorders = { top: noBorder, bottom: noBorder, insideH: noBorder, insideV: noBorder };

const TW = 9360;

// ─── PRIMITIVES ─────────────────────────────────────────────────
function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [] });
}

function sectionDivider() {
  return [
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.lavender, space: 1 } },
      spacing: { before: 360, after: 0 },
      children: []
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.subRule, space: 1 } },
      spacing: { before: 60, after: 240 },
      children: []
    }),
  ];
}

// Section chapter header — dusty rose fill, deep navy Aptos bold, coral bottom rule
function sectionHeader(text) {
  return [
    new Paragraph({
      shading: { fill: C.sectionFill, type: ShadingType.CLEAR },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({
        text: text.toUpperCase(),
        font: F.bold, size: 24, bold: true,
        color: C.sectionText, characterSpacing: 80
      })]
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.sectionRule, space: 1 } },
      spacing: { before: 80, after: 0 },
      children: []
    }),
  ];
}

// Sub header — periwinkle fill, navy Aptos Semi-Bold, 3pt expanded, navy left+bottom rule
// Used for ALL section labels including "Kit Aluri POV" and "Quote Board"
function subHeader(text) {
  return [
    new Paragraph({
      shading: { fill: C.subFill, type: ShadingType.CLEAR },
      border: {
        left: { style: BorderStyle.SINGLE, size: 18, color: C.subRule, space: 6 },
      },
      spacing: { before: 200, after: 0 },
      indent: { left: 120 },
      children: [new TextRun({
        text: text.toUpperCase(),
        font: F.bold, size: F.szSub, bold: true,
        color: C.subText, characterSpacing: F.expand3
      })]
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: C.subRule, space: 1 } },
      spacing: { before: 80, after: 0 },
      children: []
    }),
  ];
}

// Cream inline block — used for the memoir title line and the quote entry block
// Aptos Semi-Bold, 3pt expanded, cream fill, deep navy text, gold left+bottom rule
function creamBlock(children) {
  return [
    new Paragraph({
      shading: { fill: C.creamFill, type: ShadingType.CLEAR },
      border: {
        left: { style: BorderStyle.SINGLE, size: 18, color: C.creamRule, space: 6 },
      },
      spacing: { before: 120, after: 0 },
      indent: { left: 200 },
      children
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: C.creamRule, space: 1 } },
      spacing: { before: 80, after: 0 },
      children: []
    }),
  ];
}

function placeholder(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({
      text: `[${text}]`,
      font: F.body, size: F.szBody,
      color: C.mutedText, italics: true
    })]
  });
}

// ─── TABLE CELLS ────────────────────────────────────────────────
function thCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: allWhite,
    shading: { fill: C.tableHeaderFill, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text, font: F.bold, size: F.szBody, bold: true, color: C.tableHeaderText })]
    })]
  });
}

function tdCell(text, width, opts = {}) {
  const fill = opts.combat ? "1E2F6B" : (opts.alt ? C.oddRow : C.evenRow);
  const textColor = opts.combat ? "C8E8F5" : C.tableBodyText;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: allWhite,
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    verticalAlign: VerticalAlign.TOP,
    children: [new Paragraph({
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text, font: F.body, size: F.szBody, color: textColor })]
    })]
  });
}

function metaLabelCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: allWhite,
    shading: { fill: C.metaLabelFill, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [new Paragraph({
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text, font: F.bold, size: F.szBody, bold: true, color: C.metaLabelText })]
    })]
  });
}

function metaValueCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: allWhite,
    shading: { fill: C.metaValueFill, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [new Paragraph({
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text, font: F.body, size: F.szBody, color: C.metaValueText })]
    })]
  });
}

// ─── TABLE FACTORIES ────────────────────────────────────────────
function buildTable(cols, rowCount) {
  const emptyRows = Array.from({ length: rowCount }, (_, i) =>
    new TableRow({ children: cols.map(c => tdCell("", c.w, { alt: i % 2 === 1 })) })
  );
  return new Table({
    width: { size: TW, type: WidthType.DXA },
    columnWidths: cols.map(c => c.w),
    borders: noTblBorders,
    rows: [
      new TableRow({ tableHeader: true, children: cols.map(c => thCell(c.label, c.w)) }),
      ...emptyRows
    ]
  });
}

function metadataTable() {
  const lw = 2400, rw = TW - lw;
  const rows = [
    ["Campaign",           '"Sky Is The Limit" Campaign'],
    ["Session Number",     "[##]"],
    ["Session Date",       "[MM/DD/YYYY]"],
    ["Start Location",     "[Location at start of session]"],
    ["End Location",       "[Location at end of session]"],
    ["Party Present",      "[PC Names / Notable NPCs present]"],
    ["Total Rolls Logged", "[#]"],
    ["Party Level",        "[Level # — note any level-ups this session]"],
    ["Spelling Checked",   "[Yes / No]"],
  ];
  return new Table({
    width: { size: TW, type: WidthType.DXA },
    columnWidths: [lw, rw],
    borders: noTblBorders,
    rows: rows.map(([label, val]) => new TableRow({
      children: [metaLabelCell(label, lw), metaValueCell(val, rw)]
    }))
  });
}

// ─── TITLE BLOCK ────────────────────────────────────────────────
function titleBlock() {
  return [
    spacer(200),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [new TextRun({
        text: "[Session Title]",
        font: F.bold, size: F.szTitle, bold: true,
        color: C.titleText
      })]
    }),
    new Paragraph({
      shading: { fill: C.subFill, type: ShadingType.CLEAR },
      border: {
        left: { style: BorderStyle.SINGLE, size: 18, color: C.subRule, space: 6 },
      },
      spacing: { before: 0, after: 0 },
      indent: { left: 120 },
      children: [
        new TextRun({ text: "Session ##  ·  [MM/DD/YYYY]  ·  Out of the Abyss", font: F.bold, size: F.szSub, bold: true, color: C.subText, characterSpacing: F.expand3 }),
      ]
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: C.subRule, space: 1 } },
      spacing: { before: 80, after: 0 },
      children: []
    }),
    spacer(280),
  ];
}

// ─── SECTIONS ───────────────────────────────────────────────────
function sectionMetadata() {
  return [
    ...sectionHeader("Section 1 — Session Metadata"),
    spacer(160),
    metadataTable(),
    ...sectionDivider(),
  ];
}

function sectionPOV() {
  return [
    ...sectionHeader("Section 2 — Character POV Journal"),
    spacer(80),
    // Regular subheader style
    ...subHeader("Kit Aluri — In-Character Journal Entry"),
    spacer(60),
    placeholder("Archivist instruction: Write in Kit's first-person voice. Pragmatic, survivor-oriented, tactical. Capture emotional arcs, shifting loyalties, sarcasm, and growth. All events must be factually accurate to the session. HARD EXCLUSIONS: no OOC speech, no player names, no session/campaign name references, no mechanical language (+1, bonus, AC, spell slot, attuned as mechanic), no dice results as numbers, no above-table information. TEST — could Kit know this from inside the story?"),
    spacer(60),
    // Cream block: memoir title only
    ...creamBlock([
      new TextRun({
        text: "THE THINGS WE CARRIED IN THE DARK: A SOLDIER'S MEMOIR",
        font: F.bold, size: F.szSub, bold: true,
        color: C.creamText, characterSpacing: F.expand3
      }),
    ]),
    // Day line — below the gold rule, no fill, gold left border
    new Paragraph({
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: C.gold, space: 8 } },
      spacing: { before: 80, after: 0 },
      indent: { left: 200 },
      children: [new TextRun({
        text: "Day ___:  ",
        font: F.bold, size: F.szBody, bold: true, color: "1E2F6B"
      })]
    }),
    // Journal entry placeholder — no fill, gold left border, italic
    new Paragraph({
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: C.gold, space: 8 } },
      spacing: { before: 40, after: 80 },
      indent: { left: 200 },
      children: [new TextRun({
        text: "[Kit's journal entry begins here...]",
        font: F.body, size: F.szBody, italics: true, color: "1E2F6B"
      })]
    }),
    ...sectionDivider(),
  ];
}

function sectionAnalysis() {
  return [
    ...sectionHeader("Section 3 — Session Analysis"),
    spacer(160),

    ...subHeader("Narrative Summary"),
    placeholder("All plot developments, equally weighted — no chronological bias. Note split sessions, absent players. Include player-added flavor, vivid action descriptions, table jokes/culture."),
    spacer(160),

    ...subHeader("Session Setting"),
    placeholder("Starting location and circumstances. In-game days elapsed since campaign start, if known."),
    spacer(160),

    ...subHeader("Locations Visited"),
    spacer(80),
    buildTable([
      { label: "Location",        w: 2800 },
      { label: "Description",     w: 3660 },
      { label: "Notable Details", w: 2900 },
    ], 4),
    spacer(160),

    ...subHeader("Quests / Objectives"),
    placeholder("Running thread list with parent and sub-threads. Mark 'Completed (This Session)' when resolved. Include open mysteries, political fallout, unresolved storylines."),
    spacer(160),

    ...subHeader("Scene / Timeline Breakdown"),
    placeholder("Chronological bullet-per-scene breakdown. Format: Scene #: [Name]. 1–3 sentence summary. Target ~10 scenes, add/remove as needed."),
    spacer(160),

    ...subHeader("Themes & Emotional Beats"),
    placeholder("Recurring motifs, emotional arcs, symbolic elements. Document dream sequences for implied themes but do not assert unconfirmed meanings."),
    ...sectionDivider(),
  ];
}

function sectionCharacterActivity() {
  return [
    ...sectionHeader("Section 4 — Character Activity"),
    spacer(160),

    ...subHeader("Party Structure & Subgroups"),
    spacer(80),
    buildTable([
      { label: "Location",           w: 2100 },
      { label: "Characters Present", w: 2500 },
      { label: "Objective",          w: 2900 },
      { label: "Status",             w: 1860 },
    ], 4),
    spacer(160),

    ...subHeader("NPCs"),
    spacer(80),
    buildTable([
      { label: "Name",                w: 1100 },
      { label: "Race / Class",        w: 1260 },
      { label: "Affiliations",        w: 1500 },
      { label: "Last Interaction",    w: 1900 },
      { label: "Last Known Location", w: 1700 },
      { label: "Status",              w:  900 },
    ], 5),
    spacer(160),

    ...subHeader("Reputation & Relationships"),
    placeholder("Evolving faction standings, shifting alliances and rivalries, internal party dynamics. Note any changes from previous session."),
    ...sectionDivider(),
  ];
}

function sectionArtifacts() {
  return [
    ...sectionHeader("Section 5 — Artifacts"),
    spacer(160),

    ...subHeader("Loot & Items"),
    spacer(80),
    buildTable([
      { label: "Character / Owner", w: 2400 },
      { label: "Item / Artifact",   w: 4160 },
      { label: "State / Context",   w: 2800 },
    ], 5),
    ...sectionDivider(),
  ];
}

function sectionLogs() {
  const initCols = [
    { label: "Character / Creature", w: 3200 },
    { label: "Initiative Roll",      w: 2480 },
    { label: "Turn Order",           w: 3680 },
  ];
  return [
    ...sectionHeader("Section 6 — Logs"),
    spacer(160),

    ...subHeader("Encounters"),
    spacer(80),
    buildTable([
      { label: "Enemies",        w: 2100 },
      { label: "Location",       w: 1800 },
      { label: "Party / Allies", w: 2200 },
      { label: "Trigger",        w: 1660 },
      { label: "Outcome",        w: 1600 },
    ], 4),
    spacer(160),

    ...subHeader("Initiative"),
    spacer(60),
    new Paragraph({
      spacing: { before: 60, after: 80 },
      children: [new TextRun({ text: "Combat 1 — [Name / Location]", font: F.bold, size: F.szSub, bold: true, italics: true, color: C.mutedText })]
    }),
    buildTable(initCols, 7),
    spacer(100),
    new Paragraph({
      spacing: { before: 60, after: 80 },
      children: [new TextRun({ text: "Combat 2 — [Add / remove tables per session]", font: F.bold, size: F.szSub, bold: true, italics: true, color: C.mutedText })]
    }),
    buildTable(initCols, 7),
    spacer(160),

    ...subHeader("Encounter Summary"),
    placeholder("Narrative summary of each combat: mechanical outcome + story implications. What changed?"),
    spacer(160),

    ...subHeader("Full Roll Log"),
    spacer(60),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [new TextRun({
        text: "Rows shaded in deep navy = combat / initiative rolls.  Source: D&D Beyond roll log filtered to this session date.",
        font: F.body, size: F.szBody, italics: true, color: C.mutedText
      })]
    }),
    buildTable([
      { label: "Character / NPC",   w: 1600 },
      { label: "Roll / Check",      w: 2000 },
      { label: "Result",            w:  960 },
      { label: "Context / Outcome", w: 4800 },
    ], 10),
    ...sectionDivider(),
  ];
}

function sectionQuotes() {
  return [
    ...sectionHeader("Section 7 — Quotes & Language"),
    spacer(160),

    // Regular subheader style
    ...subHeader("Quote Board"),
    spacer(60),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [new TextRun({
        text: "VERBATIM ONLY — no paraphrasing.  Tag each entry:  [Funny]  [Poignant]  [DM Quip]  [Banter]  [Serious]",
        font: F.body, size: F.szBody, italics: true, color: C.mutedText
      })]
    }),
    // Cream block: character name + tag on line 1, verbatim quote on line 2
    ...creamBlock([
      new TextRun({
        text: "[CHARACTER NAME]  ·  [Tag]",
        font: F.bold, size: F.szSub, bold: true,
        color: C.creamText, characterSpacing: F.expand3
      }),
      new TextRun({ break: 1 }),
      new TextRun({
        text: '"[Verbatim quote from transcript]"',
        font: F.body, size: F.szBody, italics: true,
        color: C.creamText
      }),
    ]),
    // Repeat instruction — light grey fill, gold left border, italic
    new Paragraph({
      shading: { fill: "E8ECF8", type: ShadingType.CLEAR },
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: C.gold, space: 8 } },
      spacing: { before: 60, after: 80 },
      indent: { left: 200 },
      children: [new TextRun({
        text: "[Repeat this block for each quote. Add as many as needed.]",
        font: F.body, size: F.szBody, italics: true, color: C.mutedText
      })]
    }),
    spacer(160),

    ...subHeader("Profanity Record"),
    spacer(80),
    buildTable([
      { label: "Speaker",    w: 1800 },
      { label: "Curse Word", w: 2200 },
      { label: "Frequency",  w: 1400 },
      { label: "Context",    w: 3960 },
    ], 5),
    spacer(160),

    ...subHeader("Alternate Title Options"),
    spacer(80),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [new TextRun({
        text: "5 options required. One per type. Record final chosen title below once confirmed.",
        font: F.body, size: F.szBody, italics: true, color: C.mutedText
      })]
    }),
    buildTable([
      { label: "Type",           w: 1800 },
      { label: "Proposed Title", w: 7560 },
    ], 5),
    spacer(120),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.subRule, space: 4 } },
      spacing: { before: 0, after: 100 },
      children: [
        new TextRun({ text: "FINAL CHOSEN TITLE:   ", font: F.bold, size: F.szSub, bold: true, color: C.sectionText }),
        new TextRun({ text: "[Confirmed by user]", font: F.body, size: F.szBody, italics: true, color: C.mutedText }),
      ]
    }),
    ...sectionDivider(),
  ];
}

function sectionArchivistNotes() {
  return [
    ...sectionHeader("Section 8 — Archivist Notes"),
    spacer(160),

    ...subHeader("Patterns, Progress & Future Implications"),
    placeholder("Tactical patterns, recurring motifs, character growth arcs, foreshadowing. Developing trends across sessions."),
    spacer(160),

    ...subHeader("Continuity Flags, Missing Info & Ambiguities"),
    placeholder("All noted ambiguities, continuity discrepancies, [inaudible] segments, transcript-only rolls (no matching DDB log entry), unresolved questions requiring user clarification."),
    spacer(80),
    buildTable([
      { label: "Flag Type",         w: 1800 },
      { label: "Description",       w: 4560 },
      { label: "Source / Location", w: 1800 },
      { label: "Resolution",        w: 1200 },
    ], 5),
    spacer(400),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.lavender, space: 8 } },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({
        text: "— END OF SESSION NOTES —",
        font: F.body, size: F.szBody, color: C.endText, italics: true, characterSpacing: 80
      })]
    }),
  ];
}

// ─── ASSEMBLE ────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 480, hanging: 280 } } }
      }]
    }]
  },
  styles: {
    default: {
      document: { run: { font: F.body, size: F.szBody, color: C.bodyText } }
    }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      }
    },
    children: [
      ...titleBlock(),
      ...sectionMetadata(),
      ...sectionPOV(),
      ...sectionAnalysis(),
      ...sectionCharacterActivity(),
      ...sectionArtifacts(),
      ...sectionLogs(),
      ...sectionQuotes(),
      ...sectionArchivistNotes(),
    ]
  }]
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync("/home/claude/SITL_v8.docx", b);
  console.log("Done.");
}).catch(e => { console.error(e); process.exit(1); });
