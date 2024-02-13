import { Row } from "react-bootstrap"

export default function TunerHelper({ desiredPitch, pitch }) {
    const getMessage = (desiredPitch, pitch) => {
        const cents = 1200 * Math.log2(pitch / desiredPitch);

        if (Math.abs(cents) < 3) {
            return "ok";
        } else if (cents > 0) {
            return "sharp";
        } else {
            return "flat";
        }
    };

    const message = getMessage(desiredPitch, pitch);

    const color = message == "ok" ? "text-success" : "text-danger";
    const display = (message == "flat" ? "► " : "▻ ") + desiredPitch.toFixed(2) + (message == "sharp" ? " ◄" : " ◅")

    return <Row className="mx-auto text-center">
        <p className={color + " rounded"} style={{
            fontSize: 64,
            backgroundColor: "#000000",
        }}>{display}</p>
    </Row >
}