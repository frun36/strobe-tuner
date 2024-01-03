use std::f64::consts::PI;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);

    fn draw_wheel(rotation: f64, alpha: f64);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello from the strobe tuner!");
}

#[wasm_bindgen]
pub fn double_draw() {
    draw_wheel(0., 0.5);
    draw_wheel(PI / 8., 0.5);
}