import { Game } from './framework/Game'

const root = document.querySelector<HTMLElement>('#game-root')
const spinBtn = document.querySelector<HTMLButtonElement>('#spin')
const betUp = document.querySelector<HTMLButtonElement>('#bet-up')
const betDown = document.querySelector<HTMLButtonElement>('#bet-down')
const balanceEl = document.querySelector<HTMLElement>('#balance')
const betEl = document.querySelector<HTMLElement>('#bet')
const lastWinEl = document.querySelector<HTMLElement>('#last-win')
const statusEl = document.querySelector<HTMLElement>('#status')

if (!root || !spinBtn || !betUp || !betDown || !balanceEl || !betEl || !lastWinEl || !statusEl) {
  throw new Error('Missing HUD / canvas root elements')
}

const spin = spinBtn
const up = betUp
const down = betDown
const balance = balanceEl
const betLabel = betEl
const lastWin = lastWinEl
const status = statusEl

const game = new Game(root, {
  setBalance: (n) => {
    balance.textContent = String(n)
  },
  setBet: (n) => {
    betLabel.textContent = String(n)
  },
  setLastWin: (n) => {
    lastWin.textContent = String(n)
  },
  setStatus: (text, win = false) => {
    status.textContent = text
    status.classList.toggle('win', win)
  },
  setSpinEnabled: (on) => {
    spin.disabled = !on
    up.disabled = !on
    down.disabled = !on
  },
})

async function boot() {
  await game.init()

  spin.addEventListener('click', () => {
    void game.spin()
  })
  up.addEventListener('click', () => game.changeBet(5))
  down.addEventListener('click', () => game.changeBet(-5))

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault()
      void game.spin()
    }
  })
}

void boot()
