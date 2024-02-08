use std::f32::consts::PI;

use crate::buffer::Buffer;
use crate::DOMHighResTimestamp;

pub struct Wheel {
    position_buffer: Buffer<f32>,
    // position: f32,
    freq: f32,
    omega: f32,
    last_timestamp_ms: DOMHighResTimestamp,
}

impl Wheel {
    pub fn new(freq: f32, motion_blur_size: usize) -> Self {
        Self {
            position_buffer: Buffer::new(motion_blur_size),
            // position: 0.,
            freq,
            omega: 2. * PI * freq,
            last_timestamp_ms: 0.,
        }
    }

    pub fn update_position(&mut self, timestamp_ms: DOMHighResTimestamp) {
        let elapsed_ms = timestamp_ms - self.last_timestamp_ms;
        if let Some(&last_position) = self.position_buffer.get_last() {
            let mut new_position = last_position + self.omega * elapsed_ms as f32 * 0.001;
            while new_position > 2. * PI {
                new_position -= 2. * PI;
            }
            self.position_buffer.insert(new_position);
            // gloo_console::log!(new_position);
        } else {
            self.position_buffer.insert(0.);
        }

        // self.position += elapsed_ms as f32 * 0.001 * self.omega;
        // while self.position > 2. * PI {
        //     self.position -= 2. * PI;
        // }

        self.last_timestamp_ms = timestamp_ms;
    }

    pub fn set_freq(&mut self, freq: f32) {
        self.freq = freq;
        self.omega = 2. * PI * freq;
    }

    pub fn get_freq(&self) -> f32 {
        self.freq
    }

    pub fn get_position_buffer(&self) -> &[f32] {
        self.position_buffer.get_contents()
    }

    // pub fn get_position(&self) -> f32 {
    //     self.position
    // }
}
