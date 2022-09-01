import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LocalstorageService } from './shared/localstorage.service';
import { WeatherService } from './shared/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterContentChecked{
  title = 'splitexpenses';
  weatherActive: boolean;

  constructor(
    private weatherService: WeatherService,
    private local: LocalstorageService
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
