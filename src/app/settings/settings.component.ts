import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WeatherPlugin } from '../shared/models';
import { WeatherService } from '../shared/weather.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
  inputTravel = '';
  inputLoadData = '';
  showAlert = false;
  isError = false;

  weatherSettings: WeatherPlugin;

  constructor(private weatherService: WeatherService) { 
    this.weatherSettings = this.weatherService.getWeahterSettings()
  }

  ngOnInit(): void {
    
  }

  copyData(){
    let data = localStorage.getItem(environment.localStorageExpenses) || '';
    navigator.clipboard.writeText(data);
    this.showAlert = true;
  }

  loadData(data: string) {
    localStorage.setItem(environment.localStorageExpenses, data);
     this.showAlert = true;
  }

  download(text:string) {
    let textFile;
    let expenses = localStorage.getItem(environment.localStorageExpenses) || '';
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

  close(){
    this.showAlert = false;
  }

}
