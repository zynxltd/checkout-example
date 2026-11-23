# React crash course — Vue / Laravel → React refresher

Hands-on UI lab for getting fluent in **React** when you already know **Vue** (and Laravel Blade / Inertia).

No backend required — mock catalogue + local cart. Pair with `python-react-crash-course` or `react-shopify-cart-drawer` when you want API / Shopify.

## Run

```bash
cd demos/react-crash-course
npm install
npm run dev
```

Open http://localhost:5179

```bash
npm test
```

## Tabs

| Tab | Purpose |
|-----|---------|
| Shop | Components, state, search, cart |
| Debug | Breakpoints + margin helper |
| AI review | Deliberately bad “AI” form to rewrite |

## Exercises

See **[EXERCISES.md](./EXERCISES.md)** — **10 tasks**.

## Commands (Laravel / Vue → React)

See **[COMMANDS.md](./COMMANDS.md)** — npm/Vite everyday CLI, debugging, use cases.

## Vue → React cheat sheet

| Vue | React |
|-----|--------|
| SFC `<script setup>` | Function component + hooks |
| `ref` / `reactive` | `useState` |
| `computed` | `useMemo` |
| `watch` / `onMounted` | `useEffect` |
| `v-model` | `value` + `onChange` |
| `v-for` + `:key` | `.map` + `key` |
| `defineProps` / emits | props + callbacks |
| composables | custom hooks |
| Pinia / provide-inject | lift state / Context (later) |
| Vue DevTools | React DevTools |
