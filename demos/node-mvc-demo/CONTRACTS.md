# Contracts & SOLID in Harbor MVC (TypeScript)

This demo uses **interfaces as contracts** in `src/contracts/`. Controllers and services depend on contracts, not concrete classes — swap implementations without rewriting HTTP handlers.

## Contract map

| Contract | File | Default implementation |
|----------|------|----------------------|
| `IProductRepository` | `contracts/IProductRepository.ts` | `InMemoryProductRepository` |
| `IContactRepository` | `contracts/IContactRepository.ts` | `InMemoryContactRepository` |
| `IJobQueue` | `contracts/IJobQueue.ts` | `InMemoryJobQueue` |
| `IJobHandler<TPayload, TResult>` | `contracts/IJobHandler.ts` | `LeadFollowUpJob`, `QuoteDigestJob` |
| `IQuoteApiClient` | `contracts/IQuoteApiClient.ts` | `QuoteApiClient` |
| `IAuthService` | `contracts/IAuthService.ts` | `AuthService` |
| `IDashboardService` | `contracts/IDashboardService.ts` | `DashboardService` |

Composition root wires concrete classes to contracts in `lib/appContainer.ts`:

```ts
const jobQueue: IJobQueue = new InMemoryJobQueue(config.queuePollIntervalMs)
const dashboardService: IDashboardService = new DashboardService(
  jobQueue,
  quoteClient,
  contactRepository,
  productRepository,
)
```

## SOLID — how this codebase maps

### S — Single Responsibility

Each class has one reason to change:

- `Product` — domain behaviour (price display, stock labels)
- `InMemoryProductRepository` — data access only
- `AuthService` — credential rules only
- `InMemoryJobQueue` — queue lifecycle only
- `DashboardService` — aggregates data for the dashboard view
- Controllers — HTTP request/response only

### O — Open/Closed

Open for extension, closed for modification:

- Add a new job type: create a class implementing `IJobHandler`, then `jobQueue.register('new.type', handler)` — no changes to `InMemoryJobQueue`
- Add Postgres storage: implement `IProductRepository` — controllers unchanged

### L — Liskov Substitution

Any implementation of a contract can replace another:

- `LeadFollowUpJob` and `QuoteDigestJob` extend `BaseJobHandler` and are interchangeable where `IJobHandler` is expected
- `InMemoryProductRepository` can be swapped for `PostgresProductRepository` as long as it honours `IProductRepository`

### I — Interface Segregation

Small, focused contracts — no “god interface”:

- `IQuoteApiClient` has one method: `fetchQuote()`
- `IAuthService` has `validate()` + `authenticate()` — not mixed with queue or DB concerns
- Repositories expose only catalogue/contact operations, not HTTP or session logic

### D — Dependency Inversion

High-level modules depend on abstractions:

- `DashboardService` depends on `IJobQueue`, `IQuoteApiClient`, `IContactRepository`, `IProductRepository` — not concrete classes
- `QuoteDigestJob` depends on `IQuoteApiClient`, not `fetch()` directly
- `appContainer.ts` is the only place that chooses concrete implementations (composition root)

## Example: typed job contract

```ts
// contract
export interface IJobHandler<TPayload, TResult> {
  readonly type: string
  handle(payload: TPayload): Promise<TResult>
}

// implementation
export class LeadFollowUpJob extends BaseJobHandler<LeadFollowUpPayload, LeadFollowUpResult> {
  readonly type = 'lead.follow-up' as const

  async handle(payload: LeadFollowUpPayload): Promise<LeadFollowUpResult> {
    return { sentTo: payload.email, subject: `...`, queuedBecause: payload.reason }
  }
}
```

## Does *all* TS here follow SOLID OOP?

**Mostly yes, by design** — but a teaching demo still has pragmatic shortcuts:

| Area | SOLID? | Note |
|------|--------|------|
| `contracts/` + repositories | ✅ | Clear interfaces + implementations |
| Services | ✅ | Depend on contracts |
| Models (`Product`, `ContactMessage`) | ✅ | Domain classes with behaviour |
| Controllers | ✅ thin | Some validation still lives on `ContactMessage` (could move to a `ContactService`) |
| `appContainer.ts` | ✅ DIP | Single composition root |
| Global singleton exports | ⚠️ | Fine for demo; production might use a DI container |
| In-memory storage | ⚠️ | Not persistence — intentional for learning |

To go further: extract `ContactService`, add a `FakeQuoteApiClient` for tests, or plug in Prisma behind the repository contracts.
