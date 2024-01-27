import { setupAudio } from "./setup_audio.js";
import { Backlight, Wheel } from "./render.js";
import { dBToLinear } from "./utils.js";

function step(_timeStamp) {
    node.port.postMessage({ type: "get-frame" });

    inputOscilloscope.draw();
    outputOscilloscope.draw();

    window.requestAnimationFrame(step);
}

function UIEventHandler(msg) {
    switch (msg.type) {
        case "draw-wheel":
            // console.log(msg.positionBuffer);
            backlight.clear();
            msg.positionBuffer.forEach(position => {
                wheel.draw(-position, 0.01);
            });
            break;
        case "update-params":
            freqInput.value = msg.newFreq.toFixed(2);
            filterToggle.checked = msg.filter;
            break;
        case "rms-input-level":
            inputLevel.textContent = "RMS input level: " + msg.level.toFixed(2);
            break;
        default:
            console.error(msg.type + " is not a supported message from tuner");
    }
}

let { _context, node, inputGainNode, inputOscilloscope, outputOscilloscope } = await setupAudio();
node.UIEventHandler = UIEventHandler;

let freqInput = document.getElementById("wheel-frequency");
freqInput.oninput = () => node.port.postMessage({ type: "set-freq", newFreq: freqInput.value });

let inputLevel = document.getElementById("rms-input-level");
let canvasCtx = document.getElementById("canvas").getContext("2d");

let filterToggle = document.getElementById("filter");
filterToggle.oninput = () => node.port.postMessage({ type: "toggle-filter", filter: filterToggle.checked });

let inputGain = document.getElementById("input-gain");
inputGain.oninput = () => inputGainNode.gain.value = dBToLinear(inputGain.value);

let inputOscilloscopeGain = document.getElementById("input-oscilloscope-gain");
inputOscilloscopeGain.onclick = () => inputOscilloscope.gain = dBToLinear(inputOscilloscopeGain.value);

let outputOscilloscopeGain = document.getElementById("output-oscilloscope-gain");
outputOscilloscopeGain.onclick = () => outputOscilloscope.gain = dBToLinear(outputOscilloscopeGain.value);

let wheel = new Wheel(canvasCtx);
let backlight = new Backlight(canvasCtx);

window.requestAnimationFrame(step);