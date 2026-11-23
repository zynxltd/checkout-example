package store

import (
	"sort"
	"sync"

	"github.com/yougarden/golang-greenshelf-desk/internal/domain"
	"github.com/yougarden/golang-greenshelf-desk/internal/ports"
)

type MemoryOrders struct {
	mu     sync.RWMutex
	orders map[string]domain.Order
}

func NewMemoryOrders() *MemoryOrders {
	return &MemoryOrders{orders: map[string]domain.Order{}}
}

var _ ports.OrderStore = (*MemoryOrders)(nil)

func (s *MemoryOrders) Add(order domain.Order) domain.Order {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.orders[order.ID] = order
	return order
}

func (s *MemoryOrders) Replace(order domain.Order) domain.Order {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.orders[order.ID] = order
	return order
}

func (s *MemoryOrders) Find(id string) (domain.Order, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	o, ok := s.orders[id]
	return o, ok
}

func (s *MemoryOrders) All() []domain.Order {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]domain.Order, 0, len(s.orders))
	for _, o := range s.orders {
		out = append(out, o)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].CreatedAt.After(out[j].CreatedAt) })
	return out
}

func (s *MemoryOrders) OpenCount() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	n := 0
	for _, o := range s.orders {
		if o.Status == domain.StatusOpen {
			n++
		}
	}
	return n
}
