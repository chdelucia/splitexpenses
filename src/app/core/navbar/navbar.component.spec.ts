import { NavbarComponent } from './navbar.component';
import { WeatherService } from '@forecast/shared/weather.service';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

describe('NavbarComponent sin tesbed', () => {
  let component: NavbarComponent;
  let weatherServiceStub: Partial<WeatherService>;

  beforeEach(() => {
    weatherServiceStub = {
      weatherSettings: signal({
        active: true,
        city: 'Madrid',
        key: '123',
      } as any),
      getWeahterSettings: jest.fn().mockReturnValue({ active: true }),
    };

    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: WeatherService, useValue: weatherServiceStub },
        provideRouter([]),
      ],
    });

    component = TestBed.createComponent(NavbarComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.weatherActive()).toBeTruthy();
  });
});
