use std::panic;

use wasm_bindgen::prelude::*;

mod analyser;
mod buffer;
mod tuner;
mod wheel;

type DOMHighResTimestamp = f64;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn set_panic_hook() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}
