import { card } from "../components/card";
import Swal from "sweetalert2";

// ===== ESTADO REAL (se llena con datos del Backend) =====
let currentUser = null;
let teams = [];
let teamsLoaded = false;

let sentRequests = [
    { id: 'r1', teamId: 't2', teamName: 'Clan Titán', status: 'pending' }
];
let receivedRequests = [
    { id: 'rr1', userId: 'u7', userName: 'Camila Ruiz', status: 'pending' },
    { id: 'rr2', userId: 'u8', userName: 'Andrés Gómez', status: 'pending' }
];
let sentInvitations = [
    { id: 'i1', userId: 'u9', userName: 'Sofía Londoño', status: 'pending' }
];
let receivedInvitations = [
    { id: 'ri1', teamId: 't3', teamName: 'Clan Nova', status: 'pending' }
];
let recommendations = [
    { id: 'u10', name: 'Juan Pérez', matchScore: 91, topSkill: 'JavaScript' },
    { id: 'u11', name: 'Valentina Ríos', matchScore: 87, topSkill: 'Node.js' }
];

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
    return `
    <div id="tabs-nav" class="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        ${renderTabButton('equipos', 'Equipos')}
        ${renderTabButton('mis-solicitudes', 'Mis solicitudes')}
        ${isLeader ? renderTabButton('solicitudes-recibidas', 'Solicitudes recibidas') : ''}
        ${renderTabButton('invitaciones', 'Invitaciones')}
        ${isLeader ? renderTabButton('mi-equipo', 'Mi equipo') : ''}
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

function renderEquiposTab() {
    if (!teamsLoaded) {
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
                            <button 
                                onclick="requestToJoin(${team.id_team}, '${team.team_name.replace(/'/g, "\\'")}')"
                                class=" cursor-pointer mt-2 border border-[#4B3FA8] text-[#4B3FA8] font-bold py-2 rounded-xl transition-all duration-300 hover:bg-[#4B3FA8] hover:text-white"
                            >
                                Solicitar ingreso
                            </button>
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
        Swal.fire({
            title: '¡Atención!',
            text: 'Escribe un nombre para el equipo.',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#4B3FA8'
        });
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
            Swal.fire({
                title: 'No se pudo crear el equipo',
                text: data.error || 'Ocurrió un error inesperado.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4B3FA8'
            });
            return;
        }
        Swal.fire({
            title: '¡Equipo creado!',
            text: `El equipo "${name}" fue creado correctamente.`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4B3FA8'
        });
        await initTeamsPage();
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

window.requestToJoin = async function(teamId, teamName) {
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
            text: `Solicitud enviada a ${teamName}`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4B3FA8'
        });
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

function renderMisSolicitudesTab() {
    const pending = sentRequests.filter(r => r.status === 'pending');
    return `
        <div class="flex flex-col gap-4 pt-4">
            <span class="text-lg font-bold">Solicitudes que he enviado</span>
            ${pending.length === 0 ? emptyState('No tienes solicitudes pendientes.') : `
                <div class="flex flex-col gap-3">
                    ${pending.map(req => `
                        <div class="flex items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm">
                            <div class="flex flex-col">
                                <span class="font-semibold">${req.teamName}</span>
                                <span class="text-xs text-amber-500 font-semibold">Pendiente</span>
                            </div>
                            <button 
                                onclick="cancelRequest('${req.id}')"
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
window.cancelRequest = function(reqId) {
    sentRequests = sentRequests.filter(r => r.id !== reqId);
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

function renderSolicitudesRecibidasTab() {
    const pending = receivedRequests.filter(r => r.status === 'pending');
    return `
        <div class="flex flex-col gap-4 pt-4">
            <span class="text-lg font-bold">Solicitudes recibidas por tu equipo</span>
            ${pending.length === 0 ? emptyState('No tienes solicitudes recibidas.') : `
                <div class="flex flex-col gap-3">
                    ${pending.map(req => `
                        <div class="flex items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm">
                            <span class="font-semibold">${req.userName}</span>
                            <div class="flex gap-2">
                                <button onclick="acceptRequest('${req.id}')" 
                                    class=" cursor-pointer bg-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-200">
                                    Aceptar
                                </button>
                                <button onclick="rejectRequest('${req.id}')" 
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
window.acceptRequest = function(reqId) {
    receivedRequests = receivedRequests.filter(r => r.id !== reqId);
    document.getElementById('tab-content').innerHTML = renderTabContent();
};
window.rejectRequest = function(reqId) {
    receivedRequests = receivedRequests.filter(r => r.id !== reqId);
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

function renderInvitacionesTab() {
    const isLeader = currentUser && currentUser.is_leader;
    return `
        <div class="flex flex-col gap-8 pt-4">
            ${isLeader ? `
            <div class="flex flex-col gap-4">
                <span class="text-lg font-bold">Enviar invitación</span>
                ${card({
                    className: 'p-6 flex flex-col md:flex-row gap-3',
                    width: 'w-full',
                    content: `
                        <input id="invite-username" type="text" placeholder="Nombre o ID del estudiante" 
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                        <button onclick="sendInvitation()" 
                            class=" cursor-pointer bg-[#4B3FA8] text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 hover:bg-pink-600">
                            Enviar invitación
                        </button>
                    `
                })}
                <span class="text-lg font-bold mt-2">Invitaciones enviadas por tu equipo</span>
                ${sentInvitations.length === 0 ? emptyState('No has enviado invitaciones.') : `
                    <div class="flex flex-col gap-3">
                        ${sentInvitations.map(inv => `
                            <div class="flex items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm">
                                <span class="font-semibold">${inv.userName}</span>
                                <span class="text-xs text-amber-500 font-semibold">Pendiente</span>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
            ` : ''}
            <div class="flex flex-col gap-4">
                <span class="text-lg font-bold">Mis invitaciones recibidas</span>
                ${receivedInvitations.length === 0 ? emptyState('No tienes invitaciones recibidas.') : `
                    <div class="flex flex-col gap-3">
                        ${receivedInvitations.map(inv => `
                            <div class="flex items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm">
                                <span class="font-semibold">${inv.teamName}</span>
                                <div class="flex gap-2">
                                    <button onclick="acceptInvitation('${inv.id}')" 
                                        class="  cursor-pointer bg-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-200">
                                        Aceptar
                                    </button>
                                    <button onclick="rejectInvitation('${inv.id}')" 
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
window.sendInvitation = function() {
    const input = document.getElementById('invite-username');
    const name = input.value.trim();
    if (!name) {
        Swal.fire({
            title: 'Campo obligatorio',
            text: 'Escribe el nombre del estudiante a invitar.',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#4B3FA8'
        });
        return;
    }
    sentInvitations.push({ id: 'i' + (sentInvitations.length + 1), userId: 'u' + Date.now(), userName: name, status: 'pending' });
    document.getElementById('tab-content').innerHTML = renderTabContent();
};
window.acceptInvitation = function(invId) {
    receivedInvitations = receivedInvitations.filter(i => i.id !== invId);
    document.getElementById('tab-content').innerHTML = renderTabContent();
};
window.rejectInvitation = function(invId) {
    receivedInvitations = receivedInvitations.filter(i => i.id !== invId);
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

function renderMiEquipoTab() {
    return emptyState('Esta pestaña todavía está en construcción (pendiente conectar con el Backend).');
}
window.expelMember = function(memberId) {};
window.transferLeadership = function(memberId) {};
window.dissolveTeam = async () => {};

function renderRecomendacionesTab() {
    return `
        <div class="flex flex-col gap-4 pt-4">
            <span class="text-lg font-bold">Recomendaciones de estudiantes para tu equipo</span>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${recommendations.map(rec => `
                    <div class="border border-gray-100 rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-300">
                        <span class="font-bold">${rec.name}</span>
                        <span class="text-sm text-gray-500">Fortaleza: ${rec.topSkill}</span>
                        <span class="text-sm font-semibold text-[#4B3FA8]">${rec.matchScore}% de match</span>
                        <button onclick="sendInvitationTo('${rec.name}')" 
                            class=" cursor-pointer mt-2 border border-[#4B3FA8] text-[#4B3FA8] font-bold py-2 rounded-xl hover:bg-[#4B3FA8] hover:text-white transition-all duration-300">
                            Invitar al equipo
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.sendInvitationTo = function(name) {
    sentInvitations.push({ id: 'i' + (sentInvitations.length + 1), userId: 'u' + Date.now(), userName: name, status: 'pending' });
    Swal.fire({
        title: '¡Invitación enviada!',
        text: `Invitación enviada a ${name}`,
        icon: 'success',
        confirmButtonText: 'Genial',
        confirmButtonColor: '#4B3FA8'
    });
};

function emptyState(message) {
    return `<div class="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">${message}</div>`;
}