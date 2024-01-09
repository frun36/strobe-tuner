use std::{f32::consts::PI, time::Duration};

use web_sys::console::time;

use super::{wheel::Wheel, DOMHighResTimestamp};

pub struct Tuner {
    subframes: usize,
    sample_rate: u16,
    wheel: Wheel,
    thresh: f32,
    wave: Vec<f32>,
    last_timestamp: DOMHighResTimestamp,
    last_index: usize,
    subframe_buffer: SubframeBuffer,
}

// temporary testing function
pub fn generate_wave(sample_rate: u16, freq: f32, length: Duration) -> Vec<f32> {
    let vec_len = (sample_rate as f32 * length.as_secs_f32()) as usize;
    let mut vec = Vec::new();
    for i in 0..vec_len {
        let value = f32::sin(2. * PI * freq * i as f32 / sample_rate as f32);
        vec.push(value);
    }
    // web_sys::console::log_1(&format!("{:?}", vec).into());
    vec
}

impl Tuner {
    pub fn new(
        subframes: usize,
        sample_rate: u16,
        wheel: Wheel,
        thresh: f32,
        wave_freq: f32,
    ) -> Self {
        Self {
            subframes,
            sample_rate,
            wheel,
            thresh,
            wave: generate_wave(sample_rate, wave_freq, Duration::from_millis(10000)),
            last_timestamp: 0.,
            last_index: 0,
            subframe_buffer: SubframeBuffer::new(32, thresh),
        }
    }

    pub fn calculate_wheel_positions(&mut self, timestamp: DOMHighResTimestamp) {
        self.subframe_buffer.clear();

        let elapsed = timestamp - self.last_timestamp;

        let jump = (0.001 * elapsed / self.subframes as f64) * self.sample_rate as f64;

        let mut curr_index = 0;
        for i in 1..=self.subframes {
            curr_index = self.last_index + (i as f64 * jump) as usize;

            if self
                .subframe_buffer
                .insert(Subframe::new(self.wave[curr_index].abs(), curr_index))
            {
                let wheel_timestamp = timestamp + elapsed * (i as f64 / self.subframes as f64);
                self.wheel.update_position(wheel_timestamp);
            }
        }

        self.last_index = curr_index;
        self.last_timestamp = timestamp;
    }

    pub fn draw_wheel(&self) {
        self.wheel.draw();
    }
}

#[derive(Clone, Copy, Debug)]
struct Subframe {
    level: f32,
    index: usize,
}

impl Subframe {
    fn new(level: f32, index: usize) -> Self {
        Self { level, index }
    }
}

struct SubframeBuffer {
    buff: Vec<Subframe>,
    begin: usize,
    thresh: f32,
}

impl SubframeBuffer {
    fn new(capacity: usize, thresh: f32) -> Self {
        Self {
            buff: Vec::with_capacity(capacity),
            begin: 0,
            thresh,
        }
    }

    fn insert(&mut self, subframe: Subframe) -> bool {
        if self.buff.len() < self.buff.capacity() {
            self.buff.push(subframe);
        } else {
            self.buff[self.begin] = subframe;
            self.begin = (self.begin + 1) % self.buff.capacity();
        }
        subframe.level > self.thresh
    }

    fn clear(&mut self) {
        self.buff.clear();
        self.begin = 0;
    }
}
