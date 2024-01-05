use std::time::Duration;

use super::wheel::Wheel;

pub struct App {
    wheel: Wheel,

}

impl App {
    pub fn new(wheel: Wheel) -> Self {
        Self {
            wheel,
        }
    }

    pub fn handle_frame(&mut self, elapsed: Duration) {
        self.wheel.update_position(elapsed);
        self.wheel.draw();
    }
}