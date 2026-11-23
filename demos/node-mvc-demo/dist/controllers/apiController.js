import { config, dashboardService, jobQueue } from '../lib/appContainer.js';
export function health(_req, res) {
    res.json({
        ok: true,
        service: 'harbor-mvc',
        runtime: 'node-typescript',
        port: config.port,
        queue: jobQueue.getStats(),
        timestamp: new Date().toISOString(),
    });
}
export async function dashboardJson(_req, res) {
    const snapshot = await dashboardService.build();
    res.json(snapshot);
}
