import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { AlertComponent } from 'src/app/alert/alert.component';

import { SettingsWeatherComponent } from './settings-weather.component';

describe('SettingsWeatherComponent', () => {
  let component: SettingsWeatherComponent;
  let fixture: ComponentFixture<SettingsWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule
      ],
      declarations: [ SettingsWeatherComponent,
        MockComponent(AlertComponent),
       ]
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
