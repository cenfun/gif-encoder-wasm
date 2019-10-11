const fs = require("fs");
const path = require("path");
const UPNG = require("upng-js");

const WasmGifEncoder = require("../lib");
console.log(WasmGifEncoder);

console.log("number add: " + WasmGifEncoder.add(123, 456));

console.log("string join: " + WasmGifEncoder.str("str1 ", "str2"));

// let rgbs = GifEncoder.rgba2rgb([128, 128, 128, 0, 128, 128, 128, 128]);
// console.log(rgbs);

const getImagePixels = (image, w, h) => {
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
        pixels[j++] = r;
        pixels[j++] = g;
        pixels[j++] = b;
        i++;
    }
    return pixels;
};

const node_decode_png = function(file) {
    let img = UPNG.decode(file);
    let pixels = getImagePixels(img.data, img.width, img.height);
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

    //frames.length = 3;

    time_start = Date.now();
    frames.forEach((p) => {
        let file = fs.readFileSync(path.resolve(p));
        let bufW = WasmGifEncoder.decode_png(file);
        console.log(bufW.length);
    });
    console.log("wasm png decode cost: " + (Date.now() - time_start).toLocaleString() + "ms");

    time_start = Date.now();
    frames.forEach((p) => {
        let file = fs.readFileSync(path.resolve(p));
        let bufN = node_decode_png(file);
        console.log(bufN.length);
    });
    console.log("node png decode cost: " + (Date.now() - time_start).toLocaleString() + "ms");

    // let list = frames.map((p) => {
    //     //fs.readFileSync(p)

    //     let buf = WasmGifEncoder.decode_png(path.resolve(p));

    //     console.log(buf);

    //     return buf;
    // });

    //console.log("total frames: " + list.length);


};

generateGif("screenshot");
generateGif("elf");
//generateGif("cat");
//generateGif("photo");
