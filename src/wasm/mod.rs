use std::{cell::RefCell, rc::Rc, time::Duration};

use wasm_bindgen::prelude::*;
use web_sys::window;

extern crate console_error_panic_hook;
use std::panic;

use self::{app::App, tuner::Tuner, wheel::Wheel};

mod app;
mod tuner;
mod wheel;

type DOMHighResTimestamp = f64;

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

fn request_animation_frame(callback: &Closure<dyn FnMut(f64)>) {
    if let Some(window) = window() {
        window
            .request_animation_frame(callback.as_ref().unchecked_ref())
            .unwrap();
    }
}

#[wasm_bindgen]
pub fn run() -> Result<(), JsValue> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    let wheel = Wheel::new(55.);
    let tuner = Tuner::new(512, 44100, wheel, 0.999, 219.9);
    let mut app = App::new(tuner);

    let f = Rc::new(RefCell::new(None));
    let g = f.clone();

    let anim_callback = move |timestamp: DOMHighResTimestamp| {
        app.handle_frame(timestamp);
        request_animation_frame(f.borrow().as_ref().unwrap());
    };

    *g.borrow_mut() = Some(Closure::wrap(Box::new(anim_callback)));
    request_animation_frame(g.borrow().as_ref().unwrap());

    Ok(())
}
