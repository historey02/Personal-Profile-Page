const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const winMessage = document.getElementById('win');
const resetButton = document.getElementById('reset');


const rows = 25;
const cols = 25;
const cellSize = 20;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

const wallColor = "#1d2127ff";
const pathColor = "#14B8A6";

// 0 = wall
// 1 = path
let maze = Array(rows).fill().map(() => Array(cols).fill(0));
let path = [];

function generateMaze() {
    const startRow = Math.floor(rows / 2) + 1;
    const startCol = Math.floor(cols / 2) + 1;

    maze[startRow][startCol] = 1;
    carvePath(startRow, startCol);
    path = getPath();
}

function carvePath(row, col) {
    const directions = [
        [0, -2],
        [2, 0],
        [0, 2],
        [-2, 0]
    ];
    shuffle(directions);

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if ((newRow > 0 && newRow < rows) && (newCol > 0 && newCol < cols) && maze[newRow][newCol] === 0) {
            maze[newRow][newCol] = 1;
            maze[row + (dr / 2)][col + (dc / 2)] = 1;
            carvePath(newRow, newCol);
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function drawMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = maze[row][col] === 1 ? pathColor : wallColor;
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
    const firstEmptyCellInTopRow = getFirstEmptyCellInTopRow();
    ctx.fillStyle = "yellow";
    ctx.fillRect(firstEmptyCellInTopRow * cellSize, 1 * cellSize, cellSize, cellSize);

    const lastEmptyCellInBottomRow = getLastEmptyCellInBottomRow();
    ctx.fillStyle = "green";
    ctx.fillRect(lastEmptyCellInBottomRow * cellSize, (cols - 2) * cellSize, cellSize, cellSize);
}

function getFirstEmptyCellInTopRow() {
    for (let col = 0; col < cols; col++) {
        if (maze[1][col] === 1) {
            return col;
        }
    }
}

function getLastEmptyCellInBottomRow() {
    for (let col = cols - 1; col > 0; col--) {
        if (maze[cols - 2][col] === 1) {
            return col;
        }
    }
}

function getPath() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                path.push({ row, col });
            }
        }
    }
}


class Game {
    start() {
        maze = Array(rows).fill().map(() => Array(cols).fill(0));
        generateMaze();
        console.log(maze);
    }
}

const game = new Game();
game.start();

class Player {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.color = color;
        this.speed = 2;
    }

    drawPlayer() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    followsPath(dx, dy) {
        const tempX = this.x + dx * this.speed;
        console.log("Current X: " + this.x);
        console.log("TempX: " + tempX);
        const tempY = this.y + dy * this.speed;
        console.log("Current Y: " + this.y);
        console.log("Temp Y: " + tempY);

        const tileRowTL = Math.floor((tempY - 1) / cellSize);
        const tileColTL = Math.floor((tempX - 1) / cellSize);

        const tileRowBR = Math.floor((tempY + this.height + 1) / cellSize);
        const tileColBR = Math.floor((tempX + this.width + 1) / cellSize);

        const tileRowTR = Math.floor((tempY - 1) / cellSize);
        const tileColTR = Math.floor((tempX + this.width + 1) / cellSize);

        const tileRowBL = Math.floor((tempY + this.height + 1) / cellSize);
        const tileColBL = Math.floor((tempX - 1) / cellSize);


        if (maze[tileRowTL][tileColTL] === 1 && maze[tileRowBR][tileColBR] === 1 && maze[tileRowTR][tileColTR] === 1 && maze[tileRowBL][tileColBL] === 1) {
            return true;
        }
        else {
            playBumpSound();
            return false;
        }
    }

    move(dx, dy) {
        if (this.followsPath(dx, dy)) {
            this.x += dx * this.speed;
            this.y += dy * this.speed;
        }
    }
}
const ctxAudio = new (window.AudioContext)();
let bumpPlaying = false;
let duration = 0.2; //duration of sound
function playBumpSound() {
    //only plays if the bump is not playing already (and I added a small cooldown)
    if (bumpPlaying) {
        return;
    }
    bumpPlaying = true;

    const oscillator = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();

    //options include: square, triangle, sawtooth, sine
    oscillator.type = "sawtooth"; // square is supposed to sound retro
    oscillator.frequency.setValueAtTime(350, ctxAudio.currentTime); // pitch
    oscillator.frequency.linearRampToValueAtTime(150, ctxAudio.currentTime + 0.2);
    gain.gain.setValueAtTime(0.4, ctxAudio.currentTime); //volume

    oscillator.connect(gain);
    gain.connect(ctxAudio.destination);

    oscillator.start();
    oscillator.stop(ctxAudio.currentTime + duration); // second term is length in seconds

    //sets bumpplaying to false after the duration of the sound + a small buffer. audio uses seconds, 
    //but setTimeout uses milliseconds, hence the * 1000
    setTimeout(() => {
        bumpPlaying = false;
    }, (duration + 0.2) * 1000);
}

let player = new Player(cellSize * getFirstEmptyCellInTopRow() + (cellSize - 10) / 2, cellSize + (cellSize - 10) / 2, "red");

let heldKeys = [];
let lastMovementTime = 0;
const cooldown = 125; //ms between movements

document.addEventListener('keydown', (e) => {
    //This adds a key to the end of the heldKeys array when pressed
    const key = e.key;
    if (!heldKeys.includes(key) && ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(key)) {
        heldKeys.push(key);
    }
});

document.addEventListener('keyup', (e) => {
    //This removes a key from the heldKeys array when released
    const key = e.key;
    const keyIndex = heldKeys.indexOf(key);
    if (keyIndex !== -1) {
        heldKeys.splice(keyIndex, 1);
    }
});

function movePlayer() {
    const direction = heldKeys[heldKeys.length - 1];
    switch (direction) {
        case "ArrowUp":
            player.move(0, -1);
            break;
        case "ArrowDown":
            player.move(0, 1);
            break;
        case "ArrowRight":
            player.move(1, 0);
            break;
        case "ArrowLeft":
            player.move(-1, 0);
            break;
    }
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    movePlayer();
    player.drawPlayer();
    checkWin();
    requestAnimationFrame(animate);
}
animate();

function checkWin() {
    const winTileX = getLastEmptyCellInBottomRow();
    const winTileY = cols - 2;

    const playerTileXTL = Math.floor(player.x / cellSize);
    const playerTileYTL = Math.floor(player.y / cellSize);
    const playerTileXBR = Math.floor((player.x + player.width) / cellSize);
    const playerTileYBR = Math.floor((player.y + player.height) / cellSize);
    console.log("winTile: X is:" + winTileX + " Y is: " + winTileY);
    if (playerTileXTL === winTileX && playerTileXBR === winTileX && playerTileYTL === winTileY && playerTileYBR === winTileY) {
        winMessage.style.display = "block";
    }

}

resetButton.addEventListener('click', () => {
    location.reload();
});
