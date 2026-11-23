// TASK 004: Multiple results
// Docs: Tour: Multiple results
// Run:  go run 004-multi-return.go
// Expect: world hello

package main

import "fmt"

func main() {
	swap := func(x, y string) (string, string) { return y, x }
	a, b := swap("hello", "world")
	fmt.Println(a, b)
}
