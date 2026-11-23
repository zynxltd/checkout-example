#!/usr/bin/env python3
"""YouGarden trigger reporting — 25–30 Oct 2026 (Dotdigital) + 28 Oct (Fresh)."""

from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = Path("/Users/tom/Herd/yg-cart-drawer-demo/docs/YouGarden-Trigger-Reporting-Oct-2026.docx")

YG_GREEN = RGBColor(0x26, 0x4F, 0x1C)
DARK = RGBColor(0x1F, 0x29, 0x37)
MUTED = RGBColor(0x4B, 0x55, 0x63)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
HEADER_BG = "264F1C"
ROW_ALT = "F3F4F6"
HIGHLIGHT = "EEF4EC"


def set_run(run, *, size=11, bold=False, color=DARK, font="Calibri"):
    run.font.name = font
    run.font.size = Pt(size)
    run.bold = bold
    run.font.color.rgb = color
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.get_or_add_rFonts()
    rFonts.set(qn("w:ascii"), font)
    rFonts.set(qn("w:hAnsi"), font)
    rFonts.set(qn("w:eastAsia"), font)


def shade_cell(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), hex_color)
    shd.set(qn("w:val"), "clear")
    tcPr.append(shd)


def set_cell_border(cell):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), "4")
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), "D1D5DB")
        tcBorders.append(el)
    tcPr.append(tcBorders)


def cell_text(cell, text, *, bold=False, color=DARK, size=9, fill=None, align="left"):
    cell.text = ""
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.12
    if align == "right":
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    elif align == "center":
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    set_run(run, size=size, bold=bold, color=color)
    if fill:
        shade_cell(cell, fill)
    set_cell_border(cell)


def add_table(doc, headers, rows, *, numeric_from=1, last_fill=None):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    for i, h in enumerate(headers):
        align = "left" if i < numeric_from else "right"
        cell_text(
            table.rows[0].cells[i],
            h,
            bold=True,
            color=WHITE,
            size=9,
            fill=HEADER_BG,
            align=align,
        )
    for r_i, row in enumerate(rows):
        is_last = r_i == len(rows) - 1
        fill = last_fill if is_last and last_fill else (ROW_ALT if r_i % 2 else "FFFFFF")
        bold = bool(is_last and last_fill)
        for c_i, val in enumerate(row):
            align = "left" if c_i < numeric_from else "right"
            cell_text(
                table.rows[r_i + 1].cells[c_i],
                str(val),
                size=9,
                fill=fill,
                bold=bold,
                align=align,
            )
    doc.add_paragraph()
    return table


def heading(doc, text, level=1):
    p = doc.add_heading(text, level=level)
    for run in p.runs:
        run.font.color.rgb = YG_GREEN
        run.font.name = "Calibri"


def para(doc, text, *, bold=False, size=11, color=DARK, space_after=8):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    set_run(run, size=size, bold=bold, color=color)
    return p


def bullet(doc, text):
    p = doc.add_paragraph(text, style="List Bullet")
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.space_before = Pt(0)
    for run in p.runs:
        set_run(run, size=11, color=DARK)
    return p


def add_page_field(paragraph):
    run = paragraph.add_run()
    set_run(run, size=8, color=MUTED)
    fld1 = OxmlElement("w:fldChar")
    fld1.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    fld2 = OxmlElement("w:fldChar")
    fld2.set(qn("w:fldCharType"), "end")
    run._r.append(fld1)
    run._r.append(instr)
    run._r.append(fld2)


def set_compat(doc):
    compat = doc.settings.element.find(qn("w:compat"))
    if compat is None:
        compat = OxmlElement("w:compat")
        doc.settings.element.append(compat)
    mode = None
    for el in compat.findall(qn("w:compatSetting")):
        if el.get(qn("w:name")) == "compatibilityMode":
            mode = el
            break
    if mode is None:
        mode = OxmlElement("w:compatSetting")
        mode.set(qn("w:name"), "compatibilityMode")
        mode.set(qn("w:uri"), "http://schemas.microsoft.com/office/word")
        compat.append(mode)
    mode.set(qn("w:val"), "15")


def build():
    doc = Document()
    set_compat(doc)

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(11)
    n_rPr = normal.element.get_or_add_rPr()
    n_fonts = n_rPr.get_or_add_rFonts()
    n_fonts.set(qn("w:ascii"), "Calibri")
    n_fonts.set(qn("w:hAnsi"), "Calibri")
    n_fonts.set(qn("w:eastAsia"), "Calibri")

    for section in doc.sections:
        section.top_margin = Cm(1.8)
        section.bottom_margin = Cm(1.8)
        section.left_margin = Cm(1.9)
        section.right_margin = Cm(1.9)
        section.page_width = Cm(21.0)
        section.page_height = Cm(29.7)
        footer = section.footer
        footer.is_linked_to_previous = False
        p = footer.paragraphs[0]
        r = p.add_run("YouGarden  ·  Trigger reporting  ·  25–30 October 2026  ·  Page ")
        set_run(r, size=8, color=MUTED)
        add_page_field(p)

    p = doc.add_paragraph()
    r = p.add_run("YOUGARDEN")
    set_run(r, size=12, bold=True, color=YG_GREEN)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Trigger reporting")
    set_run(r, size=26, bold=True, color=YG_GREEN)

    para(
        doc,
        "Abandon cart and abandon browse. Email-level results from Dotdigital Channel Analytics (25–30 October 2026) plus a one-day Fresh trigger-program snapshot (28 October 2026).",
        size=13,
        color=MUTED,
    )
    para(doc, "Prepared 30 October 2026  ·  Do not add the two sources together — they cover different windows and count sends differently.")

    # -------------------------------------------------------------------------
    heading(doc, "1. Headline", 1)
    para(
        doc,
        "Cart abandon is doing the commercial work. Over six days it brought in £912 from 7,923 sends. Browse abandon sent 2.4× as many emails and made £725. Cart produced 56% of trigger revenue from 29% of volume.",
    )

    add_table(
        doc,
        ["", "Cart", "Browse", "Combined"],
        [
            ["Sent", "7,923", "19,241", "27,164"],
            ["Delivered", "7,855", "19,199", "27,054"],
            ["Unique opens", "3,451", "7,578", "11,029"],
            ["Unique open rate", "43.9%", "39.5%", "40.8%"],
            ["Unique clicks", "943", "1,534", "2,477"],
            ["Unique CTR", "12.0%", "8.0%", "9.2%"],
            ["Orders", "25", "22", "47"],
            ["Order rate of delivered", "0.32%", "0.11%", "0.17%"],
            ["Revenue", "£911.74", "£724.83", "£1,636.57"],
            ["AOV", "£36.47", "£32.95", "£34.82"],
            ["Revenue per 1,000 sent", "£115.07", "£37.67", "£60.25"],
            ["Share of sends", "29%", "71%", "100%"],
            ["Share of revenue", "56%", "44%", "100%"],
        ],
        numeric_from=1,
    )
    para(
        doc,
        "Source: Dotdigital Channel Analytics, 25–30 October 2026. Open rate and CTR are unique, of delivered. Order rate is orders ÷ delivered. AOV is revenue ÷ orders.",
        size=9,
        color=MUTED,
    )

    # -------------------------------------------------------------------------
    heading(doc, "2. Cart journey — emails 1, 2, 3", 1)
    para(
        doc,
        "All three cart emails convert. Unique CTR stays above 10% through email 3. Email 1 (2 hours after abandon, basket only, no coupon) is the strongest: £501, 13 orders, £164 RPM. Email 3 (coupon INT405192) is the weakest of the three but still made £113 from 3 orders — unlike browse 3, the coupon step is not dead.",
    )
    add_table(
        doc,
        ["Email", "When / content", "Sent", "Open %", "CTR", "Orders", "Revenue", "AOV", "RPM"],
        [
            ["Cart 1", "2 hours · basket · no coupon", "3,048", "47.4%", "13.3%", "13", "£501.16", "£38.55", "£164"],
            ["Cart 2", "24 hours · basket + similar · no coupon", "3,144", "42.4%", "11.4%", "9", "£297.72", "£33.08", "£95"],
            ["Cart 3", "4 days · coupon INT405192", "1,731", "40.7%", "10.8%", "3", "£112.86", "£37.62", "£65"],
            ["Cart total", "", "7,923", "43.9%", "12.0%", "25", "£911.74", "£36.47", "£115"],
        ],
        numeric_from=2,
        last_fill=HIGHLIGHT,
    )
    para(doc, "Engagement detail", bold=True, space_after=4)
    add_table(
        doc,
        ["Email", "Campaign", "Delivered", "Unique opens", "Unique clicks", "CTOR", "Click-to-order"],
        [
            ["Cart 1", "201026_BASKET_TRIG_CartAbandon1", "3,019", "1,430", "401", "28.0%", "3.2%"],
            ["Cart 2", "201026_BASKET_TRIG_CartAbandon2", "3,120", "1,323", "356", "26.9%", "2.5%"],
            ["Cart 3", "201026_INT405192_TRIG_CartAbandon3", "1,716", "698", "186", "26.6%", "1.6%"],
        ],
        numeric_from=2,
    )
    para(
        doc,
        "Cart 2 sent more than cart 1 (3,144 vs 3,048). That is expected in this window, not a broken drip. Journeys started on 20 October; this report is 25–30 October, so emails 2 and 3 include people who received email 1 before 25 October. Do not read the send counts as a single cohort.",
        size=11,
    )
    para(
        doc,
        "Delivery on cart is 99.14% (68 failed of 7,923). Browse is 99.78%. Worth a list-hygiene look if cart failures stay higher next week.",
        size=11,
    )

    # -------------------------------------------------------------------------
    heading(doc, "3. Browse journey — emails 1, 2, 3", 1)
    para(
        doc,
        "Browse 1 carries the series: 85% of browse revenue from 54% of browse sends. Browse 2 is high volume and low return (£109, 4 orders from 6,890 sends). Browse 3 — the coupon email (INT902156) — sent 2,002 times and made £0.",
    )
    add_table(
        doc,
        ["Email", "When / content", "Sent", "Open %", "CTR", "Orders", "Revenue", "AOV", "RPM"],
        [
            ["Browse 1", "6 hours · viewed products · no coupon", "10,349", "38.4%", "8.9%", "18", "£616.31", "£34.24", "£60"],
            ["Browse 2", "30 hours · similar products · no coupon", "6,890", "43.6%", "7.7%", "4", "£108.52", "£27.13", "£16"],
            ["Browse 3", "6 days · coupon INT902156", "2,002", "30.6%", "4.5%", "0", "£0.00", "—", "£0"],
            ["Browse total", "", "19,241", "39.5%", "8.0%", "22", "£724.83", "£32.95", "£38"],
        ],
        numeric_from=2,
        last_fill=HIGHLIGHT,
    )
    para(doc, "Engagement detail", bold=True, space_after=4)
    add_table(
        doc,
        ["Email", "Campaign", "Delivered", "Unique opens", "Unique clicks", "CTOR", "Click-to-order"],
        [
            ["Browse 1", "201026_PRODUCT_TRIG_AbandonBrowse1", "10,325", "3,967", "917", "23.1%", "2.0%"],
            ["Browse 2", "201026_PRODUCT_TRIG_AbandonBrowse2", "6,878", "3,000", "527", "17.6%", "0.8%"],
            ["Browse 3", "201026_INT902156_TRIG_AbandonBrowse3", "1,996", "611", "90", "14.7%", "0%"],
        ],
        numeric_from=2,
    )
    para(
        doc,
        "Browse 2 has the highest unique open rate in the browse series (43.6%) but CTR, click-to-order and AOV all drop. Opens are fine; the content after the open is not earning. Browse 3 open rate falls to 30.6% and CTR to 4.5% — the remaining audience at day 6 is cold, and the coupon did not recover them in this window.",
    )

    # -------------------------------------------------------------------------
    heading(doc, "4. Fresh snapshot — 28 October only", 1)
    para(
        doc,
        "Fresh reports the trigger programs as a whole (all three emails rolled up), not per send. This is one day, not the six-day Dotdigital window. Use it to confirm direction, not to reconcile totals.",
    )
    add_table(
        doc,
        ["Program", "Status", "Sent", "Clicks", "CTR", "Conv.", "Qty", "AOV", "Revenue", "RPM"],
        [
            ["YouGarden — Abandoned cart 1,2,3", "Active", "771", "117", "15.2%", "1.95%", "15", "£43.37", "£650.57", "£844"],
            ["YouGarden — Browse Abandon 1,2,3", "Active", "2,650", "220", "8.3%", "0.42%", "11", "£24.71", "£271.84", "£103"],
            ["Active programs with volume", "", "3,421", "337", "9.9%", "—", "26", "—", "£922.41", "£270"],
        ],
        numeric_from=2,
        last_fill=HIGHLIGHT,
    )
    para(
        doc,
        "Source: Fresh item-level trigger program report, 28 October 2026. CTR is clicks ÷ sent. Conversion and AOV are as Fresh reported. RPM is revenue per 1,000 messages sent.",
        size=9,
        color=MUTED,
    )
    para(
        doc,
        "Same story as Dotdigital: cart RPM is about 8× browse (£844 vs £103), cart conversion is about 5× (1.95% vs 0.42%), and cart AOV is higher (£43.37 vs £24.71). 28 October was a strong cart day in Fresh (15 orders, £651) relative to the six-day Dotdigital average of about four cart orders a day.",
    )

    heading(doc, "Programs with no send volume", 2)
    add_table(
        doc,
        ["Program", "Type", "Status", "Notes"],
        [
            ["YouGarden Email Capture", "Custom", "Active", "Sets field / adds to list. Does not send mail."],
            ["Roses Email Capture", "Custom", "Active", "Sets field / adds to list. Does not send mail."],
            ["GardeningDirect Email Capture", "Custom", "Active", "Sets field / adds to list. Does not send mail."],
            ["YouGarden — Low stock", "Low stock", "Paused", "No data this period."],
            ["YouGarden — Back in stock", "Back in stock", "Paused", "No data this period."],
            ["GardeningDirect — Browse Abandon", "Abandoned browse", "Paused", "No data this period."],
            ["Gardening Direct — Abandoned cart", "Abandoned cart", "Paused", "No data this period."],
        ],
        numeric_from=99,
    )

    # -------------------------------------------------------------------------
    heading(doc, "5. Do Excel and Fresh reconcile?", 1)
    para(
        doc,
        "No — not on revenue. The two Excel files are Dotdigital Channel Analytics for 25–30 October (cart and browse; no overlapping campaigns; the duplicate CSVs were the same data twice). Fresh is 28 October only. Both sources add up internally. They are not the same dates or the same grain, so the totals will never match. The fair test is Fresh 28 Oct vs Excel’s daily average (six-day total ÷ 6).",
    )
    add_table(
        doc,
        ["Metric", "Fresh 28 Oct", "Excel 25–30 Oct", "Excel / day", "Fresh as % of an Excel day"],
        [
            ["Browse sent", "2,650", "19,241", "3,207", "83%"],
            ["Browse clicks", "220", "1,534", "256", "86%"],
            ["Browse orders / qty", "11", "22", "3.7", "300%"],
            ["Browse revenue", "£271.84", "£724.83", "£120.81", "225%"],
            ["Cart sent", "771", "7,923", "1,321", "58%"],
            ["Cart clicks", "117", "943", "157", "74%"],
            ["Cart orders / qty", "15", "25", "4.2", "360%"],
            ["Cart revenue", "£650.57", "£911.74", "£151.96", "428%"],
        ],
        numeric_from=1,
    )
    para(doc, "What matches", bold=True, space_after=4)
    para(
        doc,
        "Sends and clicks. Browse volume in Fresh is 83–86% of a typical Excel day. Cart clicks 74%, cart sends 58%. Same order of magnitude — 28 October was a real send day in both systems, a bit quieter than the six-day average (and 30 October in Excel is a partial day; the export ran at 14:26).",
    )
    para(doc, "What does not", bold=True, space_after=4)
    para(
        doc,
        "Orders and revenue. Fresh browse revenue is 2.3× an Excel day; cart is 4.3×. Fresh cart on 28 October alone (£651, 15 orders) is 71% of Excel’s entire six-day cart total (£912, 25 orders). If both credited the same purchases to the same sends, that cannot happen.",
    )
    para(doc, "Why", bold=True, space_after=4)
    bullet(doc, "Different windows: Fresh is one day; Excel is six days (30 Oct partial).")
    bullet(doc, "Different grain: Fresh is the program (emails 1+2+3 in one row); Excel is each Dotdigital campaign.")
    bullet(doc, "Different attribution: journeys went live 20 October. Fresh on 28 Oct can credit a purchase that day from an email sent 20–27 Oct. This Excel extract is send-dated 25–30 Oct — a 23 Oct send that converts on 28 Oct is in Fresh and out of Excel.")
    bullet(doc, "Conversion windows and last-click rules differ. Fresh 1.95% cart conversion is not comparable to Excel’s 0.32% order rate of delivered.")
    para(
        doc,
        "To actually reconcile: re-export Dotdigital for 28 October only, and/or Fresh for 25–30 October. Until the windows match, quote Excel for email-level performance and treat Fresh as a separate program view. Direction still agrees in both: cart outperforms browse.",
    )

    # -------------------------------------------------------------------------
    heading(doc, "6. What to look at next", 1)
    para(doc, "Browse 3 — coupon INT902156", bold=True, space_after=4)
    para(
        doc,
        "2,002 sent, 90 unique clicks, 0 orders, £0. First check: is INT902156 still valid, on the right landing pages, and in the SmartBlock. Then whether day-6 remaining audience is too cold for a coupon to work. If next week is also zero, this step is a candidate to pause or retune rather than keep sending.",
    )
    para(doc, "Browse 2 — similar products", bold=True, space_after=4)
    para(
        doc,
        "6,890 sent for £109. Opens are the best in the browse series; clicks and orders are not. Compare the SmartBlock (similar / category) against browse 1 (viewed products). If similar products are a poor match, that is the lever — not the wait.",
    )
    para(doc, "Cart — leave the live setup alone", bold=True, space_after=4)
    para(
        doc,
        "Waits stay 2 hours / 24 hours / 4 days. Email 3 still earns. Do not pause cart to “test browse”. If anything is changed, it should be browse, not cart.",
    )
    para(doc, "Paused programs", bold=True, space_after=4)
    para(
        doc,
        "Gardening Direct cart and browse are paused, so GD contributed nothing this period. YouGarden low stock and back in stock are also paused. Only unpause when the SmartBlock, Template ID and coupon (if any) have been test-sent from Fresh.",
    )

    heading(doc, "Sources", 2)
    para(
        doc,
        "Dotdigital Channel Analytics — Email reports, 25 October 2026 to 30 October 2026: 201026_BASKET_TRIG_CartAbandon1/2, 201026_INT405192_TRIG_CartAbandon3, 201026_PRODUCT_TRIG_AbandonBrowse1/2, 201026_INT902156_TRIG_AbandonBrowse3.",
        size=10,
        color=MUTED,
    )
    para(
        doc,
        "Fresh Relevance — Total All Item Level Reporting, trigger programs, 28 October 2026.",
        size=10,
        color=MUTED,
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
