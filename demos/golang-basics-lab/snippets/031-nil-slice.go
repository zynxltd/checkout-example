// TASK 031: Nil slices
// Docs: Tour: Nil slices
// Run:  go run 031-nil-slice.go
// Expect: true 0

package main

import "fmt"

func main() {
	var s []int
	fmt.Println(s == nil, len(s))
}
