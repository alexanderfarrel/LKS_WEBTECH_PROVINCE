const gameContainer = document.querySelector(".gameContainer");
const score = document.querySelector(".score");
const timeGame = document.querySelector(".time");

let foodX,
  foodY,
  snakeX = 5,
  snakeY = 10,
  velocityX = 0,
  velocityY = 0,
  isGameOver = false,
  isStartTime = false;

let snakeBody = [];
function gameStart() {
  if (isGameOver) {
    clearInterval(interval);
    return;
  }
  snakeX += velocityX;
  snakeY += velocityY;

  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
      isGameOver = true;
      gameOver();
      return;
    }
  }

  if (snakeX > 30 || snakeX <= 0 || snakeY > 30 || snakeY <= 0) {
    isGameOver = true;
    gameOver();
    return;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  if (snakeX == foodX && snakeY == foodY) {
    score.textContent = parseInt(score.innerHTML) + 1;
    snakeBody.push([foodX, foodY]);
    randomFood();
  }

  let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
  }

  gameContainer.innerHTML = htmlMarkup;
}

const interval = setInterval(gameStart, 125);

function randomFood() {
  do {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
  } while (foodX == 5 && foodY == 10);
}

function changeDirection(e) {
  console.log(e);
  if (e.key == "ArrowUp" && velocityY != 1) {
    startTime();
    velocityY = -1;
    velocityX = 0;
  } else if (e.key == "ArrowDown" && velocityY != -1) {
    startTime();
    velocityY = 1;
    velocityX = 0;
  } else if (e.key == "ArrowLeft" && velocityX != 1) {
    startTime();
    velocityY = 0;
    velocityX = -1;
  } else if (e.key == "ArrowRight" && velocityX != -1) {
    startTime();
    velocityY = 0;
    velocityX = 1;
  }
}

document.addEventListener("keydown", (e) => changeDirection(e));

const gameoverWrapper = document.querySelector(".gameover-wrapper");
const gameoverScore = document.getElementById("gameoverScore");
const gameoverTime = document.getElementById("gameoverTime");
function gameOver() {
  if (!isGameOver) return;
  clearInterval(interval);
  clearInterval(timeInterval);
  document.querySelectorAll(".food, .head").forEach((el) => el.remove());
  gameoverWrapper.style.display = "flex";
  gameoverScore.textContent = score.textContent;
  gameoverTime.innerHTML = timeGame.innerHTML;
}

let timeInterval;
function startTime() {
  if (isStartTime) return;
  isStartTime = true;
  let time = 0;
  timeInterval = setInterval(() => {
    time++;
    let minute = Math.floor(time / 60);
    let second = time % 60;
    timeGame.innerHTML =
      String(minute).padStart(2, "0") + ":" + String(second).padStart(2, "0");
  }, 1000);
}

randomFood();
gameStart();
