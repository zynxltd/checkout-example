# Shopify: Liquid vs React — quick clarification

**Short answer:** Shopify storefront themes are primarily **Liquid** (+ HTML/CSS/JS). **React** is used in other Shopify surfaces (admin apps, Hydrogen headless, many extensions) — not as a replacement for Liquid inside a classic Online Store theme.

---

## Two different “Shopify front ends”

| Surface | What customers/staff see | Main UI tech |
|---------|--------------------------|--------------|
| **Online Store (hosted theme)** | The shop on `yourstore.myshopify.com` | **Liquid** templates + CSS + JS (often vanilla/Alpine; some use Web Components) |
| **Headless / Hydrogen** | Custom storefront (often on Oxygen/other host) | **React** (Remix/Hydrogen) talking to Storefront API |
| **Admin / embedded apps** | Merchant tools inside Shopify Admin | **React** (Remix + **Polaris** design system is common) |
| **Extensions** | Checkout UI, POS, customer accounts, etc. | Often **React** (extension APIs / preact-like runtimes depending on type) |

So: **Liquid ≠ React**, and Shopify **does** allow React — in the right product area.

---

## What Liquid is

- Shopify’s **server-side templating** language (like Blade, but Shopify-specific).
- Renders HTML from shop data: products, cart, collections, `{{ product.title }}`, `{% for %}`, sections, snippets.
- Themes = Liquid + assets (CSS/JS). Theme editor / Online Store 2.0 = **sections** and JSON templates — still Liquid-centric.
- Browser JS can enhance the page (AJAX cart, your cart drawer) without React.

**Laravel cousin:** Blade views. Liquid is not a full app framework; the “backend” is Shopify’s platform.

---

## Where React shows up

### 1. Shopify apps (merchant admin)

Build an app that merchants install → UI often **React + Remix** (Shopify’s app templates), Polaris components, App Bridge to embed in admin.

Job ads saying “Shopify + React” often mean **apps / custom admin tooling**, not “rewrite the theme in React.”

### 2. Hydrogen (headless commerce)

You own the storefront in **React**. Shopify is the commerce engine via **Storefront API** (GraphQL). No classic Liquid theme (or theme is unused for the main site).

### 3. UI extensions

Checkout branding/fields, thank-you pages, etc. — many are built with Shopify’s extension framework using **React**.

### 4. Your own JS on a Liquid theme

You can load a **React bundle** on a theme page (e.g. cart drawer) via a `<script type="module">` / Vite build. That’s **your** React island on a Liquid-rendered page — common pattern; Shopify doesn’t ban it.

**This repo:** `demos/react-shopify-cart-drawer` — React cart/upsell UI meant to sit in a storefront context (Liquid host page + React widget), not a full Hydrogen app.

---

## Mental model

```text
Classic theme storefront
────────────────────────
  Shopify renders Liquid → HTML
       + optional JS/React islands (cart drawer, quizzes…)

Headless
────────
  Your React app → Storefront API → Shopify

Merchant app
────────────
  Your React admin UI → Admin API → Shopify
```

---

## What job ads usually mean

| Phrase | Likely expectation |
|--------|-------------------|
| “Shopify theme / Liquid” | Sections, snippets, cart, metafields, theme JS |
| “Shopify + React” | Apps and/or Hydrogen and/or React widgets on themes |
| “Shopify experience a plus” | You’ve touched cart/checkout/APIs; Liquid *or* app React both count |

For the **Python + React SE** role that listed Shopify as desirable: React skills transfer; Shopify-specific = APIs, webhooks, cart/checkout concepts, maybe Liquid basics — not “React replaces Liquid everywhere.”

---

## Do you need to learn Liquid?

| Path | Liquid? |
|------|---------|
| Theme agency / storefront tweaks | **Yes** |
| Headless / Hydrogen | Optional (API + React matter more) |
| Admin apps | Minimal Liquid; **React** + Admin API |
| “Plus” on a general SE ad | Skim Liquid; build one React cart island or read webhook docs |

Cheat sheet:

```liquid
{{ product.title }}
{% if product.available %}…{% endif %}
{% for item in cart.items %}…{% endfor %}
{% render 'cart-drawer' %}
```

Same job as Blade `{{ }}` / `@if` / `@foreach` / `@include`.

---

## One-liner

> **Liquid = Shopify’s theme HTML templates. React = first-class for apps, Hydrogen, extensions, and optional islands on themes — not the language Liquid is written in.**

## Live examples (checked **28 Jul 2026**)

| Site | Stack | How you can tell |
|------|--------|------------------|
| **[dusk.com](https://dusk.com/)** | **Liquid** Online Store theme | `powered-by: Shopify`, `Shopify.theme` (schema *Underscore*), `shopify-section` |
| **[skims.com](https://skims.com/)** | **Hydrogen** (React) on Oxygen | `powered-by: Shopify, Oxygen, Hydrogen` — no classic theme shell |

**Liquid (DUSK):** page HTML comes from theme sections. Apps may still inject React/JS *islands*.

**React / Hydrogen (SKIMS):** the storefront itself is a React app (Remix/Hydrogen) talking to Shopify’s Storefront API, hosted on Oxygen. Other live Hydrogen examples: [chubbiesshorts.com](https://chubbiesshorts.com/), [bubblegoods.com](https://bubblegoods.com/), [timothy.london](https://timothy.london/).

Hands-on demo (Liquid shell + React bag island, DUSK-style): [`demos/shopify-liquid-vs-react`](../demos/shopify-liquid-vs-react/).
