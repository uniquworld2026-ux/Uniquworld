#!/usr/bin/env python3
"""Generate ORDER_FULFILLMENT_WORKFLOW.pdf with diagrams and tables."""

from __future__ import annotations

import os
from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
TMP = ROOT / "tmp" / "pdfs"
OUT = ROOT / "docs" / "ORDER_FULFILLMENT_WORKFLOW.pdf"
LOGO = ROOT / "server" / "assets" / "email" / "Uniquworld.jpg"

BRAND = colors.HexColor("#4a3426")
ACCENT = colors.HexColor("#0a2d4d")
MUTED = colors.HexColor("#6b7280")
LIGHT = colors.HexColor("#f5efe8")
TABLE_HEAD = colors.HexColor("#4a3426")
TABLE_ALT = colors.HexColor("#faf7f4")


def build_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=26,
            textColor=BRAND,
            spaceAfter=12,
            alignment=TA_CENTER,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=12,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=20,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            textColor=ACCENT,
            spaceBefore=14,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            textColor=BRAND,
            spaceBefore=10,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.black,
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            leftIndent=14,
            bulletIndent=0,
            spaceAfter=4,
        ),
        "caption": ParagraphStyle(
            "Caption",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=9,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=12,
        ),
        "footer": ParagraphStyle(
            "Footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=MUTED,
        ),
    }


def header_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setStrokeColor(BRAND)
    canvas.setLineWidth(2)
    canvas.line(2 * cm, h - 1.4 * cm, w - 2 * cm, h - 1.4 * cm)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.setFillColor(BRAND)
    canvas.drawString(2 * cm, h - 1.15 * cm, "Uniquworld")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(w - 2 * cm, h - 1.15 * cm, "Order & Delivery Workflow")
    canvas.setFont("Helvetica", 8)
    canvas.drawCentredString(w / 2, 1.2 * cm, f"Page {doc.page}")
    canvas.drawRightString(w - 2 * cm, 1.2 * cm, date.today().isoformat())
    canvas.restoreState()


def cover_header_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setFillColor(LIGHT)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)
    canvas.setFillColor(BRAND)
    canvas.rect(0, h - 0.6 * cm, w, 0.6 * cm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, w, 0.4 * cm, fill=1, stroke=0)
    canvas.restoreState()


def scaled_image(path: Path, max_w: float, max_h: float) -> Image | None:
    if not path.exists():
        return None
    img = Image(str(path))
    iw, ih = img.imageWidth, img.imageHeight
    scale = min(max_w / iw, max_h / ih, 1.0)
    img.drawWidth = iw * scale
    img.drawHeight = ih * scale
    img.hAlign = "CENTER"
    return img


def table(data, col_widths=None, header_rows=1):
    t = Table(data, colWidths=col_widths, repeatRows=header_rows)
    style = [
        ("BACKGROUND", (0, 0), (-1, header_rows - 1), TABLE_HEAD),
        ("TEXTCOLOR", (0, 0), (-1, header_rows - 1), colors.white),
        ("FONTNAME", (0, 0), (-1, header_rows - 1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e5e7eb")),
        ("ROWBACKGROUNDS", (0, header_rows), (-1, -1), [colors.white, TABLE_ALT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    t.setStyle(TableStyle(style))
    return t


def main():
    os.makedirs(TMP, exist_ok=True)
    os.makedirs(OUT.parent, exist_ok=True)
    s = build_styles()
    story = []

    # --- Cover ---
    cover = SimpleDocTemplate(
        str(OUT.with_suffix(".cover.tmp.pdf")),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    cover_story = []
    if LOGO.exists():
        logo = scaled_image(LOGO, 5 * cm, 3 * cm)
        if logo:
            cover_story.append(logo)
            cover_story.append(Spacer(1, 1.2 * cm))
    cover_story += [
        Spacer(1, 3 * cm),
        Paragraph("Order &amp; Delivery Workflow", s["title"]),
        Paragraph(
            "Customer checkout, Razorpay payment, Shiprocket shipment,<br/>"
            "office pickup, and home delivery",
            s["subtitle"],
        ),
        Spacer(1, 1.5 * cm),
        Paragraph(f"Document date: {date.today().strftime('%d %B %Y')}", s["subtitle"]),
        Paragraph("Uniquworld eCommerce Platform", s["subtitle"]),
        PageBreak(),
    ]

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=1.8 * cm,
        rightMargin=1.8 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        title="Uniquworld Order & Delivery Workflow",
        author="Uniquworld",
    )

    story += cover_story[1:]  # skip duplicate cover elements from cover_story start

    # Rebuild cover in main doc properly
    story = []
    if LOGO.exists():
        logo = scaled_image(LOGO, 5 * cm, 3 * cm)
        if logo:
            story.append(Spacer(1, 2.5 * cm))
            story.append(logo)
            story.append(Spacer(1, 1 * cm))
    story += [
        Paragraph("Order &amp; Delivery Workflow", s["title"]),
        Paragraph(
            "End-to-end flow from checkout through payment, Shiprocket,<br/>"
            "office pickup, and customer delivery.",
            s["subtitle"],
        ),
        Spacer(1, 0.8 * cm),
        Paragraph(f"Generated: {date.today().strftime('%d %B %Y')}", s["subtitle"]),
        PageBreak(),
    ]

    # Overview
    story.append(Paragraph("1. Overview", s["h1"]))
    story.append(
        Paragraph(
            "This document describes how Uniquworld processes orders from the moment a customer "
            "checks out until the parcel is delivered. The platform integrates Razorpay for online "
            "payments and Shiprocket for courier pickup from your office (Primary location) and "
            "delivery to the customer.",
            s["body"],
        )
    )
    story.append(Spacer(1, 0.3 * cm))
    img = scaled_image(TMP / "actors.png", 16 * cm, 7 * cm)
    if img:
        story.append(img)
        story.append(Paragraph("Figure 1 - Actors and responsibilities", s["caption"]))

    story.append(PageBreak())

    # Workflow flowchart
    story.append(Paragraph("2. End-to-end workflow (diagram)", s["h1"]))
    img = scaled_image(TMP / "workflow-flowchart.png", 16.5 * cm, 11 * cm)
    if img:
        story.append(img)
        story.append(Paragraph("Figure 2 - Three phases: Checkout, Payment, Fulfillment", s["caption"]))
    story.append(PageBreak())

    # Sequence diagram
    story.append(Paragraph("3. Sequence diagram", s["h1"]))
    story.append(
        Paragraph(
            "Detailed message flow between Customer, Uniquworld API, Razorpay, Shiprocket, "
            "your office, and the courier.",
            s["body"],
        )
    )
    img = scaled_image(TMP / "sequence.png", 16.5 * cm, 10.5 * cm)
    if img:
        story.append(img)
        story.append(Paragraph("Figure 3 - Order and delivery sequence", s["caption"]))
    story.append(PageBreak())

    # Timeline - landscape page via custom table on portrait with smaller cols
    story.append(Paragraph("4. Timeline", s["h1"]))
    timeline = [
        ["Step", "When", "Who", "What happens", "Order", "Shipment"],
        ["1", "T+0", "Customer", "Adds items, address, payment choice", "-", "-"],
        ["2", "T+0", "Uniquworld", "Creates order + line items", "pending", "-"],
        ["3a", "T+0-2m", "Customer + Razorpay", "Online payment", "pending", "-"],
        ["3b", "T+0", "Uniquworld", "COD: skip gateway", "confirmed", "-"],
        ["4", "After pay", "Uniquworld", "Verify payment / confirm COD", "confirmed", "-"],
        ["5", "After 4", "Uniquworld", "Push to Shiprocket (pickup Primary)", "processing", "created"],
        ["6", "Same day", "Your office", "Pick, pack, weigh, print label", "processing", "-"],
        ["7", "Same day", "Your team", "Shiprocket: assign courier, schedule", "processing", "AWB"],
        ["8", "Pickup day", "Courier", "Collect from office", "processing", "picked up"],
        ["9", "2-7 days", "Courier", "In transit / out for delivery", "processing", "in transit"],
        ["10", "Delivery", "Courier + Customer", "Handover at address", "delivered", "delivered"],
        ["11", "After 10", "Uniquworld", "Store earnings credited (if store item)", "delivered", "-"],
    ]
    story.append(
        table(
            timeline,
            col_widths=[1.0 * cm, 1.6 * cm, 2.4 * cm, 5.8 * cm, 2.2 * cm, 2.2 * cm],
        )
    )
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Typical elapsed time", s["h2"]))
    story.append(
        table(
            [
                ["Phase", "Estimate"],
                ["Checkout + payment", "1-5 minutes"],
                ["Pack + schedule pickup", "Same day (your SLA)"],
                ["Courier pickup to delivery", "2-7 days (pincode + courier)"],
            ],
            col_widths=[8 * cm, 8 * cm],
        )
    )
    story.append(PageBreak())

    # Payment paths
    story.append(Paragraph("5. Payment paths", s["h1"]))
    story.append(Paragraph("Online (Razorpay)", s["h2"]))
    for line in [
        "POST /api/v1/account/orders - place order, get Razorpay order id",
        "Customer completes Razorpay checkout in browser",
        "POST /api/v1/account/orders/verify-payment - verify signature",
        "Server creates Shiprocket shipment automatically",
    ]:
        story.append(Paragraph(f"- {line}", s["bullet"]))
    story.append(Paragraph("Cash on delivery (COD)", s["h2"]))
    for line in [
        "POST /api/v1/account/orders with paymentMethod: cod",
        "Order confirmed immediately; Shiprocket shipment in same request",
        "Courier collects cash on delivery",
        "Requires COD_ENABLED=true in server environment",
    ]:
        story.append(Paragraph(f"- {line}", s["bullet"]))
    story.append(PageBreak())

    # Shiprocket + statuses
    story.append(Paragraph("6. Shiprocket pickup (your office)", s["h1"]))
    story.append(
        Paragraph(
            "Environment variable SHIPROCKET_PICKUP_LOCATION=Primary must match the Location Name "
            "in Shiprocket Settings - Pickup Locations.",
            s["body"],
        )
    )
    story.append(Paragraph("App does automatically", s["h2"]))
    for line in [
        "Creates Shiprocket adhoc order with customer address and items",
        "Sets COD or Prepaid based on payment method",
        "Stores AWB, tracking URL, Shiprocket order/shipment ids",
    ]:
        story.append(Paragraph(f"- {line}", s["bullet"]))
    story.append(Paragraph("Your team does in Shiprocket panel", s["h2"]))
    for line in [
        "Assign courier",
        "Schedule pickup time",
        "Print shipping label",
        "Handle failed delivery / RTO",
    ]:
        story.append(Paragraph(f"- {line}", s["bullet"]))

    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("Order statuses", s["h2"]))
    story.append(
        table(
            [
                ["Status", "Meaning"],
                ["pending", "Placed; awaiting online payment"],
                ["confirmed", "Paid or COD accepted"],
                ["processing", "Shipment created; fulfillment in progress"],
                ["shipped", "Handed to courier (optional admin update)"],
                ["delivered", "Received by customer"],
                ["cancelled", "Cancelled by customer or admin"],
            ],
            col_widths=[3.5 * cm, 12.5 * cm],
        )
    )
    story.append(PageBreak())

    # Admin + env
    story.append(Paragraph("7. Admin and environment", s["h1"]))
    story.append(Paragraph("Delivery modes", s["h2"]))
    story.append(
        table(
            [
                ["Mode", "Use when"],
                ["Auto (Shiprocket)", "Default - API creates Shiprocket order after payment"],
                ["Manual delivery", "Own staff or local courier - admin enters AWB in ERP"],
            ],
            col_widths=[4 * cm, 12 * cm],
        )
    )
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("Environment checklist", s["h2"]))
    story.append(
        table(
            [
                ["Variable", "Purpose"],
                ["RAZORPAY_KEY_ID / SECRET", "Online payments"],
                ["COD_ENABLED", "Allow cash on delivery"],
                ["SHIPROCKET_ENABLED", "Real shipments (false = mock in dev)"],
                ["SHIPROCKET_EMAIL / PASSWORD", "Shiprocket API login"],
                ["SHIPROCKET_PICKUP_LOCATION", "Must match pickup name in Shiprocket"],
                ["SHIPROCKET_CHANNEL_ID", "From Shiprocket Settings - Channels"],
            ],
            col_widths=[5.5 * cm, 10.5 * cm],
        )
    )
    story.append(Spacer(1, 0.6 * cm))
    story.append(Paragraph("Quick reference", s["h2"]))
    story.append(
        table(
            [
                ["Role", "Responsibility"],
                ["Customer", "Browse, pay, receive parcel"],
                ["Uniquworld", "Orders, payments, Shiprocket API, notifications"],
                ["Razorpay", "Payment gateway (online only)"],
                ["Shiprocket", "Courier network, AWB, labels, tracking"],
                ["Your office", "Stock, pack, schedule pickup"],
                ["Courier", "Pickup from office, deliver to customer"],
            ],
            col_widths=[3.5 * cm, 12.5 * cm],
        )
    )
    story.append(Spacer(1, 0.8 * cm))
    story.append(
        Paragraph(
            "Related: docs/ORDER_FULFILLMENT_WORKFLOW.md | server/docs/ARCHITECTURE.md | server/.env.example",
            s["caption"],
        )
    )

    doc.build(story, onFirstPage=cover_header_footer, onLaterPages=header_footer)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
