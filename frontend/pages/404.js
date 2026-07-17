import '../css/404.css';

export function page404() {
    setTimeout(() => {
        // Efecto parallax hiper-suave
        const blob1 = document.getElementById('blob1');
        const blob2 = document.getElementById('blob2');

        // Suavizado del movimiento
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const mouseMoveHandler = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            targetX = (x - 0.5) * 80; // Aumentada la amplitud
            targetY = (y - 0.5) * 80;
        };

        document.addEventListener('mousemove', mouseMoveHandler);

        // Usar requestAnimationFrame para un movimiento suave (Lerp)
        let animationFrameId;
        function animate() {
            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;

            if (blob1 && blob2) {
                blob1.style.transform = `translate(${currentX}px, ${currentY}px)`;
                blob2.style.transform = `translate(${currentX * -0.6}px, ${currentY * -0.6}px)`;
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        // Cleanup function for SPA router if needed later
        window.cleanup404 = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };

    }, 100);

    return `
    <div class="relative font-sans antialiased bg-[#F8FAFC] text-slate-900 overflow-hidden min-h-[100vh] w-full flex flex-col selection:bg-brand-500/20 selection:text-brand-900">
        <!-- Fondos dinámicos -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <!-- Blobs animados principales -->
            <div id="blob1"
                class="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-brand-400/30 via-indigo-300/30 to-purple-300/30 blur-[100px] animate-pulse-slow transition-transform duration-1000 ease-out">
            </div>
            <div id="blob2"
                class="absolute bottom-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-tr from-violet-400/30 via-fuchsia-300/30 to-pink-300/30 blur-[120px] animate-pulse-slow transition-transform duration-1000 ease-out"
                style="animation-delay: 2s;"></div>

            <!-- Elementos geométricos de fondo -->
            <div
                class="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] rounded-full border border-brand-200/50 animate-spin-slow opacity-50">
            </div>
            <div
                class="absolute bottom-[10%] right-[15%] w-[40vw] h-[40vw] rounded-full border border-indigo-200/40 animate-spin-reverse opacity-50">
            </div>

            <div class="absolute inset-0 dot-grid opacity-50"></div>
            <div class="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
        </div>

        <!-- Decoraciones flotantes (Más elementos y más creativos) -->
        <div class="absolute inset-0 z-10 pointer-events-none overflow-hidden hidden sm:block">
            <!-- Icono: Código -->
            <div
                class="absolute top-[15%] left-[10%] w-14 h-14 glass-card rounded-2xl flex items-center justify-center text-brand-500 animate-float-slow rotate-12">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            </div>

            <!-- Icono: Lupa Rota / Búsqueda -->
            <div class="absolute top-[25%] right-[12%] w-16 h-16 glass-card rounded-full flex items-center justify-center text-rose-500 animate-float-delay -rotate-12"
                style="animation-delay: 1s;">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
            </div>

            <!-- Icono: Brillo / Estrella -->
            <div class="absolute bottom-[30%] left-[8%] w-12 h-12 glass-card rounded-xl flex items-center justify-center text-amber-500 animate-float-fast rotate-45"
                style="animation-delay: 0.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
            </div>

            <!-- Icono: Terminal / Comandos -->
            <div class="absolute bottom-[15%] right-[15%] w-14 h-14 glass-card rounded-2xl flex items-center justify-center text-indigo-500 animate-float-slow -rotate-6"
                style="animation-delay: 2.5s;">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>

            <!-- Elementos abstractos de desenfoque -->
            <div class="absolute top-[45%] left-[20%] w-8 h-8 rounded-full bg-brand-400 blur-md animate-pulse-slow"></div>
            <div class="absolute bottom-[40%] right-[25%] w-6 h-6 rounded-full bg-fuchsia-400 blur-sm animate-bounce-slow"
                style="animation-delay: 1s;"></div>
        </div>

        <!-- Contenido Principal -->
        <main class="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-5 py-10">

            <div class="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full">

                <!-- Textos y Botones (Izquierda en Desktop) -->
                <div class="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-rose-100 shadow-sm mb-8 animate-fade-in-up"
                        style="animation-delay: 100ms;">
                        <span class="relative flex h-2.5 w-2.5">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                        </span>
                        <span class="text-xs font-black uppercase tracking-widest text-rose-600">Error 404</span>
                    </div>

                    <div class="space-y-6 animate-fade-in-up" style="animation-delay: 300ms;">
                        <h1
                            class="text-5xl sm:text-6xl lg:text-[4.5rem] font-black text-slate-900 font-heading tracking-tight leading-[1.05]">
                            Parece que te <br class="hidden sm:block" />has <span class="relative inline-block">
                                <span
                                    class="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 blur-md opacity-15"></span>
                                <span
                                    class="relative text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">perdido</span>
                            </span>
                        </h1>
                        <p class="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                            La página que estás buscando se ha esfumado en el ciberespacio. Puede que haya sido movida,
                            eliminada, o simplemente nunca existió.
                        </p>
                    </div>

                    <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up"
                        style="animation-delay: 500ms;">
                        <a href="#/" data-route="/" onclick="navigate(event, '/')"
                            class="inline-flex items-center justify-center gap-3 bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 text-white no-underline text-[16px] font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_10px_40px_rgba(124,58,237,0.4)] hover:-translate-y-1.5 active:scale-95 group w-full sm:w-auto relative overflow-hidden">
                            <span
                                class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer"></span>
                            <svg class="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al inicio
                        </a>git 
                    </div>
                </div>

                <!-- Número 404 Visual: Diseño ultra-creativo -->
                <div class="relative group w-full max-w-lg lg:w-5/12 flex justify-center order-1 lg:order-2 animate-fade-in-up"
                    style="animation-delay: 200ms;">

                    <!-- Resplandor de fondo interactivo -->
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-brand-500 via-indigo-500 to-fuchsia-500 rounded-[4rem] blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 scale-90">
                    </div>

                    <div class="relative flex items-center justify-center gap-3 sm:gap-6 w-full perspective-[1000px]">

                        <!-- Tarjeta 4 (Izquierda) -->
                        <div
                            class="relative w-28 h-40 sm:w-36 sm:h-52 glass-card rounded-[2rem] flex items-center justify-center transform -rotate-12 translate-y-4 transition-all duration-500 group-hover:-rotate-6 group-hover:translate-y-0 group-hover:scale-105 z-10 animate-float-delay shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <div
                                class="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/40 to-transparent border border-white/60">
                            </div>
                            <span
                                class="text-[6rem] sm:text-[8rem] font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-600 to-indigo-600 drop-shadow-sm">4</span>
                        </div>

                        <!-- Tarjeta 0 (Centro) -->
                        <div
                            class="relative w-32 h-44 sm:w-40 sm:h-56 glass-card rounded-[2.5rem] flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-4 z-20 animate-float shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white/70">
                            <div
                                class="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/60 to-transparent border-[1.5px] border-white/80">
                            </div>

                            <!-- Círculo interior para el 0 (Estilo Radar/Portal) -->
                            <div class="absolute inset-4 rounded-full flex items-center justify-center animate-spin-slow">
                                <div
                                    class="w-2 h-2 bg-brand-500 rounded-full absolute top-0 transform -translate-y-1/2 shadow-[0_0_10px_#8b5cf6]">
                                </div>
                            </div>

                            <span
                                class="text-[7rem] sm:text-[9rem] font-heading font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-600 to-fuchsia-600 drop-shadow-md z-10">0</span>

                            <!-- Badge flotante creativo -->
                            <div
                                class="absolute -top-6 -right-6 bg-gradient-to-r from-brand-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-[0_8px_20px_rgba(124,58,237,0.3)] animate-bounce-slow rotate-12 z-30 border border-white/30 backdrop-blur-md">
                                ¡Oops!
                            </div>
                        </div>

                        <!-- Tarjeta 4 (Derecha) -->
                        <div
                            class="relative w-28 h-40 sm:w-36 sm:h-52 glass-card rounded-[2rem] flex items-center justify-center transform rotate-12 translate-y-4 transition-all duration-500 group-hover:rotate-6 group-hover:translate-y-0 group-hover:scale-105 z-10 animate-float-fast shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <div
                                class="absolute inset-0 rounded-[2rem] bg-gradient-to-bl from-white/40 to-transparent border border-white/60">
                            </div>
                            <span
                                class="text-[6rem] sm:text-[8rem] font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-rose-500 drop-shadow-sm">4</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    `;
}
