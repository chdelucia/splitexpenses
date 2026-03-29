import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtsComponent } from './debts.component';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { UsersService } from '@users/shared/users.service';
import { DebtsService } from './shared/debts.service';
import { signal } from '@angular/core';

describe('DebtsComponent', () => {
  let component: DebtsComponent;
  let fixture: ComponentFixture<DebtsComponent>;
  let debtsServiceStub: any;
  let userServiceStub: any;
  let currencyServiceStub: any;

  beforeEach(async () => {
    debtsServiceStub = {
      debtsSignal: signal({}),
      getDebtTracing: jest.fn().mockReturnValue([]),
    };
    userServiceStub = { iterableUsers: signal([]) };
    currencyServiceStub = { getCurrencySettings: jest.fn().mockReturnValue({}) };

    await TestBed.configureTestingModule({
      imports: [DebtsComponent],
      providers: [
        { provide: DebtsService, useValue: debtsServiceStub },
        { provide: UsersService, useValue: userServiceStub },
        { provide: CurrencyService, useValue: currencyServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get currency settings from service', () => {
    expect(currencyServiceStub.getCurrencySettings).toHaveBeenCalled();
  });
});
