// TASK 029: Slicing
// Docs: Tour: Slices are like references
// Run:  go run 029-slice-expr.go
// Expect: [1 2 3]

package main

import "fmt"

func main() {
	s := []int{0, 1, 2, 3, 4}
	fmt.Println(s[1:4])
}
