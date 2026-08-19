import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SettingsTravelComponent } from './settings-travel.component';
import { ExpensesStore } from '@state/expenses/expenses.store';
import { UserStore } from '@state/user/user.store';

describe('SettingsTravelComponent', () => {
  let component: SettingsTravelComponent;
  let fixture: ComponentFixture<SettingsTravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, SettingsTravelComponent],
      providers: [ExpensesStore, UserStore],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new travel and switch active travel', () => {
    component.addNewTravel('Japon 2025');
    expect(component.settings.travels.names).toContain('Japon 2025');
    expect(component.settings.travels.active).toBe('Japon 2025');

    component.changeTravel('Expenses');
    expect(component.settings.travels.active).toBe('Expenses');
  });
});
