import { progressBar } from "../components/progress_bar"
let currentQuestionIndex = 0;
let userAnswers = {}; // { questionId: [respuestas seleccionadas] }
const questions = [
    {
        id: 'q1',
        text: '¿Cuáles de las siguientes son estructuras de datos en JavaScript?',
        type: 'multiple', // multiple = varias respuestas correctas (checkbox)
        options: [
            { id: 'a', text: 'Array' },
            { id: 'b', text: 'Object' },
            { id: 'c', text: 'Function' },
            { id: 'd', text: 'Map' }
        ]
    },
    {
        id: 'q2',
        text: '¿Qué método se usa para agregar un elemento al final de un array?',
        type: 'single', // single = una sola respuesta correcta (radio)
        options: [
            { id: 'a', text: 'push()' },
            { id: 'b', text: 'pop()' },
            { id: 'c', text: 'shift()' },
            { id: 'd', text: 'unshift()' }
        ]
    },
    {
        id: 'q3',
        text: '¿Cuáles son formas válidas de declarar una variable en JS?',
        type: 'multiple',
        options: [
            { id: 'a', text: 'var' },
            { id: 'b', text: 'let' },
            { id: 'c', text: 'const' },
            { id: 'd', text: 'variable' }
        ]
    }
];
function getProgressValue() {
    return Math.round(((currentQuestionIndex) / questions.length) * 100).toString();
}

export function assessment(){
        // Estado del assessment (vive en memoria mientras el usuario hace la prueba)

    
    return `
    </div>    <div class="m-10 p-2 flex flex-col gap-2">
        <span class="text-3xl font-bold">Assessment técnico</span>
        <span>Responde cada pregunta con cuidado. Sólo serás capaz de presentar esta prueba una vez</span>
        
        <div id="progress-bar-container">
            ${progressBar({
                value: getProgressValue(),
                size: 'w-full h-3'
            })}
        </div>

        <div id="question-container" class="mt-6">
            ${renderQuestion()}
        </div>
    </div>
    
    `
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    const isLast = currentQuestionIndex === questions.length - 1;
    const isFirst = currentQuestionIndex === 0;
    const inputType = question.type === 'single' ? 'radio' : 'checkbox';
    const selectedAnswers = userAnswers[question.id] || [];

    return `
        <div class="flex flex-col gap-4">
            <span class="text-xs font-semibold text-gray-400">Pregunta ${currentQuestionIndex + 1} de ${questions.length}</span>
            <span class="text-xl font-bold">${question.text}</span>

            <div class="flex flex-col gap-3 mt-2">
                ${question.options.map(opt => `
                    <label class="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-[#F3F1FA] transition-all duration-200 has-[:checked]:border-[#4B3FA8] has-[:checked]:bg-[#F3F1FA]">
                        <input 
                            type="${inputType}" 
                            name="question-${question.id}" 
                            value="${opt.id}"
                            ${selectedAnswers.includes(opt.id) ? 'checked' : ''}
                            onchange="handleAnswerChange('${question.id}', '${opt.id}', '${question.type}')"
                            class="w-4 h-4 accent-[#4B3FA8]"
                        >
                        <span class="text-sm font-medium">${opt.text}</span>
                    </label>
                `).join('')}
            </div>

            <div class="flex justify-between mt-6">
                <button 
                    onclick="goToPreviousQuestion()"
                    class="px-6 py-2.5 rounded-xl font-bold border border-gray-200 text-gray-500 transition-all duration-300 hover:bg-gray-100 ${isFirst ? 'opacity-0 pointer-events-none' : ''}"
                >
                    Anterior
                </button>

                <button 
                    onclick="${isLast ? 'submitAssessment()' : 'goToNextQuestion()'}"
                    class="px-6 py-2.5 rounded-xl font-bold bg-[#4B3FA8] text-white transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95"
                >
                    ${isLast ? 'Finalizar' : 'Siguiente'}
                </button>
            </div>
        </div>
    `;
}

// Guarda la respuesta seleccionada según el tipo de pregunta
window.handleAnswerChange = function(questionId, optionId, type) {
    if (type === 'single') {
        userAnswers[questionId] = [optionId];
    } else {
        if (!userAnswers[questionId]) userAnswers[questionId] = [];
        const index = userAnswers[questionId].indexOf(optionId);
        if (index > -1) {
            userAnswers[questionId].splice(index, 1); // desmarca
        } else {
            userAnswers[questionId].push(optionId); // marca
        }
    }
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

// Actualiza solo el contenedor de la pregunta y la barra de progreso, sin recargar toda la vista
function rerenderQuestion() {
    document.getElementById('question-container').innerHTML = renderQuestion();
    document.getElementById('progress-bar-container').innerHTML = progressBar({
        value: getProgressValue(),
        size: 'w-full h-3'
    });
}

window.submitAssessment = function() {
    console.log('Respuestas finales:', userAnswers);
    alert('¡Assessment completado! Revisa la consola para ver las respuestas guardadas.');
    // Aquí luego puedes navegar a otra vista o enviar las respuestas a un backend
    // navigate(null, '/dashboard');
};