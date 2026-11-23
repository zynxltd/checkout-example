import { useEffect, useRef, useState, type ReactNode } from "react";
import { Export, type IDefinition } from "@tripetto/runner";
import { Blocks } from "./blocks";

type Props = {
  definition: IDefinition;
  onSubmit?: (data: Export.IExportables) => void;
};

/**
 * React shell around the custom Blocks runner.
 * Runner is created inside useEffect so React Strict Mode remounts
 * get a live instance (class-field + destroy() left a dead runner).
 */
export function CustomRunner({ definition, onSubmit }: Props): ReactNode {
  const [tick, setTick] = useState(0);
  const [finished, setFinished] = useState(false);
  const blocksRef = useRef<Blocks | null>(null);
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  useEffect(() => {
    const blocks = new Blocks({
      definition,
      mode: "paginated",
      start: true,
    });

    blocks.onChange = () => setTick((n) => n + 1);
    blocks.onFinish = (instance) => {
      setFinished(true);
      onSubmitRef.current?.(Export.exportables(instance));
      return true;
    };

    blocksRef.current = blocks;
    setTick((n) => n + 1);
    setFinished(false);

    return () => {
      blocks.destroy();
      if (blocksRef.current === blocks) {
        blocksRef.current = null;
      }
    };
  }, [definition]);

  const blocks = blocksRef.current;
  const storyline = blocks?.storyline;
  const epilogue = definition.epilogue;
  const prologue = definition.prologue;

  // tick forces re-render when Tripetto data/validation changes
  void tick;

  const restart = (): void => {
    setFinished(false);
    blocks?.restart();
  };

  if (finished) {
    return (
      <div className="pm-finish">
        <p className="pm-eyebrow">Done</p>
        <h2>{epilogue?.title ?? "Thanks"}</h2>
        <p>{epilogue?.description ?? "Your answers were collected."}</p>
        <button type="button" className="pm-btn pm-btn--ghost" onClick={restart}>
          Start again
        </button>
      </div>
    );
  }

  if (!blocks || !storyline) {
    return <p className="pm-empty">Starting…</p>;
  }

  const atStart = storyline.isAtStart;
  const canFinish = storyline.isFinishable;
  // Prefer node-level pass: storyline.isPassed goes false after editing the
  // optional email slot even though the node itself still validates.
  const nodesOk = storyline.nodes.every((n) => n.isPassed);
  const canStep = nodesOk && !storyline.isFailed && !storyline.isEvaluating;
  const pct = Math.round(storyline.percentage);

  return (
    <div className="pm-runner">
      {atStart && prologue ? (
        <header className="pm-prologue">
          <p className="pm-eyebrow">Plant Match</p>
          <h1>{prologue.title}</h1>
          {prologue.description ? <p>{prologue.description}</p> : null}
        </header>
      ) : null}

      <div className="pm-progress" aria-hidden="true">
        <div className="pm-progress__bar" style={{ width: `${pct}%` }} />
      </div>
      <p className="pm-progress__label">{pct}% complete</p>

      <div className="pm-pages">{blocks.render()}</div>

      <nav className="pm-nav" aria-label="Form navigation">
        <button
          type="button"
          className="pm-btn pm-btn--ghost"
          disabled={atStart}
          onClick={() => storyline.stepBackward()}
        >
          Back
        </button>

        {canFinish ? (
          <button
            type="button"
            className="pm-btn"
            disabled={!canStep || storyline.isFinishing}
            onClick={() => {
              void storyline.finish();
            }}
          >
            See match
          </button>
        ) : (
          <button
            type="button"
            className="pm-btn"
            disabled={!canStep}
            onClick={() => storyline.stepForward()}
          >
            Next
          </button>
        )}
      </nav>
    </div>
  );
}
