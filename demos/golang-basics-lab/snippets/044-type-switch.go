// TASK 044: Type switches
// Docs: Tour: Type switches
// Run:  go run 044-type-switch.go
// Expect: int 42

package main

import "fmt"

func main() {
	var i any = 42
	switch v := i.(type) {
	case int: fmt.Printf("int %d\n", v)
	default: fmt.Printf("%T\n", v)
	}
}
