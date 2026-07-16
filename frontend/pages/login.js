export function login() {
    return `
        <main class="flex items-center justify-center h-screen bg-[#F3F1FA] px-5">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-md flex flex-col gap-6">
                
                <a href="#/" data-route="/" onclick="navigate(event, '/')" class="text-center text-3xl font-bold tracking-wide text-[#4B3FA8] mb-2">
                    <span class="text-purple-500 font-bold text-4xl">{</span>onnect
                </a>

                <div class="flex flex-col gap-1">
                    <span class="text-2xl font-bold">Iniciar sesión</span>
                    <span class="text-gray-500 text-sm">Ingresa tus credenciales para continuar</span>
                </div>

                <div id="login-error" class="hidden bg-red-50 text-red-600 text-sm font-semibold px-4 py-2.5 rounded-xl"></div>

                <form id="login-form" class="flex flex-col gap-4" onsubmit="handleLoginSubmit(event)">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Cédula</label>
                       <input 
                            type="text" 
                            id="login-cc" 
                            placeholder="Número de cédula"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8] transition-all duration-200"
                            required
                        >
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Contraseña</label>
                        <input 
                            type="password" 
                            id="login-password" 
                            placeholder="••••••••"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8] transition-all duration-200"
                            required
                        >
                    </div>

                    <button 
                        type="submit"
                        class="bg-[#4B3FA8] text-white font-bold py-2.5 rounded-xl mt-2 transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95"
                    >
                        Ingresar
                    </button>
                </form>

                <span class="text-center text-sm text-gray-500">
                    ¿No tienes una cuenta? 
                    <a href="#/register" onclick="navigate(event, '/register')" class="text-[#4B3FA8] font-semibold hover:underline">Registrate</a>
                </span>

                <span class="text-center text-xs text-gray-400">
                    Modo de prueba — no valida credenciales reales
                </span>
            </div>
        </main>
    `;
}

window.handleLoginSubmit = function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const role = document.getElementById('login-role').value;
    const errorBox = document.getElementById('login-error');

    if (!email || !password) {
        errorBox.textContent = "Por favor completa todos los campos.";
        errorBox.classList.remove('hidden');
        return;
    }

    errorBox.classList.add('hidden');

    window.localStorage.setItem('isLogged', 'true');
    window.localStorage.setItem('role', role);

    navigate(null, role === 'admin' ? '/admin_home' : '/dashboard');
};