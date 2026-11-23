// TASK 033: append
// Docs: Tour: Appending to a slice
// Run:  go run 033-append.go
// Expect: [0 1 2]

package main

import "fmt"

func main() {
	var s []int
	s = append(s, 0, 1, 2)
	fmt.Println(s)
}
