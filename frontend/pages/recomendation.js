import { card } from "../components/card";
import Swal from "sweetalert2";

export function recommendations_view() {
    setTimeout(() => loadRecommendations(), 0);
    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div class="flex flex-col gap-1 pt-6">
            <span class="text-3xl font-bold">Sugerencias de equipos</span>
            <span class="text-gray-500 text-sm">Equipos recomendados para ti según tu perfil técnico</span>
        </div>
        <div class="relative">
            <input id="team-search" type="text" placeholder="Buscar equipo por nombre..." autocomplete="off"
                oninput="handleTeamSearch()"
                class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
            <div id="team-search-results" class="absolute z-10 bg-white border border-gray-200 rounded-xl mt-1 w-full shadow-lg hidden"></div>
        </div>
        <div id="recommendations-content">
            ${renderLoadingState()}
        </div>
    </main>
    `;
}

function renderLoadingState() {
    return `
        <div class="flex flex-col items-center justify-center gap-3 py-16">
            <div class="w-10 h-10 border-4 border-[#4B3FA8] border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-gray-400">Cargando recomendaciones...</span>
        </div>
    `;
}

async function loadRecommendations() {
    const container = document.getElementById('recommendations-content');
    if (!container) return;
    try {
        const response = await fetch('/students/recommendations');
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            container.innerHTML = renderNoAccessState(data.error);
            return;
        }
        const data = await response.json();
        container.innerHTML = renderRecommendations(data.recommendations);
    } catch (error) {
        console.error(error);
        container.innerHTML = renderErrorState();
    }
}

function renderRecommendations(teams) {
    if (!teams || teams.length === 0) {
        return renderEmptyState();
    }
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            ${teams.map(team => `
                ${card({
                    className: 'p-6 flex flex-col gap-4',
                    width: 'w-full',
                    content: `
                        <div class="flex items-center justify-between">
                            <span class="text-xl font-bold">${team.team_name}</span>
                            <span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-bold px-4 py-1.5 rounded-full">
                                ${team.compatibility}% match
                            </span>
                        </div>
                        <span class="text-sm text-gray-500">${team.member_count} integrante(s)</span>
                        <div class="flex flex-wrap gap-2">
                            ${(team.strengthens || []).map(tech => `
                                <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">${tech}</span>
                            `).join('')}
                        </div>
                        <div class="border-t border-gray-100 pt-4 flex flex-col gap-2">
                            <span class="text-sm font-bold text-[#4B3FA8]">Por qué te lo recomendamos</span>
                            <p class="text-sm text-gray-600 leading-relaxed">${team.justification}</p>
                        </div>
                        ${team.pending_request_id ? `
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-xs text-amber-500 font-semibold">Pendiente</span>
                            <button
                                onclick="cancelRecommendedRequest(${team.team_id}, ${team.pending_request_id})"
                                class=" cursor-pointer text-red-500 border border-red-200 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                            >
                                Cancelar
                            </button>
                        </div>
                        ` : `
                        <button 
                            onclick="requestToJoinTeam(${team.team_id}, '${team.team_name.replace(/'/g, "\\'")}')"
                            class=" px-4 cursor-pointer mt-2 bg-[#4B3FA8] text-white font-bold py-2.5 rounded-xl transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95"
                        >
                            Solicitar ingreso
                        </button>
                        `}
                    `
                })}
            `).join('')}
        </div>
    `;
}

window.requestToJoinTeam = async function(teamId, teamName) {
    try {
        const response = await fetch(`/teams/${teamId}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({
                title: 'No se pudo enviar la solicitud',
                text: data.message || data.error || 'Ocurrió un error inesperado.',
                icon: 'info',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4B3FA8'
            });
            return;
        }
        Swal.fire({
            title: '¡Solicitud enviada!',
            text: `Tu solicitud para unirte al equipo "${teamName}" ha sido enviada correctamente.`,
            icon: 'success',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#4B3FA8'
        });
        loadRecommendations();
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#4B3FA8'
        });
    }
};

window.cancelRecommendedRequest = async function(teamId, requestId) {
    try {
        const response = await fetch(`/teams/${teamId}/requests/${requestId}`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo cancelar', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        loadRecommendations();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

function renderEmptyState() {
    return `
        <div class="text-center text-gray-400 text-sm py-16 border border-dashed border-gray-200 rounded-xl mt-4">
            Por ahora no tenemos recomendaciones de equipos para ti. Vuelve a intentarlo más tarde.
        </div>
    `;
}

function renderNoAccessState(message) {
    return `
        <div class="text-center text-gray-400 text-sm py-16 border border-dashed border-gray-200 rounded-xl mt-4">
            ${message || 'Esta sección no está disponible para ti en este momento.'}
        </div>
    `;
}

function renderErrorState() {
    return `
        <div class="text-center text-red-500 text-sm py-16 border border-dashed border-red-200 rounded-xl mt-4">
            Ocurrió un error al cargar las recomendaciones. Intenta recargar la página.
        </div>
    `;
}


let teamSearchTimeout;
window.handleTeamSearch = function() {
    const input = document.getElementById('team-search');
    const resultsBox = document.getElementById('team-search-results');
    const query = input.value.trim();
    clearTimeout(teamSearchTimeout);
    if (query.length < 2) {
        resultsBox.classList.add('hidden');
        resultsBox.innerHTML = '';
        return;
    }
    teamSearchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`/teams/search?q=${encodeURIComponent(query)}`);
            const teams = response.ok ? await response.json() : [];
            if (teams.length === 0) {
                resultsBox.innerHTML = `<div class="px-4 py-2.5 text-sm text-gray-400">Sin resultados</div>`;
            } else {
                resultsBox.innerHTML = teams.map(t => `
                    <div onclick="requestToJoinTeam(${t.id_team}, '${t.team_name.replace(/'/g, "\\'")}')"
                        class="px-4 py-2.5 text-sm cursor-pointer hover:bg-[#F3F1FA] flex items-center justify-between">
                        <span>${t.team_name}</span>
                        <span class="text-xs text-gray-400">${t.member_count} integrante(s)</span>
                    </div>
                `).join('');
            }
            resultsBox.classList.remove('hidden');
        } catch (error) {
            console.error(error);
        }
    }, 300);
};