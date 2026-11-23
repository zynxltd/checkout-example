// TASK 009: Zero values
// Docs: Tour: Zero values
// Run:  go run 009-zero.go
// Expect: 0 "" false

package main

import "fmt"

func main() {
	var i int
	var s string
	var b bool
	fmt.Printf("%v %q %v\n", i, s, b)
}
