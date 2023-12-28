// For now only loaded files/generated waves

use std::{time::Duration, f64::consts::PI};

pub fn generate_wave(sample_rate: u16, freq: f64, length: Duration) -> Vec<i16> {
    let vec_len = (sample_rate as f64 * length.as_secs_f64()) as usize;
    let mut vec = Vec::new();
    for i in 0..vec_len {
        let value = (f64::sin(2. * PI * freq * i as f64 / sample_rate as f64) * i16::MAX as f64) as i16;
        vec.push(value);
        // if i % 100 == 0 {
        //     println!("{value}");
        // }
    }
    vec
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generate_zeros() {
        let wave = generate_wave(4, 2., Duration::from_secs(2));
        println!("{:?}", wave);
        assert_eq!(wave, vec![0_i16; 8]);
    }

    #[test]
    fn generate_zeros_and_ones() {
        let wave = generate_wave(4, 1., Duration::from_secs(1));
        println!("{:?}", wave);
        assert_eq!(wave, vec![0, i16::MAX, 0, -i16::MAX]);
    }
}