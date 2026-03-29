import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import { provideHttpClient } from '@angular/common/http';
import { WeatherService } from '@forecast/shared/weather.service';
import { signal } from '@angular/core';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;

  beforeEach(async () => {
    const mockWeatherService = {
      weatherSettings: signal({ active: false }),
      getWeatheritemsbyCity: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [WeatherComponent],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
