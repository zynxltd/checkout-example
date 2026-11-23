// TASK 065: Stock map
// Docs: Tour: Maps practice
// Run:  go run 065-map-stock.go
// Expect: 3

package main

import "fmt"

func main() {
	stock := map[string]int{"rose": 3, "herb": 10}
	fmt.Println(stock["rose"])
}
