import type { DashboardSnapshot } from '../types/domain.js';
import type { IContactRepository } from '../repositories/ContactRepository.js';
import type { IProductRepository } from '../repositories/ProductRepository.js';
import type InMemoryJobQueue from './InMemoryJobQueue.js';
import type QuoteApiClient from './QuoteApiClient.js';
export default class DashboardService {
    private readonly jobQueue;
    private readonly quoteClient;
    private readonly contactRepository;
    private readonly productRepository;
    constructor(jobQueue: InMemoryJobQueue, quoteClient: QuoteApiClient, contactRepository: IContactRepository, productRepository: IProductRepository);
    build(): Promise<DashboardSnapshot>;
}
