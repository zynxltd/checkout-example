package ports

import (
	"time"

	"github.com/yougarden/golang-greenshelf-desk/internal/domain"
)

// Clock abstracts time for tests (DIP).
type Clock interface {
	Now() time.Time
}

// Catalog owns stock — separate from order persistence (ISP / SRP).
type Catalog interface {
	All() []domain.SKU
	Find(sku string) (domain.SKU, bool)
	Reserve(sku string, qty int) error
	Release(sku string, qty int)
}

// OrderStore is persistence only.
type OrderStore interface {
	Add(order domain.Order) domain.Order
	Replace(order domain.Order) domain.Order
	Find(id string) (domain.Order, bool)
	All() []domain.Order
	OpenCount() int
}

// OrderPolicy = rules only (Open/Closed: swap implementations).
type OrderPolicy interface {
	ValidateCreate(customer string, lines []domain.LineRequest) error
	CanCancel(order domain.Order, now time.Time) error
	CanPack(order domain.Order) error
	CanShip(order domain.Order) error
}

// OrderService orchestrates catalog + policy + store.
type OrderService interface {
	ListCatalogue() []domain.SKU
	ListOrders(status string) []domain.Order
	Get(id string) (domain.Order, bool)
	Create(req domain.CreateOrderRequest) domain.MutationResult
	Cancel(id string) domain.MutationResult
	Pack(id string) domain.MutationResult
	Ship(id string, tracking string) domain.MutationResult
	OpenCount() int
}

// AuditSink receives async audit events (worker drains a channel).
type AuditSink interface {
	Append(kind, detail, orderID string)
	Recent(limit int) []AuditEntry
}

type AuditEntry struct {
	Kind    string    `json:"kind"`
	Detail  string    `json:"detail"`
	OrderID string    `json:"orderId"`
	At      time.Time `json:"at"`
}
