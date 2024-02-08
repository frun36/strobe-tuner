import { useEffect, useRef } from "react";


export default function Tuner() {
    let canvasRef = useRef(null);

    useEffect(() => {
        let canvas = canvasRef.current;
        console.log(canvas);
    }, [])

    return <>
        <canvas ref={canvasRef} width="400" height="200"></canvas>
    </>
}