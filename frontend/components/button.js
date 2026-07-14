/**
 * Crea un botón reutilizable y personalizable.
 *
 * @param {Object} options
 * @param {string} options.text - Texto del botón
 * @param {Function} [options.onClick] - Acción a ejecutar al hacer click
 * @param {string} [options.variant="primary"] - "primary" | "secondary" | "ghost" | "danger"
 * @param {string} [options.extraClasses=""] - Clases extra de Tailwind para personalizar
 * @param {string} [options.icon] - HTML de un ícono opcional (SVG o <img>)
 * @param {boolean} [options.disabled=false]
 * @param {string} [options.type="button"] - "button" | "submit" | "reset"
 * @param {string} [options.loadingText="Cargando..."] - Texto mostrado durante una acción async
 * @returns {HTMLButtonElement}
 */
export function createButton({
  text,
  onClick,
  variant = "primary",
  extraClasses = "",
  icon = "",
  disabled = false,
  type = "button",
  loadingText = "Cargando..."
}) {
  const variants = {
    primary: "bg-[#4B3FA8] text-white hover:bg-[#3C3489]",
    secondary: "bg-[#F3F1FA] text-[#4B3FA8] hover:bg-[#E9E5FB]",
    ghost: "bg-transparent text-gray-500 hover:bg-[#F3F1FA] hover:text-[#4B3FA8]",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  const button = document.createElement("button");
  button.type = type;
  button.disabled = disabled;

  const baseClasses = `
    inline-flex items-center justify-center gap-2 px-4 py-2.5
    rounded-xl text-sm font-semibold cursor-pointer
    transition-all duration-200
    disabled:opacity-40 disabled:cursor-not-allowed
    ${variants[variant] || variants.primary}
    ${extraClasses}
  `.trim().replace(/\s+/g, " ");

  button.className = baseClasses;
  button.innerHTML = `${icon}<span>${text}</span>`;

  const spinner = `<svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`;

  if (typeof onClick === "function") {
    button.addEventListener("click", async (e) => {
      if (button.dataset.loading === "true") return;

      const result = onClick(e);

      if (result instanceof Promise) {
        button.dataset.loading = "true";
        button.disabled = true;
        button.innerHTML = `${spinner}<span>${loadingText}</span>`;

        try {
          await result;
        } finally {
          button.dataset.loading = "false";
          button.disabled = disabled;
          button.innerHTML = `${icon}<span>${text}</span>`;
        }
      }
    });
  }

  return button;
}