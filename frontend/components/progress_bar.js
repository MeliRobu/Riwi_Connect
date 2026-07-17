/**
 * Reusable Progress Bar Component with Label
 * Generates a native HTML5 <progress> bar paired with a direct percentage text label.
 * * @param {Object} props - The properties to configure the progress bar.
 * @param {number} props.value - The current progress value (assumed scale of 0 to 100).
 * @param {string} [props.color='indigo'] - The color theme ('indigo', 'emerald', 'blue', 'red', 'amber').
 * @param {string} [props.size='h-3'] - Tailwind CSS height utility class (e.g., 'h-2', 'h-4').
 * @param {string} [props.className=''] - Extra Tailwind utility classes for outer container customization.
 * @returns {string} The raw HTML string representing the progress component.
 */
export function progressBar({ 
  value, 
  color = 'indigo', 
  size = 'h-3', 
  className = '' 
}) {
  
  const wrapperStyles = `w-full flex flex-col gap-1.5 ${className}`;
  const baseProgressStyles = ` rounded-full overflow-hidden appearance-none bg-gray-100 [&::-webkit-progress-bar]:bg-gray-100 [&]:bg-gray-100 ${size}`;

  const colorVariants = {
    indigo: '[&::-webkit-progress-value]:bg-indigo-600 [&::-moz-progress-bar]:bg-indigo-600',
    emerald: '[&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500',
    blue: '[&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-500',
    red: '[&::-webkit-progress-value]:bg-red-500 [&::-moz-progress-bar]:bg-red-500',
    amber: '[&::-webkit-progress-value]:bg-amber-500 [&::-moz-progress-bar]:bg-amber-500',
  };

  const selectedColor = colorVariants[color] || colorVariants.indigo;

  return `
    <div class="${wrapperStyles}">
      <div class="flex justify-between items-center text-xs font-semibold text-gray-500">
        
      </div>
      <div>
        <progress 
            class="${baseProgressStyles} ${selectedColor}" 
            value="${value}" 
            max="100">
        </progress>
      </div>
    </div>
  `;
}