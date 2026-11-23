import { useCallback, useMemo, useState } from "react";
import { SpinWheel } from "./components/SpinWheel";
import { PRIZES, pickPrizeIndex, type Prize } from "./prizes";
import "./styles/app.css";

const STORAGE_KEY = "yg-spin-result-v1";

type Saved = { prizeId: string; at: string };

function loadSaved(): Prize | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Saved;
    return PRIZES.find((p) => p.id === data.prizeId) ?? null;
  } catch {
    return null;
  }
}

export default function App() {
  const initial = useMemo(() => loadSaved(), []);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(initial);
  const [copied, setCopied] = useState(false);

  const spun = Boolean(result) && !spinning;

  const spin = useCallback(() => {
    if (spinning || result) return;

    const index = pickPrizeIndex();
    const prize = PRIZES[index];
    const sweep = 360 / PRIZES.length;
    // Pointer is at top; slice centres need to land under pointer.
    const sliceCenter = index * sweep + sweep / 2;
    const turns = 5 + Math.floor(Math.random() * 3);
    const target = turns * 360 + (360 - sliceCenter);

    setSpinning(true);
    setRotation((prev) => prev + target);

    window.setTimeout(() => {
      setSpinning(false);
      setResult(prize);
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ prizeId: prize.id, at: new Date().toISOString() }),
      );
    }, 5200);
  }, [spinning, result]);

  const copyCode = async () => {
    if (!result?.code) return;
    await navigator.clipboard.writeText(result.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const resetDemo = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setResult(null);
    setCopied(false);
    setRotation(0);
  };

  return (
    <div className="page">
      <div className="page__bg" aria-hidden="true" />

      <header className="top">
        <span className="top__brand">YouGarden</span>
        <span className="top__tag">Seasonal spin · demo</span>
      </header>

      <main className="main">
        <section className="intro">
          <p className="eyebrow">Member perk</p>
          <h1>Spin the garden wheel</h1>
          <p className="lede">
            One spin per visit. Land a discount, free delivery, or a little something
            for the border — then use your code at checkout.
          </p>
        </section>

        <section className="stage" aria-live="polite">
          <SpinWheel rotation={rotation} spinning={spinning} />

          <div className="panel">
            {!result && !spinning ? (
              <>
                <h2>Feeling lucky?</h2>
                <p>Tap spin for your seasonal offer. Odds favour smaller rewards.</p>
                <button type="button" className="btn" onClick={spin}>
                  Spin the wheel
                </button>
              </>
            ) : null}

            {spinning ? (
              <>
                <h2>Spinning…</h2>
                <p>Hang tight — Pip’s sorting your prize.</p>
              </>
            ) : null}

            {result && !spinning ? (
              <>
                <p className="eyebrow">{result.win ? "You won" : "Not this time"}</p>
                <h2>{result.label}</h2>
                <p>{result.detail}</p>
                {result.code ? (
                  <div className="code-row">
                    <code className="code">{result.code}</code>
                    <button type="button" className="btn btn--ghost" onClick={copyCode}>
                      {copied ? "Copied" : "Copy code"}
                    </button>
                  </div>
                ) : null}
                <button type="button" className="btn btn--ghost reset" onClick={resetDemo}>
                  Reset demo spin
                </button>
              </>
            ) : null}

            {spun && result?.win ? (
              <p className="fine">Apply the code in the basket before payment.</p>
            ) : null}
          </div>
        </section>

        <ul className="odds" aria-label="Possible prizes">
          {PRIZES.filter((p) => p.win).map((p) => (
            <li key={p.id}>
              <strong>{p.label}</strong>
              <span>{p.code}</span>
            </li>
          ))}
        </ul>
      </main>

      <footer className="foot">
        YouGarden promo demo — weighted prize wheel for on-site campaigns.
      </footer>
    </div>
  );
}
