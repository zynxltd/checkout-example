import { tripetto, NodeBlock } from "@tripetto/runner";
import {
  namespace,
  type IAutoscrollRenderProps,
  type IAutoscrollRendering,
} from "@tripetto/runner-autoscroll";
import type { ReactNode } from "react";

type Option = { id: string; label: string; hint: string };

const OPTIONS: Option[] = [
  { id: "balcony", label: "Balcony / pots", hint: "Containers & rail boxes" },
  { id: "patio", label: "Patio / courtyard", hint: "Beds against walls & paving" },
  { id: "garden", label: "Open garden", hint: "Borders, lawn edges, beds" },
];

@tripetto({
  type: "node",
  namespace,
  identifier: "garden-space",
})
export class GardenSpaceBlock extends NodeBlock implements IAutoscrollRendering {
  readonly autoSubmit = true;

  render(props: IAutoscrollRenderProps, done?: () => void): ReactNode {
    const slot = this.valueOf<string>("value", "static");
    const current = slot?.string ?? "";

    return (
      <>
        {props.name}
        {props.description}
        <div className="pm-cards pm-cards--stack" role="radiogroup" aria-label="Garden space">
          {OPTIONS.map((opt) => {
            const selected = current === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`pm-card pm-card--row${selected ? " is-selected" : ""}`}
                onClick={() => {
                  slot?.set(opt.id);
                  done?.();
                }}
              >
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
