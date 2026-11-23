// TASK 061: GreenShelf order struct
// Docs: Tour: Structs practice
// Run:  go run 061-struct-order.go
// Expect: ORD-1 pending

package main

import "fmt"

type Order struct {
	ID     string
	Status string
}

func main() {
	o := Order{ID: "ORD-1", Status: "pending"}
	fmt.Println(o.ID, o.Status)
}
