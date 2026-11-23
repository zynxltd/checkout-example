// TASK 014: For as while
// Docs: Tour: For continued
// Run:  go run 014-for-while.go
// Expect: 1024

package main

import "fmt"

func main() {
	sum := 1
	for sum < 1000 { sum += sum }
	fmt.Println(sum)
}
