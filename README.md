
## Wasm Gif Encoder
> wasm gif encoder for nodejs

## Install
- wasm-pack

## Usage

```
npm run build

npm run test
```

## Test Result
>Rust-Gif to Wasm-Gif was Bad Performance than Node
```
start to generate: test/example/screenshot.gif (11 frames) ...
node cost: 1,908ms
wasm start: 1572059819959
wasm end: 1572059821920 duration: 1961
wasm cost: 2,890ms

start to generate: test/example/elf.gif (10 frames) ...
node cost: 681ms
wasm start: 1572059823123
wasm end: 1572059823670 duration: 547
wasm cost: 729ms

start to generate: test/example/cat.gif (35 frames) ...
node cost: 888ms
wasm start: 1572059824863
wasm end: 1572059825656 duration: 793
wasm cost: 1,038ms

start to generate: test/example/photo.gif (1 frames) ...
node cost: 13ms
wasm start: 1572059825684
wasm end: 1572059825697 duration: 13
wasm cost: 17ms
```

>Rust-Png to Wasm-Png was also Bad Performance: [issue](https://github.com/image-rs/image-png/issues/114)


## Links

* [`wasm-pack`](https://github.com/rustwasm/wasm-pack) 
* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) 