import { card } from "../../components/card";
import { progressBar } from "../../components/progress_bar";

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

// CARGA DE DATOS REALES
let teamsOverview = [];
let teamsLoaded = false;

let currentView = 'overview'; // 'overview' | 'detail'
let currentTeamId = null;

async function loadTeamsOverview() {
    try {
        const response = await fetch("/admin/teams");
        teamsOverview = response.ok ? await response.json() : [];
        // Orden de mayor a menor calificación general; equipos sin puntaje aún van al final
        teamsOverview.sort((a, b) => {
            const scoreA = a.avg_score !== null && a.avg_score !== undefined ? a.avg_score : -1;
            const scoreB = b.avg_score !== null && b.avg_score !== undefined ? b.avg_score : -1;
            return scoreB - scoreA;
        });
    } catch (error) {
        console.error("Error cargando equipos:", error);
        teamsOverview = [];
    }
    teamsLoaded = true;
}

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
    if (!teamsLoaded) {
        loadTeamsOverview().then(() => {
            if (currentView === 'overview') {
                document.getElementById('teams-admin-content').innerHTML = renderOverview();
            }
        });
        return `<div class="text-center text-gray-400 py-16">Cargando equipos...</div>`;
    }

    return `
        <div class="flex flex-col gap-1 pt-6">
            <span class="text-3xl font-bold">Equipos</span>
            <span class="text-gray-500 text-sm">Listado completo de equipos registrados en la plataforma</span>
        </div>

        <div class="flex flex-col gap-4 mt-6">
            ${teamsOverview.length === 0
                ? `<div class="text-center text-gray-400 py-16">No hay equipos registrados todav\u00eda.</div>`
                : `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${teamsOverview.map(team => `
                        <div
                            onclick="viewTeamDetail(${team.id_team})"
                            class="border border-gray-100 rounded-2xl p-3.5 flex flex-col gap-2 shadow-sm hover:shadow-md hover:border-[#4B3FA8]/40 transition-all duration-300 cursor-pointer"
                        >
                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold">${escapeHtml(team.team_name)}</span>
                                <span class="text-xs font-semibold px-3 py-1 rounded-full bg-[#F3F1FA] text-[#4B3FA8]">
                                    ${team.member_count}/6 integrantes
                                </span>
                            </div>
                            <span class="text-sm text-gray-500">${escapeHtml(team.leader_campus) || 'Sin campus'} · ${escapeHtml(team.leader_journey) || 'Sin journey'}</span>

                            <div class="flex items-center justify-end pt-1.5 border-t border-gray-100">
                                <span class="text-sm font-bold text-[#4B3FA8]">${team.avg_score !== null ? team.avg_score + '% promedio' : 'Sin puntaje aún'}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>`
            }
        </div>
    `;
}

// ===== VISTA: TEAM DETAIL =====

window.viewTeamDetail = function (teamId) {
    currentView = 'detail';
    currentTeamId = teamId;
    document.getElementById('teams-admin-content').innerHTML = `<div class="text-center text-gray-400 py-16">Cargando equipo...</div>`;
    loadTeamDetail(teamId);
};

async function loadTeamDetail(teamId) {
    try {
        const response = await fetch(`/admin/teams/${teamId}`);
        if (!response.ok) {
            document.getElementById('teams-admin-content').innerHTML = `<div class="text-center text-gray-400 py-16">Equipo no encontrado.</div>`;
            return;
        }
        const team = await response.json();
        if (currentView === 'detail' && currentTeamId === teamId) {
            document.getElementById('teams-admin-content').innerHTML = renderTeamDetail(team);
        }
    } catch (error) {
        console.error("Error cargando el equipo:", error);
        document.getElementById('teams-admin-content').innerHTML = `<div class="text-center text-gray-400 py-16">Error al cargar el equipo.</div>`;
    }
}

window.backToOverview = function () {
    currentView = 'overview';
    currentTeamId = null;
    document.getElementById('teams-admin-content').innerHTML = renderOverview();
};

function renderTeamDetail(team) {
    return `
        <div class="flex flex-col gap-6 pt-6">
            <button onclick="backToOverview()"
                class=" cursor-pointer flex items-center gap-2 text-sm font-semibold text-[#4B3FA8] hover:underline w-fit">
                \u2190 Volver a equipos
            </button>

            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex flex-col gap-1">
                    <span class="text-3xl font-bold">${escapeHtml(team.team_name)}</span>
                    <div class="flex flex-wrap gap-2">
                        <span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-semibold px-4 py-1.5 rounded-full">${escapeHtml(team.leader_campus) || 'Sin campus'}</span>
                        <span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-semibold px-4 py-1.5 rounded-full">${escapeHtml(team.leader_journey) || 'Sin journey'}</span>
                        <span class="bg-emerald-100 text-emerald-600 text-sm font-semibold px-4 py-1.5 rounded-full">
                            ${team.members.length}/6 integrantes
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
                        ${Object.keys(team.tech_averages).length === 0
                            ? `<span class="text-sm text-gray-400">Ningún integrante ha completado el Assessment aún.</span>`
                            : Object.entries(team.tech_averages).map(([techName, score]) => `
                                <div class="flex flex-col gap-1">
                                    <div class="flex justify-between text-sm">
                                        <span class="font-semibold text-gray-600">${escapeHtml(techName)}</span>
                                        <span class="font-bold text-[#4B3FA8]">${score}%</span>
                                    </div>
                                    ${progressBar({
                                        value: score.toString(),
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
                                    <img src="${member.avatar}" class="w-9 h-9 rounded-full object-cover" alt="${escapeHtml(member.full_name)}">
                                    <div class="flex flex-col">
                                        <span class="text-sm font-semibold">${escapeHtml(member.full_name)}</span>
                                        <span class="text-xs ${member.is_leader ? 'text-[#4B3FA8] font-bold' : 'text-gray-400'}">${member.is_leader ? 'Líder' : 'Integrante'}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `
                })}
            </div>

            <!-- Interpretación técnica del equipo (calculada, no generada por IA) -->
            ${card({
                className: 'p-6 flex flex-col gap-3',
                width: 'w-full',
                content: `
                    <div class="flex items-center gap-2">
                        <span class="text-lg font-bold text-[#4B3FA8]">Interpretación técnica</span>
                        <span class="text-xs bg-[#F3F1FA] text-[#4B3FA8] font-semibold px-3 py-0.5 rounded-full">Promedio: ${team.avg_score !== null ? team.avg_score + '%' : 'N/A'}</span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(team.interpretation) || 'Aún no hay suficiente información para generar una interpretación (ningún integrante ha completado el Assessment).'}</p>
                `
            })}
        </div>
    `;
}
