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
                cents: parseFloat(centsRef.current.value),
                allowedOctaves: getUpdatedOctaveList(octave, note.allowedOctaves),
                enabled: enabledRef.current.checked,
            }
        );
    }

    return <Card className="my-0 rounded-0">
        <Card.Header className="p-1">
            <Row className="align-items-center">
                <Col xs={6} className="mx-0">
                    <Form.Control ref={nameRef} type="text" className="p-1" defaultValue={note.name} onChange={() => handleNoteChange(0)} />
                </Col>
                <Col className="d-flex justify-content-end mx-0 my-0">
                    <Form.Check ref={enabledRef} type="checkbox" defaultChecked={note.enabled} onChange={() => handleNoteChange(0)} />
                </Col>
            </Row>
        </Card.Header>

        <Card.Body className="p-1">
            <Row className="align-items-center">
                <Col xs="1"><Form.Label>¢</Form.Label></Col>
                <Col><Form.Control ref={centsRef} className="p-1" type="number" defaultValue={note.cents.toFixed(1)} step={0.1} min={-1200} max={1200} onChange={() => handleNoteChange(0)}></Form.Control></Col>
            </Row>

            <Row className="my-1">
                <Dropdown autoClose="outside">
                    <Dropdown.Toggle variant="secondary" className="py-0 mx-0">Octaves</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {[1, 2, 3, 4, 5, 6, 7].map((octave) => (
                            <Dropdown.Item
                                key={octave - 1}
                                onClick={() => handleNoteChange(octave)}
                            >
                                <Form.Check
                                    type="checkbox"
                                    checked={note.allowedOctaves.includes(octave)}
                                    readOnly
                                    label={" " + octave}
                                />
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Row>

            <Row>
                <Form.Text className="my-0">ω {"= " + (centsRef.current ? getWheelFrequencyFromCents(base, centsRef.current.value) : intoFirstOctave(base).pitch).toFixed(2)} Hz</Form.Text>
            </Row>
        </Card.Body>
    </Card>
}