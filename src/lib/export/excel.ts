import ExcelJS from 'exceljs';

export async function exportToExcel(data: Record<string, any>[], columns: { header: string; key: string; width: number }[], filename: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Leads');

  worksheet.columns = columns;

  // Add data
  worksheet.addRows(data);

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF18181B' } // Dark background (#18181b)
  };
  headerRow.font = {
    color: { argb: 'FFFFFFFF' }, // White bold text
    bold: true
  };

  // Auto-filter on headers
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length }
  };

  // Format currency fields if any (assuming 'valor' or 'score' might be formatted here, let's keep it simple for now)
  // For now, we will rely on data strings or Excel auto-formatting

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
