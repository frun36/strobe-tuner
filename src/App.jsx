import { useEffect, useRef, useState } from "react";
import { setupAudio } from "./audio/setupAudio";
import TunerDisplay from "./components/TunerDisplay"
import Oscilloscope from "./components/Oscilloscope";
import Settings from "./components/Settings";
import { dBToLinear } from "./utils/utils";
import wheelImageUrl from "/wheel.png?url";

import { Container, Row, Col } from "react-bootstrap";

export default function App() {
    const defaultSettings = {
        inputGain: 0,
        wheelFrequency: 55.00,
        filterOn: true,
        filterOctave: 4,
        filterQ: 8.,
    };

    const [tunerNode, setAudioNode] = useState(null);
    const [inputGainNode, setInputGainNode] = useState(null);
    const [currentSettings, setCurrentSettings] = useState(defaultSettings);

    const imgRef = useRef(null);

    const [frame, setFrame] = useState({
        inputBuffer: [],
        outputBuffer: [],
        positionBuffer: [],
        pitch: 0.,
        apparentOmega: 0.,
    });

    useEffect(() => {
        tunerNode && tunerNode.port.postMessage({
            type: "update-settings",
            wheelFrequency: currentSettings.wheelFrequency,
            filterOn: currentSettings.filterOn,
            filterOctave: currentSettings.filterOctave,
            filterQ: currentSettings.filterQ,
        });

        inputGainNode && (inputGainNode.gain.value = dBToLinear(currentSettings.inputGain));
    }, [currentSettings, tunerNode, inputGainNode]);

    useEffect(() => {
        const awaitSetupAudio = async () => {
            const { tunerNode, inputGainNode } = await setupAudio();
            tunerNode.UIEventHandler = (msg) => {
                switch (msg.type) {
                    case "frame":
                        // console.log(msg.frame);
                        setFrame(msg.frame);
                        break;
                    default:
                        console.error(msg.type + " is not a supported message from tuner");
                }
            };
            setAudioNode(tunerNode);
            setInputGainNode(inputGainNode);
        }
        awaitSetupAudio();
    }, [])

    useEffect(() => {
        function step() {
            tunerNode && tunerNode.port.postMessage({ type: "get-frame" });

            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }, [tunerNode]);


    return <>
        <img ref={imgRef} src={wheelImageUrl} style={{ display: "none" }} />
        <Container fluid="sm">
            <Row className="mx-auto">
                <Col xs={0} lg={3}></Col>
                <Col xs={12} lg={6}>
                    <h1>Strobe tuner</h1>
                    <TunerDisplay img={imgRef.current} positionBuffer={frame.positionBuffer} pitch={frame.pitch} apparentOmega={frame.apparentOmega} />
                    <Settings updater={setCurrentSettings} defaultSettings={defaultSettings} />
                    <Oscilloscope buffer={frame.inputBuffer} gainLabel="Input oscilloscope gain: " />
                    <Oscilloscope buffer={frame.outputBuffer} gainLabel="Output oscilloscope gain: " />
                </Col>
                <Col xs={0} lg={3}></Col>
            </Row>
        </Container>
    </>
}
