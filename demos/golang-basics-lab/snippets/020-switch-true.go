// TASK 020: Switch true
// Docs: Tour: Switch with no condition
// Run:  go run 020-switch-true.go
// Expect: pm-ish

package main

import "fmt"

func main() {
	t := 15
	switch {
	case t < 12: fmt.Println("am")
	default: fmt.Println("pm-ish")
	}
}
