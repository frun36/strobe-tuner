use std::f32::consts::PI;

pub struct Wheel {
    pub position: f32,
    freq: f32,
    omega: f32,
}

impl Wheel {
    pub fn new(freq: f32) -> Self {
        Self {
            position: 0.,
            freq,
            omega: 2. * PI * freq,
        }
    }

    fn draw_with_position(&self, position: f32) {
        super::draw_wheel(position, 0.1);
    }

    pub fn update_position(&mut self, time_ms: f32) {
        self.position += self.omega * time_ms * 0.001;
    }

    pub fn draw(&self) {
        super::clear();
        self.draw_with_position(self.position);
    }

    pub fn get_freq(&self) -> f32 {
        self.freq
    }

    pub fn set_freq(&mut self, freq: f32) {
        self.freq = freq;
        self.omega = 360. * freq;
    }
}
