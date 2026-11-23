package catalog

import (
	"fmt"
	"sync"

	"github.com/yougarden/golang-greenshelf-desk/internal/domain"
	"github.com/yougarden/golang-greenshelf-desk/internal/ports"
)

type Memory struct {
	mu   sync.Mutex
	skus map[string]*stocked
}

type stocked struct {
	sku       string
	name      string
	listPrice float64
	stock     int
}

func NewMemory() *Memory {
	m := &Memory{skus: map[string]*stocked{}}
	for _, s := range []stocked{
		{"ROSE01", "Climbing Rose 3L", 24.99, 40},
		{"HERB12", "Herb Starter Tray", 9.50, 80},
		{"OLIVE1", "Olive Tree Patio", 64.00, 12},
		{"FEED03", "Bird Feeder Kit", 18.75, 25},
		{"SOIL20", "Peat-Free Compost 20L", 7.25, 100},
	} {
		cp := s
		m.skus[s.sku] = &cp
	}
	return m
}

var _ ports.Catalog = (*Memory)(nil)

func (m *Memory) All() []domain.SKU {
	m.mu.Lock()
	defer m.mu.Unlock()
	out := make([]domain.SKU, 0, len(m.skus))
	for _, s := range m.skus {
		out = append(out, domain.SKU{SKU: s.sku, Name: s.name, ListPrice: s.listPrice, Stock: s.stock})
	}
	return out
}

func (m *Memory) Find(sku string) (domain.SKU, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	s, ok := m.skus[sku]
	if !ok {
		return domain.SKU{}, false
	}
	return domain.SKU{SKU: s.sku, Name: s.name, ListPrice: s.listPrice, Stock: s.stock}, true
}

func (m *Memory) Reserve(sku string, qty int) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	s, ok := m.skus[sku]
	if !ok {
		return fmt.Errorf("unknown SKU %s", sku)
	}
	if s.stock < qty {
		return fmt.Errorf("insufficient stock for %s (have %d)", sku, s.stock)
	}
	s.stock -= qty
	return nil
}

func (m *Memory) Release(sku string, qty int) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if s, ok := m.skus[sku]; ok {
		s.stock += qty
	}
}
