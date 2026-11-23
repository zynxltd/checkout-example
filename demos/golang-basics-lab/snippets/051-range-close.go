// TASK 051: Range and close
// Docs: Tour: Range and Close
// Run:  go run 051-range-close.go
// Expect: 2 4 6

package main

import "fmt"

func main() {
	ch := make(chan int, 3)
	ch <- 2
	ch <- 4
	ch <- 6
	close(ch)
	for i := range ch { fmt.Print(i, " ") }
	fmt.Println()
}
