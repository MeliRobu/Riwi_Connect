import { card } from "../components/card";
import Swal from "sweetalert2";
// ===== ESTADO SIMULADO (reemplaza con datos reales de tu API/backend) =====

const currentUser = { id: 'u1', name: 'Melissa', isLeader: true, teamId: 't1' };

let teams = [
    { id: 't1', name: 'Clan Fénix', leaderId: 'u1', members: ['u1', 'u2', 'u3'], description: 'Equipo enfocado en frontend y UX.' },
    { id: 't2', name: 'Clan Titán', leaderId: 'u4', members: ['u4', 'u5'], description: 'Especialistas en backend y bases de datos.' },
    { id: 't3', name: 'Clan Nova', leaderId: 'u6', members: ['u6'], description: 'Equipo nuevo, buscando integrantes full-stack.' }
];

let sentRequests = [
    { id: 'r1', teamId: 't2', teamName: 'Clan Titán', status: 'pending' }
];

let receivedRequests = [ // solicitudes que llegan a MI equipo (soy leader)
    { id: 'rr1', userId: 'u7', userName: 'Camila Ruiz', status: 'pending' },
    { id: 'rr2', userId: 'u8', userName: 'Andrés Gómez', status: 'pending' }
];

let sentInvitations = [ // invitaciones que mi equipo envió a otros
    { id: 'i1', userId: 'u9', userName: 'Sofía Londoño', status: 'pending' }
];

let receivedInvitations = [ // invitaciones que a MÍ me llegaron de otros equipos
    { id: 'ri1', teamId: 't3', teamName: 'Clan Nova', status: 'pending' }
];

let recommendations = [
    { id: 'u10', name: 'Juan Pérez', matchScore: 91, topSkill: 'JavaScript' },
    { id: 'u11', name: 'Valentina Ríos', matchScore: 87, topSkill: 'Node.js' }
];

let activeTab = 'equipos';

// ===== VISTA PRINCIPAL =====

export function teams_view() {
    activeTab = 'equipos';
    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div class="flex flex-col gap-1 pt-6">
            <span class="text-3xl font-bold">Equipos</span>
            <span class="text-gray-500 text-sm">Consulta, gestiona y haz crecer tu equipo</span>
        </div>

        <!-- Tabs -->
        <div id="tabs-nav" class="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px">
            ${renderTabButton('equipos', 'Equipos')}
            ${renderTabButton('mis-solicitudes', 'Mis solicitudes')}
            ${currentUser.isLeader ? renderTabButton('solicitudes-recibidas', 'Solicitudes recibidas') : ''}
            ${renderTabButton('invitaciones', 'Invitaciones')}
            ${currentUser.isLeader ? renderTabButton('mi-equipo', 'Mi equipo') : ''}
            ${currentUser.isLeader ? renderTabButton('recomendaciones', 'Recomendaciones') : ''}
        </div>

        <div id="tab-content">
            ${renderTabContent()}
        </div>
    </main>
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
    document.getElementById('tabs-nav').outerHTML = `
        <div id="tabs-nav" class="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px">
            ${renderTabButton('equipos', 'Equipos')}
            ${renderTabButton('mis-solicitudes', 'Mis solicitudes')}
            ${currentUser.isLeader ? renderTabButton('solicitudes-recibidas', 'Solicitudes recibidas') : ''}
            ${renderTabButton('invitaciones', 'Invitaciones')}
            ${currentUser.isLeader ? renderTabButton('mi-equipo', 'Mi equipo') : ''}
            ${currentUser.isLeader ? renderTabButton('recomendaciones', 'Recomendaciones') : ''}
        </div>
    `;
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

// ===== TAB: CONSULTAR EQUIPOS + CREAR EQUIPO + SOLICITAR INGRESO =====

function renderEquiposTab() {
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
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${teams.map(team => `
                        <div class="border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300">
                            <span class="text-lg font-bold">${team.name}</span>
                            <span class="text-sm text-gray-500">${team.description}</span>
                            <span class="text-xs text-gray-400">${team.members.length} integrante(s)</span>
                            <button 
                                onclick="requestToJoin('${team.id}', '${team.name}')"
                                class=" cursor-pointer mt-2 border border-[#4B3FA8] text-[#4B3FA8] font-bold py-2 rounded-xl transition-all duration-300 hover:bg-[#4B3FA8] hover:text-white"
                            >
                                Solicitar ingreso
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

window.createTeam = function() {
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


    teams.push({
        id: 't' + (teams.length + 1),
        name,
        leaderId: currentUser.id,
        members: [currentUser.id],
        description: 'Equipo recién creado.'
    });

    document.getElementById('tab-content').innerHTML = renderTabContent();
};

window.requestToJoin = function(teamId, teamName) {
    const alreadySent = sentRequests.find(r => r.teamId === teamId && r.status === 'pending');
    if (alreadySent) {
    Swal.fire({
        title: 'Solicitud duplicada',
        text: 'Ya tienes una solicitud pendiente a este equipo.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#4B3FA8'
    });
    return;
}


    sentRequests.push({ id: 'r' + (sentRequests.length + 1), teamId, teamName, status: 'pending' });
    Swal.fire({
    title: '¡Solicitud enviada!',
    text: `Solicitud enviada a ${teamName}`,
    icon: 'success',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#4B3FA8'
});
;
};

// ===== TAB: MIS SOLICITUDES ENVIADAS (+ CANCELAR) =====

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

// ===== TAB: SOLICITUDES RECIBIDAS (LEADER) - ACEPTAR/RECHAZAR =====

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

// ===== TAB: INVITACIONES (enviadas por mi equipo + recibidas por mí) =====

function renderInvitacionesTab() {
    return `
        <div class="flex flex-col gap-8 pt-4">

            ${currentUser.isLeader ? `
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
        title: 'Falta el nombre',
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

// ===== TAB: MI EQUIPO (expulsar, transferir liderazgo, disolver) =====

function renderMiEquipoTab() {
    const myTeam = teams.find(t => t.id === currentUser.teamId);
    if (!myTeam) return emptyState('No perteneces a ningún equipo actualmente.');

    return `
        <div class="flex flex-col gap-6 pt-4">
            ${card({
                className: 'p-6 flex flex-col gap-4',
                width: 'w-full',
                content: `
                    <div class="flex flex-col p-4 gap-4">
                        <span class="text-xl font-bold">${myTeam.name}</span>
                        <span class="text-sm text-gray-500">${myTeam.description}</span>
                    </div>
                    <div class="flex flex-col gap-2 mt-2">
                        <span class="text-sm font-semibold text-gray-600">Integrantes</span>
                        ${myTeam.members.map(memberId => `
                            <div class="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-2.5">
                                <span class=" p-4 text-sm font-medium">${memberId === currentUser.id ? currentUser.name + ' (Tú, Líder)' : 'Integrante ' + memberId}</span>
                                ${memberId !== currentUser.id ? `
                                    <div class="flex gap-2">
                                        <button onclick="transferLeadership('${memberId}')" 
                                            class=" cursor-pointer text-xs font-semibold text-[#4B3FA8] hover:underline">
                                            Transferir liderazgo
                                        </button>
                                        <button onclick="expelMember('${memberId}')" 
                                            class="cursor-pointer text-xs font-semibold text-red-500 hover:underline">
                                            Expulsar
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>

                    <button onclick="dissolveTeam()" 
                        class=" px-4 cursor-pointer mt-4 bg-pink-500 text-white font-bold py-2.5 rounded-xl hover:bg-pink-800    transition-all duration-200">
                        Disolver equipo
                    </button>
                `
            })}
        </div>
    `;
}

window.expelMember = function(memberId) {
    if (!confirm('¿Seguro que quieres expulsar a este integrante?')) return;
    const myTeam = teams.find(t => t.id === currentUser.teamId);
    myTeam.members = myTeam.members.filter(m => m !== memberId);
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

window.transferLeadership = function(memberId) {
    if (!confirm('a.')) return;
    const myTeam = teams.find(t => t.id === currentUser.teamId);
    myTeam.leaderId = memberId;
    currentUser.isLeader = false;
    alert('Liderazgo transferido.');
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

window.dissolveTeam = function() {
    if (!confirm('Esta acción es irreversible. ¿Seguro que quieres disolver el equipo?')) return;
    teams = teams.filter(t => t.id !== currentUser.teamId);
    alert('Equipo disuelto.');
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

// ===== TAB: RECOMENDACIONES (LEADER) =====


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

window.expelMember = async function(memberId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Seguro que quieres expulsar a este integrante?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4B3FA8',
        cancelButtonColor: '#F63E9F',
        confirmButtonText: 'Sí, expulsar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    const myTeam = teams.find(t => t.id === currentUser.teamId);
    myTeam.members = myTeam.members.filter(m => m !== memberId);

    await Swal.fire({
        title: '¡Expulsado!',
        text: 'El integrante ha sido expulsado del equipo.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });

    document.getElementById('tab-content').innerHTML = renderTabContent();
};


window.transferLeadership = async function(memberId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Seguro que quieres transferir el liderazgo a este integrante? Perderás tus permisos de líder.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4B3FA8',
        cancelButtonColor: '#F63E9F',
        confirmButtonText: 'Sí, transferir',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    const myTeam = teams.find(t => t.id === currentUser.teamId);
    myTeam.leaderId = memberId;
    currentUser.isLeader = false;

    await Swal.fire({
        title: '¡Transferido!',
        text: 'Liderazgo transferido correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });

    document.getElementById('tab-content').innerHTML = renderTabContent();
};

window.dissolveTeam = async (teamId) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción es irreversible. ¿Seguro que quieres disolver el equipo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4B3FA8',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, disolver',
        cancelButtonText: 'Cancelar'
    });

  
    if (!result.isConfirmed) return;
    Swal.fire({
        title: 'Equipo disuelto',
        text: 'El equipo ha sido eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#4B3FA8'
        
    });
    document.getElementById('tab-content').innerHTML = renderTabContent();
    
};

// ===== TAB: RECOMENDACIONES (LEADER) =====

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

// ===== HELPER =====

function emptyState(message) {
    return `<div class="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">${message}</div>`;
}