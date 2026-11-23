// TASK 062: Catalog interface
// Docs: Tour: Interfaces practice
// Run:  go run 062-interface-catalog.go
// Expect: Rose 12.5

package main

import "fmt"

type Pricer interface {
	Price() float64
	Name() string
}

type Plant struct {
	Title string
	Cost  float64
}

func (p Plant) Price() float64 { return p.Cost }
func (p Plant) Name() string   { return p.Title }

func main() {
	var item Pricer = Plant{Title: "Rose", Cost: 12.5}
	fmt.Println(item.Name(), item.Price())
}
