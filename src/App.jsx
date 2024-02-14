import { useEffect, useRef, useState } from "react";
import { setupAudio } from "./audio/setupAudio";
import TunerDisplay from "./components/TunerDisplay"
import Oscilloscope from "./components/Oscilloscope";
import Settings from "./components/Settings";
import { dBToLinear } from "./utils/utils";
import wheelImageUrl from "/wheel.png?url";

import { Container, Row, Col, Accordion } from "react-bootstrap";

export default function App() {
    // WebAudio state
    const [tunerNode, setAudioNode] = useState(null);
    const [inputGainNode, setInputGainNode] = useState(null);

    // Rendering state
    const imgRef = useRef(null);
    const [frame, setFrame] = useState({
        inputBuffer: [],
        outputBuffer: [],
        positionBuffer: [],
        pitch: 0.,
        apparentOmega: 0.,
    });

    // Setup WebAudio and tunerNode-UI connection
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

    // General settings and tuning parameters
    const defaultSettings = {
        inputGain: 0,
        wheelFrequency: 55.00,
        filterOn: true,
        filterOctave: 4,
        filterQ: 8.,
        noteName: "A",
    };
    const [currentSettings, setCurrentSettings] = useState(defaultSettings);

    const [desiredPitch, setDesiredPitch] = useState(defaultSettings.wheelFrequency * Math.pow(2, currentSettings.filterOctave - 1));
    const [noteName, setNoteName] = useState(defaultSettings.noteName);

    // Update settings and note params
    useEffect(() => {
        tunerNode && tunerNode.port.postMessage({
            type: "update-settings",
            wheelFrequency: currentSettings.wheelFrequency,
            filterOn: currentSettings.filterOn,
            filterOctave: currentSettings.filterOctave,
            filterQ: currentSettings.filterQ,
        });

        inputGainNode && (inputGainNode.gain.value = dBToLinear(currentSettings.inputGain));
        setDesiredPitch(currentSettings.wheelFrequency * Math.pow(2, currentSettings.filterOctave - 1))
        setNoteName(currentSettings.noteName);
    }, [currentSettings, tunerNode, inputGainNode]);

    // Animation loop
    useEffect(() => {
        function step() {
            tunerNode && tunerNode.port.postMessage({ type: "get-frame" });

            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }, [tunerNode]);


    return <Container fluid="sm" className="p-1">
        <img ref={imgRef} src={wheelImageUrl} style={{ display: "none" }} />
        <Row className="mx-auto">
            <Col xs={0} lg={3}></Col>

            <Col xs={12} lg={6} className="mx-0 p-0">
                <h1>Strobe tuner</h1>
                <TunerDisplay img={imgRef.current}
                    positionBuffer={frame.positionBuffer}
                    pitch={frame.pitch}
                    apparentOmega={frame.apparentOmega}
                    desiredPitch={desiredPitch}
                    noteName={noteName} />

                <Accordion defaultActiveKey={["0"]} alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Settings</Accordion.Header>
                        <Accordion.Body className="p-0">
                            <Settings pitch={frame.pitch} updater={setCurrentSettings} defaultSettings={defaultSettings} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Signal analysis</Accordion.Header>
                        <Accordion.Body className="p-0">
                            <Oscilloscope buffer={frame.inputBuffer} gainLabel="Input oscilloscope gain: " />
                            <Oscilloscope buffer={frame.outputBuffer} gainLabel="Output oscilloscope gain: " />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>

            <Col xs={0} lg={3}></Col>
        </Row>
    </Container>
}
