import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
import { WeatherObject } from '@shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class WeatherComponent implements OnInit {
  private weatherService = inject(WeatherService);
  private destroyRef = inject(DestroyRef);
  weatherSettings = this.weatherService.weatherSettings;
  weatherInfo!: WeatherObject;

  ngOnInit() {
    if (this.weatherSettings().active) {
      this.getWeathers();
    }
  }

  getWeathers(): void {
    this.weatherService
      .getWeatheritemsbyCity(this.weatherSettings().city)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: WeatherObject) => {
        result.main.temp = Math.round(result.main.temp);
        this.weatherInfo = result;
      });
  }
}
