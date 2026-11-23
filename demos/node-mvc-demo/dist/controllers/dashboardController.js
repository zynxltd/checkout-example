import { dashboardService, jobQueue } from '../lib/appContainer.js';
export async function show(req, res) {
    const snapshot = await dashboardService.build();
    res.render('pages/dashboard', {
        title: 'Dashboard',
        flash: res.locals.flash,
        user: req.session.user,
        ...snapshot,
    });
}
export function enqueueDemoJob(req, res) {
    jobQueue.enqueue('lead.follow-up', {
        name: req.session.user?.name || 'Demo operator',
        email: req.session.user?.email || 'demo@harbor.test',
        reason: 'manual dashboard enqueue',
    });
    req.session.flash = 'Queued a manual follow-up job.';
    res.redirect('/dashboard');
}
export function enqueueQuoteDigest(req, res) {
    jobQueue.enqueue('quote.digest', {
        requestedBy: req.session.user?.email || 'demo@harbor.test',
    });
    req.session.flash = 'Queued a quote digest job.';
    res.redirect('/dashboard');
}
