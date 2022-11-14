const fs = require('fs');
const path = require('path');
const UPNG = require('upng-js');
const ScreencastGIF = require('screencast-gif');
const CG = require('console-grid');

const WasmGifEncoder = require('../lib');
// console.log(WasmGifEncoder);
console.assert(WasmGifEncoder.add(123, 456) === 579, 'number add: 123 + 456 = 579');
console.assert(WasmGifEncoder.str('str1', 'str2') === 'str1str2', 'string join: str1 + str2 = str1str2');
console.log('==========================================================');

const mergeColor = function(c, b, p) {
    const v = c * p + b * (1 - p);
    return Math.round(v);
};

const getImagePixels = (image, w, h, bgColor = 0xffffff) => {

    const bgR = bgColor >> 16 & 0xff;
    const bgG = bgColor >> 8 & 0xff;
    const bgB = bgColor & 0xff;

    const l = w * h;
    // png rgba 4 => rgb 3
    const pixels = new Uint8Array(l * 3);
    let i = 0;
    let j = 0;
    while (i < l) {
        let p = i * 4;
        let r = image[p++];
        let g = image[p++];
        let b = image[p++];
        const a = image[p++];
        if (a === 0) {
            r = bgR;
            g = bgG;
            b = bgB;
        } else if (a !== 255) {
            // console.log(r, g, b, a);
            const per = a / 255;
            r = mergeColor(r, bgR, per);
            g = mergeColor(g, bgG, per);
            b = mergeColor(b, bgB, per);
            // console.log(r, g, b);
        }
        pixels[j++] = r;
        pixels[j++] = g;
        pixels[j++] = b;
        i++;
    }
    return pixels;
};

const rows = [];

const generateGif = (name) => {

    let time_start;
    const folder = path.resolve('test/example/');

    const pngFolder = path.resolve(folder, name);
    const frames = fs.readdirSync(pngFolder).map((pngName) => {
        return path.resolve(pngFolder, pngName);
    });

    if (!frames.length) {
        throw new Error(`Not found PNGs: ${pngFolder}`);
    }

    // frames.length = 2;

    const gifPath = path.resolve(folder, `${name}.gif`);
    console.log(`start to generate: ${gifPath} (${frames.length} frames) ...`);

    const fileBuffers = frames.map(function(p) {
        return fs.readFileSync(p);
    });

    const subs = [];

    // node ================================================================
    time_start = Date.now();
    const bufN = ScreencastGIF({
        frame: {
            delay: 100
        },
        frames: fileBuffers
    });
    let file = `${name}-node.gif`;
    fs.writeFileSync(path.resolve(folder, file), bufN);
    subs.push({
        name: 'node',
        duration: `${(Date.now() - time_start).toLocaleString()}ms`,
        file
    });

    // wasm ================================================================
    time_start = Date.now();
    const frameList = fileBuffers.map((fileBuf) => {
        const img = UPNG.decode(fileBuf);
        const data = getImagePixels(img.data, img.width, img.height);
        return {
            width: img.width,
            height: img.height,
            data: data
        };
    });
    const maxWidth = Math.max.apply(Math, frameList.map((frame) => frame.width));
    const maxHeight = Math.max.apply(Math, frameList.map((frame) => frame.height));
    const info_list = [];
    let totalLength = 0;
    frameList.forEach((frame) => {
        const len = frame.data.length;
        totalLength += len;
        info_list.push(len);
        info_list.push(frame.width);
        info_list.push(frame.height);
    });
    // console.log("totalLength: " + totalLength);
    const data_list = Buffer.concat(frameList.map((frame) => frame.data), totalLength);
    const bufW = WasmGifEncoder.encode_gif(maxWidth, maxHeight, frameList.length, info_list, data_list);
    file = `${name}-wasm.gif`;
    fs.writeFileSync(path.resolve(folder, file), bufW);
    subs.push({
        name: 'wasm',
        duration: `${(Date.now() - time_start).toLocaleString()}ms`,
        file
    });

    rows.push({
        name,
        duration: '',
        file: '',
        subs
    });

};

generateGif('iamgroot');
generateGif('screenshot');
// generateGif('cat');
// generateGif('photo');


CG({
    columns: [{
        id: 'name',
        name: 'Test'
    }, {
        id: 'duration',
        name: 'Duration',
        align: 'right'
    }, {
        id: 'file',
        name: 'File'
    }],
    rows
});
