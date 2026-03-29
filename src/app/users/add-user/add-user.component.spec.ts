import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';

import { AddUserComponent } from './add-user.component';
import { UsersService } from '@users/shared/users.service';
import { User } from '@shared/models';
import { UserState, userReducer } from '@state/user/user.reducer';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let store: Store<UserState>;
  let usersServiceSpy: any;

  const mockUsers: User[] = [
    { id: '1', name: 'John', phone: '1234567890' },
    { id: '2', name: 'Jane', phone: '0987654321' },
  ];

  beforeEach(async () => {
    const usersService = {
      getIterableUsers: jest.fn(),
      checkIfNameExist: jest.fn(),
      addUser: jest.fn(),
      getUserByID: jest.fn(),
      editUser: jest.fn(),
      removeUser: jest.fn(),
    };
    usersService.getIterableUsers.mockReturnValue(of(mockUsers));
    usersService.checkIfNameExist.mockReturnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({ userState: userReducer }),
        AddUserComponent,
      ],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compileComponents();

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    usersServiceSpy = TestBed.inject(UsersService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUser method on UsersService when add method is called', async () => {
    component.userForm.setValue({ user: 'John Doe', phone: '1112223333' });
    await component.onSubmit();
    expect(usersServiceSpy.addUser).toHaveBeenCalled();
  });

  it('should call checkIfNameExist method on UsersService when add method is called', async () => {
    component.userForm.setValue({ user: 'John Doe', phone: '1112223333' });
    await component.onSubmit();
    expect(usersServiceSpy.checkIfNameExist).toHaveBeenCalled();
  });
});
