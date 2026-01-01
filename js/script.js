/**
 * Sistema de navegación y scroll
 * Maneja el efecto de scroll en la nav y el resaltado de enlaces activos
 * Funciona tanto en la misma página como entre páginas diferentes
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

  /**
   * Obtiene la página actual normalizada
   */
  getCurrentPage() {
    const path = window.location.pathname;
    // Normalizar la ruta para comparación
    if (path.endsWith('/') || path.endsWith('index.html') || path === '/') {
      return 'index';
    }
    const pageName = path.split('/').pop().replace('.html', '');
    return pageName || 'index';
  },

  /**
   * Corrige las rutas de la navegación basándose en la ubicación actual
   */
  fixNavigationPaths() {
    const currentPage = this.getCurrentPage();
    const isInSubfolder = currentPage !== 'index';

    this.links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;

      // Ajustar rutas según la ubicación
      if (isInSubfolder) {
        // Estamos en /html/about.html o /html/projects.html
        if (href === '/' || href === '/index.html') {
          link.setAttribute('href', '../index.html');
        } else if (href.startsWith('/html/')) {
          link.setAttribute('href', href.replace('/html/', ''));
        }
      } else {
        // Estamos en index.html
        if (href === '/' || href === '/index.html') {
          link.setAttribute('href', '#top');
        } else if (href.startsWith('/html/')) {
          link.setAttribute('href', href.substring(1)); // Quitar el /
        }
      }
    });
  },

  /**
   * Actualiza el enlace activo basándose en la página actual y el scroll
   */
  updateActiveLink() {
    if (!this.links.length) return;
    
    const currentPage = this.getCurrentPage();
    let current = "";
    const scrollPos = window.scrollY;

    // Si hay secciones en la página actual, detectar cuál está visible
    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop - this.scrollThreshold;
      if (scrollPos >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    // Marcar enlaces activos
    this.links.forEach((link) => {
      const dataPage = link.getAttribute('data-page');
      const href = link.getAttribute("href");
      let isActive = false;

      // Si tiene data-page, usar eso para comparar
      if (dataPage) {
        isActive = dataPage === currentPage;
      } 
      // Enlace a otra página
      else if (href && href.includes('.html')) {
        const linkPage = href.split('/').pop().replace('.html', '').split('#')[0];
        isActive = linkPage === currentPage;
      } 
      // Enlace a sección en la misma página
      else if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        isActive = (current === targetId) || 
                   (current === "" && targetId === "top" && currentPage === "index");
      }

      link.classList.toggle("active", isActive);
    });
  },

  init() {
    this.nav = document.getElementById("mainNav");
    if (!this.nav) return;
    
    this.sections = Array.from(document.querySelectorAll("section"));
    this.links = Array.from(this.nav.querySelectorAll("a"));
    
    // Corregir rutas según ubicación
    this.fixNavigationPaths();
    
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