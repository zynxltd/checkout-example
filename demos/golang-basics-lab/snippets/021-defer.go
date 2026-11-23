// TASK 021: Defer
// Docs: Tour: Defer
// Run:  go run 021-defer.go
// Expect: hello\nworld

package main

import "fmt"

func main() {
	defer fmt.Println("world")
	fmt.Println("hello")
}
