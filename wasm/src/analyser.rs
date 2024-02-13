use crate::buffer::Buffer;

use pitch_detection::detector::yin::YINDetector;
use pitch_detection::detector::PitchDetector;

pub struct Analyser {
    sample_rate: f64,
    fft_size: usize,
    buffer: Buffer<f32>,
    last_pitch: Option<f32>,
    pitch_detector: Option<YINDetector<f32>>,
    sample_counter: usize,
}

impl Analyser {
    pub fn new(sample_rate: f64, fft_size: usize, pitch_detector_enabled: bool) -> Self {
        Self {
            sample_rate,
            fft_size,
            buffer: Buffer::new(fft_size),
            last_pitch: None,
            pitch_detector: if pitch_detector_enabled {
                Some(YINDetector::new(fft_size, fft_size / 2))
            } else {
                None
            },
            sample_counter: 0,
        }
    }

    pub fn update_buffer(&mut self, samples: &[f32]) {
        self.sample_counter += samples.len();
        self.buffer.insert_slice(samples);
        if self.sample_counter >= self.fft_size {
            self.sample_counter = 0;
            self.detect_pitch();
        }
    }

    fn detect_pitch(&mut self) {
        self.last_pitch = self
            .pitch_detector
            .as_mut()
            .expect("Pitch detector uninitialised")
            .get_pitch(
                self.buffer.get_contents_ordered(),
                self.sample_rate.round() as usize,
                0.0,
                0.6,
            )
            .map(|pitch| pitch.frequency);
    }

    pub fn get_last_pitch(&self) -> Option<f32> {
        self.last_pitch
    }

    pub fn get_buffer(&mut self) -> &[f32] {
        self.buffer.get_contents_ordered()
    }
}
