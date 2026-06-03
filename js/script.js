const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scoreValue = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const btnPlay = document.querySelector(".btn-play");

const audio = new Audio("../assets/audio.mp3");

// IMAGEM DA COMIDA
const foodImage = new Image();
foodImage.src = "../img/bola.png";

const size = 30;

const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];

const incrementScore = () => {
    scoreValue.innerText = +scoreValue.innerText + 10;
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / size) * size;
};

let food = {
    x: randomPosition(),
    y: randomPosition()
};

let direction;
let loopId;

const drawFood = () => {
    const { x, y } = food;

    if (foodImage.complete) {
        ctx.drawImage(foodImage, x, y, size, size);
    }
};

const drawSnake = () => {
    snake.forEach((position, index) => {
        ctx.fillStyle =
            index === snake.length - 1 ? "white" : "#ddd";

        ctx.fillRect(
            position.x,
            position.y,
            size,
            size
        );
    });
};

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    if (direction === "right") {
        snake.push({
            x: head.x + size,
            y: head.y
        });
    }

    if (direction === "left") {
        snake.push({
            x: head.x - size,
            y: head.y
        });
    }

    if (direction === "down") {
        snake.push({
            x: head.x,
            y: head.y + size
        });
    }

    if (direction === "up") {
        snake.push({
            x: head.x,
            y: head.y - size
        });
    }

    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore();

        snake.push({
            x: head.x,
            y: head.y
        });

        audio.currentTime = 0;
        audio.play();

        let x = randomPosition();
        let y = randomPosition();

        while (
            snake.find(
                (position) =>
                    position.x === x &&
                    position.y === y
            )
        ) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision =
        head.x < 0 ||
        head.x > canvasLimit ||
        head.y < 0 ||
        head.y > canvasLimit;

    const selfCollision = snake.find(
        (position, index) =>
            index < neckIndex &&
            position.x === head.x &&
            position.y === head.y
    );

    if (wallCollision || selfCollision) {
        gameOver();
    }
};

const gameOver = () => {
    direction = undefined;

    menu.style.display = "flex";
    finalScore.innerText = scoreValue.innerText;

    canvas.style.filter = "blur(2px)";
};

const gameLoop = () => {
    clearTimeout(loopId);

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, 300);
};

foodImage.onload = () => {
    console.log("Imagem carregada!");
};

foodImage.onerror = () => {
    console.error("Erro ao carregar: ../img/bola.png");
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direction !== "left") {
        direction = "right";
    }

    if (key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    }

    if (key === "ArrowDown" && direction !== "up") {
        direction = "down";
    }

    if (key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
});

btnPlay.addEventListener("click", () => {
    scoreValue.innerText = "00";

    menu.style.display = "none";
    canvas.style.filter = "none";

    snake = [initialPosition];
    direction = undefined;

    food.x = randomPosition();
    food.y = randomPosition();
});