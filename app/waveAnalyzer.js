let buffer_len = 16;

function generateWave(sample_rate, freq, length_secs) {
    let vec_len = sample_rate * length_secs;
    let vec = [];
    for (let i = 0; i<vec_len; i++) {
        let value = Math.sin(2. * Math.PI * freq * i / sample_rate);
        vec.push(value);
    }
    return vec;
}

class Wheel {
    constructor(freq) {
        this.position = 0.;
        this.freq = freq;
        this.omega = 2 * Math.PI * this.freq;
        this.lastTimestamp = 0.;
    }

    updatePosition(timestamp) {
        let elapsed = timestamp - this.lastTimestamp;
        this.position += this.omega * elapsed * 0.001;
        while (this.position > 2 * Math.PI) {
            this.position -= 2 * Math.PI;
        }
        this.lastTimestamp = timestamp;
    }
}

let wave = generateWave(44100, 220.0, 60);

// console.log(wave);

let wheel = new Wheel(0.25);

// let iteration = 0;
setInterval(() => {
    wheel.updatePosition(performance.now());
    console.log(wheel.position);
}, 100);

onmessage = (msg) => {
    // len = msg.data.len;
    // console.log("Received len: " + len);
    postMessage(wheel);
}