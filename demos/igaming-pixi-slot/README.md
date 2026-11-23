# Neon Reels — iGaming PixiJS + GSAP demo

HTML5 slot demo matching a mid-level JS games stack:

| Tech | Role |
|------|------|
| **TypeScript** | Strong typing / OOP |
| **PixiJS** | WebGL/canvas rendering |
| **GSAP** | Reel spin + win FX |
| **Vite** | Dev server / build |
| Custom `framework/` | Stand-in for an in-house game framework |

```
src/
  main.ts
  framework/
    Game.ts          # bootstrap + economy
    SlotMachine.ts   # 3-reel cabinet
    Reel.ts          # masked reel + GSAP spin
    SlotSymbol.ts    # symbol tile
    SymbolDefs.ts    # weights + paytable
```

## Run

```bash
cd demos/igaming-pixi-slot
npm install
npm run dev
```

Open http://127.0.0.1:5174

**Space** or **SPIN** to play. 3 matching centre-payline symbols = win (`bet × payout`).
