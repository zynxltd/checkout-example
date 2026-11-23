import { useState } from "react";
import { Export } from "@tripetto/runner";
import { AutoscrollRunner } from "@tripetto/runner-autoscroll";
import { plantMatchDefinition } from "./definition";
import "./blocks";
import "./styles/app.css";

function recommend(fields: Export.IExportables["fields"]): string {
  const sun =
    fields.find((f) => f.slot === "value" && f.type === "sun-exposure")?.string ??
    fields.find((f) => f.name === "Sun exposure")?.string;
  const space =
    fields.find((f) => f.slot === "value" && f.type === "garden-space")?.string ??
    fields.find((f) => f.name === "Garden space")?.string;

  if (sun === "shade" && space === "balcony") {
    return "Try ferns, hostas in pots, and trailing ivy for rail boxes.";
  }
  if (sun === "full-sun" && space === "garden") {
    return "Go for lavenders, ornamental grasses, and summer bedding borders.";
  }
  if (sun === "full-sun") {
    return "Sun-lovers in containers: geraniums, petunias, and dwarf salvias.";
  }
  if (sun === "shade") {
    return "Shade favourites: heuchera, Japanese anemone, and woodland bulbs.";
  }
  return "Mix evergreen structure with seasonal colour — start with a small mixed border kit.";
}

export default function App() {
  const [result, setResult] = useState<Export.IExportables | null>(null);

  return (
    <div className="pm-shell pm-shell--autoscroll">
      <div className="pm-bg" aria-hidden="true" />

      <header className="pm-brand">
        <span className="pm-brand__mark">YouGarden</span>
        <span className="pm-brand__demo">
          Tripetto demo · horizontal autoscroll + custom blocks
        </span>
      </header>

      <main className="pm-main pm-main--autoscroll">
        <div className="pm-autoscroll-frame">
          <AutoscrollRunner
            definition={plantMatchDefinition}
            display="page"
            styles={{
              direction: "horizontal",
              verticalAlignment: "middle",
              showProgressbar: true,
              showPreviousButton: true,
              showNavigation: "always",
              autoFocus: true,
              color: "#1e4a28",
              background: {
                color: "#faf7f0",
              },
              buttons: {
                baseColor: "#2f6b3a",
                textColor: "#ffffff",
                finishColor: "#1e4a28",
                mode: "fill",
                roundness: 3,
              },
              inputs: {
                backgroundColor: "#ffffff",
                borderColor: "rgba(28, 42, 31, 0.18)",
                borderSize: 1,
                textColor: "#152018",
                errorColor: "#b42318",
                selectionColor: "#2f6b3a",
                roundness: 3,
              },
              navigation: {
                backgroundColor: "#f3efe4",
                textColor: "#1c2a1f",
                progressbarColor: "#2f6b3a",
              },
              font: {
                family: '"Source Sans 3", system-ui, sans-serif',
                size: 16,
              },
            }}
            onSubmit={(instance) => {
              setResult(Export.exportables(instance));
            }}
          />
        </div>

        {result ? (
          <aside className="pm-result" aria-live="polite">
            <h3>Recommendation</h3>
            <p>{recommend(result.fields)}</p>
            <details>
              <summary>Raw export JSON</summary>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </details>
          </aside>
        ) : null}
      </main>

      <footer className="pm-foot">
        Built with{" "}
        <a href="https://tripetto.com/sdk/docs/" target="_blank" rel="noreferrer">
          Tripetto SDK
        </a>{" "}
        — stock <strong>horizontal autoscroll</strong> runner + custom node blocks.
      </footer>
    </div>
  );
}
