import { useRef } from "react"

export default function Settings({ updater, defaultSettings }) {
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
            inputGain: inputGainControl ? inputGainControl.value : defaultSettings.inputGain,
            wheelFrequency: wheelFrequencyControl ? wheelFrequencyControl.value : defaultSettings.wheelFrequency,
            filterOn: filterOnControl ? filterOnControl.checked : defaultSettings.filterOn,
            filterOctave: filterOctaveControl ? filterOctaveControl.value : defaultSettings.filterOctave,
            filterQ: filterQControl ? filterQControl.value : defaultSettings.filterQ,
        });
    }

    return <>
        <label htmlFor="inputGain">Input gain (dB): </label>
        <input ref={inputGainRef} type="number" id="inputGain" defaultValue={defaultSettings.inputGain} onChange={changeHandler} />

        <label htmlFor="wheelFrequency">Wheel frequency (Hz): </label>
        <input ref={wheelFrequencyRef} type="number" id="wheelFrequency" min={0.0} step={0.01} defaultValue={defaultSettings.wheelFrequency} onChange={changeHandler} />

        <label htmlFor="filterOn">Enable bandpass filter</label>
        <input ref={filterOnRef} type="checkbox" id="filterOn" defaultChecked={defaultSettings.filterOn} onChange={changeHandler} />

        <label htmlFor="filterOctave">Filter octave: </label>
        <input ref={filterOctaveRef} type="number" id="filterOctave" min={1} defaultValue={defaultSettings.filterOctave} max={7} onChange={changeHandler} />
        <label htmlFor="filterFrequency">Filter frequency: </label>
        <output id="filterFrequency">
            {
                (wheelFrequencyRef.current && filterOctaveRef.current ?
                    (wheelFrequencyRef.current.value * Math.pow(2, filterOctaveRef.current.value - 1)).toFixed(2) :
                    (defaultSettings.wheelFrequency * Math.pow(2, defaultSettings.filterOctave - 1)).toFixed(2)) + " Hz"
            } 
        </output>

        <label htmlFor="filterQ">Filter q: </label>
        <input ref={filterQRef} type="number" id="filterQ" min={0.1} defaultValue={defaultSettings.filterQ} step={0.1} onChange={changeHandler} />
    </>
}