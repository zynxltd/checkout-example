// TASK 023: Pointers
// Docs: Tour: Pointers
// Run:  go run 023-pointers.go
// Expect: 21

package main

import "fmt"

func main() {
	i := 42
	p := &i
	*p = 21
	fmt.Println(i)
}
