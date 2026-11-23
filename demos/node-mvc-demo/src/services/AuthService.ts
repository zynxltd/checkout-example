import type { IAuthService, LoginInput } from '../contracts/IAuthService.js'
import type { SessionUser } from '../types/domain.js'

/** Config-backed auth used when DB_DRIVER=memory. */
export default class AuthService implements IAuthService {
  constructor(
    private readonly demoEmail: string,
    private readonly demoPassword: string,
  ) {}

  validate(input: LoginInput): string[] {
    const errors: string[] = []
    const email = input.email.trim()
    const password = input.password

    if (!email) errors.push('Email is required.')
    if (!password) errors.push('Password is required.')

    if (!errors.length && (email !== this.demoEmail || password !== this.demoPassword)) {
      errors.push('Credentials do not match the demo account.')
    }

    return errors
  }

  authenticate(email: string): SessionUser {
    return {
      email: email.trim() || this.demoEmail,
      name: 'Demo operator',
    }
  }
}
