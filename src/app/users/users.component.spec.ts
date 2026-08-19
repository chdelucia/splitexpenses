import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { UsersComponent } from './users.component';
import { UsersService } from './shared/users.service';
import { User } from '@shared/models';
import { UserStore } from '@state/user/user.store';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  const mockUsers: User[] = [
    { id: '1', name: 'John', phone: '1234567890' },
    { id: '2', name: 'Jane', phone: '0987654321' },
  ];

  beforeEach(async () => {
    const usersService = {
      getIterableUsers: jest.fn().mockReturnValue(of(mockUsers)),
      checkIfNameExist: jest.fn().mockReturnValue(false),
      addUser: jest.fn(),
      getUserByID: jest.fn(),
      editUser: jest.fn(),
      removeUser: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, UsersComponent],
      providers: [
        UserStore,
        { provide: UsersService, useValue: usersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
