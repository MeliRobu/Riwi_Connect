import { card } from "../../components/card";
import Swal from "sweetalert2";

// Categorias fijas del sistema (RN-010, DT-003): no son un catalogo abierto,
// el motor de compatibilidad y los puntajes del Assessment estan construidos
// especificamente alrededor de estas 5 tecnologias, ninguna mas.
const CATEGORIES = ["PYTHON", "HTML", "CSS", "JAVASCRIPT", "SQL"];
const CATEGORY_LABELS = { PYTHON: "Python", HTML: "HTML", CSS: "CSS", JAVASCRIPT: "JavaScript", SQL: "SQL" };

// Los valores reales en la base de datos son EASY/MEDIUM/HARD (DT-003);
// solo las etiquetas visibles se traducen a Basico/Intermedio/Avanzado.
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const DIFFICULTY_LABELS = { EASY: "Básico", MEDIUM: "Intermedio", HARD: "Avanzado" };
const DIFFICULTY_COLORS = { EASY: "bg-emerald-100 text-emerald-600", MEDIUM: "bg-amber-100 text-amber-600", HARD: "bg-red-100 text-red-600" };

let questions = [];
let questionsLoaded = false;
let assessmentConfig = null;
let configLoaded = false;

let activeTab = "banco";
let editingQuestionId = null;

// VISTA PRINCIPAL

export function question_bank() {
    activeTab = "banco";
    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div class="flex flex-col gap-1 pt-6">
            <span class="text-3xl font-bold">Banco de preguntas</span>
            <span class="text-gray-500 text-sm">Crea, edita, activa o desactiva preguntas, y configura las pruebas técnicas</span>
        </div>

        <div id="tabs-nav" class="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px min-h-12">
            ${renderTabButton("banco", "Banco de preguntas")}
            ${renderTabButton("config", "Configuración del Assessment")}
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
                    ? "border-[#4B3FA8] text-[#4B3FA8]"
                    : "border-transparent text-gray-400 hover:text-[#4B3FA8]"
            }"
        >
            ${label}
        </button>
    `;
}

window.switchQBTab = function (tabId) {
    activeTab = tabId;
    editingQuestionId = null;
    document.getElementById("tabs-nav").outerHTML = `
        <div id="tabs-nav" class="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px min-h-12">
            ${renderTabButton("banco", "Banco de preguntas")}
            ${renderTabButton("config", "Configuración del Assessment")}
        </div>
    `;
    document.getElementById("tab-content").innerHTML = renderTabContent();
};

function renderTabContent() {
    switch (activeTab) {
        case "banco": return renderQuestionBankTab();
        case "config": return renderConfigTab();
        default: return "";
    }
}

// Escapa caracteres HTML para que el texto de una pregunta u opcion nunca
// se interprete como una etiqueta real (por ejemplo, una pregunta que
// pregunte literalmente por la etiqueta <head> rompia toda la pagina).
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

// Ordena siempre en el mismo orden fijo: por tecnologia (Python, HTML, CSS,
// JavaScript, SQL) y dentro de cada una por nivel (Basico, Intermedio, Avanzado),
// sin importar el orden en que se hayan creado las preguntas.
function getSortedQuestions() {
    return [...questions].sort((a, b) => {
        const catDiff = CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category);
        if (catDiff !== 0) return catDiff;
        return DIFFICULTIES.indexOf(a.difficulty_level) - DIFFICULTIES.indexOf(b.difficulty_level);
    });
}

function emptyState(message) {
    return `<div class="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">${message}</div>`;
}

// CARGA DE DATOS REALES

async function loadQuestions() {
    try {
        const response = await fetch("/admin/questions");
        questions = response.ok ? await response.json() : [];
    } catch (error) {
        console.error("Error cargando preguntas:", error);
        questions = [];
    }
    questionsLoaded = true;
}

async function loadAssessmentConfig() {
    try {
        const response = await fetch("/admin/assessment/configuration");
        assessmentConfig = response.ok ? await response.json() : null;
    } catch (error) {
        console.error("Error cargando configuración:", error);
        assessmentConfig = null;
    }
    configLoaded = true;
}

// SELECTORES REUTILIZABLES

function renderCategorySelect(id, selectedValue = "") {
    return `
        <select id="${id}"
            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
            <option value="" disabled ${!selectedValue ? "selected" : ""}>Selecciona una categoría</option>
            ${CATEGORIES.map(cat => `
                <option value="${cat}" ${cat === selectedValue ? "selected" : ""}>${CATEGORY_LABELS[cat]}</option>
            `).join("")}
        </select>
    `;
}

function renderDifficultySelect(id, selectedValue = "MEDIUM") {
    return `
        <select id="${id}"
            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
            ${DIFFICULTIES.map(level => `
                <option value="${level}" ${level === selectedValue ? "selected" : ""}>${DIFFICULTY_LABELS[level]}</option>
            `).join("")}
        </select>
    `;
}

// 4 opciones de respuesta + radio para marcar la unica correcta (RN-008)
function renderAnswerOptionsInputs(namePrefix, existingOptions = null) {
    const opts = existingOptions || [
        { content: "", is_correct: true },
        { content: "", is_correct: false },
        { content: "", is_correct: false },
        { content: "", is_correct: false },
    ];
    return `
        <div class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-gray-600">Opciones de respuesta (marca la correcta)</span>
            ${opts.map((opt, i) => `
                <div class="flex items-center gap-2">
                    <input type="radio" name="${namePrefix}-correct" value="${i}" ${opt.is_correct ? "checked" : ""}
                        class="accent-[#4B3FA8] shrink-0">
                    <input id="${namePrefix}-option-${i}" type="text" value="${escapeHtml(opt.content || "")}" placeholder="Opción ${i + 1}"
                        class="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                    <input id="${namePrefix}-option-${i}-id" type="hidden" value="${opt.id_answer_option || ''}">
                </div>
            `).join("")}
        </div>
    `;
}

function readAnswerOptionsFromForm(namePrefix) {
    const correctRadio = document.querySelector(`input[name="${namePrefix}-correct"]:checked`);
    const correctIndex = correctRadio ? parseInt(correctRadio.value) : -1;
    const options = [];
    for (let i = 0; i < 4; i++) {
        const content = document.getElementById(`${namePrefix}-option-${i}`).value.trim();
        const option = { content, is_correct: i === correctIndex };
        // HU: (vacío documental) — Al editar una pregunta existente, cada opción
        // debe conservar su id_answer_option original para que el backend sepa
        // qué fila actualizar (antes se perdía por completo al leer el formulario,
        // causando un 500 KeyError en update_answer_options()).
        const idField = document.getElementById(`${namePrefix}-option-${i}-id`);
        if (idField && idField.value) {
            option.id_answer_option = parseInt(idField.value, 10);
        }
        options.push(option);
    }
    return options;
}

// TAB: BANCO DE PREGUNTAS

function renderQuestionBankTab() {
    if (!questionsLoaded) {
        loadQuestions().then(() => {
            if (activeTab === "banco") document.getElementById("tab-content").innerHTML = renderTabContent();
        });
        return emptyState("Cargando preguntas...");
    }
    return `
        <div class="flex flex-col gap-6 pt-4">
            ${card({
                className: "p-6 flex flex-col gap-4",
                width: "w-full",
                content: `
                    <details>
                        <summary class="cursor-pointer text-lg font-bold select-none">Crear nueva pregunta</summary>
                        <div class="flex flex-col gap-3 mt-4">
                            <input id="new-question-text" type="text" placeholder="Texto de la pregunta"
                                class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">

                            <div class="flex flex-col md:flex-row gap-3">
                                ${renderCategorySelect("new-question-category")}
                                ${renderDifficultySelect("new-question-difficulty")}
                            </div>

                            ${renderAnswerOptionsInputs("new-question")}

                            <button onclick="createQuestion()" ${questions.length >= 500 ? "disabled" : ""}
                                class="w-40 font-bold py-2.5 rounded-xl transition-all duration-300 ${questions.length >= 500 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'cursor-pointer bg-[#4B3FA8] text-white hover:bg-pink-600 hover:scale-[1.02] active:scale-95'}">
                                ${questions.length >= 500 ? "Límite alcanzado" : "Crear pregunta"}
                            </button>
                        </div>
                    </details>
                `
            })}

            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <span class="text-lg font-bold">Preguntas registradas</span>
                    <span class="text-sm text-gray-400">${questions.length} / 500 en total</span>
                </div>

                <div class="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                    ${questions.length === 0 ? emptyState("No hay preguntas registradas todavía.") : getSortedQuestions().map(q => renderQuestionItem(q)).join("")}
                </div>
            </div>
        </div>
    `;
}

function renderQuestionItem(q) {
    const isEditing = editingQuestionId === q.id_question;
    const isActive = q.status === "ACTIVE";

    if (isEditing) {
        const prefix = `edit-${q.id_question}`;
        return `
            <div class="border border-[#4B3FA8] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                <input id="${prefix}-text" type="text" value="${escapeHtml(q.statement)}"
                    class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">

                <div class="flex flex-col md:flex-row gap-3">
                    ${renderCategorySelect(`${prefix}-category`, q.category)}
                    ${renderDifficultySelect(`${prefix}-difficulty`, q.difficulty_level)}
                </div>

                ${renderAnswerOptionsInputs(prefix, q.answer_options)}

                <div class="flex gap-2 justify-end">
                    <button onclick="cancelEditQuestion()"
                        class="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all duration-200">
                        Cancelar
                    </button>
                    <button onclick="saveQuestion(${q.id_question})"
                        class="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold bg-[#4B3FA8] text-white hover:bg-pink-600 transition-all duration-200">
                        Guardar
                    </button>
                </div>
            </div>
        `;
    }

    return `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 rounded-xl p-4 shadow-sm ${isActive ? "" : "opacity-50"}">
            <div class="flex flex-col gap-1 flex-1 min-w-0">
                <span class="font-semibold text-sm break-words">${escapeHtml(q.statement)}</span>
                <div class="flex flex-wrap gap-2">
                    <span class="text-xs bg-[#F3F1FA] text-[#4B3FA8] font-semibold px-3 py-0.5 rounded-full">${CATEGORY_LABELS[q.category] || q.category}</span>
                    <span class="text-xs ${DIFFICULTY_COLORS[q.difficulty_level] || ""} font-semibold px-3 py-0.5 rounded-full">${DIFFICULTY_LABELS[q.difficulty_level] || q.difficulty_level}</span>
                    <span class="text-xs ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"} font-semibold px-3 py-0.5 rounded-full">
                        ${isActive ? "Activa" : "Inactiva"}
                    </span>
                </div>
            </div>

            <div class="flex items-center gap-2 sm:ml-4">
                <button onclick="editQuestion(${q.id_question})"
                    class="cursor-pointer text-xs font-semibold text-[#4B3FA8] hover:underline">
                    Editar
                </button>
                <button onclick="toggleQuestionActive(${q.id_question}, '${q.status}')"
                    class="cursor-pointer text-xs font-semibold ${isActive ? "text-amber-500" : "text-emerald-500"} hover:underline">
                    ${isActive ? "Desactivar" : "Activar"}
                </button>
                ${!isActive ? `
                <button onclick="deleteQuestion(${q.id_question})"
                    class="cursor-pointer text-xs font-semibold text-red-500 hover:underline">
                    Eliminar
                </button>
                ` : ''}
            </div>
        </div>
    `;
}

window.createQuestion = async function () {
    const statement = document.getElementById("new-question-text").value.trim();
    const category = document.getElementById("new-question-category").value;
    const difficulty_level = document.getElementById("new-question-difficulty").value;
    const answer_options = readAnswerOptionsFromForm("new-question");

    if (!statement || !category) {
        Swal.fire({ title: "Completa los campos", text: "Escribe el texto y selecciona una categoría.", icon: "warning", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
        return;
    }
    if (answer_options.some(o => !o.content)) {
        Swal.fire({ title: "Completa las 4 opciones", text: "Ninguna opción de respuesta puede quedar vacía.", icon: "warning", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
        return;
    }
    if (!answer_options.some(o => o.is_correct)) {
        Swal.fire({ title: "Marca la respuesta correcta", text: "Selecciona cuál de las 4 opciones es la correcta.", icon: "warning", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
        return;
    }

    try {
        const response = await fetch("/admin/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ statement, category, difficulty_level, answer_options })
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: "No se pudo crear la pregunta", text: data.error || "Ocurrió un error inesperado.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
            return;
        }
        questionsLoaded = false;
        document.getElementById("tab-content").innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: "Error de conexión", text: "No se pudo conectar con el servidor.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
    }
};

window.editQuestion = function (id) {
    editingQuestionId = id;
    document.getElementById("tab-content").innerHTML = renderTabContent();
};

window.cancelEditQuestion = function () {
    editingQuestionId = null;
    document.getElementById("tab-content").innerHTML = renderTabContent();
};

window.saveQuestion = async function (id) {
    const prefix = `edit-${id}`;
    const statement = document.getElementById(`${prefix}-text`).value.trim();
    const category = document.getElementById(`${prefix}-category`).value;
    const difficulty_level = document.getElementById(`${prefix}-difficulty`).value;
    const answer_options = readAnswerOptionsFromForm(prefix);

    if (answer_options.some(o => !o.content)) {
        Swal.fire({ title: "Completa las 4 opciones", text: "Ninguna opción de respuesta puede quedar vacía.", icon: "warning", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
        return;
    }
    if (!answer_options.some(o => o.is_correct)) {
        Swal.fire({ title: "Marca la respuesta correcta", text: "Selecciona cuál de las 4 opciones es la correcta.", icon: "warning", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
        return;
    }

    try {
        const response = await fetch(`/admin/questions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ statement, category, difficulty_level, answer_options })
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: "No se pudo guardar", text: data.error || "Ocurrió un error inesperado.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
            return;
        }
        editingQuestionId = null;
        questionsLoaded = false;
        document.getElementById("tab-content").innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: "Error de conexión", text: "No se pudo conectar con el servidor.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
    }
};

window.toggleQuestionActive = async function (id, currentStatus) {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
        const response = await fetch(`/admin/questions/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: "No se pudo actualizar el estado", text: data.error || "Ocurrió un error inesperado.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
            return;
        }
        questionsLoaded = false;
        document.getElementById("tab-content").innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: "Error de conexión", text: "No se pudo conectar con el servidor.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
    }
};

window.deleteQuestion = async function (id) {
    const result = await Swal.fire({
        title: "¿Seguro que quieres eliminar esta pregunta?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4B3FA8",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
        const response = await fetch(`/admin/questions/${id}`, { method: "DELETE" });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: "No se pudo eliminar", text: data.error || "Ocurrió un error inesperado.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
            return;
        }
        questionsLoaded = false;
        document.getElementById("tab-content").innerHTML = renderTabContent();
    } catch (error) {
        console.error(error);
        Swal.fire({ title: "Error de conexión", text: "No se pudo conectar con el servidor.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
    }
};
// TAB: CONFIGURACIÓN DEL ASSESSMENT

function renderConfigTab() {
    if (!configLoaded) {
        loadAssessmentConfig().then(() => {
            if (activeTab === "config") document.getElementById("tab-content").innerHTML = renderTabContent();
        });
        return emptyState("Cargando configuración...");
    }
    if (!assessmentConfig) {
        return emptyState("No se pudo cargar la configuración del Assessment.");
    }
    return `
        <div class="flex flex-col gap-6 pt-4">
            ${card({
                className: "p-6 flex flex-col gap-5",
                width: "w-full max-w-2xl",
                content: `
                <div class="flex flex-col gap-4">
                    <span class="text-lg font-bold">Configuración general del Assessment</span>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Número de preguntas por prueba</label>
                        <input id="config-question-count" type="number" min="1" value="${assessmentConfig.question_count}"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Método de selección de preguntas</label>
                        <select id="config-selection-method"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                            <option value="RANDOM" ${assessmentConfig.selection_method === "RANDOM" ? "selected" : ""}>Aleatorio</option>
                            <option value="FIXED" ${assessmentConfig.selection_method === "FIXED" ? "selected" : ""}>Fijo</option>
                        </select>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Tiempo límite (minutos)</label>
                        <input id="config-time-limit" type="number" min="1" value="${assessmentConfig.time_limit}"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8]">
                        <span class="text-xs text-gray-400">Este valor se guarda, pero todavía no lo aplica ningún temporizador en el MVP actual.</span>
                    </div>

                    <div id="config-saved-msg" class="hidden bg-emerald-50 text-emerald-600 text-sm font-semibold px-4 py-2.5 rounded-xl"></div>

                    <button onclick="saveAssessmentConfig()"
                        class="cursor-pointer p-4 bg-[#4B3FA8] text-white font-bold py-2.5 rounded-xl transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95">
                        Guardar configuración
                    </button>
                </div>
                `
            })}
        </div>
    `;
}

window.saveAssessmentConfig = async function () {
    const question_count = parseInt(document.getElementById("config-question-count").value) || 10;
    const selection_method = document.getElementById("config-selection-method").value;
    const time_limit = parseInt(document.getElementById("config-time-limit").value) || 60;

    try {
        const response = await fetch("/admin/assessment/configuration", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question_count, selection_method, time_limit })
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({ title: "No se pudo guardar", text: data.error || "Ocurrió un error inesperado.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
            return;
        }
        assessmentConfig = data;
        const msg = document.getElementById("config-saved-msg");
        msg.textContent = "Configuración guardada correctamente.";
        msg.classList.remove("hidden");
        setTimeout(() => msg.classList.add("hidden"), 3000);
    } catch (error) {
        console.error(error);
        Swal.fire({ title: "Error de conexión", text: "No se pudo conectar con el servidor.", icon: "error", confirmButtonText: "Entendido", confirmButtonColor: "#4B3FA8" });
    }
};
