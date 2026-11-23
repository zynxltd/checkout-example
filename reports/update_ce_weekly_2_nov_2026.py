#!/usr/bin/env python3
"""Update YouGarden Crazy Egg weekly reports for Monday 2 Nov 2026."""

from copy import copy
from pathlib import Path
from shutil import copy2

from docx import Document
from docx.oxml.ns import qn
from docx.shared import RGBColor
from openpyxl import load_workbook
from openpyxl.styles import Alignment, Font, PatternFill, PatternFill as PF
from openpyxl.styles.colors import Color

ROOT = Path(__file__).resolve().parent
DOWNLOADS = Path.home() / "Downloads"
SRC_XLSX = DOWNLOADS / "YG_Weekly_Report_updated.xlsx"
SRC_DOCX = DOWNLOADS / "CE_FR Update. October 30th.docx"

OUT_XLSX_NAME = "YG_Weekly_Report_2_Nov_2026.xlsx"
OUT_DOCX_NAME = "CE_FR Update. November 2nd.docx"

YELLOW = PatternFill("solid", fgColor="FFF3CD")
GREY = PatternFill("solid", fgColor="E9ECEF")
GREEN_STATUS = RGBColor(0x4E, 0xA7, 0x2E)
PURPLE_STATUS = RGBColor(0xA0, 0x2B, 0x93)
TEAL_HEAD = RGBColor(0x15, 0x60, 0x82)

# Sticky ATC mobile — 13 Oct to 2 Nov, Purchase + add_to_cart
ATC = {
    "control": {
        "purchases": 1899,
        "cr": 5.34,
        "lift": "—",
        "sig": 97,
        "value": 62250.35,
        "notes": (
            "13 Oct–2 Nov (3 weeks). Add to basket +3.5% (16.80% vs 16.23%, 99%). "
            "Purchases 5.34%. This is a win. Conclude — ship sticky ATC on mobile."
        ),
    },
    "variant": {
        "purchases": 2021,
        "cr": 5.61,
        "lift": "+5.0%",
        "sig": 97,
        "value": 68054.38,
        "notes": (
            "Purchases +5.0% (97%). Add to basket +3.5% (99%). "
            "Sales £68,054 vs £62,250, about £5,804 more. Enough data. Conclude."
        ),
    },
}

# Payment options desktop — 16 Oct to 2 Nov
PAY_DESK = {
    "control": {
        "purchases": 1300,
        "cr": 41.17,
        "lift": "—",
        "sig": 96,
        "value": 46221.05,
        "primary": "Begin Checkout",
        "notes": (
            "16 Oct–2 Nov, 6,361 visitors / 17 days (~2.5 weeks). "
            "Begin checkout 21.15%. Purchases 41.17%."
        ),
    },
    "variant": {
        "purchases": 1407,
        "cr": 43.57,
        "lift": "+5.9%",
        "sig": 97,
        "value": 48761.40,
        "primary": "Purchase",
        "notes": (
            "Begin checkout +11.1% (23.51% vs 21.15%, 100%). "
            "Purchases +5.9% (96–97%). About £2,540 more in sales. "
            "This is a win. Run to 3 weeks (~6 Nov), then conclude."
        ),
    },
}

# Payment mobile — last pull 26 Oct; no new share link this week
PAY_MOB = {
    "control": {
        "purchases": 1449,
        "cr": 32.83,
        "lift": "—",
        "sig": 85,
        "value": 47627.71,
        "notes": (
            "13–26 Oct. Begin checkout 20.73%. No new mobile pull this week. "
            "No real difference. Mobile does not need more time."
        ),
    },
    "variant": {
        "purchases": 1441,
        "cr": 31.61,
        "lift": "−3.7%",
        "sig": 85,
        "value": 46609.82,
        "notes": (
            "Purchases −3.7% (85%). Begin checkout +2.3% (55%). "
            "No real difference. Figures as of 26 Oct."
        ),
    },
}

WEEK = "26 Oct 2026"
HEADLINE = (
    "Week commencing: 26 Oct 2026  |  Site metrics: still 19–25 Oct (GA4 not updated)  |  "
    "Crazy Egg as of 2 Nov  |  Sticky ATC mobile: conclude — ATC +3.5% (99%), "
    "purchases +5.0% (97%), +£5,804.  Payment phase 2 desktop: checkout +11.1% (100%), "
    "purchases +5.9% (97%) — run to 3 weeks then conclude."
)


def copy_style(src, dest):
    if src.has_style:
        dest.font = copy(src.font)
        dest.fill = copy(src.fill)
        dest.border = copy(src.border)
        dest.alignment = copy(src.alignment)
        dest.number_format = src.number_format
        dest.protection = copy(src.protection)


def write_log_row(ws, row, *, week, test_id, name, status, variant, data, audience, primary, fill_status):
    values = [
        week,
        test_id,
        name,
        status,
        variant,
        data["purchases"],
        data["cr"],
        data["lift"],
        data["sig"],
        data["value"],
        audience,
        primary,
        data["notes"],
    ]
    for col, val in enumerate(values, 1):
        cell = ws.cell(row, col)
        cell.value = val
    ws.cell(row, 4).fill = fill_status


def write_summary_live(ws, row, *, name, status, variant, cr, lift, sig, value, audience, notes, status_fill):
    mapping = {
        1: name,
        2: status,
        3: variant,
        4: cr,
        5: lift,
        6: sig,
        7: value,
        8: audience,
        9: notes,
    }
    for col, val in mapping.items():
        ws.cell(row, col).value = val
    ws.cell(row, 2).fill = status_fill


def update_xlsx(src: Path, dests: list[Path]):
    wb = load_workbook(src)
    log = wb["Crazy Egg Test log"]
    summary = wb["Weekly summary"]
    ga4 = wb["GA4 Site metrics history"]

    # --- Test log: replace live ATC with payment tests, drop duplicate rows ---
    write_log_row(
        log, 3, week=WEEK, test_id="BASKET", name="Payment methods phase 2 Desktop",
        status="Running", variant="Control", data=PAY_DESK["control"],
        audience="All / Desktop", primary="Begin Checkout", fill_status=YELLOW,
    )
    write_log_row(
        log, 4, week=WEEK, test_id="BASKET", name="Payment methods phase 2 Desktop",
        status="Running", variant="Variant #1", data=PAY_DESK["variant"],
        audience="All / Desktop", primary="Purchase", fill_status=YELLOW,
    )
    write_log_row(
        log, 5, week=WEEK, test_id="BASKET", name="Payment methods phase 2 Mobile",
        status="Running", variant="Control", data=PAY_MOB["control"],
        audience="All / Mobile", primary="Purchase", fill_status=YELLOW,
    )
    write_log_row(
        log, 6, week=WEEK, test_id="BASKET", name="Payment methods phase 2 Mobile",
        status="Running", variant="Variant #1", data=PAY_MOB["variant"],
        audience="All / Mobile", primary="Purchase", fill_status=YELLOW,
    )
    log.delete_rows(7, 2)

    # Concluded header is now row 8, headers 9, first data 10
    log.insert_rows(10, 2)
    for col in range(1, 14):
        copy_style(log.cell(12, col), log.cell(10, col))
        copy_style(log.cell(13, col), log.cell(11, col))
    log.row_dimensions[10].height = 26
    log.row_dimensions[11].height = 26
    write_log_row(
        log, 10, week=WEEK, test_id="ATC", name="Sticky Add to basket",
        status="Concluded", variant="Control", data=ATC["control"],
        audience="All / Mobile", primary="Purchase", fill_status=GREY,
    )
    write_log_row(
        log, 11, week=WEEK, test_id="ATC", name="Sticky Add to basket",
        status="Concluded", variant="Variant #4", data=ATC["variant"],
        audience="All / Mobile", primary="Purchase", fill_status=GREY,
    )

    # --- Weekly summary ---
    summary["A2"] = HEADLINE

    write_summary_live(
        summary, 14, name="Payment methods phase 2 Desktop", status="Running",
        variant="Control", cr=41.17, lift="—", sig=96, value=46221.05,
        audience="All / Desktop · basket", notes=PAY_DESK["control"]["notes"],
        status_fill=YELLOW,
    )
    write_summary_live(
        summary, 15, name="Payment methods phase 2 Desktop", status="Running",
        variant="Variant #1", cr=43.57, lift="+5.9%", sig=97, value=48761.40,
        audience="All / Desktop · basket", notes=PAY_DESK["variant"]["notes"],
        status_fill=YELLOW,
    )
    write_summary_live(
        summary, 16, name="Payment methods phase 2 Mobile", status="Running",
        variant="Control", cr=32.83, lift="—", sig=85, value=47627.71,
        audience="All / Mobile · basket", notes=PAY_MOB["control"]["notes"],
        status_fill=YELLOW,
    )
    write_summary_live(
        summary, 17, name="Payment methods phase 2 Mobile", status="Running",
        variant="Variant #1", cr=31.61, lift="−3.7%", sig=85, value=46609.82,
        audience="All / Mobile · basket", notes=PAY_MOB["variant"]["notes"],
        status_fill=YELLOW,
    )
    for col in range(1, 10):
        summary.cell(18, col).value = None
        summary.cell(19, col).value = None

    summary.insert_rows(32, 2)
    for col in range(1, 10):
        copy_style(summary.cell(34, col), summary.cell(32, col))
        copy_style(summary.cell(35, col), summary.cell(33, col))
    write_summary_live(
        summary, 32, name="Sticky Add to basket", status="Concluded",
        variant="Control", cr=5.34, lift="—", sig=97, value=62250.35,
        audience="All / Mobile · PDP", notes=ATC["control"]["notes"],
        status_fill=GREY,
    )
    write_summary_live(
        summary, 33, name="Sticky Add to basket", status="Concluded",
        variant="Variant #4", cr=5.61, lift="+5.0%", sig=97, value=68054.38,
        audience="All / Mobile · PDP", notes=ATC["variant"]["notes"],
        status_fill=GREY,
    )

    # GA4 history: CE note for this Monday, no new site metrics
    ga4["A16"] = "26 Oct 2026 (CE update only)"
    ga4["M16"] = (
        "Crazy Egg as of 2 Nov. Site metrics for 26 Oct–1 Nov not in this file. "
        "Sticky ATC mobile concluded: add to basket +3.5% (99%), purchases +5.0% (97%), "
        "+£5,804 — ship. Payment phase 2 desktop still running: begin checkout +11.1% (100%), "
        "purchases +5.9% (97%), +£2,540 — run to 3 weeks then conclude. Mobile payment unchanged."
    )

    first = dests[0]
    wb.save(first)
    for extra in dests[1:]:
        copy2(first, extra)
    print("Wrote xlsx:", *dests)


def set_run(paragraph, text, *, bold=False, color=None):
    paragraph.clear()
    run = paragraph.add_run(text)
    run.bold = bold
    if color is not None:
        run.font.color.rgb = color
    return run


def add_runs(paragraph, parts):
    paragraph.clear()
    for text, bold, color in parts:
        run = paragraph.add_run(text)
        run.bold = bold
        if color is not None:
            run.font.color.rgb = color


def update_docx(src: Path, dests: list[Path]):
    doc = Document(str(src))
    p = doc.paragraphs

    set_run(p[0], "November 2nd", bold=True)
    add_runs(p[3], [
        ("Sticky ATC button - ", True, None),
        ("concluded", True, PURPLE_STATUS),
    ])
    add_runs(p[4], [
        ("Mobile. 3 weeks.", True, None),
        (
            " Add to basket is 3.5% higher. Purchases are 5.0% higher, about £5,800 more in sales. "
            "97% confidence. This is a win. Enough data. Conclude.",
            False,
            None,
        ),
        ("\n", False, None),
        ("Desktop", True, None),
        ("\n", False, None),
        ("Still running. No results pulled this week.", False, None),
    ])
    add_runs(p[6], [
        ("Basket payment methods, phase 2 - ", True, None),
        ("running", True, GREEN_STATUS),
    ])
    add_runs(p[7], [
        ("Desktop. 2.5 weeks.", True, None),
        (
            " Begin checkout is 11.1% higher. Purchases are 5.9% higher, about £2,500 more in sales. "
            "97% confidence. This is a win. Run to 3 weeks, then conclude.",
            False,
            None,
        ),
    ])
    add_runs(p[8], [
        ("Mobile", True, None),
        (".\nNo real difference. Begin checkout is 2.3% higher. Purchases are 3.7% lower. Figures as of 26 Oct.", False, None),
    ])

    first = dests[0]
    doc.save(first)
    for extra in dests[1:]:
        copy2(first, extra)
    print("Wrote docx:", *dests)


def main():
    xlsx_dests = [ROOT / OUT_XLSX_NAME, DOWNLOADS / OUT_XLSX_NAME, DOWNLOADS / "YG_Weekly_Report_updated.xlsx"]
    docx_dests = [ROOT / OUT_DOCX_NAME, DOWNLOADS / OUT_DOCX_NAME]
    update_xlsx(SRC_XLSX, xlsx_dests)
    update_docx(SRC_DOCX, docx_dests)


if __name__ == "__main__":
    main()
