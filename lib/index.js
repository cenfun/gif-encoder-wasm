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

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

function passArray32ToWasm(arg) {
    const ptr = wasm.__wbindgen_malloc(arg.length * 4);
    getUint32Memory().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

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
* @param {number} width
* @param {number} height
* @param {number} len
* @param {Uint32Array} info_list
* @param {Uint8Array} data_list
* @returns {Uint8Array}
*/
module.exports.encode_gif = function(width, height, len, info_list, data_list) {
    const retptr = 8;
    const ret = wasm.encode_gif(retptr, width, height, len, passArray32ToWasm(info_list), WASM_VECTOR_LEN, passArray8ToWasm(data_list), WASM_VECTOR_LEN);
    const memi32 = getInt32Memory();
    const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
    wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
    return v0;
};

module.exports.__wbg_now_72e602207d8da8fd = function() {
    const ret = Date.now();
    return ret;
};

module.exports.__wbg_log_e51bb66333c66938 = function(arg0, arg1) {
    console.log(getStringFromWasm(arg0, arg1));
};
wasm = require('./index_bg');

