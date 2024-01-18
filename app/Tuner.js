import init, { Tuner, set_panic_hook } from "./pkg/strobe_tuner.js";

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

class TunerNode {
    constructor(sampleRate, freq, motionBlurSize) {
        this.sampleRate = sampleRate;
        this.tuner = Tuner.new(sampleRate, freq, motionBlurSize);
        postMessage({ type: "update-freq-value", newFreq: freq });
        console.log("New Tuner created");
    }
}

let tunerNode = new TunerNode(sampleRate, 55., 8);

let index = 0;
setInterval(() => {
    tunerNode.tuner.process_input(wave.slice(index, index + audioBuffSize));
    index += audioBuffSize;
}, interval);

onmessage = (event) => {
    let msg = event.data;
    // console.log("Tuner got message type: " + msg.type);
    switch (msg.type) {
        case "get-frame":
            postMessage({ type: "draw-wheel", positionBuffer: tunerNode.tuner.get_positions() });
            break;
        case "set-freq":
            console.log("New freq: " + msg.newFreq);
            tunerNode.tuner.set_wheel_freq(msg.newFreq);
            break;
        default:
            console.error(msg.type + "is not a supported message to tuner");
    }
}