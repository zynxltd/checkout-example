export default class DashboardService {
    jobQueue;
    quoteClient;
    contactRepository;
    productRepository;
    constructor(jobQueue, quoteClient, contactRepository, productRepository) {
        this.jobQueue = jobQueue;
        this.quoteClient = quoteClient;
        this.contactRepository = contactRepository;
        this.productRepository = productRepository;
    }
    async build() {
        const quote = await this.quoteClient.fetchQuote();
        const recentMessages = this.contactRepository.findAll().slice(0, 5);
        return {
            queueSummary: this.jobQueue.getStats(),
            recentJobs: this.jobQueue.recent(6),
            recentMessages,
            quote,
            productCategories: this.productRepository.countByCategory(),
            contactCount: this.contactRepository.count(),
        };
    }
}
