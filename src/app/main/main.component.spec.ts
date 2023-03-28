import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ExpensesService } from '../expenses/shared/expenses.service';
import { Expense, User } from '../shared/models';
import { UsersService } from '../users/shared/users.service';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  const expensesServiceMock = {
    getExpenses: () => new Map<string, Expense>()
  };

  const usersServiceMock = {
    getIterableUsers: () => of<Array<User>>([
      {id: '1', name: 'Alice'},
      {id: '2', name: 'Bob'}
    ])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ MainComponent ],
      providers: [
        { provide: ExpensesService, useValue: expensesServiceMock },
        { provide: UsersService, useValue: usersServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
