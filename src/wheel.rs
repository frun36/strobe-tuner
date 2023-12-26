use std::{f64::consts::PI, time::Duration};

use sdl2::{
    rect::Rect,
    render::{Canvas, Texture, TextureCreator},
    video::{Window, WindowContext}, image::LoadTexture,
};

pub struct Wheel<'a> {
    x: i16,
    y: i16,
    rad: i16,
    position: f64,
    freq: f64,
    texture: Texture <'a>
}

impl<'a> Wheel<'a> {
    pub fn new(texture_creator: &'a TextureCreator<WindowContext>, x: i16, y: i16, rad: i16, freq: f64) -> Result<Self, String> {
        let texture = texture_creator.load_texture("img/wheel.png")?;
        
        Ok(Self {
            x,
            y,
            rad,
            position: 0.,
            freq,
            texture,
        })
    }

    pub fn update_position(&mut self, time: Duration) {
        // println!("Time: {:?}", time);
        let omega = 360. * self.freq;
        self.position += omega * time.as_secs_f64();
        // while self.position > 2. * PI {
        //     self.position -= 2. * PI;
        // }
    }

    pub fn get_freq(&self) -> f64 {
        self.freq
    }

    pub fn set_freq(&mut self, freq: f64) {
        self.freq = freq;
    }
}

pub trait WheelRenderer {
    fn wheel(&mut self, wheel: &Wheel) -> Result<(), String>;
}

impl WheelRenderer for Canvas<Window> {
    fn wheel(&mut self, wheel: &Wheel) -> Result<(), String> {
        // println!("Offset: {}", wheel.offset);
        self.copy_ex(
            &wheel.texture,
            None,
            Rect::new(
                wheel.x as i32 - wheel.rad as i32,
                wheel.y as i32 - wheel.rad as i32,
                (wheel.rad * 2) as u32,
                (wheel.rad * 2) as u32,
            ),
            wheel.position,
            None,
            false,
            false,
        )?;

        Ok(())
    }
}
