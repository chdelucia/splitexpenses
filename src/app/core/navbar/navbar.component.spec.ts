import { NavbarComponent } from './navbar.component';
import { WeatherService } from '@forecast/shared/weather.service';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let weatherServiceStub: any;

  beforeEach(() => {
    weatherServiceStub = {
      weatherSettings: signal({ active: true, city: 'Madrid', key: '123' }),
      getWeahterSettings: jest.fn().mockReturnValue({ active: true }),
    };

    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: WeatherService, useValue: weatherServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } },
            paramMap: of({ get: () => null }),
          },
        },
      ],
    });

    component = TestBed.createComponent(NavbarComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.weatherActive()).toBeTruthy();
  });
});
