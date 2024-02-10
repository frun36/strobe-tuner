import { useEffect, useRef } from "react";

import { dBToLinear } from "/src/utils/utils.js";

export default function Oscilloscope({ buffer, gainLabel }) {
    const inputGainRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvasCtx = canvasRef.current.getContext("2d");
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        const gain = dBToLinear(inputGainRef.current.value);

        // Draw
        canvasCtx.fillStyle = "rgb(0, 0, 0)";
        canvasCtx.fillRect(0, 0, width, height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0, 255, 0)";

        canvasCtx.beginPath();

        const sliceWidth = (width * 1.0) / buffer.length;
        let x = 0;

        for (let i = 0; i < buffer.length; i++) {
            const y = buffer[i] * gain * height * 0.5 + height * 0.5;
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }

        canvasCtx.lineTo(width, height / 2);
        canvasCtx.stroke();
    }, [buffer]);

    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }}>
        <label htmlFor="inputGain">{gainLabel}</label>
        <input ref={inputGainRef} id="inputGain" type="number" defaultValue={0} />
        <canvas ref={canvasRef} width={600} height={200} />
    </div>
}