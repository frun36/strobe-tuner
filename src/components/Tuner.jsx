import { useEffect, useRef } from "react";

export default function Tuner({ positionBuffer, img }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        let canvasCtx = canvasRef.current.getContext("2d");

        const drawWheel = (rotation, alpha) => {
            canvasCtx.save();
            canvasCtx.globalAlpha = alpha;
            canvasCtx.translate(200, 200);
            canvasCtx.rotate(rotation);
            canvasCtx.globalCompositeOperation = 'source-over';
            canvasCtx.drawImage(img, -img.width / 2, -img.height / 2);
            canvasCtx.restore();
        }

        const setBacklight = (brightness) => {
            canvasCtx.fillStyle = "rgb(" + brightness * 255 + ", " + brightness * 255 + ", " + brightness * 255 + ")";
            canvasCtx.fillRect(0, 0, 400, 400);
        }

        setBacklight(1);
        positionBuffer.forEach(position => {
            drawWheel(-position, 0.01);
        });
    }, [positionBuffer, img])

    return <>
        <canvas ref={canvasRef} width="400" height="200" />
    </>
}