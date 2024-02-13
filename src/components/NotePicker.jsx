import { Form, Row, Col, CardGroup } from "react-bootstrap";
import NoteCard from "./NoteCard";
import { useEffect, useRef, useState } from "react";
import { centsToRatio, intoFirstOctave, ratioToCents } from "../utils/utils";

const defaultBase = 440.0;

export default function NotePicker({ pitch, setTuningParams }) {
    const baseRef = useRef(null);

    const [notes, setNotes] = useState(
        [{ name: "E", cents: -500, allowedOctaves: [2, 3], enabled: true },
        { name: "A", cents: 0, allowedOctaves: [2, 3], enabled: true },
        { name: "D", cents: -700, allowedOctaves: [3, 4], enabled: true },
        { name: "G", cents: -200, allowedOctaves: [3, 4], enabled: true },
        { name: "B", cents: 200, allowedOctaves: [3, 4], enabled: true },
        { name: "E", cents: -500, allowedOctaves: [4, 5], enabled: true }]
    );

    const updateNote = (index, updatedNote) => {
        setNotes((prevNotes) => {
            return prevNotes.map((note, i) => {
                if (i === index) {
                    return updatedNote;
                }
                return note;
            });
        });
    };

    useEffect(() => {
        const { pitch: inputPitch, octave } = intoFirstOctave(pitch);
        const base = intoFirstOctave(baseRef.current.value).pitch;
        const inputCents = ratioToCents(inputPitch / base);

        let bestIndex = 0;
        notes.forEach(({ cents, enabled, allowedOctaves }, index) => {
            if (!(enabled && allowedOctaves.includes(octave))) {
                return;
            }
            if (Math.abs(cents - inputCents) < Math.abs(notes[bestIndex].cents - inputCents)) {
                bestIndex = index;
            }
        });

        const bestNote = notes[bestIndex];

        setTuningParams({
            wheelFrequency: centsToRatio(bestNote.cents) * base,
            octave: octave,
            noteName: bestNote.name,
        })

    }, [notes, pitch, setTuningParams]);

    useEffect(() => {
        console.log(notes);
    }, [notes]);

    return <div>
        <Form.Group>
            <Row>
                <Col xs={1}><Form.Label>A4</Form.Label></Col>
                <Col xs={3}><Form.Control ref={baseRef} type="number" defaultValue={defaultBase} step={0.1} min={220} max={880}></Form.Control></Col>
                <Col><Form.Text>Wheel base: {intoFirstOctave(baseRef.current ? baseRef.current.value : defaultBase).pitch} Hz</Form.Text></Col>
            </Row>
        </Form.Group>
        <Row>
            {
                notes.map((note, index) =>
                    <Col key={index}><NoteCard
                        key={index}
                        index={index}
                        note={note}
                        base={baseRef.current ? baseRef.current.value : defaultBase}
                        updateNote={updateNote} /></Col>)
            }
        </Row>
    </div>
}