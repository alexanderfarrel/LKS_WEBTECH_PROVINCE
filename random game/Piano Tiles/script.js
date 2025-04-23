let randomRow = [];

const gameWrapper = document.querySelector(".game-wrapper");
const score = document.querySelector(".score");
function gameStart() {
  createPiano();
  createPiano();
  createPiano();
  createPiano();
}

function createPiano() {
  const row = document.createElement("div");
  row.classList.add("row");
  randomRow = Array(4).fill("white");
  randomNumb = Math.floor(Math.random() * 4);
  randomRow[randomNumb] = "black";

  randomRow.forEach((color) => {
    const col = document.createElement("div");
    col.classList.add("col");
    col.classList.add(color);
    row.appendChild(col);
  });

  gameWrapper.insertBefore(row, gameWrapper.firstChild);
}

function handleClick(e) {
  if (e.target.classList.contains("black")) {
    const clickedRow = e.target.parentElement;
    const isLastRow = clickedRow === gameWrapper.lastElementChild;

    if (isLastRow) {
      score.textContent = parseInt(score.textContent) + 1;
      e.target.parentElement.remove();
      createPiano();
    }
  }
}

document.addEventListener("click", (e) => handleClick(e));

gameStart();

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

console.log(arr);
