use std::time::Instant;

use sdl2::{
    image::LoadTexture,
    rect::Rect,
    render::{Canvas, Texture, TextureCreator},
    video::{Window, WindowContext},
};

struct WheelBuffer {
    buff: Vec<f64>,
    begin: usize,
}

impl WheelBuffer {
    fn new(capacity: usize) -> Self {
        Self {
            buff: Vec::with_capacity(capacity),
            begin: 0,
        }
    }

    fn insert(&mut self, position: f64) {
        if self.buff.len() < self.buff.capacity() {
            self.buff.push(position);
        } else {
            self.buff[self.begin] = position;
            self.begin = (self.begin + 1) % self.buff.capacity();
        }
    }

    fn get_last(&self) -> f64 {
        if self.begin == 0 {
            self.buff[self.buff.len() - 1]
        } else {
            self.buff[self.begin - 1]
        }
    }
}

pub struct Wheel<'a> {
    x: i16,
    y: i16,
    rad: i16,
    position_buffer: WheelBuffer,
    curr_time: Instant,
    freq: f64,
    omega: f64,
    texture: Texture<'a>,
}

impl<'a> Wheel<'a> {
    pub fn new(
        texture_creator: &'a TextureCreator<WindowContext>,
        x: i16,
        y: i16,
        rad: i16,
        freq: f64,
        buffer_capacity: usize,
    ) -> Result<Self, String> {
        let mut position_buffer = WheelBuffer::new(buffer_capacity);
        position_buffer.insert(0.);

        let mut texture = texture_creator.load_texture("img/wheel.png")?;
        texture.set_alpha_mod(255 / (position_buffer.buff.capacity() as u8));

        Ok(Self {
            x,
            y,
            rad,
            position_buffer,
            curr_time: Instant::now(),
            freq,
            omega: 360. * freq,
            texture,
        })
    }

    pub fn update_position(&mut self, time: Instant) {
        // println!("Time: {:?}", time);

        let mut new_position = self.position_buffer.get_last()
            + self.omega * time.duration_since(self.curr_time).as_secs_f64();
        while new_position > 360. {
            new_position -= 360.;
        }
        self.curr_time = time;
        self.position_buffer.insert(new_position);
    }

    fn draw_with_position(
        &self,
        canvas: &mut Canvas<Window>,
        position: f64,
    ) -> Result<(), String> {
        canvas.copy_ex(
            &self.texture,
            None,
            Rect::new(
                self.x as i32 - self.rad as i32,
                self.y as i32 - self.rad as i32,
                (self.rad * 2) as u32,
                (self.rad * 2) as u32,
            ),
            -position,
            None,
            false,
            false,
        )?;
        Ok(())
    }

    pub fn get_freq(&self) -> f64 {
        self.freq
    }

    pub fn set_freq(&mut self, freq: f64) {
        self.freq = freq;
        self.omega = 360. * freq;
    }
}

pub trait WheelRenderer {
    fn wheel(&mut self, wheel: &Wheel) -> Result<(), String>;
}

impl WheelRenderer for Canvas<Window> {
    fn wheel(&mut self, wheel: &Wheel) -> Result<(), String> {
        // println!("Offset: {}", wheel.offset);
        for position in &wheel.position_buffer.buff {
            wheel.draw_with_position(self, *position)?;
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use sdl2::pixels::Color;

    use super::*;

    #[test]
    fn draw_two_wheels() {
        let sdl_context = sdl2::init().unwrap();
        let video_subsystem = sdl_context.video().unwrap();

        let window = video_subsystem
            .window("Wheel drawing test", 800, 600)
            .position_centered()
            .build()
            .unwrap();

        let mut canvas = window.into_canvas().build().unwrap();
        let texture_creator = canvas.texture_creator();

        let wheel1 = Wheel::new(&texture_creator, 200, 300, 200, 0., 1).unwrap();
        let wheel2 = Wheel::new(&texture_creator, 600, 300, 200, 0., 4).unwrap();

        canvas.set_draw_color(Color::RGB(255, 255, 255));
        canvas.clear();
        wheel1.draw_with_position(&mut canvas, 0.).unwrap();
        wheel2.draw_with_position(&mut canvas, 45.).unwrap();
        canvas.present();

        std::thread::sleep(Duration::from_millis(2000));
    }
}
