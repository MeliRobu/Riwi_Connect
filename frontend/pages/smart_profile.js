import { card } from "../components/card";
import { progressBar } from "../components/progress_bar";
import CanvasJS from '@canvasjs/charts';

const profileData = {
    name: 'Melissa Rodriguez',
    image: './assets/default-profile.png',
    campus: 'Riwi Medellín',
    journey: 'Jornada Tarde',
    clan: 'Clan Fénix',
    overallScore: 87,
    techScores: [
        { name: 'JavaScript', score: 92 },
        { name: 'HTML & CSS', score: 88 },
        { name: 'Node.js', score: 75 },
        { name: 'SQL', score: 80 },
        { name: 'Git & GitHub', score: 95 }
    ],
    strengths: [
        'Resolución de problemas lógicos',
        'Trabajo en equipo y comunicación',
        'Rapidez de aprendizaje en nuevas tecnologías'
    ],
    improvements: [
        'Profundizar en bases de datos avanzadas',
        'Mejorar cobertura de pruebas automatizadas',
        'Documentación técnica más detallada'
    ],
    interpretation: 'Melissa muestra un perfil técnico sólido con especial fortaleza en JavaScript y control de versiones. Su capacidad de trabajo en equipo lo posiciona como un candidato ideal para roles de desarrollo frontend, con potencial de crecimiento hacia fullstack si refuerza sus bases en backend y bases de datos.'
};

// 1. FUNCIÓN RENDER: Genera exclusivamente la estructura HTML de la vista
export function smart_profile() {
    const p = profileData;

    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">

        <!-- Encabezado con imagen, nombre y datos básicos -->
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6 pt-6">
            <img 
                src="${p.image}" 
                alt="${p.name}" 
                class="w-32 h-32 rounded-full object-cover border-4 border-[#4B3FA8] shadow-md"
            >
            <div class="flex flex-col gap-2 text-center md:text-left">
                <span class="text-3xl font-bold">${p.name}</span>
                <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-semibold px-4 py-1.5 rounded-full">${p.campus}</span>
                    <span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-semibold px-4 py-1.5 rounded-full">${p.journey}</span>
                    <span class="bg-pink-100 text-pink-600 text-sm font-semibold px-4 py-1.5 rounded-full">${p.clan}</span>
                </div>
            </div>
        </div>

        <!-- Puntaje general y Gráfico de Dona -->
        <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div class="md:col-span-3">
                ${card({
                    className: 'flex flex-col items-center justify-center gap-2 py-8 bg-white p-6 rounded-lg shadow',
                    width: 'w-full',
                    content: `
                        <span class="text-sm font-semibold text-gray-400">Puntaje General</span>
                        <span class="text-8xl font-black text-[#4B3FA8]">${p.overallScore}</span>
                        <span class="text-sm text-gray-400 mb-4">/ 100</span>
                        

                    `
                })}
            </div>

            <!-- Puntajes por tecnología -->
            <div class="md:col-span-3">
                ${card({
                    className: 'flex flex-col gap-4 p-6',
                    width: 'w-full',
                    content: `
                        <span class="text-lg font-bold mb-2">Puntajes por tecnología</span>
                        ${p.techScores.map(tech => `
                            <div class="flex flex-col gap-1">
                                <div class="flex justify-between text-sm">
                                    <span class="font-semibold text-gray-600">${tech.name}</span>
                                    <span class="font-bold text-[#4B3FA8]">${tech.score}%</span>
                                </div>
                                ${progressBar({
                                    value: tech.score.toString(),
                                    size: 'w-full h-2'
                                })}
                            </div>
                        `).join('')}
                    `
                })}
            </div>
        </div>

        <!-- Fortalezas y oportunidades de mejora -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${card({
                className: 'p-6 flex flex-col gap-3',
                width: 'w-full',
                content: `
                    <span class="text-lg font-bold text-emerald-600">Fortalezas</span>
                    <ul class="flex flex-col gap-2">
                        ${p.strengths.map(item => `
                            <li class="flex items-start gap-2 text-sm text-gray-600">
                                <span class="text-emerald-500 font-bold mt-0.5">✓</span>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                `
            })}

            ${card({
                className: 'p-6 flex flex-col gap-3',
                width: 'w-full',
                content: `
                    <span class="text-lg font-bold text-amber-600">Oportunidades de mejora</span>
                    <ul class="flex flex-col gap-2">
                        ${p.improvements.map(item => `
                            <li class="flex items-start gap-2 text-sm text-gray-600">
                                <span class="text-amber-500 font-bold mt-0.5">↗</span>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                `
            })}
        </div>

        ${card({
            className: 'p-6 flex flex-col gap-3',
            width: 'w-full',
            content: `
                <span class="text-lg font-bold text-[#4B3FA8]">Interpretación IA</span>
                <p class="text-sm text-gray-600 leading-relaxed">${p.interpretation}</p>
            `
        })}

    </main>
    `;
}

