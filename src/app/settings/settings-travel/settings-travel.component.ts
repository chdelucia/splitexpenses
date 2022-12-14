import { Component, OnInit } from '@angular/core';
import { DebtsService } from 'src/app/shared/debts.service';
import { ExpensesService } from 'src/app/shared/expenses.service';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { Settings } from 'src/app/shared/models';
import { UsersService } from 'src/app/shared/users.service';

@Component({
  selector: 'app-settings-travel',
  templateUrl: './settings-travel.component.html',
  styleUrls: ['./settings-travel.component.less']
})
export class SettingsTravelComponent implements OnInit {
  settings: Settings;
  expenseNameInput = '';
  showAlert = false;
  isError = false;

  constructor(
    private localStorageService: LocalstorageService,
    private usersService: UsersService,
    private expensesService: ExpensesService,
    private debtsService: DebtsService
    ) { 
    this.settings = this.localStorageService.getSettings();
  }

  ngOnInit(): void {
  }

  changeTravel(name: string){
    this.localStorageService.changeTravel(name);
    this.updateSettings();
    this.resetAll();
    this.showAlert = true;
  }

  resetAll() {
    this.usersService.reset();
    this.expensesService.reset();
    this.debtsService.reset();
  }

  addNewTravel(name: string){
    this.localStorageService.addNewTravel(name);
    this.updateSettings();
    this.resetAll();
    this.showAlert = true;
  }

  updateSettings() {
    this.settings = this.localStorageService.getSettings();
  }

  close(){
    this.showAlert = false;
  }

}
