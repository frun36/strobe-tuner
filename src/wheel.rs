use std::f32::consts::PI;

use super::DOMHighResTimestamp;

pub struct Wheel {
    position_buffer: WheelBuffer,
    // position: f32,
    freq: f32,
    omega: f32,
    last_timestamp_ms: DOMHighResTimestamp,
}

impl Wheel {
    pub fn new(freq: f32, motion_blur_size: usize) -> Self {
        Self {
            position_buffer: WheelBuffer::new(motion_blur_size),
            // position: 0.,
            freq,
            omega: 2. * PI * freq,
            last_timestamp_ms: 0.,
        }
    }

    pub fn update_position(&mut self, timestamp_ms: DOMHighResTimestamp) {
        let elapsed_ms = timestamp_ms - self.last_timestamp_ms;
        if let Some(last_position) = self.position_buffer.get_last() {
            let mut new_position = last_position + self.omega * elapsed_ms as f32 * 0.001;
            while new_position > 2. * PI {
                new_position -= 2. * PI;
            }
            self.position_buffer.insert(new_position);
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

    pub fn get_position_buffer(&self) -> Vec<f32> {
        self.position_buffer.buff.clone()
    }

    // pub fn get_position(&self) -> f32 {
    //     self.position
    // }
}

struct WheelBuffer {
    buff: Vec<f32>,
    begin: usize,
}

impl WheelBuffer {
    fn new(capacity: usize) -> Self {
        Self {
            buff: Vec::with_capacity(capacity),
            begin: 0,
        }
    }

    fn insert(&mut self, position: f32) {
        if self.buff.len() < self.buff.capacity() {
            self.buff.push(position);
        } else {
            self.buff[self.begin] = position;
            self.begin = (self.begin + 1) % self.buff.capacity();
        }
    }

    fn get_last(&self) -> Option<f32> {
        if self.buff.is_empty() {
            None
        } else if self.begin == 0 {
            Some(self.buff[self.buff.len() - 1])
        } else {
            Some(self.buff[self.begin - 1])
        }
    }
}
