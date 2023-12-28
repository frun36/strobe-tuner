use tuner::Tuner;
use wheel::Wheel;

mod audio;
mod tuner;
mod wheel;

#[cfg(test)]
mod tests;

fn main() {
    let sdl_context = sdl2::init().unwrap();
    let video_subsystem = sdl_context.video().unwrap();

    let window = video_subsystem
        .window("Strobe tuner", 800, 600)
        .position_centered()
        .build()
        .unwrap();

    let canvas = window.into_canvas().build().unwrap();
    let texture_creator = canvas.texture_creator();
    let wheel = Wheel::new(&texture_creator, 400, 300, 200, 55_f64).unwrap();

    let mut tuner = Tuner::new(30., 1024, 44100, wheel);
    tuner.run(sdl_context, canvas).unwrap();
}