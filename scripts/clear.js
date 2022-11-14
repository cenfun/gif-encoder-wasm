const fs = require('fs');
// fs.copyFileSync('./pkg/wasm_gif_encoder_bg.wasm', './lib/wasm_gif_encoder_bg.wasm');
// fs.copyFileSync('./pkg/wasm_gif_encoder_bg.js', './lib/wasm_gif_encoder_bg.js');
// fs.copyFileSync('./pkg/wasm_gif_encoder.js', './lib/wasm_gif_encoder.js');
// fs.writeFileSync('./lib/index.js', 'module.exports = require("./wasm_gif_encoder.js");');

fs.unlinkSync('./lib/.gitignore');
fs.unlinkSync('./lib/LICENSE');
fs.unlinkSync('./lib/package.json');
fs.unlinkSync('./lib/README.md');

fs.unlinkSync('./lib/index_bg.wasm.d.ts');
fs.unlinkSync('./lib/index.d.ts');
