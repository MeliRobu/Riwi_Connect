import { card } from "../components/card";
import Swal from "sweetalert2"; 
// Estado simulado del usuario actual (ajusta según tu manejo real de sesión)
const currentUser = { id: 'u1', name: 'Lians Paternina', hasTeam: false };

// ===== DATOS SIMULADOS - reemplaza esto por el fetch real cuando tengas backend =====
const mockRecommendations = [
    {
        id: 't3',
        name: 'Clan Nova',
        matchScore: 91,
        description: 'Equipo enfocado en desarrollo full-stack con proyectos activos en producción.',
        techStack: ['JavaScript', 'Node.js', 'React', 'PostgreSQL'],
        argumentation: 'Basado en tu desempeño destacado en JavaScript y bases de datos, este equipo busca justo tu perfil técnico. Además, tu puntaje en trabajo colaborativo coincide con la dinámica de comunicación constante que maneja este clan.'
    },
    {
        id: 't5',
        name: 'Clan Quantum',
        matchScore: 84,
        description: 'Especialistas en frontend con enfoque en experiencia de usuario y diseño.',
        techStack: ['HTML & CSS', 'JavaScript', 'Tailwind'],
        argumentation: 'Tu fortaleza en maquetación y atención al detalle visual encaja con la necesidad actual de este equipo de reforzar su frontend. Tu rapidez de aprendizaje también fue un factor clave en esta recomendación.'
    },
    {
        id: 't7',
        name: 'Clan Vortex',
        matchScore: 78,
        description: 'Equipo mixto con enfoque en automatización y control de versiones avanzado.',
        techStack: ['Git & GitHub', 'Node.js', 'SQL'],
        argumentation: 'Tu dominio en Git y GitHub, sumado a tu interés en buenas prácticas de control de versiones, te posiciona como un aporte valioso para el flujo de trabajo que maneja este equipo.'
    }
];
// ===================================================================================

export function recommendations_view() {
    setTimeout(() => loadRecommendations(), 0);

    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div class="flex flex-col gap-1 pt-6">
            <span class="text-3xl font-bold">Sugerencias de equipos</span>
            <span class="text-gray-500 text-sm">Equipos recomendados para ti según tu perfil técnico</span>
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

// Simula el delay de una petición real, para que el spinner se alcance a ver
function loadRecommendations() {
    const container = document.getElementById('recommendations-content');
    if (!container) return;

    // RN-040 / DT-009: solo disponible para estudiantes sin equipo actual
    if (currentUser.hasTeam) {
        container.innerHTML = renderNoAccessState();
        return;
    }

    setTimeout(() => {
        try {
            // Simula la respuesta de GET /students/recommendations
            const data = mockRecommendations;
            container.innerHTML = renderRecommendations(data);
        } catch (error) {
            console.error(error);
            container.innerHTML = renderErrorState();
        }
    }, 600); // medio segundo de "carga" simulada
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
                            <span class="text-xl font-bold">${team.name}</span>
                            <span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-bold px-4 py-1.5 rounded-full">
                                ${team.matchScore}% match
                            </span>
                        </div>

                        <span class="text-sm text-gray-500">${team.description || ''}</span>

                        <div class="flex flex-wrap gap-2">
                            ${(team.techStack || []).map(tech => `
                                <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">${tech}</span>
                            `).join('')}
                        </div>

                        <div class="border-t border-gray-100 pt-4 flex flex-col gap-2">
                            <span class="text-sm font-bold text-[#4B3FA8]">Por qué te lo recomendamos</span>
                            <p class="text-sm text-gray-600 leading-relaxed">${team.argumentation}</p>
                        </div>

                        <button 
                            onclick="requestToJoinTeam('${team.id}', '${team.name}')"
                            class=" px-4 cursor-pointer mt-2 bg-[#4B3FA8] text-white font-bold py-2.5 rounded-xl transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95"
                        >
                            Solicitar ingreso
                        </button>
                    `
                })}
            `).join('')}
        </div>
    `;
}

window.requestToJoinTeam = function(teamId, teamName) {
    Swal.fire({
        title: '¡Solicitud enviada!',
        text: `Tu solicitud para unirte al equipo "${teamName}" ha sido procesada correctamente.`,
        icon: 'success',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#4B3FA8',
        timerProgressBar: true
    });
};


function renderEmptyState() {
    return `
        <div class="text-center text-gray-400 text-sm py-16 border border-dashed border-gray-200 rounded-xl mt-4">
            Por ahora no tenemos recomendaciones de equipos para ti. Vuelve a intentarlo más tarde.
        </div>
    `;
}

function renderNoAccessState() {
    return `
        <div class="text-center text-gray-400 text-sm py-16 border border-dashed border-gray-200 rounded-xl mt-4">
            Ya perteneces a un equipo, por lo que esta sección no está disponible para ti.
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
