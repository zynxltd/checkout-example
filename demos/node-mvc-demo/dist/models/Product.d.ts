import type { ProductRow } from '../types/domain.js';
declare const productRows: ProductRow[];
export default class Product {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly category: string;
    readonly summary: string;
    readonly stock: number;
    constructor(row: ProductRow);
    get priceDisplay(): string;
    get stockLabel(): string;
    get stockTone(): 'Low stock' | 'In stock';
    toJSON(): ProductRow;
}
export { productRows };
