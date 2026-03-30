import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SettingsCurrencyComponent } from './settings-currency.component';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsCurrencyComponent', () => {
  let component: SettingsCurrencyComponent;
  let fixture: ComponentFixture<SettingsCurrencyComponent>;

  beforeEach(async () => {
    const currencyServiceMock = {
      getCurrencySettings: jest.fn().mockReturnValue({ currencySymbol: '€', active: false }),
      saveCurrencyIntoLocalStorage: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsCurrencyComponent, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: CurrencyService, useValue: currencyServiceMock }
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
