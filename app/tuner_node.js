import { clear, draw_wheel } from "./render.js";

let freqInput = document.getElementById("wheel-frequency");
let inputLevel = document.getElementById("rms-input-level");

export default class TunerNode extends AudioWorkletNode {
    init(wasmBytes) {
        // Listen to messages sent from the audio processor.
        this.port.onmessage = (event) => this.onmessage(event.data);

        this.port.postMessage({
            type: "send-wasm-module",
            wasmBytes,
        });
    }


    // Handle an uncaught exception thrown in the PitchProcessor.
    onprocessorerror(err) {
        console.log(
            `An error from AudioWorkletProcessor.process() occurred: ${err}`
        );
    };

    onmessage(msg) {
        // console.log("Main got message type: " + msg.type);
        switch (msg.type) {
            case "wasm-module-loaded":
                this.port.postMessage({
                    type: "init-tuner",
                    sampleRate: this.context.sampleRate,
                });
                break;
            case "draw-wheel":
                // console.log(msg.positionBuffer);
                clear();
                msg.positionBuffer.forEach(position => {
                    draw_wheel(-position, 0.01);
                });
                break;
            case "update-freq-value":
                freqInput.value = msg.newFreq.toFixed(2);
                break;
            case "rms-input-level":
                inputLevel.textContent = "RMS input level: " + msg.level.toFixed(2);
                break;
            default:
                console.error(msg.type + " is not a supported message from tuner");
        }
    }
}