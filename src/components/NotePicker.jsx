import { Form, Row, Col } from "react-bootstrap";
import NoteCard from "./NoteCard";
import { useEffect, useRef, useState } from "react";
import { centsToRatio, intoFirstOctave, ratioToCents } from "../utils/utils";

const defaultBase = 440.0;

export default function NotePicker({ pitch, setTuningParams }) {
    const baseFrequencyRef = useRef(null);

    const [notes, setNotes] = useState(
        [{ name: "E", cents: -500, allowedOctaves: [2, 3], enabled: true },
        { name: "A", cents: 0, allowedOctaves: [2, 3], enabled: true },
        { name: "D", cents: -700, allowedOctaves: [3, 4], enabled: true },
        { name: "G", cents: -200, allowedOctaves: [3, 4], enabled: true },
        { name: "B", cents: 200, allowedOctaves: [3, 4], enabled: true },
        { name: "E", cents: -500, allowedOctaves: [4, 5], enabled: true }]
    );

    const updateNoteSettings = (index, updatedNote) => {
        setNotes((prevNotes) => {
            return prevNotes.map((note, i) => {
                if (i === index) {
                    return updatedNote;
                }
                return note;
            });
        });
    };

    // Detect which note is being played and set the tuning parameters accordingly
    useEffect(() => {
        const { pitch: inputPitch, octave } = intoFirstOctave(pitch);
        const baseFrequency = intoFirstOctave(baseFrequencyRef.current.value).pitch;
        const inputCents = ratioToCents(inputPitch / baseFrequency);

        const allowedNotes = notes.filter(({enabled, allowedOctaves}) => enabled && allowedOctaves.includes(octave));
        
        if(!allowedNotes.length) {
            return;
        }

        let bestNote = allowedNotes[0];
        allowedNotes.forEach((note, index) => {
            if (Math.abs(note.cents - inputCents) < Math.abs(bestNote.cents - inputCents)) {
                bestNote = allowedNotes[index];
            }
        });

        setTuningParams({
            wheelFrequency: centsToRatio(bestNote.cents) * baseFrequency,
            octave: octave,
            noteName: bestNote.name,
        });
    }, [notes, pitch, setTuningParams]);

    return <div>{/* <Dropdown>
    <Dropdown.Toggle>
        Select mode
    </Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item>Chromatic 12TET</Dropdown.Item>
        <Dropdown.Item>Guitar Standard E</Dropdown.Item>
        <Dropdown.Item>Custom</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown> */}
        <Form.Group>
            <Row className="align-items-center my-2">
                <Col xs={1}>
                    <Form.Label>A₄</Form.Label>
                </Col>
                <Col xs={3}>
                    <Form.Control ref={baseFrequencyRef} type="number" defaultValue={defaultBase} step={0.1} min={220} max={880} />
                </Col>
                <Col>
                    <Form.Text>Wheel base: {intoFirstOctave(baseFrequencyRef.current ? baseFrequencyRef.current.value : defaultBase).pitch} Hz</Form.Text>
                </Col>
            </Row>
        </Form.Group>

        <Row>
            {
                // Note cards
                notes.map((note, index) =>
                    <Col key={index}><NoteCard
                        key={index}
                        index={index}
                        note={note}
                        base={baseFrequencyRef.current ? baseFrequencyRef.current.value : defaultBase}
                        updateNote={updateNoteSettings} /></Col>)
            }
        </Row>
    </div>
}