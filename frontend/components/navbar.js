
/// 5427F5
export function navbar() {
    return `
<aside class=" bg-white text-black h-full flex flex-col justify-between border border-gray-100 rounded-3xl shadow-sm">
  <div class="p-5 flex flex-col h-full">
    
  
    <h1 class="text-center text-3xl font-bold tracking-wide text-[#4B3FA8] mb-8 px-2 ">
      <span class="text-purple-500 text-4xl">{</span>onnect
    </h1>
  

    <nav class="space-y-1 flex-1">
      <a href="#/dashboard" data-route="/dashboard" onclick="navigate(event, '/dashboard')"
         class=" nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200" >

         <img src="./assets/icons/dashboard.svg" class="w-5 h-5" width="20" height="20">
        Dashboard
      </a>

      <a href="#/tasks" data-route="/tasks" onclick="navigate(event, '/tasks')"
         class=" nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200">
        <img src="./assets/icons/assessment.svg" class="w-5 h-5 opacity-60" width="20" height="20">
        Assessment
      </a>

      <a href="#/teams" data-route="/teams" onclick="navigate(event, '/teams')"
         class=" nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200">
        <img src="./assets/icons/teams.svg" class="w-5 h-5 opacity-60" width="20" height="20">
        Equipos
      </a>

      <a href="#/recomendations" data-route="/recomendations" onclick="navigate(event, '/recomendations')"
         class=" nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-[#4B3FA8] hover:bg-[#F3F1FA] transition-all duration-200">
        <img src="./assets/icons/suggestions.svg" class="w-5 h-5 opacity-60" width="20" height="20">
        Sugerencias
      </a>
    </nav>

    <div class="relative">
      <div id="user-menu"
          class="menu-closed absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">

        <!-- Trigger de Configuración -->
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

        <!-- Submenú de Configuración -->
        <div id="settings-submenu" class="submenu-grid">
          <div class="submenu-inner">
            <a href="#/smart_profile" data-route="/profile" onclick="navigate(event, '/profile')"
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
    `
}