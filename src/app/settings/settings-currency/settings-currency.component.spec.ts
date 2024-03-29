import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SettingsCurrencyComponent } from './settings-currency.component';

describe('SettingsCurrencyComponent', () => {
  let component: SettingsCurrencyComponent;
  let fixture: ComponentFixture<SettingsCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SettingsCurrencyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
