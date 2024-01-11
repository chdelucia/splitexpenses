import { NavbarComponent } from './navbar.component';
import { WeatherService } from '../../forecast/shared/weather.service';

describe('NavbarComponent sin tesbed', () => {
  let component: NavbarComponent;
  let weatherServiceStub: Partial<WeatherService>;

  beforeEach(() => {
    weatherServiceStub = {
      getWeahterSettings: jest.fn().mockReturnValue({ active: true }),
    };

    component = new NavbarComponent(weatherServiceStub as WeatherService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.weatherActive).toBeTruthy();
  });
});
