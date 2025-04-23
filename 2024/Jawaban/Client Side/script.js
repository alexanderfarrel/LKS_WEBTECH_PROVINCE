const instructionBtn = document.getElementById("instruction");
const sideBox = document.querySelector(".sideBox article");
const closeBtn = document.querySelector(".sideBox article .close");
const playBtn = document.getElementById("playBtn");
const countdownContainer = document.getElementById("countdown");

instructionBtn.addEventListener("click", () => {
  sideBox.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  sideBox.style.display = "none";
});

document.querySelector(".usernameInput").addEventListener("input", (e) => {
  if (e.target.value === "") {
    playBtn.classList.add("disabledBtn");
    playBtn.classList.remove("playBtn");
  } else {
    playBtn.classList.remove("disabledBtn");
    playBtn.classList.add("playBtn");
  }
});

const introForm = document.getElementById("introductionForm");

introForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(introForm);

  const username = formData.get("username");
  const level = formData.get("level");
  const board = formData.get("board");
  const gun = formData.get("gun");

  if (!username || !level || !board || !gun) {
    alert("Please fill all the fields");
    return;
  }

  const userData = {
    username,
    level,
    board,
    gun,
  };

  localStorage.setItem("userData", JSON.stringify(userData));

  countdownContainer.style.display = "flex";
  countdown();
  setTimeout(() => {
    gameStart();
  }, 3000);
});

const gameWrapper = document.getElementById("gameWrapper");
const gameBoard = document.getElementById("gameBoard");
const gameGunWrapper = document.getElementById("gameGunWrapper");
const gameGun = document.getElementById("gameGun");
const pausedContainer = document.getElementById("pausedContainer");
const gameOverContainer = document.getElementById("gameOverContainer");
const sortedLeaderboard = document.getElementById("sortedLeaderboard");

let data;
let isGamePaused = false,
  isGameOver = false,
  intervalTarget,
  intervalTime;
let scores = 0,
  time = 0,
  gunNumber = 0;

function countdown() {
  document.getElementById("introContainer").style.display = "none";
  document.querySelector(".gameContainer").style.display = "flex";

  const countdownNumber = document.getElementById("countdownNumber");

  countdownNumber.style.textShadow = "0 0 20px white";
  countdownNumber.textContent = 3;
  countdownContainer.style.display = "flex";
  let time = 2;
  const countdownInterval = setInterval(() => {
    countdownNumber.textContent = time;
    time--;
    if (time < 0) {
      clearInterval(countdownInterval);
      countdownContainer.style.display = "none";
    }
  }, 1000);
}

function gameStart() {
  data = JSON.parse(localStorage.getItem("userData"));
  document.getElementById("playerName").textContent = data.username;

  if (data.level === "easy") {
    time = 30;
  } else if (data.level === "medium") {
    time = 20;
  } else {
    time = 15;
  }
  gunNumber = parseInt(data.gun);

  startInterval();

  document.getElementById("time").textContent = formatTime(time);
  createTarget(data.board);
  gameGun.src = `./Sprites/gun${data.gun}.png`;

  gameWrapper.addEventListener("mousemove", (e) => {
    if (isGamePaused || isGameOver) {
      return;
    }
    gameGunWrapper.style.left = e.clientX + 80 + "px";
    gameGunWrapper.style.top = e.clientY + 50 + "px";
  });
  gameWrapper.addEventListener("click", handleClick);

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (gunNumber === 2) {
        gunNumber = 1;
        createGun(1);
      } else if (gunNumber === 1) {
        gunNumber = 2;
        createGun(2);
      }
    } else if (e.code == "Escape") {
      pauseGame();
    }
  });

  updateLeaderboard();
}

function handleClick(e) {
  if (isGamePaused || isGameOver) {
    return;
  }

  const boomImg = document.createElement("img");
  boomImg.src = "./Sprites/boom.png";
  boomImg.classList.add("boom");
  boomImg.style.left = `${e.clientX + 2}px`;
  boomImg.style.top = `${e.clientY - 43}px`;
  gameBoard.appendChild(boomImg);

  setTimeout(() => {
    boomImg.remove();
  }, 200);

  if (e.target.id === "target") {
    // e.target.remove();
    // scores++;
  } else if (e.target.id === "tryAgainBtn") {
    return;
  } else {
    time -= 5;
    if (time <= 0) {
      time = 0;
      clearInterval(intervalTime);
      clearInterval(intervalTarget);
      gameOver();
      document.getElementById("time").textContent = formatTime(time);
    } else {
      document.getElementById("time").textContent = formatTime(time);
    }
  }
}

function startInterval() {
  clearInterval(intervalTime);
  clearInterval(intervalTarget);
  intervalTime = setInterval(() => {
    time--;
    document.getElementById("time").textContent = formatTime(time);
    if (time <= 0) {
      time = 0;
      clearInterval(intervalTime);
      clearInterval(intervalTarget);
      gameOver();
      document.getElementById("time").textContent = formatTime(time);
    }
  }, 1000);

  intervalTarget = setInterval(() => {
    createTarget(data.board);
  }, 3000);
}

document.getElementById("pausedBtn").onclick = () => {
  pauseGame();
};

const tryAgainBtn = document.getElementById("tryAgainBtn");

tryAgainBtn.onclick = () => {
  tryAgain();
};

function pauseGame() {
  if (isGamePaused) {
    countdown();
    setTimeout(() => {
      isGamePaused = false;
    }, 100);
    pausedContainer.style.display = "none";
    setTimeout(() => {
      startInterval();
    }, 3000);
  } else {
    isGamePaused = true;
    pausedContainer.style.display = "flex";
    clearInterval(intervalTime);
    clearInterval(intervalTarget);
  }
}

const saveScoreBtn = document.getElementById("saveScoreBtn");

function gameOver() {
  gameWrapper.removeEventListener("click", handleClick);
  isGameOver = true;
  gameOverContainer.style.display = "flex";
  document.getElementById("gameOverUsername").textContent = data.username;
  document.getElementById("gameOverScore").textContent = scores;
}

saveScoreBtn.onclick = () => {
  saveScore();
  updateLeaderboard();
  saveScoreBtn.disabled = true;
};

function tryAgain() {
  isGameOver = false;
  gameOverContainer.style.display = "none";
  scores = 0;
  document.getElementById("score").textContent = scores;
  saveScoreBtn.disabled = false;
  countdown();
  setTimeout(() => {
    gameStart();
  }, 3000);
}

function saveScore() {
  const leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboardData.push({
    username: data.username,
    score: scores,
    time: Date.now(),
  });

  localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));
}

function updateLeaderboard() {
  const sorted = document.getElementById("sortedLeaderboard").value;
  const leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];

  if (sorted == "score") {
    leaderboardData.sort((a, b) => b.score - a.score);
  } else {
    leaderboardData.sort((a, b) => b.time - a.time);
  }

  const scoreBoardWrapper = document.getElementById("scoreBoardWrapper");
  scoreBoardWrapper.innerHTML = "";
  leaderboardData.forEach((data) => {
    const scoreBoard = document.createElement("div");
    scoreBoard.classList.add("scoreBoard");
    scoreBoard.innerHTML = `
      <aside>
        <h1>${data.username}</h1>
        <p>score : <span>${data.score}</span></p>
      </aside>
      <button>Detail</button>
    `;
    scoreBoardWrapper.appendChild(scoreBoard);
  });
}

sortedLeaderboard.onchange = () => {
  updateLeaderboard();
};

function createGun(gunNumber) {
  const gun = document.createElement("img");
  if (gunNumber === 1) {
    gun.src = `./Sprites/gun${2}.png`;
  } else if (gunNumber === 2) {
    gun.src = `./Sprites/gun${1}.png`;
  }
  gun.classList.add("gameGun");
  gun.id = "gameGun";
  gameGunWrapper.replaceChildren(gun);
  gun.style.animation = "popdown 0.3s ease-in-out forwards";

  setTimeout(() => {
    gun.src = `./Sprites/gun${gunNumber}.png`;
    gameGunWrapper.replaceChildren(gun);
    gun.style.animation = "popup 0.3s ease-in-out forwards";
  }, 300);
}

function createTarget(targetNumb = 1) {
  document.querySelectorAll("#target").forEach((target) => {
    target.remove();
  });

  for (let i = 0; i < 3; i++) {
    const target = document.createElement("img");
    target.src = `./Sprites/target${targetNumb}.png`;
    target.id = "target";
    target.classList.add("gameTarget");
    gameBoard.appendChild(target);

    requestAnimationFrame(() => {
      target.style.left =
        Math.random() * (gameWrapper.offsetWidth - target.offsetWidth) + "px";
      target.style.top =
        Math.random() * (gameWrapper.offsetHeight - target.offsetHeight - 30) +
        "px";
    });
  }
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth < 1000 || window.innerHeight < 600) {
    widthNotCompatible();
  } else {
    widthCompatible();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth < 1000 || window.innerHeight < 600) {
    widthNotCompatible();
  } else {
    widthCompatible();
  }
});

function widthNotCompatible() {
  if (!document.getElementById("notCompatible")) {
    const section = document.createElement("section");
    section.classList.add("notCompatible");
    section.id = "notCompatible";
    section.innerHTML = `
      <h1>Display Tidak Kompatibel</h1>
      <p>Minimal Screen 1000x600</p>
    `;
    document.body.appendChild(section);
  }
}

function widthCompatible() {
  document.querySelectorAll(".notCompatible").forEach((el) => el.remove());
}

document.addEventListener("click", (event) => {
  const x = event.clientX;
  const y = event.clientY;

  const elements = document.elementsFromPoint(x, y);

  elements.forEach((el) => {
    if (el.id.includes("target")) {
      scores++;
      el.remove();
      document.getElementById("score").textContent = scores;
    }
  });
});
