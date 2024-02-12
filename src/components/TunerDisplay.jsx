import { useEffect, useRef } from "react";
import { Row } from "react-bootstrap";
import TunerHelper from "./TunerHelper";

export default function TunerDisplay({ img, positionBuffer, pitch, apparentOmega, desiredPitch }) {
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
            drawWheel(-position, 0.06);
        });
    }, [positionBuffer, img])

    return <div className="my-4 text-center">
        <Row>
            <canvas ref={canvasRef} width="400" height="200" style={{
                borderRadius: "10px",
                padding: "0px",
            }} />
        </Row>
        <Row>
            <label htmlFor="inputFrequency">Pitch (Hz): </label>
            <output id="inputFrequency">{pitch.toFixed(2)}</output>
        </Row>
        <Row>
            <label htmlFor="apparentOmega">Apparent wheel angular velocity (wildly inaccurate): </label>
            <output id="apparentOmega">{(apparentOmega.toFixed(2))}</output>
        </Row>
        <Row>
            <TunerHelper pitch={pitch} desiredPitch={desiredPitch} />
        </Row>
    </div>
}