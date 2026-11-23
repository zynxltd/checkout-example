// TASK 052: Select
// Docs: Tour: Select
// Run:  go run 052-select.go
// Expect: 7

package main

import "fmt"

func main() {
	c := make(chan int, 1)
	c <- 7
	select {
	case x := <-c:
		fmt.Println(x)
	default:
		fmt.Println("none")
	}
}
