// TASK 036: Map literals
// Docs: Tour: Map literals
// Run:  go run 036-map-lit.go
// Expect: 2

package main

import "fmt"

func main() {
	m := map[string]int{"B": 2}
	fmt.Println(m["B"])
}
