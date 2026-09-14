import Papa from 'papaparse';

export function exportToCSV(data: Record<string, any>[], filename: string) {
  const csv = Papa.unparse(data, {
    delimiter: ';',
    header: true,
  });

  // Add UTF-8 BOM for Excel compatibility
  const bom = '\\uFEFF';
  const csvData = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(csvData);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
