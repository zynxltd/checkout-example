// TASK 032: make slice
// Docs: Tour: Creating a slice with make
// Run:  go run 032-make-slice.go
// Expect: 5 [0 0 0 0 0]

package main

import "fmt"

func main() {
	a := make([]int, 5)
	fmt.Println(len(a), a)
}
