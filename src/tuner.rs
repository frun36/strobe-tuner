use crate::{wheel::Wheel, DOMHighResTimestamp};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Tuner {
    sample_rate: f32,
    wheel: Wheel,
    timestamp_ms: DOMHighResTimestamp,
}

#[wasm_bindgen]
impl Tuner {
    pub fn new(sample_rate: f32, freq: f32, motion_blur_size: usize) -> Self {
        Self {
            sample_rate,
            wheel: Wheel::new(freq, motion_blur_size),
            timestamp_ms: 0.,
        }
    }

    pub fn process_input(&mut self, input: &[f32]) {
        let new_timestamp_ms =
            self.timestamp_ms + (input.len() as f64 + 1000. / self.sample_rate as f64);

        let _ = input
            .iter()
            .enumerate()
            .filter(|(_index, sample)| (*sample).abs() > 0.99)
            .map(|(index, _sample)| {
                let curr_timestamp_ms =
                    self.timestamp_ms + index as f64 * 1000. / self.sample_rate as f64;
                self.wheel.update_position(curr_timestamp_ms);
            });
        
        self.timestamp_ms = new_timestamp_ms;
    }
}
