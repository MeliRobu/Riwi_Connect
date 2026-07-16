export function register() {
    return `
        <main class="flex items-center justify-center h-screen bg-[#F3F1FA] px-5">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-md flex flex-col gap-6">
                
                <a href="#/" data-route="/" onclick="navigate(event, '/')" class="text-center text-3xl font-bold tracking-wide text-[#4B3FA8] mb-2">
                    <span class="text-purple-500 font-bold text-4xl">{</span>onnect
                </a>

                <div class="flex flex-col gap-1">
                    <span class="text-2xl font-bold">Crear cuenta</span>
                    <span class="text-gray-500 text-sm">Regístrate para empezar a usar la plataforma</span>
                </div>

                <div id="register-error" class="hidden bg-red-50 text-red-600 text-sm font-semibold px-4 py-2.5 rounded-xl"></div>

                <form id="register-form" class="flex flex-col gap-4" onsubmit="handleRegisterSubmit(event)">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Número de cédula</label>
                       <input 
                            type="text" 
                            id="register-cc" 
                            placeholder="Número de cédula"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8] transition-all duration-200"
                            required
                        >
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Correo</label>
                        <input 
                            type="email" 
                            id="register-email" 
                            placeholder="usuario@riwi.io"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8] transition-all duration-200"
                            required
                        >
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Contraseña</label>
                        <input 
                            type="password" 
                            id="register-password" 
                            placeholder="••••••••"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8] transition-all duration-200"
                            required
                        >
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-600">Confirmar contraseña</label>
                        <input 
                            type="password" 
                            id="register-password-confirm" 
                            placeholder="••••••••"
                            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8] transition-all duration-200"
                            required
                        >
                    </div>

                    <div class="flex flex-col gap-1.5 pt-2">
                        <label class="text-sm font-semibold text-gray-600">Rol (solo pruebas)</label>
                        <select id="register-role" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3FA8] transition-all duration-200">
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <button 
                        type="submit"
                        class="bg-[#4B3FA8] text-white font-bold py-2.5 rounded-xl mt-2 transition-all duration-300 hover:bg-pink-600 hover:scale-[1.02] active:scale-95"
                    >
                        Registrarme
                    </button>
                </form>

                <span class="text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta? 
                    <a href="#/login" onclick="navigate(event, '/login')" class="text-[#4B3FA8] font-semibold hover:underline">Inicia sesión</a>
                </span>

                <span class="text-center text-xs text-gray-400">
                    Modo de prueba — no valida datos reales
                </span>
            </div>
        </main>
    `;
}
/*Funciones de ejemplo, el equipo backend puede quitarlas o cambiarlas a su gusto */
window.handleRegisterSubmit = function(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const passwordConfirm = document.getElementById('register-password-confirm').value.trim();
    const role = document.getElementById('register-role').value;
    const errorBox = document.getElementById('register-error');

    if (!name || !email || !password || !passwordConfirm) {
        errorBox.textContent = "Por favor completa todos los campos.";
        errorBox.classList.remove('hidden');
        return;
    }

    if (password !== passwordConfirm) {
        errorBox.textContent = "Las contraseñas no coinciden.";
        errorBox.classList.remove('hidden');
        return;
    }

    errorBox.classList.add('hidden');

    window.localStorage.setItem('isLogged', 'true');
    window.localStorage.setItem('role', role);

    navigate(null, role === 'admin' ? '/admin_home' : '/dashboard');
};