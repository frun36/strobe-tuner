import { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Form, Dropdown } from "react-bootstrap";
import { centsToRatio, intoFirstOctave } from "../utils/utils";

export default function NoteCard({ index, base, note, updateNote }) {
    const nameRef = useRef(null);
    const centsRef = useRef(null);
    const enabledRef = useRef(null);

    const getWheelFrequencyFromCents = (base, cents) => {
        return intoFirstOctave(base).pitch *
            centsToRatio(cents);
    }
    
    const getUpdatedOctaveList = (octave, prevOctaves) => {
        if (octave === 0) {
            return prevOctaves;
        }
        else if (prevOctaves.includes(octave)) {
            return prevOctaves.filter((o) => o != octave);
        } else {
            return [...prevOctaves, octave];
        }
    };

    const handleNoteChange = (octave = 0) => {
        updateNote(
            index,
            {
                name: nameRef.current.value,
                cents: centsRef.current.value,
                enabled: enabledRef.current.checked,
                allowedOctaves: getUpdatedOctaveList(octave, note.allowedOctaves),
            }
        );
    }

    return <Card className="my-1">
        <Card.Header>
            <Row className="align-items-center">
                <Col xs={4}>
                    <Form.Control ref={nameRef} type="text" defaultValue={note.name} onChange={() => handleNoteChange(0)} />
                </Col>
                <Col className="d-flex justify-content-end">
                    <Form.Check ref={enabledRef} type="switch" defaultChecked={note.enabled} onChange={() => handleNoteChange(0)} />
                </Col>
            </Row>
        </Card.Header>

        <Card.Body>
            <Row className="align-items-center">
                <Col xs="4"><Form.Label>Cents:</Form.Label></Col>
                <Col><Form.Control ref={centsRef} type="number" defaultValue={note.cents} step={0.1} min={-1200} max={1200} onChange={() => handleNoteChange(0)}></Form.Control></Col>
            </Row>

            <Row className="my-2">
                <Dropdown>
                    <Dropdown.Toggle variant="secondary">Allowed octaves</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {[1, 2, 3, 4, 5, 6, 7].map((octave) => (
                            <Dropdown.Item
                                key={octave - 1}
                                onClick={() => handleNoteChange(octave)}
                            ><input
                                    type="checkbox"
                                    checked={note.allowedOctaves.includes(octave)}
                                    readOnly
                                />
                                {" " + octave}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
            
            <Row>
                <Form.Text>Wheel: {(centsRef.current ? getWheelFrequencyFromCents(base, centsRef.current.value) : base).toFixed(4)} Hz</Form.Text>
            </Row>
        </Card.Body>
    </Card>
}