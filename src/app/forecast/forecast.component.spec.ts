import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForecastComponent } from './forecast.component';
import { WeatherService } from './shared/weather.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;

  beforeEach(async () => {
    const weatherServiceMock = {
      getWeahterSettings: jest.fn().mockReturnValue({ city: 'Madrid' }),
      getForecastbyCity: jest.fn().mockReturnValue(of({ list: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [ForecastComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: WeatherService, useValue: weatherServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
