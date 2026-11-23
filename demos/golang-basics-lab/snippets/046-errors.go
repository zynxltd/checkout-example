// TASK 046: Errors
// Docs: Tour: Errors
// Run:  go run 046-errors.go
// Expect: broke

package main

import (
	"errors"
	"fmt"
)

func run() error {
	return errors.New("broke")
}

func main() {
	if err := run(); err != nil {
		fmt.Println(err)
	}
}
