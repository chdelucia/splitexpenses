import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtsComponent } from './debts.component';
import { DebtsService } from './shared/debts.service';
import { UsersService } from '@users/shared/users.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('DebtsComponent', () => {
  let component: DebtsComponent;
  let fixture: ComponentFixture<DebtsComponent>;

  beforeEach(async () => {
    const debtsServiceMock = {
      getDebts: jest.fn().mockReturnValue(of({})),
      getDebtTracing: jest.fn().mockReturnValue(of([])),
    };
    const usersServiceMock = {
      getIterableUsers: jest.fn().mockReturnValue(of([])),
    };
    const currencyServiceMock = {
      getCurrencySettings: jest.fn().mockReturnValue({ currencySymbol: '€', active: false }),
    };

    await TestBed.configureTestingModule({
      imports: [DebtsComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: DebtsService, useValue: debtsServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: CurrencyService, useValue: currencyServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
