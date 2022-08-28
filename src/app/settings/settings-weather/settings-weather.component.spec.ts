import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWeatherComponent } from './settings-weather.component';

describe('SettingsWeatherComponent', () => {
  let component: SettingsWeatherComponent;
  let fixture: ComponentFixture<SettingsWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsWeatherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
