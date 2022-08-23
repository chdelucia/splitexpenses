import { Component } from '@angular/core';
import { WeatherService } from './shared/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'splitexpenses';
  weatherActive: boolean;

  constructor(private weatherService: WeatherService){
    this.weatherActive = this.weatherService.getWeahterSettings().active;
  }

}
