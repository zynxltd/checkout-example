package policy

import (
	"fmt"
	"strings"
	"time"

	"github.com/yougarden/golang-greenshelf-desk/internal/domain"
	"github.com/yougarden/golang-greenshelf-desk/internal/ports"
)

type Options struct {
	MaxLines           int
	MaxTotal           float64
	CancelWindowMinutes int
}

func DefaultOptions() Options {
	return Options{MaxLines: 8, MaxTotal: 2500, CancelWindowMinutes: 30}
}

type Default struct {
	Catalog ports.Catalog
	Opts    Options
}

var _ ports.OrderPolicy = (*Default)(nil)

func (p *Default) ValidateCreate(customer string, lines []domain.LineRequest) error {
	if strings.TrimSpace(customer) == "" {
		return fmt.Errorf("customer is required")
	}
	if len(lines) == 0 {
		return fmt.Errorf("at least one line is required")
	}
	if len(lines) > p.Opts.MaxLines {
		return fmt.Errorf("max %d lines per order", p.Opts.MaxLines)
	}
	var total float64
	for _, line := range lines {
		if line.Qty <= 0 {
			return fmt.Errorf("qty must be positive for %s", line.SKU)
		}
		sku, ok := p.Catalog.Find(strings.ToUpper(strings.TrimSpace(line.SKU)))
		if !ok {
			return fmt.Errorf("unknown SKU %s", line.SKU)
		}
		total += sku.ListPrice * float64(line.Qty)
	}
	if total > p.Opts.MaxTotal {
		return fmt.Errorf("order total exceeds £%.2f", p.Opts.MaxTotal)
	}
	return nil
}

func (p *Default) CanCancel(order domain.Order, now time.Time) error {
	if order.Status != domain.StatusOpen {
		return fmt.Errorf("only open orders can be cancelled")
	}
	window := time.Duration(p.Opts.CancelWindowMinutes) * time.Minute
	if now.Sub(order.CreatedAt) > window {
		return fmt.Errorf("cancel window (%dm) has passed", p.Opts.CancelWindowMinutes)
	}
	return nil
}

func (p *Default) CanPack(order domain.Order) error {
	if order.Status != domain.StatusOpen {
		return fmt.Errorf("only open orders can be packed")
	}
	return nil
}

func (p *Default) CanShip(order domain.Order) error {
	if order.Status != domain.StatusPacked {
		return fmt.Errorf("only packed orders can be shipped")
	}
	return nil
}
