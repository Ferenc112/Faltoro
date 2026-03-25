const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreLabel = document.getElementById('pontszam');

let score = 0;
const paddle = { width: 100, height: 14, x: 0, y: 0, speed: 8, left: false, right: false };
const ball = { x: 0, y: 0, radius: 8, dx: 4, dy: -4 };
let bricks = [];
const brickRows = 4;
const brickCols = 9;

function resizeCanvas() {
  const box = document.getElementById('jatekter').getBoundingClientRect();
  canvas.width = Math.max(320, Math.floor(box.width));
  canvas.height = Math.max(360, Math.floor(box.height));
  resetLayout();
}

function resetLayout() {
  paddle.width = Math.min(120, canvas.width * 0.2);
  paddle.x = (canvas.width - paddle.width) / 2;
  paddle.y = canvas.height - paddle.height - 16;

  ball.x = canvas.width / 2;
  ball.y = paddle.y - ball.radius - 4;
  ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -4;

  bricks = [];
  const brickWidth = (canvas.width - 40) / brickCols;
  const brickHeight = 18;
  for (let r = 0; r < brickRows; r++) {
    for (let c = 0; c < brickCols; c++) {
      const hue = Math.floor(Math.random() * 360);
      const sat = 70 + Math.random() * 30;
      const lit = 50 + Math.random() * 20;
      bricks.push({ x: 20 + c * brickWidth, y: 40 + r * (brickHeight + 8), width: brickWidth - 4, height: brickHeight, alive: true, color: `hsl(${hue}, ${sat}%, ${lit}%)` });
    }
  }
}

function resetBall() {
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
  ball.x = paddle.x + paddle.width / 2;
  ball.y = paddle.y - ball.radius - 4;
  ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -4;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bricks.forEach(b => {
    if (!b.alive) return;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
    ctx.strokeStyle = '#ffffffcc';
    ctx.strokeRect(b.x, b.y, b.width, b.height);
  });

  ctx.fillStyle = '#0af';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // ball
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // pontszám
  scoreLabel.textContent = `pont szám: ${score}`;
}

function update() {
  if (paddle.left) paddle.x = Math.max(0, paddle.x - paddle.speed);
  if (paddle.right) paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed);

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.dx *= -1;
  if (ball.y - ball.radius < 0) ball.dy *= -1;

  if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
    ball.dy *= -1;
    const diff = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.dx = 4 * diff;
  }

  if (ball.y - ball.radius > canvas.height) {
    score = Math.max(0, score - 10);
    resetBall();
  }

  bricks.forEach(b => {
    if (!b.alive) return;
    if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + b.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + b.height) {
      b.alive = false;
      ball.dy *= -1;
      score += 10;
    }
  });

  draw();
  requestAnimationFrame(update);
}

window.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft') paddle.left = true;
  if (e.code === 'ArrowRight') paddle.right = true;
});
window.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft') paddle.left = false;
  if (e.code === 'ArrowRight') paddle.right = false;
});
window.addEventListener('resize', resizeCanvas);

resizeCanvas();
update();
