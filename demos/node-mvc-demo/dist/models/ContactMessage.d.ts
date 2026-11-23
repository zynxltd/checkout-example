import type { ContactInput, ContactRecord } from '../types/domain.js';
export default class ContactMessage implements ContactRecord {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly message: string;
    readonly createdAt: string;
    constructor({ id, name, email, message, createdAt }: ContactRecord);
    get displayName(): string;
    get preview(): string;
    static validate({ name, email, message }: Partial<ContactInput>): string[];
}
