const img = new Image();
img.src = "img/wheel.png";
const ctx = document.getElementById("canvas").getContext("2d");

export function draw_wheel(rotation, alpha) {    
    ctx.save();

    ctx.globalAlpha = alpha;

    ctx.translate(200, 200);
    ctx.rotate(rotation);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    ctx.restore();
}

export function clear() {
    ctx.clearRect(0, 0, 400, 400);
}