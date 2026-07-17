import { card } from "../../components/card";
import { progressBar } from "../../components/progress_bar";

// ===== DATOS SIMULADOS - reemplaza por fetch real cuando tengas los endpoints =====
let teamsOverview = [
    {
        id: 't1',
        name: 'Clan Fénix',
        campus: 'Riwi Medellín',
        journey: 'Journey 5',
        clan: 'Clan Fénix',
        status: 'activo',
        memberCount: 4,
        avgScore: 87
    },
    {
        id: 't2',
        name: 'Clan Titán',
        campus: 'Riwi Bogotá',
        journey: 'Journey 4',
        clan: 'Clan Titán',
        status: 'activo',
        memberCount: 3,
        avgScore: 79
    },
    {
        id: 't3',
        name: 'Clan Nova',
        campus: 'Riwi Medellín',
        journey: 'Journey 5',
        clan: 'Clan Nova',
        status: 'incompleto',
        memberCount: 1,
        avgScore: 91
    }
];

// Detalle completo por equipo — normalmente vendría de otro endpoint al hacer click
let teamDetails = {
    't1': {
        id: 't1',
        name: 'Clan Fénix',
        campus: 'Riwi Medellín',
        journey: 'Journey 5',
        clan: 'Clan Fénix',
        status: 'activo',
        techScores: [
            { name: 'JavaScript', score: 90 },
            { name: 'React', score: 85 },
            { name: 'Node.js', score: 80 },
            { name: 'SQL', score: 78 }
        ],
        members: [
            { id: 'u1', name: 'Lians Paternina', role: 'Líder', avatar: './assets/default-profile.png' },
            { id: 'u2', name: 'Camila Ruiz', role: 'Integrante', avatar: './assets/default-profile.png' },
            { id: 'u3', name: 'Andrés Gómez', role: 'Integrante', avatar: './assets/default-profile.png' },
            { id: 'u4', name: 'Sofía Londoño', role: 'Integrante', avatar: './assets/default-profile.png' }
        ],
        interpretation: 'El equipo Clan Fénix demuestra un desempeño técnico sólido y homogéneo, con especial fortaleza en JavaScript y React. La combinación de habilidades sugiere un equipo bien balanceado para proyectos frontend, con capacidad de escalar hacia desarrollo full-stack. Se recomienda reforzar las bases de datos avanzadas para maximizar su potencial en proyectos de mayor complejidad.'
    },
    't2': {
        id: 't2',
        name: 'Clan Titán',
        campus: 'Riwi Bogotá',
        journey: 'Journey 4',
        clan: 'Clan Titán',
        status: 'activo',
        techScores: [
            { name: 'Node.js', score: 85 },
            { name: 'SQL', score: 82 },
            { name: 'Git & GitHub', score: 75 }
        ],
        members: [
            { id: 'u5', name: 'Juan Pérez', role: 'Líder', avatar: './assets/default-profile.png' },
            { id: 'u6', name: 'Valentina Ríos', role: 'Integrante', avatar: './assets/default-profile.png' },
            { id: 'u7', name: 'Diego Martínez', role: 'Integrante', avatar: './assets/default-profile.png' }
        ],
        interpretation: 'Clan Titán muestra una orientación clara hacia el backend, con puntajes destacados en Node.js y SQL. Es un equipo consistente en fundamentos de servidor y bases de datos, aunque podría beneficiarse de fortalecer sus prácticas de control de versiones colaborativo para mejorar la eficiencia en proyectos de equipo grandes.'
    },
    't3': {
        id: 't3',
        name: 'Clan Nova',
        campus: 'Riwi Medellín',
        journey: 'Journey 5',
        clan: 'Clan Nova',
        status: 'incompleto',
        techScores: [
            { name: 'HTML & CSS', score: 95 },
            { name: 'JavaScript', score: 91 },
            { name: 'Tailwind', score: 88 }
        ],
        members: [
            { id: 'u8', name: 'María Fernanda Cano', role: 'Líder', avatar: './assets/default-profile.png' }
        ],
        interpretation: 'Clan Nova, aunque incompleto en número de integrantes, presenta un perfil técnico individual sobresaliente en frontend, con puntajes altos en HTML, CSS y JavaScript. Se recomienda priorizar la incorporación de nuevos integrantes con perfil backend para complementar las capacidades actuales del equipo.'
    }
};

let currentView = 'overview'; // 'overview' | 'detail'
let currentTeamId = null;

// ===== VISTA: TEAMS OVERVIEW =====

export function teams_overview() {
    currentView = 'overview';
    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div id="teams-admin-content">
            ${renderOverview()}
        </div>
    </main>
    `;
}

function renderOverview() {
    return `
        <div class="flex flex-col gap-1 pt-6">
            <span class="text-3xl font-bold">Equipos</span>
            <span class="text-gray-500 text-sm">Listado completo de equipos registrados en la plataforma</span>
        </div>

        <div class="flex flex-col gap-4 mt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${teamsOverview.map(team => `
                    <div 
                        onclick="viewTeamDetail('${team.id}')"
                        class="border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-[#4B3FA8]/40 transition-all duration-300 cursor-pointer"
                    >
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-bold">${team.name}</span>
                            <span class="text-xs font-semibold px-3 py-1 rounded-full ${
                                team.status === 'activo' 
                                    ? 'bg-emerald-100 text-emerald-600' 
                                    : 'bg-amber-100 text-amber-600'
                            }">
                                ${team.status === 'activo' ? 'Activo' : 'Incompleto'}
                            </span>
                        </div>

                        <div class="flex flex-col gap-1 text-sm text-gray-500">
                            <span>${team.campus}</span>
                            <span>${team.journey}</span>
                        </div>

                        <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span class="text-xs text-gray-400">${team.memberCount} integrante(s)</span>
                            <span class="text-sm font-bold text-[#4B3FA8]">${team.avgScore}% promedio</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ===== VISTA: TEAM DETAIL =====

window.viewTeamDetail = function (teamId) {
    currentView = 'detail';
    currentTeamId = teamId;
    document.getElementById('teams-admin-content').innerHTML = renderTeamDetail(teamId);
};

window.backToOverview = function () {
    currentView = 'overview';
    currentTeamId = null;
    document.getElementById('teams-admin-content').innerHTML = renderOverview();
};

function renderTeamDetail(teamId) {
    const team = teamDetails[teamId];
    if (!team) return `<div class="text-center text-gray-400 py-16">Equipo no encontrado.</div>`;

    return `
        <div class="flex flex-col gap-6 pt-6">
            <button onclick="backToOverview()" 
                class="flex items-center gap-2 text-sm font-semibold text-[#4B3FA8] hover:underline w-fit">
                ← Volver a equipos
            </button>

            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex flex-col gap-1">
                    <span class="text-3xl font-bold">${team.name}</span>
                    <div class="flex flex-wrap gap-2">
                        <span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-semibold px-4 py-1.5 rounded-full">${team.campus}</span>
                        <span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-semibold px-4 py-1.5 rounded-full">${team.journey}</span>
                        <span class="text-sm font-semibold px-4 py-1.5 rounded-full ${
                            team.status === 'activo' 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : 'bg-amber-100 text-amber-600'
                        }">
                            ${team.status === 'activo' ? 'Activo' : 'Incompleto'}
                        </span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Puntajes por tecnología -->
                ${card({
                    className: 'p-6 flex flex-col gap-4',
                    width: 'w-full',
                    content: `
                        <span class="text-lg font-bold">Puntajes por tecnología</span>
                        ${team.techScores.map(tech => `
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

                <!-- Integrantes -->
                ${card({
                    className: 'p-6 flex flex-col gap-3',
                    width: 'w-full',
                    content: `
                        <span class="text-lg font-bold">Integrantes</span>
                        <div class="flex flex-col gap-2">
                            ${team.members.map(member => `
                                <div class="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-2.5">
                                    <img src="${member.avatar}" class="w-9 h-9 rounded-full object-cover" alt="${member.name}">
                                    <div class="flex flex-col">
                                        <span class="text-sm font-semibold">${member.name}</span>
                                        <span class="text-xs ${member.role === 'Líder' ? 'text-[#4B3FA8] font-bold' : 'text-gray-400'}">${member.role}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `
                })}
            </div>

            <!-- Interpretación profesional generada por IA -->
            ${card({
                className: 'p-6 flex flex-col gap-3',
                width: 'w-full',
                content: `
                    <div class="flex items-center gap-2">
                        <span class="text-lg font-bold text-[#4B3FA8]">Interpretación profesional</span>
                        <span class="text-xs bg-[#F3F1FA] text-[#4B3FA8] font-semibold px-3 py-0.5 rounded-full">Generado por IA</span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">${team.interpretation}</p>
                `
            })}
        </div>
    `;
}
