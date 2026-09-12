import { TestBed } from '@angular/core/testing';
import { ExcelExportService } from './excel-export.service';
import { Expense } from '@shared/models';
import * as XLSX from 'xlsx';

jest.mock('xlsx', () => {
  const original = jest.requireActual('xlsx');
  return {
    ...original,
    writeFile: jest.fn(),
  };
});

describe('ExcelExportService', () => {
  let service: ExcelExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelExportService);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMonthYearName', () => {
    it('should correctly format date strings to Spanish Month Year', () => {
      expect(service.getMonthYearName('2024-05-15')).toBe('Mayo 2024');
      expect(service.getMonthYearName('2024-01-01')).toBe('Enero 2024');
      expect(service.getMonthYearName('2023-12-31')).toBe('Diciembre 2023');
    });

    it('should handle invalid dates gracefully', () => {
      expect(service.getMonthYearName('invalid-date')).toBe('Sin Fecha');
    });
  });

  describe('sanitizeSheetName', () => {
    it('should sanitize invalid sheet characters and trim length', () => {
      expect(service.sanitizeSheetName('Mayo/2024?*:[test]')).toBe(
        'Mayo2024test',
      );
      expect(service.sanitizeSheetName('a'.repeat(40))).toBe('a'.repeat(31));
      expect(service.sanitizeSheetName('')).toBe('Hoja1');
    });
  });

  describe('exportExpensesToExcel', () => {
    it('should not trigger export if expenses array is empty or undefined', () => {
      service.exportExpensesToExcel([]);
      expect(XLSX.writeFile).not.toHaveBeenCalled();
    });

    it('should create worksheets grouped by month and call XLSX.writeFile', () => {
      const sampleExpenses: Expense[] = [
        {
          id: '1',
          title: 'Supermercado',
          cost: 45.5,
          originalCost: 45.5,
          date: '2024-05-10',
          typeId: '3',
          paidBy: '1',
          sharedBy: ['1'],
          settleBy: [],
        },
        {
          id: '2',
          title: 'Cena',
          cost: 25.0,
          originalCost: 25.0,
          date: '2024-05-20',
          typeId: '1',
          paidBy: '1',
          sharedBy: ['1'],
          settleBy: [],
        },
        {
          id: '3',
          title: 'Gasolina',
          cost: 60.0,
          originalCost: 60.0,
          date: '2024-06-01',
          typeId: '2',
          paidBy: '1',
          sharedBy: ['1'],
          settleBy: [],
        },
      ];

      service.exportExpensesToExcel(sampleExpenses, 'test.xlsx');

      expect(XLSX.writeFile).toHaveBeenCalledTimes(1);
      const callArgs = (XLSX.writeFile as jest.Mock).mock.calls[0];
      const workbook = callArgs[0];
      const filename = callArgs[1];

      expect(filename).toBe('test.xlsx');
      expect(workbook.SheetNames).toContain('Mayo 2024');
      expect(workbook.SheetNames).toContain('Junio 2024');
      expect(workbook.SheetNames.length).toBe(2);
    });
  });
});
