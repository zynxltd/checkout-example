import { Runner, type NodeBlock } from "@tripetto/runner";
import type { ReactNode } from "react";

/** Contract every custom block must satisfy for this runner. */
export interface IBlockRenderer extends NodeBlock {
  render: () => ReactNode;
}

/**
 * Custom Tripetto runner — not a stock UI (autoscroll / classic / chat).
 * Owns storyline rendering; blocks plug in via @tripetto registration.
 */
export class Blocks extends Runner<IBlockRenderer> {
  render(): ReactNode {
    const storyline = this.storyline;
    if (!storyline) {
      return null;
    }

    return storyline.nodes.map((item) => (
      <article key={item.id} className="pm-node">
        {item.props.name ? <h2 className="pm-node__title">{item.props.name}</h2> : null}
        {item.props.description ? (
          <p className="pm-node__desc">{item.props.description}</p>
        ) : null}
        <div className="pm-node__block">{item.block?.render()}</div>
      </article>
    ));
  }
}
