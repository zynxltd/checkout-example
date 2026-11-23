# Node.js commands — Laravel / Vue → Node

Cheat sheet for day-to-day **Node.js** (Express MVC, npm, optional Nuxt) when you already know **Laravel + Vue / Composer / Artisan**.

Companion labs in this repo:

- Express MVC: [`demos/node-mvc-demo`](../node-mvc-demo/) → http://127.0.0.1:3090  
- **Node + React SaaS:** [`demos/node-react-saas`](../node-react-saas/) → API `:5210` + Web `:5180`  
- Nuxt quiz: [`demos/node-nuxt-product-quiz`](../node-nuxt-product-quiz/)  
- React (front-end only): [`demos/react-crash-course/COMMANDS.md`](../react-crash-course/COMMANDS.md)

---

## Mental model

| Laravel | Node.js |
|---------|---------|
| PHP runtime | **Node.js** runtime (`node`) |
| `composer` | **`npm`** / `pnpm` / `yarn` (same tool you already use for Vue) |
| `artisan serve` | `node server.js` / `npm run dev` |
| `routes/*.php` | Express `Router` / Nuxt `server/api` / `app/pages` |
| Blade | **EJS** / Pug / React / Vue SFC |
| Eloquent | Prisma / Drizzle / Mongoose / plain SQL — or in-memory models |
| `.env` | `.env` + `process.env` (`dotenv`) |
| Queues (Redis) | BullMQ / Agenda / cloud queues |
| `phpunit` / Pest | **Jest** / Vitest / Node test runner |

Node can be **full stack** (Express renders EJS like Blade) or **API-only** behind React/Vue — same split as Laravel API + SPA.

---

## Install & check Node

```bash
node --version          # LTS recommended (e.g. 22.x)
npm --version
npx --version
```

Version managers (pick one — like `php` version switching):

```bash
# nvm
nvm install --lts
nvm use --lts
nvm alias default node

# fnm / n / asdf — same idea
```

| | |
|--|--|
| **When** | New machine; match team’s Node version (`.nvmrc`) |
| **How** | Commit `.nvmrc` with `22` or `20` |
| **Debug** | “Engine mismatch” → `nvm use`; delete `node_modules` + reinstall |

```bash
echo "22" > .nvmrc
nvm use
```

---

## Create projects (≈ `composer create-project`)

```bash
# Empty folder + package.json
mkdir my-api && cd my-api
npm init -y
npm pkg set type=module          # modern ESM (import/export)

# Express API / site
npm install express
npm install -D nodemon           # or use node --watch (Node 18+)

# Full-stack meta frameworks
npm create nuxt@latest my-nuxt
npm create next-app@latest my-next
npm create vite@latest my-react -- --template react
```

| Command / approach | Laravel cousin | When |
|--------------------|----------------|------|
| `npm init` + Express | Plain PHP / Lumen-ish | Simple API or MVC demo |
| `npm create nuxt@latest` | Laravel + Inertia/Vue opinionated | Full-stack Vue-on-Node |
| `npm create vite@latest` | Front-end only | SPA talking to any API |
| NestJS (`@nestjs/cli`) | Structured Laravel-like modules | Larger enterprise APIs |

This repo’s Express MVC:

```bash
cd demos/node-mvc-demo
npm install
npm run dev          # node --watch server.js → :3090
npm start            # node server.js (no watch)
```

---

## Package management (you already know this from Vue)

| Goal | Laravel | Node |
|------|---------|------|
| Install | `composer install` / `npm install` | `npm install` |
| Add dep | `composer require x` | `npm install x` |
| Dev dep | `composer require --dev` | `npm install -D x` |
| Remove | `composer remove` | `npm uninstall x` |
| Lockfile | `composer.lock` | **`package-lock.json`** — commit it |
| CI install | `composer install --no-dev` | **`npm ci`** |

```bash
npm install                 # local after clone
npm ci                      # CI / Docker — clean from lockfile
npm outdated
npm update                  # prefer intentional version bumps
npm audit
npm audit fix               # review carefully
```

| | |
|--|--|
| **When to use `npm ci`** | Pipelines — reproducible builds |
| **Debug** | Delete `node_modules` + `npm ci` if phantom peer errors |

Global tools (sparingly):

```bash
npm install -g npm@latest
npx cowsay "prefer npx over global installs"
```

`npx` runs a package once without a permanent global install (handy for CLIs).

---

## Everyday scripts (`package.json`)

```json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js",
    "test": "node --test",
    "lint": "eslint ."
  }
}
```

| Script | Laravel / Vue cousin | When |
|--------|----------------------|------|
| `npm run dev` | `artisan serve` + watch | Local with auto-restart |
| `npm start` | `artisan serve` prod-ish | Process managers / Docker CMD |
| `npm test` | `artisan test` | PR checks |
| `node --watch` | Mix/Vite watch (server side) | Built-in; no nodemon required |

Nodemon alternative (older tutorials):

```bash
npm i -D nodemon
# "dev": "nodemon server.js"
```

---

## Express MVC map (this demo)

| Laravel | Express (`node-mvc-demo`) |
|---------|---------------------------|
| `routes/web.php` | `routes/*.js` |
| Controller | `controllers/*.js` |
| Eloquent model | `models/*.js` (in-memory here) |
| Blade | `views/*.ejs` |
| `public/` | `public/` |
| `bootstrap/app.php` | `server.js` |

There is **no** `php artisan make:controller` by default — create files (or use generators in Nest/Adonis).

AdonisJS is the closest “Laravel for Node” if you want Artisan-like UX later.

---

## Env & config (≈ `.env`)

```bash
npm install dotenv
```

```js
import 'dotenv/config'
const port = process.env.PORT || 3090
```

```bash
# .env
PORT=3090
NODE_ENV=development
```

| | |
|--|--|
| **When** | Secrets, ports, DB URLs |
| **How** | Never commit real `.env`; ship `.env.example` |
| **Debug** | `console.log(process.env.PORT)`; ensure dotenv loaded **before** reading env |

`NODE_ENV=production` flips caching / error detail behaviour in many frameworks.

---

## HTTP checks (≈ hitting Laravel routes)

```bash
curl -s http://127.0.0.1:3090/
curl -s http://127.0.0.1:3090/products
curl -s -X POST http://127.0.0.1:3090/contact \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=Tom&email=tom@example.com&message=Hello'
```

| | |
|--|--|
| **When** | API / form debugging without the browser |
| **Use case** | Same as Insomnia / `curl` against `artisan serve` |

---

## Testing

### Node built-in test runner (no Jest required)

```bash
node --test
node --test tests/*.test.js
```

### Jest / Vitest (common in teams)

```bash
npm i -D vitest
# "test": "vitest run"
npm test
```

Supertest ≈ Laravel HTTP tests:

```bash
npm i -D supertest
```

| | |
|--|--|
| **When** | Controllers, route handlers, pure helpers |
| **Use case** | PR confidence like Pest |
| **Debug** | `node --test --test-reporter=spec`; IDE breakpoint in test file |

---

## Debugging

### 1. IDE breakpoints (best)

1. Cursor / VS Code: **JavaScript Debug Terminal** or launch config `"program": "${workspaceFolder}/server.js"`
2. Breakpoint in a controller
3. Hit the route in the browser
4. Step: F10 / F11

### 2. Chrome DevTools for Node

```bash
node --inspect --watch server.js
# open chrome://inspect → Open dedicated DevTools for Node
```

| | |
|--|--|
| **When** | Deep async / Express middleware bugs |
| **Use case** | Same power as PHP Xdebug, different UI |

This demo also exposes a package script:

```bash
cd demos/node-mvc-demo
npm run inspect
# app http://127.0.0.1:3090
# debugger ws://127.0.0.1:9230
```

### 3. Logging (≈ `Log::info` / `dd`)

```js
console.log('product', product)
console.table(rows)
console.error(err)
debugger  // pauses if inspector attached
```

Structured (production):

```bash
npm i pino pino-http
```

Morgan (already in MVC demo) logs HTTP requests — like middleware request log.

### 4. Common failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ERR_MODULE_NOT_FOUND` | Bad path / missing `"type":"module"` | Check imports; use `.js` extensions in ESM |
| Port in use `EADDRINUSE` | Old process | `lsof -i :3090` → kill; or change `PORT` |
| `Cannot find package` | Forgot install | `npm install` |
| Blank / HTML error | Unhandled async error | `try/catch` + Express error middleware |
| `require is not defined` | ESM vs CJS mix | Use `import` or rename `.cjs` |
| Nodemon loops | Writing files in watched dir | Ignore `uploads/` / logs in config |

### 5. Kill stuck server

```bash
lsof -i :3090
kill -9 <PID>
```

### 6. Auth + dashboard smoke

```bash
curl -i http://127.0.0.1:3090/login

curl -i -c cookies.txt -b cookies.txt \
  -X POST http://127.0.0.1:3090/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'email=demo@harbor.test&password=letmein123'

curl -i -b cookies.txt http://127.0.0.1:3090/dashboard

curl -i -X POST http://127.0.0.1:3090/contact \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=Tom&email=tom@example.com&message=Queue+this+lead+please'
```

---

## Process managers / production (awareness)

```bash
npm start                          # simple
npx pm2 start server.js --name api # keep-alive (common on VPS)
docker run ...                     # container CMD: node server.js
```

| | |
|--|--|
| **When** | Deploy beyond laptop |
| **Use case** | Cousin of `php-fpm` + Nginx — often Node behind Nginx reverse proxy |
| **Debug** | Check `NODE_ENV`, logs, health route |

---

## Nuxt (Node + Vue full-stack)

If you know Vue, Nuxt feels closer than Express:

```bash
cd demos/node-nuxt-product-quiz
npm install
npm run dev
npm run build
npm run preview
```

| Nuxt | Laravel / Vue |
|------|---------------|
| `app/pages` | routes + Inertia pages |
| `server/api/*.ts` | `routes/api.php` |
| `npm run dev` | `artisan serve` + Vite |
| `npm run build` | production assets + server |

---

## Use-case recipes

| Use case | Commands / approach |
|----------|---------------------|
| Learn Express MVC from Laravel | `cd node-mvc-demo && npm run dev` |
| JSON API for React | Express `res.json()` routes or Fastify |
| Vue full-stack on Node | Nuxt (`node-nuxt-product-quiz`) |
| Script / one-off job | `node scripts/report.js` (like `artisan` command) |
| Watch + iterate | `npm run dev` (`node --watch`) |
| PR checks | `npm ci && npm test && npm run build` (if applicable) |
| Debug a controller | Breakpoint + browser hit `/products` |

---

## TypeScript (optional, common in jobs)

```bash
npm i -D typescript tsx @types/node @types/express
npx tsc --init
npx tsx watch server.ts
```

| | |
|--|--|
| **When** | Larger codebases / team SE roles |
| **Use case** | Types like PHPStan-level safety on the JS side |

---

## Quick “I used to type…” map

| Laravel / Vue | Node.js |
|---------------|---------|
| `composer install` | `npm install` / `npm ci` |
| `php artisan serve` | `npm run dev` / `node server.js` |
| `php artisan test` | `npm test` / `node --test` |
| `composer require x` | `npm install x` |
| `php artisan route:list` | read `routes/` or log on boot; no built-in default |
| `php artisan tinker` | `node` REPL |
| `dd($x)` / `Log::info` | `console.log` / `debugger` / Pino |
| `.env` | `.env` + `process.env` |
| Blade | EJS (this demo) / Vue / React |
| `npm run dev` (Vite) | same for front-end; Express is separate process |

---

## Related command sheets

| Stack | Doc |
|-------|-----|
| React | [../react-crash-course/COMMANDS.md](../react-crash-course/COMMANDS.md) |
| Python / FastAPI | [../python-react-crash-course/COMMANDS.md](../python-react-crash-course/COMMANDS.md) |
| .NET | [../dotnet-mvc-crash-course/COMMANDS.md](../dotnet-mvc-crash-course/COMMANDS.md) |
| Hub | [../../docs/laravel-to-stack-commands.md](../../docs/laravel-to-stack-commands.md) |
