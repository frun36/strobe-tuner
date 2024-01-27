import TunerNode from "./tuner_node.js";
import Oscilloscope from "./oscilloscope.js";
import { dBToLinear } from "./utils.js";

async function getWebAudioMediaStream() {
    if (!window.navigator.mediaDevices) {
        throw new Error(
            "This browser does not support web audio or it is not enabled."
        );
    }

    try {
        const result = await window.navigator.mediaDevices.getUserMedia({
            audio: {
                autoGainControl: false,
                noiseSuppression: false,
            },
            video: false,
        });
        return result;
    } catch (e) {
        switch (e.name) {
            case "NotAllowedError":
                throw new Error(
                    "A recording device was found but has been disallowed for this application. Enable the device in the browser's settings."
                );
            case "NotFoundError":
                throw new Error(
                    "No recording device was found. Please attach a microphone and click Retry."
                );
            default:
                throw e;
        }
    }
}

export async function setupAudio() {
    const mediaStream = await getWebAudioMediaStream();

    const context = new window.AudioContext();
    const audioSource = context.createMediaStreamSource(mediaStream);

    let tunerNode;
    let inputOscilloscopeNode;
    let outputOscilloscopeNode
    let inputGainNode;

    try {
        // Fetch the WebAssembly module
        const response = await window.fetch("pkg/strobe_tuner_bg.wasm");
        const wasmBytes = await response.arrayBuffer();

        // Add our audio processor worklet to the context.
        const processorUrl = "tuner_processor.js";
        try {
            await context.audioWorklet.addModule(processorUrl);
        } catch (e) {
            throw new Error(
                `Failed to load audio analyzer worklet at url: ${processorUrl}. Further info: ${e.message}`
            );
        }

        inputGainNode = context.createGain();
        inputGainNode.gain.value =
            dBToLinear(document.getElementById("input-gain").value);

        inputOscilloscopeNode = new Oscilloscope(context,
            document.getElementById("input-oscilloscope"),
            2048,
            dBToLinear(document.getElementById("input-oscilloscope-gain").value));

        tunerNode = new TunerNode(context, "TunerProcessor");
        tunerNode.init(wasmBytes);

        outputOscilloscopeNode = new Oscilloscope(context,
            document.getElementById("output-oscilloscope"),
            2048,
            dBToLinear(document.getElementById("output-oscilloscope-gain").value));

        audioSource.connect(inputGainNode);
        inputGainNode.connect(inputOscilloscopeNode);
        inputOscilloscopeNode.connect(tunerNode);
        tunerNode.connect(outputOscilloscopeNode);
        outputOscilloscopeNode.connect(context.destination);
    } catch (err) {
        throw new Error(
            `Failed to load audio analyzer WASM module. Further info: ${err.message}`
        );
    }

    return {
        context,
        node: tunerNode,
        inputGainNode: inputGainNode,
        inputOscilloscope: inputOscilloscopeNode,
        outputOscilloscope: outputOscilloscopeNode
    };
}