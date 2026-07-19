import { card } from "../components/card";
import Swal from "sweetalert2";

// ESTADO REAL (se llena con datos del Backend)
let currentUser = null;
let teams = [];
let teamsLoaded = false;
let myRequestsData = [];
let myRequestsLoaded = false;
let receivedRequestsData = [];
let receivedRequestsLoaded = false;
let sentInvitationsData = [];
let sentInvitationsLoaded = false;
let receivedInvitationsData = [];
let receivedInvitationsLoaded = false;
let recommendationsData = [];
let recommendationsLoaded = false;

let activeTab = 'equipos';

async function loadProfile() {
    try {
        const response = await fetch('/users/profile');
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error cargando perfil:', error);
        return null;
    }
}

async function loadTeams() {
    try {
        const response = await fetch('/teams');
        if (!response.ok) {
            teams = [];
            teamsLoaded = true;
            return;
        }
        teams = await response.json();
        teamsLoaded = true;
    } catch (error) {
        console.error('Error cargando equipos:', error);
        teams = [];
        teamsLoaded = true;
    }
}

async function initTeamsPage() {
    currentUser = await loadProfile();
    await loadTeams();
    const tabsNav = document.getElementById('tabs-nav');
    if (tabsNav) tabsNav.outerHTML = renderTabsNav();
    const tabContent = document.getElementById('tab-content');
    if (tabContent) tabContent.innerHTML = renderTabContent();
}

export function teams_view() {
    activeTab = 'equipos';
    teamsLoaded = false;
    myRequestsLoaded = false;
    receivedRequestsLoaded = false;
    sentInvitationsLoaded = false;
    receivedInvitationsLoaded = false;
    recommendationsLoaded = false;
    setTimeout(() => { initTeamsPage(); }, 0);
    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div class="flex flex-col gap-1 pt-6">
            <span class="text-3xl font-bold">Equipos</span>
            <span class="text-gray-500 text-sm">Consulta, gestiona y haz crecer tu equipo</span>
        </div>
        ${renderTabsNav()}
        <div id="tab-content">
            ${renderTabContent()}
        </div>
    </main>
    `;
}

function renderTabsNav() {
    const isLeader = currentUser && currentUser.is_leader;
    const hasTeam = currentUser && currentUser.team_id;
    return `
    <div id="tabs-nav" class="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px min-h-12">
        ${renderTabButton('equipos', 'Equipos')}
        ${renderTabButton('mis-solicitudes', 'Mis solicitudes')}
        ${isLeader ? renderTabButton('solicitudes-recibidas', 'Solicitudes recibidas') : ''}
        ${renderTabButton('invitaciones', 'Invitaciones')}
        ${hasTeam ? renderTabButton('mi-equipo', 'Mi equipo') : ''}
        ${isLeader ? renderTabButton('recomendaciones', 'Recomendaciones') : ''}
    </div>
    `;
}

function renderTabButton(id, label) {
    const isActive = activeTab === id;
    return `
        <button 
            onclick="switchTab('${id}')"
            class=" cursor-pointer px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                isActive 
                    ? 'border-[#4B3FA8] text-[#4B3FA8]' 
                    : 'border-transparent text-gray-400 hover:text-[#4B3FA8]'
            }"
        >
            ${label}
        </button>
    `;
}

window.switchTab = function(tabId) {
    activeTab = tabId;
    document.getElementById('tabs-nav').outerHTML = renderTabsNav();
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

function renderTabContent() {
    switch (activeTab) {
        case 'equipos': return renderEquiposTab();
        case 'mis-solicitudes': return renderMisSolicitudesTab();
        case 'solicitudes-recibidas': return renderSolicitudesRecibidasTab();
        case 'invitaciones': return renderInvitacionesTab();
        case 'mi-equipo': return renderMiEquipoTab();
        case 'recomendaciones': return renderRecomendacionesTab();
        default: return '';
    }
}

// TAB: EQUIPOS
function renderEquiposTab() {
    if (!teamsLoaded) {
        loadTeams().then(() => {
            if (activeTab === 'equipos') document.getElementById('tab-content').innerHTML = renderTabContent();
        });
        return `<div class="flex flex-col gap-6 pt-4">${emptyState('Cargando equipos...')}</div>`;
    }
    return `
        <div class="flex flex-col gap-6 pt-4">
            ${card({
                className: 'p-6 flex flex-col gap-3',
                width: 'w-full',
                content: `
                    <span class="text-lg font-bold">Crear un nuevo equipo</span>
                    <div class="flex flex-col md:flex-row gap-3">
                        <input id="new-team-name" type="text" placeholder="Nombre del equipo" 
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                        <button onclick="createTeam()" 
                            class=" cursor-pointer bg-[#4B3FA8] text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95">
                            Crear equipo
                        </button>
                    </div>
                `
            })}
            <div class="flex flex-col gap-4">
                <span class="text-lg font-bold">Equipos disponibles</span>
                ${teams.length === 0 ? emptyState('No hay equipos disponibles en este momento.') : `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${teams.map(team => `
                        <div class="border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300">
                            <span class="text-lg font-bold">${team.team_name}</span>
                            <span class="text-xs text-gray-400">${team.member_count} integrante(s)</span>
                            ${team.compatibility !== null ? `
                            <div class="bg-purple-50 border border-purple-100 rounded-xl px-3 py-2 flex flex-col gap-2">
                                <span class="text-xs font-bold text-[#4B3FA8]">${team.compatibility}% de compatibilidad</span>
                                <div class="flex flex-wrap gap-1">
                                    ${Object.entries(team.tech_averages).map(([tech, avg]) => `
                                        <span class="bg-white text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-purple-100">${tech}: ${avg}%</span>
                                    `).join('')}
                                </div>
                                <p class="text-xs text-gray-600">${team.justification}</p>
                            </div>
                            ` : ''}
                            <details class="text-sm">
                                <summary class="cursor-pointer text-[#4B3FA8] font-semibold text-xs select-none">Ver integrantes</summary>
                                <div class="flex flex-col gap-1 mt-2 pt-2 border-t border-gray-100">
                                    ${team.members.map(member => `
                                        <button onclick="showMemberProfile(${member.user_id})"
                                            class="cursor-pointer text-left text-xs text-[#4B3FA8] hover:underline">
                                            ${member.full_name}${member.is_leader ? ' (Líder)' : ''}
                                        </button>
                                    `).join('')}
                                </div>
                            </details>
                            ${team.pending_request_id ? `
                            <div class="flex items-center justify-between mt-2">
                                <span class="text-xs text-amber-500 font-semibold">Pendiente</span>
                                <button
                                    onclick="cancelRequest(${team.id_team}, ${team.pending_request_id})"
                                    class=" cursor-pointer text-red-500 border border-red-200 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                            ` : `
                            <button 
                                onclick="requestToJoin(${team.id_team}, '${team.team_name.replace(/'/g, "\\'")}')"
                                class=" cursor-pointer mt-2 border border-[#4B3FA8] text-[#4B3FA8] font-bold py-2 rounded-xl transition-all duration-300 hover:bg-[#4B3FA8] hover:text-white"
                            >
                                Solicitar ingreso
                            </button>
                            `}
                        </div>
                    `).join('')}
                </div>
                `}
            </div>
        </div>
    `;
}

window.createTeam = async function() {
    const nameInput = document.getElementById('new-team-name');
    const name = nameInput.value.trim();
    if (!name) {
        Swal.fire({ title: '¡Atención!', text: 'Escribe un nombre para el equipo.', icon: 'warning', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
        return;
    }
    try {
        const response = await fetch('/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ team_name: name })
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo crear el equipo', text: data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        Swal.fire({ title: '¡Equipo creado!', text: `El equipo "${name}" fue creado correctamente.`, icon: 'success', confirmButtonText: 'Aceptar', confirmButtonColor: '#4B3FA8' });
        if (window.loadNavbarProfile) window.loadNavbarProfile();
        await initTeamsPage();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

window.requestToJoin = async function(teamId, teamName) {
    try {
        const response = await fetch(`/teams/${teamId}/requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo enviar la solicitud', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'info', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        Swal.fire({ title: '¡Solicitud enviada!', text: `Solicitud enviada a ${teamName}`, icon: 'success', confirmButtonText: 'Aceptar', confirmButtonColor: '#4B3FA8' });
        teamsLoaded = false;
        myRequestsLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

// TAB: MIS SOLICITUDES
async function loadMyRequests() {
    try {
        const response = await fetch('/users/requests');
        myRequestsData = response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error cargando mis solicitudes:', error);
        myRequestsData = [];
    }
    myRequestsLoaded = true;
}

function renderMisSolicitudesTab() {
    if (!myRequestsLoaded) {
        loadMyRequests().then(() => {
            if (activeTab === 'mis-solicitudes') document.getElementById('tab-content').innerHTML = renderTabContent();
        });
        return `<div class="flex flex-col gap-4 pt-4">${emptyState('Cargando tus solicitudes...')}</div>`;
    }
    return `
        <div class="flex flex-col gap-4 pt-4">
            <span class="text-lg font-bold">Solicitudes que he enviado</span>
            ${myRequestsData.length === 0 ? emptyState('No tienes solicitudes pendientes.') : `
                <div class="flex flex-col gap-3">
                    ${myRequestsData.map(req => `
                        <div class="flex items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm">
                            <div class="flex flex-col">
                                <span class="font-semibold">${req.team_name}</span>
                                <span class="text-xs text-amber-500 font-semibold">Pendiente</span>
                            </div>
                            <button 
                                onclick="cancelRequest(${req.team_id}, ${req.id_team_request})"
                                class=" cursor-pointer text-red-500 border border-red-200 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                            >
                                Cancelar
                            </button>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
}

window.cancelRequest = async function(teamId, requestId) {
    try {
        const response = await fetch(`/teams/${teamId}/requests/${requestId}`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo cancelar', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        myRequestsLoaded = false;
        teamsLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};
window.cancelInvitation = async function(teamId, requestId) {
    try {
        const response = await fetch(`/teams/${teamId}/invitations/${requestId}`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo cancelar', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        sentInvitationsLoaded = false;
        recommendationsLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

// TAB: SOLICITUDES RECIBIDAS
async function loadReceivedRequests() {
    try {
        const response = await fetch('/teams/requests/received');
        receivedRequestsData = response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error cargando solicitudes recibidas:', error);
        receivedRequestsData = [];
    }
    receivedRequestsLoaded = true;
}

function renderSolicitudesRecibidasTab() {
    if (!receivedRequestsLoaded) {
        loadReceivedRequests().then(() => {
            if (activeTab === 'solicitudes-recibidas') document.getElementById('tab-content').innerHTML = renderTabContent();
        });
        return `<div class="flex flex-col gap-4 pt-4">${emptyState('Cargando solicitudes...')}</div>`;
    }
    return `
        <div class="flex flex-col gap-4 pt-4">
            <span class="text-lg font-bold">Solicitudes recibidas por tu equipo</span>
            ${receivedRequestsData.length === 0 ? emptyState('No tienes solicitudes recibidas.') : `
                <div class="flex flex-col gap-3">
                    ${receivedRequestsData.map(req => `
                        <div class="flex items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm">
                            <span class="font-semibold">${req.full_name}</span>
                            <div class="flex gap-2">
                                <button onclick="acceptRequest(${req.team_id}, ${req.id_team_request})" 
                                    class=" cursor-pointer bg-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-200">
                                    Aceptar
                                </button>
                                <button onclick="rejectRequest(${req.team_id}, ${req.id_team_request})" 
                                    class=" cursor-pointer border border-red-200 text-red-500 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200">
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
}

window.acceptRequest = async function(teamId, requestId) {
    try {
        const response = await fetch(`/teams/${teamId}/requests/${requestId}/accept`, { method: 'PATCH' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo aceptar', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        receivedRequestsLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

window.rejectRequest = async function(teamId, requestId) {
    try {
        const response = await fetch(`/teams/${teamId}/requests/${requestId}/reject`, { method: 'PATCH' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo rechazar', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        receivedRequestsLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

//TAB: INVITACIONES
async function loadSentInvitations() {
    if (!currentUser?.is_leader) { sentInvitationsLoaded = true; return; }
    try {
        const response = await fetch('/teams/invitations/sent');
        sentInvitationsData = response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error cargando invitaciones enviadas:', error);
        sentInvitationsData = [];
    }
    sentInvitationsLoaded = true;
}

async function loadReceivedInvitations() {
    try {
        const response = await fetch('/users/invitations');
        receivedInvitationsData = response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error cargando invitaciones recibidas:', error);
        receivedInvitationsData = [];
    }
    receivedInvitationsLoaded = true;
}

function renderInvitacionesTab() {
    const isLeader = currentUser && currentUser.is_leader;
    if (!sentInvitationsLoaded || !receivedInvitationsLoaded) {
        Promise.all([loadSentInvitations(), loadReceivedInvitations()]).then(() => {
            if (activeTab === 'invitaciones') document.getElementById('tab-content').innerHTML = renderTabContent();
        });
        return `<div class="flex flex-col gap-4 pt-4">${emptyState('Cargando invitaciones...')}</div>`;
    }
    return `
        <div class="flex flex-col gap-8 pt-4">
            ${isLeader ? `
            <div class="flex flex-col gap-4">
                <span class="text-lg font-bold">Enviar invitación</span>
                ${card({
                    className: 'p-6 flex flex-col gap-3',
                    width: 'w-full',
                    content: `
                        <div class="flex flex-col md:flex-row gap-3">
                            <div class="relative flex-1">
                                <input id="invite-search" type="text" placeholder="Buscar estudiante por nombre..." autocomplete="off"
                                    oninput="handleInviteSearch()"
                                    class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                                <div id="invite-search-results" class="absolute z-10 bg-white border border-gray-200 rounded-xl mt-1 w-full shadow-lg hidden"></div>
                            </div>
                            <button onclick="sendInvitation()" 
                                class=" cursor-pointer bg-[#4B3FA8] text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 hover:bg-pink-600">
                                Enviar invitación
                            </button>
                        </div>
                    `
                })}
                <span class="text-lg font-bold mt-2">Invitaciones enviadas por tu equipo</span>
                ${sentInvitationsData.length === 0 ? emptyState('No has enviado invitaciones.') : `
                    <div class="flex flex-col gap-3">
                        ${sentInvitationsData.map(inv => `
                            <div class="flex items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm">
                                <span class="font-semibold">${inv.full_name}</span>
                                <div class="flex items-center gap-3">
                                    <span class="text-xs text-amber-500 font-semibold">Pendiente</span>
                                    <button
                                        onclick="cancelInvitation(${inv.team_id}, ${inv.id_team_request})"
                                        class=" cursor-pointer text-red-500 border border-red-200 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
            ` : ''}
            <div class="flex flex-col gap-4">
                <span class="text-lg font-bold">Mis invitaciones recibidas</span>
                ${receivedInvitationsData.length === 0 ? emptyState('No tienes invitaciones recibidas.') : `
                    <div class="flex flex-col gap-3">
                        ${receivedInvitationsData.map(inv => `
                            <div class="flex items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm">
                                <span class="font-semibold">${inv.team_name}</span>
                                <div class="flex gap-2">
                                    <button onclick="acceptInvitation(${inv.team_id}, ${inv.id_team_request})" 
                                        class="  cursor-pointer bg-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-200">
                                        Aceptar
                                    </button>
                                    <button onclick="rejectInvitation(${inv.team_id}, ${inv.id_team_request})" 
                                        class=" cursor-pointer border border-red-200 text-red-500 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200">
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
}

let inviteSearchTimeout = null;

window.handleInviteSearch = function() {
    const input = document.getElementById('invite-search');
    const resultsBox = document.getElementById('invite-search-results');
    const query = input.value.trim();

    clearTimeout(inviteSearchTimeout);

    if (query.length < 2) {
        resultsBox.classList.add('hidden');
        resultsBox.innerHTML = '';
        return;
    }

    // Espera un poco antes de buscar, para no disparar una petición por cada letra
    inviteSearchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`/teams/students/search?q=${encodeURIComponent(query)}`);
            const students = response.ok ? await response.json() : [];
            if (students.length === 0) {
                resultsBox.innerHTML = `<div class="px-4 py-2.5 text-sm text-gray-400">Sin resultados</div>`;
            } else {
                resultsBox.innerHTML = students.map(s => `
                    <div onclick="selectInviteCandidate(${s.user_id}, '${s.full_name.replace(/'/g, "\\'")}')"
                        class="px-4 py-2.5 text-sm cursor-pointer hover:bg-[#F3F1FA]">
                        ${s.full_name}
                    </div>
                `).join('');
            }
            resultsBox.classList.remove('hidden');
        } catch (error) {
            console.error(error);
        }
    }, 300);
};

let selectedInviteCandidate = null;

window.selectInviteCandidate = function(userId, fullName) {
    selectedInviteCandidate = { userId, fullName };
    const input = document.getElementById('invite-search');
    const resultsBox = document.getElementById('invite-search-results');
    input.value = fullName;
    resultsBox.classList.add('hidden');
    resultsBox.innerHTML = '';
};

window.sendInvitation = async function() {
    if (!selectedInviteCandidate) {
        Swal.fire({ title: 'Selecciona un estudiante', text: 'Busca y haz clic en un estudiante de la lista antes de invitar.', icon: 'warning', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
        return;
    }
    const receiverId = selectedInviteCandidate.userId;
    try {
        const response = await fetch(`/teams/${currentUser.team_id}/invitations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiver_id: receiverId })
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo enviar la invitación', text: data.error || data.message || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        Swal.fire({ title: '¡Invitación enviada!', icon: 'success', confirmButtonText: 'Genial', confirmButtonColor: '#4B3FA8' });
        sentInvitationsLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

window.acceptInvitation = async function(teamId, requestId) {
    try {
        const response = await fetch(`/teams/${teamId}/invitations/${requestId}/accept`, { method: 'PATCH' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo aceptar', text: data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        receivedInvitationsLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

window.rejectInvitation = async function(teamId, requestId) {
    try {
        const response = await fetch(`/teams/${teamId}/invitations/${requestId}/reject`, { method: 'PATCH' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo rechazar', text: data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        receivedInvitationsLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

//TAB: MI EQUIPO 
let myTeamData = null;
let myTeamLoaded = false;

async function loadMyTeam() {
    try {
        const response = await fetch('/users/team');
        myTeamData = response.ok ? await response.json() : null;
    } catch (error) {
        console.error('Error cargando mi equipo:', error);
        myTeamData = null;
    }
    myTeamLoaded = true;
}

function renderMiEquipoTab() {
    if (!myTeamLoaded) {
        loadMyTeam().then(() => {
            if (activeTab === 'mi-equipo') document.getElementById('tab-content').innerHTML = renderTabContent();
        });
        return emptyState('Cargando tu equipo...');
    }
    if (!myTeamData) {
        return emptyState('No perteneces a ningún equipo actualmente.');
    }
    return `
        <div class="flex flex-col gap-6 pt-4">
            ${card({
                className: 'p-6 flex flex-col gap-4',
                width: 'w-full',
                content: `
                    <span class="text-xl font-bold">${myTeamData.team_name}</span>
                    <div class="flex flex-col gap-2 mt-2">
                        <span class="text-sm font-semibold text-gray-600">Integrantes</span>
                        ${myTeamData.members.map(member => `
                            <div class="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-2.5">
                                <span class="p-1 text-sm font-medium">${member.full_name}${member.is_leader ? ' (Líder)' : ''}</span>
                                ${(currentUser.is_leader && !member.is_leader) ? `
                                    <div class="flex gap-2">
                                        <button onclick="transferLeadership(${member.user_id})" 
                                            class=" cursor-pointer text-xs font-semibold text-[#4B3FA8] hover:underline">
                                            Transferir liderazgo
                                        </button>
                                        <button onclick="expelMember(${member.user_id})" 
                                            class="cursor-pointer text-xs font-semibold text-red-500 hover:underline">
                                            Expulsar
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ${myTeamData.interpretation ? `
                    <div class="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                        <span class="text-sm font-semibold text-gray-600">Análisis técnico del equipo</span>
                        <div class="flex flex-wrap gap-2">
                            ${Object.entries(myTeamData.tech_averages).map(([tech, avg]) => `
                                <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">${tech}: ${avg}%</span>
                            `).join('')}
                        </div>
                        <p class="text-sm text-gray-600 leading-relaxed">${myTeamData.interpretation}</p>
                    </div>
                    ` : ''}
                                        ${currentUser.is_leader ? `
                    <button onclick="dissolveTeam()" 
                        class=" px-4 cursor-pointer mt-4 bg-pink-500 text-white font-bold py-2.5 rounded-xl hover:bg-pink-700 transition-all duration-200">
                        Disolver equipo
                    </button>
                    ` : `
                    <button onclick="leaveTeam()" 
                        class=" px-4 cursor-pointer mt-4 border border-red-500 text-red-500 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-all duration-200">
                        Abandonar equipo
                    </button>
                    `}
                `
            })}
        </div>
    `;
}

window.expelMember = async function(memberId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?', text: '¿Seguro que quieres expulsar a este integrante?', icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#4B3FA8', cancelButtonColor: '#F63E9F',
        confirmButtonText: 'Sí, expulsar', cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
        const response = await fetch(`/teams/${myTeamData.team_id}/members/${memberId}`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo expulsar', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        myTeamLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

window.transferLeadership = async function(memberId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?', text: '¿Seguro que quieres transferir el liderazgo a este integrante? Perderás tus permisos de líder.', icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#4B3FA8', cancelButtonColor: '#F63E9F',
        confirmButtonText: 'Sí, transferir', cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
        const response = await fetch(`/teams/${myTeamData.team_id}/leader`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ new_leader_id: memberId })
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo transferir', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        currentUser = await loadProfile();
        myTeamLoaded = false;
        const tabsNav = document.getElementById('tabs-nav');
        if (tabsNav) tabsNav.outerHTML = renderTabsNav();
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

window.dissolveTeam = async function() {
    const result = await Swal.fire({
        title: '¿Estás seguro?', text: 'Esta acción es irreversible. ¿Seguro que quieres disolver el equipo?', icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#4B3FA8', cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, disolver', cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
        const response = await fetch(`/teams/${myTeamData.team_id}`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo disolver', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        Swal.fire({ title: 'Equipo disuelto', text: 'El equipo ha sido eliminado correctamente.', icon: 'success', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
        if (window.loadNavbarProfile) window.loadNavbarProfile();
        await initTeamsPage();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

window.leaveTeam = async function() {
    const result = await Swal.fire({
        title: '¿Estás seguro?', text: '¿Seguro que quieres abandonar el equipo?', icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#4B3FA8', cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, abandonar', cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
        const response = await fetch(`/teams/${myTeamData.team_id}/members/me`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo abandonar el equipo', text: data.message || data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        Swal.fire({ title: 'Has abandonado el equipo', icon: 'success', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
        myTeamLoaded = false;
        teamsLoaded = false;
        activeTab = 'equipos';
        if (window.loadNavbarProfile) window.loadNavbarProfile();
        await initTeamsPage();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

//TAB: RECOMENDACIONES
let invitedUserIds = new Set();

async function loadRecommendations() {
    if (!currentUser?.team_id) { recommendationsLoaded = true; return; }
    try {
        const [recRes, invRes] = await Promise.all([
            fetch(`/teams/${currentUser.team_id}/recommendations`),
            fetch('/teams/invitations/sent')
        ]);
        recommendationsData = recRes.ok ? (await recRes.json()).recommendations || [] : [];
        if (invRes.ok) {
            const invitations = await invRes.json();
            invitedUserIds = new Set(invitations.map(inv => inv.receiver_user_id));
        }
        recommendationsLoaded = true;
    } catch (error) {
        console.error('Error cargando recomendaciones:', error);
        recommendationsData = [];
        recommendationsLoaded = true;
    }
}

function renderRecomendacionesTab() {
    if (!currentUser?.team_id) return emptyState('No perteneces a ningún equipo todavía.');
    if (!recommendationsLoaded) {
        loadRecommendations().then(() => {
            if (activeTab === 'recomendaciones') document.getElementById('tab-content').innerHTML = renderTabContent();
        });
        return emptyState('Cargando recomendaciones...');
    }
    if (recommendationsData.length === 0) return emptyState('No hay candidatos recomendados en este momento.');
    return `
        <div class="flex flex-col gap-4 pt-4">
            <span class="text-lg font-bold">Recomendaciones de estudiantes para tu equipo</span>
            <div class="relative">
                <input id="coder-search" type="text" placeholder="Buscar coder por nombre..." autocomplete="off"
                    oninput="handleCoderSearch()"
                    class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                <div id="coder-search-results" class="absolute z-10 bg-white border border-gray-200 rounded-xl mt-1 w-full shadow-lg hidden"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${recommendationsData.map(rec => `
                    <div class="border border-gray-100 rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-300">
                        <img src="/${rec.profile_image}" alt="${rec.full_name}" class="w-14 h-14 rounded-full object-cover border-2 border-[#4B3FA8]">
                        <span class="font-bold">${rec.full_name}</span>
                        <span class="text-sm font-semibold text-[#4B3FA8]">${rec.compatibility}% de compatibilidad</span>
                        <div class="flex flex-wrap gap-2 mt-1">
                            ${(rec.strengthens || []).map(tech => `
                                <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">${tech}</span>
                            `).join('')}
                        </div>
                        <p class="text-xs text-gray-500 leading-relaxed mt-1">${rec.justification || ''}</p>
                        ${invitedUserIds.has(rec.user_id) ? `
                        <button disabled
                            class="mt-2 border border-gray-200 text-gray-400 font-bold py-2 rounded-xl cursor-not-allowed">
                            Invitación pendiente
                        </button>
                        ` : `
                        <button onclick="sendInvitationTo(${rec.user_id}, '${rec.full_name.replace(/'/g, "\\'")}')" 
                            class=" cursor-pointer mt-2 border border-[#4B3FA8] text-[#4B3FA8] font-bold py-2 rounded-xl hover:bg-[#4B3FA8] hover:text-white transition-all duration-300">
                            Invitar al equipo
                        </button>
                        `}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.sendInvitationTo = async function(userId, name) {
    try {
        const response = await fetch(`/teams/${currentUser.team_id}/invitations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiver_id: userId })
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo enviar la invitación', text: data.error || data.message || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        Swal.fire({ title: '¡Invitación enviada!', text: `Invitación enviada a ${name}`, icon: 'success', confirmButtonText: 'Genial', confirmButtonColor: '#4B3FA8' });
        sentInvitationsLoaded = false;
        recommendationsLoaded = false;
        document.getElementById('tab-content').innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

let coderSearchTimeout;
window.handleCoderSearch = function() {
    const input = document.getElementById('coder-search');
    const resultsBox = document.getElementById('coder-search-results');
    const query = input.value.trim();
    clearTimeout(coderSearchTimeout);
    if (query.length < 2) {
        resultsBox.classList.add('hidden');
        resultsBox.innerHTML = '';
        return;
    }
    coderSearchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`/teams/students/search?q=${encodeURIComponent(query)}`);
            const students = response.ok ? await response.json() : [];
            if (students.length === 0) {
                resultsBox.innerHTML = `<div class="px-4 py-2.5 text-sm text-gray-400">Sin resultados</div>`;
            } else {
                resultsBox.innerHTML = students.map(s => `
                    <div onclick="showMemberProfile(${s.user_id}, true)"
                        class="px-4 py-2.5 text-sm cursor-pointer hover:bg-[#F3F1FA]">
                        ${s.full_name}
                    </div>
                `).join('');
            }
            resultsBox.classList.remove('hidden');
        } catch (error) {
            console.error(error);
        }
    }, 300);
};

window.showMemberProfile = async function(userId, showInviteButton = false) {
    try {
        const response = await fetch(`/users/${userId}/profile`);
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: 'No se pudo cargar el perfil', text: data.error || 'Ocurrió un error inesperado.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
            return;
        }
        if (!data.assessment_completed) {
            Swal.fire({
                title: data.full_name,
                html: `<p class="text-sm text-gray-500">Este estudiante aún no ha completado su Assessment Técnico.</p>`,
                confirmButtonText: 'Cerrar', confirmButtonColor: '#4B3FA8'
            });
            return;
        }
        const techBadges = [
            ['Python', data.python_score], ['SQL', data.sql_score],
            ['JavaScript', data.javascript_score], ['HTML', data.html_score], ['CSS', data.css_score]
        ].map(([label, score]) => `<span class="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">${label}: ${score}%</span>`).join(' ');

        const result = await Swal.fire({
            title: data.full_name,
            html: `
                <div class="flex flex-col gap-3 text-left">
                    <img src="/${data.profile_image}" alt="${data.full_name}" class="w-16 h-16 rounded-full object-cover border-2 border-[#4B3FA8] mx-auto">
                    <span class="text-xs text-gray-400 text-center">${data.campus_name || ''} · ${data.journey_time || ''} · ${data.clan_name || ''}</span>
                    <span class="text-sm font-bold text-[#4B3FA8]">Puntaje general: ${data.overall_score}%</span>
                    <div class="flex flex-wrap gap-1">${techBadges}</div>
                    <div class="text-xs text-gray-600 leading-relaxed">
                        <p class="font-semibold text-gray-700 mt-1">Fortalezas</p>
                        <p>${data.strengths}</p>
                        <p class="font-semibold text-gray-700 mt-2">Oportunidades de mejora</p>
                        <p>${data.improvement_opportunities}</p>
                    </div>
                </div>
            `,
            showCancelButton: showInviteButton,
            cancelButtonText: 'Invitar al equipo',
            cancelButtonColor: '#4B3FA8',
            confirmButtonText: 'Cerrar', confirmButtonColor: '#9ca3af', width: '32rem'
        });
        if (showInviteButton && result.dismiss === Swal.DismissReason.cancel) {
            window.sendInvitationTo(userId, data.full_name);
        }
    } catch (error) {
        console.error(error);
        Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonText: 'Entendido', confirmButtonColor: '#4B3FA8' });
    }
};

function emptyState(message) {
    return `<div class="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">${message}</div>`;
}