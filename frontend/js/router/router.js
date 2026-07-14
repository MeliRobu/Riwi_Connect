import { routes } from "./routes";
import { updateActiveNavLink } from "../utils";

// Reemplaza esto con tu lógica real de autenticación
const isLogged = true; 
const role = "user";

export async function router() {
  let currentPath = window.location.hash.slice(1) || "/";
  let view = routes[currentPath];

  /** Rutes que no deben mostrar la barra de navegación */
  const routesWithoutNav = ["/login", "/register", '/home'];
  
  const root = document.getElementById("root");
  const sidebarContainer = document.getElementById("sidebar-container");
  const shouldShowNav = !routesWithoutNav.includes(currentPath);

  sidebarContainer.style.display = shouldShowNav ? "block" : "none";
  root.className = shouldShowNav
  ? "grid grid-cols-[clamp(220px,16vw,300px)_1fr] h-full w-full"
  : "grid grid-cols-1 h-full w-full";



  // 1. Validar si la ruta existe, si no, mostrar 404
  if (!view) {
    document.getElementById("app").innerHTML = notFound();
    return;
  }

 // 2. CORREGIDO: Redirigir solo si la ruta es explícitamente privada y el usuario no está logueado
  if (view.isPrivate && !isLogged) {
    window.location.hash = "/login";
    currentPath = "/login"; // Actualizamos la ruta actual
    view = routes["/login"];
  }

  // 3. Renderizar la navbar condicionalmente


  // 4. Renderizar la vista con animación
  const container = document.getElementById("app");
  container.innerHTML = view.render();

  container.style.animation = "none";
  void container.offsetWidth; // Forzar reflow para reiniciar la animación CSS
  container.style.animation = "fade-in 0.5s ease";

  updateActiveNavLink();
}

/**
 * Navega programáticamente a una ruta usando el Hash Routing
 */
export function navigate(event, route) {
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }
  window.location.hash = route;
}

// Manejar la navegación de hacia atrás/adelante del navegador
window.addEventListener("hashchange", router);

// Exponer navigate globalmente para usar en HTML inline
window.navigate = navigate;

// Inicializar el router cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", router);