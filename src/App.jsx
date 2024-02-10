import { useEffect, useRef, useState } from "react";
import { setupAudio } from "./audio/setupAudio";
import Tuner from "./components/Tuner"
import Oscilloscope from "./components/Oscilloscope";
import Settings from "./components/Settings";
import { dBToLinear } from "./utils/utils";

export default function App() {
    const [tunerNode, setAudioNode] = useState(null);
    const [inputGainNode, setInputGainNode] = useState(null);

    const imgRef = useRef(null);

    const [frame, setFrame] = useState({
        inputBuffer: [],
        outputBuffer: [],
        positionBuffer: [],
        pitch: [],
    });

    const defaultSettings = {
        inputGain: 0,
        wheelFrequency: 55.00,
        filterOn: true,
        filterOctave: 4,
        filterQ: 8.,
    };

    const updateSettings = (settings) => {
        tunerNode.port.postMessage({
            type: "update-settings",
            wheelFrequency: settings.wheelFrequency,
            filterOn: settings.filterOn,
            filterOctave: settings.filterOctave,
            filterQ: settings.filterQ,
        });

        inputGainNode.gain.value = dBToLinear(settings.inputGain);
    }

    useEffect(() => {
        const awaitSetupAudio = async () => {
            const { tunerNode, inputGainNode } = await setupAudio();
            tunerNode.UIEventHandler = (msg) => {
                switch (msg.type) {
                    case "frame":
                        // console.log(msg.frame);
                        setFrame(msg.frame);
                        break;
                    default:
                        console.error(msg.type + " is not a supported message from tuner");
                }
            };
            setAudioNode(tunerNode);
            setInputGainNode(inputGainNode);
        }
        awaitSetupAudio();
    }, [])

    useEffect(() => {
        function step() {
            tunerNode && tunerNode.port.postMessage({ type: "get-frame" });

            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }, [tunerNode]);


    return <>
        <img ref={imgRef} src={"/wheel.png"} style={{ display: "none" }} />
        <h1>Strobe tuner</h1>
        <Tuner positionBuffer={frame.positionBuffer} img={imgRef.current} />
        <Settings updater={updateSettings} defaultSettings={defaultSettings} />
        <Oscilloscope buffer={frame.inputBuffer} gainLabel="Input oscilloscope gain: " />
        <Oscilloscope buffer={frame.outputBuffer} gainLabel="Output oscilloscope gain: " />
    </>
}
