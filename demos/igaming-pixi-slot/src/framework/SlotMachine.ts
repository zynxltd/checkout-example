import { Container, Graphics, Text } from 'pixi.js'
import gsap from 'gsap'
import { Reel } from './Reel'
import type { SymbolDef } from './SymbolDefs'

export interface SpinResult {
  centres: SymbolDef[]
  winAmount: number
  isWin: boolean
}

/**
 * 3-reel slot machine — custom “studio framework” style facade.
 */
export class SlotMachine extends Container {
  private readonly reels: Reel[] = []
  private readonly payline: Graphics
  private readonly winBanner: Text
  private busy = false

  readonly cellSize = 100
  readonly reelCount = 3
  readonly rows = 3

  constructor() {
    super()

    const frameW = this.cellSize * this.reelCount + 48
    const frameH = this.cellSize * this.rows + 48

    const cabinet = new Graphics()
      .roundRect(-frameW / 2, -frameH / 2, frameW, frameH, 18)
      .fill(0x101827)
      .stroke({ width: 3, color: 0x2de2c5, alpha: 0.55 })
    this.addChild(cabinet)

    const windowBg = new Graphics()
      .roundRect(
        (-this.cellSize * this.reelCount) / 2 - 8,
        (-this.cellSize * this.rows) / 2 - 8,
        this.cellSize * this.reelCount + 16,
        this.cellSize * this.rows + 16,
        12,
      )
      .fill(0x050810)
    this.addChild(windowBg)

    const startX = -((this.reelCount - 1) * this.cellSize) / 2
    for (let i = 0; i < this.reelCount; i++) {
      const reel = new Reel({
        x: startX + i * this.cellSize,
        cellSize: this.cellSize,
        rows: this.rows,
      })
      this.reels.push(reel)
      this.addChild(reel)
    }

    this.payline = new Graphics()
      .moveTo((-this.cellSize * this.reelCount) / 2 - 4, 0)
      .lineTo((this.cellSize * this.reelCount) / 2 + 4, 0)
      .stroke({ width: 2, color: 0xf0c14a, alpha: 0.65 })
    this.addChild(this.payline)

    this.winBanner = new Text({
      text: '',
      style: {
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 28,
        fontWeight: '700',
        fill: 0xf0c14a,
      },
    })
    this.winBanner.anchor.set(0.5)
    this.winBanner.y = frameH / 2 + 36
    this.winBanner.alpha = 0
    this.addChild(this.winBanner)
  }

  get isBusy(): boolean {
    return this.busy
  }

  async spin(bet: number): Promise<SpinResult> {
    if (this.busy) {
      return { centres: [], winAmount: 0, isWin: false }
    }
    this.busy = true
    this.winBanner.alpha = 0
    this.reels.forEach((r) => r.clearHighlights())

    gsap.fromTo(
      this.payline,
      { alpha: 0.35 },
      { alpha: 0.9, duration: 0.15, yoyo: true, repeat: 1 },
    )

    const centres = await Promise.all(
      this.reels.map((reel, i) => reel.spin(1.4 + i * 0.25, i * 0.12)),
    )

    const allMatch = centres.every((s) => s.id === centres[0].id)
    const winAmount = allMatch ? bet * centres[0].payout : 0

    if (allMatch) {
      this.reels.forEach((r) => r.highlightCentre())
      this.winBanner.text = `WIN ${winAmount}`
      gsap.fromTo(
        this.winBanner,
        { alpha: 0, scale: 0.7 },
        { alpha: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)' },
      )
      gsap.fromTo(
        this.scale,
        { x: 1, y: 1 },
        {
          x: 1.03,
          y: 1.03,
          duration: 0.12,
          yoyo: true,
          repeat: 3,
          ease: 'power1.inOut',
        },
      )
    }

    this.busy = false
    return { centres, winAmount, isWin: allMatch }
  }
}
