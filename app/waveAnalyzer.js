let buffer_len = 16;

function generateWave(sample_rate, waveFreq, length_secs) {
    let vec_len = sample_rate * length_secs;
    let vec = [];
    for (let i = 0; i < vec_len; i++) {
        let value = Math.sin(2. * Math.PI * waveFreq * i / sample_rate);
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

console.log(wave);

let wheel = new Wheel(55.);


setInterval(() => {
    let timestamp = performance.now();
    // console.log("Timestamp: " + timestamp);
    let index = timestamp * 0.001 * 44100;
    while(Math.abs(wave[index]) < 0.99) {
        index -= 8;
    }
    let newTimestamp = index * 1000 / 44100.;
    wheel.updatePosition(newTimestamp);
    // console.log(performance.now() - timestamp);
    // console.log(wheel.freq);
}, 2);

onmessage = (event) => {
    // let timestamp = performance.now();
    // // console.log("Timestamp: " + timestamp);
    // let index = timestamp * 0.001 * 44100;
    // while(Math.abs(wave[index]) < 0.99) {
    //     index -= 1;
    // }
    // let newTimestamp = index * 1000 / 44100.;
    // wheel.updatePosition(newTimestamp);

    let msg = event.data;
    // len = msg.data.len;
    // console.log("Received len: " + len);
    wheel.freq += msg.freqChange;
    wheel.omega = 2 * Math.PI * wheel.freq;
    if(msg.getFrame) {
        postMessage(wheel);
    }
}