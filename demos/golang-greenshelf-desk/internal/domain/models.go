package domain

import "time"

type OrderStatus string

const (
	StatusOpen      OrderStatus = "open"
	StatusPacked    OrderStatus = "packed"
	StatusShipped   OrderStatus = "shipped"
	StatusCancelled OrderStatus = "cancelled"
)

type OrderLine struct {
	SKU       string  `json:"sku"`
	Name      string  `json:"name"`
	Qty       int     `json:"qty"`
	UnitPrice float64 `json:"unitPrice"`
}

type OrderEvent struct {
	Kind   string    `json:"kind"`
	Detail string    `json:"detail"`
	At     time.Time `json:"at"`
}

type Order struct {
	ID          string       `json:"id"`
	Customer    string       `json:"customer"`
	Status      OrderStatus  `json:"status"`
	Total       float64      `json:"total"`
	Lines       []OrderLine  `json:"lines"`
	Notes       string       `json:"notes,omitempty"`
	CreatedAt   time.Time    `json:"createdAt"`
	PackedAt    *time.Time   `json:"packedAt,omitempty"`
	ShippedAt   *time.Time   `json:"shippedAt,omitempty"`
	CancelledAt *time.Time   `json:"cancelledAt,omitempty"`
	Events      []OrderEvent `json:"events"`
}

type SKU struct {
	SKU       string  `json:"sku"`
	Name      string  `json:"name"`
	ListPrice float64 `json:"listPrice"`
	Stock     int     `json:"stock"`
}

type CreateOrderRequest struct {
	Customer string          `json:"customer"`
	Notes    string          `json:"notes"`
	Lines    []LineRequest   `json:"lines"`
}

type LineRequest struct {
	SKU string `json:"sku"`
	Qty int    `json:"qty"`
}

type MutationResult struct {
	OK      bool
	Code    string // validation | stock | conflict | not_found
	Message string
	Order   *Order
}
