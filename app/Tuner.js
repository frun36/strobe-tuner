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

let wave = generateWave(sampleRate, 220., 60);
// console.log(wave);

class Tuner {
    constructor(sampleRate, freq, motionBlurSize) {
        this.sampleRate = sampleRate;
        this.wheel = Wheel.new(freq, motionBlurSize);
        postMessage({ type: "update-freq-value", newFreq: freq });
        console.log("New Tuner created");
    }
}

let tuner = new Tuner(sampleRate, 55., 8);

let index = 0;
setInterval(() => {
    index += audioBuffSize;
    while (Math.abs(wave[index]) < 0.99) {
        index -= 1;
    }
    let newTimestamp = index * 1000 / sampleRate;
    tuner.wheel.update_position(newTimestamp);
}, interval);

onmessage = (event) => {
    let msg = event.data;
    // console.log("Tuner got message type: " + msg.type);
    switch (msg.type) {
        case "get-frame":
            postMessage({ type: "draw-wheel", positionBuffer: tuner.wheel.get_position_buffer() });
            break;
        case "set-freq":
            console.log("New freq: " + msg.newFreq);
            tuner.wheel.set_freq(msg.newFreq);
            break;
        default:
            console.error(msg.type + "is not a supported message to tuner");
    }
}