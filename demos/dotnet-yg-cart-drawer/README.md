# YouGarden Cart Drawer — ASP.NET port

Faithful recreation of the Laravel `yg-cart-drawer-demo` basket UX as an **ASP.NET Core Razor Pages** app.

Lives beside the original PHP app: this folder does **not** replace the Laravel project.

## Run

```bash
cd demos/dotnet-yg-cart-drawer
dotnet run
```

Open the URL shown (default `http://localhost:5xxx`).

## Cart behaviours (Laravel parity)

- Add / qty / remove / fragment remount
- Offer codes `TEST` / `EM0000`
- Club panel (auto £10 + manual £20) + club pricing when membership in basket
- Free-delivery progress bar, recommendations rail / inline
- Mini-basket preview + header count
- Prototype toggles on Home
- PDP `#demo-add-to-basket` with qty input
- Checkout summary from same session cart

Not a full Argos homepage / account area clone — cart drawer + core storefront flows.
