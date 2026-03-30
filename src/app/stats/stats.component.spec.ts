import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsComponent } from './stats.component';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { UsersService } from '@users/shared/users.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  beforeEach(async () => {
    const expensesServiceMock = {
      getTotalCost: jest.fn().mockReturnValue(of(100)),
      getAverageCostPerDay: jest.fn().mockReturnValue(of(10)),
      gettotalCostEachDayPerType: jest.fn().mockReturnValue(of({ labels: [], data: [] })),
      getExpensesByType: jest.fn().mockReturnValue(of({ labels: [], data: [] })),
    };

    const currencyServiceMock = {
      getCurrencySettings: jest.fn().mockReturnValue({ currencySymbol: '€', active: false }),
    };

    const usersServiceMock = {
      getIterableUsers: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [StatsComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: ExpensesService, useValue: expensesServiceMock },
        { provide: CurrencyService, useValue: currencyServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
