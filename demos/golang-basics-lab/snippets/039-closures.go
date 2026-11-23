// TASK 039: Closures
// Docs: Tour: Function closures
// Run:  go run 039-closures.go
// Expect: 1 3 6

package main

import "fmt"

func main() {
	adder := func() func(int) int {
		sum := 0
		return func(x int) int { sum += x; return sum }
	}
	pos := adder()
	fmt.Println(pos(1), pos(2), pos(3))
}
