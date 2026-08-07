import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform<T>(listOfObject: T[], value: string): T[] {
    const keyword = value.toLowerCase();
    if (!value || value.trim() === '') {
      return listOfObject;
    }

    return listOfObject.filter((objeto) => {
      const obj = objeto as Record<string, unknown>;
      return Object.keys(obj).some((key) => {
        const valor = obj[key];
        if (
          typeof valor === 'string' &&
          valor.toLowerCase().includes(keyword)
        ) {
          return true;
        }
        return false;
      });
    });
  }
}
