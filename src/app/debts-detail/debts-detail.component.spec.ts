import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtsDetailComponent } from './debts-detail.component';

describe('DebtsDetailComponent', () => {
  let component: DebtsDetailComponent;
  let fixture: ComponentFixture<DebtsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
    component.setDebts();
    console.log(component.myDebts);
  });
});
