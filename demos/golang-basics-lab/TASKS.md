# Go basics — runnable tasks (go.dev)

Docs hub: [go.dev/doc](https://go.dev/doc/)
Primary path: [A Tour of Go](https://go.dev/tour/) · [Effective Go](https://go.dev/doc/effective_go) · [Writing Web Applications](https://go.dev/doc/articles/wiki/)

## Run

```bash
cd demos/golang-basics-lab/snippets
go run 001-hello.go
go run 049-channels.go
../run-all.sh
```

Also try the same ideas in the browser: [Go Playground](https://go.dev/play/) (paste the `package main` body).

## Checklist

- [ ] `001-hello.go` — **Hello World** · Getting started / Tour · expect `hello greenshelf`
- [ ] `002-packages.go` — **Packages** · Tour: Packages · expect `fmt package`
- [ ] `003-functions.go` — **Functions** · Tour: Functions · expect `55`
- [ ] `004-multi-return.go` — **Multiple results** · Tour: Multiple results · expect `world hello`
- [ ] `005-named-return.go` — **Named returns** · Tour: Named return values · expect `7 10`
- [ ] `006-vars.go` — **Variables** · Tour: Variables · expect `1 2`
- [ ] `007-short-decl.go` — **Short declaration** · Tour: Short variable declarations · expect `3`
- [ ] `008-basic-types.go` — **Basic types** · Tour: Basic types · expect `true hi 42`
- [ ] `009-zero.go` — **Zero values** · Tour: Zero values · expect `0 "" false`
- [ ] `010-convert.go` — **Type conversions** · Tour: Type conversions · expect `42`
- [ ] `011-infer.go` — **Type inference** · Tour: Type inference · expect `int`
- [ ] `012-const.go` — **Constants** · Tour: Constants · expect `3.14`
- [ ] `013-for.go` — **For** · Tour: For · expect `45`
- [ ] `014-for-while.go` — **For as while** · Tour: For continued · expect `1024`
- [ ] `015-break.go` — **Break** · Tour: Forever · expect `3`
- [ ] `016-if.go` — **If** · Tour: If · expect `odd`
- [ ] `017-if-else.go` — **If else** · Tour: If and else · expect `even`
- [ ] `018-if-short.go` — **If short stmt** · Tour: If with a short statement · expect `81`
- [ ] `019-switch.go` — **Switch** · Tour: Switch · expect `darwin`
- [ ] `020-switch-true.go` — **Switch true** · Tour: Switch with no condition · expect `pm-ish`
- [ ] `021-defer.go` — **Defer** · Tour: Defer · expect `hello\nworld`
- [ ] `022-defer-stack.go` — **Defer stack** · Tour: Stacking defers · expect `3\n2\n1`
- [ ] `023-pointers.go` — **Pointers** · Tour: Pointers · expect `21`
- [ ] `024-structs.go` — **Structs** · Tour: Structs · expect `1 2`
- [ ] `025-struct-lit.go` — **Struct literals** · Tour: Struct Literals · expect `{1 0}`
- [ ] `026-struct-ptr.go` — **Pointers to structs** · Tour: Pointers to structs · expect `9`
- [ ] `027-arrays.go` — **Arrays** · Tour: Arrays · expect `Hello World`
- [ ] `028-slices.go` — **Slices** · Tour: Slices · expect `[2 3 5]`
- [ ] `029-slice-expr.go` — **Slicing** · Tour: Slices are like references · expect `[1 2 3]`
- [ ] `030-len-cap.go` — **len and cap** · Tour: Slice length and capacity · expect `0 6\n4 6`
- [ ] `031-nil-slice.go` — **Nil slices** · Tour: Nil slices · expect `true 0`
- [ ] `032-make-slice.go` — **make slice** · Tour: Creating a slice with make · expect `5 [0 0 0 0 0]`
- [ ] `033-append.go` — **append** · Tour: Appending to a slice · expect `[0 1 2]`
- [ ] `034-range.go` — **range** · Tour: Range · expect `0=1 1=2 2=4`
- [ ] `035-maps.go` — **Maps** · Tour: Maps · expect `42`
- [ ] `036-map-lit.go` — **Map literals** · Tour: Map literals · expect `2`
- [ ] `037-map-mut.go` — **Mutating maps** · Tour: Mutating Maps · expect `false`
- [ ] `038-fn-values.go` — **Function values** · Tour: Function values · expect `25`
- [ ] `039-closures.go` — **Closures** · Tour: Function closures · expect `1 3 6`
- [ ] `040-methods.go` — **Methods** · Tour: Methods · expect `5`
- [ ] `041-ptr-recv.go` — **Pointer receivers** · Tour: Pointer receivers · expect `{6 8}`
- [ ] `042-interfaces.go` — **Interfaces** · Tour: Interfaces · expect `2`
- [ ] `043-assert.go` — **Type assertions** · Tour: Type assertions · expect `hello\nhello true`
- [ ] `044-type-switch.go` — **Type switches** · Tour: Type switches · expect `int 42`
- [ ] `045-stringer.go` — **Stringer** · Tour: Stringer · expect `Arthur (42 years)`
- [ ] `046-errors.go` — **Errors** · Tour: Errors · expect `broke`
- [ ] `047-generics.go` — **Generics** · Tour: Generics · expect `1`
- [ ] `048-goroutines.go` — **Goroutines** · Tour: Goroutines · expect `ping`
- [ ] `049-channels.go` — **Channels** · Tour: Channels · expect `1`
- [ ] `050-buffered.go` — **Buffered channels** · Tour: Buffered Channels · expect `1 2`
- [ ] `051-range-close.go` — **Range and close** · Tour: Range and Close · expect `2 4 6`
- [ ] `052-select.go` — **Select** · Tour: Select · expect `7`
- [ ] `053-select-default.go` — **Default selection** · Tour: Default Selection · expect `default`
- [ ] `054-json.go` — **encoding/json** · JSON and Go · expect `{"qty":2}`
- [ ] `055-err-idiom.go` — **if err != nil** · Effective Go · expect `err: nope`
- [ ] `056-http-handler.go` — **http.HandlerFunc** · Writing Web Applications · expect `ok`
- [ ] `057-mutex.go` — **sync.Mutex** · Tour: sync.Mutex / Effective Go · expect `1000`
- [ ] `058-sprintf.go` — **fmt.Sprintf** · fmt package · expect `LOT-42`
- [ ] `059-strings.go` — **strings.Contains** · strings package · expect `true`
- [ ] `060-time.go` — **time.Duration** · time package · expect `1500ms`
- [ ] `061-struct-order.go` — **GreenShelf order struct** · Tour: Structs practice · expect `ORD-1 pending`
- [ ] `062-interface-catalog.go` — **Catalog interface** · Tour: Interfaces practice · expect `Rose 12.5`
- [ ] `063-channel-audit.go` — **Audit channel** · Tour: Channels practice · expect `audited:paid`
- [ ] `064-slice-cart.go` — **Cart slice** · Tour: Slices practice · expect `[Rose Herb]`
- [ ] `065-map-stock.go` — **Stock map** · Tour: Maps practice · expect `3`

## Done when

- You know `:=`, zero values, slices vs arrays, maps, methods, interfaces
- You can spawn a goroutine and read/write a channel
- `if err != nil` feels automatic
