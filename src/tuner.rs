use crate::{wheel::Wheel, DOMHighResTimestamp};

use wasm_bindgen::prelude::*;
use web_sys::js_sys::Array;

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
        // console::log_1(&format!("Rust code got: {:?}", input).into());

        // gloo_console::log!(input
        //     .iter()
        //     .map(|position| JsValue::from(*position))
        //     .collect::<Array>());

        // let bright_points: Vec<_> = input
        //     .iter()
        //     .enumerate()
        //     .filter(|(_index, sample)| {
        //         // console::log_1(&format!("Unfiltered: {index} {sample}").into());
        //         (**sample).abs() > 0.99
        //     })
        //     .map(|(index, _sample)| {
        //         self.timestamp_ms + index as f64 * 1000. / self.sample_rate
        //     })
        //     .collect();

        // console::log_1(&format!("Bright points: {:?}", bright_points).into());
        // for curr_timestamp_ms in bright_points {
        //     self.wheel.update_position(curr_timestamp_ms);
        // }

        for (index, sample) in input.iter().enumerate().rev() {
            if sample.abs() > 0.99 {
                self.wheel
                    .update_position(self.timestamp_ms + index as f64 * 1000. / self.sample_rate);
                break;
            }
        }

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
