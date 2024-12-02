let paddle;
let ball;

let bricks = [];
let rows = 5;
let cols = 10;

let brickWidth;
let brickHeight = 20;

let score = 0;
let lives = 3;

function setup() {
  // Create canvas
  createCanvas(800, 600);

  // The Paddle
  paddle = {
    x: width / 2 - 50,
    y: height - 30,
    w: 100,
    h: 20,
    speed: 10
  };

  // The Ball
  ball = {
    x: width / 2,
    y: height / 2,
    r: 10,
    xSpeed: 5,
    ySpeed: 5
  };

  // Initialize bricks
  brickWidth = width / cols;
  for (let i = 0; i < rows; i++) {
    bricks[i] = [];
    for (let j = 0; j < cols; j++) {
      bricks[i][j] = {
        x: j * brickWidth,
        y: i * brickHeight + 50,
        w: brickWidth,
        h: brickHeight,
        color: color(random(255), random(255), random(255)), // Random brick color
        destroyed: false
      };
    }
  }
}

function draw() {
  background(0);

  // Draw the paddle
  fill(255);
  rect(paddle.x, paddle.y, paddle.w, paddle.h);

  // Paddle movement
  if (keyIsDown(LEFT_ARROW)) {
    paddle.x -= paddle.speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    paddle.x += paddle.speed;
  }

  // Constrain paddle to canvas
  paddle.x = constrain(paddle.x, 0, width - paddle.w);

  // Draw the ball
  fill(255);
  ellipse(ball.x, ball.y, ball.r * 2);

  // Ball movement
  ball.x += ball.xSpeed;
  ball.y += ball.ySpeed;

  // Ball collision with walls
  if (ball.x < ball.r || ball.x > width - ball.r) {
    ball.xSpeed *= -1;
  }
  if (ball.y < ball.r) {
    ball.ySpeed *= -1;
  }

  // Ball collision with paddle
  if (
    ball.y > paddle.y - ball.r &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w
  ) {
    ball.ySpeed *= -1;
  }

  // Ball goes off the screen (lose a life)
  if (ball.y > height) {
    lives--;
    if (lives > 0) {
      resetBall();
    } else {
      textSize(32);
      textAlign(CENTER);
      fill(255);
      text("Game Over", width / 2, height / 2);
      noLoop(); // Stop the game
    }
  }

  // Draw and check brick collisions
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!bricks[i][j].destroyed) {
        fill(bricks[i][j].color); // Brick color
        rect(bricks[i][j].x, bricks[i][j].y, bricks[i][j].w, bricks[i][j].h);

        // Check collision with ball
        if (
          ball.x > bricks[i][j].x &&
          ball.x < bricks[i][j].x + bricks[i][j].w &&
          ball.y > bricks[i][j].y &&
          ball.y < bricks[i][j].y + bricks[i][j].h
        ) {
          ball.ySpeed *= -1;
          bricks[i][j].destroyed = true;
          score++;

          // Check if all bricks are destroyed
          if (score === rows * cols) {
            textSize(32);
            textAlign(CENTER);
            fill(255);
            text("You Win!", width / 2, height / 2);
            noLoop(); // Stop the game
          }
        }
      }
    }
  }

  // Display score and lives
  textSize(20);
  fill(255);
  text("Score: " + score, 10, 20);
  text("Lives: " + lives, width - 100, 20);
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.xSpeed = random([-5, 5]); // Random direction
  ball.ySpeed = 5;
}
