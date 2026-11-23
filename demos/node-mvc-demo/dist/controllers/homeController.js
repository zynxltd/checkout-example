export function index(_req, res) {
    res.render('pages/home', {
        title: 'Home',
        tagline: 'Furniture for focused rooms.',
    });
}
export function about(_req, res) {
    res.render('pages/about', {
        title: 'About',
    });
}
