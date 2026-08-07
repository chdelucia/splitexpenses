import { Component, inject } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Settings, WeatherPlugin } from '@shared/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-weather',
  templateUrl: './settings-weather.component.html',
  styleUrls: ['./settings-weather.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SettingsWeatherComponent {
  private weatherService = inject(WeatherService);
  private localStorageService = inject(LocalstorageService);

  settings: Settings = this.localStorageService.getSettings();
  weatherSettings: WeatherPlugin = this.settings.weather;
  showAlert = false;
  isError = false;

  setWeatherPlugin(city: string, status: boolean, key: string) {
    this.weatherService.setWeatherPluginOnLocalStorage(city, status, key);
    this.showAlert = true;
  }

  close() {
    this.showAlert = false;
  }
}
