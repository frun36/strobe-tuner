import { setupAudio } from "./setup_audio.js";

const { _context, node, inputOscilloscope, outputOscilloscope } = await setupAudio();

function step(_timeStamp) {
    node.port.postMessage({ type: "get-frame" });

    inputOscilloscope.draw();
    outputOscilloscope.draw();

    window.requestAnimationFrame(step);
}

let freqInput = document.getElementById("wheel-frequency");
freqInput.oninput = () => { node.port.postMessage({ type: "set-freq", newFreq: freqInput.value }); };

window.requestAnimationFrame(step);