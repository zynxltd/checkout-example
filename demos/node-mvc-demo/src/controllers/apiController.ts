import type { Request, Response } from 'express'
import { config, dashboardService, jobQueue } from '../lib/appContainer.js'

export function health(_req: Request, res: Response): void {
  res.json({
    ok: true,
    service: 'harbor-mvc',
    runtime: 'node-typescript',
    port: config.port,
    queue: jobQueue.getStats(),
    timestamp: new Date().toISOString(),
  })
}

export async function dashboardJson(_req: Request, res: Response): Promise<void> {
  const snapshot = await dashboardService.build()
  res.json(snapshot)
}
