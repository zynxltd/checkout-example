import { tripetto, NodeBlock } from "@tripetto/runner";
import {
  namespace,
  type IAutoscrollRenderProps,
  type IAutoscrollRendering,
} from "@tripetto/runner-autoscroll";
import type { ReactNode } from "react";

type Option = { id: string; label: string; hint: string };

const OPTIONS: Option[] = [
  { id: "full-sun", label: "Full sun", hint: "6+ hours direct light" },
  { id: "part-shade", label: "Part shade", hint: "3–6 hours, dappled OK" },
  { id: "shade", label: "Shade", hint: "Under 3 hours direct" },
];

@tripetto({
  type: "node",
  namespace,
  identifier: "sun-exposure",
})
export class SunExposureBlock extends NodeBlock implements IAutoscrollRendering {
  readonly autoSubmit = true;

  render(props: IAutoscrollRenderProps, done?: () => void): ReactNode {
    const slot = this.valueOf<string>("value", "static");
    const current = slot?.string ?? "";

    return (
      <>
        {props.name}
        {props.description}
        <div className="pm-cards" role="radiogroup" aria-label="Sun exposure">
          {OPTIONS.map((opt) => {
            const selected = current === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`pm-card${selected ? " is-selected" : ""}`}
                onClick={() => {
                  slot?.set(opt.id);
                  done?.();
                }}
              >
                <span
                  className={`pm-card__swatch pm-card__swatch--${opt.id}`}
                  aria-hidden="true"
                />
                <span className="pm-card__label">{opt.label}</span>
                <span className="pm-card__hint">{opt.hint}</span>
              </button>
            );
          })}
        </div>
      </>
    );
  }
}
