import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';

import { AddUserComponent } from './add-user.component';
import { UsersService } from '@users/shared/users.service';
import { User } from '@shared/models';
import { userReducer } from '@state/user/user.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let usersServiceSpy: jest.Mocked<UsersService>;
  let snackBarSpy: jest.Mocked<MatSnackBar>;

  const mockUsers: User[] = [
    { id: '1', name: 'John', phone: '1234567890' },
    { id: '2', name: 'Jane', phone: '0987654321' },
  ];

  beforeEach(async () => {
    const usersService = {
      getIterableUsers: jest.fn().mockReturnValue(of(mockUsers)),
      checkIfNameExist: jest.fn().mockReturnValue(of(false)),
      addUser: jest.fn().mockImplementation(() => Promise.resolve()),
      getUserByID: jest.fn(),
      editUser: jest.fn(),
      removeUser: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const snackBar = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot({ userState: userReducer }),
        AddUserComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    usersServiceSpy = TestBed.inject(UsersService) as jest.Mocked<UsersService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUser method on UsersService when onSubmit is called', async () => {
    component.userForm.setValue({ user: 'John Doe', phone: '1112223333' });
    await component.onSubmit();
    expect(usersServiceSpy.addUser).toHaveBeenCalled();
  });

  it('should call checkIfNameExist method on UsersService when onSubmit is called', async () => {
    component.userForm.setValue({ user: 'John Doe', phone: '1112223333' });
    await component.onSubmit();
    expect(usersServiceSpy.checkIfNameExist).toHaveBeenCalledWith('John Doe');
  });
});
