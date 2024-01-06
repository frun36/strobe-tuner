use std::{f32::consts::PI, time::Duration};

use super::wheel::Wheel;

pub struct Tuner {
    subframes: usize,
    sample_rate: u16,
    wheel: Wheel,
    thresh: f32,
    wave: Vec<f32>,
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
    vec
}

impl Tuner {
    pub fn new(subframes: usize, sample_rate: u16, wheel: Wheel, thresh: f32) -> Self {
        Self {
            subframes,
            sample_rate,
            wheel,
            thresh,
            wave: generate_wave(sample_rate, 220., Duration::from_millis(10000)),
            last_index: 0,
            subframe_buffer: SubframeBuffer::new(32, thresh),
        }
    }

    pub fn calculate_wheel_positions(&mut self, elapsed: Duration) {
        self.subframe_buffer.clear();
        let new_index =
            self.last_index + (elapsed.as_secs_f32() * self.sample_rate as f32) as usize;

        let jump = (new_index - self.last_index) / self.subframes;

        let mut last_subframe_index = self.last_index;
        for i in 0..self.subframes {
            let subframe_index = self.last_index + jump * (i + 1);
            let curr_subframe = Subframe::new(self.wave[subframe_index].abs(), subframe_index);

            if self.subframe_buffer.insert(curr_subframe) {
                let curr_elapsed =
                    Duration::from_secs_f32((subframe_index - last_subframe_index) as f32 / self.sample_rate as f32);
                self.wheel.update_position(curr_elapsed);
            }

            last_subframe_index = subframe_index;
        }

        // self.wheel.update_position(elapsed);
        self.last_index = new_index;
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
