import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { WeatherService } from './forecast/shared/weather.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';

const weatherServiceStub = {
  getWeahterSettings: jest.fn().mockReturnValue({ active: true }),
  weatherSettings: signal({ active: true, city: 'Madrid', key: '123' }),
  getWeatheritemsbyCity: jest.fn().mockReturnValue(
    of({
      main: { temp: 20 },
      sys: { country: 'ES' },
      weather: [{ icon: '01d' }],
    }),
  ),
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: WeatherService, useValue: weatherServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'splitexpenses'`, () => {
    expect(component.title).toEqual('splity');
  });
});
