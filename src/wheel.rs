use std::f64::consts::PI;

use sdl2::{
    gfx::primitives::DrawRenderer,
    pixels::Color,
    render::{Canvas, RenderTarget},
};

#[derive(Clone, Copy)]
pub struct Wheel {
    x: i16,
    y: i16,
    rad: i16,
    holes: u8,
    hole_rad: i16,
    offset: f64,
}

impl Wheel {
    pub fn new(x: i16, y: i16, rad: i16, holes: u8, offset: f64) -> Self {
        Self {
            x,
            y,
            rad,
            holes,
            hole_rad: rad / holes as i16,
            offset,
        }
    }
}

pub trait WheelRenderer {
    fn wheel(&self, wheel: Wheel) -> Result<(), String>;
}

impl<T> WheelRenderer for Canvas<T>
where
    T: RenderTarget,
{
    fn wheel(&self, wheel: Wheel) -> Result<(), String> {
        self.filled_circle(wheel.x, wheel.y, wheel.rad, Color::RGB(0, 0, 0))?;

        let angle = 2. * PI / (wheel.holes as f64);

        for i in 0..(wheel.holes) {
            let curr_angle = angle * i as f64 + wheel.offset;
            let relative_x = (wheel.rad - wheel.hole_rad * 2) as f64 * curr_angle.cos();
            let relative_y = (wheel.rad - wheel.hole_rad * 2) as f64 * curr_angle.sin();
            self.filled_circle(
                wheel.x + relative_x as i16,
                wheel.y + relative_y as i16,
                wheel.hole_rad,
                Color::RGB(255, 255, 255),
            )?;
        }
        Ok(())
    }
}
