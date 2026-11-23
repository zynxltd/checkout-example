import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { productSeed } from '../data/productSeed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const defaultDbPath = path.join(__dirname, '..', '..', 'data', 'harbor.db')

export type HarborDatabase = DatabaseSync

export function openDatabase(dbPath = defaultDbPath): HarborDatabase {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA foreign_keys = ON;')
  return db
}

export function migrate(db: HarborDatabase): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      stock INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    );
  `)
}

export function seed(db: HarborDatabase, demoEmail: string, demoPassword: string): void {
  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get() as { count: number }
  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, price, category, summary, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    for (const product of productSeed) {
      insertProduct.run(
        product.id,
        product.name,
        product.price,
        product.category,
        product.summary,
        product.stock,
      )
    }
  }

  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number }
  if (userCount.count === 0) {
    db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(
      demoEmail,
      demoPassword,
      'Demo operator',
    )
  }
}

export function createSqliteConnection(options: {
  dbPath?: string
  demoEmail: string
  demoPassword: string
}): HarborDatabase {
  const db = openDatabase(options.dbPath)
  migrate(db)
  seed(db, options.demoEmail, options.demoPassword)
  return db
}
