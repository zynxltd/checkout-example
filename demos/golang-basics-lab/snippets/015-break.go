// TASK 015: Break
// Docs: Tour: Forever
// Run:  go run 015-break.go
// Expect: 3

package main

import "fmt"

func main() {
	i := 0
	for { i++; if i >= 3 { break } }
	fmt.Println(i)
}
