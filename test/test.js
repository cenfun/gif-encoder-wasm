const fs = require("fs");
const path = require("path");
const UPNG = require("upng-js");
const ScreencastGIF = require("screencast-gif");

const WasmGifEncoder = require("../lib");
console.log(WasmGifEncoder);
console.log("number add: " + WasmGifEncoder.add(123, 456));
console.log("string join: " + WasmGifEncoder.str("str1 ", "str2"));
console.log("==========================================================");

const mergeColor = function(c, b, p) {
    let v = c * p + b * (1 - p);
    return Math.round(v);
};

const getImagePixels = (image, w, h, bgColor = 0xffffff) => {

    let bgR = bgColor >> 16 & 0xff;
    let bgG = bgColor >> 8 & 0xff;
    let bgB = bgColor & 0xff;

    let l = w * h;
    //png rgba 4 => rgb 3
    const pixels = new Uint8Array(l * 3);
    let i = 0;
    let j = 0;
    while (i < l) {
        let p = i * 4;
        let r = image[p++];
        let g = image[p++];
        let b = image[p++];
        let a = image[p++];
        if (a === 0) {
            r = bgR;
            g = bgG;
            b = bgB;
        } else if (a !== 255) {
            // console.log(r, g, b, a);
            let p = a / 255;
            r = mergeColor(r, bgR, p);
            g = mergeColor(g, bgG, p);
            b = mergeColor(b, bgB, p);
            // console.log(r, g, b);
        }
        pixels[j++] = r;
        pixels[j++] = g;
        pixels[j++] = b;
        i++;
    }
    return pixels;
};


const generateGif = (name) => {

    let time_start;
    let folder = "test/example/" + name;
    let gifpath = folder + ".gif";
    console.log("start to generate: " + gifpath + " from png folder " + folder + " ...");
    let frames = fs.readdirSync(folder).map((pngname) => {
        return folder + "/" + pngname;
    });

    //frames.length = 2;

    let fileBufs = frames.map(function(p) {
        return fs.readFileSync(path.resolve(p));
    });

    //node ================================================================
    time_start = Date.now();
    let bufN = ScreencastGIF({
        frame: {
            delay: 500
        },
        frames: fileBufs
    });
    fs.writeFileSync(folder + "-node.gif", bufN);
    console.log("node decode cost: " + (Date.now() - time_start).toLocaleString() + "ms");

    //wasm ================================================================
    time_start = Date.now();
    let frameList = fileBufs.map(fileBuf => {
        let img = UPNG.decode(fileBuf);
        let data = getImagePixels(img.data, img.width, img.height);
        return {
            width: img.width,
            height: img.height,
            data: data
        };
    });
    let maxWidth = Math.max.apply(Math, frameList.map(frame => frame.width));
    let maxHeight = Math.max.apply(Math, frameList.map(frame => frame.height));
    let info_list = [];
    let totalLength = 0;
    frameList.forEach(frame => {
        let len = frame.data.length;
        totalLength += len;
        info_list.push(len);
        info_list.push(frame.width);
        info_list.push(frame.height);
    });
    console.log("totalLength: " + totalLength);
    let data_list = Buffer.concat(frameList.map(frame => frame.data), totalLength);
    let bufW = WasmGifEncoder.encode_gif(maxWidth, maxHeight, frameList.length, info_list, data_list);
    fs.writeFileSync(folder + "-wasm.gif", bufW);
    console.log("wasm decode cost: " + (Date.now() - time_start).toLocaleString() + "ms");

};

generateGif("screenshot");
//generateGif("elf");
//generateGif("cat");
//generateGif("photo");
