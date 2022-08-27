import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { LocalstorageService } from '../shared/localstorage.service';
import { Settings, WeatherPlugin } from '../shared/models';
import { UsersService } from '../shared/users.service';
import { WeatherService } from '../shared/weather.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
  inputTravel = '';
  inputLoadData = '';
  expenseNameInput = '';
  showAlert = false;
  isError = false;

  weatherSettings: WeatherPlugin;
  settings: Settings;

  constructor(
    private weatherService: WeatherService,
    private localStorageService: LocalstorageService,
    private usersService: UsersService,
    private expensesService: ExpensesService,
    private debtsService: DebtsService
    ) { 
    this.settings = this.localStorageService.getSettings();
    this.weatherSettings = this.settings.weather;
  }

  ngOnInit(): void {
  }

  updateSettings() {
    this.settings = this.localStorageService.getSettings();
  }

  addNewTravel(name: string){
    this.localStorageService.addNewTravel(name);
    this.updateSettings();
    this.resetAll();
  }

  copyData(){
    let name = this.localStorageService.getActiveTravelName();
    let data = localStorage.getItem(name) || '';
    navigator.clipboard.writeText(data);
    this.showAlert = true;
  }

  loadData(data: string) {
    let name = this.localStorageService.getActiveTravelName();
    localStorage.setItem(name, data);
     this.showAlert = true;
  }

  download(text:string) {
    let name = this.localStorageService.getActiveTravelName();
    let textFile;
    let expenses = localStorage.getItem(name) || '';
    var data = new Blob([expenses], {type: 'text/plain'});
    textFile = window.URL.createObjectURL(data);

    var link = document.getElementById('downloadlink') as HTMLAnchorElement;
    link.href = textFile;
    link.download = text;
    link.click();

    return textFile;
  };

  setWeatherPlugin(city:string, status: boolean){
    this.weatherService.setWeatherPluginOnLocalStorage(city, status);
  }

  changeTravel(name: string){
    this.localStorageService.changeTravel(name);
    this.updateSettings();
    this.resetAll();
  }

  resetAll() {
    this.usersService.reset();
    this.expensesService.reset();
    this.debtsService.reset();
  }

  close(){
    this.showAlert = false;
  }

}
