use std::{f32::consts::PI, time::Duration};

pub struct Wheel {
    position_buffer: WheelBuffer,
    position: f32,
    freq: f32,
    omega: f32,
}

impl Wheel {
    pub fn new(freq: f32) -> Self {
        Self {
            position_buffer: WheelBuffer::new(4),
            position: 0.,
            freq,
            omega: 2. * PI * freq,
        }
    }

    fn draw_with_position(&self, position: f32) {
        super::draw_wheel(position, 0.3);
    }

    pub fn update_position(&mut self, elapsed: Duration) {
        if let Some(last_position) = self.position_buffer.get_last() {
            let mut new_position = last_position + self.omega * elapsed.as_secs_f32();
            while new_position > 2. * PI {
                new_position -= 2. * PI;
            }
            self.position_buffer.insert(new_position);
        } else {
            self.position_buffer.insert(0.);
        }

        // self.position += elapsed.as_secs_f32() * self.omega;
        // while self.position > 2. * PI {
        //     self.position -= 2. * PI;
        // }
    }

    pub fn draw(&self) {
        super::clear();
        for position in &self.position_buffer.buff {
            self.draw_with_position(*position);
        }
        // self.draw_with_position(self.position);
    }
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
