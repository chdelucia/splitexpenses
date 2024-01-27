import { Component } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { ExpenseTypes, Settings } from '@shared/models';

@Component({
  selector: 'app-settings-graph',
  templateUrl: './settings-graph.component.html',
  styleUrls: ['./settings-graph.component.scss'],
})
export class SettingsGraphComponent {
  showAlert = false;
  isError = false;
  settings: Settings;
  types: ExpenseTypes[];
  constructor(private localStorageService: LocalstorageService) {
    this.settings = this.localStorageService.getSettings();
    this.types = Array.from(this.settings.graph.types.values());
  }

  trackByIdx(index: number): number {
    return index;
  }

  onSubmit() {
    const types = new Map();
    this.types.forEach((type, i) => {
      types.set(i, { id: i, name: type.name, active: true });
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
