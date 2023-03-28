import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { AlertComponent } from 'src/app/alert/alert.component';

import { SettingsTravelComponent } from './settings-travel.component';

describe('SettingsTravelComponent', () => {
  let component: SettingsTravelComponent;
  let fixture: ComponentFixture<SettingsTravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ SettingsTravelComponent,
        MockComponent(AlertComponent)
       ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
