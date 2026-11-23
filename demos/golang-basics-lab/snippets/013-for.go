// TASK 013: For
// Docs: Tour: For
// Run:  go run 013-for.go
// Expect: 45

package main

import "fmt"

func main() {
	sum := 0
	for i := 0; i < 10; i++ { sum += i }
	fmt.Println(sum)
}
