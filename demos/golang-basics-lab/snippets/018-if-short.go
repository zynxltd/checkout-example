// TASK 018: If short stmt
// Docs: Tour: If with a short statement
// Run:  go run 018-if-short.go
// Expect: 81

package main

import "fmt"

func main() {
	if v := 81; v < 100 { fmt.Println(v) }
}
