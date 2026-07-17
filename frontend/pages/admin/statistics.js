import { card } from "../../components/card";
import { progressBar } from "../../components/progress_bar";

// ===== DATOS SIMULADOS - reemplaza por fetch real cuando tengas los endpoints =====
const statsData = {
    registrationComparison: {
        institutionalSource: 245,
        registeredUsers: 198
    },
    authorizedNotRegistered: 47,
    statusDistribution: {
        available: 62,
        inTeam: 136
    },
    totalTeams: 41,
    techAverages: [
        { name: 'JavaScript', average: 84 },
        { name: 'HTML & CSS', average: 88 },
        { name: 'Node.js', average: 71 },
        { name: 'SQL', average: 76 },
        { name: 'React', average: 79 },
        { name: 'Git & GitHub', average: 91 }
    ]
};

export function statistics_view() {
    setTimeout(() => loadStatistics(), 0);

    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div class="flex flex-col gap-1 pt-6">
            <span class="text-3xl font-bold">Estadísticas</span>
            <span class="text-gray-500 text-sm">Revisa progreso de registro y estadísticas generales de equipos</span>
        </div>

        <div id="stats-content">
            ${renderLoadingState()}
        </div>
    </main>
    `;
}

function renderLoadingState() {
    return `
        <div class="flex flex-col items-center justify-center gap-3 py-16">
            <div class="w-10 h-10 border-4 border-[#4B3FA8] border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-gray-400">Cargando estadísticas...</span>
        </div>
    `;
}

// Simula el delay de una petición real
function loadStatistics() {
    const container = document.getElementById('stats-content');
    if (!container) return;

    setTimeout(() => {
        try {
            container.innerHTML = renderStatistics(statsData);
        } catch (error) {
            console.error(error);
            container.innerHTML = renderErrorState();
        }
    }, 500);
}

function renderStatistics(data) {
    const { institutionalSource, registeredUsers } = data.registrationComparison;
    const registrationRate = Math.round((registeredUsers / institutionalSource) * 100);

    const { available, inTeam } = data.statusDistribution;
    const totalStudents = available + inTeam;
    const availablePercent = Math.round((available / totalStudents) * 100);
    const inTeamPercent = 100 - availablePercent;

    const sortedTech = [...data.techAverages].sort((a, b) => b.average - a.average);
    const highestTech = sortedTech[0];
    const lowestTech = sortedTech[sortedTech.length - 1];

    return `
        <div class="flex flex-col gap-6 pt-4">

            <!-- Fila 1: Comparación registro + pendientes -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                ${card({
                    className: 'p-6 flex flex-col gap-4 md:col-span-2',
                    width: 'w-full',
                    content: `
                    <span class="flex flex-col gap-1">
                        <span class="text-lg font-bold">Comparación de registro</span>
                        <span class="text-xs text-gray-400 -mt-2">Fuente institucional vs usuarios registrados</span>
                    </span>   
                        <div class="flex flex-col gap-3 mt-2">
                            <div class="flex flex-col gap-1">
                                <div class="flex justify-between text-sm">
                                    <span class="font-semibold text-gray-600">Fuente institucional</span>
                                    <span class="font-bold text-gray-700">${institutionalSource}</span>
                                </div>
                                ${progressBar({ value: '100', size: 'w-full h-3' })}
                            </div>

                            <div class="flex flex-col gap-1">
                                <div class="flex justify-between text-sm">
                                    <span class="font-semibold text-gray-600">Usuarios registrados</span>
                                    <span class="font-bold text-[#4B3FA8]">${registeredUsers}</span>
                                </div>
                                ${progressBar({ value: registrationRate.toString(), size: 'w-full h-3' })}
                            </div>
                        </div>

                        <span class="text-sm text-gray-500 mt-1">
                            <span class="font-bold text-[#4B3FA8]">${registrationRate}%</span> de los estudiantes autorizados ya se han registrado
                        </span>
                    `
                })}

                ${card({
                    className: 'p-6 flex flex-col items-center justify-center gap-2',
                    width: 'w-full',
                    content: `
                    <div class="flex flex-col items-center justify-center gap-2">
                        <span class="text-sm font-semibold text-gray-400 text-center">Autorizados sin registrar</span>
                        <span class="text-5xl font-black text-amber-500">${data.authorizedNotRegistered}</span>
                        <span class="text-xs text-gray-400">estudiantes pendientes</span>
                    </div>
                        `
                })}
            </div>

            <!-- Fila 2: Distribución de estado + total de equipos -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                ${card({
                    className: 'p-6 flex flex-col gap-4 md:col-span-2',
                    width: 'w-full',
                    content: `
                    <span class="flex flex-col gap-1">
                        <span class="text-lg font-bold">Distribución de estudiantes</span>
                        <span class="text-xs text-gray-400 -mt-2">Disponibles vs en equipo</span>
                    </span>    
                        <div class="w-full h-4 rounded-full overflow-hidden flex mt-2 bg-gray-100">
                            <div class="h-full bg-emerald-400" style="width: ${availablePercent}%"></div>
                            <div class="h-full bg-[#4B3FA8]" style="width: ${inTeamPercent}%"></div>
                        </div>

                        <div class="flex gap-6 mt-1">
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
                                <span class="text-sm text-gray-600">Disponibles: <span class="font-bold">${available}</span> (${availablePercent}%)</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-[#4B3FA8]"></span>
                                <span class="text-sm text-gray-600">En equipo: <span class="font-bold">${inTeam}</span> (${inTeamPercent}%)</span>
                            </div>
                        </div>
                    `
                })}

                ${card({
                    className: 'p-6 flex flex-col items-center justify-center gap-2',
                    width: 'w-full',
                    content: `
                    <div class="flex flex-col gap-2 items-center justify-center">
                        <span class="text-sm font-semibold text-gray-400 text-center">Equipos conformados</span>
                        <span class="text-5xl font-black text-[#4B3FA8]">${data.totalTeams}</span>
                        <span class="text-xs text-gray-400">equipos activos</span>
                    </div>
                        `
                })}
            </div>

            <!-- Fila 3: Promedio por tecnología + mayor/menor -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                ${card({
                    className: 'p-6 flex flex-col gap-4 md:col-span-2',
                    width: 'w-full',
                    content: `
                    <span class=" flex flex-col gap-1 ">
                        <span class="text-lg font-bold">Promedio de desempeño por tecnología</span>
                        <span class="text-xs text-gray-400 -mt-2">Toda la cohorte</span>
                    </span>
                        <div class="flex flex-col gap-3 mt-2">
                            ${sortedTech.map(tech => `
                                <div class="flex flex-col gap-1">
                                    <div class="flex justify-between text-sm">
                                        <span class="font-semibold text-gray-600">${tech.name}</span>
                                        <span class="font-bold text-[#4B3FA8]">${tech.average}%</span>
                                    </div>
                                    ${progressBar({ value: tech.average.toString(), size: 'w-full h-2' })}
                                </div>
                            `).join('')}
                        </div>
                    `
                })}

                <div class="flex flex-col gap-6">
                    ${card({
                        className: 'p-6 flex flex-col items-center justify-center gap-2',
                        width: 'w-full',
                        content: `
                        <div class="flex flex-col items-center justify-center gap-2">
                            <span class="text-xs font-semibold text-gray-400 text-center">Mayor promedio</span>
                            <span class="text-lg font-bold text-emerald-600">${highestTech.name}</span>
                            <span class="text-3xl font-black text-emerald-600">${highestTech.average}%</span>
                        </div>
                            `
                    })}

                    ${card({
                        className: 'p-6 flex flex-col items-center justify-center gap-2',
                        width: 'w-full',
                        content: `
                        <div class="flex flex-col items-center justify-center gap-2">
                            <span class="text-xs font-semibold text-gray-400 text-center">Menor promedio</span>
                            <span class="text-lg font-bold text-amber-600">${lowestTech.name}</span>
                            <span class="text-3xl font-black text-amber-600">${lowestTech.average}%</span>
                        </div>
                            `
                    })}
                </div>
            </div>

        </div>
    `;
}

function renderErrorState() {
    return `
        <div class="text-center text-red-500 text-sm py-16 border border-dashed border-red-200 rounded-xl mt-4">
            Ocurrió un error al cargar las estadísticas. Intenta recargar la página.
        </div>
    `;
}
