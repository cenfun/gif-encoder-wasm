const fs = require('fs');
const path = require('path');
const UPNG = require('upng-js');
const ScreencastGIF = require('screencast-gif');
const CG = require('console-grid');
const EC = require('eight-colors');

const WasmGifEncoder = require('../dist/ge.js');
console.log(WasmGifEncoder);

console.log('==========================================================');

const generateGif = (item) => {
    const name = item.name;
    const inputDir = item.inputDir;
    const outputDir = item.outputDir;

    const files = fs.readdirSync(inputDir).map((png) => {
        return path.resolve(inputDir, png);
    });

    if (!files.length) {
        throw new Error(`Not found PNG files: ${inputDir}`);
    }

    // files.length = 2;
    console.log(`Generating: ${EC.cyan(name)} - ${EC.green(files.length)} frames ...`);

    const fileBuffers = files.map(function(p) {
        return fs.readFileSync(p);
    });

    const delay = 100;

    const subs = [];

    // node ================================================================
    let time_start = Date.now();
    const bufN = ScreencastGIF({
        frame: {
            delay
        },
        frames: fileBuffers
    });
    let file = `${name}-node.gif`;
    fs.writeFileSync(path.resolve(outputDir, file), bufN);
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

        // rgba
        const pixels = new Uint8Array(UPNG.toRGBA8(img)[0]);

        totalPixels.push(pixels);
        const buffer_length = pixels.length;
        // console.log(`width: ${width} height: ${height} buffer_length: ${buffer_length}`);
        console.assert(pixels.length === width * height * 4);

        totalLength += buffer_length;

        const frame = {
            width,
            height,
            buffer_length,
            delay
        };

        if (name === 'k') {
            frame.dispose = 2;
        }

        return frame;
    });

    const gifInfo = JSON.stringify({
        // repeat: 0,
        frames
    });
    // console.log(gifInfo);

    const buffer = Buffer.concat(totalPixels, totalLength);

    const bufW = WasmGifEncoder.encode(gifInfo, buffer);
    file = `${name}-wasm.gif`;

    fs.writeFileSync(path.resolve(outputDir, file), bufW);

    subs.push({
        name: 'wasm',
        duration: `${(Date.now() - time_start).toLocaleString()}ms`,
        file
    });

    return {
        name,
        duration: '',
        file: '',
        subs
    };

};


const main = () => {

    const outputDir = path.resolve(__dirname, '../example');
    const dirs = fs.readdirSync(outputDir);

    const list = dirs.map((item) => {
        const p = path.resolve(outputDir, item);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
            return {
                name: item,
                inputDir: p,
                outputDir
            };
        }
    });

    const rows = [];

    list.filter((item) => item).forEach((item) => {
        const row = generateGif(item);
        rows.push(row);
    });

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

};


main();
