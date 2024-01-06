use std::time::Duration;

use super::wheel::Wheel;

pub struct Tuner {
    subframes: usize,
    sample_rate: u16,
    wheel: Wheel,
    thresh: f32,
}

impl Tuner {
    pub fn new(subframes: usize, sample_rate: u16, wheel: Wheel, thresh: f32) -> Self {
        Self {
            subframes,
            sample_rate,
            wheel,
            thresh,
        }
    }

    pub fn update_position(&mut self, elapsed: Duration) {
        self.wheel.update_position(elapsed);
    }

    pub fn draw_wheel(&self) {
        self.wheel.draw();
    }
}
