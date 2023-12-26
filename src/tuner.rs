use std::time::{Duration, Instant};

use sdl2::{event::Event, keyboard::Keycode, pixels::Color, render::Canvas, video::Window, Sdl};

use crate::wheel::{Wheel, WheelRenderer};

pub struct Tuner<'a> {
    fps: f64,
    sample_rate: u16,
    time_between_frames: Duration,
    wheel: Wheel<'a>,
}

impl<'a> Tuner<'a> {
    pub fn new(fps: f64, sample_rate: u16, wheel: Wheel<'a>) -> Self {
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
            Duration::from_secs(60),
        );

        canvas.set_draw_color(Color::RGB(255, 154, 0));
        canvas.clear();
        canvas.wheel(&self.wheel)?;
        canvas.present();

        let mut prev_instant;
        let mut instant = Instant::now();
        let mut index = 0;

        'running: loop {
            prev_instant = instant;
            instant = Instant::now();
            self.wheel
                .update_position(instant.duration_since(prev_instant));

            index += (Instant::now().duration_since(prev_instant).as_secs_f64()
                * self.sample_rate as f64) as usize;
            canvas.set_draw_color(Color::RGB(
                (255.
                    * if wave[index].abs() as f64 / i16::MAX as f64 > 0.85 {
                        1.
                    } else {
                        1.
                    }) as u8,
                0,
                0,
            ));

            canvas.clear();
            canvas.wheel(&self.wheel)?;
            canvas.present();

            for event in event_pump.poll_iter() {
                match event {
                    Event::Quit { .. }
                    | Event::KeyDown {
                        keycode: Some(Keycode::Escape),
                        ..
                    } => break 'running,
                    Event::KeyDown {
                        keycode: Some(Keycode::Left),
                        ..
                    } => {
                        self.wheel.set_freq(self.wheel.get_freq() - 0.1);
                        println!("Wheel frequency: {} Hz", self.wheel.get_freq());
                    }
                    Event::KeyDown {
                        keycode: Some(Keycode::Right),
                        ..
                    } => {
                        self.wheel.set_freq(self.wheel.get_freq() + 0.1);
                        println!("Wheel frequency: {} Hz", self.wheel.get_freq());
                    }
                    _ => {}
                }
            }

            let sleep = self.time_between_frames - Instant::now().duration_since(instant);
            std::thread::sleep(sleep);
            println!("{:?}", self.time_between_frames - sleep);
        }

        Ok(())
    }
}
