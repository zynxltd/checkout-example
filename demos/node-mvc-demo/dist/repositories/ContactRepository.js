import ContactMessage from '../models/ContactMessage.js';
export class InMemoryContactRepository {
    messages = [];
    create(input) {
        const entry = new ContactMessage({
            id: String(this.messages.length + 1),
            ...input,
            createdAt: new Date().toISOString(),
        });
        this.messages.push(entry);
        return entry;
    }
    findAll() {
        return [...this.messages].reverse();
    }
    count() {
        return this.messages.length;
    }
}
