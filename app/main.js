import { clear, draw_wheel } from "./render.js";

let tuner = new Worker("Tuner.js", { type: "module" });

function step(timeStamp) {
    tuner.postMessage({ type: "get-frame" });

    window.requestAnimationFrame(step);
}

let freqInput = document.getElementById("wheel-frequency");
freqInput.oninput = () => { tuner.postMessage({ type: "set-freq", newFreq: freqInput.value }); };

tuner.onmessage = (event) => {
    let msg = event.data;
    // console.log("Main got message type: " + msg.type);
    switch (msg.type) {
        case "draw-wheel":
            // console.log(msg.positionBuffer);
            clear();
            msg.positionBuffer.forEach(position => {
                draw_wheel(-position, 0.2);
            });
            break;
        case "update-freq-value":
            freqInput.value = msg.newFreq.toFixed(2);
            break;
        default:
            console.error(msg.type + "is not a supported message from tuner");
    }
};

window.requestAnimationFrame(step);