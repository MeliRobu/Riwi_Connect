/**
 * Reusable Card Component
 * Generates a customizable card container as an HTML string for SPA templates.
 * * @param {Object} props - The properties to configure the card.
 * @param {string} props.content - The HTML or text content to display inside the card.
 * @param {string} [props.title] - Optional heading displayed at the top.
 * @param {string} [props.width='max-w-md'] - Tailwind CSS width class (e.g., 'w-full', 'w-96').
 * @param {string} [props.bgColor='bg-white'] - Tailwind CSS background color class.
 * @param {string} [props.padding='p-6'] - Tailwind CSS padding class.
 * @param {string} [props.className=''] - Extra Tailwind CSS utility classes for customized styling.
 * @returns {string} The raw HTML string of the card component.
 */
export function card({ 
  content, 
  title = '', 
  width = 'max-w-md', 
  bgColor = 'bg-white', 
  padding = 'p-6', 
  className = '' 
}) {
  
  // Base styling for the card container
  const baseStyles = 'rounded-xl shadow-md border border-gray-100 transition-all duration-300';
  
  // Conditionally renders the header if a title is provided
  const headerHTML = title 
    ? `<h3 class="text-lg font-bold mb-3 text-gray-800">${title}</h3>` 
    : '';

  return `
    <div class="${baseStyles} ${width} ${bgColor} ${padding} ${className}">
      ${headerHTML}
      <div class="">
        ${content}
      </div>
    </div>
  `;
}