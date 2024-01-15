import { Component } from '@angular/core';
import { ExpensesService } from '../../expenses/shared/expenses.service';
import { LocalstorageService } from '../../shared/services/localstorage.service';
import { Settings } from '../../shared/models/models';

@Component({
  selector: 'app-settings-travel',
  templateUrl: './settings-travel.component.html',
  styleUrls: ['./settings-travel.component.scss'],
})
export class SettingsTravelComponent {
  settings: Settings;
  expenseNameInput = '';
  showAlert = false;
  isError = false;

  constructor(
    private localStorageService: LocalstorageService,
    private expensesService: ExpensesService,
  ) {
    this.settings = this.localStorageService.getSettings();
  }

  changeTravel(name: string) {
    this.localStorageService.changeTravel(name);
    this.updateSettings();
    this.resetAll();
    this.showAlert = true;
  }

  resetAll() {
    this.expensesService.init();
  }

  addNewTravel(name: string) {
    this.localStorageService.addNewTravel(name);
    this.updateSettings();
    this.resetAll();
    this.showAlert = true;
  }

  updateSettings() {
    this.settings = this.localStorageService.getSettings();
  }

  close() {
    this.showAlert = false;
  }
}
