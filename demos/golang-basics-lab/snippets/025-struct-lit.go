// TASK 025: Struct literals
// Docs: Tour: Struct Literals
// Run:  go run 025-struct-lit.go
// Expect: {1 0}

package main

import "fmt"

func main() {
	type Vertex struct{ X, Y int }
	fmt.Println(Vertex{X: 1})
}
