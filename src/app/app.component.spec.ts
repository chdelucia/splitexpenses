import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { WeatherService } from './forecast/shared/weather.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { signal } from '@angular/core';
import { of } from 'rxjs';

const weatherServiceStub = {
  getWeahterSettings: jest.fn().mockReturnValue({ active: true }),
  weatherSettings: signal({ active: true, city: 'London', key: '123' }),
  getWeatheritemsbyCity: jest.fn().mockReturnValue(of({ main: { temp: 20 }, weather: [{ icon: '01d' }], sys: { country: 'UK' }, name: 'London' })),
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RouterTestingModule, AppComponent],
    providers: [
      { provide: WeatherService, useValue: weatherServiceStub },
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting()
    ]
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

  it(`should have as title 'splity'`, () => {
    expect(component.title).toEqual('splity');
  });
});
