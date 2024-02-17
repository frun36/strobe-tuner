import { ratioToCents } from "./utils.js";

const noteNamesSharp = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const noteNamesFlat = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

function createNote(name, cents, allowedOctaves) {
    return {
        name,
        cents,
        allowedOctaves,
        enabled: true,
    };
}

function generate12TET(noteNames) {
    const centsC = -900;
    let notes = []
    noteNames.forEach((name, index) =>
        notes.push(createNote(name, centsC + index * 100, [1, 2, 3, 4, 5, 6, 7])
        ));
    return notes;
}

const tuning12TETSharp = { name: "12TET", notes: generate12TET(noteNamesSharp) };
// const tuning12TETFlat = generate12TET(noteNamesFlat);

const tuning6GuitStd = {
    name: "Guitar E standard", notes: [
        { name: "E", cents: -500, allowedOctaves: [2, 3], enabled: true },
        { name: "A", cents: 0, allowedOctaves: [2, 3], enabled: true },
        { name: "D", cents: -700, allowedOctaves: [3, 4], enabled: true },
        { name: "G", cents: -200, allowedOctaves: [3, 4], enabled: true },
        { name: "B", cents: 200, allowedOctaves: [3, 4], enabled: true },
        { name: "E", cents: -500, allowedOctaves: [4, 5], enabled: true },
    ]
};

const tuning6GuitEb = {
    name: "Guitar Eb", notes: [
        { name: "E♭", cents: -600, allowedOctaves: [2, 3], enabled: true },
        { name: "A♭", cents: -100, allowedOctaves: [2, 3], enabled: true },
        { name: "D♭", cents: -800, allowedOctaves: [3, 4], enabled: true },
        { name: "G♭", cents: -300, allowedOctaves: [3, 4], enabled: true },
        { name: "B♭", cents: 100, allowedOctaves: [3, 4], enabled: true },
        { name: "E♭", cents: -600, allowedOctaves: [4, 5], enabled: true },
    ]
};

const tuning6GuitJT = {
    name: "Guitar E James Taylor", notes: [
        { name: "E", cents: -512, allowedOctaves: [2, 3], enabled: true },
        { name: "A", cents: -10, allowedOctaves: [2, 3], enabled: true },
        { name: "D", cents: -708, allowedOctaves: [3, 4], enabled: true },
        { name: "G", cents: -204, allowedOctaves: [3, 4], enabled: true },
        { name: "B", cents: 194, allowedOctaves: [3, 4], enabled: true },
        { name: "E", cents: -503, allowedOctaves: [4, 5], enabled: true },
    ]
};

const tuningViolin = {
    name: "Violin", notes: [
        { name: "G", cents: ratioToCents((2 / 3) * (2 / 3) * 2), allowedOctaves: [3, 4], enabled: true },
        { name: "D", cents: ratioToCents(2 / 3), allowedOctaves: [4, 5], enabled: true },
        { name: "A", cents: 0, allowedOctaves: [4, 5], enabled: true },
        { name: "E", cents: ratioToCents(3 / 2), allowedOctaves: [4, 5], enabled: true },
    ]
};

const tuningViola = {
    name: "Viola", notes: [
        { name: "C", cents: ratioToCents((2 / 3) * (2 / 3) * (2 / 3) * 2), allowedOctaves: [3, 4], enabled: true },
        { name: "G", cents: ratioToCents((2 / 3) * (2 / 3) * 2), allowedOctaves: [3, 4], enabled: true },
        { name: "D", cents: ratioToCents(2 / 3), allowedOctaves: [4, 5], enabled: true },
        { name: "A", cents: 0, allowedOctaves: [4, 5], enabled: true },
    ]
};

const tuningSingle = {
    name: "Single", notes: [
        { name: "A", cents: 0, allowedOctaves: [1, 2, 3, 4, 5, 6, 7], enabled: true },
    ]
}

export const tunings = [
    tuning12TETSharp,
    tuning6GuitStd,
    tuning6GuitEb,
    tuning6GuitJT,
    tuningViolin,
    tuningViola,
    tuningSingle,
];