use crate::{wheel::Wheel, DOMHighResTimestamp};

use wasm_bindgen::prelude::*;
use web_sys::js_sys::Array;

use itertools::Itertools;

#[wasm_bindgen]
pub struct Tuner {
    sample_rate: f64,
    wheel: Wheel,
    timestamp_ms: DOMHighResTimestamp,
}

#[wasm_bindgen]
impl Tuner {
    pub fn new(sample_rate: f64, freq: f32, motion_blur_size: usize) -> Self {
        Self {
            sample_rate,
            wheel: Wheel::new(freq, motion_blur_size),
            timestamp_ms: 0.,
        }
    }

    pub fn process_input(&mut self, input: &[f32]) {
        // gloo_console::log!(input
        //     .iter()
        //     .map(|position| JsValue::from(*position))
        //     .collect::<Array>());

        // gloo_console::log!(input.iter().copied().fold(f32::NEG_INFINITY, f32::max));

        // Find places where the wave changes sign
        let bright_points: Vec<_> = input
            .iter()
            .enumerate()
            .tuple_windows::<(_, _)>()
            .filter(|((_, &sample),( _, &next_sample))| {
                sample * next_sample <= 0.
            })
            .map(|((index, _) , _)| {
                self.timestamp_ms + (index as f64 + 0.5) * 1000. / self.sample_rate
            })
            .collect();

        for curr_timestamp_ms in bright_points {
            self.wheel.update_position(curr_timestamp_ms);
        }

        // // Find maximum in sample
        // if let Some((index, _)) = input
        //     .iter()
        //     .enumerate()
        //     .max_by(|(_, a), (_, b)| a.abs().total_cmp(&b.abs()))
        // {
        //     self.wheel
        //         .update_position(self.timestamp_ms + index as f64 * 1000. / self.sample_rate);
        // }

        self.timestamp_ms += input.len() as f64 * 1000. / self.sample_rate;
    }

    pub fn set_wheel_freq(&mut self, freq: f32) {
        self.wheel.set_freq(freq);
    }

    pub fn get_wheel_freq(&self) -> f32 {
        self.wheel.get_freq()
    }

    pub fn get_positions(&self) -> JsValue {
        // console::log_1(
        //     &format!(
        //         "Wheel buffer on Rust side: {:?}",
        //         self.wheel.get_position_buffer()
        //     )
        //     .into(),
        // );
        JsValue::from(
            self.wheel
                .get_position_buffer()
                .iter()
                .map(|position| JsValue::from(*position))
                .collect::<Array>(),
        )
    }
}
