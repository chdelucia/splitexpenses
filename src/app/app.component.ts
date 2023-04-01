import { Component, OnInit } from '@angular/core';
import { WeatherService } from './forecast/shared/weather.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'splity';
  weatherActive: boolean;

  constructor(
    private weatherService: WeatherService,
    private router: Router
    ){
    this.weatherActive = this.weatherService.getWeahterSettings().active;
  }

ngOnInit(): void {}



ngAfterContentChecked(): void {
  //TODO change to behaviour emit
  this.weatherActive = this.weatherService.getWeahterSettings().active;
}



}
