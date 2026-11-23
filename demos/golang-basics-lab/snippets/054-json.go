// TASK 054: encoding/json
// Docs: JSON and Go
// Run:  go run 054-json.go
// Expect: {"qty":2}

package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	b, _ := json.Marshal(map[string]int{"qty": 2})
	fmt.Println(string(b))
}
