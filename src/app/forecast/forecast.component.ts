import { Component, inject, OnInit, signal } from '@angular/core';
import { WeatherObject } from '@shared/models';
import { WeatherService } from './shared/weather.service';

import { SummarygraphComponent } from '@shared/components/summarygraph/summarygraph.component';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  standalone: true,
  imports: [SummarygraphComponent],
})
export class ForecastComponent implements OnInit {
  private weatherService = inject(WeatherService);

  weatherInfo: any;
  weatherSettings = this.weatherService.weatherSettings();
  mymap = signal<any[]>([]);
  datagraph = signal<any>([]);

  ngOnInit() {
    this.getForecast();
  }

  getForecast(): void {
    this.weatherService
      .getForecastbyCity(this.weatherSettings.city)
      .subscribe((result: WeatherObject) => {
        this.weatherInfo = result;
        this.filteringHours();
      });
  }

  resetObj() {
    const obj: any = {
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
    return obj;
  }

  filteringHours(): void {
    const mymap = [];
    let obj = this.resetObj();
    const item: Array<WeatherObject> = this.weatherInfo.list;

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
        obj.icon = this.mode(obj.icons);
        mymap.push(obj);
        obj = this.resetObj();
        stopAt = item[i].dt_txt.split(' ')[0];
      }
    }

    this.mymap.set(mymap);
    this.datagraph.set(mymap[0]);
  }

  changeDate(i: number): void {
    this.datagraph.set(this.mymap()[i]);
  }

  mode(arr: Array<string>) {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length,
      )
      .pop();
  }
}
