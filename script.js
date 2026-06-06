const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;
const ballSpeed = 5;

let gameStarted = false;
let playerScore = 0;
let computerScore = 0;

// Paddle positions
let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelocityX = ballSpeed;
let ballVelocityY = ballSpeed;

// Mouse position
let mouseY = canvas.height / 2;

// Keyboard input
let upPressed = false;
let downPressed = false;

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') upPressed = true;
    if (e.key === 'ArrowDown') downPressed = true;
    if (e.key === ' ') {
        e.preventDefault();
        gameStarted = !gameStarted;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') upPressed = false;
    if (e.key === 'ArrowDown') downPressed = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Draw functions
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawGame() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    
    // Draw center line
    drawCenterLine();
    
    // Draw paddles
    drawRect(10, playerY, paddleWidth, paddleHeight, '#fff');
    drawRect(canvas.width - 20, computerY, paddleWidth, paddleHeight, '#fff');
    
    // Draw ball
    drawCircle(ballX, ballY, ballSize, '#fff');
}

// Update game logic
function update() {
    if (!gameStarted) return;
    
    // Player paddle movement
    if (upPressed && playerY > 0) {
        playerY -= 6;
    }
    if (downPressed && playerY < canvas.height - paddleHeight) {
        playerY += 6;
    }
    
    // Computer paddle movement (AI)
    const computerSpeed = 4;
    const computerCenter = computerY + paddleHeight / 2;
    
    if (computerCenter < ballY - 35) {
        computerY += computerSpeed;
    } else if (computerCenter > ballY + 35) {
        computerY -= computerSpeed;
    }
    
    // Keep computer paddle in bounds
    if (computerY < 0) computerY = 0;
    if (computerY > canvas.height - paddleHeight) computerY = canvas.height - paddleHeight;
    
    // Ball movement
    ballX += ballVelocityX;
    ballY += ballVelocityY;
    
    // Ball collision with top and bottom
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballVelocityY = -ballVelocityY;
    }
    
    // Ball collision with paddles
    if (
        ballX - ballSize < 20 &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballVelocityX = -ballVelocityX;
        ballVelocityX *= 1.05; // Increase speed slightly
    }
    
    if (
        ballX + ballSize > canvas.width - 30 &&
        ballY > computerY &&
        ballY < computerY + paddleHeight
    ) {
        ballVelocityX = -ballVelocityX;
        ballVelocityX *= 1.05; // Increase speed slightly
    }
    
    // Scoring
    if (ballX - ballSize < 0) {
        computerScore++;
        resetBall();
    }
    
    if (ballX + ballSize > canvas.width) {
        playerScore++;
        resetBall();
    }
    
    // Update score display
    document.getElementById('score').textContent = `Player: ${playerScore} | Computer: ${computerScore}`;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVelocityX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballVelocityY = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    gameStarted = false;
    document.getElementById('instruction').textContent = 'Press SPACE to continue';
}

// Game loop
function gameLoop() {
    update();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
