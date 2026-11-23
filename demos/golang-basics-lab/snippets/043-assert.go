// TASK 043: Type assertions
// Docs: Tour: Type assertions
// Run:  go run 043-assert.go
// Expect: hello\nhello true

package main

import "fmt"

func main() {
	var i any = "hello"
	fmt.Println(i.(string))
	s, ok := i.(string)
	fmt.Println(s, ok)
}
