import { routes } from "./routes";
import { updateActiveNavLink } from "../utils";
import { page404 } from "../../pages/404";

// Placeholders representing simulated authentication states
// Read the real session state, set by login-register.js on successful login
function getAuthState() {
  return {
    isLogged: window.localStorage.getItem('isLogged') === 'true',
    role: window.localStorage.getItem('role') || 'user'
  };
}

// RN-011: checks with the Backend whether the Assessment is completed,
// before allowing access to a route that depends on it (e.g. /teams)
async function checkAssessmentCompleted() {
  try {
    const response = await fetch('/assessments/result');
    return response.ok;
  } catch (error) {
    return false;
  }
}

function resolveCurrentPath(hash = window.location.hash) {
  const rawHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const normalized = rawHash || "/";

  if (!normalized || normalized === "/") {
    return "/";
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  return "/";
}

/**
 * Core SPA Hash Router Function
 * Orchestrates the application state by matching the current URL hash to a registered route,
 * validating authentication/privacy parameters, dynamically toggling layout sidebars,
 * injecting the corresponding HTML template, and triggering transition animations.
 */
export async function router() {
  const currentPath = resolveCurrentPath();
  const { isLogged, role } = getAuthState();
  let view = routes[currentPath];

  /** Array of route paths that should omit the sidebar display */
  const routesWithoutNav = ["/login", "/register", "/", "/not-found", "/404"];
  const root = document.getElementById("root");
  const shouldShowNav = !routesWithoutNav.includes(currentPath);

  document.body.classList.toggle("no-nav", !shouldShowNav);

  root.className = shouldShowNav
    ? "grid grid-cols-[clamp(220px,16vw,300px)_1fr] h-full w-full"
    : "grid grid-cols-1 h-full w-full";

  if (window.cleanup404) {
      window.cleanup404();
      window.cleanup404 = null;
  }

  if (!view) {
    document.body.classList.toggle("no-nav", true);
    root.className = "grid grid-cols-1 h-full w-full";
    document.getElementById("app").innerHTML = page404();
    return;
  }

  if (view.isPrivate && !isLogged) {
    window.location.hash = "/login";
    return;
  }

if (view.isPrivate && view.blockIfAssessmentCompleted) {
    const hasCompletedAssessment = await checkAssessmentCompleted();
    if (hasCompletedAssessment) {
      window.location.hash = "/profile";
      return;
    }
  }

  const container = document.getElementById("app");
  container.innerHTML = view.render();

  container.style.animation = "none";
  void container.offsetWidth;
  container.style.animation = "fade-in 0.5s ease";

  updateActiveNavLink();
}

/**
 * Programmatic Navigation Helper
 * Safely prevents standard browser action triggers and updates the window hash address,
 * prompting the global router execution.
 * * @param {Event} [event] - The triggering DOM interaction event.
 * @param {string} route - The target path destination (e.g., '/dashboard').
 */
export function navigate(event, route) {
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }
  window.location.hash = route;
}

window.addEventListener("hashchange", router);
window.navigate = navigate;
document.addEventListener("DOMContentLoaded", router);
