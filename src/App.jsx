import { useEffect, useRef, useState } from "react";
import { setupAudio } from "/src/audio/setupAudio";
import Tuner from "/src/components/Tuner"
import Oscilloscope from "./components/Oscilloscope";

function App() {
    const [audioContext, setAudioContext] = useState(null);
    const [audioNode, setAudioNode] = useState(null);
    const [inputGainNode, setInputGainNode] = useState(null);

    const imgRef = useRef(null);

    const [frame, setFrame] = useState({
        inputBuffer: [],
        outputBuffer: [],
        positionBuffer: [],
        pitch: [],
    });


    useEffect(() => {
        const awaitSetupAudio = async () => {
            const { context, node, inputGainNode } = await setupAudio();
            node.UIEventHandler = (msg) => {
                switch (msg.type) {
                    case "frame":
                        // console.log(msg.frame);
                        setFrame(msg.frame);
                        break;
                    default:
                        console.error(msg.type + " is not a supported message from tuner");
                }
            };
            setAudioContext(context);
            setAudioNode(node);
            setInputGainNode(inputGainNode);
        }
        awaitSetupAudio();
    }, [])

    useEffect(() => {
        function step() {
            audioNode && audioNode.port.postMessage({ type: "get-frame" });

            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }, [audioNode]);


    return <>
        <img ref={imgRef} src={"/wheel.png"} style={{ display: "none" }} />
        <h1>Strobe tuner</h1>
        <Tuner positionBuffer={frame.positionBuffer} img={imgRef.current} />
        <Oscilloscope buffer={frame.inputBuffer} gainLabel="Input oscilloscope gain: " />
        <Oscilloscope buffer={frame.outputBuffer} gainLabel="Output oscilloscope gain: " />
    </>
}

export default App
