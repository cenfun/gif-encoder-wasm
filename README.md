
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
start to generate: H:\workspace\wasm-gif-encoder\test\example\iamgroot.gif (18 frames) ...
wasm start: 1668401582742
wasm end: 1668401584031
wasm duration: 1289
start to generate: H:\workspace\wasm-gif-encoder\test\example\screenshot.gif (8 frames) ...
wasm start: 1668401585459
wasm end: 1668401586301
wasm duration: 842
┌──────────────┬──────────┬─────────────────────┐
│ Test         │ Duration │ File                │
├──────────────┼──────────┼─────────────────────┤
│ ├ iamgroot   │          │                     │
│ │ ├ node     │  3,548ms │ iamgroot-node.gif   │
│ │ └ wasm     │  1,820ms │ iamgroot-wasm.gif   │
│ └ screenshot │          │                     │
│   ├ node     │  1,136ms │ screenshot-node.gif │
│   └ wasm     │  1,130ms │ screenshot-wasm.gif │
└──────────────┴──────────┴─────────────────────┘
```

>Rust-Png to Wasm-Png was also Bad Performance: [issue](https://github.com/image-rs/image-png/issues/114)


## Links

* [`wasm-pack`](https://github.com/rustwasm/wasm-pack) 
* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) 
* [`image-gif`](https://github.com/image-rs/image-gif) 
* [`image-png`](https://github.com/image-rs/image-png) 
