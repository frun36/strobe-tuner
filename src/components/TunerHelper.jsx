import { Row } from "react-bootstrap"
import { ratioToCents } from "../utils/utils";

export default function TunerHelper({ desiredPitch, pitch, noteName }) {
    const getMessage = (desiredPitch, pitch) => {
        const cents = ratioToCents(pitch / desiredPitch);

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
    // const display = (message == "flat" ? "► " : "▻ ") + noteName + (message == "sharp" ? " ◄" : " ◅")
    const display = (message == "flat" ? "▶ " : "▷ ") + noteName + (message == "sharp" ? " ◀" : " ◁")

    return <Row className="mx-auto text-center">
        <p className={color + " rounded font-monospace"} style={{
            fontSize: 64,
            backgroundColor: "#000000",
        }}>{display}</p>
    </Row >
}