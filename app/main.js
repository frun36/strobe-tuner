import { clear, draw_wheel } from "./render.js";

let tuner = new Worker("Tuner.js", { type: "module" });

function step(timeStamp) {
    tuner.postMessage({ type: "get-frame" });

    window.requestAnimationFrame(step);
}

let buttonMinus = document.getElementById("wheel-freq-minus");
let freqLabel = document.getElementById("wheel-freq-label");
let buttonPlus = document.getElementById("wheel-freq-plus");

buttonMinus.onclick = () => { tuner.postMessage({ type: "change-freq", freqChange: -0.05 }); };
buttonPlus.onclick = () => { tuner.postMessage({ type: "change-freq", freqChange: 0.05 }); };

tuner.onmessage = (event) => {
    let msg = event.data;
    switch (msg.type) {
        case "draw-wheel":
            clear();
            msg.positionBuffer.forEach(position => {
                draw_wheel(-position, 0.1);
            });
            break;
        case "update-freq-label":
            freqLabel.textContent = "Wheel freq: " + msg.newFreq.toFixed(2);
            break;
        default:
            console.error(msg.type + "is not a supported message from tuner");
    }
};

window.requestAnimationFrame(step);