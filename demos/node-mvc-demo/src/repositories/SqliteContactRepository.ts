import ContactMessage from '../models/ContactMessage.js'
import type { IContactRepository } from '../contracts/IContactRepository.js'
import type { ContactInput, ContactRecord } from '../types/domain.js'
import type { HarborDatabase } from '../db/sqlite.js'

interface ContactDbRow {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

function toContact(row: ContactDbRow): ContactRecord {
  return new ContactMessage({
    id: String(row.id),
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  })
}

export class SqliteContactRepository implements IContactRepository {
  constructor(private readonly db: HarborDatabase) {}

  create(input: ContactInput): ContactRecord {
    const createdAt = new Date().toISOString()
    const result = this.db
      .prepare(
        `
        INSERT INTO contact_messages (name, email, message, created_at)
        VALUES (?, ?, ?, ?)
      `,
      )
      .run(input.name, input.email, input.message, createdAt)

    return new ContactMessage({
      id: String(result.lastInsertRowid),
      name: input.name,
      email: input.email,
      message: input.message,
      createdAt,
    })
  }

  findAll(): ContactRecord[] {
    const rows = this.db
      .prepare('SELECT * FROM contact_messages ORDER BY id DESC')
      .all() as ContactDbRow[]
    return rows.map(toContact)
  }

  count(): number {
    const row = this.db.prepare('SELECT COUNT(*) AS count FROM contact_messages').get() as { count: number }
    return row.count
  }
}
