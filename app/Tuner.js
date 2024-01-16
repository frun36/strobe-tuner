import init, { Wheel, set_panic_hook } from "./pkg/strobe_tuner.js";

async function init_wasm_in_worker() {
    await init();
    set_panic_hook();
    console.log("Initialized worker");
}

await init_wasm_in_worker();

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

let wave = generateWave(sampleRate, 220.0, 60);

class Tuner {
    constructor(sampleRate, freq) {
        this.sampleRate = sampleRate;
        this.wheel = Wheel.new(freq, 8);
        console.log("New Tuner created");
    }
}

let tuner = new Tuner(sampleRate, 55.);

let index = 0;
setInterval(() => {
    index += audioBuffSize;
    while (Math.abs(wave[index]) < 0.99) {
        index -= 8;
    }
    let newTimestamp = index * 1000 / sampleRate;
    tuner.wheel.update_position(newTimestamp);
}, interval);

onmessage = (event) => {
    let msg = event.data;
    // console.log("Got message type: " + msg.type);
    switch (msg.type) {
        case "get-frame":
            postMessage({ type: "draw-wheel", position: tuner.wheel.get_position() });
            break;
        case "change-freq":
            let newFreq = tuner.wheel.get_freq() + msg.freqChange;
            console.log("New freq: " + newFreq);
            postMessage({ type: "update-freq-label", newFreq: newFreq });
            tuner.wheel.set_freq(newFreq);
            break;
        default:
            console.error(msg.type + "is not a supported message to tuner");
    }
}