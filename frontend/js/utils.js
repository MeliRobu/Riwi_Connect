export function updateActiveNavLink() {
  const currentPath = window.location.hash.slice(1) || "/";
  document.querySelectorAll(".nav-link[data-route]").forEach(link => {
    link.classList.toggle("active-link", link.dataset.route === currentPath);
  });
}

document.addEventListener('DOMContentLoaded', updateActiveNavLink);

 export function toggleUserMenu() {
  const menu = document.getElementById("user-menu");
  const arrow = document.getElementById("user-menu-arrow")
  menu.classList.toggle("menu-open");
  menu.classList.toggle("menu-closed");
  arrow.classList.toggle("rotate-180");
}

export function initUserMenuListener() {
  document.addEventListener("click", (e) => {
    const trigger = document.getElementById("user-menu-trigger");
    const menu = document.getElementById("user-menu");
    if (menu && menu.classList.contains("menu-open")) {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add("menu-closed");
        menu.classList.remove("menu-open");
        document.getElementById("user-menu-arrow").classList.remove("rotate-180");
      }
    }
  });
}

export function toggleSettingsSubmenu(event) {
  event.stopPropagation();
  const submenu = document.getElementById("settings-submenu");
  const arrow = document.getElementById("settings-arrow");
  submenu.classList.toggle("submenu-open");
  arrow.classList.toggle("rotate-180");
}