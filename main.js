// Clear the canvas and update instructions
function clearSketch(instructions = "") {
  let container = document.getElementById("sketch-container");
  let instructionDiv = document.getElementById("instructions");
  container.innerHTML = ""; // Clear any existing canvas
  instructionDiv.innerHTML = instructions; // Update the instructions
}

function startWithDelay(startFunction, delaySeconds) {
  clearSketch(
    `<b>Starting in:</b> <span id="countdown">${delaySeconds}</span> seconds. <b>Instructions:</b> Use <b>Left Arrow</b> and <b>Right Arrow</b> keys to move the paddle.`
  );
  let countdown = delaySeconds;

  const interval = setInterval(() => {
    countdown--;
    document.getElementById("countdown").textContent = countdown;
    if (countdown === 0) {
      clearInterval(interval);
      startFunction();
    }
  }, 1000);
}

// Sketch 1: Paddle and Ball
function startSketch1() {
  startWithDelay(() => {
    new p5(function (p) {
      let paddleWidth = 100;
      let paddleHeight = 20;
      let paddleX;
      let paddleY;
      let paddleSpeed = 10;

      let ballX;
      let ballY;
      let ballDiameter = 20;
      let ballSpeedX = 4;
      let ballSpeedY = 4;

      p.setup = function () {
        p.createCanvas(600, 400).parent("sketch-container");
        paddleX = p.width / 2 - paddleWidth / 2;
        paddleY = p.height - paddleHeight - 10;
        ballX = p.width / 2;
        ballY = p.height / 2;
      };

      p.draw = function () {
        p.background(0);
        p.fill(255);

        // Draw paddle
        p.rect(paddleX, paddleY, paddleWidth, paddleHeight);

        // Draw ball
        p.ellipse(ballX, ballY, ballDiameter);

        // Ball movement
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball bounces
        if (
          ballX - ballDiameter / 2 < 0 ||
          ballX + ballDiameter / 2 > p.width
        ) {
          ballSpeedX *= -1;
        }
        if (ballY - ballDiameter / 2 < 0) {
          ballSpeedY *= -1;
        }

        // Ball bounces off paddle
        if (
          ballY + ballDiameter / 2 > paddleY &&
          ballX > paddleX &&
          ballX < paddleX + paddleWidth
        ) {
          ballSpeedY *= -1;
        }

        // Game over
        if (ballY - ballDiameter / 2 > p.height) {
          p.textSize(32);
          p.textAlign(p.CENTER, p.CENTER);
          p.fill(255);
          p.text("Game Over", p.width / 2, p.height / 2);
          p.noLoop();
        }

        // Paddle movement
        if (p.keyIsDown(p.LEFT_ARROW)) paddleX -= paddleSpeed;
        if (p.keyIsDown(p.RIGHT_ARROW)) paddleX += paddleSpeed;

        // Constrain paddle
        paddleX = p.constrain(paddleX, 0, p.width - paddleWidth);
      };
    });
  }, 5);
}

// Sketch 2: Drawing Lines
function startSketch2() {
  clearSketch(
    `<b>Instructions:</b> Click and drag to draw colorful lines on the canvas.`
  );
  new p5(function (p) {
    p.setup = function () {
      p.createCanvas(600, 400).parent("sketch-container");
      p.background(255);
    };

    p.draw = function () {
      p.stroke(p.mouseX / 2, p.mouseY / 2, 150);
      p.strokeWeight(5);
      if (p.mouseIsPressed) {
        p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
      }
    };
  });
}

// Sketch 3: Brick Breaker
function startSketch3() {
  startWithDelay(() => {
    new p5(function (p) {
      let paddle,
        ball,
        bricks = [];
      let rows = 5,
        cols = 10;
      let brickWidth,
        brickHeight = 20;
      let score = 0,
        lives = 3;

      p.setup = function () {
        p.createCanvas(800, 600).parent("sketch-container");
        paddle = {
          x: p.width / 2 - 50,
          y: p.height - 30,
          w: 100,
          h: 20,
          speed: 10,
        };
        ball = {
          x: p.width / 2,
          y: p.height / 2,
          r: 10,
          xSpeed: 5,
          ySpeed: -5,
        };
        brickWidth = p.width / cols;

        // Initialize bricks
        for (let i = 0; i < rows; i++) {
          bricks[i] = [];
          for (let j = 0; j < cols; j++) {
            bricks[i][j] = {
              x: j * brickWidth,
              y: i * brickHeight + 50,
              w: brickWidth - 5, // Add a small gap between bricks
              h: brickHeight - 5,
              color: p.color(p.random(255), p.random(255), p.random(255)),
              destroyed: false,
            };
          }
        }
      };

      p.draw = function () {
        p.background(0);

        // Draw paddle
        p.fill(255);
        p.rect(paddle.x, paddle.y, paddle.w, paddle.h);

        // Paddle movement
        if (p.keyIsDown(p.LEFT_ARROW)) paddle.x -= paddle.speed;
        if (p.keyIsDown(p.RIGHT_ARROW)) paddle.x += paddle.speed;
        paddle.x = p.constrain(paddle.x, 0, p.width - paddle.w);

        // Draw ball
        p.ellipse(ball.x, ball.y, ball.r * 2);

        // Ball movement
        ball.x += ball.xSpeed;
        ball.y += ball.ySpeed;

        // Ball bounces on walls
        if (ball.x < ball.r || ball.x > p.width - ball.r) ball.xSpeed *= -1;
        if (ball.y < ball.r) ball.ySpeed *= -1;

        // Ball bounces on paddle
        if (
          ball.y > paddle.y - ball.r &&
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.w
        ) {
          ball.ySpeed *= -1;
        }

        // Lose a life if ball falls
        if (ball.y > p.height) {
          lives--;
          if (lives > 0) {
            resetBall();
          } else {
            p.textSize(32);
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Game Over", p.width / 2, p.height / 2);
            p.noLoop();
          }
        }

        // Draw bricks
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (!bricks[i][j].destroyed) {
              p.fill(bricks[i][j].color);
              p.rect(
                bricks[i][j].x,
                bricks[i][j].y,
                bricks[i][j].w,
                bricks[i][j].h
              );

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
                // Win condition
                if (score === rows * cols) {
                  p.textSize(32);
                  p.fill(255);
                  p.textAlign(p.CENTER, p.CENTER);
                  p.text("You Win!", p.width / 2, p.height / 2);
                  p.noLoop();
                }
              }
            }
          }
        }

        // Display score and lives
        p.textSize(20);
        p.fill(255);
        p.text(`Score: ${score}`, 10, 30);
        p.text(`Lives: ${lives}`, p.width - 100, 30);
      };

      function resetBall() {
        ball.x = p.width / 2;
        ball.y = p.height / 2;
        ball.xSpeed = p.random([-5, 5]);
        ball.ySpeed = -5;
      }
    });
  }, 5);
}

// Sketch 4: RGB Background Changer
function startSketch4() {
  clearSketch(
    `<b>Instructions:</b> Hold down the <b>R</b> key to change the background color randomly.`
  );
  new p5(function (p) {
    let bgColor;
    let lastColorChange = 0;

    p.setup = function () {
      p.createCanvas(800, 600).parent("sketch-container");
      bgColor = p.color(220);
    };

    p.draw = function () {
      p.background(bgColor);

      if (p.keyIsDown(82)) {
        if (p.millis() - lastColorChange > 500) {
          bgColor = p.color(p.random(255), p.random(255), p.random(255));
          lastColorChange = p.millis();
        }
      }

      p.fill(0);
      p.noStroke();
      p.textSize(24);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(
        `RGB: ${Math.floor(p.red(bgColor))}, ${Math.floor(
          p.green(bgColor)
        )}, ${Math.floor(p.blue(bgColor))}`,
        p.width / 2,
        p.height - 30
      );
    };
  });
}