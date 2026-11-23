import { tripetto, NodeBlock } from "@tripetto/runner";
import {
  namespace,
  type IAutoscrollRenderProps,
  type IAutoscrollRendering,
} from "@tripetto/runner-autoscroll";
import type { ReactNode } from "react";

@tripetto({
  type: "node",
  namespace,
  identifier: "email-capture",
})
export class EmailCaptureBlock extends NodeBlock implements IAutoscrollRendering {
  render(props: IAutoscrollRenderProps, done?: () => void): ReactNode {
    const slot = this.valueOf<string>("value", "static");

    return (
      <>
        {props.name}
        {props.description}
        <label className="pm-field">
          <span className="pm-field__label">Email</span>
          <input
            className="pm-field__input"
            type="email"
            autoComplete="email"
            placeholder={props.placeholder || "you@example.com"}
            value={slot?.string ?? ""}
            tabIndex={props.tabIndex}
            onFocus={props.focus}
            onBlur={props.blur}
            ref={props.autoFocus}
            onChange={(e) => {
              slot?.set(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                done?.();
              }
            }}
          />
        </label>
      </>
    );
  }
}
