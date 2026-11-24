import os
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideV w:val="none"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_formatted_runs(paragraph, text, base_font_name="Calibri", base_font_size=11, base_color=RGBColor(30, 41, 59)):
    # Regex to handle bold, italic, inline code, and links
    # Patterns: `code`, **bold**, *italic*, [link text](url)
    tokens = re.split(r'(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))', text)
    for token in tokens:
        if not token:
            continue
        run = paragraph.add_run()
        run.font.name = base_font_name
        run.font.size = Pt(base_font_size)
        run.font.color.rgb = base_color

        if token.startswith('`') and token.endswith('`'):
            run.text = token[1:-1]
            run.font.name = "Consolas"
            run.font.size = Pt(base_font_size - 1)
            run.font.color.rgb = RGBColor(15, 23, 42)
            # Add highlight/light shade if possible
        elif token.startswith('**') and token.endswith('**'):
            run.text = token[2:-2]
            run.bold = True
        elif token.startswith('*') and token.endswith('*'):
            run.text = token[1:-1]
            run.italic = True
        elif token.startswith('[') and ']' in token and '(' in token and token.endswith(')'):
            match = re.match(r'\[([^\]]+)\]\(([^)]+)\)', token)
            if match:
                run.text = match.group(1)
                run.font.color.rgb = RGBColor(37, 99, 235)
                run.underline = True
            else:
                run.text = token
        else:
            run.text = token

def convert_markdown_to_docx(md_path, docx_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    doc = Document()

    # Set Margins
    for section in doc.sections:
        section.top_margin = Inches(0.9)
        section.bottom_margin = Inches(0.9)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)

    i = 0
    total_lines = len(lines)
    in_code_block = False
    code_lines = []

    while i < total_lines:
        line = lines[i].rstrip('\r\n')

        # Code block handler
        if line.strip().startswith('```'):
            if in_code_block:
                # End of code block
                in_code_block = False
                code_text = "\n".join(code_lines)
                table = doc.add_table(rows=1, cols=1)
                table.alignment = WD_TABLE_ALIGNMENT.CENTER
                cell = table.cell(0, 0)
                set_cell_background(cell, "F1F5F9")
                set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
                
                # Set table borders for code block
                tblPr = table._tbl.tblPr
                borders = parse_xml(
                    f'<w:tblBorders {nsdecls("w")}>'
                    f'  <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
                    f'  <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
                    f'  <w:left w:val="single" w:sz="18" w:space="0" w:color="3B82F6"/>'
                    f'  <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
                    f'</w:tblBorders>'
                )
                tblPr.append(borders)

                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.05
                run = p.add_run(code_text)
                run.font.name = "Consolas"
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(15, 23, 42)

                doc.add_paragraph().paragraph_format.space_after = Pt(4)
                code_lines = []
            else:
                in_code_block = True
                code_lines = []
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Markdown Table handler
        if line.strip().startswith('|') and '|' in line.strip()[1:]:
            table_lines = []
            while i < total_lines and lines[i].strip().startswith('|'):
                table_lines.append(lines[i].strip())
                i += 1

            if len(table_lines) >= 2:
                # Parse headers and rows
                raw_headers = [c.strip() for c in table_lines[0].strip('|').split('|')]
                data_rows = []
                for row_line in table_lines[2:]:
                    cols = [c.strip() for c in row_line.strip('|').split('|')]
                    data_rows.append(cols)

                col_count = len(raw_headers)
                table = doc.add_table(rows=len(data_rows) + 1, cols=col_count)
                table.alignment = WD_TABLE_ALIGNMENT.CENTER
                set_table_borders(table, color="CBD5E1", sz="4")

                # Format Header Row
                hdr_cells = table.rows[0].cells
                for col_idx, h_text in enumerate(raw_headers):
                    cell = hdr_cells[col_idx]
                    set_cell_background(cell, "1E3A8A") # Navy Blue
                    set_cell_margins(cell, top=140, bottom=140, left=160, right=160)
                    p = cell.paragraphs[0]
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(2)
                    add_formatted_runs(p, h_text, base_font_name="Calibri", base_font_size=10.5, base_color=RGBColor(255, 255, 255))
                    p.runs[0].bold = True

                # Format Data Rows
                for row_idx, row_data in enumerate(data_rows):
                    row_cells = table.rows[row_idx + 1].cells
                    bg_color = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
                    for col_idx in range(col_count):
                        val = row_data[col_idx] if col_idx < len(row_data) else ""
                        cell = row_cells[col_idx]
                        set_cell_background(cell, bg_color)
                        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                        p = cell.paragraphs[0]
                        p.paragraph_format.space_before = Pt(1)
                        p.paragraph_format.space_after = Pt(1)
                        add_formatted_runs(p, val, base_font_name="Calibri", base_font_size=10, base_color=RGBColor(30, 41, 59))

                doc.add_paragraph().paragraph_format.space_after = Pt(6)
            continue

        # Horizontal Rule
        if line.strip() in ['---', '***', '___']:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="8" w:space="1" w:color="E2E8F0"/></w:pBdr>')
            p._p.get_or_add_pPr().append(pBdr)
            i += 1
            continue

        # Blockquote or Alert
        if line.strip().startswith('>'):
            quote_lines = []
            while i < total_lines and lines[i].strip().startswith('>'):
                cleaned = re.sub(r'^>\s*', '', lines[i].strip())
                quote_lines.append(cleaned)
                i += 1

            quote_text = " ".join(quote_lines)
            is_caution = "[!CAUTION]" in quote_text or "[!WARNING]" in quote_text
            alert_color = "DC2626" if is_caution else "2563EB"
            bg_color = "FEF2F2" if is_caution else "EFF6FF"

            quote_text = quote_text.replace('[!CAUTION]', '').replace('[!WARNING]', '').replace('[!IMPORTANT]', '').strip()

            table = doc.add_table(rows=1, cols=1)
            table.alignment = WD_TABLE_ALIGNMENT.CENTER
            cell = table.cell(0, 0)
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
            
            tblPr = table._tbl.tblPr
            borders = parse_xml(
                f'<w:tblBorders {nsdecls("w")}>'
                f'  <w:top w:val="none"/>'
                f'  <w:bottom w:val="none"/>'
                f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="{alert_color}"/>'
                f'  <w:right w:val="none"/>'
                f'</w:tblBorders>'
            )
            tblPr.append(borders)

            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            if is_caution:
                r = p.add_run("CAUTION: ")
                r.bold = True
                r.font.name = "Calibri"
                r.font.size = Pt(10.5)
                r.font.color.rgb = RGBColor(220, 38, 38)
            add_formatted_runs(p, quote_text, base_font_name="Calibri", base_font_size=10.5, base_color=RGBColor(30, 41, 59))
            doc.add_paragraph().paragraph_format.space_after = Pt(4)
            continue

        # Headings
        if line.startswith('# ') and not line.startswith('## '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.keep_with_next = True
            h_text = line[2:].strip()
            add_formatted_runs(p, h_text, base_font_name="Calibri", base_font_size=22, base_color=RGBColor(30, 58, 138))
            p.runs[0].bold = True
            i += 1
            continue

        if line.startswith('## '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(5)
            p.paragraph_format.keep_with_next = True
            h_text = line[3:].strip()
            add_formatted_runs(p, h_text, base_font_name="Calibri", base_font_size=16, base_color=RGBColor(30, 58, 138))
            p.runs[0].bold = True
            # Add subtle bottom line to H2
            pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="6" w:space="2" w:color="CBD5E1"/></w:pBdr>')
            p._p.get_or_add_pPr().append(pBdr)
            i += 1
            continue

        if line.startswith('### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            h_text = line[4:].strip()
            add_formatted_runs(p, h_text, base_font_name="Calibri", base_font_size=13, base_color=RGBColor(15, 23, 42))
            p.runs[0].bold = True
            i += 1
            continue

        if line.startswith('#### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.keep_with_next = True
            h_text = line[5:].strip()
            add_formatted_runs(p, h_text, base_font_name="Calibri", base_font_size=11.5, base_color=RGBColor(51, 65, 85))
            p.runs[0].bold = True
            i += 1
            continue

        # Bullet lists
        if re.match(r'^(\*|-)\s+', line):
            item_text = re.sub(r'^(\*|-)\s+', '', line).strip()
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_runs(p, item_text, base_font_name="Calibri", base_font_size=11, base_color=RGBColor(30, 41, 59))
            i += 1
            continue

        # Numbered lists or Checkboxes
        if re.match(r'^\d+\.\s+', line):
            item_text = re.sub(r'^\d+\.\s+', '', line).strip()
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_runs(p, item_text, base_font_name="Calibri", base_font_size=11, base_color=RGBColor(30, 41, 59))
            i += 1
            continue

        # Checklist (- [ ])
        if re.match(r'^- \[( |x)\]\s*', line):
            checked = '[x]' in line
            prefix = "[DONE] " if checked else "[TODO] "
            item_text = prefix + re.sub(r'^- \[( |x)\]\s*', '', line).strip()
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.25)
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            add_formatted_runs(p, item_text, base_font_name="Calibri", base_font_size=10.5, base_color=RGBColor(30, 41, 59))
            i += 1
            continue

        # Empty line
        if not line.strip():
            i += 1
            continue

        # Regular Paragraph
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        add_formatted_runs(p, line.strip(), base_font_name="Calibri", base_font_size=11, base_color=RGBColor(30, 41, 59))
        i += 1

    doc.save(docx_path)
    print(f"Successfully converted {md_path} -> {docx_path}")

if __name__ == "__main__":
    md_file = "PROJECT_HANDOFF.md"
    desktop = os.path.join(os.environ["USERPROFILE"], "Desktop")
    docx_file = os.path.join(desktop, "PROJECT_HANDOFF.docx")
    convert_markdown_to_docx(md_file, docx_file)
