// TASK 005: Named returns
// Docs: Tour: Named return values
// Run:  go run 005-named-return.go
// Expect: 7 10

package main

import "fmt"

func main() {
	split := func(sum int) (x, y int) { x = sum * 4 / 9; y = sum - x; return }
	fmt.Println(split(17))
}
