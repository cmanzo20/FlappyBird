const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bgMusic = new Audio('PokemonMusic.mp3');
const bgImage = new Image();
bgImage.src = 'background.jfif';
const scoreSound = new Audio('auuughhhhh.mp3');
const gravity = 0.6;
const jump = -10;
let score = 0;
let gameover = false;
let musicStarted = false;
bgMusic.loop = true;        // Make it loop
bgMusic.volume = 0.5;       // Set volume (0.0 to 1.0)

window.addEventListener("keydown", () => {
  bird.velocity = jump;

  if (!musicStarted) {
    bgMusic.play();
    musicStarted = true;
  }
});

const bird = {
  x: 50,
  y: 150,
  width: 80,
  height: 80,
  velocity: 0,
  image: new Image()
};

bird.image.src = 'bird.jpg';

const pipes = [];
let frame = 0;

function drawBird() {
  ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipe) {
  ctx.fillStyle = "#228B22";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
}

function update() {
    if (gameover) return;
  frame++;

  // Bird physics
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Pipe generation
  if (frame % 100 === 0) {
    const gap = 250;
    const top = Math.random() * (canvas.height - gap - 100) + 20;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      bottom: top + gap
    });
  }

  // Move pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 4;

    // Collision
    if (
      bird.x < pipes[i].x + pipes[i].width &&
      bird.x + bird.width > pipes[i].x &&
      (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].bottom)
    ) {
      gameover = true;
      setTimeout(resetGame, 100);
      return;
    }

    //play scoresound function
    function playScoreSound(){
        scoreSound.currentTime = 0;
        scoreSound.play();

        setTimeout(() => {
            scoreSound.pause();
            scoreSound.currentTime = 0;
        }, 3000);
    }

    // Score
    if (pipes[i].x + pipes[i].width === bird.x) {
      score++;
      playScoreSound();
    }
  }

  // Remove offscreen pipes
  if (pipes.length && pipes[0].x < -50) {
    pipes.shift();
  }

  // Ground / ceiling collision
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameover = true;
    setTimeout(resetGame, 100)
    return;
  }
}

function draw() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  drawBird();
  pipes.forEach(drawPipe);

  // Score display
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function resetGame() {
  alert("Game over! Score: " + score);
  score = 0;
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  frame = 0;
  gameover = false;
}

window.addEventListener("keydown", () => {
  bird.velocity = jump;
});

bird.image.onload = () => {
  loop();
};
