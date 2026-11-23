import type { Request, Response } from 'express'

export function index(_req: Request, res: Response): void {
  res.render('pages/home', {
    title: 'Home',
    tagline: 'Furniture for focused rooms.',
  })
}

export function about(_req: Request, res: Response): void {
  res.render('pages/about', {
    title: 'About',
  })
}
