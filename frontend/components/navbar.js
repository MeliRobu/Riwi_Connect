import { card } from "../components/card.js";
/**
 * Reusable Sidebar Navigation Component
 * Generates the main vertical navigation sidebar as an HTML string for the SPA layout.
 * Includes links to dashboard, assessments, teams, and suggestions, along with a 
 * collapsible user settings submenu and dark mode controls.
 * * @returns {string} The raw HTML string of the sidebar navigation component.
 */
export function navbar(isAdmin = false) {
  // ajusta este valor según cómo llames al rol en tu app

  return `
<!-- Botón hamburguesa - solo visible en móvil -->
<button id="menu-toggle" onclick="toggleMobileMenu()"
    class="md:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-xl shadow-md border border-gray-100">
  <svg id="hamburger-icon" class="w-6 h-6 text-[#4B3FA8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
</button> 

<!-- Overlay oscuro detrás del menú en móvil -->
<div id="menu-overlay" onclick="closeMobileMenu()"
    class="md:hidden fixed inset-0 bg-black/40 z-30 opacity-0 pointer-events-none transition-opacity duration-300">
</div>

<aside id="sidebar"
    class="bg-white text-black h-full flex flex-col justify-between border border-gray-100 rounded-3xl shadow-sm
           fixed md:static top-0 left-0 z-40 w-72 md:w-full
           -translate-x-full md:translate-x-0
           transition-transform duration-300 ease-in-out">
  <div class="p-5 flex flex-col h-full">
    <div class="flex  flex-col  items-center ">  
    <a class="  py-1 hover:scale-100 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer text-center text-3xl font-bold tracking-wide text-[#4B3FA8] mb-8 px-2" href="#/" data-route="/" onclick="navigate(event, '/')">
        <span class="text-pink-600 text-4xl font-bold">{</span>onnect
      </a>
        <!-- Acá va la función de rol-->
        <span class="py-2 flex ">
            ${card({
              content: "Coder",
              bgColor: "bg-pink-500",
              className: "text-white font-bold  py-1 text-center w-50 ",
            })}
        </span>
    </div>
    <nav class="space-y-1 flex-1" >
      ${isAdmin ? `
      <a href="#/admin_home" data-route="/admin_home" onclick="navigate(event, '/admin_home'); closeMobileMenu()"
         class=" nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200">
        <img src="./assets/icons/admin.svg" class="w-5 h-5 opacity-60" width="20" height="20">
        Administrar
      </a>
      ` : `
      <a href="#/dashboard" data-route="/dashboard" onclick="navigate(event, '/dashboard'); closeMobileMenu()"
         class="nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200">
         <img src="./assets/icons/dashboard.svg" class="w-5 h-5" width="20" height="20">
        Dashboard
      </a>

      <a href="#/assessment" data-route="/assessment" onclick="navigate(event, '/assessment'); closeMobileMenu()"
         class="nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200">
        <img src="./assets/icons/assessment.svg" class="w-5 h-5 opacity-60" width="20" height="20">
        Assessment
      </a>

      <a href="#/teams" data-route="/teams" onclick="navigate(event, '/teams'); closeMobileMenu()"
         class="nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200">
        <img src="./assets/icons/teams.svg" class="w-5 h-5 opacity-60" width="20" height="20">
        Equipos
      </a>

      <a href="#/recommendations" data-route="/recommendations" onclick="navigate(event, '/recommendations'); closeMobileMenu()"
         class="nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200">
        <img src="./assets/icons/suggestions.svg" class="w-5 h-5 opacity-60" width="20" height="20">
        Sugerencias
      </a>
      `}
    </nav>

    <div class="relative">
      <div id="user-menu"
          class="menu-closed absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">

        <button onclick="toggleSettingsSubmenu(event)"
           class="w-full cursor-pointer flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200">
          <span class="flex items-center gap-3">
            <img src="./assets/icons/settings.svg" class="w-5 h-5 opacity-60" width="20" height="20">
            Configuración
          </span>
          <svg id="settings-arrow" class="w-4 h-4 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div id="settings-submenu" class="submenu-grid">
          <div class="submenu-inner">
            <a href="#/smart_profile" data-route="/profile" onclick="navigate(event, '/profile'); closeMobileMenu()"
              class="nav-link flex items-center gap-3 pl-7 pr-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200">
              <img src="./assets/icons/profile.svg" class="w-5 h-5 opacity-60" width="20" height="20">
              Perfil
            </a>
            <button onclick="toggleDarkMode()"
              class="w-full flex items-center gap-3 pl-7 pr-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200 cursor-pointer">
              <img src="./assets/icons/dark_mode.svg" class="w-5 h-5 opacity-60" width="20" height="20">
              Modo oscuro
            </button>
          </div>
        </div>

        <button onclick="logout()"
          class="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-red-700 hover:bg-red-50 transition-all duration-200 border-t border-gray-100">
          Cerrar sesión
        </button>
      </div>

      <div id="user-menu-trigger" onclick="toggleUserMenu()"
          class="flex items-center gap-3 bg-[#F3F1FA] px-4 py-3 rounded-2xl hover:bg-[#E9E5FB] transition-colors duration-200 cursor-pointer">
        <div class="w-9 h-9 rounded-full bg-[#4B3FA8] overflow-hidden flex items-center justify-center shrink-0">
          <img src="./assets/default-profile.png" width="20" height="20">
        </div>
        <span class="text-sm font-semibold text-gray-700 truncate flex-1">Usuario</span>
        <svg id="user-menu-arrow" class="w-4 h-4 text-gray-400 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </div>
    </div>

  </div>
</aside>
`;
}