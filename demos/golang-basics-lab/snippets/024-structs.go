// TASK 024: Structs
// Docs: Tour: Structs
// Run:  go run 024-structs.go
// Expect: 1 2

package main

import "fmt"

func main() {
	type Vertex struct{ X, Y int }
	v := Vertex{1, 2}
	fmt.Println(v.X, v.Y)
}
