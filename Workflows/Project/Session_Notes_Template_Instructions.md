# SESSION NOTES TEMPLATE — GENERATOR SCRIPT

The file `sitl_v8.js` is the canonical template generator for all SITL session notes. It is a Node.js script using the `docx` npm library. When generating session notes as a `.docx` file, this script defines all styling — do not invent or approximate styles from memory.

**File location:** Project outputs / project source files — `sitl_v8.js`

**To use this script as the styling foundation for session notes:**
1. Read `sitl_v8.js` from the project files at the start of any session notes generation task
2. Copy all constants, helper functions, and cell builders from the script exactly as written — `C` (color palette), `F` (font/size constants), `sectionHeader()`, `subHeader()`, `creamBlock()`, `goldBodyPara()`, `thCell()`, `tdCell()`, `mlCell()`, `mvCell()`, `mkTable()`, `mkMetaTable()`, `sectionDivider()`, `body()`, `bullet()`, `sp()`
3. Build the session content using those exact functions — do not hardcode any colors, font names, or sizes inline
4. After generating the `.docx` with `Packer.toBuffer()`, always run the `fix_tbl_borders` post-processing step to strip invalid `w:left`/`w:right` from `<w:tblBorders>` blocks, then repack with `pack.py --original`
5. Validate with `validate.py` before delivering

**The fix_tbl_borders function (required post-processing):**
```python
import re

def fix_tbl_borders(xml):
    def replacer(m):
        block = m.group(0)
        block = re.sub(r'\s*<w:left[^/]*/>\s*', '\n          ', block)
        block = re.sub(r'\s*<w:right[^/]*/>\s*', '\n          ', block)
        return block
    return re.sub(r'<w:tblBorders>.*?</w:tblBorders>', replacer, xml, flags=re.DOTALL)
```

**Key design rules encoded in the script (do not override):**
- Section headers: blank spacer row between the filled text paragraph and the colored rule line — the rule lives on the spacer, not on the fill paragraph. Same applies to subheaders and cream blocks.
- POV journal body and quote body paragraphs: no fill, gold `#D4A843` left border 2.25pt (`size: 18`), `#1E2F6B` text, 9pt Aptos regular — these sit *below* the cream block's rule line
- Quote "Repeat this block" paragraph: `#E8ECF8` fill + gold left border
- All table borders are white (`#FFFFFF`) — no visible grid lines
- No header or footer on any page
