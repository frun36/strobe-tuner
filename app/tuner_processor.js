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
            return accumulator + currentValue;
        }, 0) / inputSamples.length);

        // console.log("RMS input level: " + level);

        this.port.postMessage({
            type: "rms-input-level",
            level: level,
        });

        // console.log("Max imput level: " + Math.max(...inputSamples));

        let output = this.tuner ? this.tuner.process_input(inputSamples) : inputSamples;
        for (let i = 0; i < output.length; i++) outputs[0][0][i] = output[i];
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
                this.tuner = Tuner.new(msg.sampleRate, msg.wheelFrequency, 128, msg.filterOn, msg.filterOctave, msg.filterQ);
                break;
            case "get-frame":
                this.port.postMessage({
                    type: "draw-frame",
                    positionBuffer: this.tuner.get_positions(),
                    pitch: this.tuner.get_last_pitch(),
                });
                break;
            case "update-params":
                console.log(msg);
                this.tuner.update_params(msg.wheelFrequency, msg.filterOn, msg.filterOctave, msg.filterQ);
                break;
            default:
                console.error(msg.type + " is not a supported message to tuner");
        }
    }
}

registerProcessor("TunerProcessor", TunerProcessor);