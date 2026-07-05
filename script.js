const filterButtons = document.querySelectorAll(".filter-button");
const devlogCards = document.querySelectorAll(".devlog-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    devlogCards.forEach((card) => {
      if (filter === "all" || card.dataset.game === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});