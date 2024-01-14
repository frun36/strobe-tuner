import init, { greet, run } from "./pkg/strobe_tuner.js";

import { clear, draw_wheel } from "./render.js"

await init()

// greet();

let waveAnalyzer = new Worker("waveAnalyzer.js");

let getFrameMessage = { getFrame: true, freqChange: 0 };
let minusFreqMessage = { getFrame: false, freqChange: -0.01 };
let plusFreqMessage = { getFrame: false, freqChange: 0.01 };


function step(timeStamp) {
    waveAnalyzer.postMessage(getFrameMessage);

    window.requestAnimationFrame(step);
}

let buttonMinus = document.getElementById("wheel-freq-minus");
let freqLabel = document.getElementById("wheel-freq-label");
let buttonPlus = document.getElementById("wheel-freq-plus");

buttonMinus.onclick = () => { waveAnalyzer.postMessage(minusFreqMessage) };
buttonPlus.onclick = () => { waveAnalyzer.postMessage(plusFreqMessage) };

waveAnalyzer.onmessage = (event) => {
    clear();
    freqLabel.textContent = "Wheel freq: " + Math.round(event.data.freq * 100) / 100;
    draw_wheel(-event.data.position, 1);
};

window.requestAnimationFrame(step);

// run();