use std::time::{Duration, Instant};

use sdl2::{render::Canvas, video::Window, pixels::Color, event::Event, keyboard::Keycode, Sdl};

use crate::wheel::{Wheel, WheelRenderer};

pub struct Tuner {
    fps: f64,
    time_between_frames: Duration,
    wheel: Wheel,
}

impl Tuner {
    pub fn new(fps: f64, wheel: Wheel) -> Self {
        Self {
            fps,
            time_between_frames: Duration::from_secs_f64(1. / fps),
            wheel,
        }
    }

    pub fn run(&mut self, sdl_context: Sdl, mut canvas: Canvas<Window>) -> Result<(), String> {
        let mut event_pump = sdl_context.event_pump().unwrap();

        canvas.set_draw_color(Color::RGB(255, 154, 0));
        canvas.clear();
        canvas.wheel(self.wheel)?;
        canvas.present();

        let mut prev_instant;
        let mut instant = Instant::now();


        'running: loop {
            prev_instant = instant;
            instant = Instant::now();
            self.wheel.update_position(instant.duration_since(prev_instant));
            canvas.clear();
            canvas.wheel(self.wheel)?;
            canvas.present();

            for event in event_pump.poll_iter() {
                match event {
                    Event::Quit {..} |
                    Event::KeyDown { keycode: Some(Keycode::Escape), .. } => {
                        break 'running
                    },
                    _ => {}
                }
            }

            std::thread::sleep(self.time_between_frames);

        }

        Ok(())
    }
}
