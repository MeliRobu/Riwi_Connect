import '../css/styles.css';
import {navbar} from '../components/navbar';
import { router } from './router/router';
import { toggleUserMenu,initUserMenuListener, toggleSettingsSubmenu  } from './utils';

document.getElementById("sidebar-container").innerHTML = navbar();

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
window.closeMobileMenu = closeMobileMenu;