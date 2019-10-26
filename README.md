
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
node cost: 1,871ms
wasm start: 1572058898604
wasm end: 1572058900422 duration: 1818
wasm cost: 2,428ms

start to generate: test/example/elf.gif (10 frames) ...
node cost: 687ms
wasm start: 1572058901705
wasm end: 1572058902446 duration: 741
wasm cost: 916ms

start to generate: test/example/cat.gif (35 frames) ...
node cost: 882ms
wasm start: 1572058903708
wasm end: 1572058904391 duration: 683
wasm cost: 909ms

start to generate: test/example/photo.gif (1 frames) ...
node cost: 12ms
wasm start: 1572058904419
wasm end: 1572058904544 duration: 125
wasm cost: 133ms
```

>Rust-Png to Wasm-Png was also Bad Performance: [issue](https://github.com/image-rs/image-png/issues/114)


## Links

* [`wasm-pack`](https://github.com/rustwasm/wasm-pack) 
* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) 