use std::{
    cmp::Ordering,
    time::{Duration, Instant},
};

use sdl2::{event::Event, keyboard::Keycode, pixels::Color, render::Canvas, video::Window, Sdl};

use crate::wheel::{Wheel, WheelRenderer};

#[derive(Clone, Copy, Debug)]
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
    jump: f64,
    wheel: Wheel<'a>,
}

impl<'a> Tuner<'a> {
    pub fn new(fps: f64, subframes: u32, sample_rate: u16, wheel: Wheel<'a>) -> Self {
        let jump = sample_rate as f64 / (fps * subframes as f64);
        if jump < 1. {
            panic!("Too many subframes for specified sample rate!");
        }

        Self {
            fps,
            subframes,
            sample_rate,
            time_between_frames: Duration::from_secs_f64(1. / fps),
            time_between_subframes: Duration::from_secs_f64(1. / (fps * subframes as f64)),
            jump,
            wheel,
        }
    }

    // fn insert_into_sorted_vec(val: usize, vec: &mut Vec<usize>) {
    //     let mut j = 0;
    //     let len = vec.len();
    //     while j < len - 1 && val > vec[j] {
    //         vec[j] = vec[j+1];
    //         j += 1;
    //     }

    //     if val > vec[len - 1] {
    //         vec[len - 1] = val;
    //     } else if val > vec[0] {
    //         vec[j - 1] = val;
    //     }
    // }

    pub fn run(&mut self, sdl_context: Sdl, mut canvas: Canvas<Window>) -> Result<(), String> {
        let mut event_pump = sdl_context.event_pump().unwrap();

        // Wave to be used for tuning
        let wave = crate::audio::generate_wave(self.sample_rate, 220., Duration::from_secs(60));

        let displayed_wheels = (self.subframes as f64 * 0.1) as usize;
        let mut subframe_buffer = SubframeBuffer::new(displayed_wheels, 0.9);
        let simulation_begin = Instant::now();

        let mut curr_subframe_index = 0;
        'running: loop {
            let frame_begin = Instant::now();

            // Reset the containers
            subframe_buffer.clear();

            for _ in 0..self.subframes {
                let curr_subframe = Subframe::new(
                    wave[(curr_subframe_index as f64 * self.jump) as usize].abs() as f64 / i16::MAX as f64,
                    simulation_begin.checked_add(self.time_between_subframes.mul_f64(curr_subframe_index as f64)).unwrap());
                if subframe_buffer.insert(curr_subframe) {
                    self.wheel.update_position(curr_subframe.instant);
                }

                curr_subframe_index += 1;
            }

            // Drawing
            canvas.set_draw_color(Color::RGB(255, 255, 255));
            canvas.clear();
            canvas.wheel(&mut self.wheel, 255)?;
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

struct SubframeBuffer {
    buff: Vec<Subframe>,
    begin: usize,
    thresh: f64,
    cutoff: f64,
}

impl SubframeBuffer {
    fn new(capacity: usize, thresh: f64) -> Self {
        Self {
            buff: Vec::with_capacity(capacity),
            begin: 0,
            thresh,
            cutoff: 0.,
        }
    }

    fn insert(&mut self, subframe: Subframe) -> bool {
        if self.buff.len() < self.buff.capacity() {
            self.buff.push(subframe);
        } else {
            self.buff[self.begin] = subframe;
            self.begin = (self.begin + 1) % self.buff.capacity();
        }

        self.update_cutoff();
        subframe.level > self.cutoff
    }

    fn clear(&mut self) {
        self.buff.clear();
        self.begin = 0;
    }

    fn get_last(&self) -> Subframe {
        if self.begin == 0 {
            self.buff[self.buff.len() - 1]
        } else {
            self.buff[self.begin - 1]
        }
    }

    fn update_cutoff(&mut self) {
        self.cutoff = self.thresh
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn insert_test() {
//         let subframes: Vec<i16> = vec![0, 1, 2, 1, 0, -1, -3, -1, 0, 1, 4, 1, 0, -1, -5, -1, 0];
//         let mut largest_indices = vec![0; 4];

//         let key = |a: usize, b: usize| subframes[a].abs().cmp(&subframes[b].abs());

//         for i in 0..subframes.len() {
//             Tuner::insert_into_sorted_index_vec(i, &mut largest_indices, key)
//         }

//         assert_eq!(largest_indices, vec![2, 6, 10, 14]);
//     }

//     #[test]
//     fn basic_insert_test() {
//         let mut vec = vec![0, 1, 2, 4];

//         Tuner::insert_into_sorted_vec(5, &mut vec);

//         assert_eq!(vec, vec![1, 2, 4, 5]);
//     }
// }
