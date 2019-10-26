mod utils;

//extern crate png_decoder;
extern crate wasm_bindgen;
extern crate wee_alloc;

//use png_decoder::png::decode_no_check;
use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);

    type Date;

    #[wasm_bindgen(static_method_of = Date)]
    pub fn now() -> f64;
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
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

pub fn rgba2rgb(pixels: &[u8]) -> Vec<u8> {
    let mut rgb_pixels: Vec<u8> = Vec::new();
    for v in pixels.chunks(4) {
        rgb_pixels.extend([v[0], v[1], v[2]].iter().cloned())
    }
    return rgb_pixels;
}

pub fn frames_array2frames(width: u16, height: u16, frames_array: Vec<u8>) -> Vec<Vec<u8>> {
    let chunk_size = width as usize * height as usize * 4;
    let mut res = Vec::new();
    for v in frames_array.chunks(chunk_size) {
        res.push(rgba2rgb(v))
    }
    return res;
}

#[wasm_bindgen]
pub fn encode_gif(
    width: u16,
    height: u16,
    len: usize,
    info_list: Vec<usize>,
    data_list: Vec<u8>,
) -> Vec<u8> {
    let mut image = Vec::new();
    let time_start = Date::now();
    console_log!("wasm start: {}", time_start);
    {
        let global_palette = [0xFF, 0xFF, 0xFF, 0, 0, 0];
        let mut encoder = gif::Encoder::new(&mut image, width, height, &global_palette).unwrap();
        //encoder.set(gif::Repeat::Infinite).unwrap();

        let mut start = 0;
        let mut i = 0;
        let n = info_list.len() / len;
        while i < len {
            let p = i * n;
            let bytes_length = info_list[p];
            let w = info_list[p + 1] as u16;
            let h = info_list[p + 2] as u16;
            let end = start + bytes_length;
            //console_log!("slice start: {}  len: {} end: {}", start, bytes_length, end);
            let slice = &data_list[start..end];

            let frame = gif::Frame::from_rgb_speed(w, h, slice, 30);
            encoder.write_frame(&frame).unwrap();

            start += bytes_length;
            i += 1;
        }
    }
    let time_end = Date::now();
    let d = time_end - time_start;
    console_log!("wasm end: {} duration: {}", time_end, d);
    return image;
}

/*
#[wasm_bindgen]
pub fn decode_png(size_list: Vec<usize>, file_list: Vec<u8>) -> usize {
    //console_log!("decode png ...");

    let time_start = Date::now();
    console_log!("wasm start: {}", time_start);

    let len = size_list.len();

    //console_log!("size length: {}", len.to_string());

    //let chunk_size = width as usize * height as usize * 4;

    let mut start = 0;

    //count += size_list.len() as usize;

    //let slice = &file_list[start..3];
    //console_log!(" {} {} {}", slice[0], slice[1], slice[2]);
    //start += slice.len();

    //console_log!("file length: {}", file_list.len().to_string());

    let mut i = 0;

    while i < len {
        let item = size_list[i];
        let end = start + item;
        //console_log!("slice start: {}  len: {} end: {}", start, item, end);
        let file = &file_list[start..end];
        let png = decode_no_check(file).unwrap();
        let buf = png.data;

        // let decoder = png::Decoder::new(file);
        // let (info, mut reader) = decoder.read_info().unwrap();
        // let mut buf = vec![0; info.buffer_size()];
        // reader.next_frame(&mut buf).unwrap();

        let rgb_buf = rgba2rgb(&buf);

        start += item;
        i += 1;
    }

    let time_end = Date::now();
    let d = time_end - time_start;
    console_log!("wasm end: {} duration: {}", time_end, d);

    return start;
}

*/
