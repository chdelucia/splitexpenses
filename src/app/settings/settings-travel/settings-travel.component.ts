import { Component, OnInit } from '@angular/core';
import { DebtsService } from 'src/app/shared/debts.service';
import { ExpensesService } from 'src/app/expenses/shared/expenses.service';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { Settings } from 'src/app/shared/models';

@Component({
  selector: 'app-settings-travel',
  templateUrl: './settings-travel.component.html',
  styleUrls: ['./settings-travel.component.scss']
})
export class SettingsTravelComponent implements OnInit {
  settings: Settings;
  expenseNameInput = '';
  showAlert = false;
  isError = false;

  constructor(
    private localStorageService: LocalstorageService,
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
    this.expensesService.init();
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
