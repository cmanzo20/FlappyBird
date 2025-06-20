const canvas = document.getElementById("gameCanvas");   //var for canvas from index.html
const ctx = canvas.getContext("2d");    //canvas used for accelerated 2d graphics

const bgMusic = new Audio('PokemonMusic.mp3');  //load background music file
const bgImage = new Image();    //declare background image var
bgImage.src = 'background.jfif'; //load background image
const scoreSound = new Audio('auuughhhhh.mp3'); //var for score audio  
const gravity = 0.6;    //var for gravity var (how much bird goes down per frame)
const jump = -10;   //jump velocity (10px up)
let score = 0;  //initial score
let gameover = false;   //var for checking if game is finished
let musicStarted = false;   //var for background music loop
bgMusic.loop = true;        // Make it loop
bgMusic.volume = 0.5;       // Set volume (0.0 to 1.0)

window.addEventListener("keydown", () => {  //whenever a key is pressed
    bird.velocity = jump; //increase birds velocity to jump value

    if (!musicStarted) {  //if music has not yet been started
        bgMusic.play(); //play background music
        musicStarted = true;    //set music started var to true
    }
});

const bird = {  //bird object
    x: 50,    //starting x coord- never changes
    y: 150,   //starting y coord- constantly changes
    width: 80,    //bird width
    height: 80,   //bird height
    velocity: 0,  //starting velocity 
    image: new Image()    //bird image
};

bird.image.src = 'bird.jpg';    //update bird image to source image

const pipes = [];   //pipes array
let frame = 0;  //frame initially starts at 0

function drawBird() {   //draw bird to screen function
    ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipe) {   //draw pipe function
    ctx.fillStyle = "#228B22";    //green color of pipe
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);    //create rect for top half of pipe (x coordinate of left corner, y coord, width, height)
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);   //create rectangle for bottom of pipe
}

function update() { //update frame function
    if (gameover) return;   //if game is over, do not update frame
    frame++;  //increase frame num

    // Bird physics
    bird.velocity += gravity; //decrease birds velocity by gravity val
    bird.y += bird.velocity;  //birds y coordinate changes by what velocity is

    // Pipe generation
    if (frame % 100 === 0) {  //generate pipe every 100 frames
        const gap = 250;    //gap between top and bottom of pipe    
        const top = Math.random() * (canvas.height - gap - 100) + 20;//generate random pipe top such that there is always room for gap and at least 100 px from bottom
        pipes.push({    //push pipe to pipe vector
            x: canvas.width,  //x coord- starts at end of frame
            width: 50,    //widht of pipe 50px
            top: top, //top of pipe generated randomly previously
            bottom: top + gap //bottom of pipe is gap below top
        });
    }

    // Move pipes loop
    for (let i = 0; i < pipes.length; i++) {  //moves every pipe in pipe array
        pipes[i].x -= 4;    //move pipes 4px to left per frame

        // Collision
        if (    //checks for collision every frame for every pipe
            bird.x < pipes[i].x + pipes[i].width &&   //if birds x coord is less than right end of pipe x 
            bird.x + bird.width > pipes[i].x && //and birds x coord + width is greater than pipes leftmost x
            (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].bottom)   //and birds y value is greater than bottom of top pipe or less than bottom of right pipe
        ) {
            gameover = true;    //game is over if any pipe collision happens
            setTimeout(resetGame, 100); //reset game, timeout use to prevent errors
            return; //return from loop
        }

        //play scoresound function
        function playScoreSound() {
            scoreSound.currentTime = 0; //move to beginning of audio file
            scoreSound.play();  //play audio
        //stops audio after 3 seconds so not full file is played
            setTimeout(() => {  //NOTE: audio pause is not noticeable because next pipe is reached in less than 3 seconds
                scoreSound.pause(); //audio is paused
                scoreSound.currentTime = 0; //audio file sent to beginning again
            }, 3000);   //occurs after 3 seconds
        }   //ANOTHER NOTE: Audio plays in entirety after game ends because parent function returns upon game end- js thing

        // Score
        if (pipes[i].x + pipes[i].width === bird.x) {   //when birds x is equal to pipes rightmost x
            score++;    //increment score
            playScoreSound();   //play score sound
        }
    }

    // Remove offscreen pipes   
    if (pipes.length && pipes[0].x < -50) { //when pipes list isn't empty (to avoid checking null) and leftmost pipe is offscreen entirely
        pipes.shift();  //shift pipes (pop leftmost pipe)
    }

    // Ground / ceiling collision
    if (bird.y + bird.height > canvas.height || bird.y < 0) {   //if birds y is ever above or below canvas
        gameover = true;    //game is set to over
        setTimeout(resetGame, 100)  //reset game, timeout used for error prevention
        return; //return
    }
}

function draw() {   //draws game canvas + objects
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);  //create canvas with bachground image

    drawBird(); //draw bird
    pipes.forEach(drawPipe);    //draw every pipe present

    // Score display
    ctx.fillStyle = "#000"; //black 
    ctx.font = "24px Arial";    //font
    ctx.fillText("Score: " + score, 10, 30);    //display score
}

function loop() {   //game loop
    update();   //update game
    draw(); //draw every object in game
    requestAnimationFrame(loop);    //loop for each frame
}

function resetGame() {  //reset game function
    alert("Game over! Score: " + score);    //display that game is over to screen
    score = 0;  //reset score to 0
    bird.y = 150;   //reset bird attributes
    bird.velocity = 0;  
    pipes.length = 0;   //clear pipes vector
    frame = 0;  //frame set to 0 again
    gameover = false;   //game no longer over as new game begins
}

window.addEventListener("keydown", () => {  //event listener for anytime key is pressed
    bird.velocity = jump;   //keypress = bird jump
});

bird.image.onload = () => { //when bird image loads, start game
    loop();
};
