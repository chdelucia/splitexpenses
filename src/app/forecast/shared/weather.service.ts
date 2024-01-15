import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { WeatherObject, WeatherPlugin } from '../../shared/models/models';
import { LocalstorageService } from '../../shared/services/localstorage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private weatherSettings: WeatherPlugin;
  constructor(
    private http: HttpClient,
    private localStorageService: LocalstorageService,
  ) {
    this.weatherSettings = this.loadWeatherPluginFromLocalStorage();
  }

  getWeatheritemsbyCity(cityName: string): Observable<WeatherObject> {
    return this.http
      .get<WeatherObject>(
        environment.baseUrl +
          'weather?q=' +
          cityName +
          '&appid=' +
          this.weatherSettings.key +
          '&units=metric&lang=es',
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  getForecastbyCity(cityName: string) {
    return this.http.get<WeatherObject>(
      environment.baseUrl +
        'forecast?q=' +
        cityName +
        '&appid=' +
        this.weatherSettings.key +
        '&units=metric&lang=es',
    );
  }

  setWeatherPluginOnLocalStorage(city: string, status: boolean, key: string) {
    const obj = {
      weather: {
        city: city,
        active: status,
        key: key,
      },
    };
    this.localStorageService.saveSettings(obj);
    this.weatherSettings = obj.weather;
  }

  loadWeatherPluginFromLocalStorage(): WeatherPlugin {
    const data = this.localStorageService.loadSettings();
    return data.weather;
  }

  getWeahterSettings() {
    return this.weatherSettings;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  }
}
