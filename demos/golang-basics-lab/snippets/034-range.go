// TASK 034: range
// Docs: Tour: Range
// Run:  go run 034-range.go
// Expect: 0=1 1=2 2=4

package main

import "fmt"

func main() {
	for i, v := range []int{1, 2, 4} { fmt.Printf("%d=%d ", i, v) }
	fmt.Println()
}
