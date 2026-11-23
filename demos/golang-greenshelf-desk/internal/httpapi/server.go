package httpapi

import (
	"encoding/json"
	"net/http"

	"github.com/yougarden/golang-greenshelf-desk/internal/domain"
	"github.com/yougarden/golang-greenshelf-desk/internal/ports"
)

type Server struct {
	Orders ports.OrderService
	Audit  interface{ Recent(limit int) []ports.AuditEntry }
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", s.handleHome)
	mux.HandleFunc("GET /api/health", s.handleHealth)
	mux.HandleFunc("GET /api/catalog", s.handleCatalog)
	mux.HandleFunc("GET /api/orders", s.handleListOrders)
	mux.HandleFunc("GET /api/orders/{id}", s.handleGetOrder)
	mux.HandleFunc("POST /api/orders", s.handleCreate)
	mux.HandleFunc("POST /api/orders/{id}/cancel", s.handleCancel)
	mux.HandleFunc("POST /api/orders/{id}/pack", s.handlePack)
	mux.HandleFunc("POST /api/orders/{id}/ship", s.handleShip)
	mux.HandleFunc("GET /api/audit", s.handleAudit)
	return mux
}

func (s *Server) handleHome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write([]byte(homeHTML))
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status": "ok", "service": "golang-greenshelf-desk", "openOrders": s.Orders.OpenCount(),
	})
}

func (s *Server) handleCatalog(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.Orders.ListCatalogue())
}

func (s *Server) handleListOrders(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	writeJSON(w, http.StatusOK, s.Orders.ListOrders(status))
}

func (s *Server) handleGetOrder(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	o, ok := s.Orders.Get(id)
	if !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "Order not found"})
		return
	}
	writeJSON(w, http.StatusOK, o)
}

func (s *Server) handleCreate(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
		return
	}
	res := s.Orders.Create(req)
	if !res.OK {
		status := http.StatusBadRequest
		if res.Code == "stock" {
			status = http.StatusConflict
		}
		writeJSON(w, status, map[string]string{"error": res.Message})
		return
	}
	w.Header().Set("Location", "/api/orders/"+res.Order.ID)
	writeJSON(w, http.StatusCreated, res.Order)
}

func (s *Server) handleCancel(w http.ResponseWriter, r *http.Request) {
	s.mapMutation(w, s.Orders.Cancel(r.PathValue("id")))
}

func (s *Server) handlePack(w http.ResponseWriter, r *http.Request) {
	s.mapMutation(w, s.Orders.Pack(r.PathValue("id")))
}

func (s *Server) handleShip(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Tracking string `json:"tracking"`
	}
	_ = json.NewDecoder(r.Body).Decode(&body)
	s.mapMutation(w, s.Orders.Ship(r.PathValue("id"), body.Tracking))
}

func (s *Server) handleAudit(w http.ResponseWriter, r *http.Request) {
	if s.Audit == nil {
		writeJSON(w, http.StatusOK, []any{})
		return
	}
	writeJSON(w, http.StatusOK, s.Audit.Recent(50))
}

func (s *Server) mapMutation(w http.ResponseWriter, res domain.MutationResult) {
	if res.OK {
		writeJSON(w, http.StatusOK, res.Order)
		return
	}
	switch res.Code {
	case "not_found":
		writeJSON(w, http.StatusNotFound, map[string]string{"error": res.Message})
	default:
		writeJSON(w, http.StatusConflict, map[string]string{"error": res.Message})
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	_ = enc.Encode(v)
}

const homeHTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>Go GreenShelf desk</title>
<style>body{font-family:Segoe UI,system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#15241a;background:#f4faf6}
code,pre{background:#e8f2eb;padding:.15rem .35rem;border-radius:4px}pre{padding:.75rem;overflow:auto}.muted{color:#5a6b60}</style>
</head><body>
<h1>GreenShelf desk (Go)</h1>
<p class="muted">stdlib <code>net/http</code> + interfaces + goroutine audit worker. Port <code>:5201</code>.</p>
<pre>
curl -s http://127.0.0.1:5201/api/catalog

curl -s http://127.0.0.1:5201/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"customer":"Sam Lee","lines":[{"sku":"ROSE01","qty":2}],"notes":"leave by shed"}'

curl -s -X POST http://127.0.0.1:5201/api/orders/{id}/pack
curl -s -X POST http://127.0.0.1:5201/api/orders/{id}/ship \
  -H 'Content-Type: application/json' -d '{"tracking":"GS-GO-1"}'

curl -s http://127.0.0.1:5201/api/audit
</pre>
</body></html>`
