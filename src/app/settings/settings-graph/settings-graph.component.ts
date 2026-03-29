import { Component, inject, signal } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { ExpenseTypes, Settings } from '@shared/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-graph',
  templateUrl: './settings-graph.component.html',
  styleUrls: ['./settings-graph.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class SettingsGraphComponent {
  private localStorageService = inject(LocalstorageService);

  showAlert = signal(false);
  isError = signal(false);
  settings: Settings;
  types: ExpenseTypes[];
  constructor() {
    this.settings = this.localStorageService.getSettings();
    this.types = Object.values(this.settings.graph.types);
  }

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

    this.showAlert.set(true);
  }

  close() {
    this.showAlert.set(false);
  }
}
