import { card } from "../../components/card"

export function admin_home () {
    return `
       <main class="flex flex-col gap-4 px-5 h-screen">
            <span class="py-2 flex ">
                    ${card({
                        content: 'Administrador',
                        bgColor: 'bg-pink-500',
                        className : 'text-white font-bold  py-1 text-center w-50 '
                    })}
            </span>
            <span class="text-4xl font-bold ">Bienvenido, usuario</span>
            <span class=" text-gray-500">Empieza a gestionar el futuro de los Coders</span>
    
<div class="w-full max-w-[1200px] gap-6 md:gap-10 flex flex-col md:flex-row items-stretch">
    <a class="group w-full cursor-pointer">
        ${card({
            className: 'h-auto min-h-[280px] md:h-110 overflow-visible transition-all duration-300 group-hover:bg-pink-600 group-hover:text-white',
            width: 'w-full',
            content : `
                <div class="flex flex-col gap-4 md:gap-8 font-bold">
                    <span class="font-bold text-lg md:text-xl">Banco de preguntas</span>
                    <img class="w-32 h-32 md:w-70 md:h-50 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/questions.svg">
                    <span class="text-sm md:text-base text-gray-400 group-hover:text-white">Crea, edita, activa o desactiva preguntas, y configura las pruebas técnicas</span>
                </div>
                `
        })}
    </a>

    <a class="group w-full cursor-pointer">
        ${card({
            className: 'h-auto min-h-[280px] md:h-110 overflow-visible transition-all duration-300 group-hover:bg-yellow-400 group-hover:text-white',
            width: 'w-full',
            content : `
                <div class="flex flex-col gap-4 md:gap-8 font-bold">
                    <span class="font-bold text-lg md:text-xl">Estadísticas</span>
                    <img class="w-32 h-32 md:w-70 md:h-50 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/statistics.svg">
                    <span class="text-sm md:text-base text-gray-400 group-hover:text-white">Revisa progreso de registro y estádisticas generales de equipos</span>
                </div>
                `
        })}
    </a>

    <a class="group w-full cursor-pointer">
        ${card({
            className: 'h-auto min-h-[280px] md:h-110 overflow-visible transition-all duration-300 group-hover:bg-cyan-400 group-hover:text-white',
            width: 'w-full',
            content : `
                <div class="flex flex-col gap-4 md:gap-8 font-bold">
                    <span class="font-bold text-lg md:text-xl">Equipos</span>
                    <img class="w-32 h-32 md:w-70 md:h-50 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/scrum_teams.svg">
                    <span class="text-sm md:text-base text-gray-400 group-hover:text-white">Consulta las fortalezas y debilidades de los equipos conformados</span>
                </div>
                `
        })}
    </a>
</div>
        </main>
    `
}