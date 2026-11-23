import type { ContactInput, ContactRecord } from '../types/domain.js';
export interface IContactRepository {
    create(input: ContactInput): ContactRecord;
    findAll(): ContactRecord[];
    count(): number;
}
export declare class InMemoryContactRepository implements IContactRepository {
    private readonly messages;
    create(input: ContactInput): ContactRecord;
    findAll(): ContactRecord[];
    count(): number;
}
