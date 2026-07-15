/**
 * Reusable Button Component
 * Generates either an anchor element (<a>) for SPA hash navigation or a standard button (<button>) 
 * for executing inline JavaScript click events.
 * * @param {Object} props - The properties to configure the button.
 * @param {string} props.text - The text to display inside the button.
 * @param {string} [props.to] - Hash route destination (e.g., '/dashboard'). If provided, renders an <a> tag.
 * @param {string} [props.onClick] - Global JavaScript function string to execute on click (e.g., 'myFunction()').
 * @param {string} [props.variant='primary'] - Style variant matching the internal style dictionary.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes to extend or override styles.
 * @returns {string} The raw HTML string representing the button component.
 */
export function button({ text, to, onClick, variant = 'primary', className = '' }) {
  const baseStyles = 'cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 bg-transparent',
  };

  const selectedStyles = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  // 1. Navigation Mode: If "to" property is supplied, renders a hash-ready anchor link
  if (to) {
    return `
      <a href="#${to}" class="${selectedStyles}">
        ${text}
      </a>
    `;
  }

  // 2. Action Mode: If "onClick" property is supplied, binds a native HTML inline click handler
  const clickAttr = onClick ? `onclick="${onClick}"` : '';

  return `
    <button class="${selectedStyles}" ${clickAttr}>
      ${text}
    </button>
  `;
}