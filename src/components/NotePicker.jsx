import { Form, Row, Col, Dropdown, CardGroup } from "react-bootstrap";
import NoteCard from "./NoteCard";
import { useEffect, useRef, useReducer } from "react";
import { centsToRatio, intoFirstOctave, ratioToCents } from "../utils/utils";
import { tunings } from "../utils/tunings";

const defaultBase = 440.0;

export default function NotePicker({ pitch, setTuningParams }) {
    const baseFrequencyRef = useRef(null);

    const notesReducer = (state, action) => {
        switch (action.type) {
            case "update-note":
                return {
                    id: state.id, notes: state.notes.map((note, i) => {
                        if (i === action.index) {
                            return action.updatedNote;
                        }
                        return note;
                    })
                }
            case "change-tuning":
                return {id: action.tuningID, notes: action.notes};
            default:
                return state;
        }
    }

    const [tuning, tuningDispatch] = useReducer(notesReducer, { id: 0, notes: tunings[0].notes });

    useEffect(() => {
        console.log("Notes updated:", tuning);
    }, [tuning]);

    // Detect which note is being played and set the tuning parameters accordingly
    useEffect(() => {
        const { pitch: inputPitch, octave } = intoFirstOctave(pitch);
        const baseFrequency = intoFirstOctave(baseFrequencyRef.current.value).pitch;
        const inputCents = ratioToCents(inputPitch / baseFrequency);

        const allowedNotes = tuning.notes.filter(({ enabled, allowedOctaves }) => enabled && allowedOctaves.includes(octave));

        if (!allowedNotes.length) {
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
    }, [tuning, pitch, setTuningParams]);

    return <div className="p-3">
        <Dropdown>
            <Dropdown.Toggle className="py-1">
                Select mode
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {tunings.map((tuning, index) =>
                    <Dropdown.Item key={index} onClick={() => {
                        tuningDispatch({ type: "change-tuning", notes: tuning.notes, tuningID: 100 * index })
                    }}>
                        {tuning.name}
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>

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

        <Row xs={3} sm={4} xxl={6}>
            {
                // Note cards
                tuning.notes.map((note, index) =>
                    <Col key={index} className="p-0">
                        <NoteCard
                            key={tuning.id + index}
                            index={index}
                            note={note}
                            base={baseFrequencyRef.current ? parseFloat(baseFrequencyRef.current.value) : defaultBase}
                            updateNote={(index, updatedNote) => tuningDispatch({
                                type: "update-note",
                                index: index,
                                updatedNote: updatedNote
                            })} />
                    </Col>
                )
            }
        </Row>
    </div>
}