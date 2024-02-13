import { useEffect, useRef, useState } from "react"

import { Form, Row, Col, Dropdown } from "react-bootstrap";
import NotePicker from "./NotePicker";

export default function Settings({ pitch, updater, defaultSettings }) {
    const inputGainRef = useRef(null);
    const filterOnRef = useRef(null);
    const filterQRef = useRef(null);

    const [tuningParams, setTuningParams] = useState({
        wheelFrequency: defaultSettings.wheelFrequency,
        octave: defaultSettings.filterOctave,
        noteName: defaultSettings.noteName,
    });

    const changeHandler = () => {
        updater({
            inputGain: inputGainRef.current.value,
            wheelFrequency: tuningParams.wheelFrequency,
            filterOn: filterOnRef.current.checked,
            filterOctave: tuningParams.octave,
            filterQ: filterQRef.current.value,
            noteName: tuningParams.noteName,
        });
    }

    useEffect(() => {
        changeHandler();
    }, [tuningParams]);

    return <Form>
        {/* <Dropdown>
            <Dropdown.Toggle>
                Select mode
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>Chromatic 12TET</Dropdown.Item>
                <Dropdown.Item>Guitar Standard E</Dropdown.Item>
                <Dropdown.Item>Custom</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown> */}
        <NotePicker pitch={pitch} setTuningParams={setTuningParams} />
        <Form.Group>
            <Row>
                <Col><Form.Label>Input gain (dB): </Form.Label></Col>
                <Col><Form.Control ref={inputGainRef} type="number" defaultValue={defaultSettings.inputGain} onChange={changeHandler} /></Col>
            </Row>
        </Form.Group>

        <Form.Group>
            <Row>
                <Col><Form.Label>Enable bandpass filter</Form.Label></Col>
                <Col><Form.Check ref={filterOnRef} type="switch" defaultChecked={defaultSettings.filterOn} onChange={changeHandler} /></Col>
            </Row>
        </Form.Group>

        <Form.Group>
            <Row>
                <Col><Form.Label>Filter q: </Form.Label></Col>
                <Col><Form.Control ref={filterQRef} type="number" min={0.1} defaultValue={defaultSettings.filterQ} step={0.1} onChange={changeHandler} /></Col>
            </Row>
        </Form.Group>
    </Form >
}