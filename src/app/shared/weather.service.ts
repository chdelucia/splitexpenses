import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { WeatherObject, WeatherPlugin } from './models';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private weatherSettings: WeatherPlugin;
  constructor(private http: HttpClient) { 
    this.weatherSettings = this.getWeatherPluginOnLocalStorage();
  }
  
  getWeatheritemsbyCity(cityName: string): any {

    return this.http.get<WeatherObject>(environment.baseUrl + 'weather?q=' + cityName + '&appid=' + environment.appId + '&units=metric&lang=es')
        .pipe(
          retry(3),
          catchError(this.handleError)
        ) 

  }

  getForecastbyCity(cityName: string) {
    return this.http.get<WeatherObject>(environment.baseUrl + 'forecast?q=' + cityName + '&appid=' + environment.appId + '&units=metric&lang=es')
  }

 

  setWeatherPluginOnLocalStorage(city: string, status: boolean){
    let obj = {
      'city': city,
      'active': status,
    }
    localStorage.setItem(environment.localStorageWeather,JSON.stringify(obj));
    this.weatherSettings = obj;
  }

  getWeatherPluginOnLocalStorage(): WeatherPlugin{
    let data = localStorage.getItem(environment.localStorageWeather);
    let result = data ? JSON.parse(data) : {};
    return result
  }

  getWeahterSettings() {
    return this.weatherSettings
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
