# YouGarden — Automation Implementation Playbook

**Purpose:** Implement Dotdigital + Fresh Relevance programs **one at a time**, in priority order.  
**Audience:** Marketing, Jemma (segments), dev/FR admin, Dotdigital setup.

**Related docs:**
- [Trigger settings](./fresh-relevance-trigger-settings-best-practices.md)
- [Migration research](./dotdigital-automation-migration-research.md)
- [Program mappings (reference)](./yougarden-dotdigital-program-mappings.md)
- [Miro import pack](./miro-import/README.md) — SVG flows, Sidekick prompts, build tracker CSV

**Club product:** [YG Discount Club Annual Membership](https://www.yougarden.com/item-p-820001/yg-discount-club-annual-membership) — £10/year, auto-renew, price locked.

---

## How to use this playbook

Each program block includes:

1. **When to build** — priority and dependencies  
2. **Journey map** — Mermaid flowchart (renders in Cursor / GitHub preview)  
3. **Dotdigital build steps** — start → decisions → actions → exits  
4. **Fresh Relevance** — trigger / cart layout / settings  
5. **Data fields** — contact attributes required  
6. **Test scenario** — walkthrough before go-live  
7. **Go-live checklist** — tick boxes  

**Implement in numbered order** at the bottom of this doc.

---

## Master customer journey map

```mermaid
flowchart TD
    VISIT([Visitor on yougarden.com])

    VISIT --> BROWSE[Browse PDP]
    VISIT --> CART[Add to cart and leave]
    VISIT --> SIGNUP[Newsletter signup]
    VISIT --> CUSTOM[Plant Finder / PDF / Video]

    BROWSE --> P03[P0.3 Browse abandon]
    CART --> P01[P0.1 Cart abandon non-member]
    CART --> P02[P0.2 Cart abandon member]
    CART --> P22[P2.2 Club cart abandon]
    SIGNUP --> P04[P0.4 Welcome series]
    CUSTOM --> P14[P1.4 Custom triggers]

    VISIT --> BUYPLANT[Purchase plants]
    VISIT --> BUYCLUB[Purchase Club 820001]
    VISIT --> NOPURCH[No purchase seasonal / 12mo+]
    VISIT --> FRPROD[FR product signal]

    BUYPLANT --> P11[P1.1 Post-purchase care]
    BUYCLUB --> P12[P1.2 Club welcome]
    P12 --> MEMBER[Active member]
    MEMBER --> P21[P2.1 Voucher reminders]
    MEMBER --> P13[P1.3 Club renewal]
    P13 -->|Payment failed| P13F[P1.3 Failed payment]
    MEMBER --> P24[P2.4 Club lapsed]

    NOPURCH --> P23[P2.3 Lapsing / Lapsed]
    FRPROD --> P31[P3.1 Back in stock]
    FRPROD --> P32[P3.2 Price drop]

    GARY[Gary broadcasts] -.->|suppress where noted| P01
    GARY -.-> P03
```

---

## Foundation (before P0)

Complete **once** before building any program.

### F.1 Fresh Relevance global trigger settings

| Setting | Value |
|---------|-------|
| Abandonment unattended interval | 15+ min |
| Contact remarketing pressure | ~24h (1435 min) |
| Remarketing slice size | ~120 min (align with program spacing) |
| Max cart items | 50 |
| Max cart value | £100k equivalent |
| Post-purchase abandon suppression | 1 day |
| Purchase signal dedupe | 60s / 600s |

Full detail: [fresh-relevance-trigger-settings-best-practices.md](./fresh-relevance-trigger-settings-best-practices.md)

### F.2 Dotdigital contact data fields

Create / sync these before programs go live:

| Field | Type | Source |
|-------|------|--------|
| `club_member` | Y/N | Order / account |
| `club_renewal_date` | Date | Account |
| `club_auto_renew` | Y/N | Account |
| `club_payment_failed` | Y/N | Payment webhook |
| `email_permission` | Y/N | Opt-in |
| `signup_discount_code` | Text | Signup form |
| `signup_discount_expiry` | Date | Signup form |
| `last_purchase_date` | Date | Orders |
| `last_purchase_category` | Text | Orders |
| `order_count` | Number | Orders |
| `lifetime_value` | Number | Orders |
| `rfm_segment` | Text | RFM job / segment |
| `voucher_5_balance` | Number | Club system |
| `voucher_pp_balance` | Number | Club system |

### F.3 Suppression rules (global)

| Rule | Applies to |
|------|------------|
| Exit on purchase | All abandon / welcome / win-back programs |
| Exit on unsubscribe | All programs |
| Club members excluded from “join Club” upsells | P0 cart E3, P0 browse, P1 post-purchase |
| Gary promo suppress segment → delay E2/E3 48h | P0 cart, P0 browse |
| Failed renewal → suppress join Club upsells | All acquisition |
| FR slice size blocks overlapping program **starts** | Cart vs browse |

### F.4 Jemma session outputs

- [ ] Segment dictionary (name, definition, owner)  
- [ ] `club_member` segment accurate  
- [ ] RFM or repeat-buyer segment for P0 cart  
- [ ] Seasonal lapsing segment definition (P2.3)  
- [ ] Gary broadcast suppress segment  

---

# P0 — September go-live

**Goal:** Highest-intent recovery + new subscriber onboarding.  
**Programs:** 5 (cart ×2, browse, welcome, welcome code expiry)

---

## P0.1 — Cart abandonment (non-member)

| | |
|--|--|
| **Program ID** | `P0-CART-ABANDON-NON-MEMBER` |
| **Platform** | FR cart trigger → Dotdigital program (or FR send via cart layout) |
| **Build order** | **#1** |

### Journey map

```mermaid
flowchart TD
    START([Cart abandoned 15+ min]) --> CLUB{club_member?}
    CLUB -->|Yes| P02([Go to P0.2])
    CLUB -->|No| E1["Email 1 — 45-90 min<br/>Cart layout + images"]
    E1 --> PURCH1{Purchased?}
    PURCH1 -->|Yes| EXIT1([Exit — recovered])
    PURCH1 -->|No| D1[Delay 24h]
    D1 --> RFM{rfm_segment?}
    RFM -->|Repeat| E2A[Email 2 — reminder only]
    RFM -->|First-time| E2B[Email 2 — reminder + reviews]
    E2A --> PURCH2{Purchased?}
    E2B --> PURCH2
    PURCH2 -->|Yes| EXIT2([Exit])
    PURCH2 -->|No| D2[Delay 48h]
    D2 --> E3[Email 3 — Club upsell or modest offer]
    E3 --> EXIT3([Exit — max 3 emails])
```

### Dotdigital program builder

| Step | Type | Config |
|------|------|--------|
| 1 | **Start** | FR integration enrolls contact OR segment: abandoned cart, `club_member = N`, email known |
| 2 | **Entry filter** | `email_permission = Y`, cart items ≤ 50, cart value < £100k, not in Gary suppress |
| 3 | **Action** | Send Email 1 (delay 45–90 min from enroll if DD-led) |
| 4 | **Decision** | Purchased since start? → Yes: exit |
| 5 | **Delay** | 24 hours |
| 6 | **Decision** | `rfm_segment` = repeat/high → Email 2A; else → Email 2B |
| 7 | **Decision** | Purchased? → exit |
| 8 | **Delay** | 48 hours |
| 9 | **Action** | Send Email 3 (Club maths or modest offer — RFM-led) |
| 10 | **Exit** | End program |

### Fresh Relevance

- Cart abandon trigger program (3 stages if FR sends directly)  
- Cart layout on all emails  
- Align stage delays with table above  
- Marketing rule: `club_member = N` for this program variant  

### Emails

| # | Timing | Subject angle | Dynamic content |
|---|--------|---------------|-----------------|
| E1 | 45–90 min | “Still thinking about your [plant]?” | Cart lines, images, total |
| E2a | +24h | Reminder only (repeat buyers) | Cart + dispatch info |
| E2b | +24h | Social proof (first-time) | Reviews + cart |
| E3 | +48h | “Save £X with Club for £10/yr” | Cart + break-even |

### Test scenario — Sarah (first-time)

1. Add lemon tree £24.99, abandon checkout (logged in or email captured).  
2. **Expect:** E1 ~1h with cart image.  
3. No purchase → E2 with reviews at +24h.  
4. No purchase → E3 Club upsell at +48h.  
5. Purchase after E2 → no E3.

### Go-live checklist

- [ ] FR cart trigger live, 15 min minimum delay  
- [ ] Cart layout renders correct SKU/image/price  
- [ ] `club_member = N` routes correctly (not P0.2)  
- [ ] Purchase exits program in DD + FR  
- [ ] Gary suppress segment tested  
- [ ] Test send to internal addresses  

---

## P0.2 — Cart abandonment (Club member)

| | |
|--|--|
| **Program ID** | `P0-CART-ABANDON-MEMBER` |
| **Build order** | **#2** (same FR trigger, branch on `club_member`) |

### Journey map

```mermaid
flowchart TD
    START([Cart abandoned 15+ min]) --> CLUB{club_member = Y?}
    CLUB -->|No| P01([Go to P0.1])
    CLUB -->|Yes| E1["Email 1 — 45-90 min<br/>Member saving applied"]
    E1 --> PURCH1{Purchased?}
    PURCH1 -->|Yes| EXIT1([Exit])
    PURCH1 -->|No| D1[Delay 24h]
    D1 --> E2[Email 2 — stock / dispatch / guarantee]
    E2 --> PURCH2{Purchased?}
    PURCH2 -->|Yes| EXIT2([Exit])
    PURCH2 -->|No| D2[Delay 48h]
    D2 --> E3[Email 3 — final reminder, no extra discount]
    E3 --> EXIT3([Exit])
```

### Key rule

**Never escalate discount** for members — 15% already applied.

### Test scenario — Dave (member, £80 cart)

1. Member price shows £12 saving.  
2. E1 references member saving.  
3. E3 is reminder only — no new code.

### Go-live checklist

- [ ] `club_member = Y` only  
- [ ] Member savings dynamic field populates  
- [ ] No Club join CTA in any email  

---

## P0.3 — Browse abandonment

| | |
|--|--|
| **Program ID** | `P0-BROWSE-ABANDON` |
| **Build order** | **#3** |

### Journey map

```mermaid
flowchart TD
    START([Session ended — browsed, no cart]) --> IDENT{Email known?}
    IDENT -->|No| STOP([No send])
    IDENT -->|Yes| E1["Email 1 — ~1h<br/>Viewed products layout"]
    E1 --> CART{Carted or purchased?}
    CART -->|Yes| EXIT1([Exit — cart program takes over])
    CART -->|No| D1[Delay 24h]
    D1 --> E2[Email 2 — similar + seasonal tip]
    E2 --> CLUB{club_member?}
    CLUB -->|No| E2N[Club footer CTA]
    CLUB -->|Yes| E2M[Member picks only]
    E2N --> EXIT2([Exit — max 2 emails])
    E2M --> EXIT2
```

### Fresh Relevance

- Browse abandon trigger  
- Browse/cart layout (browsed products, not cart)  
- FR slice size: don’t start if cart abandon started within ~120 min  

### Test scenario — Emma (spring soft fruit)

1. View raspberries + strawberries, no cart.  
2. E1 within ~1h with viewed products + planting window.  
3. E2 at +24h with complementary products.  
4. Adds to cart → exits; cart program takes over.

### Go-live checklist

- [ ] Browse layout distinct from cart layout  
- [ ] No “your cart is waiting” copy  
- [ ] Slice size vs cart abandon verified  

---

## P0.4 — Welcome series (signup, pre-purchase)

| | |
|--|--|
| **Program ID** | `P0-WELCOME-SIGNUP` |
| **Sub-program** | `P0-WELCOME-CODE-EXPIRY` |
| **Build order** | **#4** |

### Journey map

```mermaid
flowchart TD
    START([New newsletter subscriber]) --> E1["Email 1 — immediate<br/>Thank you + USPs + code if promised"]
    E1 --> D1[Delay 2-3 days]
    D1 --> PURCH1{First purchase?}
    PURCH1 -->|Yes| EXIT1([Exit → P1.1 Post-purchase])
    PURCH1 -->|No| E2[Email 2 — brand story + seasonal inspiration]
    E2 --> D2[Delay 3-4 days]
    D2 --> PURCH2{First purchase?}
    PURCH2 -->|Yes| EXIT2([Exit])
    PURCH2 -->|No| E3[Email 3 — Shop now or Club £10/yr]
    E3 --> D3[Delay 7 days]
    D3 --> PURCH3{First purchase?}
    PURCH3 -->|Yes| EXIT3([Exit])
    PURCH3 -->|No| REM[Code expiry reminder if issued]
    REM --> EXIT4([Exit welcome track])
```

### Test scenario — Signup 10% off

1. Day 0: welcome + code + expiry.  
2. Day 3: inspiration email.  
3. Day 7: Club alternative.  
4. Day 14: code expiry nudge.  
5. First order any time → exit to P1.1.

### Go-live checklist

- [ ] Signup form enrolls program  
- [ ] Code + expiry fields populated  
- [ ] No overlap with Gary welcome if any  

---

## P0 phase sign-off

| Program | Status | Owner | Live date |
|---------|--------|-------|-----------|
| P0.1 Cart non-member | [ ] | | |
| P0.2 Cart member | [ ] | | |
| P0.3 Browse | [ ] | | |
| P0.4 Welcome | [ ] | | |

---

# P1 — Retention & Club lifecycle

**Goal:** Post-purchase care, Club onboarding, renewal.  
**Start after:** P0 live and stable (~2 weeks).

---

## P1.1 — Post-purchase care + Club upsell

| | |
|--|--|
| **Program ID** | `P1-POST-PURCHASE` |
| **Build order** | **#5** |

### Journey map

```mermaid
flowchart TD
    START([Order placed — plant/product SKU]) --> TX[Transactional order confirmation]
    TX --> D1[Delay 2-3 days post dispatch]
    D1 --> CARE[Email — SKU care / planting guide]
    CARE --> D2[Delay 11-14 days]
    D2 --> REV[Email — review request + CS link]
    REV --> CLUB{club_member?}
    CLUB -->|Yes| EXIT1([Exit])
    CLUB -->|No| ORD{order_count >= 2 or LTV threshold?}
    ORD -->|Yes| UP[Email — Club savings recap]
    ORD -->|No| EXIT2([Exit])
    UP --> EXIT3([Exit])
```

**Exclude:** Club SKU-only orders → route to P1.2 instead.

### Test scenario — Mark (hydrangea)

1. Day 3: planting guide for hydrangea SKU.  
2. Day 14: review ask.  
3. If 2+ orders and not Club: savings recap.

### Go-live checklist

- [ ] Order webhook enrolls program  
- [ ] SKU-dynamic care content works  
- [ ] Club-only orders excluded  

---

## P1.2 — Club welcome + login reminder

| | |
|--|--|
| **Program ID** | `P1-CLUB-WELCOME` |
| **Build order** | **#6** |
| **Trigger SKU** | `820001` |

### Journey map

```mermaid
flowchart TD
    START([Club membership purchased]) --> E1["Email 1 — immediate<br/>Perks + log in with membership email"]
    E1 --> D1[Delay 3 days]
    D1 --> LOG1{Logged-in purchase since join?}
    LOG1 -->|Yes| EXIT1([Exit — activated])
    LOG1 -->|No| E2[Email 2 — login how-to + support]
    E2 --> D2[Delay 4 days]
    D2 --> LOG2{Logged-in purchase?}
    LOG2 -->|Yes| EXIT2([Exit])
    LOG2 -->|No| E3[Email 3 — CS contact offer]
    E3 --> EXIT3([Exit])
```

### Test scenario — Buys Club as guest

1. Immediate welcome + login CTA.  
2. Day 3: “15% not showing?” help email.  
3. Logs in and orders → exit.

### Go-live checklist

- [ ] `club_member` set on purchase  
- [ ] Login detection field or proxy (logged-in order flag)  
- [ ] Links to account / support  

---

## P1.3 — Club pre-renewal + failed payment

| | |
|--|--|
| **Program ID** | `P1-CLUB-RENEWAL` |
| **Sub-program** | `P1-CLUB-PAYMENT-FAILED` |
| **Build order** | **#7** |

### Journey map — renewal

```mermaid
flowchart TD
    START([T-30 days before renewal<br/>club_auto_renew = Y]) --> E30[Email — savings recap + £10 locked]
    E30 --> E14[Email T-14 — renewal reminder]
    E14 --> E7[Email T-7 — short reminder]
    E7 --> RENEW{Renewal successful?}
    RENEW -->|Yes| EXIT1([Exit])
    RENEW -->|No payment failed| FAIL([P1-CLUB-PAYMENT-FAILED])
```

### Journey map — failed payment

```mermaid
flowchart TD
    START([club_payment_failed = Y]) --> FE1[Email — immediate update payment]
    FE1 --> D1[Delay 3 days]
    D1 --> FE2[Email 2 — discounts paused]
    FE2 --> FIXED{Payment fixed?}
    FIXED -->|Yes| EXIT1([Exit])
    FIXED -->|No| FE3[Email 3 — final before lapse]
    FE3 --> LAPSE([Route to P2.4 Club lapsed])
```

### Test scenario

1. T-30: “You saved £47; renews at £10 — price never goes up.”  
2. Failed card: immediate update payment; suppress all join Club upsells.

### Go-live checklist

- [ ] `club_renewal_date` synced daily  
- [ ] Payment failure webhook sets `club_payment_failed`  
- [ ] Suppress join Club globally on failed payment  

---

## P1.4 — Custom triggers (phase 1b)

Build after core P1 or in parallel if dev resource available.

| ID | Event | Journey summary |
|----|-------|-----------------|
| `P1-CT-PLANT-FINDER` | `PlantFinderComplete` | +1h results email → +24h seasonal tip → exit on purchase |
| `P1-CT-GUIDE-DOWNLOAD` | `PlantingGuideDownload` | +2h guide + products → +3d Club mention (non-member) |
| `P1-CT-VIDEO` | `VideoWatched` (≥50%) | +4h related products from video metadata |

### Plant Finder journey (example)

```mermaid
flowchart TD
    START([Plant Finder completed]) --> E1[Email 1 — ~1h top 3 matched plants]
    E1 --> PURCH{Purchased?}
    PURCH -->|Yes| EXIT1([Exit])
    PURCH -->|No| D1[Delay 24h]
    D1 --> E2[Email 2 — seasonal tip + link to results]
    E2 --> EXIT2([Exit])
```

**Dev required:** `window.ddg.event("PlantFinderComplete", { email, space, sunlight, resultCount })`  
Docs: [Custom event examples](https://developer.freshrelevance.com/docs/custom-event-examples.md)

---

## P1 phase sign-off

| Program | Status | Owner | Live date |
|---------|--------|-------|-----------|
| P1.1 Post-purchase | [ ] | | |
| P1.2 Club welcome | [ ] | | |
| P1.3 Club renewal | [ ] | | |
| P1.4 Custom triggers | [ ] | | |

---

# P2 — Club engagement & seasonal retention

**Goal:** Vouchers, Club cart recover, lapsing/lapsed.  
**Start after:** P1 Club welcome live.

---

## P2.1 — Club voucher reminders

| | |
|--|--|
| **Programs** | `P2-CLUB-VOUCHER-5` / `P2-CLUB-VOUCHER-PP` |
| **Build order** | **#8** |

### Journey map (£5 voucher)

```mermaid
flowchart TD
    START([£5 voucher issued to member]) --> D7[Delay 7 days]
    D7 --> USED1{Redeemed?}
    USED1 -->|Yes| EXIT1([Exit])
    USED1 -->|No| E1[Email — voucher + personalised picks]
    E1 --> D14[Delay 14 days]
    D14 --> USED2{Redeemed?}
    USED2 -->|Yes| EXIT2([Exit])
    USED2 -->|No| E2[Email 2 — last chance this season]
    E2 --> EXIT3([Exit])
```

### P&P variant

Start when `voucher_pp_balance > 0` AND (`cart_value >= £40` OR recent browse with cart intent).

---

## P2.2 — Club cart abandonment

| | |
|--|--|
| **Program ID** | `P2-CLUB-CART-ABANDON` |
| **Build order** | **#9** |

### Journey map

```mermaid
flowchart TD
    START([Club SKU 820001 in cart — abandoned<br/>club_member = N]) --> MIX{Plants also in cart?}
    MIX -->|Yes| E1A[Email 1 — combined savings maths]
    MIX -->|No| E1B[Email 1 — perks only £10/yr]
    E1A --> D1[Delay 24h]
    E1B --> D1
    D1 --> PURCH{Purchased?}
    PURCH -->|Yes| EXIT1([Exit → P1.2 Club welcome])
    PURCH -->|No| E2[Email 2 — price lock + voucher pack]
    E2 --> EXIT2([Exit])
```

---

## P2.3 — Seasonal lapsing & lapsed win-back

| | |
|--|--|
| **Programs** | `P2-LAPSING-SEASONAL` / `P2-LAPSED-WINBACK` |
| **Build order** | **#10** |
| **Owner** | Jemma defines segments |

### Lapsing journey (seasonal)

```mermaid
flowchart TD
    START([Expected spring buyer — no order by mid-Feb]) --> E1[Email 1 — planting window open]
    E1 --> D1[Delay 2 weeks]
    D1 --> E2[Email 2 — category picks from history]
    E2 --> CLUB{club_member?}
    CLUB -->|Yes| E3M[Email 3 — voucher + early access]
    CLUB -->|No| E3N[Email 3 — seasonal bestsellers]
    E3M --> EXIT([Exit])
    E3N --> EXIT
```

### Lapsed win-back (12+ months)

```mermaid
flowchart TD
    START([No purchase 12+ months]) --> E1[Email 1 — soft, what's new]
    E1 --> D1[Delay 7 days]
    D1 --> E2[Email 2 — personalised from history]
    E2 --> ENG{Opened E1 or E2?}
    ENG -->|No| E3A[Email 3 — modest offer]
    ENG -->|Yes| E3B[Email 3 — value-led]
    E3A --> D2[Delay 7 days]
    E3B --> D2
    D2 --> E4[Email 4 — sunset / breakup]
    E4 --> EXIT([Exit])
```

---

## P2.4 — Club lapsed (expired / cancelled)

| | |
|--|--|
| **Program ID** | `P2-CLUB-LAPSED` |
| **Build order** | **#11** |

### Journey map

```mermaid
flowchart TD
    START([Membership expired — was member in 90d]) --> D14[Delay 14 days]
    D14 --> E1[Email — rejoin + savings recap]
    E1 --> D14B[Delay 14 days]
    D14B --> E2[Email 2 — £10 price lock reminder]
    E2 --> REJOIN{Rejoined?}
    REJOIN -->|Yes| P12([P1.2 Club welcome])
    REJOIN -->|No| EXIT([Exit])
```

---

## P2 phase sign-off

| Program | Status | Owner | Live date |
|---------|--------|-------|-----------|
| P2.1 Vouchers | [ ] | | |
| P2.2 Club cart abandon | [ ] | | |
| P2.3 Lapsing / Lapsed | [ ] | | |
| P2.4 Club lapsed | [ ] | | |

---

# P3 — Growth & product signals

**Goal:** Product triggers, member early access, high-LTV Club pitch.  
**Start after:** P2 stable or seasonal need.

---

## P3.1 — Back in stock

| | |
|--|--|
| **Program ID** | `P3-BACK-IN-STOCK` |
| **Build order** | **#12** |

### Journey map

```mermaid
flowchart TD
    START([FR — viewed OOS product back in stock]) --> E1[Email — immediate product + dispatch]
    E1 --> CLUB{club_member?}
    CLUB -->|Yes| MEM[Member price shown]
    CLUB -->|No| NOM[Standard price + Club footer]
    MEM --> EXIT([Exit — 1 email])
    NOM --> EXIT
```

---

## P3.2 — Price drop

| | |
|--|--|
| **Program ID** | `P3-PRICE-DROP` |
| **Build order** | **#13** |

### Journey map

Same single-email pattern as P3.1.

```mermaid
flowchart TD
    START([FR — browsed product price drop]) --> E1[Email — immediate product + new price]
    E1 --> CLUB{club_member?}
    CLUB -->|Yes| MEM[Show member price vs sale]
    CLUB -->|No| NOM[Standard price + Club footer]
    MEM --> EXIT([Exit — 1 email])
    NOM --> EXIT
```

**Caution:** Members already have 15% — show member price vs sale clearly.

---

## P3.3 — Member early access (Gary coordination)

| | |
|--|--|
| **Program ID** | `P3-MEMBER-EARLY-ACCESS` |
| **Build order** | **#14** |

### Journey map

```mermaid
flowchart TD
    START([Sale scheduled T-48h<br/>club_member = Y]) --> E1[Email — member early access]
    E1 --> D48[Delay 48h]
    D48 --> GARY[Gary broadcast to wider list]
    GARY --> EXIT([Exit])
```

---

## P3.4 — High-LTV Club pitch

| | |
|--|--|
| **Program ID** | `P3-CLUB-HIGH-LTV` |
| **Build order** | **#15** |

### Journey map

```mermaid
flowchart TD
    START([order_count >= 3 and LTV threshold<br/>club_member = N]) --> E1["Email — You'd have saved £X with Club"]
    E1 --> D7[Delay 7 days]
    D7 --> JOINED{Joined Club?}
    JOINED -->|Yes| EXIT1([Exit])
    JOINED -->|No| EXIT2([Exit — suppress pitch 90d])
```

---

## P3 phase sign-off

| Program | Status | Owner | Live date |
|---------|--------|-------|-----------|
| P3.1 Back in stock | [ ] | | |
| P3.2 Price drop | [ ] | | |
| P3.3 Member early access | [ ] | | |
| P3.4 High-LTV Club | [ ] | | |

---

# Implementation order (master checklist)

Tick programs **in this order only** — each depends on the rows above.

| # | ID | Priority | Depends on |
|---|-----|----------|------------|
| 0 | Foundation F.1–F.4 | — | — |
| 1 | `P0-CART-ABANDON-NON-MEMBER` | P0 | FR cart + cart layout |
| 2 | `P0-CART-ABANDON-MEMBER` | P0 | #1 |
| 3 | `P0-BROWSE-ABANDON` | P0 | FR browse |
| 4 | `P0-WELCOME-SIGNUP` | P0 | Signup form |
| 5 | `P1-POST-PURCHASE` | P1 | Order webhook |
| 6 | `P1-CLUB-WELCOME` | P1 | Club SKU 820001 |
| 7 | `P1-CLUB-RENEWAL` | P1 | `club_renewal_date` |
| 8 | `P2-CLUB-VOUCHER-*` | P2 | Voucher events |
| 9 | `P2-CLUB-CART-ABANDON` | P2 | Club in cart detection |
| 10 | `P2-LAPSING-*` | P2 | Jemma segments |
| 11 | `P2-CLUB-LAPSED` | P2 | #7 |
| 12 | `P3-BACK-IN-STOCK` | P3 | FR product segment |
| 13 | `P3-PRICE-DROP` | P3 | FR product segment |
| 14 | `P3-MEMBER-EARLY-ACCESS` | P3 | Gary calendar |
| 15 | `P3-CLUB-HIGH-LTV` | P3 | RFM / LTV fields |
| — | `P1-CT-*` Custom triggers | P1b | Dev events (parallel ok) |

---

# Per-program implementation template (copy for each new build)

```
PROGRAM ID:
OWNER:
TARGET LIVE DATE:

PREREQUISITES
[ ] Contact fields exist
[ ] FR trigger / webhook ready
[ ] Email creative approved
[ ] Suppression segments defined
[ ] Test contacts identified

DOTDIGITAL
[ ] Program created
[ ] Start condition configured
[ ] Entry filters set
[ ] Decisions / delays / actions match journey map
[ ] Exit on purchase + unsubscribe
[ ] Program activated (test mode)

FRESH RELEVANCE
[ ] Trigger program / marketing rule
[ ] Cart or browse layout attached
[ ] Global settings verified

TEST
[ ] Internal test send — all branches
[ ] Purchase exit works
[ ] Member vs non-member branch (if applicable)
[ ] Gary suppress tested

GO LIVE
[ ] Program set to active
[ ] Monitored 48h
[ ] Metrics baseline recorded
```

---

# Metrics (per program)

| Program type | Primary KPI |
|--------------|-------------|
| Cart / browse abandon | Recovered revenue, conversion rate |
| Welcome | First purchase rate, time to first order |
| Post-purchase | Review rate, 2nd purchase rate |
| Club welcome | Login within 7d, first member order |
| Club renewal | Renew rate, failed payment recovery |
| Vouchers | Redemption rate |
| Lapsing / lapsed | Reactivation rate, unsubscribe rate |
| Product triggers | Click rate, conversion per send |

---

*Last updated: implementation playbook v2 — Mermaid journey maps (Cursor / GitHub preview).*
