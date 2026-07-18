import { card } from "../components/card";
import { progressBar } from "../components/progress_bar";

const TECH_LABELS = {
    python_score: "Python",
    sql_score: "SQL",
    javascript_score: "JavaScript",
    html_score: "HTML",
    css_score: "CSS",
};

async function loadProfileData() {
    const [profileRes, resultRes] = await Promise.all([
        fetch('/users/profile'),
        fetch('/assessments/result')
    ]);

    const profile = profileRes.ok ? await profileRes.json() : null;
    const result = resultRes.ok ? await resultRes.json() : null;

    return { profile, result };
}

function renderProfile(profile, result) {
    const name = profile?.full_name || 'Usuario';
    const image = profile?.profile_image ? `/${profile.profile_image}` : './assets/default-profile.png';
    const campus = profile?.campus_name || '';
    const journey = profile?.journey_time || '';
    const clan = profile?.clan_name || '';

    const overallScore = result ? Math.round(result.overall_score) : null;
    const techScores = result
        ? Object.keys(TECH_LABELS).map(key => ({
            name: TECH_LABELS[key],
            score: Math.round(result[key])
        }))
        : [];

    const strengths = result?.strengths;
    const improvements = result?.improvement_opportunities;
    const interpretation = result?.profile_description;
    const isGeneratingInterpretation = result && !interpretation;

    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6 pt-6">
            <img 
                src="${image}" 
                alt="${name}" 
                class="w-32 h-32 rounded-full object-cover border-4 border-[#4B3FA8] shadow-md"
            >
            <div class="flex flex-col gap-2 text-center md:text-left">
                <span class="text-3xl font-bold">${name}</span>
                <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                    ${campus ? `<span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-semibold px-4 py-1.5 rounded-full">${campus}</span>` : ''}
                    ${journey ? `<span class="bg-[#F3F1FA] text-[#4B3FA8] text-sm font-semibold px-4 py-1.5 rounded-full">${journey}</span>` : ''}
                    ${clan ? `<span class="bg-pink-100 text-pink-600 text-sm font-semibold px-4 py-1.5 rounded-full">${clan}</span>` : ''}
                </div>
            </div>
        </div>

        ${!result ? emptyState('Aún no has completado tu Assessment técnico. Ve a la sección Assessment para conocer tu perfil.') : `
        <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div class="md:col-span-3">
                ${card({
                    className: 'flex flex-col items-center justify-center gap-2 py-8 bg-white p-6 rounded-lg shadow',
                    width: 'w-full',
                    content: `
                        <span class="text-sm font-semibold text-gray-400">Puntaje General</span>
                        <span class="text-8xl font-black text-[#4B3FA8]">${overallScore}</span>
                        <span class="text-sm text-gray-400 mb-4">/ 100</span>
                    `
                })}
            </div>
            <div class="md:col-span-3">
                ${card({
                    className: 'flex flex-col gap-4 p-6',
                    width: 'w-full',
                    content: `
                        <span class="text-lg font-bold mb-2">Puntajes por tecnología</span>
                        ${techScores.map(tech => `
                            <div class="flex flex-col gap-1">
                                <div class="flex justify-between text-sm">
                                    <span class="font-semibold text-gray-600">${tech.name}</span>
                                    <span class="font-bold text-[#4B3FA8]">${tech.score}%</span>
                                </div>
                                ${progressBar({
                                    value: tech.score.toString(),
                                    size: 'w-full h-2'
                                })}
                            </div>
                        `).join('')}
                    `
                })}
            </div>
        </div>

        ${isGeneratingInterpretation ? `
        <div class="text-center text-gray-400 text-sm py-6 border border-dashed border-gray-200 rounded-xl">
            Tu Smart Professional Profile se está generando. Vuelve a consultar en unos momentos.
        </div>
        ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${card({
                className: 'p-6 flex flex-col gap-3',
                width: 'w-full',
                content: `
                    <span class="text-lg font-bold text-emerald-600">Fortalezas</span>
                    <p class="text-sm text-gray-600 leading-relaxed">${strengths}</p>
                `
            })}
            ${card({
                className: 'p-6 flex flex-col gap-3',
                width: 'w-full',
                content: `
                    <span class="text-lg font-bold text-amber-600">Oportunidades de mejora</span>
                    <p class="text-sm text-gray-600 leading-relaxed">${improvements}</p>
                `
            })}
        </div>
        ${card({
            className: 'p-6 flex flex-col gap-3',
            width: 'w-full',
            content: `
                <span class="text-lg font-bold text-[#4B3FA8]">Interpretación IA</span>
                <p class="text-sm text-gray-600 leading-relaxed">${interpretation}</p>
            `
        })}
        `}
        `}
    </main>
    `;
}

function emptyState(message) {
    return `<div class="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">${message}</div>`;
}

async function initSmartProfilePage() {
    const { profile, result } = await loadProfileData();
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = renderProfile(profile, result);
    }
}

export function smart_profile() {
    setTimeout(() => { initSmartProfilePage(); }, 0);
    return `
    <main class="flex flex-col gap-6 px-5 pb-10 h-screen overflow-y-auto">
        <div class="text-center text-gray-400 text-sm py-20">Cargando tu perfil...</div>
    </main>
    `;
}