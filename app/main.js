import { setupAudio } from "./setup_audio.js";

const { context, node } = await setupAudio();

function step(timeStamp) {
    node.port.postMessage({ type: "get-frame" });

    window.requestAnimationFrame(step);
}

let freqInput = document.getElementById("wheel-frequency");
freqInput.oninput = () => { node.port.postMessage({ type: "set-freq", newFreq: freqInput.value }); };

window.requestAnimationFrame(step);