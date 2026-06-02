# YouGarden brand fonts (Gelica + Proxima Nova)

The cart drawer prototype uses **Gelica** for headings and **Proxima Nova** for body UI copy, per the 2026 brand guidelines.

## Option A — Adobe Fonts (recommended for demos)

1. Open [Adobe Fonts](https://fonts.adobe.com/) while signed in to Creative Cloud.
2. Add **Gelica** and **Proxima Nova** to a new **Web Project**.
3. Publish the project and copy the **embed ID** from the kit URL (`https://use.typekit.net/XXXXX.css`).
4. In the Laravel app root, set in `.env`:

   ```
   ADOBE_FONTS_KIT=XXXXX
   ```

5. Refresh the demo site.

## Option B — Self-hosted woff2

If you have a web licence, place files here (exact names):

```
public/fonts/gelica/gelica-regular.woff2
public/fonts/gelica/gelica-bold.woff2
public/fonts/gelica/gelica-bold-italic.woff2
public/fonts/proxima-nova/proxima-nova-regular.woff2
public/fonts/proxima-nova/proxima-nova-semibold.woff2
public/fonts/proxima-nova/proxima-nova-bold.woff2
```

Export from Photoshop / your font vendor as **woff2**. Photoshop desktop fonts alone are not served to browsers unless activated for web (Adobe Fonts) or exported as woff2.

## CSS family names

When using Adobe Fonts, the kit usually exposes `gelica` and `proxima-nova` — these match `public/css/yg-fonts.css`.
