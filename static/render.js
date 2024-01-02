const img = new Image();
img.src = "img/wheel.png";
const ctx = document.getElementById("canvas").getContext("2d");

function draw_wheel(rotation, alpha) {
    ctx.save();

    ctx.globalAlpha = alpha;

    ctx.translate(200, 200);
    ctx.rotate(rotation);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(img, -img.width / 2, -img.height / 2);


    ctx.restore();
}

img.onload = () => {
    draw_wheel(Math.PI / 256, 0.2);
    draw_wheel(2 * Math.PI / 256, 0.2);
    draw_wheel(3 * Math.PI / 256, 0.2);
    draw_wheel(4 * Math.PI / 256, 0.2);
}
