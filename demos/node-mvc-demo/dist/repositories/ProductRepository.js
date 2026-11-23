import Product from '../models/Product.js';
import { productRows } from '../models/Product.js';
export class InMemoryProductRepository {
    rows;
    constructor(rows = productRows) {
        this.rows = rows;
    }
    findAll() {
        return this.rows.map((row) => new Product(row));
    }
    findById(id) {
        const row = this.rows.find((product) => product.id === id);
        return row ? new Product(row) : null;
    }
    search(query = '') {
        const q = query.trim().toLowerCase();
        const rows = !q
            ? this.rows
            : this.rows.filter((product) => product.name.toLowerCase().includes(q) ||
                product.category.toLowerCase().includes(q) ||
                product.summary.toLowerCase().includes(q));
        return rows.map((row) => new Product(row));
    }
    countByCategory() {
        return this.rows.reduce((acc, row) => {
            acc[row.category] = (acc[row.category] ?? 0) + 1;
            return acc;
        }, {});
    }
}
