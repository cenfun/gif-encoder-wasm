
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
start to generate: H:\workspace\gif-encoder-wasm\test\example\iamgroot.gif (18 frames) ...
wasm start: 1668426467465
wasm end: 1668426468759
wasm duration: 1294
start to generate: H:\workspace\gif-encoder-wasm\test\example\screenshot.gif (8 frames) ...
wasm start: 1668426470102
wasm end: 1668426470913
wasm duration: 811
┌──────────────┬──────────┬─────────────────────┐
│ Test         │ Duration │ File                │
├──────────────┼──────────┼─────────────────────┤
│ ├ iamgroot   │          │                     │
│ │ ├ node     │  3,616ms │ iamgroot-node.gif   │
│ │ └ wasm     │  1,836ms │ iamgroot-wasm.gif   │
│ └ screenshot │          │                     │
│   ├ node     │  1,055ms │ screenshot-node.gif │
│   └ wasm     │  1,093ms │ screenshot-wasm.gif │
└──────────────┴──────────┴─────────────────────┘
```

>Rust-Png to Wasm-Png was also Bad Performance: [issue](https://github.com/image-rs/image-png/issues/114)


## Links

* [`wasm-pack`](https://github.com/rustwasm/wasm-pack) 
* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) 
* [`image-gif`](https://github.com/image-rs/image-gif) 
* [`image-png`](https://github.com/image-rs/image-png) 
