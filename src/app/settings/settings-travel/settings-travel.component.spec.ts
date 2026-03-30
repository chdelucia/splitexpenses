import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsTravelComponent } from './settings-travel.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsTravelComponent', () => {
  let component: SettingsTravelComponent;
  let fixture: ComponentFixture<SettingsTravelComponent>;

  beforeEach(async () => {
    const localStorageServiceMock = {
      getSettings: jest.fn().mockReturnValue({ travels: { names: [], active: '' } }),
      changeTravel: jest.fn(),
      addNewTravel: jest.fn(),
    };

    const expensesServiceMock = {
      loadExpensesFromLocalStorage: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsTravelComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: LocalstorageService, useValue: localStorageServiceMock },
        { provide: ExpensesService, useValue: expensesServiceMock },
        provideMockStore()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
