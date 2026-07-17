import { card } from "../../components/card";

export function admin_home() {
    return `
    <main class="flex flex-col gap-4 px-5 h-screen py-10 items-center">
        <div class="relative flex flex-col overflow-hidden rounded-lg h-60 w-290">
            <img
                src="assets/dashboard-banner.png"
                alt="Dashboard Banner"
                class="absolute inset-0 h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-black/30"></div>

            <div class="relative z-10 flex flex-col p-8 md:p-12">
                <span class="text-5xl font-bold text-white">Bienvenido, administrador</span>
                <span class="mt-2 text-lg text-gray-100">Gestión y métricas del sistema</span>
            </div>
        </div>

        <div class="w-full max-w-[1200px] mx-auto gap-6 md:gap-10 flex flex-col md:flex-row items-stretch justify-center">
            <a class="group max-w-[360px] w-full cursor-pointer" href="#/questions" data-route="/questions" onclick="navigate(event, '/questions')">
                ${card({
                    className:
                        "h-auto min-h-[280px] md:h-120 overflow-visible transition-all duration-300 group-hover:bg-pink-600 group-hover:text-white",
                    width: "w-full",
                    content: `
                                <div class="flex flex-col gap-4 md:gap-8 font-bold">
                                        <span class="font-bold text-lg md:text-xl">Banco de preguntas</span>
                                        <img class="w-32 h-32 md:w-70 md:h-50 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/questions.svg">
                                        <span class="text-sm md:text-base text-gray-400 group-hover:text-white">Crea, edita, activa o desactiva preguntas, y configura las pruebas técnicas</span>
                                </div>
                                `,
                })}
            </a>

            <a class="group max-w-[360px] w-full cursor-pointer" href="#/statistics" data-route="/statistics" onclick="navigate(event, '/statistics')">
                ${card({
                    className:
                        "h-auto min-h-[280px] md:h-120 overflow-visible transition-all duration-300 group-hover:bg-yellow-400 group-hover:text-white",
                    width: "w-full",
                    content: `
                                <div class="flex flex-col gap-4 md:gap-8 font-bold">
                                        <span class="font-bold text-lg md:text-xl">Estadísticas</span>
                                        <img class="w-32 h-32 md:w-70 md:h-50 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/statistics.svg">
                                        <span class="text-sm md:text-base text-gray-400 group-hover:text-white">Revisa progreso de registro y estadísticas generales de equipos</span>
                                </div>
                                `,
                })}
            </a>

            <a class="group max-w-[360px] w-full cursor-pointer" href="#/admin_teams" data-route="/admin_teams" onclick="navigate(event, '/admin_teams')">
                ${card({
                    className:
                        "h-auto min-h-[280px] md:h-120 overflow-visible transition-all duration-300 group-hover:bg-cyan-400 group-hover:text-white",
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
