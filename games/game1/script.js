const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballRadius = 10;
let dx = 2;
let dy = -2;

const wallWidth = 100;
const wallHeight = 20;
let wallX = (canvas.width - wallWidth) / 2;
const wallY = canvas.height - wallHeight;

let wallColor = 'green';

let score = 0;
let isGameOver = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') {
    leftPressed = false;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
}

function drawWall() {
  ctx.beginPath();
  ctx.rect(wallX, wallY, wallWidth, wallHeight);
  ctx.fillStyle = wallColor;
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 8, 20);
}

function resetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    dx = 2;
    dy = -2;
    wallX = (canvas.width - wallWidth) / 2;
    score = 0;
    isGameOver = false;
    rightPressed = false;
    leftPressed = false;
    updateGame();
    
}

function updateGame() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBall();
    drawWall();
    drawScore();
    
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }
    
    if (ballY + dy < ballRadius) {
        dy = -dy;
    } else if (ballY + dy > canvas.height - ballRadius) {
        if (ballX > wallX && ballX < wallX + wallWidth) {
        dy = -dy;
        score++;
        } else {
        isGameOver = true;
        }
    }
    
    if (rightPressed && wallX < canvas.width - wallWidth) {
        wallX += 7;
    } else if (leftPressed && wallX > 0) {
        wallX -= 7;
    }
    
    ballX += dx;
    ballY += dy;
    
    if (isGameOver) {
        drawGameOverScreen();
    } else {
        requestAnimationFrame(updateGame);
    }
}

function drawStartScreen() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Press "Start Game" to begin', canvas.width / 2 - 150, canvas.height / 2);
}

drawStartScreen();


function drawGameOverScreen() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    ctx.font = '16px Arial';
    ctx.fillText('Press "Play Again" to restart', canvas.width / 2 - 100, canvas.height / 2 + 30);
}

document.getElementById('startGameBtn').addEventListener('click', () => {
    updateGame();
});

document.getElementById('playAgainBtn').addEventListener('click', () => {
    
    resetGame();
    drawStartScreen();
    updateGame();

});




