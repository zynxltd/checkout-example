const productRows = [
    {
        id: 'atlas-desk',
        name: 'Atlas Desk',
        price: 420,
        category: 'Workspace',
        summary: 'Solid oak top with a cable channel and soft matte steel legs.',
        stock: 14,
    },
    {
        id: 'lumen-lamp',
        name: 'Lumen Lamp',
        price: 89,
        category: 'Lighting',
        summary: 'Adjustable arm, warm LED, and a weighted cast base.',
        stock: 32,
    },
    {
        id: 'ridge-chair',
        name: 'Ridge Chair',
        price: 260,
        category: 'Seating',
        summary: 'Stackable ash frame with woven seat — indoor or covered patio.',
        stock: 8,
    },
    {
        id: 'cove-shelf',
        name: 'Cove Shelf',
        price: 145,
        category: 'Storage',
        summary: 'Wall-mounted oak shelf with hidden brackets.',
        stock: 21,
    },
];
export default class Product {
    id;
    name;
    price;
    category;
    summary;
    stock;
    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.price = row.price;
        this.category = row.category;
        this.summary = row.summary;
        this.stock = row.stock;
    }
    get priceDisplay() {
        return `£${this.price.toFixed(2)}`;
    }
    get stockLabel() {
        return this.stock <= 10 ? `${this.stock} in stock - low` : `${this.stock} in stock`;
    }
    get stockTone() {
        return this.stock <= 10 ? 'Low stock' : 'In stock';
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            category: this.category,
            summary: this.summary,
            stock: this.stock,
        };
    }
}
export { productRows };
