/**
 * Reusable Sidebar Navigation Component
 * Generates the main vertical navigation sidebar as an HTML string for the SPA layout.
 * Includes links to dashboard, assessments, teams, and suggestions, along with a 
 * collapsible user settings submenu and dark mode controls.
 * @returns {string} The raw HTML string of the sidebar navigation component.
 */
export function navbar() {
  // Ajusta este valor según cómo llames al rol en tu app
 const isAdmin = (window.localStorage.getItem('role') || '').toUpperCase() === 'ADMINISTRATOR';
  return `
<!-- Botón hamburguesa - solo visible en móvil -->
<button id="menu-toggle" onclick="toggleMobileMenu()"
    class="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-200/50 hover:bg-white hover:scale-105 transition-all duration-300">
  <svg id="hamburger-icon" class="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"></line>
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="4" y1="18" x2="20" y2="18"></line>
  </svg>
</button>

<!-- Overlay oscuro detrás del menú en móvil -->
<div id="menu-overlay" onclick="closeMobileMenu()"
    class="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 opacity-0 pointer-events-none transition-opacity duration-500">
</div>

<!-- Menú lateral FLOTANTE, GLASS BLANCO Y GRIS -->
<aside id="sidebar"
    class="bg-white/70 backdrop-blur-2xl text-gray-800 flex flex-col justify-between border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)]
           fixed md:sticky top-4 left-4 md:ml-4 md:mt-4 z-40 w-[280px] shrink-0
           h-[calc(100vh-2rem)] rounded-[2.5rem]
           -translate-x-[120%] md:translate-x-0
           transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
  
  <button onclick="const sb = document.getElementById('sidebar'); sb.classList.toggle('w-[280px]'); sb.classList.toggle('w-[88px]'); sb.classList.toggle('rounded-[2.5rem]'); sb.classList.toggle('rounded-3xl'); const inner = document.getElementById('sidebar-inner'); inner.classList.toggle('px-6'); inner.classList.toggle('px-3'); const footer = document.getElementById('sidebar-footer'); footer.classList.toggle('px-6'); footer.classList.toggle('px-3'); const um = document.getElementById('user-menu'); um.classList.toggle('bottom-[calc(100%+12px)]'); um.classList.toggle('left-0'); um.classList.toggle('bottom-0'); um.classList.toggle('left-full'); um.classList.toggle('ml-4'); document.querySelectorAll('.hide-on-collapse').forEach(el => el.classList.toggle('hidden')); document.getElementById('icon-close').classList.toggle('hidden'); document.getElementById('icon-open').classList.toggle('hidden');" 
    class="hidden md:flex absolute top-8 -right-3.5 z-50 w-7 h-7 items-center justify-center bg-white border border-gray-200 shadow-md rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all cursor-pointer" title="Alternar panel">
    <svg id="icon-close" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
    </svg>
    <svg id="icon-open" class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
    </svg>
  </button>

  <div id="sidebar-inner" class="px-6 pt-8 pb-4 flex flex-col flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-500">
    
    <!-- Logo -->
    <div class="mb-10 flex items-center justify-center">
      <a   href="#/" data-route="/" onclick="navigate(event, '/') class="flex items-center group animate-logo-in relative">
        <div class="absolute -inset-4 bg-gradient-to-r from-[#7c3aed]/20 to-[#6366f1]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none">
        </div>
        <span class="inline-block bg-gradient-to-br from-[#7c3aed] to-[#6A62FD] bg-clip-text text-transparent text-4xl font-black animate-pulse-414 group-hover:scale-110 transition-transform duration-300 relative z-10">{</span>
        <span class="hide-on-collapse text-[#F6339A] font-extrabold text-2xl tracking-tight -ml-0.5 logo-text relative z-10 [text-shadow:0_0_12px_rgba(255,255,255,0.8)] group-hover:text-gray-600 transition-colors duration-300">onnect</span>
      </a>
    </div>
  
    <!-- Navegación Principal -->
    <nav class="space-y-1.5 flex-1 w-full" >
      ${!isAdmin ? `
      <div class="hide-on-collapse text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">Principal</div>
      
      <a href="#/dashboard" data-route="/dashboard" onclick="navigate(event, '/dashboard'); closeMobileMenu()" title="Dashboard"
         class="nav-link group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-gray-100/80 hover:text-gray-900 text-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]">
         <div class="w-8 h-8 rounded-xl bg-gray-100/50 group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-200/50 shrink-0">
           <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
           </svg>
         </div>
        <span class="hide-on-collapse whitespace-nowrap">Dashboard</span>
      </a>

      <a href="#/assessment" data-route="/assessment" onclick="navigate(event, '/assessment'); closeMobileMenu()" title="Assessment"
         class="nav-link group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-gray-100/80 hover:text-gray-900 text-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]">
        <div class="w-8 h-8 rounded-xl bg-gray-100/50 group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-200/50 shrink-0">
          <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <span class="hide-on-collapse whitespace-nowrap">Assessment</span>
      </a>

      <a href="#/teams" data-route="/teams" onclick="navigate(event, '/teams'); closeMobileMenu()" title="Equipos"
         class="nav-link group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-gray-100/80 hover:text-gray-900 text-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]">
        <div class="w-8 h-8 rounded-xl bg-gray-100/50 group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-200/50 shrink-0">
          <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <span class="hide-on-collapse whitespace-nowrap">Equipos</span>
      </a>

        <a href="#/recommendations" data-route="/recommendations" onclick="navigate(event, '/recommendations'); closeMobileMenu()" title="Sugerencias"
         class="nav-link group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-gray-100/80 hover:text-gray-900 text-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]">
        <div class="w-8 h-8 rounded-xl bg-gray-100/50 group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-200/50 shrink-0">
          <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="hide-on-collapse whitespace-nowrap">Sugerencias</span>
      </a>

      ` : ''}
      ${isAdmin ? `
      <div class="hide-on-collapse mt-8 mb-3 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Gestión</div>
      <a href="#/admin_home" data-route="/admin_home" onclick="navigate(event, '/admin_home'); closeMobileMenu()" title="Administrar"
         class="nav-link group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-gray-100/80 hover:text-gray-900 text-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]">
        <div class="w-8 h-8 rounded-xl bg-gray-100/50 group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-200/50 shrink-0">
          <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span class="hide-on-collapse whitespace-nowrap">Administrar</span>
      </a>
      <a href="#/questions" data-route="/questions" onclick="navigate(event, '/questions'); closeMobileMenu()" title="Question Bank"
         class="nav-link group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-gray-100/80 hover:text-gray-900text-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]">
        <div class="w-8 h-8 rounded-xl bg-gray-100/50 group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-200/50 shrink-0">
          <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <span class="hide-on-collapse whitespace-nowrap">Question Bank</span>
      </a>
      <a href="#/admin_teams" data-route="/admin_teams" onclick="navigate(event, '/admin_teams'); closeMobileMenu()" title="Teams Overview"
         class="nav-link group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-gray-100/80 hover:text-gray-900text-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]">
        <div class="w-8 h-8 rounded-xl bg-gray-100/50 group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-200/50 shrink-0">
          <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <span class="hide-on-collapse whitespace-nowrap">Teams Overview</span>
      </a>
      <a href="#/statistics" data-route="/statistics" onclick="navigate(event, '/statistics'); closeMobileMenu()" title="Statistics"
         class="nav-link group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-gray-100/80 hover:text-gray-900text-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]">
        <div class="w-8 h-8 rounded-xl bg-gray-100/50 group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-200/50 shrink-0">
          <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2" />
          </svg>
        </div>
        <span class="hide-on-collapse whitespace-nowrap">Statistics</span>
      </a>
      ` : ''}
    </nav>
  </div>

  <div id="sidebar-footer" class="px-6 pb-8 transition-all duration-500">
    <!-- Menú de Usuario -->
    <div class="relative mt-4 pt-6 border-t border-gray-200">
      
      <!-- Popover de Configuración -->
      <div id="user-menu"
          class="menu-closed absolute bottom-[calc(100%+12px)] left-0 w-[232px] bg-white/95 backdrop-blur-3xl border border-gray-200 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 origin-bottom-left z-50">

        <button onclick="toggleSettingsSubmenu(event)"
           class="w-full cursor-pointer flex items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 group">
          <span class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Configuración
          </span>
          <svg id="settings-arrow" class="w-4 h-4 text-gray-400 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div id="settings-submenu" class="submenu-grid bg-gray-50/50 border-y border-gray-100">
          <div class="submenu-inner py-1">
            <a href="#/smart_profile" data-route="/profile" onclick="navigate(event, '/profile'); closeMobileMenu()"
              class="nav-link flex items-center gap-3 pl-11 pr-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 group">
              <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Perfil de usuario
            </a>
            <button onclick="toggleDarkMode()"
              class="w-full flex items-center gap-3 pl-11 pr-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 group cursor-pointer">
              <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Modo oscuro
            </button>
          </div>
        </div>

<a href="#/" data-route="/" onclick="logout(); navigate(event, '/'); closeMobileMenu()" title="Cerrar sesión"
   class="nav-link group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-rose-50 hover:text-rose-600 text-gray-600 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)] border-t border-gray-100 mt-2">
  <div class="w-8 h-8 rounded-xl bg-gray-100/50 group-hover:bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-200/50 shrink-0">
    <svg class="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M17 16l4-4m0 0l-4-4m4 4H9m11-4a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3h7a3 3 0 003-3" />
    </svg>
  </div>
  <span class="hide-on-collapse whitespace-nowrap">Cerrar sesión</span>
</a>
      </div>

      <!-- Trigger del menú de usuario -->
      <div id="user-menu-trigger" onclick="toggleUserMenu()"
          class="flex items-center gap-3 bg-white/50 border border-gray-200 p-3 rounded-2xl hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-300 cursor-pointer group">
         <div class="w-9 h-9 rounded-full bg-[#4B3FA8] overflow-hidden flex items-center justify-center shrink-0"> <img src="./assets/default-profile.png" width="20" height="20"> </div> 
        <div class="flex-1 min-w-0 hide-on-collapse">
          <p id="navbar-user-name" class="text-sm font-bold text-gray-800 truncate font-heading group-hover:text-gray-900 transition-colors">Usuario</p>
          <p id="navbar-user-role" class="text-[11px] font-medium text-gray-500 truncate uppercase tracking-wider">Coder</p>
          <p id="navbar-user-status" class="text-[11px] font-semibold truncate flex items-center gap-1"><span id="navbar-user-status-dot" class="w-1.5 h-1.5 rounded-full inline-block"></span></p>
        </div>
        <svg id="user-menu-arrow" class="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-transform duration-300 shrink-0 hide-on-collapse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </div>
    </div>

  </div>
</aside>
`;
}