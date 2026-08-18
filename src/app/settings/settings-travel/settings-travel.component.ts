import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { UsersService } from '@users/shared/users.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Settings } from '@shared/models';
import { clearExpenses } from '@state/expenses/expenses.actions';
import { resetUsers } from '@state/user/user.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-travel',
  templateUrl: './settings-travel.component.html',
  styleUrls: ['./settings-travel.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SettingsTravelComponent {
  private localStorageService = inject(LocalstorageService);
  private expensesService = inject(ExpensesService);
  private usersService = inject(UsersService);
  private store = inject(Store);

  settings: Settings = this.localStorageService.getSettings();
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
    this.store.dispatch(clearExpenses());
    this.store.dispatch(resetUsers());
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
