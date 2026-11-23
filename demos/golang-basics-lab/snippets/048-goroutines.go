// TASK 048: Goroutines
// Docs: Tour: Goroutines
// Run:  go run 048-goroutines.go
// Expect: ping

package main

import (
	"fmt"
	"time"
)

func main() {
	go func(msg string) {
		fmt.Println(msg)
	}("ping")
	time.Sleep(20 * time.Millisecond)
}
