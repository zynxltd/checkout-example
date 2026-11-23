import Product from '../models/Product.js'
import { productRows } from '../models/Product.js'
import type { IProductRepository } from '../contracts/IProductRepository.js'
import type { ProductRow } from '../types/domain.js'

export class InMemoryProductRepository implements IProductRepository {
  private readonly rows: ProductRow[]

  constructor(rows: ProductRow[] = productRows) {
    this.rows = rows
  }

  findAll(): Product[] {
    return this.rows.map((row) => new Product(row))
  }

  findById(id: string): Product | null {
    const row = this.rows.find((product) => product.id === id)
    return row ? new Product(row) : null
  }

  search(query = ''): Product[] {
    const q = query.trim().toLowerCase()
    const rows = !q
      ? this.rows
      : this.rows.filter(
          (product) =>
            product.name.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.summary.toLowerCase().includes(q),
        )

    return rows.map((row) => new Product(row))
  }

  countByCategory(): Record<string, number> {
    return this.rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.category] = (acc[row.category] ?? 0) + 1
      return acc
    }, {})
  }
}
