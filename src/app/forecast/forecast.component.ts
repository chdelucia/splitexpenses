import { Component, inject, OnInit, signal } from '@angular/core';
import { WeatherObject, WeatherPlugin } from '@shared/models';
import { WeatherService } from './shared/weather.service';
import { CommonModule } from '@angular/common';
import { SummarygraphComponent } from '@shared/components';
import { LoggerService } from '@core/services/logger.service';

export interface ForecastDay {
  title: string;
  icon: string;
  data: number[];
  min: number | string;
  max: number | string;
  description: string[];
  icons: string[];
  wind: number[];
  humidity: number[];
  labels: string[];
}

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  standalone: true,
  imports: [CommonModule, SummarygraphComponent],
})
export class ForecastComponent implements OnInit {
  private weatherService = inject(WeatherService);
  private loggerService = inject(LoggerService);

  weatherInfo = signal<WeatherObject | null>(null);
  weatherSettings: WeatherPlugin;
  mymap = signal<ForecastDay[]>([]);
  datagraph = signal<ForecastDay | null>(null);

  constructor() {
    this.weatherSettings = this.weatherService.getWeahterSettings();
  }

  ngOnInit() {
    this.getForecast();
  }

  getForecast(): void {
    this.weatherService
      .getForecastbyCity(this.weatherSettings.city)
      .subscribe((result: WeatherObject) => {
        this.loggerService.info('ForecastComponent', 'getForecast', result);
        this.weatherInfo.set(result);
        this.filteringHours();
      });
  }

  resetObj(): ForecastDay {
    return {
      title: '',
      icon: '',
      data: [],
      min: '',
      max: '',
      description: [],
      icons: [],
      wind: [],
      humidity: [],
      labels: [],
    };
  }

  filteringHours(): void {
    const mymap: ForecastDay[] = [];
    let obj = this.resetObj();
    const weatherData = this.weatherInfo();
    if (!weatherData) return;

    const item: Array<WeatherObject> = weatherData.list;

    let stopAt = item[0].dt_txt.split(' ')[0];
    for (let i = 0; i < item.length; i++) {
      const hour = item[i].dt_txt.split(' ')[0];
      obj.labels.push(item[i].dt_txt.split(' ')[1].slice(0, -3));
      obj.title = new Date(hour).toLocaleDateString('ES', {
        weekday: 'short',
        day: 'numeric',
      });
      obj.humidity.push(item[i].main.humidity);
      obj.wind.push(item[i].wind.speed);
      obj.description.push(item[i].weather[0].description);
      obj.icons.push(item[i].weather[0].icon);
      obj.data.push(item[i].main.temp);

      if (stopAt !== item[i].dt_txt.split(' ')[0]) {
        obj.min = Math.round(Math.min(...obj.data));
        obj.max = Math.round(Math.max(...obj.data));
        obj.icon = this.mode(obj.icons) || '';
        mymap.push(obj);
        obj = this.resetObj();
        stopAt = item[i].dt_txt.split(' ')[0];
      }
    }

    this.loggerService.info('ForecastComponent', 'filteringHours', mymap);
    this.mymap.set(mymap);
    this.datagraph.set(mymap[0]);
  }

  changeDate(i: number): void {
    this.datagraph.set(this.mymap()[i]);
  }

  mode(arr: Array<string>): string | undefined {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length,
      )
      .pop();
  }
}
