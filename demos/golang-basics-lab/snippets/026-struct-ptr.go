// TASK 026: Pointers to structs
// Docs: Tour: Pointers to structs
// Run:  go run 026-struct-ptr.go
// Expect: 9

package main

import "fmt"

func main() {
	type Vertex struct{ X, Y int }
	v := &Vertex{1, 2}
	v.X = 9
	fmt.Println(v.X)
}
