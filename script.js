const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const canvasSize = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = 'RIGHT';
let food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box
};
let score = 0;
let level = 1;
let highScore = localStorage.getItem('highScore') || 0;
let game;
let isPaused = true;

document.getElementById('high-score').innerText = highScore;
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-from-game-over').addEventListener('click', restartGameFromGameOver);
document.addEventListener('keydown', changeDirection);

function startGame() {
    if (isPaused) {
        isPaused = false;
        game = setInterval(draw, 100);
        document.getElementById('start-btn').disabled = true;
    }
}

function restartGame() {
    clearInterval(game);
    score = 0;
    level = 1;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = 'RIGHT';
    food = {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box
    };
    document.getElementById('score').innerText = score;
    document.getElementById('level').innerText = level;
    isPaused = true;
    startGame();
}

function restartGameFromGameOver() {
    document.getElementById('game-over-screen').classList.add('hidden');
    restartGame();
}

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

function draw() {
    if (isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score += 10;
        if (score % 50 === 0) {
            level++;
            clearInterval(game);
            game = setInterval(draw, 100 - level * 10);
        }
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } else {
        snake.pop();
    }

    document.getElementById('score').innerText = score;
    document.getElementById('level').innerText = level;

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('start-btn').disabled = false;
        isPaused = true;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'p') {
        if (!isPaused) {
            clearInterval(game);
            isPaused = true;
            document.getElementById('resume-btn').disabled = false;
        } else {
            resumeGame();
        }
    }
});
