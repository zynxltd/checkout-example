# React commands — Laravel / Vue → React

Cheat sheet for day-to-day React (Vite) when you already know **Laravel + Vue / npm**.

Companion lab: [`demos/react-crash-course`](../react-crash-course/).

---

## Mental model

| Laravel / Vue world | React world |
|---------------------|-------------|
| `composer` + `npm` | Usually **just `npm`** (or `pnpm` / `yarn`) |
| `php artisan serve` + `npm run dev` | `npm run dev` (Vite serves UI; API is separate) |
| `npm run build` → Mix/Vite assets | `npm run build` → static `dist/` |
| Vue SFC / Inertia page | `.jsx` / `.tsx` component |
| Vue DevTools | **React Developer Tools** browser extension |
| `phpunit` / Pest | **Vitest** / Jest + Testing Library |

React is the **front-end runtime**. It does not replace Artisan, queues, or migrations — pair it with Laravel, FastAPI, or ASP.NET for the API.

---

## Create & run

### Scaffold a Vite + React app

```bash
npm create vite@latest my-app -- --template react
# or TypeScript:
npm create vite@latest my-app -- --template react-ts

cd my-app
npm install
npm run dev
```

| | |
|--|--|
| **When** | New SPA, demo, or crash-course UI |
| **How** | Vite templates wire React + HMR |
| **Use case** | Greenfield UI; same role as `npm create vue@latest` |
| **Debug** | If port busy, change `server.port` in `vite.config.js` |

### This repo’s React refresher

```bash
cd demos/react-crash-course
npm install
npm run dev          # http://localhost:5179
npm run build        # production bundle → dist/
npm run preview      # serve the build locally
npm test             # vitest once
npm run test:watch   # vitest watch mode
```

---

## Package management (vs Composer / npm in Laravel)

| Goal | Laravel / Vue | React (npm) |
|------|---------------|-------------|
| Install deps | `composer install` / `npm install` | `npm install` |
| Add library | `npm i lodash` | `npm i lodash` |
| Add dev tool | `npm i -D vitest` | `npm i -D vitest` |
| Remove | `npm uninstall lodash` | same |
| Lockfile | `package-lock.json` | same — **commit it** |
| CI clean install | `npm ci` | **prefer `npm ci` in CI** |

```bash
npm install              # local / first clone
npm ci                   # CI: clean install from lockfile only
npm outdated             # see upgrades
npm update               # careful — prefer intentional bumps
```

| | |
|--|--|
| **When to use `npm ci`** | Pipelines, Docker builds — reproducible |
| **When to use `npm install`** | Local dev after pulling lockfile changes |
| **Debug** | Delete `node_modules` + re-run `npm ci` if peer dependency hell |

---

## Everyday scripts

Typical `package.json` scripts (Vite React):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint ."
  }
}
```

| Command | Laravel / Vue cousin | When |
|---------|----------------------|------|
| `npm run dev` | `npm run dev` (Vite) | Local UI with HMR |
| `npm run build` | `npm run build` | Ship / CI artifact |
| `npm run preview` | serve `public/build` | Smoke-test production bundle |
| `npm test` | `php artisan test` | PR checks |
| `npx eslint .` | Pint / ESLint in Vue | Style / bugs |

### Proxy API in Vite (like Laravel mix proxy)

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: { '/api': 'http://127.0.0.1:8200' },
  },
})
```

| | |
|--|--|
| **When** | SPA talks to FastAPI / ASP.NET / Laravel API on another port |
| **Use case** | Avoid CORS in local dev |
| **Debug** | Network tab: confirm request goes to Vite origin, not wrong host |

---

## Component workflow (vs Vue)

| Task | Vue | React |
|------|-----|--------|
| New page/component | `components/Foo.vue` | `components/Foo.jsx` |
| Props | `defineProps` | function args / `props` |
| Emit event | `emit('save')` | `onSave()` callback prop |
| Local state | `ref` / `reactive` | `useState` |
| Side effect | `onMounted` / `watch` | `useEffect` |
| Shared logic | composable | custom hook `useX` |

There is **no** `php artisan make:component` equivalent by default — create files manually (or use your IDE snippet).

---

## Testing

```bash
npm test                 # vitest run
npm run test:watch       # TDD loop
```

Testing Library pattern (cousin of Vue Test Utils):

```bash
npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

| | |
|--|--|
| **When** | Forms, cart logic, hooks — not every presentational div |
| **Use case** | Catch regressions before PR (same mindset as Pest feature tests) |
| **Debug** | `screen.debug()`; fail messages show DOM snapshot |

---

## Debugging

### 1. React Developer Tools

- Install browser extension **React Developer Tools**
- Inspect props/state (like Vue DevTools)
- Profiler tab for slow renders

### 2. Breakpoints in VS Code / Cursor

1. Run `npm run dev`
2. Set breakpoint in a `.jsx` file
3. Use “JavaScript Debug Terminal” or attach to Chrome
4. Trigger the UI action

### 3. Browser

```bash
# Chrome DevTools
# Sources → Ctrl+P → open component file → breakpoint
# Network → filter Fetch/XHR for API issues
# Console → errors from render / effects
```

### 4. Common failure modes

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Blank screen | Exception in render | Console stack; wrap optional chaining |
| Infinite loop | `useEffect` missing deps / setState in render | Check effect deps; never setState unconditionally in body |
| Stale UI | Mutated state in place | Always copy arrays/objects (`[...prev]`) |
| “Hooks order” error | Hook inside `if` | Hooks only at top level of component |
| CORS errors | API other origin, no proxy | Vite proxy or API CORS |

### 5. Logging

```js
console.log('lines', lines)           // quick
console.table(products)               // lists
debugger                              // hard pause when DevTools open
```

Prefer React DevTools over `console.log` spam once comfortable.

---

## Build & ship

```bash
npm run build     # outputs dist/
# static host / CDN / Nginx root = dist
# or copy into Laravel public/ for monolith deploy
```

| | |
|--|--|
| **When** | CI, staging, production |
| **Use case** | Same as `npm run build` in a Vue Laravel app |
| **Debug** | `npm run preview` after build; check env vars (`import.meta.env.VITE_*`) were inlined |

Env files:

```bash
# .env.development / .env.production
VITE_API_URL=http://127.0.0.1:8200
```

Only `VITE_`-prefixed vars are exposed to the browser (security — don’t put secrets here).

---

## Use-case recipes

| Use case | Commands / approach |
|----------|---------------------|
| Local UI only | `npm run dev` |
| UI + Python API | API on `:8200`, Vite proxy or `VITE_API_URL` |
| UI + Laravel API | `php artisan serve` + `npm run dev` + proxy `/api` |
| PR quality gate | `npm test && npm run build` |
| Shopify-like cart | See also `demos/react-shopify-cart-drawer` |
| Learn React from Vue | Work through `EXERCISES.md` in this folder |

---

## Quick “I used to type…” map

| I typed in Laravel/Vue… | Now I type… |
|-------------------------|-------------|
| `php artisan serve` | (API separate) or N/A for pure React |
| `npm run dev` | `npm run dev` |
| `npm run build` | `npm run build` |
| `php artisan test` | `npm test` |
| `composer require X` | `npm i X` (front-end lib) |
| Vue DevTools | React DevTools |
| `dd($x)` in PHP | `console.log` / DevTools / `debugger` |
