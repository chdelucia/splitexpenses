import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtTracingComponent } from './debt-tracing.component';

describe('DebtTracingComponent', () => {
  let component: DebtTracingComponent;
  let fixture: ComponentFixture<DebtTracingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebtTracingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtTracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
