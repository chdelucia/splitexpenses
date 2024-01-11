import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(listOfObject: any[], value: string): any[] {
    const keyword = value.toLowerCase();
    if (!value || value.trim() === '') {
      return listOfObject;
    }

    return listOfObject.filter((objeto) => {
      return Object.keys(objeto).some((key) => {
        const valor = objeto[key];
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
