import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtTracingComponent } from './debt-tracing.component';

describe('DebtTracingComponent', () => {
  let component: DebtTracingComponent;
  let fixture: ComponentFixture<DebtTracingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtTracingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtTracingComponent);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('debtTracing', []);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
