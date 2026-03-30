import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsWeatherComponent } from './settings-weather.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsWeatherComponent', () => {
  let component: SettingsWeatherComponent;
  let fixture: ComponentFixture<SettingsWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SettingsWeatherComponent, NoopAnimationsModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(SettingsWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
