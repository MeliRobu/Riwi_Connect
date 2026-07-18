import CanvasJS from "@canvasjs/charts";
import { card } from "../components/card";

export function getFormattedDate() {
  const date = new Date();
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function loadDashboardProfile() {
  try {
    const response = await fetch('/users/profile');
    if (!response.ok) return;
    const data = await response.json();
    const firstName = (data.full_name || '').trim().split(' ')[0];
    const welcomeEl = document.getElementById('welcome-name');
    if (welcomeEl && firstName) {
      welcomeEl.textContent = `Bienvenido, ${firstName}`;
    }
  } catch (error) {
    console.error('Error cargando perfil del dashboard:', error);
  }
}

export function dashboard() {
  setTimeout(() => { loadDashboardProfile(); }, 0);
  return `
    <main class="flex flex-col gap-4 px-5 h-screen py-10">
        <div class="relative flex flex-col overflow-hidden rounded-lg h-60 ">
          
            <img 
                src="assets/dashboard-banner.png" 
                alt="Dashboard Banner" 
                class="absolute inset-0 h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-black/30"></div>

            <div class="relative z-10 flex flex-col p-8 md:p-12">
                <span id="welcome-name" class="text-5xl font-bold text-white">Bienvenido, usuario</span>
                <span class="mt-2 text-lg text-gray-100">Empieza a crear tus futuros proyectos</span>
                <span class="  text-l py-12 text-sm font-semibold text-gray-200 mb-1">${getFormattedDate()}</span>
            </div>
        </div>
        <div class="w-full max-w-[1200px] mx-auto gap-6 md:gap-10 flex flex-col md:flex-row items-stretch justify-center py-10">
            <a class="group max-w-[360px] w-full cursor-pointer" 
         href="#/assessment" data-route="/assessment" onclick="navigate(event, '/assessment')">
        ${card({
          className:
            "h-auto min-h-[280px] md:h-110 overflow-visible transition-all duration-300 group-hover:bg-[#4b3fa8] group-hover:text-white",
          width: "w-full",
          content: `
                <div class="flex flex-col gap-4 md:gap-8 font-bold">
                    <span class="font-bold text-lg md:text-xl">Assessment</span>
                    <img class="w-32 h-32 md:w-70 md:h-50 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/assessment-dash.svg">
                    <span class="text-sm md:text-base text-gray-400 group-hover:text-white">¡Conoce tus debilidades y fortalezas con una breve encusta de tus habilidades técnicas!</span>
                </div>
                `,
        })}
    </a>

    <a class="group max-w-[360px] w-full cursor-pointer" 
        href="#/profile" data-route="/profile" onclick="navigate(event, '/profile')">
        ${card({
          className:
            "h-auto min-h-[280px] md:h-110 overflow-visible transition-all duration-300 group-hover:bg-yellow-400 group-hover:text-white",
          width: "w-full",
          content: `
                <div class="flex flex-col gap-4 md:gap-8 font-bold">
                    <span class="font-bold text-lg md:text-xl">Perfil inteligente</span>
                    <img class="w-32 h-32 md:w-70 md:h-50 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/smart_profile.svg">
                    <span class="text-sm md:text-base text-gray-400 group-hover:text-white">Observa tu perfil y analiza tus cualidades para encontrar tu equipo indicado!</span>
                </div>
                `,
        })}
    </a>

    <a class="group max-w-[360px] w-full cursor-pointer" 
        href="#/teams" data-route="/teams" onclick="navigate(event, '/teams')">
        ${card({
          className:
            "h-auto min-h-[280px] md:h-110 overflow-visible transition-all duration-300 group-hover:bg-cyan-400 group-hover:text-white",
          width: "w-full",
          content: `
                <div class="flex flex-col gap-4 md:gap-8 font-bold">
                    <span class="font-bold text-lg md:text-xl">Equipos</span>
                    <img class="w-32 h-32 md:w-70 md:h-50 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/scrum_teams.svg">
                    <span class="text-sm md:text-base text-gray-400 group-hover:text-white">Consulta las fortalezas y debilidades de los equipos conformados</span>
                </div>
                `,
        })}
    </a>
    </div>
        </main>
    `;
}
