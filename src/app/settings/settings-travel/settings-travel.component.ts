import { Component, inject } from '@angular/core';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings-travel',
  templateUrl: './settings-travel.component.html',
  styleUrls: ['./settings-travel.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class SettingsTravelComponent {
  private localStorageService = inject(LocalstorageService);
  private expensesService = inject(ExpensesService);

  settings = this.localStorageService.getSettings();
  expenseNameInput = '';
  showAlert = false;
  isError = false;

  changeTravel(name: string) {
    this.localStorageService.changeTravel(name);
    this.updateSettings();
    this.resetAll();
    this.showAlert = true;
  }

  resetAll() {
    this.expensesService.loadExpensesFromLocalStorage();
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
