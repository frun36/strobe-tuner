import { setupAudio } from "./setup_audio.js";

const { context, node } = await setupAudio();

function step(timeStamp) {
    node.port.postMessage({ type: "get-frame" });

    window.requestAnimationFrame(step);
}

let freqInput = document.getElementById("wheel-frequency");
freqInput.oninput = () => { node.port.postMessage({ type: "set-freq", newFreq: freqInput.value }); };
let thresholdInput = document.getElementById("threshold");
thresholdInput.oninput = () => { node.port.postMessage({ type: "set-threshold", newThreshold: thresholdInput.value }); };

window.requestAnimationFrame(step);