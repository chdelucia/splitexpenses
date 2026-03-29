import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtTracingComponent } from './debt-tracing.component';
import { CurrencyService } from '@shared/services/currency/currency.service';

describe('DebtTracingComponent', () => {
  let component: DebtTracingComponent;
  let fixture: ComponentFixture<DebtTracingComponent>;

  beforeEach(async () => {
    const mockCurrencyService = {
      getCurrencySettings: jest.fn().mockReturnValue({}),
    };

    await TestBed.configureTestingModule({
      imports: [DebtTracingComponent],
      providers: [{ provide: CurrencyService, useValue: mockCurrencyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtTracingComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('debtTracing', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
