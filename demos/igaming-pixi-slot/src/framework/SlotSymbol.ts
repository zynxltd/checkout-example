import { Container, Graphics, Text } from 'pixi.js'
import type { SymbolDef } from './SymbolDefs'

/**
 * Visual symbol tile — OOP unit used by reels.
 */
export class SlotSymbol extends Container {
  readonly def: SymbolDef
  private readonly size: number
  private readonly bg: Graphics
  private readonly caption: Text

  constructor(def: SymbolDef, size: number) {
    super()
    this.def = def
    this.size = size
    this.bg = new Graphics()
    this.caption = new Text({
      text: def.label,
      style: {
        fontFamily: 'Orbitron, sans-serif',
        fontSize: size * 0.28,
        fontWeight: '700',
        fill: def.color,
        align: 'center',
      },
    })
    this.caption.anchor.set(0.5)
    this.addChild(this.bg, this.caption)
    this.draw(false)
  }

  setHighlight(on: boolean): void {
    this.draw(on)
  }

  private draw(on: boolean): void {
    const size = this.size
    this.bg.clear()
    this.bg
      .roundRect(-size / 2 + 4, -size / 2 + 4, size - 8, size - 8, 12)
      .fill({ color: on ? 0x1a2a18 : 0x0c1422, alpha: 0.95 })
      .stroke({ width: on ? 4 : 3, color: this.def.color, alpha: 1 })
  }
}
