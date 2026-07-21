import '../css/login-register.css';

export function loginRegister() {
    setTimeout(() => {
        const signUpTriggers = document.querySelectorAll('.trigger-signup');
        const signInTriggers = document.querySelectorAll('.trigger-signin');
        const container = document.getElementById('container');

        if (window.location.hash === '#/register' && container) {
            container.classList.add('right-panel-active');
        }

        signUpTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                container.classList.add('right-panel-active');
                window.history.pushState(null, null, '#/register');
            });
        });

        signInTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                container.classList.remove('right-panel-active');
                window.history.pushState(null, null, '#/login');
            });
        });

        // Initialize particles
        const containerIds = ["codeParticles", "codeParticles-login"];
        const snippets = ["const dev = true;", "import React", "() => {}", "git push", "npm start", "<html>", "SELECT *", "async/await", "flex: 1", "border-radius", "useState()", "fetchData()", "border: none", "return <div>", ".map()", ".filter()", "class Hero", "export default", "Promise.all", "console.log", "try/catch", "useEffect", "npm install", "git commit", "docker build"];
        containerIds.forEach(containerId => {
            const cnt = document.getElementById(containerId);
            if (!cnt) return;
            cnt.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const el = document.createElement("span");
                el.className = "code-particle";
                el.textContent = snippets[Math.floor(Math.random() * snippets.length)];
                el.style.cssText = `left:${Math.random() * 100}%;--dur:${10 + Math.random() * 16}s;--delay:${Math.random() * 10}s;--rot:${(Math.random() - 0.5) * 40}deg;font-size:${0.8 + Math.random() * 0.6}rem;`;
                cnt.appendChild(el);
            }
        });
    }, 100);

    return `
    <!--CONTENEDOR PRINCIPAr-->
    <div class="relative overflow-hidden w-screen h-screen group z-[2] bg-white shadow-[0_8px_40px_rgb(0,0,0,0.04)] m-0 font-sans antialiased text-slate-900 selection:bg-brand-500/20 selection:text-brand-900 absolute top-0 left-0"
        id="container">

        <!--PANEL DE REGISTRO-->
        <div
            class="absolute top-0 h-full left-0 w-full md:w-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform z-[1] opacity-0 translate-x-full md:translate-x-0 group-[.right-panel-active]:translate-x-0 group-[.right-panel-active]:opacity-100 group-[.right-panel-active]:z-[5] md:group-[.right-panel-active]:translate-x-full">
            <form action="#" id="register-form" onsubmit="handleRegisterSubmit(event)"
                class="relative overflow-hidden bg-white flex flex-col items-center justify-center px-12 sm:px-full h-full text-center w-full max-w-full mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <!-- <canvas id="bg-canvas" class="absolute inset-0 w-full h-full pointer-events-none"></canvas> -->
                <div id="codeParticles" class="absolute inset-0 pointer-events-none overflow-hidden"></div>
                <div class="relative z-10 flex flex-col items-center justify-center w-[75%] mx-auto">
                    <p
                        class="text-5xl md:text-7xl font-heading font-black leading-none mb-9 self-start text-left tracking-tight text-slate-900 cursor-pointer" onclick="window.location.hash='#/'">
                        <span
                            class="inline-block bg-gradient-to-br from-brand-600 to-indigo-600 bg-clip-text text-transparent text-6xl md:text-8xl font-black animate-pulse-414 [animation-delay:1.2s]">{</span>onnect
                    </p>
                    <h1 class="font-heading font-bold m-0 self-start text-left text-2xl md:text-4xl text-slate-900">
                        Crear Cuenta</h1>

                    <!-- Enlace visible en móvil y web -->
                    <p class="text-sm font-medium leading-5 mt-2 mb-6 self-start text-left text-slate-500">
                        ¿Ya tienes una cuenta? <a
                            class="text-brand-600 font-bold cursor-pointer transition-colors hover:text-brand-700 trigger-signin">Iniciar
                            Sesión</a>
                    </p>

                    <div id="register-error" class="hidden bg-red-50 text-red-600 text-sm font-semibold px-4 py-2.5 rounded-xl w-full mb-3 text-left"></div>

                    <input type="text" id="register-cc" placeholder="Número de cédula" required
                        class="bg-slate-50 border-2 border-slate-200 py-3 px-5 md:py-3.5 md:px-6 my-2 md:my-2.5 w-full rounded-2xl outline-none transition-all duration-300 focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] text-sm md:text-base font-medium text-slate-700 placeholder-slate-400" />
                    <input type="email" id="register-email" placeholder="Correo electrónico" required
                        class="bg-slate-50 border-2 border-slate-200 py-3 px-5 md:py-3.5 md:px-6 my-2 md:my-2.5 w-full rounded-2xl outline-none transition-all duration-300 focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] text-sm md:text-base font-medium text-slate-700 placeholder-slate-400" />

                    <!-- Contenedor de contraseñas responsivo -->
                    <div class="flex flex-col sm:flex-row gap-2 md:gap-2.5 w-full">
                        <div class="relative w-full flex-1">
                            <input type="password" id="signup-password" placeholder="Contraseña" required
                                class="bg-slate-50 border-2 border-slate-200 py-3 pr-5 pl-12 md:py-3.5 md:pr-6 md:pl-12 my-2 md:my-2.5 w-full rounded-2xl outline-none transition-all duration-300 focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] text-sm md:text-base font-medium text-slate-700 placeholder-slate-400" />
                            <span
                                class="absolute left-[18px] top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer text-sm md:text-base transition-colors duration-300 z-[2] py-2 px-1 hover:text-brand-500"
                                onclick="togglePassword('signup-password', this)">
                                <i class="fas fa-lock"></i>
                            </span>
                        </div>
                        <div class="relative w-full flex-1">
                            <input type="password" id="signup-confirm-password" placeholder="Confirmar" required
                                class="bg-slate-50 border-2 border-slate-200 py-3 pr-5 pl-12 md:py-3.5 md:pr-6 md:pl-12 my-2 md:my-2.5 w-full rounded-2xl outline-none transition-all duration-300 focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] text-sm md:text-base font-medium text-slate-700 placeholder-slate-400" />
                            <span
                                class="absolute left-[18px] top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer text-sm md:text-base transition-colors duration-300 z-[2] py-2 px-1 hover:text-brand-500"
                                onclick="togglePassword('signup-confirm-password', this)">
                                <i class="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    <!-- Input extra solicitado -->
                    
                    <button type="submit"
                        class="mt-4 md:mt-5 rounded-2xl border-none bg-gradient-to-br from-brand-600 to-indigo-600 text-white text-xs md:text-sm font-bold py-3 px-8 md:py-3.5 md:px-[45px] tracking-wide transition-all duration-300 ease-in-out cursor-pointer shadow-[0_8px_20px_rgba(124,58,237,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.35)] hover:from-brand-500 hover:to-indigo-500 active:scale-95 focus:outline-none">Registrarse</button>
                </div>
            </form>
        </div>

        <!--PANEL DE INICIO DE SESIÓN-->
        <div
            class="absolute top-0 h-full left-0 w-full md:w-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform z-[2] group-[.right-panel-active]:-translate-x-full md:group-[.right-panel-active]:translate-x-full group-[.right-panel-active]:opacity-0 md:group-[.right-panel-active]:opacity-100">
            <form action="#" id="login-form" onsubmit="handleLoginSubmit(event)"
                class="relative overflow-hidden bg-white flex flex-col items-center justify-center px-12 sm:px-full h-full text-center w-full max-w-full mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <!-- <canvas id="bg-canvas-login" class="absolute inset-0 w-full h-full pointer-events-none"></canvas> -->
                <div id="codeParticles-login" class="absolute inset-0 pointer-events-none overflow-hidden"></div>
                <div class="relative z-10 flex flex-col items-center justify-center w-[75%] mx-auto">
                    <p
                        class="text-5xl md:text-7xl font-heading font-black leading-none mb-9 self-start text-left tracking-tight text-slate-900 cursor-pointer" onclick="window.location.hash='#/'">
                        <span
                            class="inline-block bg-gradient-to-br from-brand-600 to-indigo-600 bg-clip-text text-transparent text-6xl md:text-8xl font-black animate-pulse-414 [animation-delay:1.2s]">{</span>onnect
                    </p>
                    <h1 class="font-heading font-bold m-0 self-start text-left text-2xl md:text-4xl text-slate-900">
                        Iniciar Sesión</h1>


                    <!-- Enlace visible en móvil y web -->
                    <p class="text-sm font-medium leading-5 mt-2 mb-6 self-start text-left text-slate-500">
                        ¿No te has registrado? <a
                            class="text-brand-600 font-bold cursor-pointer transition-colors hover:text-brand-700 trigger-signup">Registrarse</a>
                    </p>

                    <div id="login-error" class="hidden bg-red-50 text-red-600 text-sm font-semibold px-4 py-2.5 rounded-xl w-full mb-3 text-left"></div>

                    <input type="text" id="login-email" placeholder="Cédula" required
                        class="bg-slate-50 border-2 border-slate-200 py-3 px-5 md:py-3.5 md:px-6 my-2 md:my-2.5 w-full rounded-2xl outline-none transition-all duration-300 focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] text-sm md:text-base font-medium text-slate-700 placeholder-slate-400" />

                    <!-- Campo de contraseña con icono de visibilidad -->
                    <div class="relative w-full">
                        <input type="password" id="signin-password" placeholder="Contraseña" required
                            class="bg-slate-50 border-2 border-slate-200 py-3 pr-5 pl-12 md:py-3.5 md:pr-6 md:pl-12 my-2 md:my-2.5 w-full rounded-2xl outline-none transition-all duration-300 focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] text-sm md:text-base font-medium text-slate-700 placeholder-slate-400" />
                        <span
                            class="absolute left-[18px] top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer text-sm md:text-base transition-colors duration-300 z-[2] py-2 px-1 hover:text-brand-500"
                            onclick="togglePassword('signin-password', this)">
                            <i class="fas fa-lock"></i>
                        </span>
                    </div>


                    <a href="#"
                        class="text-brand-600 text-sm font-medium my-3 md:my-5 transition-colors duration-300 hover:text-brand-700 hover:underline">¿Olvidaste
                        tu contraseña?</a>
                    <button type="submit"
                        class="rounded-2xl border-none bg-gradient-to-br from-brand-600 to-indigo-600 text-white text-xs md:text-sm font-bold py-3 px-8 md:py-3.5 md:px-[45px] tracking-wide md:mb-8 transition-all duration-300 ease-in-out cursor-pointer shadow-[0_8px_20px_rgba(124,58,237,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.35)] hover:from-brand-500 hover:to-indigo-500 active:scale-95 focus:outline-none">Iniciar
                        Sesión</button>
                </div>

            </form>
        </div>

        <!--OVERLAY (Fondo exclusivo para Web "md:", oculto en móvil)-->
        <div
            class="hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-[800ms] ease-in-out z-[100] group-[.right-panel-active]:-translate-x-full">
            <div
                class="bg-gradient-to-br from-brand-700 via-indigo-600 to-brand-800 bg-no-repeat bg-cover relative -left-full h-full w-[200%] translate-x-0 transition-transform duration-[800ms] ease-in-out group-[.right-panel-active]:translate-x-1/2 text-white shadow-[inset_0_0_50px_rgba(0,0,0,0.2)]">

                <!-- Panel izquierdo del overlay -->
                <div
                    class="absolute flex flex-col items-center justify-center px-4 md:px-6 text-center top-0 h-full w-1/2 transition-transform duration-[800ms] ease-in-out -translate-x-[20%] group-[.right-panel-active]:translate-x-0">
                    <div class="w-full h-full flex flex-col items-center justify-center gap-6 p-4 md:p-8">
                        <header class="mb-2">
                            <span
                                class="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-lg">El
                                futuro es hoy</span>
                            <h2
                                class="text-3xl md:text-5xl font-heading font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-3">
                                ¡Únete a la Red!</h2>
                            <p
                                class="text-indigo-100/90 text-sm md:text-base font-medium max-w-[90%] mx-auto leading-relaxed drop-shadow-sm">
                                Descubre proyectos increíbles y equipos que potenciarán tu carrera.</p>
                        </header>
                        <figure class="relative w-full max-w-[400px] group mx-auto" style="perspective: 1000px;">
                            <!-- Glowing blob background -->
                            <div
                                class="absolute inset-0 bg-brand-400/20 blur-[80px] rounded-full scale-75 -z-10 group-hover:bg-brand-400/30 group-hover:scale-90 transition-all duration-700">
                            </div>

                            <div class="relative transform transition-transform duration-700 group-hover:rotate-y-[10deg] group-hover:scale-[1.02] group-hover:-translate-y-2 bg-transparent z-10"
                                style="transform-style: preserve-3d;">
                                <img src="./assets/uno.png" onerror="this.onerror=null; this.style.display='none';" alt="Tech"
                                    class="w-full object-contain aspect-[4/5] bg-transparent drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]" />

                                <!-- Insignia 1: Desarrollador Pro -->
                                <div
                                    class="absolute top-12 -left-4 md:-left-8 bg-white/10 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.3)] animate-float flex items-center gap-2.5 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all">
                                    <div
                                        class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                                        <i class="fas fa-check text-emerald-400 text-[10px]"></i>
                                    </div>
                                    <span class="text-white font-bold text-xs md:text-sm tracking-wide"> ¡Destaca tus habilidades!</span>
                                </div>

                                <!-- Insignia 2: Habilidades -->
                                <div
                                    class="absolute bottom-16 -right-4 md:-right-8 bg-gradient-to-br from-brand-600/90 to-indigo-800/90 backdrop-blur-xl p-3.5 rounded-2xl border border-white/30 text-white shadow-[0_20px_40px_rgba(124,58,237,0.4)] animate-float-delay flex flex-col gap-2 cursor-pointer hover:scale-105 transition-transform min-w-[130px]">
                                    <span
                                        class="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Habilidades</span>
                                    <div class="flex gap-2">
                                        <div
                                            class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
                                            <i class="fab fa-react text-cyan-400"></i>
                                        </div>
                                        <div
                                            class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
                                            <i class="fab fa-node-js text-emerald-400"></i>
                                        </div>
                                        <div
                                            class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
                                            <i class="fab fa-python text-yellow-400"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </figure>
                    </div>
                </div>

                <!-- Panel derecho del overlay -->
                <div
                    class="absolute flex flex-col items-center justify-center px-4 md:px-6 text-center top-0 h-full w-1/2 transition-transform duration-[800ms] ease-in-out right-0 translate-x-0 group-[.right-panel-active]:translate-x-[20%]">
                    <div class="w-full h-full flex flex-col items-center justify-center gap-6 p-4 md:p-8">
                        <header class="mb-2 mt-8 md:mt-12">
                            <span
                                class="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-lg">Tu
                                entorno profesional</span>
                            <h2
                                class="text-3xl md:text-5xl font-heading font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-3">
                                ¡Bienvenido!</h2>
                            <p
                                class="text-indigo-100/90 text-sm md:text-base font-medium max-w-[90%] mx-auto leading-relaxed drop-shadow-sm">
                                Conéctate y sigue construyendo el futuro junto a tu equipo ideal.</p>
                        </header>
                        <figure class="relative w-full max-w-[800px] group mx-auto" style="perspective: 1200px;">
                            <!-- Glowing background blobs for group image -->
                            <div
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-indigo-500/20 blur-[100px] rounded-full -z-10 group-hover:bg-indigo-400/30 transition-colors duration-700">
                            </div>
                            <div
                                class="absolute top-1/4 right-1/4 w-[50%] h-[50%] bg-brand-400/20 blur-[80px] rounded-full -z-10 group-hover:bg-brand-400/30 transition-colors duration-700">
                            </div>

                            <div class="relative transform transition-transform duration-700 group-hover:rotate-y-[-5deg] group-hover:scale-[1.03] group-hover:-translate-y-3 bg-transparent z-10"
                                style="transform-style: preserve-3d;">
                                <img src="./assets/grupo.png" onerror="this.onerror=null; this.style.display='none';" alt="Connect Dashboard"
                                    class="w-full object-contain aspect-[4/3] bg-transparent drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]" />

                                <!-- Insignia 1: Corona Top Team (Arriba a la izquierda) -->
                                <div
                                    class="absolute -top-4 -left-4 md:-left-8 bg-gradient-to-r from-amber-400/90 to-orange-500/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/40 shadow-[0_15px_30px_rgba(245,158,11,0.4)] animate-float-delay flex items-center gap-2.5 group/badge cursor-pointer hover:scale-105 transition-transform z-20">
                                    <i class="fas fa-crown text-white drop-shadow-md"></i>
                                    <span class="text-white font-black text-sm tracking-wide drop-shadow-md">Top
                                        Team</span>
                                </div>

                                <!-- Insignia 2: Tarjeta de Rendimiento (Abajo a la derecha) -->
                                <div
                                    class="absolute -bottom-6 -right-2 md:-right-8 bg-white/10 backdrop-blur-2xl p-4 md:p-5 rounded-3xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-float flex flex-col gap-3 min-w-[150px] group/card hover:bg-white/20 transition-all hover:-translate-y-1 z-20 cursor-pointer">
                                    <div class="flex justify-between items-center w-full">
                                        <span
                                            class="text-indigo-50 text-[10px] md:text-xs uppercase font-bold tracking-widest drop-shadow-sm">Rendimiento</span>
                                        <div
                                            class="w-6 h-6 rounded-full bg-brand-500/30 flex items-center justify-center border border-white/10">
                                            <i class="fas fa-chart-line text-brand-300 text-[10px]"></i>
                                        </div>
                                    </div>
                                    <div class="flex items-baseline gap-1">
                                        <span
                                            class="text-white font-black text-3xl leading-none drop-shadow-lg">98</span>
                                        <span class="text-brand-300 font-bold text-sm">%</span>
                                    </div>
                                    <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            class="h-full bg-gradient-to-r from-brand-400 to-indigo-400 rounded-full w-[98%] shadow-[0_0_10px_rgba(167,139,250,0.8)] relative">
                                        </div>
                                    </div>
                                </div>

                                <!-- Insignia 3: Avatares Grupales (Centro Derecha) -->
                                <div
                                    class="absolute top-1/3 -right-4 md:-right-10 bg-white/5 backdrop-blur-2xl p-2.5 rounded-full border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-float-fast flex items-center hover:border-brand-400/50 transition-colors z-20 cursor-pointer hover:scale-105">
                                    <div class="flex -space-x-4">
                                        <img class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-400 shadow-[0_0_15px_rgba(167,139,250,0.4)] relative z-[3] object-cover hover:-translate-y-1 transition-transform"
                                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                                            alt="User">
                                        <img class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.4)] relative z-[2] object-cover hover:-translate-y-1 transition-transform"
                                            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                                            alt="User">
                                        <div
                                            class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white text-xs md:text-sm font-black shadow-md relative z-[1] hover:-translate-y-1 transition-transform">
                                            +5
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

window.togglePassword = function (inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-lock-open';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-lock';
    }
};

window.handleLoginSubmit = function (event) {
    event.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('signin-password')?.value.trim();
    const role = document.getElementById('login-role')?.value || 'user';
    const errorBox = document.getElementById('login-error');

    if (!email || !password) {
        if (errorBox) {
            errorBox.textContent = "Por favor completa todos los campos.";
            errorBox.classList.remove('hidden');
        }
        return;
    }

    if (errorBox) errorBox.classList.add('hidden');

    window.localStorage.setItem('isLogged', 'true');
    window.localStorage.setItem('role', role);

    navigate(null, role === 'admin' ? '/admin_home' : '/dashboard');
};

window.handleLoginSubmit = async function (event) {
    event.preventDefault();
    const documentNumber = document.getElementById('login-email')?.value.trim(); // el input dice "Cédula" aunque el id diga login-email
    const password = document.getElementById('signin-password')?.value.trim();
    const errorBox = document.getElementById('login-error');

    if (!documentNumber || !password) {
        if (errorBox) {
            errorBox.textContent = "Por favor completa todos los campos.";
            errorBox.classList.remove('hidden');
        }
        return;
    }

    if (errorBox) errorBox.classList.add('hidden');

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                document_number: documentNumber,
                password: password
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Credenciales incorrectas');
        }

        const data = await response.json();

        // Ajusta esto según lo que realmente devuelva tu backend (token, user, role, etc.)
        window.localStorage.setItem('isLogged', 'true');
        window.localStorage.setItem('token', data.token || '');
        window.localStorage.setItem('role', data.role || 'user');

        navigate(null, data.role === 'ADMINISTRATOR' ? '/admin_home' : '/dashboard');

    } catch (error) {
        console.error(error);
        if (errorBox) {
            errorBox.textContent = error.message || "Error al iniciar sesión. Intenta de nuevo.";
            errorBox.classList.remove('hidden');
        }
    }
};

window.handleRegisterSubmit = async function (event) {
    event.preventDefault();
    const documentNumber = document.getElementById('register-cc')?.value.trim();
    const email = document.getElementById('register-email')?.value.trim();
    const password = document.getElementById('signup-password')?.value.trim();
    const passwordConfirm = document.getElementById('signup-confirm-password')?.value.trim();
    const errorBox = document.getElementById('register-error');

    if (!documentNumber || !email || !password || !passwordConfirm) {
        if (errorBox) {
            errorBox.textContent = "Por favor completa todos los campos.";
            errorBox.classList.remove('hidden');
        }
        return;
    }

    if (password !== passwordConfirm) {
        if (errorBox) {
            errorBox.textContent = "Las contraseñas no coinciden.";
            errorBox.classList.remove('hidden');
        }
        return;
    }

    if (errorBox) errorBox.classList.add('hidden');

    try {
        const response = await fetch('/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                document_number: documentNumber,
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al registrar el usuario');
        }

        const loginResponse = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                document_number: documentNumber,
                password: password
            })
        });

        if (!loginResponse.ok) {
            throw new Error('Cuenta creada correctamente, pero no se pudo iniciar sesion automaticamente. Intenta iniciar sesion manualmente.');
        }

        const loginData = await loginResponse.json();

        window.localStorage.setItem('isLogged', 'true');
        window.localStorage.setItem('role', loginData.role || 'user');

        navigate(null, loginData.role === 'ADMINISTRATOR' ? '/admin_home' : '/dashboard');

    } catch (error) {
        console.error(error);
        if (errorBox) {
            errorBox.textContent = error.message || "Error al registrar. Intenta de nuevo.";
            errorBox.classList.remove('hidden');
        }
    }
};