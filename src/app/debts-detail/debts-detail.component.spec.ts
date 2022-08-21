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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
