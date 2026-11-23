// TASK 063: Audit channel
// Docs: Tour: Channels practice
// Run:  go run 063-channel-audit.go
// Expect: audited:paid

package main

import "fmt"

func main() {
	events := make(chan string, 1)
	events <- "paid"
	fmt.Println("audited:" + <-events)
}
