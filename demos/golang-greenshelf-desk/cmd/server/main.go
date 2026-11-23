package main

import (
	"log"
	"net/http"

	"github.com/yougarden/golang-greenshelf-desk/internal/audit"
	"github.com/yougarden/golang-greenshelf-desk/internal/catalog"
	"github.com/yougarden/golang-greenshelf-desk/internal/clock"
	"github.com/yougarden/golang-greenshelf-desk/internal/httpapi"
	"github.com/yougarden/golang-greenshelf-desk/internal/policy"
	"github.com/yougarden/golang-greenshelf-desk/internal/service"
	"github.com/yougarden/golang-greenshelf-desk/internal/store"
)

func main() {
	cat := catalog.NewMemory()
	orders := store.NewMemoryOrders()
	pol := &policy.Default{Catalog: cat, Opts: policy.DefaultOptions()}
	worker, auditCh := audit.NewWorker(64)
	worker.Start()

	svc := &service.Orders{
		Catalog: cat,
		Store:   orders,
		Policy:  pol,
		Clock:   clock.System{},
		Audit:   auditCh,
	}

	srv := &httpapi.Server{Orders: svc, Audit: worker}
	addr := "127.0.0.1:5201"
	log.Printf("GreenShelf Go desk listening on http://%s", addr)
	log.Fatal(http.ListenAndServe(addr, srv.Routes()))
}
