extern crate console_error_panic_hook;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FrameInfo {
    pub width: u16,
    pub height: u16,
    pub delay: u16,
    pub buffer_length: usize,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GifInfo {
    pub repeat: u16,
    pub frames: Vec<FrameInfo>,
}

fn get_max_width(frames: &Vec<FrameInfo>) -> u16 {
    let mut v = 0;
    for frame in frames.iter() {
        if frame.width > v {
            v = frame.width;
        }
    }
    v
}

fn get_max_height(frames: &Vec<FrameInfo>) -> u16 {
    let mut v = 0;
    for frame in frames.iter() {
        if frame.width > v {
            v = frame.height;
        }
    }
    v
}

#[wasm_bindgen]
pub fn encode(json: &str, buffer: Vec<u8>) -> Vec<u8> {
    console_error_panic_hook::set_once();

    let time_start = js_sys::Date::now();

    //let gif_info: GifInfo = serde_wasm_bindgen::from_value(json).unwrap();

    let gif_info: GifInfo = serde_json::from_str(json).unwrap();
    // console_log!("gif info: {:?}", gif_info);

    let mut image = Vec::new();

    let repeat = gif_info.repeat;
    // console_log!("gif repeat: {}", repeat);

    let frames = gif_info.frames;
    // init max width and height
    let width = get_max_width(&frames);
    let height = get_max_height(&frames);
    // console_log!("gif width: {} height: {}", width, height);

    let global_palette = [0xFF, 0xFF, 0xFF, 0, 0, 0];
    let mut encoder = gif::Encoder::new(&mut image, width, height, &global_palette).unwrap();

    // 0 for Infinite
    if repeat == 0 {
        encoder.set_repeat(gif::Repeat::Infinite).unwrap();
    } else {
        encoder.set_repeat(gif::Repeat::Finite(repeat - 1)).unwrap();
    }

    let mut start = 0;

    for frame_info in frames.iter() {
        let w = frame_info.width;
        let h = frame_info.height;
        let buffer_length = frame_info.buffer_length;

        // console_log!(
        //     "frame width: {} height: {} length: {}",
        //     width,
        //     height,
        //     buffer_length
        // );

        let end = start + buffer_length;
        let input = &buffer[start..end];
        let pixels = &mut input.to_owned();

        start = end;

        // speed = 1..30
        let speed = 30;

        let mut frame = gif::Frame::from_rgba_speed(w, h, pixels, speed);
        // `delay` is given in units of 10 ms.
        frame.delay = frame_info.delay / 10;
        encoder.write_frame(&frame).unwrap();
    }

    let result = encoder.get_ref().to_vec();

    console_log!("wasm duration: {}", js_sys::Date::now() - time_start);

    result
}
