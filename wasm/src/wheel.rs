use std::f32::consts::PI;

use crate::buffer::Buffer;
use crate::DOMHighResTimestamp;

pub struct Wheel {
    position_buffer: Buffer<f32>,
    // position: f32,
    freq: f32,
    omega: f32,
    apparent_omega: f32,
    last_timestamp_ms: DOMHighResTimestamp,
    full_rotation_angle: f32,
}

impl Wheel {
    pub fn new(freq: f32, motion_blur_size: usize, full_rotation_angle: f32) -> Self {
        Self {
            position_buffer: Buffer::new(motion_blur_size),
            // position: 0.,
            freq,
            omega: 2. * PI * freq,
            apparent_omega: 0.,
            last_timestamp_ms: 0.,
            full_rotation_angle,
        }
    }

    fn omega_from_positions(&self, old: f32, new: f32, elapsed: f32) -> f32 {
        let mut old = old % self.full_rotation_angle;
        let new = new % self.full_rotation_angle;

        if old + self.apparent_omega * elapsed > self.full_rotation_angle * 1.1 {
            old -= self.full_rotation_angle;
        }

        (new - old) / elapsed
    }

    pub fn update_position(&mut self, timestamp_ms: DOMHighResTimestamp) {
        let elapsed = (timestamp_ms - self.last_timestamp_ms) as f32 * 0.001;
        if let Some(&last_position) = self.position_buffer.get_last() {
            let mut new_position = last_position + self.omega * elapsed;
            new_position %= 2. * PI;
            self.apparent_omega = 0.9 * self.apparent_omega
                + 0.1
                    * self.omega_from_positions(
                        self.position_buffer.get_last().unwrap_or(&0.).to_owned(),
                        new_position,
                        elapsed,
                    );
            self.position_buffer.insert(new_position);
        } else {
            self.position_buffer.insert(0.);
        }

        // self.position += elapsed * self.omega;
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

    pub fn get_apparent_omega(&self) -> f32 {
        self.apparent_omega
    }

    pub fn set_full_rotation_angle(&mut self, full_rotation_angle: f32) {
        self.full_rotation_angle = full_rotation_angle;
    }

    // pub fn get_position(&self) -> f32 {
    //     self.position
    // }
}
