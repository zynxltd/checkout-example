import Product from '../models/Product.js'
import type { IProductRepository } from '../contracts/IProductRepository.js'
import type { ProductRow } from '../types/domain.js'
import type { HarborDatabase } from '../db/sqlite.js'

interface ProductDbRow {
  id: string
  name: string
  price: number
  category: string
  summary: string
  stock: number
}

function toProduct(row: ProductDbRow): Product {
  return new Product({
    id: row.id,
    name: row.name,
    price: row.price,
    category: row.category,
    summary: row.summary,
    stock: row.stock,
  })
}

export class SqliteProductRepository implements IProductRepository {
  constructor(private readonly db: HarborDatabase) {}

  findAll(): Product[] {
    const rows = this.db.prepare('SELECT * FROM products ORDER BY name ASC').all() as ProductDbRow[]
    return rows.map(toProduct)
  }

  findById(id: string): Product | null {
    const row = this.db.prepare('SELECT * FROM products WHERE id = ?').get(id) as ProductDbRow | undefined
    return row ? toProduct(row) : null
  }

  search(query = ''): Product[] {
    const q = query.trim().toLowerCase()
    if (!q) return this.findAll()

    const like = `%${q}%`
    const rows = this.db
      .prepare(
        `
        SELECT * FROM products
        WHERE lower(name) LIKE ? OR lower(category) LIKE ? OR lower(summary) LIKE ?
        ORDER BY name ASC
      `,
      )
      .all(like, like, like) as ProductDbRow[]

    return rows.map(toProduct)
  }

  countByCategory(): Record<string, number> {
    const rows = this.db
      .prepare('SELECT category, COUNT(*) AS count FROM products GROUP BY category ORDER BY category ASC')
      .all() as Array<{ category: string; count: number }>

    return rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.category] = row.count
      return acc
    }, {})
  }
}

export type { ProductRow }
