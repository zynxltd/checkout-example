package service_test

import (
	"testing"
	"time"

	"github.com/yougarden/golang-greenshelf-desk/internal/catalog"
	"github.com/yougarden/golang-greenshelf-desk/internal/domain"
	"github.com/yougarden/golang-greenshelf-desk/internal/policy"
	"github.com/yougarden/golang-greenshelf-desk/internal/service"
	"github.com/yougarden/golang-greenshelf-desk/internal/store"
)

type fixedClock struct{ at time.Time }

func (f fixedClock) Now() time.Time { return f.at }

func TestCreatePackShip(t *testing.T) {
	cat := catalog.NewMemory()
	svc := &service.Orders{
		Catalog: cat,
		Store:   store.NewMemoryOrders(),
		Policy:  &policy.Default{Catalog: cat, Opts: policy.DefaultOptions()},
		Clock:   fixedClock{at: time.Date(2026, 7, 29, 12, 0, 0, 0, time.UTC)},
	}

	created := svc.Create(domain.CreateOrderRequest{
		Customer: "Sam",
		Lines:    []domain.LineRequest{{SKU: "ROSE01", Qty: 1}},
	})
	if !created.OK {
		t.Fatalf("create: %s", created.Message)
	}
	id := created.Order.ID

	packed := svc.Pack(id)
	if !packed.OK || packed.Order.Status != domain.StatusPacked {
		t.Fatalf("pack: %+v", packed)
	}
	shipped := svc.Ship(id, "T1")
	if !shipped.OK || shipped.Order.Status != domain.StatusShipped {
		t.Fatalf("ship: %+v", shipped)
	}
}
