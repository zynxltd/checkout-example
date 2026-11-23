// TASK 049: Channels
// Docs: Tour: Channels
// Run:  go run 049-channels.go
// Expect: 1

package main

import "fmt"

func main() {
	ch := make(chan int)
	go func() { ch <- 1 }()
	fmt.Println(<-ch)
}
