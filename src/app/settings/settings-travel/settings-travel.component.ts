import { Component, inject, signal } from '@angular/core';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Settings } from '@shared/models';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-travel',
  templateUrl: './settings-travel.component.html',
  styleUrls: ['./settings-travel.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class SettingsTravelComponent {
  private localStorageService = inject(LocalstorageService);
  private expensesService = inject(ExpensesService);

  settings: Settings;
  expenseNameInput = signal('');
  showAlert = signal(false);
  isError = signal(false);

  constructor() {
    this.settings = this.localStorageService.getSettings();
  }

  changeTravel(name: string) {
    this.localStorageService.changeTravel(name);
    this.updateSettings();
    this.resetAll();
    this.showAlert.set(true);
  }

  resetAll() {
    this.expensesService.init();
  }

  addNewTravel(name: string) {
    this.localStorageService.addNewTravel(name);
    this.updateSettings();
    this.resetAll();
    this.showAlert.set(true);
  }

  updateSettings() {
    this.settings = this.localStorageService.getSettings();
  }

  close() {
    this.showAlert.set(false);
  }
}
