import { Component, computed, inject } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class WeatherComponent {
  private weatherService = inject(WeatherService);
  weatherSettings = this.weatherService.weatherSettings;

  weatherInfo = toSignal(
    this.weatherService.getWeatheritemsbyCity(this.weatherSettings().city).pipe(
      map((result) => {
        result.main.temp = Math.round(result.main.temp);
        return result;
      }),
    ),
  );

  showWeather = computed(
    () => this.weatherSettings().active && !!this.weatherInfo(),
  );
}
