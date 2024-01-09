use std::time::Duration;

use super::{tuner::Tuner, DOMHighResTimestamp};

pub struct App {
    tuner: Tuner,

}

impl App {
    pub fn new(tuner: Tuner) -> Self {
        Self {
            tuner,
        }
    }

    pub fn handle_frame(&mut self, timestamp: DOMHighResTimestamp) {
        self.tuner.calculate_wheel_positions(timestamp);
        self.tuner.draw_wheel();
    }
}