let bgColor;
let lastColorChange = 0;


function setup() {
  createCanvas(800, 600);
  bgColor = color(220); 
}

function draw() {
  background(bgColor);

  if (keyIsDown(82)) {
    if (millis() - lastColorChange > 500) { // Add a half a second delay to each color change
        
        // use random() to generate numbers here 💖
        let r = random(0, 255);
        let g = random(0, 255);
        let b = random(0, 255);
        bgColor = color(r, g, b);
        
        lastColorChange = millis(); // Update the time of the last color change
    }
  }

  fill(0);
  noStroke();
  textSize(24);
  textAlign(CENTER, CENTER);
  text(`RGB: ${red(bgColor)}, ${green(bgColor)}, ${blue(bgColor)}`, width / 2, height - 30);
}