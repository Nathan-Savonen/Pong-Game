// Select the canvas
const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

// Create the paddles
const paddleWidth = 10, paddleHeight = 100;
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "WHITE",
    dy: 5 // Paddle speed
};

const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "WHITE",
    dy: 5
};

// Create the ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    dx: 5, // Ball velocity along the x-axis
    dy: 5, // Ball velocity along the y-axis
    color: "WHITE"
};

// Score variables
let playerScore = 0;
let aiScore = 0;

// Draw function
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Draw the ball
function drawBall(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Draw the net in the middle
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "WHITE");
    }
}

// Draw text (for the scoreboard)
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "50px Arial";
    context.fillText(text, x, y);
}

// Detect collision between ball and paddle
function collision(ball, paddle) {
    return ball.x < paddle.x + paddle.width &&
           ball.x + ball.radius > paddle.x &&
           ball.y < paddle.y + paddle.height &&
           ball.y + ball.radius > paddle.y;
}

// Reset the ball after scoring
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.speed = 5;
}

// Move the paddles
document.addEventListener("keydown", movePaddle);

function movePaddle(e) {
    if (e.key === "ArrowUp") player.y -= player.dy;
    else if (e.key === "ArrowDown") player.y += player.dy;
}

// Update game objects
function update() {
    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // AI paddle movement
    if (ball.y > ai.y + ai.height / 2) {
        ai.y += ai.dy;
    } else {
        ai.y -= ai.dy;
    }

    // Player and AI paddle collision with the ball
    let paddle = (ball.x < canvas.width / 2) ? player : ai;
    
    if (collision(ball, paddle)) {
        let collidePoint = ball.y - (paddle.y + paddle.height / 2);
        collidePoint = collidePoint / (paddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.dx = direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);
        ball.speed += 0.5;
    }

    // Check if the ball goes out of bounds
    if (ball.x - ball.radius < 0) {
        // AI scores a point
        aiScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        // Player scores a point
        playerScore++;
        resetBall();
    }
}

// Render the game objects
function render() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the paddles and ball
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawBall(ball.x, ball.y, ball.radius, ball.color);

    // Draw the net
    drawNet();

    // Draw the scores
    drawText(playerScore, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(aiScore, (3 * canvas.width) / 4, canvas.height / 5, "WHITE");
}

// Game loop: update the game and render
function game() {
    update();
    render();
}

// Set the frame rate to 50 frames per second
setInterval(game, 1000 / 50);
