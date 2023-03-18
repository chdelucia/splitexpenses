import { Component } from '@angular/core';
import { WeatherObject, WeatherPlugin } from '../shared/models';
import { WeatherService } from './shared/weather.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.less']
})
export class ForecastComponent {
  weatherInfo: any;
  weatherSettings: WeatherPlugin;
  mymap:any = []
  datagraph:any = [];

  constructor(private weatherService: WeatherService) {
    this.weatherSettings = this.weatherService.getWeahterSettings();
  }

  ngOnInit() {
      this.getForecast();
  }


  getForecast():void {
    this.weatherService.getForecastbyCity(this.weatherSettings.city).subscribe(
      (result: WeatherObject) => {
        console.log(result)
        this.weatherInfo = result;
        this.filteringHours();
    })

  }

  resetObj() {
    let obj: any = {
      'title': '',
      'icon': '',
      'data': [],
      'min': '',
      'max': '',
      'description': [],
      'icons': [],
      'wind': [],
      'humidity': [],
      'labels': []
    }
    return obj;
  }

  filteringHours():void {
    let mymap = [];
    let obj = this.resetObj();
    let item: Array<WeatherObject> = this.weatherInfo.list;

    let stopAt = item[0].dt_txt.split(' ')[0];
    for (let i = 0 ; i < item.length; i++){

      let hour = item[i].dt_txt.split(' ')[0];
      obj.labels.push(item[i].dt_txt.split(' ')[1].slice(0, -3));
      obj.title = new Date(hour).toLocaleDateString('ES', { weekday: 'short', day: 'numeric' })
      obj.humidity.push(item[i].main.humidity);
      obj.wind.push(item[i].wind.speed );
      obj.description.push(item[i].weather[0].description);
      obj.icons.push(item[i].weather[0].icon);
      obj.data.push(item[i].main.temp);

      if ( stopAt !== item[i].dt_txt.split(' ')[0]) {
        obj.min = Math.round(Math.min(...obj.data));
        obj.max = Math.round(Math.max(...obj.data));
        obj.icon = this.mode(obj.icons);
        mymap.push(obj);
        obj = this.resetObj()
        stopAt = item[i].dt_txt.split(' ')[0];
      }
    }

    console.log(mymap);
    this.mymap = mymap;
    this.datagraph = mymap[0]
  }

  changeDate(i:number):void {
    this.datagraph = this.mymap[i]
  }

  mode(arr: Array<string>){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
  }
}
