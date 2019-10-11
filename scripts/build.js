const fs = require("fs");
fs.copyFileSync('./pkg/wasm_gif_encoder_bg.wasm', './lib/wasm_gif_encoder_bg.wasm');
fs.copyFileSync('./pkg/wasm_gif_encoder_bg.js', './lib/wasm_gif_encoder_bg.js');
fs.copyFileSync('./pkg/wasm_gif_encoder.js', './lib/index.js');
