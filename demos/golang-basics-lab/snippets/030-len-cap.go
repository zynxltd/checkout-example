// TASK 030: len and cap
// Docs: Tour: Slice length and capacity
// Run:  go run 030-len-cap.go
// Expect: 0 6\n4 6

package main

import "fmt"

func main() {
	s := []int{2, 3, 5, 7, 11, 13}
	s = s[:0]
	fmt.Println(len(s), cap(s))
	s = s[:4]
	fmt.Println(len(s), cap(s))
}
