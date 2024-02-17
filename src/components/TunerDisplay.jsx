import { useEffect, useRef } from "react";
import { Row } from "react-bootstrap";
import TunerHelper from "./TunerHelper";

export default function TunerDisplay({ img, positionBuffer, pitch, apparentOmega, desiredPitch, noteName }) {
    const canvasRef = useRef(null);

    // Update display frame
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
            drawWheel(-position, 0.03);
        });
    }, [positionBuffer, img])

    return <div className="mx-3">
        <Row className="my-1">
            <canvas ref={canvasRef} className="p-0 rounded" width="400" height="200" />
        </Row>
        <Row>
            <TunerHelper pitch={pitch} desiredPitch={desiredPitch} noteName={noteName} />
        </Row>
    </div>
}