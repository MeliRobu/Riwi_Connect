import '../css/styles.css';
import {navbar} from '../components/navbar';
import { router } from './router/router';
import { toggleUserMenu,initUserMenuListener, toggleSettingsSubmenu  } from './utils';

document.getElementById("sidebar-container").innerHTML = navbar();

window.toggleUserMenu = toggleUserMenu;

// Igual que hiciste con navigate: exponerla globalmente
window.toggleUserMenu = toggleUserMenu;
window.toggleSettingsSubmenu = toggleSettingsSubmenu;
initUserMenuListener();
router();

