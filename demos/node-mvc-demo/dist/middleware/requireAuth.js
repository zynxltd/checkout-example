export default function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
        return;
    }
    req.session.flash = 'Sign in to view the dashboard.';
    res.redirect('/login');
}
