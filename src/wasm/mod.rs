use std::f32::consts::PI;

use wasm_bindgen::prelude::*;

use self::wheel::Wheel;

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

#[wasm_bindgen]
pub fn double_draw() {
    let mut wheel = Wheel::new(1.);
    for i in 0..1000 {
        wheel.position += PI / 256.;
        wheel.draw();
    }
//     wheel.draw();
//     wheel.position = PI / 16.;
//     wheel.draw();
}