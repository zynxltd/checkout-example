# YouGarden — Dotdigital Program Mappings

**Related:** [Implementation playbook](./yougarden-automation-implementation-playbook.md) (step-by-step, ASCII flows) · [Automation roadmap](./yougarden-automation-roadmap.md) · [Migration research](./dotdigital-automation-migration-research.md)

Maps each priority program to **Dotdigital Program Builder** structure: start condition → decisions → actions → exits. Fresh Relevance (FR) handles behavioural triggers where noted; Dotdigital orchestrates sends, splits, and reporting.

---

## Platform overview

```mermaid
flowchart LR
    subgraph Site["yougarden.com"]
        EVT[Browse / cart / purchase events]
    end
    subgraph FR["Fresh Relevance"]
        TRG[Trigger programs]
        RULES[Marketing rules]
    end
    subgraph DD["Dotdigital"]
        PROG[Automation programs]
        SEG[Segments / contact data]
        SEND[Email + SMS]
    end
    EVT --> TRG
    TRG -->|trigger send OR sync contact| PROG
    RULES --> TRG
    SEG --> PROG
    PROG --> SEND
```

### Shared contact data fields (Dotdigital)

| Field | Used by |
|-------|---------|
| `club_member` (Y/N) | All programs — branch member vs non-member |
| `club_renewal_date` | P1 renewal, P2 voucher timing |
| `club_auto_renew` (Y/N) | P1 pre-renewal |
| `club_payment_failed` (Y/N) | P1 failed renewal |
| `email_permission` | All sends |
| `signup_discount_code` / `signup_discount_expiry` | P0 welcome |
| `last_purchase_date` | P1 post-purchase, P2 lapsing |
| `last_purchase_category` | P1 care content, P2 seasonal |
| `rfm_segment` | P0 cart abandon offer logic |
| `voucher_5_balance` / `voucher_pp_balance` | P2 Club voucher programs |
| `products_in_cart` / `cart_value` | P0 cart abandon (from FR) |
| `products_browsed` | P0 browse abandon (from FR) |

---

# P0 — September go-live

**Goal:** Recover highest-intent sessions and onboard new subscribers. Four Dotdigital programs (cart abandon has two variants).

---

## P0.1 — Cart abandonment (non-member)

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P0-CART-ABANDON-NON-MEMBER` |
| **Start condition** | FR cart-abandon trigger fires → contact enrolled via integration **OR** segment: cart abandoned in last 15 min, no purchase, `club_member = N` |
| **Entry filters** | Email captured; email permission; cart value &lt; £100k; cart items ≤ 50; not in Gary suppress segment |
| **FR trigger** | Cart abandon program — stage 1/2/3 delays align with DD delays |

```mermaid
flowchart TD
    START([FR: Cart abandoned 15+ min]) --> CHECK{club_member?}
    CHECK -->|No| E1[Email 1 — 45–90 min]
    E1 --> PURCH1{Purchased?}
    PURCH1 -->|Yes| EXIT1([Exit — recovered])
    PURCH1 -->|No| D1[Delay 24h]
    D1 --> RFM{rfm_segment?}
    RFM -->|Repeat / high value| E2A[Email 2 — reminder only]
    RFM -->|First-time / low F| E2B[Email 2 — reminder + social proof]
    E2A --> PURCH2{Purchased?}
    E2B --> PURCH2
    PURCH2 -->|Yes| EXIT2([Exit])
    PURCH2 -->|No| D2[Delay 48h]
    D2 --> E3[Email 3 — Club upsell OR modest offer]
    E3 --> EXIT3([Exit — max 3 touches])
    CHECK -->|Yes| MEMBER[[Route to P0.2]]
```

### Use case — Sarah, first-time buyer

| Step | What happens |
|------|----------------|
| **Trigger** | Adds lemon tree (£24.99) to cart; leaves checkout |
| **45 min** | Email 1: cart image, “Your lemon tree is reserved”, dispatch info |
| **+24h** | Email 2: reviews + planting tips (no discount — first-time, test offer on E3 only) |
| **+48h** | Email 3: “Join Club for £10 — save on this order” + return-to-cart link |
| **Exit** | Purchases on Email 2 → program ends; no Email 3 |

### Email content map

| Stage | Subject angle | Dynamic content (FR cart layout) |
|-------|---------------|----------------------------------|
| E1 | “Still thinking about your [plant]?” | Cart lines, images, total |
| E2 | “Customers love this variety” | Reviews + same cart |
| E3 | “Save £X with Club” | Cart + Club break-even calc |

### Exits & suppressions

- Purchase at any stage → exit all programs
- Enters `P0-BROWSE-ABANDON` within FR slice window → browse program blocked (FR setting)
- Gary promo suppress segment active → delay E2/E3 by 48h

---

## P0.2 — Cart abandonment (Club member)

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P0-CART-ABANDON-MEMBER` |
| **Start condition** | Same FR cart trigger; decision routes `club_member = Y` |
| **Entry filters** | Logged-in member session preferred; member discount already in cart data |

```mermaid
flowchart TD
    START([FR: Cart abandoned]) --> CHECK{club_member = Y?}
    CHECK -->|Yes| E1[Email 1 — 45–90 min]
    E1 --> PURCH{Purchased?}
    PURCH -->|Yes| EXIT([Exit])
    PURCH -->|No| D1[Delay 24h]
    D1 --> E2[Email 2 — member savings shown + urgency]
    E2 --> PURCH2{Purchased?}
    PURCH2 -->|Yes| EXIT
    PURCH2 -->|No| D2[Delay 48h]
    D2 --> E3[Email 3 — final reminder, NO extra discount]
    E3 --> EXIT2([Exit])
```

### Use case — Dave, Club member

| Step | What happens |
|------|----------------|
| **Trigger** | £80 plants in cart; 15% member saving (£12) already applied |
| **1h** | “Complete your order — £12 member saving applied” |
| **+24h** | Stock/dispatch window + nursery guarantee |
| **+48h** | Final reminder only — **no** discount escalation |
| **Exit** | Completes order after Email 1 |

---

## P0.3 — Browse abandonment

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P0-BROWSE-ABANDON` |
| **Start condition** | FR browse-abandon trigger; viewed ≥1 product; no cart add; no purchase |
| **Entry filters** | Email known; not purchased in last 24h; not in active cart-abandon program (FR slice) |
| **FR trigger** | Browse abandon — one site brand per email if applicable |

```mermaid
flowchart TD
    START([FR: Session ended, products browsed]) --> IDENT{Email known?}
    IDENT -->|No| STOP([No send — identification only])
    IDENT -->|Yes| E1[Email 1 — ~1h]
    E1 --> CART{Added to cart or purchased?}
    CART -->|Yes| EXIT([Exit — higher intent program])
    CART -->|No| D1[Delay 24h]
    D1 --> E2[Email 2 — similar products + seasonal tip]
    E2 --> CLUB{club_member?}
    CLUB -->|No| E2N[Light Club mention in footer]
    CLUB -->|Yes| E2M[Member early picks — no Club pitch]
    E2N --> EXIT2([Exit — max 2 emails])
    E2M --> EXIT2
```

### Use case — Emma, spring browser

| Step | What happens |
|------|----------------|
| **Trigger** | Views bare-root raspberries + strawberries; leaves without carting |
| **1h** | Email 1: viewed products + “Plant bare-root before [date]” |
| **+24h** | Email 2: complementary soft fruit + bestsellers |
| **Branch** | Non-member → footer CTA “Club members save 15% all year” |
| **Exit** | Adds to cart → cart abandon program takes over; purchase → exit |

---

## P0.4 — Welcome series (newsletter signup, pre-purchase)

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P0-WELCOME-SIGNUP` |
| **Start condition** | New contact added to “Newsletter” address book with opt-in **OR** signup form submission webhook |
| **Entry filters** | `last_purchase_date` is empty; email permission = Y |
| **FR role** | Optional — capture browse data after signup for Email 2 personalisation |

```mermaid
flowchart TD
    START([Contact subscribes]) --> E1[Email 1 — immediate]
    E1 --> CODE{signup_discount promised?}
    CODE -->|Yes| E1C[Include code + expiry in E1]
    CODE -->|No| E1B[Benefits + USPs only]
    E1C --> D1[Delay 2–3 days]
    E1B --> D1
    D1 --> PURCH{First purchase?}
    PURCH -->|Yes| EXIT([Exit — route to P1 post-purchase])
    PURCH -->|No| E2[Email 2 — brand story + seasonal inspiration]
    E2 --> D2[Delay 3–4 days]
    D2 --> PURCH2{First purchase?}
    PURCH2 -->|Yes| EXIT
    PURCH2 -->|No| E3[Email 3 — Shop now OR Club intro £10/yr]
    E3 --> D3[Delay 7 days]
    D3 --> PURCH3{First purchase?}
    PURCH3 -->|Yes| EXIT
    PURCH3 -->|No| REM[Reminder — code expiring if applicable]
    REM --> EXIT2([Exit welcome track])
```

### Use case — Signup for 10% off, no purchase

| Step | What happens |
|------|----------------|
| **Day 0** | Email 1: welcome + `WELCOME10` code + expiry date |
| **Day 3** | Email 2: spring planting inspiration + bestsellers |
| **Day 7** | Email 3: “Still thinking?” + Club as alternative to one-off code |
| **Day 14** | Code expiry reminder (sub-program or decision branch) |
| **Exit** | First order placed → hand off to P1 post-purchase |

### Signup discount sub-track

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P0-WELCOME-CODE-EXPIRY` |
| **Start condition** | Enrolled from welcome; `signup_discount_expiry` within 3 days; no purchase |

---

## P0 summary matrix

| Program | DD start | FR trigger | Emails | Key decision |
|---------|----------|------------|--------|--------------|
| Cart abandon (non-member) | FR cart + not member | Yes | 3 | RFM on E2/E3 |
| Cart abandon (member) | FR cart + member | Yes | 3 | No discount escalation |
| Browse abandon | FR browse | Yes | 2 | Club mention E2 if non-member |
| Welcome signup | New subscriber | Optional | 3 + expiry | Purchase exits to P1 |

```mermaid
flowchart LR
    subgraph P0["P0 — September"]
        C1[Cart non-member]
        C2[Cart member]
        B[Browse abandon]
        W[Welcome signup]
    end
    FR[Fresh Relevance] --> C1 & C2 & B
    FORM[Signup form] --> W
    C1 & C2 & B & W --> DD[Dotdigital sends]
```

---

# P1 — Retention & Club lifecycle

**Goal:** Post-purchase care, Club onboarding, renewal reliability.

---

## P1.1 — Post-purchase care + Club upsell

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P1-POST-PURCHASE` |
| **Start condition** | Order placed webhook / FR purchase complete → exclude Club SKU-only orders to P1.3 |
| **Entry filters** | Contains plant/product SKU (not membership-only) |

```mermaid
flowchart TD
    START([Purchase complete]) --> TX[Transactional — order confirmation]
    TX --> D1[Delay 2–3 days post dispatch]
    D1 --> CARE[Email — SKU care / planting guide]
    CARE --> D2[Delay 11–14 days]
    D2 --> REV[Email — review request + CS link]
    REV --> CLUB{club_member?}
    CLUB -->|Yes| EXIT([Exit])
    CLUB -->|No| ORD{order_count >= 2 OR LTV threshold?}
    ORD -->|Yes| UP[Email — Club savings recap]
    ORD -->|No| EXIT
    UP --> EXIT
```

### Use case — Mark buys a hydrangea

| Step | What happens |
|------|----------------|
| **Immediate** | Order confirmation (transactional, on-brand) |
| **Day 3** | “How to plant your hydrangea” — dynamic SKU content |
| **Day 14** | Review request with product image |
| **Branch** | 2+ lifetime orders, not Club → “You’d have saved £X with Club” |

---

## P1.2 — Club welcome + login reminder

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P1-CLUB-WELCOME` |
| **Start condition** | Purchase of SKU `820001` (Club membership) |
| **Entry filters** | `club_member` set to Y on contact record |

```mermaid
flowchart TD
    START([Club membership purchased]) --> E1[Email 1 — immediate welcome]
    E1 --> PERKS[15% / 7.5% / vouchers / insider emails]
    PERKS --> LOGIN[CTA — log in with membership email]
    LOGIN --> D1[Delay 3 days]
    D1 --> LOGGED{Logged-in purchase since join?}
    LOGGED -->|Yes| EXIT([Exit — activated])
    LOGGED -->|No| E2[Email 2 — login how-to + support]
    E2 --> D2[Delay 4 days]
    D2 --> LOGGED2{Logged-in purchase?}
    LOGGED2 -->|Yes| EXIT
    LOGGED2 -->|No| E3[Email 3 — CS contact offer]
    E3 --> EXIT2([Exit])
```

### Use case — Buys Club, shops as guest

| Step | What happens |
|------|----------------|
| **Immediate** | Welcome + full perk list + login CTA |
| **Day 3** | “Your 15% isn’t showing?” — same-email login steps |
| **Day 7** | Link to member support if still no logged-in order |

---

## P1.3 — Club pre-renewal + failed payment

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P1-CLUB-RENEWAL` |
| **Start condition** | `club_renewal_date` minus 30 days; `club_auto_renew = Y` |
| **Parallel program** | `P1-CLUB-PAYMENT-FAILED` on `club_payment_failed = Y` |

```mermaid
flowchart TD
    START([30 days before renewal]) --> E30[Email — savings recap + price locked £10]
    E30 --> D14[Delay to 14 days before]
    D14 --> E14[Email — renewal reminder + manage account link]
    E14 --> D7[Delay to 7 days before]
    D7 --> E7[Email — short reminder]
    E7 --> RENEW{Renewal successful?}
    RENEW -->|Yes| EXIT([Exit — thank you touch optional])
    RENEW -->|Failed| FAIL[[P1-CLUB-PAYMENT-FAILED]]
    FAIL --> FE1[Email — immediate: update payment]
    FE1 --> D3[Delay 3 days]
    D3 --> FE2[Email 2 — discounts paused]
    FE2 --> FIXED{Payment fixed?}
    FIXED -->|Yes| EXIT
    FIXED -->|No| FE3[Email 3 — final before lapse]
    FE3 --> LAPSE[[Route to P2 lapsed Club]]
```

### Use case — Auto-renew in 14 days

| Step | What happens |
|------|----------------|
| **T-30d** | “You saved £47 this year; renews at £10 — price never goes up” |
| **T-14d** | Renewal date + account management link |
| **T-7d** | Short reminder |
| **Failed** | Immediate payment update; suppress all Club join upsells |

---

## P1 summary matrix

| Program | DD start | Emails | Key exit |
|---------|----------|--------|----------|
| Post-purchase | Order webhook | 2–3 + optional Club upsell | Club join or review done |
| Club welcome | Club SKU purchase | 3 | Logged-in purchase |
| Club renewal | `club_renewal_date` | 3 + failed branch | Successful renew |

```mermaid
flowchart TD
    subgraph P1["P1"]
        PP[Post-purchase]
        CW[Club welcome]
        CR[Club renewal]
    end
    P0W[P0 Welcome] -->|first purchase| PP
    P0C[P0 Cart] -->|purchase| PP
    CLUBJOIN[Club purchase] --> CW
    CW --> ACTIVE[Active member]
    ACTIVE --> CR
```

---

# P2 — Club engagement & seasonal retention

**Goal:** Drive voucher redemption, recover Club cart abandons, win back seasonal buyers.

---

## P2.1 — Club voucher reminders (£5 + P&P)

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P2-CLUB-VOUCHER-5` / `P2-CLUB-VOUCHER-PP` |
| **Start condition** | Voucher issued webhook → `voucher_5_balance` incremented **OR** scheduled seasonal issue date |
| **Entry filters** | `club_member = Y`; voucher unused |

```mermaid
flowchart TD
    START([£5 voucher issued]) --> D7[Delay 7 days]
    D7 --> USED{Redeemed?}
    USED -->|Yes| EXIT([Exit])
    USED -->|No| E1[Email — voucher + personalised picks]
    E1 --> D14[Delay 14 days]
    D14 --> USED2{Redeemed?}
    USED2 -->|Yes| EXIT
    USED2 -->|No| E2[Email 2 — last chance this season]
    E2 --> EXIT2([Exit])
```

### P&P voucher variant

| Start | Extra filter |
|-------|----------------|
| `voucher_pp_balance > 0` | `cart_value >= £40` in last 7 days OR browse session with cart |

### Use case — Spring £5 voucher unused

| Step | What happens |
|------|----------------|
| **Issue** | Seasonal £5 voucher credited to account |
| **Day 7** | “Your £5 spring voucher” + potato planter picks if bought veg before |
| **Day 21** | Last chance before next seasonal campaign |

---

## P2.2 — Club join cart abandonment

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P2-CLUB-CART-ABANDON` |
| **Start condition** | Cart contains SKU `820001` with or without plants; no purchase |
| **Entry filters** | `club_member = N` |

```mermaid
flowchart TD
    START([Club in cart, abandoned]) --> MIX{Plants also in cart?}
    MIX -->|Yes| E1A[Email 1 — combined savings maths]
    MIX -->|Club only| E1B[Email 1 — perk summary + £10/yr]
    E1A --> D1[Delay 24h]
    E1B --> D1
    D1 --> PURCH{Purchased?}
    PURCH -->|Yes| EXIT([Exit → P1 Club welcome])
    PURCH -->|No| E2[Email 2 — price lock + voucher pack value]
    E2 --> EXIT2([Exit])
```

### Use case — Club + £60 plants abandoned

| Step | What happens |
|------|----------------|
| **1h** | “Save £9 on this order + £20 vouchers — complete join for £10” |
| **+24h** | Full perk breakdown + return-to-cart |

---

## P2.3 — Seasonal lapsing & lapsed win-back

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P2-LAPSING-SEASONAL` / `P2-LAPSED-WINBACK` |
| **Start condition** | Segment from Jemma: expected spring buyer, no purchase by mid-Feb **OR** no purchase 12+ months |
| **FR rule** | Lapse buyer behavioural rule optional |

```mermaid
flowchart TD
    subgraph LAPSING["P2 — Lapsing (seasonal)"]
        LS([Segment: expected buyer, no spring order]) --> LE1[Email — planting window open]
        LE1 --> LE2[Email +2w — category picks from history]
        LE2 --> CLUBM{club_member?}
        CLUBM -->|Yes| LE3M[Member: spring voucher + early access]
        CLUBM -->|No| LE3N[Non-member: seasonal bestsellers]
    end
    subgraph LAPSED["P2 — Lapsed win-back"]
        LX([12+ months no purchase]) --> LX1[E1 — soft, whats new]
        LX1 --> LX2[E2 +7d — personalised history]
        LX2 --> ENG{Opened / clicked?}
        ENG -->|No| LX3[E3 — modest offer]
        ENG -->|Yes| LX3L[E3 — value-led, lighter offer]
        LX3 --> LX4[E4 +7d — sunset / breakup]
        LX3L --> LX4
    end
```

### Use case — Lapsing Club member

| Step | What happens |
|------|----------------|
| **Trigger** | Bought spring plants last March; no 2026 purchase by 15 Feb |
| **Email 1** | “Time to plan spring” + bare-root in stock |
| **Email 2** | Club spring voucher + member-only picks |

### Use case — Lapsed 14 months

| Step | What happens |
|------|----------------|
| **E1** | What’s new this season — no discount |
| **E2** | Plants from last order category |
| **E3** | Offer only if no engagement on E1–E2 |
| **E4** | “Should we stop emailing?” — deliverability protection |

---

## P2.4 — Club lapsed (cancelled / expired)

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P2-CLUB-LAPSED` |
| **Start condition** | `club_member` flips to N after expiry; was member in last 90 days |

```mermaid
flowchart TD
    START([Membership expired / cancelled]) --> D14[Delay 14 days]
    D14 --> E1[Email — rejoin for spring + savings recap]
    E1 --> D14b[Delay 14 days]
    D14b --> E2[Email 2 — £10 price lock reminder]
    E2 --> REJOIN{Rejoined?}
    REJOIN -->|Yes| EXIT([Exit → P1 Club welcome])
    REJOIN -->|No| EXIT2([Exit])
```

---

## P2 summary matrix

| Program | DD start | Club? | Emails |
|---------|----------|-------|--------|
| £5 voucher reminder | Voucher issued | Yes | 2 |
| P&P voucher | Voucher + cart/browse | Yes | 1–2 |
| Club cart abandon | Club SKU in cart | Join | 2 |
| Seasonal lapsing | Jemma segment | Branch | 2–3 |
| Lapsed win-back | 12mo inactive | Optional offer | 4 |
| Club lapsed | Membership ended | Rejoin | 2 |

---

# P3 — Growth & product triggers

**Goal:** Timely product signals and high-value acquisition.

---

## P3.1 — Back in stock

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P3-BACK-IN-STOCK` |
| **Start condition** | FR back-in-stock trigger on viewed/OOS product |
| **Entry filters** | Viewed product ≥2 times OR in wishlist; not purchased |

```mermaid
flowchart TD
    START([FR: Product back in stock]) --> E1[Email 1 — immediate]
    E1 --> PROD[Product image + dispatch note]
    PROD --> CLUB{club_member?}
    CLUB -->|Yes| MEM[Member price shown]
    CLUB -->|No| NOM[Standard price + optional Club footer]
    MEM --> EXIT([Exit — single email])
    NOM --> EXIT
```

### Use case — Sold-out rose restocked

Lisa viewed climbing rose 3× in February → instant email when stock returns.

---

## P3.2 — Price drop alert

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P3-PRICE-DROP` |
| **Start condition** | FR price-drop trigger on browsed product |
| **Caution** | Members already have 15% — message “member price” vs sale price to avoid confusion |

---

## P3.3 — Member early access (Gary sale coordination)

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P3-MEMBER-EARLY-ACCESS` |
| **Start condition** | Manual/program push 24–48h before Gary sale segment send |
| **Entry filters** | `club_member = Y` |

```mermaid
flowchart TD
    START([Sale scheduled T-48h]) --> E1[Member early access email]
    E1 --> D48[Delay 48h]
    D48 --> GARY[Gary broadcast to wider list]
    GARY --> EXIT([Exit])
```

---

## P3.4 — High-LTV Club pitch

| Dotdigital element | Mapping |
|--------------------|---------|
| **Program name** | `P3-CLUB-HIGH-LTV` |
| **Start condition** | `order_count >= 3` AND `lifetime_value >= threshold` AND `club_member = N` |
| **Trigger** | Post-purchase decision in P1 **OR** standalone monthly segment refresh |

```mermaid
flowchart TD
    START([High-LTV non-member]) --> CALC[Dynamic — would have saved £X]
    CALC --> E1[Email — personalised Club ROI]
    E1 --> D7[Delay 7 days]
    D7 --> JOINED{Joined Club?}
    JOINED -->|Yes| EXIT([Exit])
    JOINED -->|No| EXIT2([Exit — suppress 90d])
```

---

## P3 summary matrix

| Program | DD start | FR trigger | Sends |
|---------|----------|------------|-------|
| Back in stock | FR product change | Yes | 1 |
| Price drop | FR product change | Yes | 1 |
| Member early access | Scheduled / manual | No | 1 |
| High-LTV Club pitch | Segment / post-purchase | No | 1 |

---

# Cross-program routing

```mermaid
flowchart TD
    VISIT[Site visit] --> BROWSE[Browse]
    VISIT --> CART[Add to cart]
    BROWSE --> P0B[P0 Browse abandon]
    CART --> P0C[P0 Cart abandon]
    P0C -->|purchase| P1PP[P1 Post-purchase]
    P0B -->|cart| P0C
    SIGNUP[Newsletter signup] --> P0W[P0 Welcome]
    P0W -->|purchase| P1PP
    P0C -->|Club SKU| P2CC[P2 Club cart abandon]
    CLUBBUY[Club purchase] --> P1CW[P1 Club welcome]
    P1CW --> P2VR[P2 Voucher reminders]
    P1CW --> P1CR[P1 Club renewal]
    P1CR -->|failed| P2CL[P2 Club lapsed]
    JEMMA[Jemma segment] --> P2LP[P2 Lapsing / Lapsed]
    FRPROD[FR product trigger] --> P3BS[P3 Back in stock / price drop]
```

---

# Build order checklist (Dotdigital)

| Order | Program ID | Depends on |
|-------|------------|------------|
| 1 | `P0-CART-ABANDON-*` | FR cart trigger + cart layouts |
| 2 | `P0-BROWSE-ABANDON` | FR browse trigger |
| 3 | `P0-WELCOME-SIGNUP` | Signup form / address book |
| 4 | `P1-POST-PURCHASE` | Order webhook |
| 5 | `P1-CLUB-WELCOME` | Club SKU + contact fields |
| 6 | `P1-CLUB-RENEWAL` | `club_renewal_date` synced |
| 7 | `P2-CLUB-VOUCHER-*` | Voucher issue events |
| 8 | `P2-CLUB-CART-ABANDON` | Club in cart detection |
| 9 | `P2-LAPSING-*` | Jemma segments |
| 10 | `P3-*` | FR product segments |
