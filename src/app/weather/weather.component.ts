import { Component, OnInit } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
import { WeatherObject, WeatherPlugin } from '@shared/models';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  weatherSettings: WeatherPlugin;
  weatherInfo!: WeatherObject;

  constructor(private weatherService: WeatherService) {
    this.weatherSettings = this.weatherService.getWeahterSettings();
  }

  ngOnInit() {
    if (this.weatherSettings.active) {
      this.getWeathers();
    }
  }

  getWeathers(): void {
    this.weatherService
      .getWeatheritemsbyCity(this.weatherSettings.city)
      .subscribe((result: WeatherObject) => {
        result.main.temp = Math.round(result.main.temp);
        this.weatherInfo = result;
      });
  }
}
