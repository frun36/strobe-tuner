export class Backlight {
    constructor(canvasCtx) {
        this.canvasCtx = canvasCtx;
    }

    clear() {
        this.canvasCtx.clearRect(0, 0, 400, 400);
    }
}

export class Wheel {
    constructor(canvasCtx) {
        this.canvasCtx = canvasCtx;
        this.img = new Image;
        this.img.onload = () => console.log("Loaded wheel image");
        this.img.src = "./img/wheel.png";
    }

    draw(rotation, alpha) {    
        this.canvasCtx.save();
    
        this.canvasCtx.globalAlpha = alpha;
    
        this.canvasCtx.translate(200, 200);
        this.canvasCtx.rotate(rotation);
        this.canvasCtx.globalCompositeOperation = 'source-over';
        this.canvasCtx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
    
        this.canvasCtx.restore();
    }
}