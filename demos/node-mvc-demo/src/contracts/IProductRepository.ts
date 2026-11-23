import type Product from '../models/Product.js'

/**
 * Contract for product catalogue access.
 * Swap InMemoryProductRepository for Postgres/Prisma without changing controllers.
 */
export interface IProductRepository {
  findAll(): Product[]
  findById(id: string): Product | null
  search(query?: string): Product[]
  countByCategory(): Record<string, number>
}
