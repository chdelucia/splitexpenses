import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { WeatherService } from './forecast/shared/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterContentChecked{
  title = 'splity';
  weatherActive: boolean;

  constructor(
    private weatherService: WeatherService,
    ){
    this.weatherActive = this.weatherService.getWeahterSettings().active;
  }

ngOnInit(): void {
}


ngAfterContentChecked(): void {
  //TODO change to behaviour emit
  this.weatherActive = this.weatherService.getWeahterSettings().active;
}



}
