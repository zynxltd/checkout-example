package audit

import (
	"log"
	"sync"

	"github.com/yougarden/golang-greenshelf-desk/internal/ports"
)

// Worker drains a channel — Go's cousin of Laravel queue:work / .NET BackgroundService.
type Worker struct {
	ch   <-chan ports.AuditEntry
	mu   sync.Mutex
	log  []ports.AuditEntry
	done chan struct{}
}

func NewWorker(buffer int) (*Worker, chan<- ports.AuditEntry) {
	ch := make(chan ports.AuditEntry, buffer)
	w := &Worker{ch: ch, done: make(chan struct{})}
	return w, ch
}

func (w *Worker) Start() {
	go func() {
		for {
			select {
			case <-w.done:
				return
			case e, ok := <-w.ch:
				if !ok {
					return
				}
				w.mu.Lock()
				w.log = append(w.log, e)
				if len(w.log) > 100 {
					w.log = w.log[len(w.log)-100:]
				}
				w.mu.Unlock()
				log.Printf("audit %s order=%s %s", e.Kind, e.OrderID, e.Detail)
			}
		}
	}()
}

func (w *Worker) Stop() { close(w.done) }

func (w *Worker) Recent(limit int) []ports.AuditEntry {
	w.mu.Lock()
	defer w.mu.Unlock()
	if limit <= 0 || limit > len(w.log) {
		limit = len(w.log)
	}
	out := make([]ports.AuditEntry, limit)
	copy(out, w.log[len(w.log)-limit:])
	return out
}

var _ ports.AuditSink = (*Worker)(nil)

func (w *Worker) Append(kind, detail, orderID string) {
	// sync path unused — service uses channel
}
