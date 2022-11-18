extern crate console_error_panic_hook;

use gif::{DisposalMethod, Encoder, Frame, Repeat};
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
    pub buffer_length: usize,
    pub delay: Option<u16>,
    pub dispose: Option<u8>,
    pub transparent: Option<u8>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GifInfo {
    pub frames: Vec<FrameInfo>,
    pub repeat: Option<u16>,
    pub palette: Option<[u8; 6]>,
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

fn get_repeat(repeat: Option<u16>) -> Repeat {
    // console_log!("gif repeat: {}", repeat);
    if let Some(v) = repeat {
        Repeat::Finite(v - 1)
    } else {
        Repeat::Infinite
    }
}

// `delay` is given in units of 10 ms.
fn get_delay(frame_info: &FrameInfo) -> u16 {
    if let Some(v) = frame_info.delay {
        v / 10
    } else {
        // default 100ms / 10 = 10
        10
    }
}

fn get_dispose(frame_info: &FrameInfo) -> DisposalMethod {
    if let Some(v) = frame_info.dispose {
        if let Some(d) = DisposalMethod::from_u8(v) {
            return d;
        }
    }
    DisposalMethod::Background
}

#[wasm_bindgen]
pub fn encode(json: &str, buffer: Vec<u8>) -> Vec<u8> {
    console_error_panic_hook::set_once();

    let time_start = js_sys::Date::now();

    //let gif_info: GifInfo = serde_wasm_bindgen::from_value(json).unwrap();

    let gif_info: GifInfo = serde_json::from_str(json).unwrap();
    // console_log!("gif info: {:?}", gif_info);

    let mut image = Vec::new();

    let frames = gif_info.frames;
    // init max width and height
    let width = get_max_width(&frames);
    let height = get_max_height(&frames);
    // console_log!("gif width: {} height: {}", width, height);

    let global_palette = [0xFF, 0xFF, 0xFF, 0, 0, 0];
    let mut encoder = Encoder::new(&mut image, width, height, &global_palette).unwrap();

    encoder.set_repeat(get_repeat(gif_info.repeat)).unwrap();

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
        let speed = 10;

        let mut frame = Frame::from_rgba_speed(w, h, pixels, speed);

        frame.delay = get_delay(&frame_info);

        frame.dispose = get_dispose(&frame_info);
        frame.transparent = frame_info.transparent;

        encoder.write_frame(&frame).unwrap();
    }

    let result = encoder.get_ref().to_vec();

    console_log!("wasm duration: {}", js_sys::Date::now() - time_start);

    result
}
