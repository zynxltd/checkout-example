import { Application, Container } from 'pixi.js'
import { SlotMachine } from './SlotMachine'

export interface GameHud {
  setBalance(n: number): void
  setBet(n: number): void
  setLastWin(n: number): void
  setStatus(text: string, win?: boolean): void
  setSpinEnabled(on: boolean): void
}

/**
 * Top-level game bootstrap — mirrors an in-house “Game” entry for HTML5 slots.
 */
export class Game {
  private app!: Application
  private machine!: SlotMachine
  private balance = 1000
  private bet = 10
  private readonly minBet = 5
  private readonly maxBet = 50

  constructor(
    private readonly root: HTMLElement,
    private readonly hud: GameHud,
  ) {}

  async init(): Promise<void> {
    this.app = new Application()
    await this.app.init({
      background: '#050810',
      resizeTo: this.root,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    })
    this.root.appendChild(this.app.canvas)

    const stageRoot = new Container()
    this.app.stage.addChild(stageRoot)

    this.machine = new SlotMachine()
    stageRoot.addChild(this.machine)
    this.layout()

    window.addEventListener('resize', () => this.layout())
    this.syncHud()
  }

  private layout(): void {
    const { width, height } = this.app.renderer
    this.machine.position.set(width / 2, height / 2 - 10)
    const scale = Math.min(width / 420, height / 420, 1.15)
    this.machine.scale.set(scale)
  }

  changeBet(delta: number): void {
    if (this.machine.isBusy) return
    this.bet = Math.min(this.maxBet, Math.max(this.minBet, this.bet + delta))
    this.syncHud()
  }

  async spin(): Promise<void> {
    if (this.machine.isBusy) return
    if (this.balance < this.bet) {
      this.hud.setStatus('Not enough balance', false)
      return
    }

    this.balance -= this.bet
    this.hud.setSpinEnabled(false)
    this.hud.setStatus('Good luck…')
    this.syncHud()

    const result = await this.machine.spin(this.bet)
    this.balance += result.winAmount
    this.hud.setLastWin(result.winAmount)
    this.syncHud()

    if (result.isWin) {
      const names = result.centres.map((c) => c.label).join(' · ')
      this.hud.setStatus(`Payline hit! ${names} ×${result.centres[0].payout}`, true)
    } else {
      this.hud.setStatus('No win — spin again')
    }
    this.hud.setSpinEnabled(true)
  }

  private syncHud(): void {
    this.hud.setBalance(this.balance)
    this.hud.setBet(this.bet)
  }
}
