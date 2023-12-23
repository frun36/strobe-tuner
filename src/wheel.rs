use std::{f64::consts::PI, time::Duration};

use sdl2::{
    gfx::primitives::DrawRenderer,
    pixels::{Color, PixelFormatEnum},
    rect::Rect,
    render::{BlendMode, Canvas},
    surface::Surface,
    video::Window,
};

#[derive(Clone, Copy)]
pub struct Wheel {
    x: i16,
    y: i16,
    rad: i16,
    holes: u8,
    hole_rad: i16,
    offset: f64,
    freq: f64,
}

impl Wheel {
    pub fn new(x: i16, y: i16, rad: i16, holes: u8, offset: f64, freq: f64) -> Self {
        Self {
            x,
            y,
            rad,
            holes,
            hole_rad: rad / holes as i16,
            offset,
            freq,
        }
    }

    pub fn update_position(&mut self, time: Duration) {
        // println!("Time: {:?}", time);
        let omega = 2. * PI * self.freq;
        self.offset += omega * time.as_secs_f64();
        while self.offset > 2. * PI {
            self.offset -= 2. * PI;
        }
    }

    pub fn get_freq(&self) -> f64 {
        self.freq
    }
}

pub trait WheelRenderer {
    fn wheel(&mut self, wheel: Wheel) -> Result<(), String>;
}

impl WheelRenderer for Canvas<Window> {
    fn wheel(&mut self, wheel: Wheel) -> Result<(), String> {
        // println!("Offset: {}", wheel.offset);

        let mut mask_surface = Surface::new(
            2 * wheel.rad as u32,
            2 * wheel.rad as u32,
            PixelFormatEnum::RGBA32,
        )?;
        mask_surface.set_blend_mode(BlendMode::Blend)?;
        let mask_canvas = mask_surface.into_canvas()?;

        mask_canvas.filled_circle(wheel.rad, wheel.rad, wheel.rad, Color::RGB(0, 0, 0))?;

        let angle = 2. * PI / (wheel.holes as f64);

        for i in 0..(wheel.holes) {
            let curr_angle = angle * i as f64 + wheel.offset;
            let relative_x = (wheel.rad - wheel.hole_rad * 2) as f64 * curr_angle.cos();
            let relative_y = (wheel.rad - wheel.hole_rad * 2) as f64 * curr_angle.sin();
            mask_canvas.filled_circle(
                wheel.rad + relative_x as i16,
                wheel.rad + relative_y as i16,
                wheel.hole_rad,
                Color::RGB(255, 255, 255),
            )?;
        }

        let texture_creator = self.texture_creator();
        let mut mask_texture = texture_creator
            .create_texture_from_surface(mask_canvas.surface())
            .unwrap();

        mask_texture.set_blend_mode(BlendMode::Mul);
        self.copy(
            &mask_texture,
            None,
            Rect::new(
                wheel.x as i32 - wheel.rad as i32,
                wheel.y as i32 - wheel.rad as i32,
                (wheel.rad * 2) as u32,
                (wheel.rad * 2) as u32,
            ),
        )?;

        Ok(())
    }
}
