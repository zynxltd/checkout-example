// TASK 042: Interfaces
// Docs: Tour: Interfaces
// Run:  go run 042-interfaces.go
// Expect: 2

package main

import "fmt"

type Abser interface{ Abs() float64 }

type MyFloat float64

func (f MyFloat) Abs() float64 {
	if f < 0 {
		return float64(-f)
	}
	return float64(f)
}

func main() {
	var a Abser = MyFloat(-2)
	fmt.Println(a.Abs())
}
