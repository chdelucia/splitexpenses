import { Component, Input, OnInit } from '@angular/core';
import { WeatherObject, WeatherPlugin } from '../shared/models';
import { WeatherService } from '../shared/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.less']
})
export class WeatherComponent implements OnInit {
  weatherSettings: WeatherPlugin;
  weatherInfo: any;
  
  constructor(private weatherService: WeatherService) {
    this.weatherSettings = this.weatherService.getWeahterSettings();
  }
  
  ngOnInit() {
    if(this.weatherSettings.active){
      this.getWeathers();
    }
  }

  getWeathers():void {
      this.weatherService.getWeatheritemsbyCity(this.weatherSettings.city).subscribe( 
        (result: WeatherObject) => {
          result.main.temp = Math.round(result.main.temp);
          this.weatherInfo = result
      })
  }


}
