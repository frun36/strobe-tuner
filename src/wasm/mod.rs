use std::{cell::RefCell, rc::Rc};

use wasm_bindgen::prelude::*;
use web_sys::{window, HtmlButtonElement};

extern crate console_error_panic_hook;
use std::panic;

use self::{app::App, tuner::Tuner, wheel::Wheel};

mod app;
mod tuner;
mod wheel;

type DOMHighResTimestamp = f64;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen(module = "/render.js")]
extern "C" {
    fn draw_wheel(rotation: f32, alpha: f32);

    fn clear();
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello from the strobe tuner!");
}

fn request_animation_frame(callback: &Closure<dyn FnMut(f64)>) {
    if let Some(window) = window() {
        window
            .request_animation_frame(callback.as_ref().unchecked_ref())
            .unwrap();
    }
}

fn create_freq_buttons_and_label(wheel: Rc<RefCell<Wheel>>) -> Result<(), JsValue> {
    let window = web_sys::window().expect("No global window exists");
    let document = window.document().expect("Should have a document on window");
    let tuner_div = document
        .get_element_by_id("tuner")
        .expect("No tuner div found");

    let buttons_div = document.create_element("div")?;
    tuner_div.append_child(&buttons_div)?;

    let button_minus = document
        .create_element("button")?
        .dyn_into::<HtmlButtonElement>()
        .unwrap();
    button_minus.set_text_content(Some("Wheel freq -"));


    let label = document.create_element("label")?;
    label.set_text_content(Some(&format!("Wheel freq: {} Hz", wheel.borrow().get_freq())));
    let label = Rc::new(RefCell::new(label));


    let button_plus = document
        .create_element("button")?
        .dyn_into::<HtmlButtonElement>()
        .unwrap();
    button_plus.set_text_content(Some("Wheel freq +"));

    let wheel_minus = wheel.clone();
    let label_minus = label.clone();
    let onclick_minus = Closure::<dyn FnMut()>::new(move || {
        let prev_freq = wheel_minus.borrow().get_freq();
        wheel_minus.borrow_mut().set_freq(prev_freq - 0.01);
        label_minus.borrow_mut().set_text_content(Some(&format!("Wheel freq: {} Hz", wheel_minus.borrow().get_freq())));
    });

    let wheel_plus = wheel.clone();
    let label_plus = label.clone();
    let onclick_plus = Closure::<dyn FnMut()>::new(move || {
        let prev_freq = wheel_plus.borrow().get_freq();
        wheel_plus.borrow_mut().set_freq(prev_freq + 0.01);
        // console::log_1(&format!("Old freq: {prev_freq}, new freq: {}", wheel_plus.borrow_mut().get_freq()).into());
        label_plus.borrow_mut().set_text_content(Some(&format!("Wheel freq: {} Hz", wheel_plus.borrow().get_freq())));
    });

    button_minus.set_onclick(Some(onclick_minus.as_ref().unchecked_ref()));
    button_plus.set_onclick(Some(onclick_plus.as_ref().unchecked_ref()));

    onclick_minus.forget();
    onclick_plus.forget();

    buttons_div.append_child(&button_minus)?;
    buttons_div.append_child(label.borrow().as_ref())?;
    buttons_div.append_child(&button_plus)?;

    Ok(())
}

#[wasm_bindgen]
pub fn run() -> Result<(), JsValue> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    let wheel = Wheel::new(55.);
    let wheel = Rc::new(RefCell::new(wheel));
    let tuner = Tuner::new(512, 44100, wheel.clone(), 0.999, 220.);
    let mut app = App::new(tuner);

    create_freq_buttons_and_label(wheel.clone())?;

    let f = Rc::new(RefCell::new(None));
    let g = f.clone();

    let anim_callback = move |timestamp: DOMHighResTimestamp| {
        app.handle_frame(timestamp);
        request_animation_frame(f.borrow().as_ref().unwrap());
    };

    *g.borrow_mut() = Some(Closure::wrap(Box::new(anim_callback)));
    request_animation_frame(g.borrow().as_ref().unwrap());

    Ok(())
}
