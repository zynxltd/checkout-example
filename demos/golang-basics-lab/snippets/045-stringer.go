// TASK 045: Stringer
// Docs: Tour: Stringer
// Run:  go run 045-stringer.go
// Expect: Arthur (42 years)

package main

import "fmt"

type Person struct {
	Name string
	Age  int
}

func (p Person) String() string {
	return fmt.Sprintf("%v (%v years)", p.Name, p.Age)
}

func main() {
	fmt.Println(Person{"Arthur", 42})
}
