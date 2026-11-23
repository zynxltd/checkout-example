import type { Request, Response } from 'express'
import { authService, config } from '../lib/appContainer.js'

interface LoginRenderOptions {
  errors?: string[]
  values?: { email?: string }
  flash?: string | null
}

function renderLogin(res: Response, { errors = [], values = {}, flash = null }: LoginRenderOptions = {}): void {
  res.render('pages/login', {
    title: 'Login',
    errors,
    values: {
      email: values.email || '',
    },
    flash,
    demoEmail: config.demoEmail,
    demoPassword: config.demoPassword,
  })
}

export function show(req: Request, res: Response): void {
  renderLogin(res, {
    flash: res.locals.flash as string | null,
  })
}

export function submit(req: Request, res: Response): void {
  const email = typeof req.body.email === 'string' ? req.body.email : ''
  const password = typeof req.body.password === 'string' ? req.body.password : ''
  const errors = authService.validate({ email, password })

  if (errors.length) {
    renderLogin(res.status(422), {
      errors,
      values: { email },
    })
    return
  }

  req.session.user = authService.authenticate()
  req.session.flash = 'Signed in. Dashboard access granted.'
  res.redirect('/dashboard')
}

export function logout(req: Request, res: Response, next: (err?: unknown) => void): void {
  req.session.destroy((error) => {
    if (error) {
      next(error)
      return
    }
    res.redirect('/login')
  })
}
