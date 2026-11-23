import { authService, config } from '../lib/appContainer.js';
function renderLogin(res, { errors = [], values = {}, flash = null } = {}) {
    res.render('pages/login', {
        title: 'Login',
        errors,
        values: {
            email: values.email || '',
        },
        flash,
        demoEmail: config.demoEmail,
        demoPassword: config.demoPassword,
    });
}
export function show(req, res) {
    renderLogin(res, {
        flash: res.locals.flash,
    });
}
export function submit(req, res) {
    const email = typeof req.body.email === 'string' ? req.body.email : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const errors = authService.validate({ email, password });
    if (errors.length) {
        renderLogin(res.status(422), {
            errors,
            values: { email },
        });
        return;
    }
    req.session.user = authService.authenticate();
    req.session.flash = 'Signed in. Dashboard access granted.';
    res.redirect('/dashboard');
}
export function logout(req, res, next) {
    req.session.destroy((error) => {
        if (error) {
            next(error);
            return;
        }
        res.redirect('/login');
    });
}
