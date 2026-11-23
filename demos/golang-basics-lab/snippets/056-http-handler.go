// TASK 056: http.HandlerFunc
// Docs: Writing Web Applications
// Run:  go run 056-http-handler.go
// Expect: ok

package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func main() {
	h := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})
	rr := httptest.NewRecorder()
req := httptest.NewRequest("GET", "/", nil)
	h.ServeHTTP(rr, req)
	fmt.Println(rr.Body.String())
}
