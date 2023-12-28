import { AfterContentChecked, Component } from '@angular/core';
import { WeatherService } from './forecast/shared/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentChecked {
  title = 'splity';
  weatherActive: boolean;

  constructor(private weatherService: WeatherService) {
    this.weatherActive = this.weatherService.getWeahterSettings().active;
  }

  ngAfterContentChecked(): void {
    //TODO change to behaviour emit
    this.weatherActive = this.weatherService.getWeahterSettings().active;
  }
}
