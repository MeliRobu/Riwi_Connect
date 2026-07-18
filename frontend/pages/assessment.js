import { progressBar } from "../components/progress_bar";
import Swal from 'sweetalert2';

let currentQuestionIndex = 0;
let userAnswers = {}; // { id_question: id_answer_option }
let questions = [];
let loadError = null;

async function loadQuestions() {
    try {
        const response = await fetch('/assessments');
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            loadError = data.error || 'No se pudo cargar el Assessment.';
            return;
        }
        questions = await response.json();
    } catch (error) {
        console.error('Error cargando el Assessment:', error);
        loadError = 'No se pudo conectar con el servidor.';
    }
}

async function initAssessmentPage() {
    await loadQuestions();
    const container = document.getElementById('assessment-root');
    if (container) container.innerHTML = renderRoot();
}

function getProgressValue() {
    if (questions.length === 0) return '0';
    return Math.round((currentQuestionIndex / questions.length) * 100).toString();
}

export function assessment() {
    setTimeout(() => { initAssessmentPage(); }, 0);
    return `
    <div id="assessment-root" class="m-10 p-2 flex flex-col gap-2">
        <span class="text-3xl font-bold">Assessment técnico</span>
        <div class="text-center text-gray-400 text-sm py-20">Cargando preguntas...</div>
    </div>
    `;
}

function renderRoot() {
    if (loadError) {
        return `
            <span class="text-3xl font-bold">Assessment técnico</span>
            <div class="text-center text-gray-500 text-sm py-10 border border-dashed border-gray-200 rounded-xl mt-4">
                ${loadError}
            </div>
        `;
    }
    if (questions.length === 0) {
        return `
            <span class="text-3xl font-bold">Assessment técnico</span>
            <div class="text-center text-gray-500 text-sm py-10 border border-dashed border-gray-200 rounded-xl mt-4">
                No hay preguntas disponibles en este momento.
            </div>
        `;
    }
    return `
        <span class="text-3xl font-bold">Assessment técnico</span>
        <span>Responde cada pregunta con cuidado. Sólo serás capaz de presentar esta prueba una vez</span>
        <div id="progress-bar-container">
            ${progressBar({ value: getProgressValue(), size: 'w-full h-3' })}
        </div>
        <div id="question-container" class="mt-6">
            ${renderQuestion()}
        </div>
    `;
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    const isLast = currentQuestionIndex === questions.length - 1;
    const isFirst = currentQuestionIndex === 0;
    const selectedAnswer = userAnswers[question.id_question];

    return `
        <div class="flex flex-col gap-4">
            <span class="text-xs font-semibold text-gray-400">Pregunta ${currentQuestionIndex + 1} de ${questions.length}</span>
            <span class="text-xl font-bold">${question.statement}</span>
            <div class="flex flex-col gap-3 mt-2">
                ${question.options.map(opt => {
                    const isChecked = selectedAnswer === opt.id_answer_option;
                    return `
                    <label class="flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${isChecked ? 'border-[#4B3FA8] bg-[#F3F1FA] shadow-sm ring-1 ring-[#4B3FA8]/20' : 'border-gray-200 hover:bg-[#F3F1FA]'}">
                        <input 
                            type="radio" 
                            name="question-${question.id_question}" 
                            value="${opt.id_answer_option}"
                            ${isChecked ? 'checked' : ''}
                            onchange="handleAnswerChange(${question.id_question}, ${opt.id_answer_option})"
                            class="w-4 h-4 accent-[#4B3FA8]"
                        >
                        <span class="text-sm font-medium ${isChecked ? 'text-[#4B3FA8] font-semibold' : 'text-gray-700'}">${opt.content}</span>
                    </label>
                    `;
                }).join('')}
            </div>
            <div class="flex justify-between mt-6">
                <button 
                    onclick="goToPreviousQuestion()"
                    class=" cursor-pointer px-6 py-2.5 rounded-xl font-bold border border-gray-200 text-gray-500 transition-all duration-300 hover:bg-gray-100 ${isFirst ? 'opacity-0 pointer-events-none' : ''}"
                >
                    Anterior
                </button>
                <button 
                    onclick="${isLast ? 'submitAssessment()' : 'goToNextQuestion()'}"
                    class="cursor-pointer px-6 py-2.5 rounded-xl font-bold bg-[#4B3FA8] text-white transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95"
                >
                    ${isLast ? 'Finalizar' : 'Siguiente'}
                </button>
            </div>
        </div>
    `;
}

window.handleAnswerChange = function(questionId, optionId) {
    userAnswers[questionId] = optionId;
    rerenderQuestion();
};

window.goToNextQuestion = function() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        rerenderQuestion();
    }
};

window.goToPreviousQuestion = function() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        rerenderQuestion();
    }
};

function rerenderQuestion() {
    const questionContainer = document.getElementById('question-container');
    const progressBarContainer = document.getElementById('progress-bar-container');
    if (questionContainer) questionContainer.innerHTML = renderQuestion();
    if (progressBarContainer) {
        progressBarContainer.innerHTML = progressBar({ value: getProgressValue(), size: 'w-full h-3' });
    }
}

window.submitAssessment = async function() {
    const unanswered = questions.filter(q => userAnswers[q.id_question] === undefined);
    if (unanswered.length > 0) {
        Swal.fire({
            title: 'Preguntas sin responder',
            text: `Te faltan ${unanswered.length} pregunta(s) por responder.`,
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#4B3FA8'
        });
        return;
    }

    const answers = questions.map(q => ({
        question_id: q.id_question,
        answer_option_id: userAnswers[q.id_question]
    }));

    try {
        const response = await fetch('/assessments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers })
        });
        const data = await response.json();
        if (!response.ok) {
            Swal.fire({
                title: 'No se pudo enviar el Assessment',
                text: data.error || 'Ocurrió un error inesperado.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4B3FA8'
            });
            return;
        }
        Swal.fire({
            title: '¡Assessment completado!',
            text: 'Tu evaluación ha sido enviada correctamente. Ahora serás redirigido a tu perfil.',
            icon: 'success',
            confirmButtonText: 'Ver perfil',
            confirmButtonColor: '#4B3FA8'
        }).then(() => {
            window.location.hash = '#/profile';
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