import { Component } from '@angular/core';
import { WeatherService } from '../../forecast/shared/weather.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  weatherActive: boolean;
  constructor(
    private weatherService: WeatherService,
    ){
    this.weatherActive = this.weatherService.getWeahterSettings().active;
  }

}
