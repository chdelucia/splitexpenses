import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
import { WeatherObject } from '@shared/models';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  weatherInfo = signal<WeatherObject | undefined>(undefined);

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
        this.weatherInfo.set(result);
      });
  }
}
