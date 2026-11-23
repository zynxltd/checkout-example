// TASK 035: Maps
// Docs: Tour: Maps
// Run:  go run 035-maps.go
// Expect: 42

package main

import "fmt"

func main() {
	m := make(map[string]int)
	m["Answer"] = 42
	fmt.Println(m["Answer"])
}
