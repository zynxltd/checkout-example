import type { SessionUser } from '../types/domain.js'

export interface LoginInput {
  email: string
  password: string
}

/**
 * Contract for credential validation and session user creation.
 */
export interface IAuthService {
  validate(input: LoginInput): string[]
  authenticate(email: string): SessionUser
}
