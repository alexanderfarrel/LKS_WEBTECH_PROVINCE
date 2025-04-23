const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

document.addEventListener("mousedown", (e) => {
  const clickEffect = document.createElement("div");
  clickEffect.classList.add("click-effect");
  document.body.appendChild(clickEffect);

  const moveEffect = (event) => {
    clickEffect.style.left = `${event.clientX}px`;
    clickEffect.style.top = `${event.clientY}px`;
  };

  document.addEventListener("mousemove", moveEffect);

  moveEffect(e);

  setTimeout(() => {
    clickEffect.remove();
    document.removeEventListener("mousemove", moveEffect);
  }, 300);
});
