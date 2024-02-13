export function dBToLinear(x) {
    return Math.pow(10, x / 10);
}

export function centsToRatio(cents) {
    return Math.pow(2, cents / 1200);
}

export function ratioToCents(ratio) {
    return 1200 * Math.log2(ratio);
}

export function intoFirstOctave(pitch) {
    if (pitch === 0.0) {
        return { pitch: 0, octave: 0 };
    }

    let octave = 1;
    while (pitch < 32) {
        pitch *= 2;
        octave--;
    }

    while (pitch > 65) {
        pitch /= 2;
        octave++;
    }

    return { pitch, octave }
}