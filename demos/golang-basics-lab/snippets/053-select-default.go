// TASK 053: Default selection
// Docs: Tour: Default Selection
// Run:  go run 053-select-default.go
// Expect: default

package main

import "fmt"

func main() {
	c := make(chan int)
	select {
	case <-c:
		fmt.Println("got")
	default:
		fmt.Println("default")
	}
}
