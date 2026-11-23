# Tripetto horizontal autoscroll + custom blocks

React demo of the [Tripetto FormBuilder SDK](https://tripetto.com/sdk/docs/): the stock **autoscroll** runner in **horizontal** mode, with custom node blocks.

## Use case

**Plant Match** — sun → space → optional email. Card picks auto-advance; answers drive an on-page planting recommendation.

## What’s included

| Piece | Role |
|-------|------|
| Stock autoscroll runner | `AutoscrollRunner` with `styles.direction: "horizontal"` |
| Sun exposure block | `sun-exposure` — visual card picker |
| Garden space block | `garden-space` — stacked choice cards |
| Email capture block | `email-capture` — simple text input |

Blocks register with the autoscroll `namespace` via `@tripetto({ type: "node", namespace, identifier: "…" })`. Form JSON lives in `src/definition.ts`.

## Run

```bash
cd demos/tripetto-custom-blocks
npm install
npm run dev
```

Open **http://127.0.0.1:5176**

## Layout

```
src/
  blocks/           # custom question types (autoscroll runner parts)
  runner/           # earlier custom-runner experiment (unused by App)
  definition.ts     # Tripetto form definition
  App.tsx           # horizontal AutoscrollRunner + recommendation
```
