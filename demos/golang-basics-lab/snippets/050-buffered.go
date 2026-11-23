// TASK 050: Buffered channels
// Docs: Tour: Buffered Channels
// Run:  go run 050-buffered.go
// Expect: 1 2

package main

import "fmt"

func main() {
	ch := make(chan int, 2)
	ch <- 1
	ch <- 2
	fmt.Println(<-ch, <-ch)
}
