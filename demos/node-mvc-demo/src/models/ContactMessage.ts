import type { ContactInput, ContactRecord } from '../types/domain.js'

export default class ContactMessage implements ContactRecord {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly message: string
  readonly createdAt: string

  constructor({ id, name, email, message, createdAt = new Date().toISOString() }: ContactRecord) {
    this.id = id
    this.name = name
    this.email = email
    this.message = message
    this.createdAt = createdAt
  }

  get displayName(): string {
    return this.name.trim()
  }

  get preview(): string {
    return this.message.length > 40 ? `${this.message.slice(0, 40)}...` : this.message
  }

  static validate({ name = '', email = '', message = '' }: Partial<ContactInput>): string[] {
    const errors: string[] = []

    if (!name.trim()) errors.push('Name is required.')
    if (!email.trim() || !email.includes('@')) errors.push('A valid email is required.')
    if (message.trim().length < 10) errors.push('Message must be at least 10 characters.')

    return errors
  }
}
