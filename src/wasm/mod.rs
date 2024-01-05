use std::{cell::RefCell, rc::Rc, time::Duration};

use wasm_bindgen::prelude::*;
use web_sys::window;

use self::{wheel::Wheel, app::App};

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

fn request_animation_frame(callback: &Closure<dyn FnMut(f64)>) {
    if let Some(window) = window() {
        window
            .request_animation_frame(callback.as_ref().unchecked_ref())
            .unwrap();
    }
}

#[wasm_bindgen]
pub fn run() -> Result<(), JsValue> {
    let wheel = Wheel::new(0.5);
    let mut app = App::new(wheel);

    let f = Rc::new(RefCell::new(None));
    let g = f.clone();

    let mut prev_timestamp = Box::new(0.);
    let anim_callback = move |timestamp: f64| {
        let elapsed = Duration::from_secs_f64((timestamp - *prev_timestamp) * 0.001);

        app.handle_frame(elapsed);

        *prev_timestamp = timestamp;
        request_animation_frame(f.borrow().as_ref().unwrap());
    };

    *g.borrow_mut() = Some(Closure::wrap(Box::new(anim_callback)));
    request_animation_frame(g.borrow().as_ref().unwrap());

    Ok(())
}
