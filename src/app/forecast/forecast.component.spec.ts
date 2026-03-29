import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForecastComponent } from './forecast.component';
import { WeatherService } from './shared/weather.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';

describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;

  beforeEach(async () => {
    const mockWeatherService = {
      weatherSettings: signal({ city: 'Madrid' }),
      getWeahterSettings: jest.fn().mockReturnValue({ city: 'Madrid' }),
      getForecastbyCity: jest.fn().mockReturnValue(of({ list: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [ForecastComponent],
      providers: [{ provide: WeatherService, useValue: mockWeatherService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
