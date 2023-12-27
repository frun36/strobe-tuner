use std::time::{Instant, Duration};

use sdl2::{event::Event, keyboard::Keycode, pixels::Color};

use crate::wheel::WheelRenderer;

use super::*;

#[test]
fn wheel_rotation() -> Result<(), String> {
    let sdl_context = sdl2::init().unwrap();
    let mut event_pump = sdl_context.event_pump().unwrap();
    let video_subsystem = sdl_context.video().unwrap();
    let window = video_subsystem
        .window("Wheel test", 800, 600)
        .position_centered()
        .build()
        .unwrap();

    let mut canvas = window.into_canvas().build().unwrap();
    let texture_creator = canvas.texture_creator();

    let freq = 0.5;
    let eight_turn = Duration::from_secs_f64(0.125 / freq);

    let mut wheel = Wheel::new(&texture_creator, 400, 300, 200, freq).unwrap();

    canvas.set_draw_color(Color::RGB(255, 255, 255));
    canvas.clear();

    let begin = Instant::now();
    'running: loop {
        let frame = Instant::now();
        if frame.duration_since(begin) > eight_turn {
            break 'running;
        }
        wheel.update_position(frame);
        canvas.wheel(&wheel)?;
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
    }

    println!("Has it covered all holes apart from the two largest?");
    std::thread::sleep(Duration::from_millis(1000));

    Ok(())
}
