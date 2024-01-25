export default class Oscilloscope extends AnalyserNode {
    constructor(context, canvas, fftSize, gain) {
        super(context);
        this.fftSize = fftSize;

        this.bufferLength = this.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.canvas = canvas;
        this.canvasCtx = this.canvas.getContext("2d");

        this.gain = gain;
    }

    draw() {
        this.getByteTimeDomainData(this.dataArray);

        this.canvasCtx.fillStyle = "rgb(0, 0, 0)";
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = "rgb(0, 255, 0)";

        this.canvasCtx.beginPath();

        const sliceWidth = (this.canvas.width * 1.0) / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            const v = this.dataArray[i] / 128.0 - 1;
            const y = v * this.gain * this.canvas.height * 0.5 + this.canvas.height * 0.5;

            if (i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.canvasCtx.stroke();

    }
}