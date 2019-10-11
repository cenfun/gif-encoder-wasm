
const path = require('path').join(__dirname, 'wasm_gif_encoder_bg.wasm');
const bytes = require('fs').readFileSync(path);
let imports = {};

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
module.exports = wasmInstance.exports;
