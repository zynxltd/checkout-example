import type { ContactInput, ContactRecord } from '../types/domain.js'

/**
 * Contract for persisting contact form submissions.
 */
export interface IContactRepository {
  create(input: ContactInput): ContactRecord
  findAll(): ContactRecord[]
  count(): number
}
