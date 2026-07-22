# Import YouGarden automation journeys into Miro

Source playbook: [yougarden-automation-implementation-playbook.md](../yougarden-automation-implementation-playbook.md)

Miro has no direct “import Mermaid” button. Use one of these three methods:

---

## Method 1 — Mermaid → SVG → Miro (best for flowcharts)

**Best for:** Exact flows matching the playbook diagrams.

1. Open [mermaid.live](https://mermaid.live)
2. Open a file from `mermaid/` (e.g. `p0-1-cart-non-member.mmd`)
3. Copy all contents → paste into the editor
4. **Actions → Export SVG** (or PNG)
5. In Miro: drag the SVG onto the board, or **Upload** via the + menu
6. Repeat per program; use **Frames** to group P0, P1, P2, P3

**Tip:** Name each Miro frame after the program ID (`P0-CART-ABANDON-NON-MEMBER`).

---

## Method 2 — Miro Sidekick “Map user journey” (fastest)

**Best for:** Quick workshop boards with Jemma; editable in Miro.

1. In Miro, click **Sidekick** → **Map user journey** (or paste into “I want to create…”)
2. Open [sidekick-prompts.md](./sidekick-prompts.md)
3. Copy the prompt for one program → paste → generate
4. Tidy shapes and labels; link frames to Asana tasks if needed

---

## Method 3 — CSV sticky import (implementation tracker)

**Best for:** Kanban-style build tracking on the same board (not the flow itself).

1. In Miro: **+ → Upload / Import → CSV**
2. Select [program-tracker.csv](./program-tracker.csv)
3. Maps to sticky notes: Program ID, priority, build order, status

Place stickies beside the matching flowchart frame.

---

## File index — `mermaid/`

| File | Program |
|------|---------|
| `00-master-journey.mmd` | Full site journey map |
| `p0-1-cart-non-member.mmd` | P0.1 |
| `p0-2-cart-member.mmd` | P0.2 |
| `p0-3-browse-abandon.mmd` | P0.3 |
| `p0-4-welcome-signup.mmd` | P0.4 |
| `p1-overview.mmd` | P1 architecture overview |
| `p1-1-post-purchase.mmd` | P1.1 |
| `p1-2-club-welcome.mmd` | P1.2 |
| `p1-3-club-renewal.mmd` | P1.3 renewal |
| `p1-3-club-payment-failed.mmd` | P1.3 failed payment |
| `p1-ct-plant-finder.mmd` | P1.4 custom trigger |
| `p2-1-voucher-5.mmd` | P2.1 |
| `p2-2-club-cart-abandon.mmd` | P2.2 |
| `p2-3-lapsing.mmd` | P2.3 lapsing |
| `p2-3-lapsed-winback.mmd` | P2.3 lapsed |
| `p2-4-club-lapsed.mmd` | P2.4 |
| `p3-1-back-in-stock.mmd` | P3.1 |
| `p3-2-price-drop.mmd` | P3.2 |
| `p3-3-member-early-access.mmd` | P3.3 |
| `p3-4-club-high-ltv.mmd` | P3.4 |

---

## Suggested Miro board layout

```
┌─────────────────────────────────────────────────────────┐
│  FRAME: Master journey (00-master)                       │
├──────────────┬──────────────┬──────────────┬────────────┤
│ FRAME: P0    │ FRAME: P1    │ FRAME: P2    │ FRAME: P3  │
│ (4 flows)    │ (5 flows)    │ (5 flows)    │ (4 flows)  │
├──────────────┴──────────────┴──────────────┴────────────┤
│  STICKIES: program-tracker.csv (build order checklist)   │
└─────────────────────────────────────────────────────────┘
```

---

## Alternatives to Miro

| Tool | Import path |
|------|-------------|
| **FigJam** | Same SVG from mermaid.live; drag onto canvas |
| **Lucidchart** | Mermaid plugin or manual; export to Miro if needed |
| **draw.io** | Arrange → Insert → Advanced → Mermaid (some versions) |
