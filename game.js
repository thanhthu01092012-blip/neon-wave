```javascript
// ============================================================
//                    NEON WAVE
//                    GAME ENGINE
// ============================================================


// ============================================================
// ⭐ GAME SETTINGS
// CHỈNH GAME Ở ĐÂY
// ============================================================

const GAME_SETTINGS = {

    // Tên game
    gameName: "NEON WAVE",

    // Tốc độ game
    gameSpeed: 6,

    // Trọng lực
    gravity: 0.38,

    // Lực bay lên
    flyPower: -0.85,

    // Kích thước nhân vật
    playerSize: 26,

    // Màu nhân vật
    playerColor: "#00ffff",

    // Màu chướng ngại
    obstacleColor: "#ff4df8",

    // Màu nền
    backgroundColor: "#05010d",

    // Khoảng cách giữa các chướng ngại
    obstacleGap: 150,

    // Chiều cao chướng ngại
    obstacleHeight: 50,

    // Độ khó tăng theo điểm
    difficultyIncrease: 0.002

};


// ============================================================
// CANVAS
// ============================================================

const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

let width;
let height;


// ============================================================
// RESIZE
// ============================================================

function resizeCanvas() {

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ============================================================
// ELEMENTS
// ============================================================

const menu = document.getElementById("menu");

const gameOverScreen =
    document.getElementById("gameOver");

const pauseScreen =
    document.getElementById("pauseScreen");

const hud =
    document.getElementById("hud");

const scoreText =
    document.getElementById("score");

const finalScore =
    document.getElementById("finalScore");

const progressBar =
    document.getElementById("progressBar");

const playButton =
    document.getElementById("playButton");

const restartButton =
    document.getElementById("restartButton");

const menuButton =
    document.getElementById("menuButton");

const pauseButton =
    document.getElementById("pauseButton");

const resumeButton =
    document.getElementById("resumeButton");

const pauseMenuButton =
    document.getElementById("pauseMenuButton");


// ============================================================
// PLAYER
// ============================================================

const player = {

    x: 180,

    y: 300,

    size: GAME_SETTINGS.playerSize,

    velocity: 0,

    rotation: 0

};


// ============================================================
// GAME VARIABLES
// ============================================================

let obstacles = [];

let particles = [];

let stars = [];

let score = 0;

let distance = 0;

let gameRunning = false;

let paused = false;

let pressing = false;

let lastTime = 0;

let spawnTimer = 0;

let difficulty = 1;


// ============================================================
// CREATE STARS
// ============================================================

function createStars() {

    stars = [];

    for (let i = 0; i < 120; i++) {

        stars.push({

            x: Math.random() * width,

            y: Math.random() * height,

            size: Math.random() * 2 + 0.5,

            speed: Math.random() * 1.5 + 0.3

        });

    }

}

createStars();


// ============================================================
// RESET GAME
// ============================================================

function resetGame() {

    player.x = width * 0.2;

    player.y = height / 2;

    player.velocity = 0;

    player.rotation = 0;

    obstacles = [];

    particles = [];

    score = 0;

    distance = 0;

    difficulty = 1;

    spawnTimer = 0;

    scoreText.textContent = "0";

    progressBar.style.width = "0%";

}


// ============================================================
// START GAME
// ============================================================

function startGame() {

    resetGame();

    gameRunning = true;

    paused = false;

    menu.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    pauseScreen.classList.add("hidden");

    hud.classList.remove("hidden");

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);

}


// ============================================================
// GAME OVER
// ============================================================

function gameOver() {

    gameRunning = false;

    finalScore.textContent = score;

    gameOverScreen.classList.remove("hidden");

}


// ============================================================
// PAUSE
// ============================================================

function togglePause() {

    if (!gameRunning) return;

    paused = !paused;

    if (paused) {

        pauseScreen.classList.remove("hidden");

    } else {

        pauseScreen.classList.add("hidden");

        lastTime = performance.now();

    }

}


// ============================================================
// INPUT
// ============================================================

window.addEventListener("keydown", (event) => {

    if (event.code === "Space") {

        event.preventDefault();

        pressing = true;

    }

    if (event.key.toLowerCase() === "r") {

        if (!gameRunning) {

            startGame();

        }

    }

    if (event.key.toLowerCase() === "p") {

        togglePause();

    }

});


window.addEventListener("keyup", (event) => {

    if (event.code === "Space") {

        pressing = false;

    }

});


canvas.addEventListener("mousedown", () => {

    pressing = true;

});

window.addEventListener("mouseup", () => {

    pressing = false;

});


// Mobile

canvas.addEventListener("touchstart", (event) => {

    event.preventDefault();

    pressing = true;

}, { passive: false });


window.addEventListener("touchend", () => {

    pressing = false;

});


// ============================================================
// BUTTONS
// ============================================================

playButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);

menuButton.addEventListener("click", () => {

    gameRunning = false;

    gameOverScreen.classList.add("hidden");

    hud.classList.add("hidden");

    menu.classList.remove("hidden");

});


pauseButton.addEventListener("click", togglePause);

resumeButton.addEventListener("click", togglePause);

pauseMenuButton.addEventListener("click", () => {

    paused = false;

    gameRunning = false;

    pauseScreen.classList.add("hidden");

    hud.classList.add("hidden");

    menu.classList.remove("hidden");

});


// ============================================================
// CREATE OBSTACLE
// ============================================================

function createObstacle() {

    const gap = GAME_SETTINGS.obstacleGap / difficulty;

    const minY = 100;

    const maxY = height - 100 - gap;

    const gapY =
        minY + Math.random() * Math.max(50, maxY - minY);

    const obstacleWidth = 55;

    obstacles.push({

        x: width + obstacleWidth,

        width: obstacleWidth,

        gapY: gapY,

        gapHeight: gap,

        passed: false

    });

}


// ============================================================
// CREATE PARTICLE
// ============================================================

function createParticle() {

    particles.push({

        x: player.x,

        y: player.y,

        vx: -Math.random() * 3,

        vy: (Math.random() - 0.5) * 2,

        life: 1,

        size: Math.random() * 5 + 2

    });

}


// ============================================================
// UPDATE PLAYER
// ============================================================

function updatePlayer(delta) {

    if (pressing) {

        player.velocity += GAME_SETTINGS.flyPower;

    }

    player.velocity += GAME_SETTINGS.gravity * delta;

    player.velocity =
        Math.max(-9, Math.min(9, player.velocity));

    player.y += player.velocity * delta;

    player.rotation =
        Math.max(-0.6, Math.min(0.6,
            player.velocity * 0.08));

    createParticle();

}


// ============================================================
// UPDATE OBSTACLES
// ============================================================

function updateObstacles(delta) {

    spawnTimer += delta;

    const spawnInterval =
        Math.max(65, 110 / difficulty);

    if (spawnTimer > spawnInterval) {

        createObstacle();

        spawnTimer = 0;

    }

    const speed =
        GAME_SETTINGS.gameSpeed * difficulty;

    for (let i = obstacles.length - 1; i >= 0; i--) {

        const obstacle = obstacles[i];

        obstacle.x -= speed * delta;

        // SCORE

        if (
            !obstacle.passed &&
            obstacle.x + obstacle.width < player.x
        ) {

            obstacle.passed = true;

            score++;

            scoreText.textContent = score;

            difficulty +=
                GAME_SETTINGS.difficultyIncrease;

        }

        // REMOVE

        if (obstacle.x + obstacle.width < -100) {

            obstacles.splice(i, 1);

        }

    }

}


// ============================================================
// UPDATE STARS
// ============================================================

function updateStars(delta) {

    for (const star of stars) {

        star.x -= star.speed * delta;

        if (star.x < 0) {

            star.x = width;

            star.y = Math.random() * height;

        }

    }

}


// ============================================================
// UPDATE PARTICLES
// ============================================================

function updateParticles(delta) {

    for (let i = particles.length - 1; i >= 0; i--) {

        const particle = particles[i];

        particle.x += particle.vx * delta;

        particle.y += particle.vy * delta;

        particle.life -= 0.03 * delta;

        if (particle.life <= 0) {

            particles.splice(i, 1);

        }

    }

}


// ============================================================
// COLLISION
// ============================================================

function collision() {

    const r = player.size / 2;

    // Screen boundaries

    if (player.y - r <= 0) {

        return true;

    }

    if (player.y + r >= height) {

        return true;

    }


    // Obstacles

    for (const obstacle of obstacles) {

        const playerLeft =
            player.x - r;

        const playerRight =
            player.x + r;

        const playerTop =
            player.y - r;

        const playerBottom =
            player.y + r;

        const obstacleLeft =
            obstacle.x;

        const obstacleRight =
            obstacle.x + obstacle.width;

        const topObstacleBottom =
            obstacle.gapY;

        const bottomObstacleTop =
            obstacle.gapY + obstacle.gapHeight;


        const horizontal =
            playerRight > obstacleLeft &&
            playerLeft < obstacleRight;


        if (horizontal) {

            if (
                playerTop < topObstacleBottom ||
                playerBottom > bottomObstacleTop
            ) {

                return true;

            }

        }

    }

    return false;

}


// ============================================================
// DRAW BACKGROUND
// ============================================================

function drawBackground() {

    ctx.fillStyle =
        GAME_SETTINGS.backgroundColor;

    ctx.fillRect(0, 0, width, height);


    // Stars

    for (const star of stars) {

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(255,255,255,0.7)";

        ctx.fill();

    }


    // Grid

    ctx.strokeStyle =
        "rgba(0,255,255,0.06)";

    ctx.lineWidth = 1;

    const gridSize = 50;

    for (
        let x = 0;
        x < width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, height);

        ctx.stroke();

    }

    for (
        let y = 0;
        y < height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(width, y);

        ctx.stroke();

    }

}


// ============================================================
// DRAW OBSTACLES
// ============================================================

function drawObstacles() {

    for (const obstacle of obstacles) {

        ctx.save();

        ctx.shadowBlur = 20;

        ctx.shadowColor =
            GAME_SETTINGS.obstacleColor;

        ctx.fillStyle =
            GAME_SETTINGS.obstacleColor;


        // TOP

        ctx.fillRect(
            obstacle.x,
            0,
            obstacle.width,
            obstacle.gapY
        );


        // BOTTOM

        ctx.fillRect(
            obstacle.x,
            obstacle.gapY + obstacle.gapHeight,
            obstacle.width,
            height
        );


        ctx.restore();

    }

}


// ============================================================
// DRAW PLAYER
// ============================================================

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    ctx.rotate(player.rotation);

    ctx.shadowBlur = 25;

    ctx.shadowColor =
        GAME_SETTINGS.playerColor;

    ctx.fillStyle =
        GAME_SETTINGS.playerColor;


    // Triangle ship

    ctx.beginPath();

    ctx.moveTo(
        player.size,
        0
    );

    ctx.lineTo(
        -player.size,
        -player.size * 0.7
    );

    ctx.lineTo(
        -player.size,
        player.size * 0.7
    );

    ctx.closePath();

    ctx.fill();


    // Inner triangle

    ctx.shadowBlur = 0;

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.moveTo(
        player.size * 0.55,
        0
    );

    ctx.lineTo(
        -player.size * 0.45,
        -player.size * 0.35
    );

    ctx.lineTo(
        -player.size * 0.45,
        player.size * 0.35
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


// ============================================================
// DRAW PARTICLES
// ============================================================

function drawParticles() {

    for (const particle of particles) {

        ctx.save();

        ctx.globalAlpha =
            particle.life;

        ctx.fillStyle =
            GAME_SETTINGS.playerColor;

        ctx.shadowBlur = 10;

        ctx.shadowColor =
            GAME_SETTINGS.playerColor;

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    }

}


// ============================================================
// DRAW
// ============================================================

function draw() {

    drawBackground();

    drawParticles();

    drawObstacles();

    drawPlayer();

}


// ============================================================
// GAME LOOP
// ============================================================

function gameLoop(time) {

    if (!gameRunning) return;

    if (paused) {

        requestAnimationFrame(gameLoop);

        return;

    }


    const delta =
        Math.min((time - lastTime) / 16.67, 2);

    lastTime = time;


    updateStars(delta);

    updatePlayer(delta);

    updateObstacles(delta);

    updateParticles(delta);


    distance += delta;

    const progress =
        Math.min(100, distance / 50);

    progressBar.style.width =
        progress + "%";


    if (collision()) {

        gameOver();

        draw();

        return;

    }


    draw();

    requestAnimationFrame(gameLoop);

}


// ============================================================
// INITIAL DRAW
// ============================================================

drawBackground();


// ============================================================
// SET PAGE TITLE
// ============================================================

document.title =
    GAME_SETTINGS.gameName;
```
