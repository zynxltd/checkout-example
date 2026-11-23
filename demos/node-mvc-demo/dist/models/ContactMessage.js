export default class ContactMessage {
    id;
    name;
    email;
    message;
    createdAt;
    constructor({ id, name, email, message, createdAt = new Date().toISOString() }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
        this.createdAt = createdAt;
    }
    get displayName() {
        return this.name.trim();
    }
    get preview() {
        return this.message.length > 40 ? `${this.message.slice(0, 40)}...` : this.message;
    }
    static validate({ name = '', email = '', message = '' }) {
        const errors = [];
        if (!name.trim())
            errors.push('Name is required.');
        if (!email.trim() || !email.includes('@'))
            errors.push('A valid email is required.');
        if (message.trim().length < 10)
            errors.push('Message must be at least 10 characters.');
        return errors;
    }
}
