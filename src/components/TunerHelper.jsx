import { Row } from "react-bootstrap"
import { ratioToCents } from "../utils/utils";
import { useEffect, useRef, useState } from "react";

export default function TunerHelper({ desiredPitch, pitch, noteName }) {
    const canvasRef = useRef(null);

    const [needle, setNeedle] = useState({ position: 0, color: "rgb(255, 0, 0)" });

    const drawNeedle = (canvas, position, color) => {
        const canvasCtx = canvas.getContext("2d");
        canvasCtx.fillStyle = "rgb(0, 0, 0)";
        canvasCtx.fillRect(0, 0, 400, 200);

        canvasCtx.strokeStyle = color;
        canvasCtx.lineWidth = 2;

        canvasCtx.beginPath();
        canvasCtx.moveTo(position, 0);
        canvasCtx.lineTo(position, canvas.height);
        canvasCtx.stroke();

        canvasCtx.fillStyle = color;
        canvasCtx.font = "32px Consolas";
        canvasCtx.textBaseline = "middle";
        canvasCtx.textAlign = "center";
        canvasCtx.fillText(noteName, canvas.width / 2, canvas.height / 2);
    }

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const cents = ratioToCents(pitch / desiredPitch);

        const offsetCents = cents < -50 ? 0 : (cents > 50 ? 100 : cents + 50)

        setNeedle((prevNeedle) => {
            const newPosition = 0.9 * prevNeedle.position + 0.1 * offsetCents * 0.01 * canvas.width;
            const centsAbs = Math.abs(newPosition - canvas.width / 2) * 100 / canvas.width;
            let color;

            if (centsAbs > 9) {
                color = "rgb(255, 0, 0)";
            } else if (centsAbs < 3) {
                color = "rgb(0, 255, 0)";
            } else if (centsAbs < 6) {
                color = "rgb(" + 255 * (centsAbs - 3) / 3 + ", 255, 0)";
            } else {
                color = "rgb(255, " + 255 * (9 - centsAbs) / 3 + ", 0)";
            }
            return { position: newPosition, color: color };
        });
    }, [pitch, desiredPitch, canvasRef]);

    useEffect(() => {
        drawNeedle(canvasRef.current, needle.position, needle.color);
    }, [needle]);

    return <Row className="mx-0 p-0 my-1">
        <canvas ref={canvasRef} width={400} height={50} className="p-0 rounded font-monospace" />
    </Row>
}