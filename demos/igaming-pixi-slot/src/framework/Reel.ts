import { Container, Graphics } from 'pixi.js'
import gsap from 'gsap'
import { SlotSymbol } from './SlotSymbol'
import { pickWeightedSymbol, type SymbolDef } from './SymbolDefs'

export interface ReelConfig {
  x: number
  cellSize: number
  rows: number
}

/**
 * Vertical reel with masked window and GSAP spin.
 */
export class Reel extends Container {
  private readonly cellSize: number
  private readonly rows: number
  private readonly strip: Container
  private readonly tiles: SlotSymbol[] = []
  private spinning = false
  private centreResult: SymbolDef

  constructor(config: ReelConfig) {
    super()
    this.x = config.x
    this.cellSize = config.cellSize
    this.rows = config.rows
    this.centreResult = pickWeightedSymbol()

    const mask = new Graphics()
      .rect(
        -config.cellSize / 2,
        -config.cellSize * (config.rows / 2),
        config.cellSize,
        config.cellSize * config.rows,
      )
      .fill(0xffffff)
    this.addChild(mask)
    this.mask = mask

    this.strip = new Container()
    this.addChild(this.strip)

    // Build a tall strip for spinning
    const stripLen = 20
    for (let i = 0; i < stripLen; i++) {
      const def = i === Math.floor(stripLen / 2) ? this.centreResult : pickWeightedSymbol()
      const tile = new SlotSymbol(def, config.cellSize)
      tile.y = (i - Math.floor(stripLen / 2)) * config.cellSize
      this.tiles.push(tile)
      this.strip.addChild(tile)
    }
  }

  getCentreSymbol(): SymbolDef {
    return this.centreResult
  }

  clearHighlights(): void {
    this.tiles.forEach((t) => t.setHighlight(false))
  }

  highlightCentre(): void {
    const mid = this.tiles.find((t) => Math.abs(t.y + this.strip.y) < 2)
    mid?.setHighlight(true)
    // Fallback: highlight tile closest to 0
    if (!mid) {
      let best = this.tiles[0]
      let bestDist = Infinity
      for (const t of this.tiles) {
        const d = Math.abs(t.y + this.strip.y)
        if (d < bestDist) {
          bestDist = d
          best = t
        }
      }
      best.setHighlight(true)
    }
  }

  async spin(duration: number, delay: number): Promise<SymbolDef> {
    if (this.spinning) return this.centreResult
    this.spinning = true
    this.clearHighlights()

    const final = pickWeightedSymbol()
    this.centreResult = final

    // Place final on a tile that will land at y=0
    const revolutions = 6 + Math.floor(Math.random() * 3)
    const targetY = this.strip.y - revolutions * this.cellSize * this.tiles.length

    // Ensure a tile near centre becomes `final` after snap
    await new Promise<void>((resolve) => {
      gsap.to(this.strip, {
        y: targetY,
        duration,
        delay,
        ease: 'power3.inOut',
        onComplete: () => {
          // Normalize strip position and rebuild visible band with final in centre
          this.strip.y = 0
          this.strip.removeChildren()
          this.tiles.length = 0
          const stripLen = 20
          const centre = Math.floor(stripLen / 2)
          for (let i = 0; i < stripLen; i++) {
            const def = i === centre ? final : pickWeightedSymbol()
            const tile = new SlotSymbol(def, this.cellSize)
            tile.y = (i - centre) * this.cellSize
            this.tiles.push(tile)
            this.strip.addChild(tile)
          }
          // Small overshoot settle
          this.strip.y = this.cellSize * 0.15
          gsap.to(this.strip, {
            y: 0,
            duration: 0.22,
            ease: 'back.out(2)',
            onComplete: () => {
              this.spinning = false
              resolve()
            },
          })
        },
      })
    })

    return final
  }
}
