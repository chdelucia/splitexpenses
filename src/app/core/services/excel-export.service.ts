import { Injectable } from '@angular/core';
import { Expense } from '@shared/models';
import * as XLSX from 'xlsx';

export interface CategoryNameMap {
  [key: string]: string;
}

const DEFAULT_CATEGORY_NAMES: CategoryNameMap = {
  '0': 'Entretenimiento',
  '1': 'Restauración',
  '2': 'Transporte',
  '3': 'Supermercado',
  '4': 'Alojamiento',
  '5': 'Salud/Belleza',
  '6': 'Hogar/Servicios',
  '7': 'Otros',
};

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  /**
   * Formats a date string (e.g. "2024-05-15") or Date object into a month-year tab name (e.g. "Mayo 2024").
   */
  getMonthYearName(dateInput: string | Date): string {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return 'Sin Fecha';
    }

    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const monthStr = monthNames[d.getMonth()];
    const yearStr = d.getFullYear();
    return `${monthStr} ${yearStr}`;
  }

  /**
   * Sanitizes sheet names according to Excel specifications:
   * - Max 31 characters
   * - Cannot contain invalid characters: \ / ? * : [ ]
   */
  sanitizeSheetName(name: string): string {
    if (!name) return 'Hoja1';
    let clean = name.replace(/[\\/?*:[\]]/g, '').trim();
    if (clean.length > 31) {
      clean = clean.substring(0, 31);
    }
    return clean || 'Hoja1';
  }

  /**
   * Groups expenses by month and generates an Excel workbook where each month has its own sheet/tab.
   */
  exportExpensesToExcel(
    expenses: Expense[],
    fileName = 'gastos_individuales.xlsx',
    categoryNames: CategoryNameMap = DEFAULT_CATEGORY_NAMES,
  ): void {
    if (!expenses || expenses.length === 0) {
      return;
    }

    const workbook = XLSX.utils.book_new();

    // Group expenses by Month-Year
    const grouped = new Map<string, Expense[]>();

    expenses.forEach((expense) => {
      const monthKey = this.getMonthYearName(expense.date);
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)!.push(expense);
    });

    const usedSheetNames = new Set<string>();

    grouped.forEach((monthExpenses, monthName) => {
      let sheetName = this.sanitizeSheetName(monthName);
      let counter = 1;

      while (usedSheetNames.has(sheetName)) {
        const suffix = `_${counter}`;
        const maxBaseLength = 31 - suffix.length;
        sheetName =
          this.sanitizeSheetName(sheetName.substring(0, maxBaseLength)) +
          suffix;
        counter++;
      }

      usedSheetNames.add(sheetName);

      // Sort expenses in sheet by date descending
      const sortedExpenses = [...monthExpenses].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      // Prepare worksheet rows
      const sheetData = sortedExpenses.map((exp) => ({
        Título: exp.title || '',
        'Importe (€)': exp.originalCost ?? 0,
        Fecha: exp.date || '',
        Categoría:
          categoryNames[String(exp.typeId)] || exp.typeId || 'Otros',
      }));

      const worksheet = XLSX.utils.json_to_sheet(sheetData);

      // Adjust column widths
      worksheet['!cols'] = [
        { wch: 30 }, // Título
        { wch: 15 }, // Importe
        { wch: 15 }, // Fecha
        { wch: 20 }, // Categoría
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, fileName);
  }
}
