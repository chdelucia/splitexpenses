import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SettingsCurrencyComponent } from './settings-currency.component';
import { CurrencyService } from '@shared/services/currency/currency.service';

describe('SettingsCurrencyComponent', () => {
  let component: SettingsCurrencyComponent;
  let fixture: ComponentFixture<SettingsCurrencyComponent>;

  beforeEach(async () => {
    const mockCurrencyService = {
      getCurrencySettings: jest.fn().mockReturnValue({}),
    };
    await TestBed.configureTestingModule({
      imports: [FormsModule, SettingsCurrencyComponent],
      providers: [
        { provide: CurrencyService, useValue: mockCurrencyService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
