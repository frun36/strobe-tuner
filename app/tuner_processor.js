import init, { Tuner, set_panic_hook } from "./pkg/strobe_tuner.js"

class TunerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.port.onmessage = (event) => this.onmessage(event.data);

        this.tuner = null;

        console.log("New Tuner created");
    }

    process(inputs, outputs) {
        const inputChannels = inputs[0];
        const inputSamples = inputChannels[0];

        let level = Math.sqrt(inputSamples.map((x) => x * x).reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        }, 0) / inputSamples.length);

        // console.log("RMS input level: " + level);

        this.port.postMessage({
            type: "rms-input-level",
            level: level,
        });

        // console.log("Max imput level: " + Math.max(...inputSamples));

        this.tuner.process_input(inputSamples);

        return true;
    }

    onmessage(msg) {
        switch (msg.type) {
            case "send-wasm-module":
                init(WebAssembly.compile(msg.wasmBytes)).then(() => {
                    this.port.postMessage({ type: "wasm-module-loaded" });
                    console.log("Loaded WASM module");
                });
                break;
            case "init-tuner":
                set_panic_hook();
                const sampleRate = msg.sampleRate;
                this.tuner = Tuner.new(sampleRate, 55., 128);
                this.port.postMessage({ type: "update-freq-value", newFreq: 55. });
                break;
            case "get-frame":
                this.port.postMessage({ type: "draw-wheel", positionBuffer: this.tuner.get_positions() });
                break;
            case "set-freq":
                console.log("New freq: " + msg.newFreq);
                this.tuner.set_wheel_freq(msg.newFreq);
                break;
            default:
                console.error(msg.type + " is not a supported message to tuner");
        }
    }
}

registerProcessor("TunerProcessor", TunerProcessor);