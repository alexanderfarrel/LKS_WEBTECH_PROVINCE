const yellowSlide = document.querySelector(".yellow-slide");
const input = document.querySelectorAll("input");

input.forEach((item) => {
  item.addEventListener("mousemove", () => {
    yellowSlide.style.transform = `scaleX(${item.dataset.scale})`;
  });
});

input.forEach((item) => {
  item.addEventListener("mouseout", () => {
    yellowSlide.style.transform = "scaleX(0)";
    // document.body.style.cursor = "default";
  });
});
