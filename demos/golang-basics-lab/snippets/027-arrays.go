// TASK 027: Arrays
// Docs: Tour: Arrays
// Run:  go run 027-arrays.go
// Expect: Hello World

package main

import "fmt"

func main() {
	var a [2]string
	a[0], a[1] = "Hello", "World"
	fmt.Println(a[0], a[1])
}
