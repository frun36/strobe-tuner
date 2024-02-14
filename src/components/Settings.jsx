import { useEffect, useRef, useState } from "react"

import { Form, Row, Col } from "react-bootstrap";
import NotePicker from "./NotePicker";

export default function Settings({ pitch, updater, defaultSettings }) {
    // General settings components
    const inputGainRef = useRef(null);
    const filterOnRef = useRef(null);
    const filterQRef = useRef(null);

    // Tuning parameters
    const [tuningParams, setTuningParams] = useState({
        wheelFrequency: defaultSettings.wheelFrequency,
        octave: defaultSettings.filterOctave,
        noteName: defaultSettings.noteName,
    });
    
    // Handling changed settings
    const changeHandler = () => {
        updater({
            inputGain: parseFloat(inputGainRef.current.value),
            wheelFrequency: tuningParams.wheelFrequency,
            filterOn: parseFloat(filterOnRef.current.checked),
            filterOctave: tuningParams.octave,
            filterQ: parseFloat(filterQRef.current.value),
            noteName: tuningParams.noteName,
        });
    }

    useEffect(() => {
        changeHandler();
    }, [tuningParams]);

    
    return <Form>
        <NotePicker pitch={pitch} setTuningParams={setTuningParams} />
        <Form.Group>
            <Row className="align-items-center my-1">
                <Col><Form.Label>Input gain (dB): </Form.Label></Col>
                <Col><Form.Control ref={inputGainRef} type="number" defaultValue={defaultSettings.inputGain} onChange={changeHandler} /></Col>
            </Row>
        </Form.Group>

        <Form.Group>
            <Row className="align-items-center my-1">
                <Col><Form.Label>Enable bandpass filter</Form.Label></Col>
                <Col><Form.Check ref={filterOnRef} type="switch" defaultChecked={defaultSettings.filterOn} onChange={changeHandler} /></Col>
            </Row>
        </Form.Group>

        <Form.Group>
            <Row className="align-items-center my-1">
                <Col><Form.Label>Filter q: </Form.Label></Col>
                <Col><Form.Control ref={filterQRef} type="number" min={0.1} defaultValue={defaultSettings.filterQ} step={0.1} onChange={changeHandler} /></Col>
            </Row>
        </Form.Group>
    </Form >
}