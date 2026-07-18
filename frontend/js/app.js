import '../css/styles.css';
import {navbar} from '../components/navbar';
import { router } from './router/router';
import { smart_profile } from '../pages/smart_profile.js';
import { toggleUserMenu,initUserMenuListener, toggleSettingsSubmenu, logout } from './utils';


// Asegura que exista un rol global; por defecto 'user'. Cambiar desde el login cuando corresponda.

document.getElementById("sidebar-container").innerHTML = navbar();
loadNavbarProfile();
window.addEventListener("hashchange", loadNavbarProfile);

async function loadNavbarProfile() {
  try {
    const response = await fetch('/users/profile');
    if (!response.ok) return; // not logged in (e.g. on /login), leave defaults
    const data = await response.json();
    const firstName = (data.full_name || '').trim().split(' ')[0];
    const roleLabels = { STUDENT: 'Coder', ADMINISTRATOR: 'Administrador' };
    const nameEl = document.getElementById('navbar-user-name');
    const roleEl = document.getElementById('navbar-user-role');
    if (nameEl && firstName) nameEl.textContent = firstName;
    if (roleEl) roleEl.textContent = roleLabels[data.role] || data.role;
  } catch (error) {
    console.error('Error cargando perfil del navbar:', error);
  }
}

window.toggleUserMenu = toggleUserMenu;


window.toggleUserMenu = toggleUserMenu;
window.toggleSettingsSubmenu = toggleSettingsSubmenu;
initUserMenuListener();
router();

function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menu-overlay');  
  const isOpen = sidebar.classList.contains('translate-x-0');

  if (isOpen) {
    closeMobileMenu();
  } else {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');
    document.body.style.overflow = 'hidden'; 
  }
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menu-overlay');

  sidebar.classList.remove('translate-x-0');
  sidebar.classList.add('-translate-x-full');
  overlay.classList.remove('opacity-100');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}


function handleResize() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth >= 768) {
    
    closeMobileMenu();
  }
}

window.addEventListener('resize', handleResize);
window.toggleMobileMenu = toggleMobileMenu;
window.logout = logout;
window.closeMobileMenu = closeMobileMenu;

const appContainer = document.getElementById("app");

