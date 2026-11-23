import type { NextFunction, Request, Response } from 'express'

export default function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session.user) {
    next()
    return
  }

  req.session.flash = 'Sign in to view the dashboard.'
  res.redirect('/login')
}
