import init, { greet, run } from "./pkg/strobe_tuner.js";

import { clear, draw_wheel } from "./render.js"

await init()

// greet();

let waveAnalyzer = new Worker("waveAnalyzer.js");

let get_positions_message = { len: 16 };

function step(timeStamp) {
    waveAnalyzer.postMessage(get_positions_message);

    window.requestAnimationFrame(step);
}

waveAnalyzer.onmessage = (msg) => {
    clear();
    draw_wheel(msg.data.position, 1);
};

window.requestAnimationFrame(step);

// run();