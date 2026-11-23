// TASK 040: Methods
// Docs: Tour: Methods
// Run:  go run 040-methods.go
// Expect: 5

package main

import (
	"fmt"
	"math"
)

type Vertex struct{ X, Y float64 }

func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func main() {
	fmt.Printf("%.0f\n", Vertex{3, 4}.Abs())
}
