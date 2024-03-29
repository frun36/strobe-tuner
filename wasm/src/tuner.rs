use std::f32::consts::PI;

use crate::{analyser::Analyser, wheel::Wheel, DOMHighResTimestamp};

use biquad::{Biquad, Coefficients, DirectForm1, ToHertz, Type};

use wasm_bindgen::prelude::*;
use web_sys::js_sys::{Array, Float32Array};

use itertools::Itertools;

#[wasm_bindgen]
pub struct Tuner {
    sample_rate: f64,
    wheel: Wheel,
    input_analyser: Analyser,
    timestamp_ms: DOMHighResTimestamp,
    filter: DirectForm1<f32>,
    filter_on: bool,
    filter_octave: usize,
    output_analyser: Analyser,
}

#[wasm_bindgen]
impl Tuner {
    pub fn new(
        sample_rate: f64,
        freq: f32,
        motion_blur_size: usize,
        filter_on: bool,
        filter_octave: usize,
        filter_q: f32,
    ) -> Self {
        let coeffs = Coefficients::<f32>::from_params(
            Type::BandPass,
            (sample_rate as f32).hz(),
            (freq * f32::powi(2., filter_octave as i32 - 1)).hz(),
            filter_q,
        )
        .expect("Invalid filter parameters");

        let biquad = DirectForm1::<f32>::new(coeffs);

        gloo_console::log!("Creating tuner with params: ", sample_rate, freq, motion_blur_size, filter_on, filter_octave, filter_q);

        Self {
            sample_rate,
            wheel: Wheel::new(
                freq,
                motion_blur_size,
                PI * 2.0_f32.powi(-(filter_octave as i32 - 1)),
            ),
            input_analyser: Analyser::new(sample_rate, 2048, true),
            timestamp_ms: 0.,
            filter: biquad,
            filter_on,
            filter_octave,
            output_analyser: Analyser::new(sample_rate, 2048, true),
        }
    }

    pub fn process_input(&mut self, input: &[f32]) -> JsValue {
        // gloo_console::log!(input
        //     .iter()
        //     .map(|position| JsValue::from(*position))
        //     .collect::<Array>());

        self.input_analyser.update_buffer(input);

        let mut input = Vec::from(input);
        if self.filter_on {
            input = input.iter().map(|&x| self.filter.run(x)).collect();
        }

        // Find places where the wave changes sign
        let bright_points: Vec<_> = input
            .iter()
            .enumerate()
            .tuple_windows::<(_, _)>()
            .filter(|((_, &sample), (_, &next_sample))| sample * next_sample <= 0.)
            .map(|((index, _), _)| {
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

        self.output_analyser.update_buffer(&input);

        JsValue::from(
            input
                .iter()
                .map(|&sample| JsValue::from(sample))
                .collect::<Array>(),
        )
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

    pub fn get_apparent_omega(&self) -> f32 {
        self.wheel.get_apparent_omega()
    }

    pub fn get_last_pitch(&self) -> f32 {
        self.input_analyser.get_last_pitch().unwrap_or(0.)
    }

    pub fn update_params(
        &mut self,
        wheel_frequency: f32,
        filter_on: bool,
        filter_octave: usize,
        filter_q: f32,
    ) {
        self.wheel.set_freq(wheel_frequency);
        self.wheel
            .set_full_rotation_angle(PI * 2.0_f32.powi(-(filter_octave as i32 - 1)));
        self.filter_octave = filter_octave;
        self.filter_on = filter_on;

        let coeffs = Coefficients::<f32>::from_params(
            Type::BandPass,
            (self.sample_rate as f32).hz(),
            (wheel_frequency * f32::powi(2., filter_octave as i32 - 1)).hz(),
            filter_q,
        )
        .expect("Invalid filter parameters");

        self.filter.replace_coefficients(coeffs);
    }

    pub fn get_input_buffer(&mut self) -> Float32Array {
        JsValue::from(
            self.input_analyser
                .get_buffer()
                .iter()
                .map(|&sample| JsValue::from(sample))
                .collect::<Array>(),
        )
        .into()
    }

    pub fn get_output_buffer(&mut self) -> Float32Array {
        JsValue::from(
            self.output_analyser
                .get_buffer()
                .iter()
                .map(|&sample| JsValue::from(sample))
                .collect::<Array>(),
        )
        .into()
    }
}
