import { routes } from "./routes";
import { updateActiveNavLink } from "../utils";

// Placeholders representing simulated authentication states
const isLogged = true; 
const role = "user";

/**
 * Core SPA Hash Router Function
 * Orchestrates the application state by matching the current URL hash to a registered route, 
 * validating authentication/privacy parameters, dynamically toggling layout sidebars, 
 * injecting the corresponding HTML template, and triggering transition animations.
 */
export async function router() {
  let currentPath = window.location.hash.slice(1) || "/";
  let view = routes[currentPath];

  /** Array of route paths that should omit the sidebar display */
  const routesWithoutNav = ["/login", "/register", '/home', '/'];
  
  const root = document.getElementById("root");
  const sidebarContainer = document.getElementById("sidebar-container");
  const shouldShowNav = !routesWithoutNav.includes(currentPath);

  // Dynamically alters layout structure and sidebar visibility depending on the current route
  sidebarContainer.style.display = shouldShowNav ? "block" : "none";
  root.className = shouldShowNav
    ? "grid grid-cols-[clamp(220px,16vw,300px)_1fr] h-full w-full"
    : "grid grid-cols-1 h-full w-full";

  // 1. Fallback: If the requested path does not exist, renders the 404 Not Found view
  if (!view) {
    document.getElementById("app").innerHTML = notFound();
    return;
  }

  // 2. Security Guard: Redirects unauthorized requests attempting to access private routes to the login page
  if (view.isPrivate && !isLogged) {
    window.location.hash = "/login";
    currentPath = "/login"; // Updates local path variable
    view = routes["/login"];
  }

  // 3. Render: Injects the active view template with a quick CSS transition refresh
  const container = document.getElementById("app");
  container.innerHTML = view.render();

  // Forces a DOM reflow to ensure the fade-in CSS keyframe animation executes consistently on view changes
  container.style.animation = "none";
  void container.offsetWidth; 
  container.style.animation = "fade-in 0.5s ease";

  // Keeps the sidebar navigation links styled with appropriate active states based on current route
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

// Subscribes router initialization to history navigation and address updates
window.addEventListener("hashchange", router);

// Exposes navigate method globally to let raw inline strings execute it
window.navigate = navigate;

// Initializes router configuration as soon as DOM tree parsing completes
document.addEventListener("DOMContentLoaded", router);