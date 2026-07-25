import '../css/styles.css';
import {navbar} from '../components/navbar';
import { router } from './router/router';
import { smart_profile } from '../pages/smart_profile.js';
import { toggleUserMenu,initUserMenuListener, toggleSettingsSubmenu, logout, applyStoredTheme, toggleDarkMode } from './utils';


// Asegura que exista un rol global; por defecto 'user'. Cambiar desde el login cuando corresponda.

applyStoredTheme();
document.getElementById("sidebar-container").innerHTML = navbar();
loadNavbarProfile();
window.addEventListener("hashchange", loadNavbarProfile);
window.loadNavbarProfile = loadNavbarProfile;

async function loadNavbarProfile() {
  try {
    document.getElementById("sidebar-container").innerHTML = navbar();
    const response = await fetch('/users/profile');
    if (!response.ok) return; // not logged in (e.g. on /login), leave defaults
    const data = await response.json();
    const firstName = (data.full_name || '').trim().split(' ')[0];
    const roleLabels = { STUDENT: 'Coder', ADMINISTRATOR: 'Administrador' };
    const nameEl = document.getElementById('navbar-user-name');
    const roleEl = document.getElementById('navbar-user-role');
    if (nameEl && firstName) nameEl.textContent = firstName;
    if (roleEl) roleEl.textContent = roleLabels[data.role] || data.role;
    const statusEl = document.getElementById('navbar-user-status');
    const statusDot = document.getElementById('navbar-user-status-dot');
    if (statusEl && statusDot && data.role === 'STUDENT') {
      const statusLabels = { AVAILABLE: 'Disponible', IN_TEAM: 'En equipo' };
      const statusColors = { AVAILABLE: ['text-green-600', 'bg-green-500'], IN_TEAM: ['text-[#4B3FA8]', 'bg-[#4B3FA8]'] };
      const [textColor, dotColor] = statusColors[data.status] || ['text-gray-400', 'bg-gray-400'];
      statusEl.className = `text-[11px] font-semibold truncate flex items-center gap-1 ${textColor}`;
      statusDot.className = `w-1.5 h-1.5 rounded-full inline-block ${dotColor}`;
      statusEl.querySelectorAll('.status-label-text').forEach(el => el.remove());
      const statusText = document.createElement('span');
      statusText.className = 'status-label-text';
      statusText.textContent = statusLabels[data.status] || data.status || '';
      statusEl.append(statusText);
    } else if (statusEl && statusDot) {
      // HU: (vacío documental) — El concepto Disponible/En equipo no aplica a
      // ADMINISTRATOR (RN-020 es exclusiva de estudiantes). Se limpia explícitamente
      // en vez de solo omitir la actualización, para no dejar texto de una sesión
      // anterior (ej. si el navegador ya había mostrado el estado de un estudiante).
      statusEl.querySelectorAll('.status-label-text').forEach(el => el.remove());
      statusDot.className = 'hidden';
    }
  } catch (error) {
    console.error('Error cargando perfil del navbar:', error);
  }
}

window.toggleUserMenu = toggleUserMenu;


window.toggleUserMenu = toggleUserMenu;
window.toggleSettingsSubmenu = toggleSettingsSubmenu;
window.toggleDarkMode = toggleDarkMode;
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

