use std::{cell::RefCell, rc::Rc};

use wasm_bindgen::prelude::*;
use web_sys::{console, window};

use self::wheel::Wheel;

mod app;
mod wheel;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen(module = "/render.js")]
extern "C" {
    fn draw_wheel(rotation: f32, alpha: f32);

    fn clear();
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello from the strobe tuner!");
}

// fn window() -> web_sys::Window {
//     web_sys::window().expect("No global window exists")
// }

fn request_animation_frame(callback: &Closure<dyn FnMut(f64)>) {
    if let Some(window) = window() {
        window
            .request_animation_frame(callback.as_ref().unchecked_ref())
            .unwrap();
    }
}

#[wasm_bindgen]
pub fn run() -> Result<(), JsValue> {
    // let window = web_sys::window().expect("No global window exists");
    // let document = window.document().expect("No document on window");

    let mut wheel = Wheel::new(0.5);

    // let canvas = document.get_element_by_id("canvas").expect("No canvas found");

    // let canvas: web_sys::HtmlCanvasElement = canvas
    //     .dyn_into::<web_sys::HtmlCanvasElement>()
    //     .map_err(|_| ())
    //     .unwrap();

    // let context = canvas
    //     .get_context("2d")
    //     .unwrap()
    //     .unwrap()
    //     .dyn_into::<web_sys::CanvasRenderingContext2d>()
    //     .unwrap();

    let f = Rc::new(RefCell::new(None));
    let g = f.clone();

    let mut prev_timestamp = Box::new(0.);

    let anim_callback = move |timestamp: f64| {
        console::log_1(&format!("Timestamp: {}", timestamp).into());
        wheel.update_position((timestamp - *prev_timestamp) as f32);
        wheel.draw();

        *prev_timestamp = timestamp;
        request_animation_frame(f.borrow().as_ref().unwrap());
    };


    *g.borrow_mut() = Some(Closure::wrap(Box::new(anim_callback)));
    request_animation_frame(g.borrow().as_ref().unwrap());

    // request_animation_frame();

    Ok(())
}
