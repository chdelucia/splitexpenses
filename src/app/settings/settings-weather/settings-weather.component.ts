import { Component, inject, signal } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Settings, WeatherPlugin } from '@shared/models';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-weather',
  templateUrl: './settings-weather.component.html',
  styleUrls: ['./settings-weather.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class SettingsWeatherComponent {
  private weatherService = inject(WeatherService);
  private localStorageService = inject(LocalstorageService);

  weatherSettings: WeatherPlugin;
  settings: Settings;
  showAlert = signal(false);
  isError = signal(false);

  constructor() {
    this.settings = this.localStorageService.getSettings();
    this.weatherSettings = this.settings.weather;
  }

  setWeatherPlugin(city: string, status: boolean, key: string) {
    this.weatherService.setWeatherPluginOnLocalStorage(city, status, key);
    this.showAlert.set(true);
  }

  close() {
    this.showAlert.set(false);
  }
}
