const fs = require('fs');
const path = require('path');
const UPNG = require('upng-js');
const ScreencastGIF = require('screencast-gif');
const CG = require('console-grid');
const EC = require('eight-colors');

const WasmGifEncoder = require('../lib');
console.log(WasmGifEncoder);

console.log('==========================================================');

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
        const width = img.width;
        const height = img.height;
        // rgb
        // const pixels = getImagePixels(img.data, img.width, img.height);

        // rgba
        const pixels = new Uint8Array(UPNG.toRGBA8(img)[0]);

        // console.log(pixels);
        // debugger;

        totalPixels.push(pixels);
        const buffer_length = pixels.length;
        // console.log(`width: ${width} height: ${height} buffer_length: ${buffer_length}`);

        console.assert(pixels.length === width * height * 4);

        totalLength += buffer_length;

        return {
            width,
            height,
            delay,
            buffer_length
        };
    });

    const gifInfo = JSON.stringify({
        repeat: 0,
        frames
    });
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

generateGif('elf');
generateGif('iamgroot');
generateGif('screenshot');

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
