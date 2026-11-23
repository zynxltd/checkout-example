# Account portal — saved for later

## Club referral (member → non-member)

**Idea:** Club members invite non-members. When the friend places their **first order**, they get **10% off**; the referrer unlocks a **10% voucher** after that order completes.

### Proposed mechanic
- Member shares a unique invite code / link (e.g. `REF-RLL-88`)
- Friend is a new customer (or non-member)
- Friend’s first order uses the invite → **10% off**
- After order completes / ships → referrer gets a **10% voucher** on the Club page

Prefer **friend-first reward, referrer after completion** (clearer margin + less fraud) over both getting 10% at the same checkout.

### Journey touchpoints
1. **Club membership page** — “Invite a friend”: code, Copy, Share, referred count, pending / unlocked vouchers
2. **Order confirmation** — prompt to share invite
3. **Guest Club page** — “Been invited? Enter a friend’s code”
4. **Checkout** — voucher field accepts referral codes + helper copy

### Guardrails (even in mock)
- One reward per referred customer
- Referrer must be an active Club member
- Min order value for the friend’s first order
- Referral voucher expiry (e.g. 30 days)

### Demo UI (when building)
- Invite block above / below existing £5 + postage vouchers
- States: pending (“Waiting for first order”) · unlocked (`Apply at checkout` — same pattern as current vouchers)

**Status:** backlog — not started  
**Source:** Club membership journey discussion (Sep 2026)
