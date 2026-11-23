package service

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"math"
	"strings"

	"github.com/yougarden/golang-greenshelf-desk/internal/domain"
	"github.com/yougarden/golang-greenshelf-desk/internal/ports"
)

type Orders struct {
	Catalog ports.Catalog
	Store   ports.OrderStore
	Policy  ports.OrderPolicy
	Clock   ports.Clock
	Audit   chan<- ports.AuditEntry // optional async audit (nil-safe)
}

var _ ports.OrderService = (*Orders)(nil)

func (s *Orders) ListCatalogue() []domain.SKU { return s.Catalog.All() }

func (s *Orders) OpenCount() int { return s.Store.OpenCount() }

func (s *Orders) ListOrders(status string) []domain.Order {
	all := s.Store.All()
	if status == "" {
		return all
	}
	out := make([]domain.Order, 0)
	for _, o := range all {
		if string(o.Status) == status {
			out = append(out, o)
		}
	}
	return out
}

func (s *Orders) Get(id string) (domain.Order, bool) { return s.Store.Find(id) }

func (s *Orders) Create(req domain.CreateOrderRequest) domain.MutationResult {
	merged := map[string]int{}
	for _, line := range req.Lines {
		sku := strings.ToUpper(strings.TrimSpace(line.SKU))
		if sku == "" || line.Qty <= 0 {
			continue
		}
		merged[sku] += line.Qty
	}
	lines := make([]domain.LineRequest, 0, len(merged))
	for sku, qty := range merged {
		lines = append(lines, domain.LineRequest{SKU: sku, Qty: qty})
	}

	if err := s.Policy.ValidateCreate(strings.TrimSpace(req.Customer), lines); err != nil {
		return fail("validation", err.Error())
	}

	reserved := make([]domain.OrderLine, 0, len(lines))
	for _, line := range lines {
		item, _ := s.Catalog.Find(line.SKU)
		if err := s.Catalog.Reserve(line.SKU, line.Qty); err != nil {
			for _, r := range reserved {
				s.Catalog.Release(r.SKU, r.Qty)
			}
			return fail("stock", err.Error())
		}
		reserved = append(reserved, domain.OrderLine{
			SKU: item.SKU, Name: item.Name, Qty: line.Qty, UnitPrice: item.ListPrice,
		})
	}

	var total float64
	for _, l := range reserved {
		total += l.UnitPrice * float64(l.Qty)
	}
	total = math.Round(total*100) / 100
	now := s.Clock.Now()
	order := domain.Order{
		ID:        newID(),
		Customer:  strings.TrimSpace(req.Customer),
		Status:    domain.StatusOpen,
		Total:     total,
		Lines:     reserved,
		Notes:     strings.TrimSpace(req.Notes),
		CreatedAt: now,
		Events:    []domain.OrderEvent{{Kind: "created", Detail: "Order accepted", At: now}},
	}
	saved := s.Store.Add(order)
	s.emit("created", fmt.Sprintf("total £%.2f", total), saved.ID)
	return ok(saved)
}

func (s *Orders) Cancel(id string) domain.MutationResult {
	existing, found := s.Store.Find(id)
	if !found {
		return fail("not_found", "Order not found")
	}
	if err := s.Policy.CanCancel(existing, s.Clock.Now()); err != nil {
		return fail("conflict", err.Error())
	}
	for _, line := range existing.Lines {
		s.Catalog.Release(line.SKU, line.Qty)
	}
	now := s.Clock.Now()
	existing.Status = domain.StatusCancelled
	existing.CancelledAt = &now
	existing.Events = append(existing.Events, domain.OrderEvent{Kind: "cancelled", Detail: "Cancelled by desk", At: now})
	saved := s.Store.Replace(existing)
	s.emit("cancelled", "stock released", saved.ID)
	return ok(saved)
}

func (s *Orders) Pack(id string) domain.MutationResult {
	existing, found := s.Store.Find(id)
	if !found {
		return fail("not_found", "Order not found")
	}
	if err := s.Policy.CanPack(existing); err != nil {
		return fail("conflict", err.Error())
	}
	now := s.Clock.Now()
	existing.Status = domain.StatusPacked
	existing.PackedAt = &now
	existing.Events = append(existing.Events, domain.OrderEvent{Kind: "packed", Detail: "Moved to packed", At: now})
	saved := s.Store.Replace(existing)
	s.emit("packed", "ready for ship", saved.ID)
	return ok(saved)
}

func (s *Orders) Ship(id string, tracking string) domain.MutationResult {
	existing, found := s.Store.Find(id)
	if !found {
		return fail("not_found", "Order not found")
	}
	if err := s.Policy.CanShip(existing); err != nil {
		return fail("conflict", err.Error())
	}
	now := s.Clock.Now()
	detail := "Shipped"
	if strings.TrimSpace(tracking) != "" {
		detail = "Shipped tracking=" + strings.TrimSpace(tracking)
	}
	existing.Status = domain.StatusShipped
	existing.ShippedAt = &now
	existing.Events = append(existing.Events, domain.OrderEvent{Kind: "shipped", Detail: detail, At: now})
	saved := s.Store.Replace(existing)
	s.emit("shipped", detail, saved.ID)
	return ok(saved)
}

func (s *Orders) emit(kind, detail, orderID string) {
	if s.Audit == nil {
		return
	}
	select {
	case s.Audit <- ports.AuditEntry{Kind: kind, Detail: detail, OrderID: orderID, At: s.Clock.Now()}:
	default:
		// drop if worker is behind — demo only
	}
}

func ok(o domain.Order) domain.MutationResult {
	return domain.MutationResult{OK: true, Order: &o}
}

func fail(code, msg string) domain.MutationResult {
	return domain.MutationResult{OK: false, Code: code, Message: msg}
}

func newID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}
