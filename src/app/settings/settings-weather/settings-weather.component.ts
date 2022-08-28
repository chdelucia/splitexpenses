import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { Settings, WeatherPlugin } from 'src/app/shared/models';
import { WeatherService } from 'src/app/shared/weather.service';

@Component({
  selector: 'app-settings-weather',
  templateUrl: './settings-weather.component.html',
  styleUrls: ['./settings-weather.component.less']
})
export class SettingsWeatherComponent implements OnInit {
  weatherSettings: WeatherPlugin;
  settings: Settings;
  showAlert = false;
  isError = false;

  constructor(
    private weatherService: WeatherService,
    private localStorageService: LocalstorageService,
    ) { 
    this.settings = this.localStorageService.getSettings();
    this.weatherSettings = this.settings.weather;
  }

  ngOnInit(): void {
  }

  setWeatherPlugin(city:string, status: boolean){
    this.weatherService.setWeatherPluginOnLocalStorage(city, status);
    this.showAlert = true;
  }

  close(){
    this.showAlert = false;
  }
}
