import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SettingsWeatherComponent } from './settings-weather.component';
import { provideHttpClient } from '@angular/common/http';
import { WeatherService } from '@forecast/shared/weather.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';

describe('SettingsWeatherComponent', () => {
  let component: SettingsWeatherComponent;
  let fixture: ComponentFixture<SettingsWeatherComponent>;

  beforeEach(async () => {
    const mockWeatherService = {
      setWeatherPluginOnLocalStorage: jest.fn(),
    };
    const mockLocalStorageService = {
      getSettings: jest.fn().mockReturnValue({ weather: { active: false } }),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, SettingsWeatherComponent],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService },
        { provide: LocalstorageService, useValue: mockLocalStorageService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
