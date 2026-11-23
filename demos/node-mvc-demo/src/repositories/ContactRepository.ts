import ContactMessage from '../models/ContactMessage.js'
import type { IContactRepository } from '../contracts/IContactRepository.js'
import type { ContactInput, ContactRecord } from '../types/domain.js'

export class InMemoryContactRepository implements IContactRepository {
  private readonly messages: ContactRecord[] = []

  create(input: ContactInput): ContactRecord {
    const entry = new ContactMessage({
      id: String(this.messages.length + 1),
      ...input,
      createdAt: new Date().toISOString(),
    })

    this.messages.push(entry)
    return entry
  }

  findAll(): ContactRecord[] {
    return [...this.messages].reverse()
  }

  count(): number {
    return this.messages.length
  }
}
