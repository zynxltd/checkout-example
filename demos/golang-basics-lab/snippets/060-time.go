// TASK 060: time.Duration
// Docs: time package
// Run:  go run 060-time.go
// Expect: 1500ms

package main

import (
	"fmt"
	"time"
)

func main() {
	d := 1500 * time.Millisecond
	fmt.Printf("%dms\n", d.Milliseconds())
}
