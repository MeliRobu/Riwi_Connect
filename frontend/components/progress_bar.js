/**
 * Reusable Progress Bar Component with Label
 * Generates an animated progress bar with a smooth width transition.
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
  const colorClasses = {
    indigo: 'from-indigo-600 to-indigo-500',
    emerald: 'from-emerald-500 to-emerald-400',
    blue: 'from-blue-500 to-blue-400',
    red: 'from-red-500 to-red-400',
    amber: 'from-amber-500 to-amber-400',
  };
  const selectedColor = colorClasses[color] || colorClasses.indigo;
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return `
    <div class="${wrapperStyles}">
      <div class="flex justify-between items-center text-xs font-semibold text-gray-500">
        <span>Progreso</span>
        <span>${safeValue}%</span>
      </div>
      <div class="w-full rounded-full bg-gray-100 overflow-hidden ${size}">
        <div
          class="h-full rounded-full bg-gradient-to-r ${selectedColor} transition-all duration-500 ease-out"
          style="width: ${safeValue}%"
        ></div>
      </div>
    </div>
  `;
}