import { card } from "../../components/card";
import Swal from "sweetalert2";
// ===== DATOS SIMULADOS - reemplaza por fetch real cuando tengas los endpoints =====
let questions = [
    { id: 'q1', text: '¿Cuál es la diferencia entre let y var en JavaScript?', category: 'JavaScript', difficulty: 'medio', active: true },
    { id: 'q2', text: '¿Qué es el Virtual DOM en React?', category: 'React', difficulty: 'medio', active: true },
    { id: 'q3', text: '¿Cómo funciona el event loop en JavaScript?', category: 'JavaScript', difficulty: 'dificil', active: false },
    { id: 'q4', text: '¿Qué es una consulta JOIN en SQL?', category: 'SQL', difficulty: 'facil', active: true },
    { id: 'q5', text: '¿Para qué sirve el comando git rebase?', category: 'Git', difficulty: 'dificil', active: true }
];

// Lista fija de categorías — única fuente de verdad, evita duplicados tipo "JS" vs "JavaScript"
let categories = ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'HTML & CSS'];

let assessmentConfig = {
    questionCount: 10,
    timeLimit: 60,
    passingScore: 70,
    difficultyMix: 'balanceada'
};

let activeTab = 'banco';
let editingQuestionId = null;

// ===== VISTA PRINCIPAL =====

export function question_bank() {
    activeTab = 'banco';
    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div class="flex flex-col gap-1 pt-6">
            <span class="text-3xl font-bold">Banco de preguntas</span>
            <span class="text-gray-500 text-sm">Crea, edita, activa o desactiva preguntas, y configura las pruebas técnicas</span>
        </div>

        <div id="tabs-nav" class="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px">
            ${renderTabButton('banco', 'Banco de preguntas')}
            ${renderTabButton('config', 'Configuración del Assessment')}
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
            onclick="switchQBTab('${id}')"
            class="px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                isActive 
                    ? 'border-[#4B3FA8] text-[#4B3FA8]' 
                    : 'border-transparent text-gray-400 hover:text-[#4B3FA8]'
            }"
        >
            ${label}
        </button>
    `;
}

window.switchQBTab = function (tabId) {
    activeTab = tabId;
    editingQuestionId = null;
    document.getElementById('tabs-nav').outerHTML = `
        <div id="tabs-nav" class="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px">
            ${renderTabButton('banco', 'Banco de preguntas')}
            ${renderTabButton('config', 'Configuración del Assessment')}
        </div>
    `;
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

function renderTabContent() {
    switch (activeTab) {
        case 'banco': return renderQuestionBankTab();
        case 'config': return renderConfigTab();
        default: return '';
    }
}

// ===== SELECTOR DE CATEGORÍA REUTILIZABLE (con opción "+ Crear nueva") =====

function renderCategorySelect(id, selectedValue = '') {
    return `
        <select id="${id}" onchange="handleCategorySelectChange('${id}')"
            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
            <option value="" disabled ${!selectedValue ? 'selected' : ''}>Selecciona una categoría</option>
            ${categories.map(cat => `
                <option value="${cat}" ${cat === selectedValue ? 'selected' : ''}>${cat}</option>
            `).join('')}
            <option value="__new__">+ Crear nueva categoría</option>
        </select>
    `;
}

// Si eligen "+ Crear nueva categoría", pide el nombre y la agrega a la lista fija
window.handleCategorySelectChange =  async function (selectId) {
    const select = document.getElementById(selectId);
    if (select.value !== '__new__') return;

    const { value: newCategory } = await Swal.fire({
        title: 'Nueva categoría',
        text: 'Nombre de la nueva categoría:',
        input: 'text',
        inputPlaceholder: 'Escribe el nombre aquí...',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#4B3FA8',
        cancelButtonColor: '#F6339A',
    });


    if (!newCategory || !newCategory.trim()) {
        select.value = '';
        return;
    }

    const trimmed = newCategory.trim();

    // Evita duplicados sin importar mayúsculas/minúsculas (JS vs js vs Js)
    const alreadyExists = categories.some(cat => cat.toLowerCase() === trimmed.toLowerCase());
    if (alreadyExists) {
        alert('Esa categoría ya existe.');
        select.value = '';
        return;
    }

    categories.push(trimmed);

    // Vuelve a construir el select con la nueva categoría ya seleccionada
    select.outerHTML = renderCategorySelect(selectId, trimmed);
};

// ===== TAB: BANCO DE PREGUNTAS (consultar, crear, editar, activar/desactivar) =====

function renderQuestionBankTab() {
    return `
        <div class="flex flex-col gap-6 pt-4">

            ${card({
                className: 'p-6 flex flex-col gap-4',
                width: 'w-full',
                content: `
                    <span class="text-lg font-bold">Crear nueva pregunta</span>
                    <div class="flex flex-col gap-3">
                        <input id="new-question-text" type="text" placeholder="Texto de la pregunta"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                        
                        <div class="flex flex-col md:flex-row gap-3">
                            ${renderCategorySelect('new-question-category')}
                            <select id="new-question-difficulty"
                                class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                                <option value="facil">Fácil</option>
                                <option value="medio" selected>Medio</option>
                                <option value="dificil">Difícil</option>
                            </select>
                        </div>

                        <button onclick="createQuestion()" 
                            class=" w-40 bg-[#4B3FA8] text-white font-bold py-2.5 rounded-xl transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95">
                            Crear pregunta
                        </button>
                    </div>
                `
            })}

            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <span class="text-lg font-bold">Preguntas registradas</span>
                    <span class="text-sm text-gray-400">${questions.length} en total</span>
                </div>

                <div class="flex flex-col gap-3">
                    ${questions.map(q => renderQuestionItem(q)).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderQuestionItem(q) {
    const isEditing = editingQuestionId === q.id;

    if (isEditing) {
        return `
            <div class="border border-[#4B3FA8] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                <input id="edit-text-${q.id}" type="text" value="${q.text}"
                    class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                
                <div class="flex flex-col md:flex-row gap-3">
                    ${renderCategorySelect(`edit-category-${q.id}`, q.category)}
                    <select id="edit-difficulty-${q.id}"
                        class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                        <option value="facil" ${q.difficulty === 'facil' ? 'selected' : ''}>Fácil</option>
                        <option value="medio" ${q.difficulty === 'medio' ? 'selected' : ''}>Medio</option>
                        <option value="dificil" ${q.difficulty === 'dificil' ? 'selected' : ''}>Difícil</option>
                    </select>
                </div>

                <div class="flex gap-2 justify-end">
                    <button onclick="cancelEditQuestion()" 
                        class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all duration-200">
                        Cancelar
                    </button>
                    <button onclick="saveQuestion('${q.id}')" 
                        class="px-4 py-2 rounded-xl text-sm font-semibold bg-[#4B3FA8] text-white hover:bg-pink-600 transition-all duration-200">
                        Guardar
                    </button>
                </div>
            </div>
        `;
    }

    return `
        <div class="flex items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm ${q.active ? '' : 'opacity-50'}">
            <div class="flex flex-col gap-1 flex-1">
                <span class="font-semibold text-sm">${q.text}</span>
                <div class="flex gap-2">
                    <span class="text-xs bg-[#F3F1FA] text-[#4B3FA8] font-semibold px-3 py-0.5 rounded-full">${q.category}</span>
                    <span class="text-xs ${difficultyColor(q.difficulty)} font-semibold px-3 py-0.5 rounded-full">${difficultyLabel(q.difficulty)}</span>
                    <span class="text-xs ${q.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'} font-semibold px-3 py-0.5 rounded-full">
                        ${q.active ? 'Activa' : 'Inactiva'}
                    </span>
                </div>
            </div>

            <div class="flex items-center gap-2 ml-4">
                <button onclick="editQuestion('${q.id}')" 
                    class="text-xs font-semibold text-[#4B3FA8] hover:underline">
                    Editar
                </button>
                <button onclick="toggleQuestionActive('${q.id}')" 
                    class="text-xs font-semibold ${q.active ? 'text-amber-500' : 'text-emerald-500'} hover:underline">
                    ${q.active ? 'Desactivar' : 'Activar'}
                </button>
                <button onclick="deleteQuestion('${q.id}')" 
                    class="text-xs font-semibold text-red-500 hover:underline">
                    Eliminar
                </button>
            </div>
        </div>
    `;
}

function difficultyColor(difficulty) {
    if (difficulty === 'facil') return 'bg-emerald-100 text-emerald-600';
    if (difficulty === 'medio') return 'bg-amber-100 text-amber-600';
    return 'bg-red-100 text-red-600';
}

function difficultyLabel(difficulty) {
    if (difficulty === 'facil') return 'Fácil';
    if (difficulty === 'medio') return 'Medio';
    return 'Difícil';
}

window.createQuestion = function () {
    const text = document.getElementById('new-question-text').value.trim();
    const category = document.getElementById('new-question-category').value;
    const difficulty = document.getElementById('new-question-difficulty').value;

    if (!text || !category) return alert('Completa el texto y selecciona una categoría.');

    questions.push({
        id: 'q' + (questions.length + 1) + '-' + Date.now(),
        text,
        category,
        difficulty,
        active: true
    });

    document.getElementById('tab-content').innerHTML = renderTabContent();
};

window.editQuestion = function (id) {
    editingQuestionId = id;
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

window.cancelEditQuestion = function () {
    editingQuestionId = null;
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

window.saveQuestion = function (id) {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    question.text = document.getElementById(`edit-text-${id}`).value.trim();
    question.category = document.getElementById(`edit-category-${id}`).value;
    question.difficulty = document.getElementById(`edit-difficulty-${id}`).value;

    editingQuestionId = null;
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

window.toggleQuestionActive = function (id) {
    const question = questions.find(q => q.id === id);
    if (!question) return;
    question.active = !question.active;
    document.getElementById('tab-content').innerHTML = renderTabContent();
};

window.deleteQuestion = async function (id) {
    // Reemplazo de confirm por el diálogo estético de SweetAlert2
    const result = await Swal.fire({
        title: '¿Seguro que quieres eliminar esta pregunta?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4B3FA8', // Rojo para acciones destructivas
        cancelButtonColor: '#F6339A',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    // Si el usuario cancela o cierra el modal, salimos de la función
    if (!result.isConfirmed) return;

    // Tu lógica original de filtrado y renderizado
    questions = questions.filter(q => q.id !== id);
    document.getElementById('tab-content').innerHTML = renderTabContent();

    // OPCIONAL: Alerta rápida de éxito que desaparece sola
    Swal.fire({
        icon: 'success',
        title: 'Eliminada',
        text: 'La pregunta ha sido eliminada.',
        timer: 1500,
        showConfirmButton: false
    });
};

// ===== TAB: CONFIGURACIÓN DEL ASSESSMENT (consultar y actualizar) =====

function renderConfigTab() {
    return `
        <div class="flex flex-col gap-6 pt-4 gap-4">
            ${card({
                className: 'p-6 flex flex-col gap-5',
                width: 'w-full max-w-2xl',
                content: `
                <div class="flex flex-col gap-4">
                    <span class="text-lg font-bold">Configuración general del Assessment</span>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Número de preguntas por prueba</label>
                        <input id="config-question-count" type="number" min="1" value="${assessmentConfig.questionCount}"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Tiempo límite (minutos)</label>
                        <input id="config-time-limit" type="number" min="1" value="${assessmentConfig.timeLimit}"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Puntaje mínimo para aprobar (%)</label>
                        <input id="config-passing-score" type="number" min="0" max="100" value="${assessmentConfig.passingScore}"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Distribución de dificultad</label>
                        <select id="config-difficulty-mix"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                            <option value="balanceada" ${assessmentConfig.difficultyMix === 'balanceada' ? 'selected' : ''}>Balanceada</option>
                            <option value="facil" ${assessmentConfig.difficultyMix === 'facil' ? 'selected' : ''}>Mayormente fácil</option>
                            <option value="dificil" ${assessmentConfig.difficultyMix === 'dificil' ? 'selected' : ''}>Mayormente difícil</option>
                        </select>
                    </div>

                    <div id="config-saved-msg" class="hidden bg-emerald-50 text-emerald-600 text-sm font-semibold px-4 py-2.5 rounded-xl"></div>

                    <button onclick="saveAssessmentConfig()" 
                        class=" p-4 bg-[#4B3FA8] text-white font-bold py-2.5 rounded-xl transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95">
                        Guardar configuración
                    </button>
                </div>
                `
            })}
        </div>
    `;
}

window.saveAssessmentConfig = function () {
    assessmentConfig.questionCount = parseInt(document.getElementById('config-question-count').value) || 10;
    assessmentConfig.timeLimit = parseInt(document.getElementById('config-time-limit').value) || 60;
    assessmentConfig.passingScore = parseInt(document.getElementById('config-passing-score').value) || 70;
    assessmentConfig.difficultyMix = document.getElementById('config-difficulty-mix').value;

    const msg = document.getElementById('config-saved-msg');
    msg.textContent = 'Configuración guardada correctamente.';
    msg.classList.remove('hidden');

    setTimeout(() => msg.classList.add('hidden'), 3000);
};
