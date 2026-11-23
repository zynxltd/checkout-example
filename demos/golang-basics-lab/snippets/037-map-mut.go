// TASK 037: Mutating maps
// Docs: Tour: Mutating Maps
// Run:  go run 037-map-mut.go
// Expect: false

package main

import "fmt"

func main() {
	m := map[string]int{"A": 1}
	delete(m, "A")
	_, ok := m["A"]
	fmt.Println(ok)
}
