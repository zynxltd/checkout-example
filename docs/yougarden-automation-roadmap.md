# YouGarden — Automation & Trigger Roadmap

**Related:** [Implementation playbook](./yougarden-automation-implementation-playbook.md) · [Dotdigital program mappings](./yougarden-dotdigital-program-mappings.md) · [Migration research](./dotdigital-automation-migration-research.md) · [FR trigger settings](./fresh-relevance-trigger-settings-best-practices.md)

**Product reference:** [YG Discount Club Annual Membership](https://www.yougarden.com/item-p-820001/yg-discount-club-annual-membership) (`item-p-820001`)

---

## YG Discount Club — product facts

| | |
|--|--|
| **Price** | **£10/year** (was £20) |
| **Term** | 12-month membership |
| **Renewal** | **Automatic** — renewed each year to maintain access |
| **Price lock** | Membership price paid will **never go up** (key retention message) |
| **Requirement** | Must be **logged in** with the membership email for discounts to apply |

### Member perks (from product page)

1. **15% off all Plants & Accessories** — applied automatically on every eligible order when logged in.
2. **7.5% off Outdoor Living & Machinery** — on top of plant/accessory savings; applies site-wide on those ranges.
3. **Club Pack (issued across the season)**
   - **4 × £5 product vouchers** (£20 total)
   - **2 × Free P&P vouchers** (worth £6.99 each)
4. **Exclusive member benefits**
   - Priority access to new / exclusive products
   - Monthly insider emails (gardening inspiration & expert knowledge)
   - 7-day-a-week member contact for help and advice

### Value framing for automations

On a **£50 plants basket**, 15% member saving = **£7.50** — membership can pay for itself on a single order. Layer annual vouchers (£20) + P&P vouchers (~£14) for renewal and upsell messaging.

---

## Strategic split

| | Owner | Examples |
|--|-------|----------|
| **Broadcast / seasonal** | Gary | Spring catalogue, sales, monthly newsletter |
| **Lifecycle automations** | New program work | Cart/browse, welcome, post-purchase, club, lapsing |
| **Club insider emails** | Clarify vs Gary | Monthly member “insider knowledge” — avoid duplicate/conflicting sends |
| **Segments** | Jemma (+ FR review) | Club vs non-club, RFM, category buyers, seasonal planters |
| **FR triggers** | Tech + marketing | Behaviour detection, cart layouts, timing |
| **Dotdigital programs** | Marketing | Orchestration, decisions, reporting |

**Timeline:** Dotdigital platform access before September; **live sending from September**.

---

## Phased roadmap

### Phase 0 — Foundation (now → September)

- Configure [FR global trigger settings](./fresh-relevance-trigger-settings-best-practices.md)
- Jemma session: `club_member` flag, renewal date, voucher balances, segment dictionary
- Sync club status + expiry + auto-renew flag into Dotdigital contact fields
- Map monthly member email vs Gary broadcasts (suppression rules)
- Dotdigital Academy [automation course](https://academy.dotdigital.com/getting-started-automation)

### Phase 1 — September go-live (P0)

| Program | Club consideration |
|---------|-------------------|
| Cart abandon | Member vs non-member paths; “save £X with Club” on non-member abandons |
| Browse abandon | Seasonal planting + viewed products; light Club mention email 2 |
| Welcome (signup) | Email 3: Club intro with £10/year + perk summary |
| Post-purchase care | SKU-specific planting tips; Club upsell for repeat-potential non-members |

### Phase 2 — Club route (Oct → Feb)

| Program | Trigger |
|---------|---------|
| Club join — cart/checkout abandon | Club SKU or “Join Club” in basket, no purchase |
| Club welcome | Membership purchase complete |
| Login reminder | Member but no logged-in purchase / discount not applied |
| Voucher reminders | £5 voucher issued, unused after 7–21 days |
| P&P voucher reminders | Unused P&P voucher + basket over threshold |
| Pre-renewal series | ~30 / 14 / 7 days before auto-renewal |
| Failed renewal | Payment failed — update card, discounts paused |
| Club lapsed | Auto-renew cancelled or expired — rejoin win-back |

### Phase 3 — Seasonal retention (Feb → May)

- Lapsing / lapsed by **planting season**, not just calendar days
- Back in stock / price drop (FR triggers)
- Member early access before Gary sale broadcasts

---

## Club automation scenarios

### Join & onboarding

**A — Non-member abandons cart with £60 plants**  
→ Email 1: cart contents + “Join Club for £10/year — save £9 on this order alone, plus £20 in vouchers.”  
→ Show break-even maths; link to [membership PDP](https://www.yougarden.com/item-p-820001/yg-discount-club-annual-membership).

**B — Buys Club membership, hasn’t logged in**  
→ Welcome email 1 (immediate): perks summary + **“Log in with your membership email to unlock 15% off.”**  
→ Email 2 (3 days): step-by-step if still no logged-in order.

**C — Club SKU in cart, abandoned**  
→ High-priority recover: membership + plants combined savings in one email.

### Active member

**D — Spring £5 voucher issued, unused**  
→ Day 7: voucher + personalised picks from last purchase category.  
→ Day 21: last chance before seasonal messaging moves on.

**E — Free P&P voucher + basket £40+**  
→ “Use your free delivery voucher — complete your order.”

**F — Gary sale launching**  
→ Members: early access automation 24–48h before broadcast.  
→ Suppress generic “join Club” upsells.

### Renewal (auto-renew model)

**G — 30 days before renewal**  
→ “Your Club renews on [date] at £10 — your price is locked. You saved £[X] this year.”  
→ Reinforce: 15% off, vouchers, insider emails, price never goes up.

**H — 7 days before renewal**  
→ Short reminder + link to account if they want to manage renewal.

**I — Auto-renew failed**  
→ Immediate: discounts paused — update payment to restore member pricing.  
→ Suppress all Club join upsells until resolved.

**J — Cancelled auto-renew / lapsed**  
→ Day 14: “Rejoin for spring — £10/year, price locked at what you paid.”  
→ Savings recap from prior membership year.

### Cross-program

**K — Repeat buyer, 3+ orders, never joined**  
→ Post-purchase: “You spent £[LTV] — Club would have saved ~£[15% calc].”

**L — Club member, cart abandon**  
→ “Member savings of £[X] already applied — complete your order.” No discount escalation.

---

## Non-club scenarios (summary)

| Scenario | Flow |
|----------|------|
| First-time browse abandon (spring soft fruit) | Viewed products + planting window |
| Signup 10% off, no purchase 7 days | Code expiry reminder |
| New buyer — hydrangea | Day 3 care guide → day 14 review ask |
| Lapsing spring planter | Mid-Feb nudge if bought bare-root last year |
| Lapsed 12+ months | 4-email win-back; offer only email 3 |

---

## Suppression rules (agree with Jemma)

- Club members → exclude “join Club” upsells
- Failed renewal → exclude join upsells; priority payment update
- Active cart abandon sequence → exclude conflicting Gary promo (e.g. 48h)
- Monthly Club insider email → don’t double-send same week as Gary campaign on same topic
- Recent purchasers → exclude browse abandon (FR post-purchase suppression: 1 day minimum)

---

## Build priority

**Step-by-step implementation (start here):** [yougarden-automation-implementation-playbook.md](./yougarden-automation-implementation-playbook.md)  
Reference mappings: [yougarden-dotdigital-program-mappings.md](./yougarden-dotdigital-program-mappings.md)

| P | Program |
|---|---------|
| P0 | Cart abandon (member / non-member) |
| P0 | Browse abandon |
| P0 | Welcome + signup discount track |
| P1 | Post-purchase care + Club upsell |
| P1 | Club welcome + login reminder |
| P1 | Pre-renewal + failed payment |
| P2 | Voucher + P&P reminders |
| P2 | Club cart abandon |
| P2 | Seasonal lapsing / lapsed |
| P3 | Back in stock, early access, high-LTV Club pitch |

---

## Metrics

- Recovered cart revenue (member vs non-member)
- Club attach rate (checkout, welcome, post-purchase, abandon)
- Auto-renew success rate vs failed payment recovery
- Voucher & P&P redemption rate
- Login-within-7-days after join
- Renewal churn (cancel before renew)
- Unsubscribe rate on win-back / renewal series
