use std::time::{Instant, Duration};

use sdl2::{pixels::Color, event::Event, keyboard::Keycode};
use wheel::{WheelRenderer, Wheel};

mod wheel;
mod tuner;

fn main() {
    let sdl_context = sdl2::init().unwrap();
    let video_subsystem = sdl_context.video().unwrap();

    let window = video_subsystem.window("Strobe tuner", 800, 600)
        .position_centered()
        .build()
        .unwrap();


    let mut canvas = window.into_canvas().build().unwrap();
    canvas.set_draw_color(Color::RGB(255, 154, 0));
    canvas.clear();

    let mut wheel = Wheel::new(400, 300, 200, 8, 0., 0.5);
    canvas.wheel(wheel).unwrap();

    canvas.present();

    let mut prev_instant = Instant::now();

    let mut event_pump = sdl_context.event_pump().unwrap();
    'app: loop {
        let instant = Instant::now();
        wheel.update_position(instant - prev_instant);
        prev_instant = instant;
        canvas.clear();
        canvas.wheel(wheel).unwrap();
        canvas.present();

        for event in event_pump.poll_iter() {
            match event {
                Event::Quit {..} |
                Event::KeyDown { keycode: Some(Keycode::Escape), .. } => {
                    break 'app
                },
                _ => {}
            }
        }

        std::thread::sleep(Duration::from_millis(10));
    }
}
