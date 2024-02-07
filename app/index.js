import { setupAudio } from "./setup_audio.js";
import { Backlight, Wheel } from "./render.js";
import { dBToLinear } from "./utils.js";
import Oscilloscope from "./oscilloscope.js";

let lastTimeStamp = 0;
function step(timeStamp) {
    node.port.postMessage({ type: "get-frame" });

    document.getElementById("fps").value = (1000 / (timeStamp - lastTimeStamp)).toFixed(2);
    lastTimeStamp = timeStamp;

    window.requestAnimationFrame(step);
}

function UIEventHandler(msg) {
    switch (msg.type) {
        case "draw-frame":
            // console.log(msg.inputBuffer);
            backlight.clear(1);
            msg.positionBuffer.forEach(position => {
                wheel.draw(-position, 0.01);
            });
            inputPitch.value = msg.pitch.toFixed(2);
            inputOscilloscope.draw(msg.inputBuffer);
            outputOscilloscope.draw(msg.outputBuffer);
            break;
        case "rms-input-level":
            inputLevel.value = msg.level.toFixed(2);
            break;
        default:
            console.error(msg.type + " is not a supported message from tuner");
    }
}

let { _context, node, inputGainNode } = await setupAudio();
node.UIEventHandler = UIEventHandler;

let freqInput = document.getElementById("wheel-frequency");

let filterOn = document.getElementById("filter-on");

let filterOctave = document.getElementById("filter-octave");

let filterQ = document.getElementById("filter-q");

let settings = document.getElementById("frequency-settings").elements;
for (let i = 0; i < settings.length; i++) {
    settings[i].oninput = () => {
        document.getElementById("filter-frequency").value = (freqInput.value * Math.pow(2, filterOctave.value - 1)).toFixed(2);
        node.port.postMessage({
            type: "update-params",
            wheelFrequency: freqInput.value,
            filterOn: filterOn.checked,
            filterOctave: filterOctave.value,
            filterQ: filterQ.value,
        });
    };
}

let inputPitch = document.getElementById("input-pitch");

let inputLevel = document.getElementById("rms-input-level");
let canvasCtx = document.getElementById("canvas").getContext("2d");

let inputGain = document.getElementById("input-gain");
inputGain.oninput = () => inputGainNode.gain.value = dBToLinear(inputGain.value);

let inputOscilloscopeGain = document.getElementById("input-oscilloscope-gain");
inputOscilloscopeGain.onclick = () => inputOscilloscope.gain = dBToLinear(inputOscilloscopeGain.value);
let inputOscilloscope = new Oscilloscope(document.getElementById("input-oscilloscope"), dBToLinear(inputOscilloscopeGain.value));

let outputOscilloscopeGain = document.getElementById("output-oscilloscope-gain");
outputOscilloscopeGain.onclick = () => outputOscilloscope.gain = dBToLinear(outputOscilloscopeGain.value);
let outputOscilloscope = new Oscilloscope(document.getElementById("output-oscilloscope"), dBToLinear(outputOscilloscopeGain.value));

let wheel = new Wheel(canvasCtx);
let backlight = new Backlight(canvasCtx);

document.getElementById("filter-frequency").value = (freqInput.value * Math.pow(2, filterOctave.value - 1)).toFixed(2);
window.requestAnimationFrame(step);