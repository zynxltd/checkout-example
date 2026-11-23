// TASK 047: Generics
// Docs: Tour: Generics
// Run:  go run 047-generics.go
// Expect: 1

package main

import "fmt"

func Index[T comparable](s []T, x T) int {
	for i, v := range s {
		if v == x {
			return i
		}
	}
	return -1
}

func main() {
	fmt.Println(Index([]int{1, 2, 3}, 2))
}
