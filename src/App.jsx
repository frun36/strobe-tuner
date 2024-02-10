import { useEffect, useState } from "react";
import { setupAudio } from "/src/audio/setupAudio";
import Tuner from "/src/components/Tuner"

function App() {
    const [audioContext, setAudioContext] = useState(null);
    const [audioNode, setAudioNode] = useState(null);
    const [inputGainNode, setInputGainNode] = useState(null);

    const [frame, setFrame] = useState(null);


    useEffect(() => {
        const awaitSetupAudio = async () => {
            let { context, node, inputGainNode } = await setupAudio();
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
        <h1>Strobe tuner</h1>
        <Tuner />
    </>
}

export default App
