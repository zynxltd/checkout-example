import type { SessionUser } from '../types/domain.js';
export interface LoginInput {
    email: string;
    password: string;
}
export default class AuthService {
    private readonly demoEmail;
    private readonly demoPassword;
    constructor(demoEmail: string, demoPassword: string);
    validate(input: LoginInput): string[];
    authenticate(): SessionUser;
}
