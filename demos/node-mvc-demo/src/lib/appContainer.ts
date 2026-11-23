import { loadConfig } from '../config.js'
import type {
  IAuthService,
  IContactRepository,
  IDashboardService,
  IJobQueue,
  IProductRepository,
  IQuoteApiClient,
} from '../contracts/index.js'
import { InMemoryContactRepository } from '../repositories/ContactRepository.js'
import { InMemoryProductRepository } from '../repositories/ProductRepository.js'
import AuthService from '../services/AuthService.js'
import DashboardService from '../services/DashboardService.js'
import InMemoryJobQueue from '../services/InMemoryJobQueue.js'
import LeadFollowUpJob from '../services/LeadFollowUpJob.js'
import QuoteApiClient from '../services/QuoteApiClient.js'
import QuoteDigestJob from '../services/QuoteDigestJob.js'

const config = loadConfig()

const productRepository: IProductRepository = new InMemoryProductRepository()
const contactRepository: IContactRepository = new InMemoryContactRepository()
const quoteClient: IQuoteApiClient = new QuoteApiClient(config.quoteApiUrl, config.quoteApiTimeoutMs)

const jobQueue: IJobQueue = new InMemoryJobQueue(config.queuePollIntervalMs)
jobQueue.register('lead.follow-up', new LeadFollowUpJob())
jobQueue.register('quote.digest', new QuoteDigestJob(quoteClient))
jobQueue.start()

const authService: IAuthService = new AuthService(config.demoEmail, config.demoPassword)

const dashboardService: IDashboardService = new DashboardService(
  jobQueue,
  quoteClient,
  contactRepository,
  productRepository,
)

export {
  authService,
  config,
  contactRepository,
  dashboardService,
  jobQueue,
  productRepository,
  quoteClient,
}
