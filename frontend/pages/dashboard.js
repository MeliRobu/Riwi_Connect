import CanvasJS from '@canvasjs/charts';
import { card } from '../components/card';
export function dashboard () {

    return `
    <main class="flex flex-col gap-4 px-5 h-screen">
    
        <span class="py-2 flex ">
                ${card({
                    content: 'Estudiantes',
                    bgColor: 'bg-pink-500',
                    className : 'text-white font-bold  py-1 text-center w-50 '
                })}
        </span>
        <span class="text-4xl font-bold ">Bienvenido, usuario</span>
        <span class=" text-gray-500">Empieza a crear tus futuros proyectos</span>

    <div class="w-full  gap-4 flex flex-col items-center">
        
                <div class="w-300 gap-10 flex items-center ">
               
            </div>
        </div>
    </main>
    `
}
