import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarygraphComponent } from './summarygraph.component';

describe('SummarygraphComponent', () => {
  let component: SummarygraphComponent;
  let fixture: ComponentFixture<SummarygraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarygraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarygraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
