let wasm;
const { TextDecoder } = require(String.raw`util`);

/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
module.exports.add = function(a, b) {
    const ret = wasm.add(a, b);
    return ret;
};

let WASM_VECTOR_LEN = 0;

let cachegetNodeBufferMemory = null;
function getNodeBufferMemory() {
    if (cachegetNodeBufferMemory === null || cachegetNodeBufferMemory.buffer !== wasm.memory.buffer) {
        cachegetNodeBufferMemory = Buffer.from(wasm.memory.buffer);
    }
    return cachegetNodeBufferMemory;
}

function passStringToWasm(arg) {

    const len = Buffer.byteLength(arg);
    const ptr = wasm.__wbindgen_malloc(len);
    getNodeBufferMemory().write(arg, ptr, len);
    WASM_VECTOR_LEN = len;
    return ptr;
}

let cachegetInt32Memory = null;
function getInt32Memory() {
    if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}
/**
* @param {string} str1
* @param {string} str2
* @returns {string}
*/
module.exports.str = function(str1, str2) {
    const retptr = 8;
    const ret = wasm.str(retptr, passStringToWasm(str1), WASM_VECTOR_LEN, passStringToWasm(str2), WASM_VECTOR_LEN);
    const memi32 = getInt32Memory();
    const v0 = getStringFromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
    wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
    return v0;
};

function passArray8ToWasm(arg) {
    const ptr = wasm.__wbindgen_malloc(arg.length * 1);
    getUint8Memory().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm(ptr, len) {
    return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Uint8Array} pixels
* @returns {Uint8Array}
*/
module.exports.rgba2rgb = function(pixels) {
    const retptr = 8;
    const ret = wasm.rgba2rgb(retptr, passArray8ToWasm(pixels), WASM_VECTOR_LEN);
    const memi32 = getInt32Memory();
    const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
    wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
    return v0;
};

/**
* @param {number} width
* @param {number} height
* @param {Uint8Array} frames_array
* @returns {Uint8Array}
*/
module.exports.encode_gif = function(width, height, frames_array) {
    const retptr = 8;
    const ret = wasm.encode_gif(retptr, width, height, passArray8ToWasm(frames_array), WASM_VECTOR_LEN);
    const memi32 = getInt32Memory();
    const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
    wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
    return v0;
};

/**
* @param {Uint8Array} file
* @returns {Uint8Array}
*/
module.exports.decode_png = function(file) {
    const retptr = 8;
    const ret = wasm.decode_png(retptr, passArray8ToWasm(file), WASM_VECTOR_LEN);
    const memi32 = getInt32Memory();
    const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
    wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
    return v0;
};

wasm = require('./wasm_gif_encoder_bg');

