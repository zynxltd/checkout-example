import type { IAuthService, LoginInput } from '../contracts/IAuthService.js'
import type { SessionUser } from '../types/domain.js'
import type { HarborDatabase } from '../db/sqlite.js'

interface UserDbRow {
  email: string
  password: string
  name: string
}

/**
 * Auth backed by the SQLite `users` table.
 * Demo passwords are plain text on purpose — replace with hashed passwords in production.
 */
export default class SqliteAuthService implements IAuthService {
  constructor(private readonly db: HarborDatabase) {}

  validate(input: LoginInput): string[] {
    const errors: string[] = []
    const email = input.email.trim()
    const password = input.password

    if (!email) errors.push('Email is required.')
    if (!password) errors.push('Password is required.')
    if (errors.length) return errors

    const user = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserDbRow | undefined
    if (!user || user.password !== password) {
      errors.push('Credentials do not match the demo account.')
    }

    return errors
  }

  authenticate(email: string): SessionUser {
    const user = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim()) as UserDbRow | undefined
    if (!user) {
      throw new Error('No matching user found in the database.')
    }

    return {
      email: user.email,
      name: user.name,
    }
  }
}
