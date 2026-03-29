import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SettingsTravelComponent } from './settings-travel.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { ExpensesService } from '@expenses/shared/expenses.service';

describe('SettingsTravelComponent', () => {
  let component: SettingsTravelComponent;
  let fixture: ComponentFixture<SettingsTravelComponent>;

  beforeEach(async () => {
    const mockLocalStorageService = {
      getSettings: jest.fn().mockReturnValue({
        travels: { names: [], active: '' },
      }),
    };
    const mockExpensesService = {
      init: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, SettingsTravelComponent],
      providers: [
        { provide: LocalstorageService, useValue: mockLocalStorageService },
        { provide: ExpensesService, useValue: mockExpensesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
