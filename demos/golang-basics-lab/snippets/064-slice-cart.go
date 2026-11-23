// TASK 064: Cart slice
// Docs: Tour: Slices practice
// Run:  go run 064-slice-cart.go
// Expect: [Rose Herb]

package main

import "fmt"

func main() {
	cart := []string{}
	cart = append(cart, "Rose", "Herb")
	fmt.Println(cart)
}
