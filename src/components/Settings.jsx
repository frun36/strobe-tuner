import { useRef } from "react"

import { Form, Row, Col, Dropdown } from "react-bootstrap";
import NotePicker from "./NotePicker";

export default function Settings({ pitch, updater, defaultSettings }) {
    const inputGainRef = useRef(null);
    const wheelFrequencyRef = useRef(null);
    const filterOnRef = useRef(null);
    const filterOctaveRef = useRef(null);
    const filterQRef = useRef(null);

    const changeHandler = () => {
        const inputGainControl = inputGainRef.current;
        const wheelFrequencyControl = wheelFrequencyRef.current;
        const filterOnControl = filterOnRef.current;
        const filterOctaveControl = filterOctaveRef.current;
        const filterQControl = filterQRef.current;

        updater({
            inputGain: inputGainControl.value,
            wheelFrequency: wheelFrequencyControl.value,
            filterOn: filterOnControl.checked,
            filterOctave: filterOctaveControl.value,
            filterQ: filterQControl.value,
        });
    }

    return <Form>
        <Dropdown>
            <Dropdown.Toggle>
                Select mode
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>Chromatic 12TET</Dropdown.Item>
                <Dropdown.Item>Guitar Standard E</Dropdown.Item>
                <Dropdown.Item>Custom</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        <NotePicker pitch={pitch} setTuningParams={(params) => { console.log(params); }} />
        <Form.Group>
            <Row>
                <Col><Form.Label>Input gain (dB): </Form.Label></Col>
                <Col><Form.Control ref={inputGainRef} type="number" defaultValue={defaultSettings.inputGain} onChange={changeHandler} /></Col>
            </Row>
        </Form.Group>

        <Form.Group>
            <Row>
                <Col><Form.Label>Wheel frequency (Hz): </Form.Label></Col>
                <Col><Form.Control ref={wheelFrequencyRef} type="number" min={0.0} step={0.01} defaultValue={defaultSettings.wheelFrequency} onChange={changeHandler} /></Col>
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
                <Col><Form.Label>Filter octave: </Form.Label></Col>
                <Col><Form.Control ref={filterOctaveRef} type="number" min={1} defaultValue={defaultSettings.filterOctave} max={7} onChange={changeHandler} /></Col>
            </Row>
        </Form.Group>
        <Form.Group>
            <Row>
                <Col><Form.Label>Filter frequency:  </Form.Label></Col>
                <Col><Form.Text as="out">
                    {
                        (wheelFrequencyRef.current && filterOctaveRef.current ?
                            (wheelFrequencyRef.current.value * Math.pow(2, filterOctaveRef.current.value - 1)).toFixed(2) :
                            (defaultSettings.wheelFrequency * Math.pow(2, defaultSettings.filterOctave - 1)).toFixed(2)) + " Hz"
                    }
                </Form.Text></Col>
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