import { Form, Row, Col, CardGroup } from "react-bootstrap";
import NoteCard from "./NoteCard";
import { useEffect, useRef, useState } from "react";
import { intoFirstOctave } from "../utils/utils";

const defaultBase = 440.0;

export default function NotePicker({ mode }) {
    const baseRef = useRef(null);

    const [notes, setNotes] = useState(
        [{ name: "E", cents: -500, allowedOctaves: [2, 3, 4, 5], enabled: true },
        { name: "A", cents: 0, allowedOctaves: [2, 3], enabled: false }]
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
        <CardGroup>
            {notes.map((note, index) =>
                <NoteCard
                    key={index}
                    index={index}
                    note={note}
                    base={baseRef.current ? baseRef.current.value : defaultBase}
                    updateNote={updateNote}
                />)}
        </CardGroup>
    </div>
}