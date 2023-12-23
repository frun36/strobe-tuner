use tuner::Tuner;
use wheel::Wheel;

mod tuner;
mod wheel;

fn main() {
    let sdl_context = sdl2::init().unwrap();
    let video_subsystem = sdl_context.video().unwrap();

    let window = video_subsystem
        .window("Strobe tuner", 800, 600)
        .position_centered()
        .build()
        .unwrap();

    let canvas = window.into_canvas().build().unwrap();

    let mut tuner = Tuner::new(60., Wheel::new(400, 300, 200, 8, 0., 0.5));
    tuner.run(sdl_context, canvas).unwrap();
}
