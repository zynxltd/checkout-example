import type { IDashboardService } from '../contracts/IDashboardService.js'
import type { IContactRepository } from '../contracts/IContactRepository.js'
import type { IJobQueue } from '../contracts/IJobQueue.js'
import type { IProductRepository } from '../contracts/IProductRepository.js'
import type { IQuoteApiClient } from '../contracts/IQuoteApiClient.js'
import type { DashboardSnapshot } from '../types/domain.js'

export default class DashboardService implements IDashboardService {
  constructor(
    private readonly jobQueue: IJobQueue,
    private readonly quoteClient: IQuoteApiClient,
    private readonly contactRepository: IContactRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async build(): Promise<DashboardSnapshot> {
    const quote = await this.quoteClient.fetchQuote()
    const recentMessages = this.contactRepository.findAll().slice(0, 5)

    return {
      queueSummary: this.jobQueue.getStats(),
      recentJobs: this.jobQueue.recent(6),
      recentMessages,
      quote,
      productCategories: this.productRepository.countByCategory(),
      contactCount: this.contactRepository.count(),
    }
  }
}
