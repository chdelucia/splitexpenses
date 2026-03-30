import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummarygraphComponent } from './summarygraph.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { BaseChartDirective } from 'ng2-charts';

describe('SummarygraphComponent', () => {
  let component: SummarygraphComponent;
  let fixture: ComponentFixture<SummarygraphComponent>;

  beforeEach(async () => {
    const localStorageServiceMock = {
      getSettings: jest.fn().mockReturnValue({ graph: { bgColors: [] } }),
    };

    await TestBed.configureTestingModule({
      imports: [SummarygraphComponent],
      providers: [
        { provide: LocalstorageService, useValue: localStorageServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .overrideComponent(SummarygraphComponent, {
        remove: { imports: [BaseChartDirective] }
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
