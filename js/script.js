/**
 * Sistema de navegación y scroll
 * Maneja el efecto de scroll en la nav y el resaltado de enlaces activos
 */

const NavigationManager = {
  nav: null,
  sections: [],
  links: [],
  scrollThreshold: 150,

  handleScrollEffect() {
    const scrolled = window.scrollY > 1;
    this.nav?.classList.toggle("scrolled", scrolled);
  },

  updateActiveLink() {
    if (!this.links.length) return;
    let current = "";
    const scrollPos = window.scrollY;

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop - this.scrollThreshold;
      if (scrollPos >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    this.links.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${current}` || (current === "" && href === "#top");
      link.classList.toggle("active", isActive);
    });
  },

  init() {
    this.nav = document.getElementById("mainNav");
    if (!this.nav) return;
    this.sections = Array.from(document.querySelectorAll("section"));
    this.links = Array.from(this.nav.querySelectorAll("a"));
    window.addEventListener("scroll", () => {
      this.handleScrollEffect();
      this.updateActiveLink();
    });
    this.handleScrollEffect();
    this.updateActiveLink();
  }
};

const DropdownManager = {
  dropdown: null,
  dropdownBtn: null,

  init() {
    this.dropdown = document.querySelector(".dropdown");
    this.dropdownBtn = this.dropdown?.querySelector(".dropdown-btn");
    if (!this.dropdown || !this.dropdownBtn) return;

    this.dropdownBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      this.dropdown.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
      if (!this.dropdown.contains(event.target)) {
        this.dropdown.classList.remove("open");
      }
    });
  }
};

function bootstrapNav() {
  NavigationManager.init();
  DropdownManager.init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapNav);
} else {
  bootstrapNav();
}

document.addEventListener("nav:loaded", bootstrapNav);