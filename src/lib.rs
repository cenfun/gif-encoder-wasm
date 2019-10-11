mod utils;

extern crate cfg_if;
extern crate gif;
extern crate wasm_bindgen;

use cfg_if::cfg_if;

// use std::error::Error;
// use std::fs::File;
// use std::path::Path;

use wasm_bindgen::prelude::*;

cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

#[wasm_bindgen]
pub fn str(str1: String, str2: String) -> String {
    let mut s = String::new();
    s.push_str(&str1);
    s.push_str(&str2);
    return s;
}

#[wasm_bindgen]
pub fn rgba2rgb(pixels: &[u8]) -> Vec<u8> {
    let mut rgb_pixels: Vec<u8> = Vec::new();
    for v in pixels.chunks(4) {
        rgb_pixels.extend([v[0], v[1], v[2]].iter().cloned())
    }
    rgb_pixels
}

pub fn frames_array2frames(width: u16, height: u16, frames_array: Vec<u8>) -> Vec<Vec<u8>> {
    let chunk_size = width as usize * height as usize * 4;

    let mut res = Vec::new();
    for v in frames_array.chunks(chunk_size) {
        res.push(rgba2rgb(v))
    }
    res
}

#[wasm_bindgen]
pub fn encode_gif(width: u16, height: u16, frames_array: Vec<u8>) -> Vec<u8> {
    let mut image = Vec::new();
    {
        let mut encoder = gif::Encoder::new(&mut image, width, height, &[]).unwrap();
        for frame in frames_array2frames(width, height, frames_array) {
            let _frame = gif::Frame::from_rgb(width, height, &frame);
            encoder.write_frame(&_frame).unwrap();
        }
    }
    return image;
}

#[wasm_bindgen]
pub fn decode_png(file: Vec<u8>) -> Vec<u8> {
    // let path = Path::new("./job-1-1-drag-985.png");
    // let display = path.display();

    // let mut file = match File::open(&path) {
    //     // The `description` method of `io::Error` returns a string that
    //     // describes the error
    //     Err(why) => panic!("couldn't open {}: {}", display, why.description()),
    //     Ok(file) => file,
    // };

    // let image = File::open(&path).unwrap();
    //let decoder = png::Decoder::new(file);
    // let (info, mut reader) = decoder.read_info().unwrap();
    // // Allocate the output buffer.
    // let mut buf = vec![0; info.buffer_size()];
    // // Read the next frame. Currently this function should only called once.
    // // The default options
    // reader.next_frame(&mut buf).unwrap();

    // let list = Vec::new();
    // list.push(file);

    return file;
}
