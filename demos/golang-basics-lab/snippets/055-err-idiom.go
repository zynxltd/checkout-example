// TASK 055: if err != nil
// Docs: Effective Go
// Run:  go run 055-err-idiom.go
// Expect: err: nope

package main

import (
	"errors"
	"fmt"
)

func mightFail(ok bool) error {
	if !ok {
		return errors.New("nope")
	}
	return nil
}

func main() {
	if err := mightFail(false); err != nil {
		fmt.Println("err:", err)
	}
}
