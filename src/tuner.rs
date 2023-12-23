use std::time::{Duration, Instant};

use sdl2::{event::Event, keyboard::Keycode, pixels::Color, render::Canvas, video::Window, Sdl};

use crate::wheel::{Wheel, WheelRenderer};

pub struct Tuner {
    fps: f64,
    sample_rate: u16,
    time_between_frames: Duration,
    wheel: Wheel,
}

impl Tuner {
    pub fn new(fps: f64, sample_rate: u16, wheel: Wheel) -> Self {
        Self {
            fps,
            sample_rate,
            time_between_frames: Duration::from_secs_f64(1. / fps),
            wheel,
        }
    }

    pub fn run(&mut self, sdl_context: Sdl, mut canvas: Canvas<Window>) -> Result<(), String> {
        let mut event_pump = sdl_context.event_pump().unwrap();

        let wave = crate::audio::generate_wave(
            self.sample_rate,
            self.wheel.get_freq(),
            Duration::from_secs(10),
        );

        canvas.set_draw_color(Color::RGB(255, 154, 0));
        canvas.clear();
        canvas.wheel(self.wheel)?;
        canvas.present();

        let mut prev_instant;
        let mut instant = Instant::now();
        let mut index = 0;

        'running: loop {
            prev_instant = instant;
            instant = Instant::now();
            let dur = instant.duration_since(prev_instant);
            self.wheel.update_position(dur);

            index += (dur.as_secs_f64() * self.sample_rate as f64) as usize;
            canvas.set_draw_color(Color::RGB(
                (255. * wave[index].abs() as f64 / i16::MAX as f64) as u8,
                0,
                0,
            ));

            canvas.clear();
            canvas.wheel(self.wheel)?;
            canvas.present();

            for event in event_pump.poll_iter() {
                match event {
                    Event::Quit { .. }
                    | Event::KeyDown {
                        keycode: Some(Keycode::Escape),
                        ..
                    } => break 'running,
                    _ => {}
                }
            }

            std::thread::sleep(self.time_between_frames);
        }

        Ok(())
    }
}
