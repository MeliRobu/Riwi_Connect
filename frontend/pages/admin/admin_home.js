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
            <span class=" text-gray-500">Empieza a crear tus futuros proyectos</span>
    
        <div class="w-full  gap-4 flex flex-col items-center">
        <div class="w-300 gap-10 flex items-center ">
                <a class="group w-full cursor-pointer">
                    ${card({
                        className: 'h-100 overflow-visible transition-all duration-300 group-hover:bg-pink-600 group-hover:text-white',
                        width: 'w-full',
                        content : `
                            <div class="flex  flex-col gap-8 font-bold">
                                <span class="font-bold text-xl">Banco de preguntas</span>
                                <img class=" w-70 h-50 translate-x-4 translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/questions.svg">
                                <span class=" text-gray-300 group-hover:text-white">Crea, edita, activa o desactiva preguntas, y configura las pruebas técnicas</span>
                            </div>
                                `
                    })}
                    </a>
                    <a class="group w-full cursor-pointer">
                        ${card({
                            className: 'h-100 overflow-visible transition-all duration-300 group-hover:bg-yellow-400 group-hover:text-white',
                            width: 'w-full',
                            content : `
                            <div class="flex  flex-col gap-5 font-bold gap-8">
                                <span class="font-bold text-xl">Estadísticas</span>
                                <img class="w-70 h-50 translate-x-4 translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/statistics.svg">
                                <span class="text-gray-300 group-hover:text-white">Revisa progreso de registro y estádisticas generales de equipos</span>                            
                            </div>
                                `
                        })}
                    </a>
                    <a class="group w-full cursor-pointer">
                        ${card({
                            className: 'h-100 overflow-visible transition-all duration-300 group-hover:bg-cyan-400 group-hover:text-white',
                            width: 'w-full',
                            content : `
                            <div class="flex  flex-col gap-5 font-bold gap-8">
                                <span class="font-bold text-xl">Equipos</span>
                                <img class="w-70 h-50 translate-x-4 translate-y-4 transition-transform duration-300 group-hover:scale-105" src="/assets/icons/scrum_teams.svg">
                                <span class="text-gray-300 group-hover:text-white">Consulta las fortalezas y debilidades de los equipos conformados</span>  
                                </div>
                                `
                        })}
                    </a>

        </div>
            </div>
        </main>
    `
}