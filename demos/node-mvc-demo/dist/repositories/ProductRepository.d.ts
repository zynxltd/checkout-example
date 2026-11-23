import Product from '../models/Product.js';
import type { ProductRow } from '../types/domain.js';
export interface IProductRepository {
    findAll(): Product[];
    findById(id: string): Product | null;
    search(query?: string): Product[];
    countByCategory(): Record<string, number>;
}
export declare class InMemoryProductRepository implements IProductRepository {
    private readonly rows;
    constructor(rows?: ProductRow[]);
    findAll(): Product[];
    findById(id: string): Product | null;
    search(query?: string): Product[];
    countByCategory(): Record<string, number>;
}
