import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummarygraphComponent } from './summarygraph.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';

describe('SummarygraphComponent', () => {
  let component: SummarygraphComponent;
  let fixture: ComponentFixture<SummarygraphComponent>;

  beforeEach(async () => {
    const mockLocalStorageService = {
      getSettings: jest.fn().mockReturnValue({
        graph: {
          bgColors: [],
          types: {},
        },
      }),
    };

    await TestBed.configureTestingModule({
      imports: [SummarygraphComponent],
      providers: [
        { provide: LocalstorageService, useValue: mockLocalStorageService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
