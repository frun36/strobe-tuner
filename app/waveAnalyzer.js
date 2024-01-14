const audioBuffSize = 128;
const sampleRate = 44100;
const interval = (1 / sampleRate) * 1000 * audioBuffSize;

function generateWave(sampleRate, waveFreq, lengthSecs) {
    let vecLen = sampleRate * lengthSecs;
    let vec = [];
    for (let i = 0; i < vecLen; i++) {
        let value = Math.sin(2. * Math.PI * waveFreq * i / sampleRate);
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

let wave = generateWave(sampleRate, 220.0, 60);

let wheel = new Wheel(55.);

let index = 0;
setInterval(() => {
    index += audioBuffSize;
    while (Math.abs(wave[index]) < 0.99) {
        index -= 8;
    }
    let newTimestamp = index * 1000 / sampleRate;
    wheel.updatePosition(newTimestamp);
}, interval);

onmessage = (event) => {
    let msg = event.data;

    wheel.freq += msg.freqChange;
    wheel.omega = 2 * Math.PI * wheel.freq;
    if (msg.getFrame) {
        postMessage(wheel);
    }
}