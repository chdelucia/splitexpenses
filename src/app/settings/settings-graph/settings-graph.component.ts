import { Component, inject, signal } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { ExpenseTypes, Settings } from '@shared/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-graph',
  templateUrl: './settings-graph.component.html',
  styleUrls: ['./settings-graph.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SettingsGraphComponent {
  private localStorageService = inject(LocalstorageService);

  showAlert = false;
  isError = false;
  settings = signal<Settings>(this.localStorageService.getSettings());
  types = signal<ExpenseTypes[]>(Object.values(this.settings().graph.types));
  bgColors = signal<string[]>([...this.settings().graph.bgColors]);

  trackByIdx(index: number): number {
    return index;
  }

  updateTypeName(index: number, name: string) {
    this.types.update((list) => {
      const newList = [...list];
      newList[index] = { ...newList[index], name };
      return newList;
    });
  }

  updateBgColor(index: number, color: string) {
    this.bgColors.update((list) => {
      const newList = [...list];
      newList[index] = color;
      return newList;
    });
  }

  onSubmit() {
    const typesObj: Record<string, ExpenseTypes> = {};
    this.types().forEach((type, i) => {
      typesObj[i] = { id: i.toString(), name: type.name, active: true };
    });

    const obj = {
      graph: {
        bgColors: this.bgColors(),
        types: typesObj,
      },
    };

    this.localStorageService.saveSettings(obj);
    this.showAlert = true;
  }

  close() {
    this.showAlert = false;
  }
}
