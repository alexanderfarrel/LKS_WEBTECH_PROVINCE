const instructionBtn = document.getElementById("instruction");
const instructionWrapper = document.getElementById("instruction-wrapper");
const usernameInput = document.getElementById("usernameInput");
const startBtn = document.getElementById("start");
const container = document.getElementById("container");

document.addEventListener("DOMContentLoaded", () => {
  startBtn.disabled = true;
});

usernameInput.addEventListener("input", () => {
  startBtn.disabled = usernameInput.value === "";
});

instructionBtn.addEventListener("click", () => {
  instructionWrapper.style.display = "flex";
});

const closeBtn = document.getElementById("close-btn");

closeBtn.addEventListener("click", () => {
  instructionWrapper.style.display = "none";
});

const openingForm = document.getElementById("opening-form");

openingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem("username", e.target.username.value);
  localStorage.setItem(
    "level",
    e.target.level.value != "none" ? e.target.level.value : "easy"
  );
  countdown();
});

const countdownWrapper = document.getElementById("countdown-wrapper");
const countdownNumb = document.getElementById("countdown-numb");
const openingWrapper = document.getElementById("opening-wrapper");
const gameWrapper = document.getElementById("game-wrapper");
function countdown() {
  openingWrapper.style.display = "none";
  gameWrapper.style.display = "flex";
  countdownWrapper.style.display = "flex";
  let count = 3;
  const interval = setInterval(() => {
    count--;
    countdownNumb.textContent = count;
    if (count <= 0) {
      clearInterval(interval);
      countdownWrapper.style.display = "none";
      gameStart();
    }
  }, 1000);
}

const username = document.getElementById("username");
const score = document.getElementById("score");
const time = document.getElementById("time");
const level = localStorage.getItem("level");
const line1 = document.getElementById("zombieLine1");
const line2 = document.getElementById("zombieLine2");
const line3 = document.getElementById("zombieLine3");
const line4 = document.getElementById("zombieLine4");
const line5 = document.getElementById("zombieLine5");
const lines = [line1, line2, line3, line4, line5];
const zombieMap = new Map();

let createZombieInterval, timeoutCreateZombie;
let gameover = false;
let index = 1;
const sunNumb = document.getElementById("sunNumb");

function gameStart() {
  username.textContent = localStorage.getItem("username");
  score.innerHTML = 0;

  updateLeaderboard();

  timeStart();
  randomSun();
  // extraSun();
  // extraSun();

  let zombieAmount = 1;
  if (level == "easy") {
    zombieAmount = 1;
  } else if (level == "medium") {
    zombieAmount = 2;
  } else if (level == "hard") {
    zombieAmount = 3;
  }

  createZombieInterval = setInterval(() => {
    let random = [];
    let double = [];
    for (let i = 0; i < zombieAmount; i++) {
      random.push(Math.floor(Math.random() * 5) + 1);
    }
    random.forEach((num) => {
      if (double.includes(num)) {
        // check how many same number
        let count = random.filter((n) => n == num).length - 1;
        timeoutCreateZombie = setTimeout(() => {
          if (gameover == false) {
            createZombie(lines[num - 1], `zombie_${num}_${count}_${index++}`);
          }
        }, 750 * count);
      } else {
        if (gameover == false) {
          createZombie(lines[num - 1], `zombie_${num}_0_${index++}`);
        }
      }
      double.push(num);
    });
  }, 5000);
}

const gameField = document.getElementById("gameField");
let randomSunInterval;
const sunInterval = new Map();
let sunId = 0;

function randomSun() {
  randomSunInterval = setInterval(() => {
    const currentId = `sun_${++sunId}`;
    const img = document.createElement("img");
    img.src = "./Sprites/General/Sun.png";
    img.classList.add("sun");
    img.id = currentId;

    const randomLeft = Math.floor(Math.random() * 650) + 50;
    img.style.position = "absolute";
    img.style.left = `${randomLeft}px`;
    img.style.top = "80px";
    gameField.appendChild(img);
    const moveInterval = moveSun(img);
    sunInterval.set(currentId, {
      element: img,
      moveInterval,
    });
  }, 5000);
}

function extraSun() {
  const currentId = `sun_${++sunId}`;
  const img = document.createElement("img");
  img.src = "./Sprites/General/Sun.png";
  img.id = currentId;

  img.classList.add("sun");
  img.style.position = "absolute";
  const randomLeft = Math.floor(Math.random() * 650) + 50;
  img.style.left = `${randomLeft}px`;
  img.style.top = "80px";
  gameField.appendChild(img);
  const moveInterval = moveSun(img);
  sunInterval.set(currentId, {
    element: img,
    moveInterval,
  });
}

function moveSun(sun) {
  const finalTop = Math.floor(Math.random() * 420) + 100;
  return setInterval(() => {
    if (parseInt(sun.style.top) < finalTop) {
      sun.style.top = `${sun.offsetTop + 2}px`;
    } else {
      clearInterval(sunInterval.get(sun.id).moveInterval);
    }
  }, 50);
}

let timeInterval;
function timeStart() {
  let seconds = 0;
  timeInterval = setInterval(() => {
    seconds += 1;

    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    time.textContent = `${minutes.toString().padStart(2, "0")}:${secondsLeft
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

function createZombie(line, id) {
  if (gameover == true) return;
  const zombie = document.createElement("img");
  zombie.src = `./Sprites/Zombie/frame_00_delay-0.05s.gif`;
  zombie.id = id;
  zombie.style.left = "800px";
  line.appendChild(zombie);

  zombieMap.set(id, {
    element: zombie,
    moveInterval: null,
    animationInterval: null,
    slowTimeout: null,
    left: 800,
    running: true,
    health: 5,
    speed: 0.7,
    src: "./Sprites/Zombie/frame_00_delay-0.05s.gif",
  });
  const moveInterval = move(zombie);
  startZombieAnimation(zombie);
  const data = zombieMap.get(id);
  data.moveInterval = moveInterval;
}

let lawnmowers = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
};

const lawnmower1 = document.getElementById("lawnmower1");
const lawnmower2 = document.getElementById("lawnmower2");
const lawnmower3 = document.getElementById("lawnmower3");
const lawnmower4 = document.getElementById("lawnmower4");
const lawnmower5 = document.getElementById("lawnmower5");

let lawnmower1Interval;
let lawnmower2Interval;
let lawnmower3Interval;
let lawnmower4Interval;
let lawnmower5Interval;

let lawnmower1Timeout;
let lawnmower2Timeout;
let lawnmower3Timeout;
let lawnmower4Timeout;
let lawnmower5Timeout;

function move(zombie) {
  let left = parseInt(zombie.style.left);
  const zombieLine = zombie.id.split("_")[1];
  const dataZombie = zombieMap.get(zombie.id);

  const interval = setInterval(() => {
    zombie.style.left = `${left}px`;

    if (dataZombie) {
      dataZombie.left = left;
    }

    let widthX = 83,
      xStart = 76;
    [...seeds.entries()].forEach(([id, data]) => {
      if (data.isPlaced) {
        for (let y = 1; y <= 5; y++) {
          if (data.row == y && zombieLine == y) {
            for (let i = 1; i <= 8; i++) {
              if (data.col == i && zombie.offsetLeft == xStart + widthX * i) {
                clearInterval(interval);
                seeds.get(id).eatingInterval = eatSeed(id, zombie);
              }
            }
          }
        }
      }
    });

    [...peaBullet.entries()].forEach(([id, data]) => {
      if (data.row == zombieLine) {
        if (
          zombie.offsetLeft -
            (data.element.offsetLeft - 20 + widthX * data.col) <=
            50 &&
          zombie.offsetLeft -
            (data.element.offsetLeft - 20 + widthX * data.col) >=
            -10
        ) {
          if (id.split("_")[0] == "peaBullet") {
            data.element.remove();
            clearInterval(data.bulletInterval);
            peaBullet.delete(id);
            dataZombie.health--;
          } else if (id.split("_")[0] == "icePeaBullet") {
            data.element.remove();
            clearInterval(data.bulletInterval);
            peaBullet.delete(id);
            dataZombie.health -= 0.72;
            dataZombie.speed = 0.1;

            if (dataZombie.slowTimeout) {
              clearTimeout(dataZombie.slowTimeout);
            }

            dataZombie.slowTimeout = setTimeout(() => {
              dataZombie.speed = 0.3;
            }, 3000);
          }
        }

        if (dataZombie.health <= 0) {
          dataZombie.element.remove();
          clearInterval(dataZombie.moveInterval);
          clearInterval(dataZombie.animationInterval);
          clearInterval(interval);
          zombieMap.delete(zombie.id);
          score.innerHTML = parseInt(score.innerHTML) + 1;
        }
      }
    });

    left -= dataZombie?.speed;
    // left -= 5;
    if (left <= 60) {
      startLawnmower(zombieLine);
      lawnmowers[zombieLine] = true;
    }

    if (left <= -60) {
      clearTimeout(timeoutCreateZombie);
      lawnmowerIntervals.forEach((interval) => {
        console.log(interval);
        clearInterval(interval);
      });
      clearInterval(interval);
      if (gameover == false) {
        gameover = true;
        gameOver();
      }
    }
  }, 15);

  return interval;
}

function eatSeed(id, zombie) {
  return setInterval(() => {
    const data = seeds.get(id);
    const health = id.split("_")[0] == "wallNut" ? 5 : 3;
    // if (data == undefined) {
    //   return move(zombie);
    // }
    if (data.health > 0) {
      data.element.style.opacity = `${data.health / health}`;
      data.health -= 1;
      if (data.health == 0) {
        if (data.workingInterval !== null) {
          clearInterval(data.workingInterval);
        }
        clearInterval(data.animationInterval);
        clearInterval(seeds.get(id).eatingInterval);
        data.element.remove();
        seeds.delete(id);
        move(zombie);
      }
    }
  }, 1000);
}

const lawnmowerElements = {
  1: lawnmower1,
  2: lawnmower2,
  3: lawnmower3,
  4: lawnmower4,
  5: lawnmower5,
};

const lawnmowerTimeouts = {};
const lawnmowerIntervals = {};

function startLawnmower(id) {
  const lineNumber = parseInt(id);
  if (lawnmowers[lineNumber]) return;

  const lawnmower = lawnmowerElements[lineNumber];
  lawnmower.src = "./Sprites/General/lawnmowerActivated.gif";

  lawnmowerTimeouts[lineNumber] = setTimeout(() => {
    lawnmowerIntervals[lineNumber] = setInterval(() => {
      if (lawnmower.offsetLeft >= 820) {
        clearInterval(lawnmowerIntervals[lineNumber]);
        clearTimeout(lawnmowerTimeouts[lineNumber]);
      } else {
        lawnmower.style.left = `${lawnmower.offsetLeft + 2}px`;
        [...zombieMap.entries()].forEach(([zombieId, data]) => {
          const zombieLine = parseInt(zombieId.split("_")[1]);
          if (
            zombieLine === lineNumber &&
            data.left - lawnmower.offsetLeft <= 50 &&
            data.left - lawnmower.offsetLeft >= 0
          ) {
            clearInterval(data.moveInterval);
            clearInterval(data.animationInterval);
            data.element.remove();
            zombieMap.delete(zombieId);
          }
        });
      }
    }, 0.5);
  }, 0);
}

function startZombieAnimation(zombie) {
  const totalFrame = 33;
  let currentFrame = String(zombie.src).split("/").at(-1).split("_")[1];
  const data = zombieMap.get(zombie.id);

  function animate(frame) {
    return setInterval(() => {
      currentFrame = (currentFrame + 1) % totalFrame;
      zombie.src = `./Sprites/Zombie/frame_${currentFrame
        .toString()
        .padStart(2, "0")}_delay-0.05s.gif`;
    }, frame);
  }

  let lastSpeed = data.speed;
  let currentInterval = animate(lastSpeed == 0.3 ? 50 : 200);

  const watcher = setInterval(() => {
    const newSpeed = data.speed;
    if (newSpeed != lastSpeed) {
      clearInterval(currentInterval);
      lastSpeed = newSpeed;
      currentInterval = animate(newSpeed == 0.3 ? 50 : 200);
    }
  }, 100);

  data.animationInterval = currentInterval;
}

function pause(id) {
  const data = zombieMap.get(id);
  if (data && data.running) {
    clearInterval(data.moveInterval);
    data.running = false;
  }
}

const gameoverWrapper = document.getElementById("gameoverWrapper");
function gameOver() {
  if (gameover == false) return;
  clearInterval(timeInterval);
  clearInterval(randomSunInterval);
  gameoverWrapper.style.display = "flex";
  clearInterval(createZombieInterval);
  [...zombieMap.entries()].forEach(([id, data]) => {
    const zombie = data.element;
    clearInterval(data.moveInterval);
    clearInterval(data.animationInterval);
    zombie.remove();
    zombieMap.delete(id);

    [...seeds.entries()].forEach(([id, seed]) => {
      clearInterval(seed.workingInterval);
      clearInterval(seed.animationInterval);
    });

    document.getElementById("usernameGameover").innerHTML =
      localStorage.getItem("username");
    document.getElementById("scoreGameover").innerHTML = score.innerHTML;
    document.getElementById("timeGameover").innerHTML = time.innerHTML;
  });
}

const restartBtn = document.getElementById("restart");
restartBtn.addEventListener("click", () => {
  sunNumb.textContent = 50;
  score.innerHTML = 0;
  lawnmowers = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  };
  lawnmower1.style.left = "0px";
  lawnmower1.src = "./Sprites/General/lawnmowerIdle.gif";
  lawnmower2.style.left = "0px";
  lawnmower2.src = "./Sprites/General/lawnmowerIdle.gif";
  lawnmower3.style.left = "0px";
  lawnmower3.src = "./Sprites/General/lawnmowerIdle.gif";
  lawnmower4.style.left = "0px";
  lawnmower4.src = "./Sprites/General/lawnmowerIdle.gif";
  lawnmower5.style.left = "0px";
  lawnmower5.src = "./Sprites/General/lawnmowerIdle.gif";
  clearTimeout(lawnmower1Timeout);
  clearTimeout(lawnmower2Timeout);
  clearTimeout(lawnmower3Timeout);
  clearTimeout(lawnmower4Timeout);
  clearTimeout(lawnmower5Timeout);
  clearInterval(lawnmower1Interval);
  clearInterval(lawnmower2Interval);
  clearInterval(lawnmower3Interval);
  clearInterval(lawnmower4Interval);
  clearInterval(lawnmower5Interval);
  clearInterval(timeInterval);
  gameover = false;

  [...sunInterval.entries()].forEach(([id, data]) => {
    data.element.remove();
    clearInterval(data.moveInterval);
  });

  [...seeds.entries()].forEach(([id, data]) => {
    clearInterval(data.workingInterval);
    clearInterval(data.animationInterval);
    data.element.remove();
    seeds.delete(id);
  });

  gameStart();
  gameoverWrapper.style.display = "none";
  canSave = true;
});

const saveScoreBtn = document.getElementById("saveScore");
let canSave = true;
saveScoreBtn.addEventListener("click", () => {
  if (!canSave) return;
  canSave = false;
  leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({
    username: localStorage.getItem("username"),
    score: score.innerHTML,
    time: time.innerHTML,
    level: localStorage.getItem("level"),
    timestamp: Date.now(),
  });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  updateLeaderboard();
});

const seedsPlace = document.getElementById("seedsPlace");
let seedId = 1;
let isDragging = false;
const seeds = new Map();
function createSeed(id, clientX, clientY) {
  if (isDragging) return;
  isDragging = true;
  const div = document.createElement("div");
  const span = document.createElement("span");
  const img = document.createElement("img");
  img.style.opacity = "0.5";
  if (id == "sunFlower") {
    img.src = "./Sprites/SunFlower/frame_00_delay-0.06s.gif";
    img.id = `sunFlower_${seedId}`;
  } else if (id == "wallNut") {
    img.src = "./Sprites/WallNut/frame_00_delay-0.12s.gif";
    img.id = `wallNut_${seedId}`;
  } else if (id == "peaShooter") {
    img.src = "./Sprites/PeaShooter/frame_00_delay-0.12s.gif";
    img.id = `peaShooter_${seedId}`;
  } else if (id == "icePea") {
    img.src = "./Sprites/IcePea/frame_00_delay-0.12s.gif";
    img.id = `icePea_${seedId}`;
  } else if (id == "shovel") {
    img.src = "./Sprites/General/shovel.png";
    img.style.opacity = "0";
    img.id = `shovel`;
  }
  div.classList.add("img-seed-place-wrapper");
  span.classList.add("bg-red");
  img.style.width = "83px";
  img.style.height = "85px";
  img.style.position = "absolute";
  img.style.gridColumn = "";
  img.style.gridRow = "";
  img.style.left = `${clientX - seedsPlace.getClientRects()[0].left - 40}px`;
  img.style.top = `${clientY - seedsPlace.getClientRects()[0].top - 40}px`;
  div.style.position = "relative";
  div.appendChild(img);
  div.appendChild(span);
  seedsPlace.appendChild(div);
  seeds.set(img.id, {
    element: img,
    parentElement: div,
    bgRedElement: span,
    animationInterval: null,
    isPlaced: false,
  });
  seedId++;
  followCursor(img);
}
let currentCol = null;
let currentRow = null;

function followCursor(img) {
  const data = seeds.get(img.id);
  const clientX = 84;
  const clientY = 87;
  const xStart = seedsPlace.getClientRects()[0].left;
  const yStart = seedsPlace.getClientRects()[0].top;

  currentCol = null;
  currentRow = null;
  const move = (e) => {
    for (let row = 0; row < 5; row++) {
      const yMin = yStart + clientY * row;
      const yMax = yStart + clientY * (row + 1);

      if (e.clientY >= yMin && e.clientY <= yMax) {
        for (let col = 0; col < 8; col++) {
          const xMin = xStart + clientX * col;
          const xMax = xStart + clientX * (col + 1);

          if (e.clientX >= xMin && e.clientX <= xMax) {
            currentCol = col + 1;
            currentRow = row + 1;
            setImgTo(currentCol, currentRow, img);
            return;
          }
        }
      }
    }
    if (cantPlace) {
      cantPlace = false;
      shovel.style.backgroundColor = img.id == "shovel" ? "red" : "";
      data.bgRedElement.style.opacity = "0";
      img.style.opacity = img.id == "shovel" ? 0 : 0.5;
    }

    data.parentElement.style.gridColumn = "";
    data.parentElement.style.gridRow = "";
    img.style.position = "absolute";
    img.style.left = `${
      e.clientX - seedsPlace.getClientRects()[0].left - img.offsetWidth / 2
    }px`;
    img.style.top = `${
      e.clientY - seedsPlace.getClientRects()[0].top - img.offsetHeight / 2
    }px`;
  };

  const handleClick = () => {
    if (currentCol !== null && currentRow !== null) {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", handleClick);
      putSeed(currentCol, currentRow, img);
    }
  };

  window.addEventListener("mousemove", move);
  window.addEventListener("click", handleClick);
}

const shovel = document.getElementById("shovel");
function putSeed(col, row, oldImg) {
  if (oldImg.id == "shovel" && !isShovel) return;
  [...seeds.entries()].forEach(([id, seed]) => {
    if (seed.col == col && seed.row == row) {
      clearInterval(seed.eatingInterval);
      clearInterval(seed.workingInterval);
      clearInterval(seed.animationInterval);
      seed.element.remove();
      seed.bgRedElement.remove();
      seeds.delete(id);

      [...zombieMap.entries()].forEach(([zombieId, data]) => {
        move(data.element);
      });
    }
  });

  const oldData = seeds.get(oldImg.id);
  oldData.bgRedElement.remove();
  oldData.parentElement.remove();
  oldData.element.remove();

  if (oldImg.id == "shovel") {
    isShovel = false;
    seeds.delete("shovel");
    shovel.style.backgroundColor = "";
    isDragging = false;
    return;
  }
  const seedName = oldImg.id.split("_")[0];
  const div = document.createElement("div");
  const span = document.createElement("span");
  const img = document.createElement("img");
  span.classList.add("bg-red");
  span.classList.opacity = "0";
  div.style.position = "relative";
  div.style.gridColumn = col;
  div.style.gridRow = row;
  img.src = oldImg.src;
  img.id = oldImg.id;
  img.style.position = "absolute";
  img.style.left = "0px";
  img.style.top = "0px";
  img.style.width = "83px";
  img.style.height = "85px";
  img.style.opacity = "1";

  div.appendChild(span);
  div.appendChild(img);
  seedsPlace.appendChild(div);
  seeds.set(img.id, {
    element: img,
    parentElement: div,
    bgRedElement: span,
    animationInterval: null,
    workingInterval: null,
    isPlaced: true,
    col,
    row,
    health: seedName == "wallNut" ? 5 : 3,
  });
  isDragging = false;

  shovel.style.backgroundColor = "";
  const animationInterval = startSeedAnimation(img);
  const data = seeds.get(img.id);
  data.animationInterval = animationInterval;

  const workingInterval = startWorking(img.id);
  data.workingInterval = workingInterval;
}

const peaBullet = new Map();
let bulletId = 1;
function startWorking(id) {
  const seedName = id.split("_")[0];
  const dataSeed = seeds.get(id);
  if (seedName == "sunFlower") {
    return setInterval(() => {
      const currentId = `sun_${++sunId}`;
      const img = document.createElement("img");
      img.src = "./Sprites/General/Sun.png";
      img.id = currentId;
      const left = Math.floor(Math.random() * 30) + 1;
      img.style.position = "absolute";
      img.style.left = `${left}px`;
      img.style.top = "-10px";
      img.style.width = "75px";
      img.style.height = "75px";
      img.style.userSelect = "none";
      img.style.webkitUserDrag = "none";
      img.style.zIndex = 3;
      img.style.transition = "all 1s ease-in-out";

      dataSeed.parentElement.appendChild(img);

      sunInterval.set(currentId, {
        element: img,
      });

      setTimeout(() => {
        img.style.top = "30px";
      }, 100);
    }, 15_000);
  } else if (seedName == "peaShooter") {
    return setInterval(() => {
      let shouldFirePea = false;

      [...zombieMap.entries()].forEach(([zombieId, data]) => {
        const zombieLine = parseInt(zombieId.split("_")[1]);
        if (zombieLine == dataSeed.row) {
          shouldFirePea = true;
        }
      });

      if (!shouldFirePea) {
        return;
      }

      const currentId = `peaBullet_${bulletId++}`;
      const img = document.createElement("img");
      img.id = currentId;
      img.src = "./Sprites/General/Pea.png";
      img.style.position = "absolute";
      img.style.left = `70px`;
      img.style.top = `7px`;
      img.style.userSelect = "none";
      img.style.webkitUserDrag = "none";
      img.style.zIndex = 3;
      img.style.width = "30px";
      img.style.height = "30px";
      peaBullet.set(currentId, {
        element: img,
        row: dataSeed.row,
        col: dataSeed.col,
        bulletInterval: null,
      });
      dataSeed.parentElement.appendChild(img);
      const bulletInterval = moveBullet(currentId);
      peaBullet.get(currentId).bulletInterval = bulletInterval;
    }, 2000);
  } else if (seedName == "icePea") {
    return setInterval(() => {
      let shouldFirePea = false;

      [...zombieMap.entries()].forEach(([zombieId, data]) => {
        const zombieLine = parseInt(zombieId.split("_")[1]);
        if (zombieLine == dataSeed.row) {
          shouldFirePea = true;
        }
      });

      if (!shouldFirePea) {
        return;
      }
      const currentId = `icePeaBullet_${bulletId++}`;
      const img = document.createElement("img");
      img.id = currentId;
      img.src = "./Sprites/General/IcePea.png";
      img.style.position = "absolute";
      img.style.left = `70px`;
      img.style.top = `7px`;
      img.style.userSelect = "none";
      img.style.webkitUserDrag = "none";
      img.style.zIndex = 3;
      img.style.width = "30px";
      img.style.height = "30px";
      peaBullet.set(currentId, {
        element: img,
        row: dataSeed.row,
        col: dataSeed.col,
        bulletInterval: null,
      });
      dataSeed.parentElement.appendChild(img);
      const bulletInterval = moveBullet(currentId);
      peaBullet.get(currentId).bulletInterval = bulletInterval;
    }, 2000);
  }
}

function moveBullet(id) {
  const data = peaBullet.get(id);
  return setInterval(() => {
    if (data.element.offsetLeft >= 820) {
      data.element.remove();
      clearInterval(data.bulletInterval);
      peaBullet.delete(id);
    }
    data.element.style.left = `${data.element.offsetLeft + 2}px`;
  }, 1);
}

function startSeedAnimation(img) {
  let totalFrame = 24;
  if (img.id.split("_")[0] == "sunFlower") {
    totalFrame = 24;
    let currentFrame = String(img.src).split("/").at(-1).split("_")[1];
    return setInterval(() => {
      currentFrame = (currentFrame + 1) % totalFrame;
      img.src = `./Sprites/${
        String(img.id.split("_")[0]).charAt(0).toUpperCase() +
        String(img.id.split("_")[0]).slice(1)
      }/frame_${currentFrame.toString().padStart(2, "0")}_delay-0.06s.gif`;
    }, 60);
  } else {
    totalFrame =
      img.id.split("_")[0] == "wallNut"
        ? 32
        : img.id.split("_")[0] == "peaShooter"
        ? 30
        : 31;
    let currentFrame = String(img.src).split("/").at(-1).split("_")[1];
    return setInterval(() => {
      currentFrame = (currentFrame + 1) % totalFrame;
      img.src = `./Sprites/${
        String(img.id.split("_")[0]).charAt(0).toUpperCase() +
        String(img.id.split("_")[0]).slice(1)
      }/frame_${currentFrame.toString().padStart(2, "0")}_delay-0.12s.gif`;
    }, 120);
  }
}

let cantPlace = false;
function setImgTo(col, row, img) {
  const data = seeds.get(img.id);
  if (data == undefined) return;
  const parent = data.parentElement;
  parent.style.position = "relative";
  parent.style.gridColumn = col;
  parent.style.gridRow = row;
  img.style.left = "0px";
  img.style.top = "0px";
  cantPlace = false;
  [...seeds.entries()].forEach(([id, seed]) => {
    if (seed.isPlaced && seed.col == col && seed.row == row) {
      cantPlace = true;
    }
    if (cantPlace) {
      data.bgRedElement.style.opacity = "0.7";
      img.style.opacity = img.id == "shovel" ? 0 : 1;
      shovel.style.backgroundColor = "red";
    } else {
      cantPlace = false;
      shovel.style.backgroundColor = img.id == "shovel" ? "red" : "";
      data.bgRedElement.style.opacity = "0";
      img.style.opacity = img.id == "shovel" ? 0 : 0.5;
    }
  });
}

let isShovel = false;
window.addEventListener("click", (e) => {
  checkSunNumbPosition();
  if (e.target.id.split("_")[0] === "sun") {
    if (isDragging) return;
    isSunNumbNotEnough(0);
    e.target.remove();
    sunNumb.textContent = parseInt(sunNumb.textContent) + 50;
    checkSunNumbPosition();
  } else if (e.target.id == "sunFlower") {
    if (isDragging) return;
    isSunNumbNotEnough(50);
    if (sunNumb.textContent < 50) return;
    sunNumb.textContent = parseInt(sunNumb.textContent) - 50;
    createSeed(e.target.id, e.clientX, e.clientY);
    checkSunNumbPosition();
  } else if (e.target.id == "wallNut") {
    if (isDragging) return;
    isSunNumbNotEnough(50);
    if (sunNumb.textContent < 50) return;
    sunNumb.textContent = parseInt(sunNumb.textContent) - 50;
    createSeed(e.target.id, e.clientX, e.clientY);
    checkSunNumbPosition();
  } else if (e.target.id == "peaShooter") {
    if (isDragging) return;
    isSunNumbNotEnough(100);
    if (sunNumb.textContent < 100) return;
    sunNumb.textContent = parseInt(sunNumb.textContent) - 100;
    createSeed(e.target.id, e.clientX, e.clientY);
    checkSunNumbPosition();
  } else if (e.target.id == "icePea") {
    if (isDragging) return;
    isSunNumbNotEnough(175);
    if (sunNumb.textContent < 175) return;
    sunNumb.textContent = parseInt(sunNumb.textContent) - 175;
    createSeed(e.target.id, e.clientX, e.clientY);
    checkSunNumbPosition();
  } else if (e.target.id == "shovel") {
    if (isDragging || isShovel) {
      const oldData = seeds.get("shovel");
      oldData.bgRedElement.remove();
      oldData.parentElement.remove();
      oldData.element.remove();

      isShovel = false;
      isDragging = false;
      seeds.delete("shovel");
      shovel.style.backgroundColor = "";
      return;
    }
    createSeed(e.target.id, e.clientX, e.clientY);
    isShovel = true;
    shovel.style.backgroundColor = "red";
  } else if (e.target.id.split("_")[0] == "detail") {
    if (isDetailOpen) return;
    handleDetailClick(e.target.id);
    isDetailOpen = true;
  }
});

function formatDate(date) {
  const d = new Date(date);
  let year = d.getFullYear();
  let month = String(d.getMonth() + 1).padStart(2, "0");
  let day = String(d.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

let isDetailOpen = false;
const detailWrapper = document.getElementById("detailWrapper");
function handleDetailClick(id) {
  leaderboard.forEach((data, i) => {
    if (i === parseInt(id.split("_")[1])) {
      detailWrapper.style.display = "flex";
      document.getElementById("usernameDetail").textContent = data.username;
      document.getElementById("scoreDetail").textContent = data.score;
      document.getElementById("timeDetail").textContent = data.time;
      document.getElementById("levelDetail").innerHTML =
        data.level.charAt(0).toUpperCase() + data.level.slice(1);
      document.getElementById("dateDetail").textContent = formatDate(
        data.timestamp
      );
    }
  });
}

document.getElementById("closeDetail").addEventListener("click", () => {
  detailWrapper.style.display = "none";
  isDetailOpen = false;
});

function checkSunNumbPosition() {
  if (sunNumb.textContent < 10) {
    sunNumb.style.left = "147px";
  } else if (sunNumb.textContent < 100) {
    sunNumb.style.left = "141px";
  } else if (sunNumb.textContent < 1000) {
    sunNumb.style.left = "137px";
  } else {
    sunNumb.style.left = "132px";
  }
}

function isSunNumbNotEnough(numb) {
  if (sunNumb.textContent < numb) {
    sunNumb.style.color = "red";
  } else {
    sunNumb.style.color = "black";
  }
}

const leaderboardContainer = document.getElementById("leaderboardContainer");
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
function updateLeaderboard() {
  const sortBy = document.getElementById("sortBy").value;
  leaderboardContainer.innerHTML = "";

  leaderboard.sort((a, b) => {
    if (sortBy == "score") {
      return b.score - a.score;
    } else if (sortBy == "time") {
      return a.timestamp - b.timestamp;
    }
  });

  leaderboard.forEach((data, index) => {
    const box = document.createElement("div");
    box.className = "box";
    box.innerHTML = ` <div class="box">
    <div class="side">
    <h1>${data.username}</h1>
    <p>Score : ${data.score}</p>
    </div>
    <button class="detail" id="detail_${index}">Detail</button>
    </div>`;

    leaderboardContainer.appendChild(box);
  });
}

const sortByBtn = document.getElementById("sortBy");
sortByBtn.addEventListener("change", () => {
  updateLeaderboard();
});
