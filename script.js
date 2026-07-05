const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");

    const menuIsOpen = siteNav.classList.contains("open");

    menuToggle.setAttribute("aria-expanded", menuIsOpen);

    if (menuIsOpen) {
      menuToggle.textContent = "Close";
    } else {
      menuToggle.textContent = "Menu";
    }
  });
}

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