// TASK 041: Pointer receivers
// Docs: Tour: Pointer receivers
// Run:  go run 041-ptr-recv.go
// Expect: {6 8}

package main

import "fmt"

type Vertex struct{ X, Y float64 }

func (v *Vertex) Scale(f float64) {
	v.X *= f
	v.Y *= f
}

func main() {
	v := Vertex{3, 4}
	v.Scale(2)
	fmt.Println(v)
}
