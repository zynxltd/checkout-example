import { productRepository } from '../lib/appContainer.js';
export function index(req, res) {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const products = productRepository.search(q);
    res.render('pages/products/index', {
        title: 'Products',
        products,
        q,
    });
}
export function show(req, res) {
    const id = String(req.params.id);
    const product = productRepository.findById(id);
    if (!product) {
        res.status(404).render('pages/404', { title: 'Not found' });
        return;
    }
    res.render('pages/products/show', {
        title: product.name,
        product,
    });
}
