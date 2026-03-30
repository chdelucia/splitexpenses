import { Component, OnInit, inject } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings-weather',
  templateUrl: './settings-weather.component.html',
  styleUrls: ['./settings-weather.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
})
export class SettingsWeatherComponent implements OnInit {
  private weatherService = inject(WeatherService);
  private localStorageService = inject(LocalstorageService);

  settings = this.localStorageService.getSettings();
  weatherSettings = this.settings.weather;
  showAlert = false;
  isError = false;

  ngOnInit(): void {}

  setWeatherPlugin(city: string, status: boolean, key: string) {
    this.weatherService.setWeatherPluginOnLocalStorage(city, status, key);
    this.showAlert = true;
  }

  close() {
    this.showAlert = false;
  }
}
