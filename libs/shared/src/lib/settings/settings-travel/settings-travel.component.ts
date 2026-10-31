import { Component, inject, signal } from '@angular/core';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { UsersService } from '@users/shared/users.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Settings } from '@shared/models';
import { ExpensesStore } from '@state/expenses/expenses.store';
import { UserStore } from '@state/user/user.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-travel',
  templateUrl: './settings-travel.component.html',
  styleUrls: ['./settings-travel.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SettingsTravelComponent {
  private localStorageService = inject(LocalstorageService);
  private expensesService = inject(ExpensesService);
  private usersService = inject(UsersService);
  private expensesStore = inject(ExpensesStore);
  private userStore = inject(UserStore);

  settings: Settings = this.localStorageService.getSettings();
  expenseNameInput = signal('');
  showAlert = false;
  isError = false;

  changeTravel(name: string) {
    this.localStorageService.changeTravel(name);
    this.updateSettings();
    this.resetAll();
    this.showAlert = true;
  }

  resetAll() {
    this.expensesStore.clearExpenses();
    this.userStore.resetUsers();
    this.expensesService.init();
    this.usersService.init();
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
