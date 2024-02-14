import { useEffect, useRef } from "react";

import { dBToLinear } from "/src/utils/utils.js";
import { Form, Row, Col } from "react-bootstrap";

export default function Oscilloscope({ buffer, gainLabel }) {
    const inputGainRef = useRef(null);
    const canvasRef = useRef(null);

    // Handle updating buffer
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

    return <div className="my-3">
        <Row className="my-2">
            <Form.Group>
                <Row className="align-items-center">
                    <Col><Form.Label>{gainLabel}</Form.Label></Col>
                    <Col><Form.Control ref={inputGainRef} type="number" defaultValue={0} /></Col>
                </Row>
            </Form.Group>
        </Row>
        <Row>
            <canvas ref={canvasRef} width={600} height={200} style={{
                padding: "0px",
            }} />
        </Row>
    </div>
}