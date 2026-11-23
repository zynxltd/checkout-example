#!/usr/bin/env python3
"""YouGarden trigger emails guide — logic and setup in one place."""

from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = Path("/Users/tom/Herd/yg-cart-drawer-demo/docs/YouGarden-Trigger-Emails-Guide.docx")
ASSETS = Path("/Users/tom/Herd/yg-cart-drawer-demo/docs/trigger-guide-assets")

YG_GREEN = RGBColor(0x26, 0x4F, 0x1C)
DARK = RGBColor(0x1F, 0x29, 0x37)
MUTED = RGBColor(0x4B, 0x55, 0x63)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
HEADER_BG = "264F1C"
ROW_ALT = "F3F4F6"


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


def cell_text(cell, text, *, bold=False, color=DARK, size=10, fill=None):
    cell.text = ""
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.12
    run = p.add_run(text)
    set_run(run, size=size, bold=bold, color=color)
    if fill:
        shade_cell(cell, fill)
    set_cell_border(cell)


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    for i, h in enumerate(headers):
        cell_text(table.rows[0].cells[i], h, bold=True, color=WHITE, size=10, fill=HEADER_BG)
    for r_i, row in enumerate(rows):
        fill = ROW_ALT if r_i % 2 else "FFFFFF"
        for c_i, val in enumerate(row):
            cell_text(table.rows[r_i + 1].cells[c_i], str(val), size=10, fill=fill)
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


def add_figure(doc, filename, caption, width_cm=16.0):
    img_p = doc.add_paragraph()
    img_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    img_p.paragraph_format.space_before = Pt(8)
    img_p.paragraph_format.space_after = Pt(2)
    run = img_p.add_run()
    run.add_picture(str(ASSETS / filename), width=Cm(width_cm))
    cap = doc.add_paragraph()
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap.paragraph_format.space_before = Pt(0)
    cap.paragraph_format.space_after = Pt(10)
    cr = cap.add_run(caption)
    set_run(cr, size=9, color=MUTED)
    cr.italic = True
    return img_p


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


def build():
    doc = Document()

    # Word 2013+ so the file does not open in Compatibility Mode (Cambria / odd tables).
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
        r = p.add_run("YouGarden  ·  Trigger emails guide  ·  October 2026  ·  Page ")
        set_run(r, size=8, color=MUTED)
        add_page_field(p)

    p = doc.add_paragraph()
    r = p.add_run("YOUGARDEN")
    set_run(r, size=12, bold=True, color=YG_GREEN)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Trigger emails")
    set_run(r, size=26, bold=True, color=YG_GREEN)

    para(
        doc,
        "Abandon Cart and Abandon Browse. Fresh decides who gets an email and when. Dotdigital holds the email itself.",
        size=13,
        color=MUTED,
    )

    para(doc, "Where to click in Fresh", bold=True, space_after=4)
    add_table(
        doc,
        ["What", "Fresh path", "Open this"],
        [
            ["Triggers", "Automation → Triggers → Triggers tab", "The event and rules. Almost never edit."],
            ["Trigger programs", "Automation → Triggers → Trigger Programs tab", "Waits, Template IDs, tracking, pause, email capture"],
            ["Trigger SmartBlocks", "Automation → Trigger SmartBlocks", "Product HTML inside cart / browse emails. Test send starts here."],
            ["Site SmartBlocks", "Content → SmartBlocks", "On-site blocks (homepage, popups). Not the email journey."],
            ["Messages sent", "Reports → Messages sent", "What actually went out today"],
        ],
    )
    para(doc, "Triggers and Trigger Programs are two tabs on the same page. Timing lives on the program, not on the trigger.")

    # -------------------------------------------------------------------------
    heading(doc, "1. Logic", 1)
    para(
        doc,
        "Both journeys are three emails. Emails 1 and 2 have no coupon. Email 3 has a coupon. A purchase stops the journey. Cart waits are counted from the abandoned basket. Browse waits are counted from the previous email.",
    )

    para(doc, "Abandon cart", bold=True, space_after=4)
    para(doc, "Wait until previous send is complete: Off. Times below are from the abandoned cart.")
    add_table(
        doc,
        ["Email", "When it sends", "In the email", "Coupon"],
        [
            ["1", "2 hours after abandon", "Their basket", "No"],
            ["2", "24 hours after abandon", "Their basket + similar products", "No"],
            ["3", "4 days after abandon", "Their basket + similar / seasonal products", "Yes — INT405192"],
        ],
    )

    para(doc, "Abandon browse", bold=True, space_after=4)
    para(doc, "Wait until previous send is complete: On. Each wait starts after the last email has sent. Known email only.")
    add_table(
        doc,
        ["Email", "Wait in Fresh", "From original browse", "In the email", "Coupon"],
        [
            ["1", "6 hours", "6 hours", "Products they viewed", "No"],
            ["2", "24 hours after email 1", "30 hours", "Similar / category products", "No"],
            ["3", "114 hours after email 2", "6 days", "Seasonal / trending products", "Yes — INT902156"],
        ],
    )
    para(doc, "If they add to cart, browse stops and cart takes over. If they buy, both stop.")

    # -------------------------------------------------------------------------
    heading(doc, "2. Triggers", 1)
    para(
        doc,
        "A trigger is the event that can start a journey. It is not the email sequence. You will almost never need to edit these.",
    )
    add_table(
        doc,
        ["Trigger", "What it does", "Used by"],
        [
            ["Abandoned cart", "Fires when a known shopper leaves items in the basket and does not buy", "YouGarden - Abandoned cart - 1,2,3"],
            ["Abandoned browse", "Fires when a known shopper views products and leaves without adding to cart", "YouGarden - Browse Abandon 1,2,3"],
        ],
    )
    para(doc, "Find them in Fresh → Automation → Triggers. Timing and templates are not set here.")

    heading(doc, "2.1 Trigger Rules", 2)
    para(
        doc,
        "Rules sit on the trigger and decide who is allowed in. If a shopper fails a rule, they never enter the program.",
    )
    add_table(
        doc,
        ["Rule", "Cart", "Browse"],
        [
            ["Site brand", "yougarden", "yougarden"],
            ["Must have an email", "Yes", "Yes — unknown browsers get nothing"],
            ["Bot / huge carts", "Ignore carts over 50 items or £100k", "Not used"],
            ["Stock", "Not checked", "At least one product in stock"],
            ["Already purchased", "Do not enter", "Do not enter"],
        ],
    )
    add_figure(
        doc,
        "guide-trigger-rules-browse.jpg",
        "Abandoned browse trigger rules. YouGarden is Active. Gardening Direct copies are Paused — leave them.",
        16.2,
    )

    # -------------------------------------------------------------------------
    heading(doc, "3. Trigger Program", 1)
    para(
        doc,
        "The trigger program is the send sequence. This is where waits, Template IDs, tracking and pause live. Open the program, not the trigger, to change anything.",
    )
    add_figure(
        doc,
        "guide-program-stage-browse.jpg",
        "A program stage: wait, Template ID, SmartBlock (Trigger content) and tracking. Cart stages look the same.",
        9.4,
    )
    add_table(
        doc,
        ["Program", "Type", "Status"],
        [
            ["YouGarden - Abandoned cart - 1,2,3", "Abandoned cart", "Active if a send in last 24 hours"],
            ["YouGarden - Browse Abandon 1,2,3", "Abandoned browse", "Active if a send in last 24 hours"],
        ],
    )
    para(
        doc,
        "Triggers show as active if a triggered email of that type has been sent in the last 24 hours. Gardening Direct copies of these programs are Paused — leave them.",
    )
    para(
        doc,
        "Messages sent report for each trigger program — emails being sent today:",
    )
    para(doc, "Browse Abandon: https://admin.freshrelevance.com/reports/messages_sent/?tk=qrrqbtu")
    para(doc, "Cart Abandon: https://admin.freshrelevance.com/reports/messages_sent/?tk=53jwpdx")
    para(doc, "Cart: https://freshrelevance.dotdigital.com/triggers/edit/53jvpdX/?triggerType=v2")
    para(doc, "Browse: https://freshrelevance.dotdigital.com/triggers/edit/qrrqbtu/?triggerType=v2")
    para(doc, "Gardening Direct copies are paused. Leave them.")

    heading(doc, "3.1 Trigger Program Settings", 2)
    para(
        doc,
        "These settings control how the three emails fire. Cart and browse are not the same — the wait-until-complete switch is the one that must not be flipped.",
    )
    add_table(
        doc,
        ["Setting", "Cart", "Browse"],
        [
            ["Wait until previous send has completed", "Off — times from abandon", "On — times from last email"],
            ["Check marketing pressure", "First send only", "First send only"],
            ["Send all stages unless a purchase is made", "Off", "Off"],
            ["Stock", "Don’t check", "Check at least one product is in stock"],
            ["Refresh product data at send time", "On", "On"],
            ["Brand lock", "yougarden", "yougarden"],
            ["Channel", "YouGarden (Dotdigital Marketing)", "YouGarden (Dotdigital Marketing)"],
            ["Scripts / catch-all", "Empty", "Empty"],
        ],
    )
    add_figure(
        doc,
        "guide-program-advanced-browse.jpg",
        "Browse advanced settings. Wait-until-complete is on. Stock checks at least one product is in stock. Cart is the opposite: wait-until-complete off, don’t check stock.",
        15.0,
    )
    add_table(
        doc,
        ["Email", "Cart wait", "Browse wait"],
        [
            ["1", "2 hours (120 min in Fresh)", "6 hours (360 min in Fresh)"],
            ["2", "24 hours from abandon", "24 hours after email 1"],
            ["3", "4 days from abandon (96 hours)", "6 days (114 hours after email 2)"],
        ],
    )
    para(
        doc,
        "Same waits as section 1. Fresh stores email 1 in minutes — 120 and 360 are 2 hours and 6 hours. Live cart email 1 must be 2 hours, not a 10-minute test wait. Send all stages unless a purchase is made must stay Off.",
    )

    # -------------------------------------------------------------------------
    heading(doc, "4. Trigger SmartBlocks", 1)
    para(
        doc,
        "The SmartBlock is the product module inside the email. Fresh builds it. Dotdigital only wraps it with subject, header and intro. The same block is used on all three emails in that journey.",
    )
    add_table(
        doc,
        ["SmartBlock", "Used on", "Shows"],
        [
            ["YouGarden Cart Abandon", "Cart 1, 2 and 3", "Basket lines, prices, return-to-cart"],
            ["YouGarden Browse 21", "Browse 1, 2 and 3", "Viewed / similar products"],
        ],
    )
    para(doc, "Change products or the product button here. Change subject lines and intro copy in Dotdigital.")
    para(
        doc,
        "Product url sits on the SmartBlock (Links). It must stamp source so GA4 matches the trigger-program tracking. Browse uses PRODUCT. Cart uses BASKET. Do not leave this as {{ product.u }} only.",
    )
    para(
        doc,
        "The | in the formula is a Jinja filter pipe, not an OR. It takes product.u (the product URL) and runs set_query_parameter on it, which appends ?source=PRODUCT or ?source=BASKET. Boolean OR in Jinja is the word or.",
    )
    para(doc, "YouGarden Browse 21 — product cards (Take another look)", bold=True, space_after=4)
    add_table(
        doc,
        ["Field", "Paste this"],
        [
            ["Product url", "{{ product.u|set_query_parameter('source','PRODUCT') }}"],
            ["Call to action button url", "Not used — image, name and Take another look all use Product url"],
        ],
    )
    para(
        doc,
        "Browse layout is product cards: image, name and a Take another look button. There is no Complete your order button.",
    )
    para(doc, "YouGarden Cart Abandon — basket list (Complete your order)", bold=True, space_after=4)
    add_table(
        doc,
        ["Field", "Paste this"],
        [
            ["Product url", "{{ product.u|set_query_parameter('source','BASKET') }}"],
            ["Call to action button url", "{{ cart.u }}"],
        ],
    )
    add_figure(
        doc,
        "guide-cart-links.png",
        "Cart SmartBlock Links. Product url stamps source=BASKET. Complete your order uses {{ cart.u }}.",
        12.0,
    )
    add_figure(
        doc,
        "guide-cart-layout.jpg",
        "Cart layout: basket lines plus Complete your order.",
        15.5,
    )

    # -------------------------------------------------------------------------
    heading(doc, "5. Template ID", 1)
    para(
        doc,
        "The Template ID is the Dotdigital campaign number pasted into each Fresh stage. Fresh does not store the email. It only stores this number, then asks Dotdigital to send that campaign.",
    )
    para(
        doc,
        "On the program stage, the channel must be YouGarden (Dotdigital Marketing). Do not pick GardeningDirect or Harkness Roses.",
    )
    add_figure(
        doc,
        "guide-channel-yougarden.png",
        "Program stage channel. YouGarden (Dotdigital Marketing) must be ticked. Template ID sits under this.",
        14.0,
    )
    add_table(
        doc,
        ["Journey", "Email", "Template ID", "Dotdigital campaign"],
        [
            ["Cart", "1", "5069253", "201026_BASKET_TRIG_CartAbandon1"],
            ["Cart", "2", "5070194", "201026_BASKET_TRIG_CartAbandon2"],
            ["Cart", "3", "5073847", "201026_INT405192_TRIG_CartAbandon3"],
            ["Browse", "1", "5070368", "201026_PRODUCT_TRIG_AbandonBrowse1"],
            ["Browse", "2", "5070371", "201026_PRODUCT_TRIG_AbandonBrowse2"],
            ["Browse", "3", "5070372", "201026_INT902156_TRIG_AbandonBrowse3"],
        ],
    )
    para(doc, "Never clear a Template ID on a live program. Pause first. To swap an email, save the new Dotdigital campaign, paste the new ID into that Fresh stage, then match tracking.")

    # -------------------------------------------------------------------------
    heading(doc, "6. Tracking (Fresh + Dotdigital)", 1)
    para(
        doc,
        "Tracking is how GA4 knows which email a click came from. Set it on the Fresh trigger program stage, and again on the Dotdigital email (Utilities → Link tracking).",
    )
    para(
        doc,
        "Fresh campaign values start with FR_. Dotdigital does not use the FR_ prefix. utm_source is always dotdigital. utm_medium is always email.",
    )
    add_table(
        doc,
        ["Email", "Fresh utm_campaign", "Dotdigital utm_campaign", "Link tracking source"],
        [
            ["Cart 1", "FR_201026_BASKET_TRIG_CartAbandon1", "201026_BASKET_TRIG_CartAbandon1", "BASKET"],
            ["Cart 2", "FR_201026_BASKET_TRIG_CartAbandon2", "201026_BASKET_TRIG_CartAbandon2", "BASKET"],
            ["Cart 3", "FR_201026_INT405192_TRIG_CartAbandon3", "201026_INT405192_TRIG_CartAbandon3", "INT405192"],
            ["Browse 1", "FR_201026_PRODUCT_TRIG_AbandonBrowse1", "201026_PRODUCT_TRIG_AbandonBrowse1", "PRODUCT"],
            ["Browse 2", "FR_201026_PRODUCT_TRIG_AbandonBrowse2", "201026_PRODUCT_TRIG_AbandonBrowse2", "PRODUCT"],
            ["Browse 3", "FR_201026_INT902156_TRIG_AbandonBrowse3", "201026_INT902156_TRIG_AbandonBrowse3", "INT902156"],
        ],
    )
    para(
        doc,
        "Two different source values. SmartBlock Product url always stamps BASKET (cart) or PRODUCT (browse) on the product link. Dotdigital Link tracking source is separate: BASKET or PRODUCT on emails 1 and 2, the INT coupon code on email 3. Do not change email 3 Link tracking back to BASKET or PRODUCT.",
    )
    para(
        doc,
        "If Link tracking uses $CAMPAIGN_NAME$, the Dotdigital campaign name must match the utm_campaign column exactly.",
    )
    para(
        doc,
        "In Dotdigital open the campaign → Utilities → Link tracking. Set Campaign specific. Restore in that menu reverts the whole campaign — do not use it to set UTMs.",
    )
    add_figure(
        doc,
        "guide-utilities-menu.png",
        "Utilities menu. Open Link tracking. Restore reverts the campaign — leave it.",
        8.5,
    )
    add_figure(
        doc,
        "guide-link-tracking.png",
        "Dotdigital Link tracking (browse 3). Campaign specific. Email 3 source is the INT code, not PRODUCT or BASKET.",
        15.0,
    )

    # -------------------------------------------------------------------------
    heading(doc, "7. Generic settings", 1)
    para(
        doc,
        "These apply across cart and browse. They live in Fresh trigger settings, on the program, or in Dotdigital. Change them once with care — they affect every send.",
    )
    add_table(
        doc,
        ["Setting", "Value", "What it does"],
        [
            ["Abandon wait (global)", "15+ minutes unattended", "How long they must be gone before Fresh treats the session as abandoned"],
            ["After a purchase", "1 day suppression", "Blocks new cart or browse emails straight after an order"],
            ["Marketing pressure", "First send only, ~24 hours", "Stops email 1 if they were emailed recently. Emails 2 and 3 can still go"],
            ["Slice size", "Keeps cart and browse apart", "Stops both programs starting at once for the same person"],
            ["Cart size / value cap", "50 items, £100k", "Drops bots and broken carts"],
            ["Catch-all", "Empty on live", "Only use for a test, then clear it"],
            ["Pause vs delete", "Pause", "Stops sends. Deleting the trigger, program or campaign cannot be undone cleanly"],
        ],
    )
    add_figure(
        doc,
        "guide-pause-catchall.png",
        "Pause stops sends. Catch-all must stay empty on live — only fill it for a test, then clear it.",
        13.5,
    )
    para(doc, "Cart timing must stay 2 hours / 24 hours / 4 days from abandon (wait-until-complete off). Browse timing must stay 6 hours / 30 hours / 6 days (wait-until-complete on).")
    para(doc, "Subject, from name and intro copy: Dotdigital triggered email. Products in the email: the SmartBlock. Not sure: pause.")

    heading(doc, "8. How to send a test", 1)
    para(
        doc,
        "Always send the test from Fresh (Personalization), not from Dotdigital alone. Fresh builds a fresh copy of the Trigger SmartBlock HTML with recent product data. A Dotdigital-only test can send a stale block and dead links.",
    )
    para(doc, "Do not use the program catch-all for this. Catch-all must stay empty on live.")
    add_table(
        doc,
        ["Journey", "Trigger SmartBlock", "Trigger program"],
        [
            [
                "Browse",
                "YouGarden Browse 21\nhttps://freshrelevance.dotdigital.com/content/smartblocks/trigger/f2hyylk/",
                "YouGarden - Browse Abandon 1,2,3\nhttps://freshrelevance.dotdigital.com/triggers/edit/qrrqbtu/?triggerType=v2",
            ],
            [
                "Cart",
                "YouGarden Cart Abandon\nAutomation → Trigger SmartBlocks (same Preview → Test Send as browse)",
                "YouGarden - Abandoned cart - 1,2,3\nhttps://freshrelevance.dotdigital.com/triggers/edit/53jvpdx/?triggerType=v2",
            ],
        ],
    )
    para(doc, "Steps (browse example — cart is the same, using the cart row above)", bold=True, space_after=4)
    para(doc, "1. Fresh → Automation → Trigger SmartBlocks. Open YouGarden Browse 21.")
    para(doc, "2. Click Preview. Enter your email (e.g. tom.jameson@yougarden.com). Remove any products listed, then click Preview so Fresh pulls current product data for that person.")
    para(doc, "3. Click Test Send. Choose the matching trigger program (YouGarden - Browse Abandon 1,2,3).")
    para(doc, "4. Send to a test address (e.g. james.harding+ygtest@dotdigital.com). Check the email: products look current, and every product / CTA link opens.")
    para(doc, "If links fail, the Template ID on that program stage is wrong, or you tested from Dotdigital without regenerating the SmartBlock.")

    heading(doc, "8.1 Gardening Direct testing", 2)
    para(
        doc,
        "GD cart and browse are separate programs from YouGarden. Brand rules on the trigger lock each journey to one site brand. The Trigger SmartBlock itself has no site-brand concept — Preview always uses the most recent abandon signal on that person/visitor record, whichever brand it was.",
    )
    add_table(
        doc,
        ["Program", "Trigger brand rule", "Channel"],
        [
            [
                "Gardening Direct - Abandoned cart - 1,2,3",
                "Site brand = gardeningdirect (not yougarden)",
                "GardeningDirect (Dotdigital Marketing)",
            ],
            [
                "GardeningDirect - Browse Abandon 1,2,3",
                "Site brand = gardeningdirect (not yougarden)",
                "GardeningDirect (Dotdigital Marketing)",
            ],
        ],
    )

    para(doc, "Check the visitor’s signals before you preview", bold=True, space_after=4)
    para(
        doc,
        "In Fresh: Data → Visitors → enter the customer email → open the visitor → Audit log → check cart / browse abandon signals (and which site brand they came from). Example visitor record:",
    )
    para(doc, "https://freshrelevance.dotdigital.com/reports/visitor/6abaa86313854f4b3883c65f/")
    para(
        doc,
        "If the newest abandon on that email is YouGarden, Preview of a GD SmartBlock will still show YouGarden products. Pick another email whose latest abandon is gardeningdirect.",
    )

    para(doc, "Finding a GD email to preview with", bold=True, space_after=4)
    para(
        doc,
        "Option 1 — Abandons report (for SmartBlock Preview): open the Abandons report, filter Site brand to gardeningdirect, copy an email from that list into Preview. Their most recent abandon is on GD, so the block shows GD products.",
    )
    para(
        doc,
        "Option 2 — Trigger + catch-all (most reliable for a full send): put the GD SmartBlock on the GD trigger program (already behind the gardeningdirect site-brand rule). Temporarily set catch-all to your test address. Sends go to you with the correct brand. Remove catch-all as soon as the test is done — with catch-all empty the program is live to real customers again.",
    )
    para(
        doc,
        "Popup signups are also useful contacts. GD email capture adds them to Dotdigital list 873591 — open the list, pick an address, then confirm in Visitors → Audit log that they have a recent GD abandon before using them in Preview:",
    )
    para(doc, "https://r1-app.dotdigital.com/contactmanager/#/audience/lists/873591")

    para(doc, "Steps (GD)", bold=True, space_after=4)
    para(doc, "1. Confirm the trigger rule Site brand is gardeningdirect on the GD cart / browse trigger (not yougarden).")
    para(doc, "2. Pick a GD email via Abandons (brand filter) or list 873591, then verify signals under Data → Visitors → Audit log.")
    para(doc, "3. Preview the GD Trigger SmartBlock with that email. Clear stale products if needed, Preview again.")
    para(doc, "4. Test Send into Gardening Direct - Abandoned cart - 1,2,3 or GardeningDirect - Browse Abandon 1,2,3 — not the YouGarden programs. Or use catch-all on the GD program (Option 2), then clear it.")
    para(doc, "5. Check From name is Gardening Direct, product links go to gardeningdirect.co.uk, and UTMs use the GD campaign names (021126_…).")
    para(
        doc,
        "If Preview shows YouGarden products, that email’s most recent abandon was YouGarden — not a SmartBlock bug. Switch contact or use Option 2.",
    )

    heading(doc, "9. Email capture (popups)", 1)
    para(
        doc,
        "These are not abandon emails. When someone submits a popup (or on-site form), Fresh fires a custom signal. The program waits 0 minutes, adds that email to the brand’s Dotdigital list, and sets signupLocation so you know they came from the popup. Fresh does not send an email here. Welcome or coupon mail is a separate Dotdigital program on that list.",
    )
    add_table(
        doc,
        ["Program", "Brand", "Signal / namespace", "What it does"],
        [
            ["YouGarden Email Capture - Custom - Set field, Add to list", "YouGarden", "yg_email_capture", "Add to Dotdigital list 23768722 and set signupLocation"],
            [
                "GardeningDirect Email Capture - Custom - Set field, Add to list",
                "Gardening Direct",
                "gd_email_capture",
                "Add to Dotdigital list 873591 (GD popup signups) and set signupLocation\nhttps://r1-app.dotdigital.com/contactmanager/#/audience/lists/873591",
            ],
            ["Roses Email Capture - Custom - Set field, Add to list", "Roses", "roses_email_capture", "Add to the Roses Dotdigital list and set signupLocation"],
        ],
    )
    para(
        doc,
        "Find them under Automation → Trigger Programs. The popup SmartBlock’s custom signal must match the program namespace exactly, or nobody is added to the list.",
    )
    add_table(
        doc,
        ["Setting", "Value", "Why"],
        [
            ["Wait", "0 minutes", "List add happens as soon as they submit"],
            ["Action", "Add to list + Set fields — not Send message", "This program is data, not an email"],
            ["Ignore marketing pressure", "On", "A cart or browse send must not block the list add"],
            ["Stock", "Don’t check", "There are no products in this program"],
            ["Catch-all", "Empty on live", "Same as cart and browse"],
        ],
    )
    para(doc, "If Roses (or any brand) shows 0 added to list, the popup is not firing that signal, or the namespace does not match.")

    # -------------------------------------------------------------------------
    heading(doc, "10. Campaign copy summary (what’s set up)", 1)
    para(
        doc,
        "Dotdigital triggered-campaign subject, preheader and from name for each live email. Campaign name is also the Dotdigital utm_campaign when Link tracking uses $CAMPAIGN_NAME$.",
    )
    para(
        doc,
        "Stage 3 (cart and browse) subject and preheader are the same on YouGarden and Gardening Direct — only the campaign-name date prefix and from name differ. Cart 3 uses INT405192; browse 3 uses INT902156.",
    )

    heading(doc, "10.1 Stock checking (best settings)", 2)
    para(
        doc,
        "Stock handling on the trigger program (and matching trigger rules) should stay as below for both YouGarden and Gardening Direct. This is the recommended setup.",
    )
    add_table(
        doc,
        ["Journey", "Stock setting", "Why", "What you still see"],
        [
            [
                "Cart",
                "Don’t check",
                "Remind them of the basket they left. A line going OOS later should not kill the whole journey.",
                "OOS basket lines can still appear in the email and on click (e.g. Buddleia OUT OF STOCK from a cart link).",
            ],
            [
                "Browse",
                "Check at least one product is in stock",
                "Do not start/send if every browsed product is OOS. Send if any one is still available.",
                "OOS products can still sit next to in-stock ones in the SmartBlock (e.g. Ultimate Pansy OOS + Pansy Top Wave in stock on browse 3).",
            ],
        ],
    )
    para(
        doc,
        "Also keep Refresh product data at send time On for cart and browse. That re-reads stock at each stage; it does not remove OOS lines from the layout by itself.",
    )
    para(
        doc,
        "“At least one in stock” only gates the send. By default the SmartBlock still lists OOS items. To hide them in the email HTML, filter the product loop (if product.stock > 0) in the Trigger SmartBlock / cart layout — separate from this program setting.",
    )

    heading(doc, "10.2 YouGarden", 2)
    para(
        doc,
        "Cart abandon (emails 1–3) and browse abandon (emails 1–3). From name is YouGarden on every send.",
    )
    add_table(
        doc,
        ["Journey", "Email", "Campaign name", "Subject", "Preheader", "From name"],
        [
            [
                "Cart",
                "1",
                "201026_BASKET_TRIG_CartAbandon1",
                "Thanks for visiting our website recently…",
                "We noticed you looked at these great items. Get them now whilst still in stock.",
                "YouGarden",
            ],
            [
                "Cart",
                "2",
                "201026_BASKET_TRIG_CartAbandon2",
                "We noticed you haven't made a purchase yet!",
                "Don't worry we have saved your basket for you to complete your order.",
                "YouGarden",
            ],
            [
                "Cart",
                "3",
                "201026_INT405192_TRIG_CartAbandon3",
                "The items in your basket will expire!",
                "Last Chance Plus Get 10% Off Today with Code INT405192",
                "YouGarden",
            ],
            [
                "Browse",
                "1",
                "201026_PRODUCT_TRIG_AbandonBrowse1",
                "Take Another Look!",
                "The items you recently viewed are still available.",
                "YouGarden",
            ],
            [
                "Browse",
                "2",
                "201026_PRODUCT_TRIG_AbandonBrowse2",
                "We noticed you haven't made a purchase yet!",
                "Don't worry, there's still time!",
                "YouGarden",
            ],
            [
                "Browse",
                "3",
                "201026_INT902156_TRIG_AbandonBrowse3",
                "Last Chance Plus Get 10% Off Today with Code INT902156",
                "The plants you viewed are still available.",
                "YouGarden",
            ],
        ],
    )

    heading(doc, "10.3 Gardening Direct", 2)
    para(
        doc,
        "Cart abandon (emails 1–3) and browse abandon (emails 1–3). From name is Gardening Direct on every send. Stage 3 subject and preheader match YouGarden (same INT codes).",
    )
    add_table(
        doc,
        ["Journey", "Email", "Campaign name", "Subject", "Preheader", "From name"],
        [
            [
                "Cart",
                "1",
                "021126_BASKET_TRIG_CartAbandon1",
                "Thanks for visiting our website recently…",
                "We noticed you looked at these great items. Get them now whilst still in stock.",
                "Gardening Direct",
            ],
            [
                "Cart",
                "2",
                "021126_BASKET_TRIG_CartAbandon2",
                "We noticed you haven't made a purchase yet!",
                "Don't worry we have saved your basket for you to complete your order.",
                "Gardening Direct",
            ],
            [
                "Cart",
                "3",
                "021126_INT405192_TRIG_CartAbandon3",
                "The items in your basket will expire!",
                "Last Chance Plus Get 10% Off Today with Code INT405192",
                "Gardening Direct",
            ],
            [
                "Browse",
                "1",
                "021126_PRODUCT_TRIG_BrowseAbandon1",
                "Take Another Look!",
                "The items you recently viewed are still available.",
                "Gardening Direct",
            ],
            [
                "Browse",
                "2",
                "021126_PRODUCT_TRIG_BrowseAbandon2",
                "We noticed you haven't made a purchase yet!",
                "Don't worry, there's still time!",
                "Gardening Direct",
            ],
            [
                "Browse",
                "3",
                "021126_INT902156_TRIG_AbandonBrowse3",
                "Last Chance Plus Get 10% Off Today with Code INT902156",
                "The plants you viewed are still available.",
                "Gardening Direct",
            ],
        ],
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    r = p.add_run(
        "Values captured 28 October 2026. Campaign copy summary (YouGarden + Gardening Direct) added 2–6 November 2026."
    )
    set_run(r, size=10, color=MUTED)

    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    build()
