import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtTracingComponent } from './debt-tracing.component';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DebtTracingComponent', () => {
  let component: DebtTracingComponent;
  let fixture: ComponentFixture<DebtTracingComponent>;

  beforeEach(async () => {
    const currencyServiceSpy = {
      getCurrencySettings: jest.fn().mockReturnValue({}),
    };

    await TestBed.configureTestingModule({
      declarations: [DebtTracingComponent],
      providers: [{ provide: CurrencyService, useValue: currencyServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtTracingComponent);
    component = fixture.componentInstance;
    // Set required input before detectChanges
    fixture.componentRef.setInput('debtTracing', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
