// TASK 057: sync.Mutex
// Docs: Tour: sync.Mutex / Effective Go
// Run:  go run 057-mutex.go
// Expect: 1000

package main

import (
	"fmt"
	"sync"
)

func main() {
	var mu sync.Mutex
	n := 0
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mu.Lock()
			n++
			mu.Unlock()
		}()
	}
	wg.Wait()
	fmt.Println(n)
}
