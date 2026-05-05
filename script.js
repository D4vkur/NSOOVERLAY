const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Stick positions
const leftCenter = { x: 200, y: 200 };
const rightCenter = { x: 500, y: 200 };

const radius = 120;
const deadzone = 50;

let trailL = [];
let trailR = [];

function drawCircleFrame(center) {
  // Background fill
  const gradient = ctx.createRadialGradient(
    center.x, center.y, 10,
    center.x, center.y, radius
  );

  gradient.addColorStop(0, "rgba(40,40,40,0.6)");
  gradient.addColorStop(1, "rgba(0,0,0,0.9)");

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Outer ring
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,105,180,0.7)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Deadzone
  ctx.beginPath();
  ctx.arc(center.x, center.y, deadzone, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawStick(center, x, y, trail, color) {
  let px = center.x + x * radius;
  let py = center.y + y * radius;

  trail.push({ x: px, y: py });
  if (trail.length > 30) trail.shift();

  // Trail
  ctx.beginPath();
  for (let i = 0; i < trail.length; i++) {
    if (i === 0) ctx.moveTo(trail[i].x, trail[i].y);
    else ctx.lineTo(trail[i].x, trail[i].y);
  }
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Direction line
  ctx.beginPath();
  ctx.moveTo(center.x, center.y);
  ctx.lineTo(px, py);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Dot
  ctx.beginPath();
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function update() {
  const gp = navigator.getGamepads()[0];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCircleFrame(leftCenter);
  drawCircleFrame(rightCenter);

  if (gp) {
    let l = normalizeStick(gp.axes[0] || 0, gp.axes[1] || 0);
    let r = normalizeStick(gp.axes[2] || 0, gp.axes[3] || 0);

    let lx = l.x;
    let ly = l.y;
    let rx = r.x;
    let ry = r.y;

    drawStick(leftCenter, lx, ly, trailL, "#ff69b4");
    drawStick(rightCenter, rx, ry, trailR, "#00bfff");

    document.getElementById("leftData").innerText =
      `${lx.toFixed(2)}, ${ly.toFixed(2)}`;

    document.getElementById("rightData").innerText =
      `${rx.toFixed(2)}, ${ry.toFixed(2)}`;
  }

  function normalizeStick(x, y) {
  const length = Math.sqrt(x * x + y * y);

  if (length > 1) {
    return {
      x: x / length,
      y: y / length
    };
  }

  return { x, y };
}
  requestAnimationFrame(update);
}

update();
