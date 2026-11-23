// TASK 003: Functions
// Docs: Tour: Functions
// Run:  go run 003-functions.go
// Expect: 55

package main

import "fmt"

func main() {
	add := func(x, y int) int { return x + y }
	fmt.Println(add(42, 13))
}
