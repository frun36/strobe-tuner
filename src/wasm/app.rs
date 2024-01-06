use std::time::Duration;

use super::{tuner::Tuner};

pub struct App {
    tuner: Tuner,

}

impl App {
    pub fn new(tuner: Tuner) -> Self {
        Self {
            tuner,
        }
    }

    pub fn handle_frame(&mut self, elapsed: Duration) {
        self.tuner.calculate_wheel_positions(elapsed);
        self.tuner.draw_wheel();
    }
}