use std::time::{Duration, Instant};

use sdl2::{
    event::Event, keyboard::Keycode, pixels::Color, render::Canvas, video::Window, Sdl,
};

use crate::wheel::{Wheel, WheelRenderer};

#[derive(Clone, Copy)]
struct Subframe {
    pub level: f64,
    pub instant: Instant,
}

impl Subframe {
    fn new(level: f64, instant: Instant) -> Self {
        Self { level, instant }
    }
}

pub struct Tuner<'a> {
    fps: f64,
    subframes: u32,
    sample_rate: u16,
    time_between_frames: Duration,
    time_between_subframes: Duration,
    jump: usize,
    wheel: Wheel<'a>,
}

impl<'a> Tuner<'a> {
    pub fn new(fps: f64, subframes: u32, sample_rate: u16, wheel: Wheel<'a>) -> Self {
        Self {
            fps,
            subframes,
            sample_rate,
            time_between_frames: Duration::from_secs_f64(1. / fps),
            time_between_subframes: Duration::from_secs_f64(1. / (fps * subframes as f64)),
            jump: (sample_rate as f64 / (fps * subframes as f64)) as usize,
            wheel,
        }
    }

    pub fn run(&mut self, sdl_context: Sdl, mut canvas: Canvas<Window>) -> Result<(), String> {
        let mut event_pump = sdl_context.event_pump().unwrap();

        let wave = crate::audio::generate_wave(
            self.sample_rate,
            110.,
            Duration::from_secs(60),
        );

        const DISPLAYED_WHEELS: usize = 8;
        let mut subframes = Vec::with_capacity(self.subframes as usize);

        let mut index = 0;
        'running: loop {
            let frame_begin = Instant::now();

            subframes.clear();
            let mut largest = [0; DISPLAYED_WHEELS];

            for i in 0..self.subframes as usize {
                index += self.jump;
                subframes.push(Subframe::new(
                    wave[index] as f64 / i16::MAX as f64,
                    frame_begin
                        .checked_add(self.time_between_subframes.mul_f64(i as f64))
                        .unwrap(),
                ));
                let mut j = 0;
                while subframes[i].level > subframes[largest[j]].level && j < DISPLAYED_WHEELS {
                    largest[j] = largest[j + 1];
                    largest[j + 1] = i;
                    j += 1;
                }
            }

            largest.sort_by(|a, b| { subframes[*a].instant.cmp(&subframes[*b].instant) });
            
            canvas.set_draw_color(Color::RGB(255, 255, 255));
            canvas.clear();
            
            for i in 0..DISPLAYED_WHEELS {
                self.wheel.update_position(subframes[largest[i]].instant);
                canvas.wheel(&mut self.wheel, 255 / DISPLAYED_WHEELS as u8)?;
            }
            // match last_instant {
            //     None => canvas.set_draw_color(Color::RGB(0, 0, 0)),
            //     Some(instant) => {
            //         self.wheel.update_position(instant);
            //         canvas.set_draw_color(Color::RGB(255, 255, 255));
            //     }
            // }

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
                        self.wheel.set_freq(self.wheel.get_freq() - 0.01);
                        println!("Wheel frequency: {} Hz", self.wheel.get_freq());
                    }
                    Event::KeyDown {
                        keycode: Some(Keycode::Right),
                        ..
                    } => {
                        self.wheel.set_freq(self.wheel.get_freq() + 0.01);
                        println!("Wheel frequency: {} Hz", self.wheel.get_freq());
                    }
                    _ => {}
                }
            }

            let sleep = self.time_between_frames - Instant::now().duration_since(frame_begin);
            std::thread::sleep(sleep);
            // println!("{:?}", self.time_between_frames - sleep);
        }

        Ok(())
    }
}
