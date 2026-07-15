/**
 * Reusable Table Component
 * Generates a clean, responsive HTML table string for displaying tabular database data.
 * * @param {Object} props - The properties to configure the table.
 * @param {Array<string>} props.headers - An array of column header titles (e.g., ['Name', 'Status']).
 * @param {Array<Object>} props.items - The array of data objects retrieved from the database.
 * @param {function} props.renderRow - A function that takes a single item and returns a `<tr>` HTML string.
 * @param {string} [props.className=''] - Extra Tailwind CSS utility classes for the table wrapper.
 * @returns {string} The raw HTML string representing the table component.
 */
export function table({ 
  headers, 
  items, 
  renderRow, 
  className = '' 
}) {
  
  // Generates the table header cells (<th>) from the headers array
  const headersHTML = headers
    .map(header => `
      <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
        ${header}
      </th>
    `)
    .join('');

  // Generates the table body rows (<tr>) by mapping through the database items
  const rowsHTML = items.map(item => renderRow(item)).join('');

  // Fallback row in case the database returns an empty array
  const emptyStateHTML = `
    <tr>
      <td colspan="${headers.length}" class="px-6 py-10 text-center text-sm text-gray-400">
        No se encontraron registros.
      </td>
    </tr>
  `;

  return `
    <div class="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm ${className}">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50/75">
          <tr>
            ${headersHTML}
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          ${items.length > 0 ? rowsHTML : emptyStateHTML}
        </tbody>
      </table>
    </div>
  `;
}