import { Row } from "react-bootstrap"

export default function TunerHelper({ desiredPitch, pitch }) {
    const getMessage = (desiredPitch, pitch) => {
        const cents = 1200 * Math.log2(pitch/desiredPitch);

        if (Math.abs(cents) < 1) {
            return "Ok (" + cents.toFixed(2) + ")";
        } else if (cents > 0) {
            return "Sharp (+" + cents.toFixed(2) + ")";
        } else {
            return "Flat (" + cents.toFixed(2) + ")";
        }
    };

    return <Row>
        <p>{getMessage(desiredPitch, pitch)}</p>
    </Row>
}