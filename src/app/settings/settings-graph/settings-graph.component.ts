import { Component, inject } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { ExpenseTypes, Settings } from '@shared/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-graph',
  templateUrl: './settings-graph.component.html',
  styleUrls: ['./settings-graph.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SettingsGraphComponent {
  private localStorageService = inject(LocalstorageService);

  showAlert = false;
  isError = false;
  settings: Settings = this.localStorageService.getSettings();
  types: ExpenseTypes[] = Object.values(this.settings.graph.types);

  trackByIdx(index: number): number {
    return index;
  }

  onSubmit() {
    const types: Record<string, ExpenseTypes> = {};
    this.types.forEach((type, i) => {
      types[i] = { id: i.toString(), name: type.name, active: true };
    });

    //TODO ugly way to dont touch original object
    const obj = {
      graph: {
        bgColors: this.settings.graph.bgColors,
        types: types,
      },
    };

    this.localStorageService.saveSettings(obj);

    this.showAlert = true;
  }

  close() {
    this.showAlert = false;
  }
}
