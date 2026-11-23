# Books Minimal API — production-style layout

Same features as the Codecademy DI / filters demos, structured like a small real service.

## Folder structure

```
BooksApi/
├── Program.cs                      # composition root (DI + pipeline only)
├── Models/
│   └── Book.cs                     # entity / DTO
├── Data/
│   ├── IBookRepository.cs          # persistence contract
│   └── InMemoryBookRepository.cs   # swap for EF Core later
├── Services/
│   ├── IBookService.cs             # business contract
│   └── BookService.cs              # business logic
├── Filters/
│   └── ValidateBookFilter.cs       # endpoint filter (POST validation)
└── Endpoints/
    └── BookEndpoints.cs            # HTTP mapping only
```

## Request flow

```
HTTP → Endpoints → IBookService → IBookRepository → data
         ↑
    ValidateBookFilter (on POST)
```

## DI in Program.cs

```csharp
builder.Services.AddSingleton<IBookRepository, InMemoryBookRepository>();
builder.Services.AddScoped<IBookService, BookService>();
```

Endpoints inject `IBookService` — not concrete classes. That matches how you’d unit-test with Moq.

## Run

```bash
cd demos/dotnet-minimal-books-api
dotnet run --launch-profile http
```

Swagger: http://localhost:5094/swagger

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/books` | list via service |
| GET | `/api/books/{id}` | 404 Problem Details if missing |
| POST | `/api/books` | filter validates, then service creates |
