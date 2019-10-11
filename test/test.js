const fs = require("fs");
const WasmGifEncoder = require("../lib");

console.log(WasmGifEncoder.add(123, 456));

console.log(WasmGifEncoder.str("str1", "str2"));

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


const generateGif = (name) => {
    let time_start = Date.now();
    let folder = "test/example/" + name;
    let gifpath = folder + ".gif";
    console.log("start to generate: " + gifpath + " from png folder " + folder + " ...");
    let frames = fs.readdirSync(folder).map((pngname) => {
        return folder + "/" + pngname;
    });

    let list = frames.map((p) => {
        //fs.readFileSync(p)

        let buf = WasmGifEncoder.decoder_png(p);
        return buf;
    });

    console.log("total frames: " + list.length);

    console.log("generated and cost " + (Date.now() - time_start).toLocaleString() + "ms: " + gifpath);
};

generateGif("screenshot");
//generateGif("elf");
//generateGif("cat");
//generateGif("photo");
