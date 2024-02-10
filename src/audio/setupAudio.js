import TunerNode from "./TunerNode.js";
import { dBToLinear } from "../utils/utils.js";
import processorUrl from "./TunerProcessor.js?worker&url"
import wasmUrl from "/pkg/strobe_tuner_bg.wasm?url"

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
    let inputGainNode;
    let muteNode;

    try {
        // Fetch the WebAssembly module
        const response = await window.fetch(wasmUrl);
        const wasmBytes = await response.arrayBuffer();

        // Add our audio processor worklet to the context.
        try {
            await context.audioWorklet.addModule(processorUrl);
        } catch (e) {
            throw new Error(
                `Failed to load audio analyzer worklet at url: ${processorUrl}. Further info: ${e.message}`
            );
        }

        inputGainNode = context.createGain();
        inputGainNode.gain.value = dBToLinear(0);

        tunerNode = new TunerNode(context, "TunerProcessor");
        tunerNode.init(wasmBytes);

        muteNode = context.createGain();
        muteNode.gain.value = 0;

        audioSource.connect(inputGainNode);
        inputGainNode.connect(tunerNode);
        tunerNode.connect(muteNode);
        muteNode.connect(context.destination);
    } catch (err) {
        throw new Error(
            `Failed to load audio analyzer WASM module. Further info: ${err.message}`
        );
    }

    return {
        tunerNode: tunerNode,
        inputGainNode: inputGainNode,
    };
}