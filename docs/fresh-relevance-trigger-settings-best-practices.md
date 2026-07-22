# Fresh Relevance — Trigger Settings Best Practices

> **See also:** [Dotdigital migration & automation research](./dotdigital-automation-migration-research.md) — full program best practices, timeline, and Jemma session agenda.

Source: [Trigger settings | Fresh Relevance Help Center](https://support.freshrelevance.com/en/articles/11313997-trigger-settings)

---

## Cart & data quality filters

| Setting | Best practice | Suggested value |
|--------|----------------|-----------------|
| **Disregard carts with more items than this** | Exclude very large carts — usually bots, crawlers, or scanners, not real shoppers. Avoids remarketing to them and polluting reports. | **50** items |
| **Disregard carts with a higher value than this** | Exclude abnormally high-value carts — often a malfunction or bad data capture. | **£100,000 equivalent** in your [reporting currency](https://support.freshrelevance.com/en/articles/8937229-basic-account-configuration#h_ccf8cca962) |

---

## Abandonment timing

| Setting | Best practice | Suggested value |
|--------|----------------|-----------------|
| **Abandonment unattended interval** | Minimum delay before a cart or browse abandonment email can send. Treats a session/cart as abandoned after this period. | **15+ minutes** (use shorter only when testing) |
| **Abandonment after purchase — suppression interval** | Block new abandonment triggers for a period after any purchase. | **1440 min (1 day)** |
| **Abandonment after purchase — same cart suppression interval** | Block abandonment triggers for the *same cart contents* after a purchase on that cart. | **1440 min (1 day)** |

---

## Remarketing windows & frequency

| Setting | Best practice | Suggested value |
|--------|----------------|-----------------|
| **Remarketing attribution interval** | How long remarketing and SmartBlock impressions are assumed to influence purchases. | **1440 min (1 day)** |
| **Remarketing slice size** | Minimum gap between *starting* trigger programs; also controls how far back browsed products are included in browse-abandon emails. Prevents overlapping programs (e.g. cart abandon + browse abandon firing too close together). | Configure to match your program spacing (example in docs: **120 min** if you want a 2-hour gap between program starts) |
| **Contact remarketing pressure interval** | “Ignore period” after a contact is remarketed — further contact attempts in this window are **blocked** (campaigns are suppressed, not delayed). Some programs (e.g. *Purchase complete*) can ignore this. Per-stage overrides exist on trigger options. | **1435 min (~23h 55m)** |

**Slice size vs pressure interval**

- *Slice size* — stops someone from **entering** another trigger program too soon after one started.
- *Pressure interval* — stops **sends** even if they qualify for a trigger, until the interval has passed.

Example: slice size 120 min — cart abandon fires at 30 min; if they return within 2 hours and browse again, browse abandon won’t **start**. If they return after 2+ hours, browse abandon can start — but they may still not **receive** email if pressure interval (e.g. 24h) hasn’t elapsed.

---

## Purchase signals

| Setting | Best practice | Suggested value |
|--------|----------------|-----------------|
| **Minimum seconds between purchase complete signals** | Merge duplicate purchase signals for the same shopper (carts often fire twice). | **60 sec (1 min)** |
| **Minimum seconds between adjacent purchase complete signals for the same cart value** | Merge duplicate purchases at the same cart value. Safe to set high — rare for a shopper to buy the same value twice in minutes. | **600 sec (10 min)** |
| **If a purchased signal doesn’t contain a value, minutes to scan back for a cart signal** | When purchase signal has no value, look back for the most recent cart signal to infer recovered value. Older cart signals beyond this window are ignored. | Set per your typical checkout-to-confirmation delay |

---

## Permissions & compliance

| Setting | Best practice |
|--------|----------------|
| **Require positive permission in Fresh Relevance when sending emails and analytics** | If enabled: send and load analytics only where permission is granted in FR. If disabled: send when email is captured even without FR permission. If enabling, consider enabling **email permission imports** via *Data Requests with the email permission field* under **Settings → Triggers and messaging integrations → Campaign-based Identification**. |
| **Require positive permission in Fresh Relevance when sending SMS** | Same logic as email — only send SMS where mobile permission is granted in FR if enabled. |

---

## Browse abandon & branding

| Setting | Best practice |
|--------|----------------|
| **Browse abandon can only include one Site brand** | Enable if you have multiple site brands (e.g. EN/ES) — keeps one brand per browse-abandon email. |

---

## Tracking & testing

| Setting | Best practice |
|--------|----------------|
| **Blackholed sends are recorded** | Off for accurate summary reports. Enable for control-group tests — records sends to blackhole/catch-all addresses and attributes sales (less accurate summaries, more test data). |
| **Identify visitors when they click on a link in a trigger** | Enable to append person ID to email links via `tmpi` query parameter for identification on click. |

---

## Quick configuration checklist

1. **Bot / bad data** — cap cart size (~50 items) and value (~£100k equivalent).
2. **Abandonment** — 15+ min unattended; 1-day suppression after purchase.
3. **Frequency** — ~24h attribution and pressure interval; align slice size with how close your programs should start.
4. **Purchases** — dedupe at 60s (same shopper) and 600s (same cart value).
5. **Permissions** — match to how you capture consent; wire imports if requiring positive permission.
6. **Multi-brand** — single-site-brand rule on browse abandon if applicable.
