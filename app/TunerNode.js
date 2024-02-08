export default class TunerNode extends AudioWorkletNode {
    init(wasmBytes) {
        this.UIEventHandler = null;

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
    }

    onmessage(msg) {
        // console.log("Main got message type: " + msg.type);
        switch (msg.type) {
            case "wasm-module-loaded":
                this.port.postMessage({
                    type: "init-tuner",
                    sampleRate: this.context.sampleRate,
                    wheelFrequency: document.getElementById("wheel-frequency").value,
                    filterOn: document.getElementById("filter-on").checked,
                    filterOctave: document.getElementById("filter-octave").value,
                    filterQ: document.getElementById("filter-q").value,
                });
                break;
            default:
                if (this.UIEventHandler) {
                    this.UIEventHandler(msg);
                } else {
                    console.error(msg.type + " is not a supported message from tuner");
                }
        }
    }
}