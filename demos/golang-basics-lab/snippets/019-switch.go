// TASK 019: Switch
// Docs: Tour: Switch
// Run:  go run 019-switch.go
// Expect: darwin

package main

import "fmt"

func main() {
	switch os := "mac"; os {
	case "mac": fmt.Println("darwin")
	default: fmt.Println(os)
	}
}
