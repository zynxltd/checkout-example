// TASK 022: Defer stack
// Docs: Tour: Stacking defers
// Run:  go run 022-defer-stack.go
// Expect: 3\n2\n1

package main

import "fmt"

func main() {
	defer fmt.Println(1)
	defer fmt.Println(2)
	defer fmt.Println(3)
}
