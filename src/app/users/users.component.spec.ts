import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { UsersComponent } from './users.component';
import { UsersService } from './shared/users.service';
import { User } from '@shared/models';
import { userReducer, UserState } from '@state/user/user.reducer';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: Store<UserState>;

  const mockUsers: User[] = [
    { id: '1', name: 'John', phone: '1234567890' },
    { id: '2', name: 'Jane', phone: '0987654321' },
  ];

  beforeEach(async () => {
    const usersService = {
      getIterableUsers: jest.fn().mockReturnValue(of(mockUsers)),
      checkIfNameExist: jest.fn().mockReturnValue(of(false)),
      addUser: jest.fn(),
      getUserByID: jest.fn(),
      editUser: jest.fn(),
      removeUser: jest.fn(),
      iterableUsers: signal(mockUsers),
    };

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        StoreModule.forRoot({ userState: userReducer }),
        UsersComponent,
      ],
      providers: [{ provide: UsersService, useValue: usersService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
