# Miro Sidekick prompts — YouGarden automation journeys

Copy one prompt into Miro Sidekick → **Map user journey** (or the “I want to create…” box).

After generation: rename nodes to match program IDs, add exit/suppression notes, and place in the correct P0–P3 frame.

---

## P0 — September go-live (start here)

Use **two Sidekick runs** per board: (1) overview frame, then (2) one detailed flow per program.

### P0 overview — triggers → programs → Dotdigital

Paste this first. **Strict version** — fixes Sidekick adding "P0 — September" as a hub node or arrow labels.

```
Create a strict left-to-right architecture flowchart. Exactly 7 flow nodes — no more, no less.

STRICT RULES (do not break):
- "P0 — September" is ONLY a frame/group border around the 4 program boxes — NOT a flow node, NOT a parallelogram, NO arrows to or from it
- Do NOT add arrow labels (no "feeds", "submits", "contains", "sends", or any text on connectors)
- Do NOT add extra nodes, decision diamonds, or steps
- Layout: 3 columns left → right

COLUMN 1 — Triggers (2 nodes, stacked vertically, rounded rectangles):
  • Fresh Relevance
  • Signup form

COLUMN 2 — Programs inside a dashed frame titled "P0 — September" (4 nodes, stacked vertically, plain rectangles):
  • P0.1 Cart non-member
  • P0.2 Cart member
  • P0.3 Browse abandon
  • P0.4 Welcome signup

COLUMN 3 — Output (1 node, rectangle):
  • Dotdigital sends

CONNECTIONS (plain arrows only, no labels):
  Fresh Relevance → P0.1 Cart non-member
  Fresh Relevance → P0.2 Cart member
  Fresh Relevance → P0.3 Browse abandon
  Signup form → P0.4 Welcome signup
  P0.1 Cart non-member → Dotdigital sends
  P0.2 Cart member → Dotdigital sends
  P0.3 Browse abandon → Dotdigital sends
  P0.4 Welcome signup → Dotdigital sends

That is the complete diagram. Match this structure exactly.
```

**If Sidekick already generated the wrong diagram**, paste this fix prompt instead:

```
Fix this flowchart to match the spec exactly:

REMOVE: the "P0 — September" parallelogram/node and all "contains" arrows. Remove all arrow labels ("feeds", "submits", "contains", "sends").

KEEP only these 7 nodes: Fresh Relevance, Signup form, P0.1 Cart non-member, P0.2 Cart member, P0.3 Browse abandon, P0.4 Welcome signup, Dotdigital sends.

Put the 4 program nodes inside a frame titled "P0 — September" (border only, not a flow shape).

Arrows (no labels): Fresh Relevance → P0.1, P0.2, P0.3. Signup form → P0.4. All four programs → Dotdigital sends. Left-to-right layout.
```

### P0.1 — Cart abandon (non-member) — detailed flowchart

```
Create a top-down flowchart (decision-tree style) for YouGarden cart abandonment — non-member program P0-CART-ABANDON-NON-MEMBER.

Use these exact nodes and connections:

START (rounded): "Cart abandoned 15+ min"
→ DECISION (diamond): "club_member?"
  → Yes → END (rounded): "Go to P0.2"
  → No → ACTION (rectangle): "Email 1 — 45-90 min / Cart layout + images"
    → DECISION: "Purchased?"
      → Yes → END: "Exit — recovered"
      → No → DELAY (rectangle): "Delay 24h"
        → DECISION: "rfm_segment?"
          → Repeat → ACTION: "Email 2 — reminder only"
          → First-time → ACTION: "Email 2 — reminder + reviews"
        (both Email 2 paths merge)
        → DECISION: "Purchased?"
          → Yes → END: "Exit"
          → No → DELAY: "Delay 48h"
            → ACTION: "Email 3 — Club upsell or modest offer"
            → END: "Exit — max 3 emails"

Label Yes/No on every decision branch. Top-down vertical layout like a Mermaid flowchart TD.
```

### P0.2 — Cart abandon (Club member) — detailed flowchart

```
Create a top-down flowchart for YouGarden cart abandonment — Club member program P0-CART-ABANDON-MEMBER.

START (rounded): "Cart abandoned 15+ min"
→ DECISION: "club_member = Y?"
  → No → END: "Go to P0.1"
  → Yes → ACTION: "Email 1 — 45-90 min / Member saving applied"
    → DECISION: "Purchased?" → Yes → END: "Exit"
    → No → DELAY: "Delay 24h"
      → ACTION: "Email 2 — stock / dispatch / guarantee"
      → DECISION: "Purchased?" → Yes → END: "Exit"
      → No → DELAY: "Delay 48h"
        → ACTION: "Email 3 — final reminder, no extra discount"
        → END: "Exit"

Note on diagram: "Never escalate discount for members". Top-down vertical layout.
```

### P0.3 — Browse abandon — detailed flowchart

```
Create a top-down flowchart for YouGarden browse abandonment program P0-BROWSE-ABANDON. Max 2 emails.

START (rounded): "Session ended — browsed, no cart"
→ DECISION: "Email known?"
  → No → END: "No send"
  → Yes → ACTION: "Email 1 — ~1h / Viewed products layout"
    → DECISION: "Carted or purchased?"
      → Yes → END: "Exit — cart program takes over"
      → No → DELAY: "Delay 24h"
        → ACTION: "Email 2 — similar + seasonal tip"
        → DECISION: "club_member?"
          → No → ACTION: "Club footer CTA"
          → Yes → ACTION: "Member picks only"
        (both merge) → END: "Exit — max 2 emails"

Top-down vertical flowchart with Yes/No labels on decisions.
```

### P0.4 — Welcome signup — detailed flowchart

```
Create a top-down flowchart for YouGarden welcome series program P0-WELCOME-SIGNUP (Dotdigital only, triggered by signup form).

START (rounded): "New newsletter subscriber"
→ ACTION: "Email 1 — immediate / Thank you + USPs + code if promised"
→ DELAY: "Delay 2-3 days"
→ DECISION: "First purchase?" → Yes → END: "Exit → P1.1 Post-purchase"
→ No → ACTION: "Email 2 — brand story + seasonal inspiration"
→ DELAY: "Delay 3-4 days"
→ DECISION: "First purchase?" → Yes → END: "Exit"
→ No → ACTION: "Email 3 — Shop now or Club £10/yr"
→ DELAY: "Delay 7 days"
→ DECISION: "First purchase?" → Yes → END: "Exit"
→ No → ACTION: "Code expiry reminder if issued"
→ END: "Exit welcome track"

Top-down vertical flowchart. Label purchase-check exits clearly.
```

---

## P1 — Retention & Club lifecycle (overview)

Use before the individual P1.1–P1.4 detail flows.

### P1 overview — triggers → programs → Dotdigital

```
Create a strict left-to-right architecture flowchart for YouGarden P1 lifecycle programs.

STRICT RULES:
- "P1 — Retention & Club lifecycle" is ONLY a frame border around the program boxes — NOT a flow node
- "Transactional emails (AMO)" is a note/sticky — dashed line only, NOT in the send path
- Layout: 3 columns left → right

COLUMN 1 — Triggers (3 nodes, stacked):
  • AMO order webhook (plants)
  • AMO Club purchase 820001
  • AMO renewal / payment data

COLUMN 1b — Separate trigger (below or beside AMO):
  • Fresh Relevance custom events

COLUMN 2 — Programs inside frame "P1 — Retention & Club lifecycle" (5 nodes, stacked):
  • P1.1 Post-purchase care
  • P1.2 Club welcome
  • P1.3 Club renewal
  • P1.3b Failed payment (branch from P1.3)
  • P1.4 Custom triggers

COLUMN 3 — Output (1 node):
  • Dotdigital sends

CONNECTIONS:
  AMO order webhook → P1.1 Post-purchase
  AMO Club 820001 → P1.2 Club welcome
  AMO renewal data → P1.3 Club renewal
  P1.3 → P1.3b Failed payment (payment failed only)
  Fresh Relevance custom events → P1.4 Custom triggers
  All P1 programs → Dotdigital sends

NOTE (sticky, not a flow node): "Transactional order confirm + dispatch = AMO/m tech only — separate from these programs"

No extra nodes. Plain arrows only.
```

---

## Master journey

```
Create a user journey map for YouGarden.com email automation migration to Dotdigital.

Entry points: browse PDP, add to cart and leave, newsletter signup, Plant Finder / PDF / video custom triggers, purchase plants, purchase Club membership (£10/yr SKU 820001), no purchase seasonal, FR product signals.

Programs:
- P0: cart abandon non-member, cart abandon member, browse abandon, welcome signup
- P1: post-purchase care, Club welcome, Club renewal + failed payment, custom triggers
- P2: voucher reminders, Club cart abandon, lapsing/lapsed, Club lapsed
- P3: back in stock, price drop, member early access, high-LTV Club pitch

Show Gary broadcasts as a separate lane that suppresses some automations. Use swimlanes for P0/P1/P2/P3 priority.
```

---

## P0.1 — Cart abandon (non-member)

```
Map an email user journey for e-commerce cart abandonment for YouGarden.com (garden plants retailer).

Trigger: cart abandoned 15+ minutes, customer is NOT a Club member.
Platform: Fresh Relevance trigger → Dotdigital program P0-CART-ABANDON-NON-MEMBER.

Steps:
1. Decision: club_member? If yes → exit to member program
2. Email 1 at 45–90 min: cart layout with product images
3. Decision: purchased? If yes → exit recovered
4. Delay 24h
5. Decision: RFM segment — repeat buyer gets reminder only; first-time gets reminder + reviews
6. Decision: purchased? If yes → exit
7. Delay 48h
8. Email 3: Club upsell or modest offer (max 3 emails total)

Include exit nodes for purchase recovery and note Gary broadcast suppression.
```

---

## P0.2 — Cart abandon (Club member)

```
Map an email user journey for cart abandonment for YouGarden Club members.

Trigger: cart abandoned 15+ min, club_member = Y.
Program: P0-CART-ABANDON-MEMBER (FR + Dotdigital).

Steps:
1. If not Club member → route to non-member program
2. Email 1 (45–90 min): member saving already applied, cart products
3. Purchased? → exit
4. Delay 24h → Email 2: stock, dispatch, guarantee messaging (no extra discount)
5. Purchased? → exit
6. Delay 48h → Email 3: final reminder only
7. Exit — never escalate discount for members
```

---

## P0.3 — Browse abandon

```
Map a browse abandonment email journey for YouGarden.com.

Trigger: session ended, browsed products but no cart. Fresh Relevance browse abandon.
Program: P0-BROWSE-ABANDON. Max 2 emails.

Steps:
1. Email known? If no → stop (no send)
2. Email 1 ~1h: viewed products layout (FR Recently Browsed data)
3. Carted or purchased? → exit (cart program takes over)
4. Delay 24h → Email 2: similar products + seasonal tip
5. Branch: non-member gets Club footer CTA; member gets member picks only
6. Exit
```

---

## P0.4 — Welcome signup

```
Map a welcome email series for new YouGarden newsletter subscribers.

Program: P0-WELCOME-SIGNUP (Dotdigital only).

Steps:
1. Email 1 immediate: thank you, USPs, promo code if promised on signup form
2. Delay 2–3 days → first purchase? → exit to post-purchase
3. Email 2: brand story + seasonal inspiration
4. Delay 3–4 days → first purchase? → exit
5. Email 3: shop now or Club £10/year pitch
6. Delay 7 days → purchase? → exit
7. Optional: code expiry reminder if code was issued
8. Exit welcome track
```

---

## P1.1 — Post-purchase care

```
Map a post-purchase email journey for YouGarden plant orders.

Trigger: order placed (plant/product SKU, exclude Club-only orders).
Program: P1-POST-PURCHASE.

Steps:
1. Transactional order confirmation (separate from automation)
2. Delay 2–3 days post dispatch → care/planting guide email
3. Delay 11–14 days → review request + customer service link
4. If Club member → exit
5. If order_count >= 2 or LTV threshold → Club savings recap email
6. Exit
```

---

## P1.2 — Club welcome

```
Map onboarding emails for new YouGarden Discount Club members.

Trigger: Club membership purchased (SKU 820001, £10/year auto-renew).
Program: P1-CLUB-WELCOME.

Steps:
1. Email 1 immediate: perks (15% plants, 7.5% machinery, vouchers), log in with membership email
2. Delay 3 days → logged-in purchase since join? → exit activated
3. Email 2: how to log in + support
4. Delay 4 days → logged-in purchase? → exit
5. Email 3: customer service contact offer
6. Exit
```

---

## P1.3 — Club renewal + failed payment

```
Map two connected journeys for YouGarden Club renewal.

A) Pre-renewal (club_auto_renew = Y):
- T-30 days: savings recap + £10 price locked
- T-14: renewal reminder
- T-7: short reminder
- Renewal successful → exit
- Payment failed → branch B

B) Failed payment (club_payment_failed = Y):
- Email immediate: update payment method
- Delay 3 days: discounts paused warning
- Payment fixed? → exit
- Email 3: final before lapse
- Route to Club lapsed program P2-CLUB-LAPSED
```

---

## P1.4 — Custom trigger: Plant Finder

```
Map a custom trigger email journey for YouGarden Plant Finder completion.

Trigger: user completes Plant Finder quiz (FR custom JS event).
Program: P1-CT-PLANT-FINDER.

Steps:
1. Email 1 ~1h: top 3 matched plants with links
2. Purchased? → exit
3. Delay 24h → Email 2: seasonal tip + link back to results
4. Exit (max 2 emails)
```

---

## P2.1 — Club £5 voucher reminder

```
Map voucher reminder emails for YouGarden Club members.

Trigger: £5 voucher issued to active member.
Program: P2-CLUB-VOUCHER-5.

Steps:
1. Delay 7 days → redeemed? → exit
2. Email 1: voucher + personalised product picks
3. Delay 14 days → redeemed? → exit
4. Email 2: last chance this season
5. Exit
```

---

## P2.2 — Club cart abandon

```
Map cart abandonment when customer has Club membership SKU 820001 in cart but is not yet a member.

Program: P2-CLUB-CART-ABANDON.

Steps:
1. Trigger: Club SKU in cart, abandoned 15+ min, club_member = N
2. Branch: plants also in cart → combined savings maths email; Club only → perks £10/yr email
3. Delay 24h → purchased? → exit to Club welcome
4. Email 2: price lock + voucher pack
5. Exit
```

---

## P2.3 — Lapsing + lapsed win-back

```
Map two re-engagement journeys for YouGarden.

A) Lapsing seasonal (expected spring buyer, no order by mid-Feb):
- Email 1: planting window open
- Delay 2 weeks → Email 2: category picks from history
- Email 3: member gets voucher + early access; non-member gets bestsellers

B) Lapsed win-back (no purchase 12+ months):
- Email 1: soft what's new
- Delay 7 days → Email 2: personalised from history
- Email 3: modest offer if no opens; value-led if engaged
- Delay 7 days → Email 4: sunset/breakup
- Exit
```

---

## P2.4 — Club lapsed rejoin

```
Map win-back for lapsed YouGarden Club members.

Trigger: membership expired, was member in last 90 days.
Program: P2-CLUB-LAPSED.

Steps:
1. Delay 14 days → Email: rejoin + savings recap
2. Delay 14 days → Email 2: £10 price lock reminder
3. Rejoined? → route to Club welcome P1.2
4. Exit
```

---

## P3.1 — Back in stock

```
Map a single-email journey for back-in-stock alerts.

Trigger: Fresh Relevance — customer viewed OOS product, now back in stock.
Program: P3-BACK-IN-STOCK.

Steps:
1. Email immediate: product + dispatch info
2. Branch: Club member sees member price; non-member sees standard + Club footer
3. Exit (1 email only)
```

---

## P3.2 — Price drop

```
Map a single-email journey for price drop alerts.

Trigger: Fresh Relevance — browsed product price dropped.
Program: P3-PRICE-DROP.

Steps:
1. Email immediate: product + new price
2. Club member: show member price vs sale; non-member: standard + Club footer
3. Exit (1 email)
```

---

## P3.3 — Member early access

```
Map member early access before a site-wide sale.

Trigger: sale scheduled, T-48h, club_member = Y.
Program: P3-MEMBER-EARLY-ACCESS.

Steps:
1. Email: member early access to sale
2. Delay 48h → Gary broadcast to wider list
3. Exit — coordinate send timing with Gary's team
```

---

## P3.4 — High-LTV Club pitch

```
Map a Club upsell for high-value non-members.

Trigger: order_count >= 3 and LTV threshold, club_member = N.
Program: P3-CLUB-HIGH-LTV.

Steps:
1. Email: "You'd have saved £X with Club"
2. Delay 7 days → joined Club? → exit
3. Exit — suppress Club pitch for 90 days if no join
```
