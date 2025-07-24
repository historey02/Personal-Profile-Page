const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gameOverMsg = document.getElementById('game-over-msg');
const resetBtn = document.getElementById('reset-btn');

//Will change on refresh, but updates will still need to be made 
// if the screen size is changed without refreshing
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const cellSize = 50;
const rows = Math.floor(screenHeight / cellSize);
const cols = Math.floor(screenWidth / cellSize);

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

const pad = Math.floor(cellSize / 15);

let isPaused = false;

//makes a grid 
//0 = empty
//1 = player
//2 = food
class Grid {
    constructor() {
        this.grid = Array(rows).fill().map((cols) => Array(cols).fill(0));
    }
    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

class Player {
    constructor() {
        this.positions = [
            {
                x: 4,
                y: Math.floor(rows / 2) - 1
            },
            {
                x: 3,
                y: Math.floor(rows / 2) - 1
            },
            {
                x: 2,
                y: Math.floor(rows / 2) - 1
            }
        ];
        this.originalPositions = [
            {
                x: 4,
                y: Math.floor(rows / 2) - 1
            },
            {
                x: 3,
                y: Math.floor(rows / 2) - 1
            },
            {
                x: 2,
                y: Math.floor(rows / 2) - 1
            }
        ];
        this.lastKey = "ArrowRight";
        this.eaten = false;
        this.dead = false;
    }

    draw() {
        ctx.fillStyle = "orange";
        this.positions.forEach((cell) => {
            ctx.fillRect(cell.x * cellSize + pad, cell.y * cellSize + pad, cellSize - 2 * pad, cellSize - 2 * pad);
        });
    }

    move(key) {
        let dx = 0;
        let dy = 0;
        switch (key) {
            case "ArrowUp":
                dy = -1;
                break;
            case "ArrowRight":
                dx = 1;
                break;
            case "ArrowDown":
                dy = 1;
                break;
            case "ArrowLeft":
                dx = -1;
                break;
        }

        const nextX = this.positions[0].x + dx;
        const nextY = this.positions[0].y + dy;
        const collides = this.checkCollisions(nextX, nextY);

        if (!collides) {
            this.positions.pop();
            this.positions.unshift({ x: nextX, y: nextY });
        }
        if (collides) {
            this.dead = true;
        }

    }
    checkCollisions(x, y) {
        if (player.positions.slice(4).some(pos => pos.x === x && pos.y === y)) {
            return true;
        }
        if (x < 0 || x >= cols || y < 0 || y >= rows) {
            return true;
        }
        if (food.position.x === x && food.position.y === y) {
            this.eatFood();
            return false;
        }
        return false;
    }
    eatFood() {
        this.eaten = true;
        food.position = food.randomPosition();
    }
    grow() {
        let newX = (this.positions[this.positions.length - 1].x - this.positions[this.positions.length - 2].x);
        let newY = (this.positions[this.positions.length - 1].y - this.positions[this.positions.length - 2].y);
        this.positions.push({ x: this.positions[this.positions.length - 1].x + newX, y: this.positions[this.positions.length - 1].y + newY });
    }
}

class Food {
    constructor() {
        this.position = this.randomPosition();
    }
    randomPosition() {
        let randX, randY;

        const onSnake = (x, y) => {
            return player.positions.some(pos => pos.x === x && pos.y === y);
        }
        do {
            randX = Math.floor(Math.random() * cols);
            randY = Math.floor(Math.random() * rows);
        }
        while (onSnake(randX, randY)) {

        }
        return { x: randX, y: randY };
    }
    draw() {
        ctx.fillStyle = "yellow";
        ctx.fillRect((this.position.x * cellSize) + (2 * pad), (this.position.y * cellSize) + (2 * pad), cellSize - 4 * pad, cellSize - 4 * pad);
    }
}

const grid = new Grid();
const player = new Player();
const food = new Food();

let lastMoveTime = 0;
let moveDelay = 200; //frequency of movement in ms
function animate(timestamp) {
    pollGamepad(); // 👈 Add this line
    if (timestamp - lastMoveTime >= moveDelay) {
        player.move(player.lastKey);
        lastMoveTime = timestamp;
    }
    if (player.eaten === true) {
        player.eaten = false;
        player.grow();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.draw();
    player.draw();
    food.draw();
    if (player.dead === false && !isPaused) {
        requestAnimationFrame(animate);
    }
    else if (player.dead) {
        gameOverMsg.classList.remove('hidden');
        gameOverMsg.style.display = "flex";
    }
}
animate();

resetBtn.addEventListener('click', () => {
    player.positions = player.originalPositions.map(pos => ({ ...pos }));
    player.dead = false;
    player.lastKey = "ArrowRight";
    food.position = food.randomPosition();
    animate();
    gameOverMsg.style.display = "none";
});

document.addEventListener('keydown', ({ key }) => {
    console.log("Key down: " + key);
    player.lastKey = key;
});

window.addEventListener("resize", () => {
    alert("Resize detected! Reload the page to restart the game.");
});


let pauseHandled = false;
function pollGamepad() {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0]; // Use the first connected controller

    if (!gp) return;

    const up = gp.buttons[12]?.pressed; //D-pad up
    const down = gp.buttons[13]?.pressed; //D-pad down
    const left = gp.buttons[14]?.pressed; //D-pad left
    const right = gp.buttons[15]?.pressed; //D-pad right

    const pause = gp.buttons[9]?.pressed; //Plus button

    if (up) player.lastKey = "ArrowUp";
    else if (down) player.lastKey = "ArrowDown";
    else if (left) player.lastKey = "ArrowLeft";
    else if (right) player.lastKey = "ArrowRight";

    if (pause && !pauseHandled) {
        isPaused = !isPaused;
        pauseHandled = true;

        if (!isPaused && !player.dead) {
            requestAnimationFrame(animate);
        }
    } else if (!pause) {
        pauseHandled = false;
    }
}

window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected:", e.gamepad);
});
setInterval(pollGamepad, 100);