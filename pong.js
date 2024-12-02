// Paddle properties
let paddleWidth = 100; // Paddle width
let paddleHeight = 20; // Paddle height
let paddleX;
let paddleY;
let paddleSpeed = 10;

// Ball properties
let ballX;
let ballY;
let ballDiameter = 20;
let ballSpeedX = 4;
let ballSpeedY = 4;

function setup() {
  createCanvas(600, 400);

  // Initialize paddle position
  paddleX = width / 2 - paddleWidth / 2;
  paddleY = height - paddleHeight - 10;

  // Initialize ball position
  ballX = width / 2;
  ballY = height / 2;
}

function draw() {
  // Background color
  background(0);

  // Draw paddle
  fill(255);
  rect(paddleX, paddleY, paddleWidth, paddleHeight);

  // Draw ball
  ellipse(ballX, ballY, ballDiameter);

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball bounces off left and right walls
  if (ballX - ballDiameter / 2 < 0 || ballX + ballDiameter / 2 > width) {
    ballSpeedX *= -1;
  }

  // Ball bounces off the top
  if (ballY - ballDiameter / 2 < 0) {
    ballSpeedY *= -1;
  }

  // Ball bounces off the paddle
  if (
    ballY + ballDiameter / 2 > paddleY &&
    ballX > paddleX &&
    ballX < paddleX + paddleWidth
  ) {
    ballSpeedY *= -1;
  }

  // Check if the ball goes off the bottom (game over)
  if (ballY - ballDiameter / 2 > height) {
    textSize(32);
    fill(255);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2);
    noLoop(); // Stop the game
  }

  // Paddle movement
  if (keyIsDown(65)) { // 'A' key for left
    paddleX -= paddleSpeed;
  }
  if (keyIsDown(68)) { // 'D' key for right
    paddleX += paddleSpeed;
  }

  // Keep paddle within the canvas boundaries
  paddleX = constrain(paddleX, 0, width - paddleWidth);
}