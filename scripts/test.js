const fs = require('fs');
const path = require('path');
const UPNG = require('upng-js');
const ScreencastGIF = require('screencast-gif');
const CG = require('console-grid');
const EC = require('eight-colors');

const WasmGifEncoder = require('../lib');
console.log(WasmGifEncoder);

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
    const folder = path.resolve('example');

    const pngFolder = path.resolve(folder, name);
    const files = fs.readdirSync(pngFolder).map((pngName) => {
        return path.resolve(pngFolder, pngName);
    });

    if (!files.length) {
        throw new Error(`Not found PNGs: ${pngFolder}`);
    }

    // files.length = 2;
    console.log(`generating: ${EC.cyan(name)} - ${EC.green(files.length)} frames ...`);

    const fileBuffers = files.map(function(p) {
        return fs.readFileSync(p);
    });

    const delay = 100;

    const subs = [];

    // node ================================================================
    time_start = Date.now();
    const bufN = ScreencastGIF({
        loop: 0,
        frame: {
            delay
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

    const totalPixels = [];
    let totalLength = 0;
    const frames = fileBuffers.map((fileBuf) => {
        const img = UPNG.decode(fileBuf);
        const pixels = getImagePixels(img.data, img.width, img.height);
        totalPixels.push(pixels);
        const buffer_length = pixels.length;
        totalLength += buffer_length;
        return {
            width: img.width,
            height: img.height,
            delay,
            buffer_length
        };
    });

    const gifInfo = {
        repeat: 0,
        frames
    };
    // console.log(gifInfo);

    const buffer = Buffer.concat(totalPixels, totalLength);

    const bufW = WasmGifEncoder.encode(gifInfo, buffer);
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
