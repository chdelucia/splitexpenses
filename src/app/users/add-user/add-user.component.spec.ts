
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';

import { AddUserComponent } from './add-user.component';
import { UsersService } from '../shared/users.service';
import { User } from 'src/app/shared/models';
import { UserState, userReducer } from 'src/app/state/user/user.reducer';


describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let store: Store<UserState>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  const mockUsers: User[] = [
    { id: '1', name: 'John', phone: '1234567890' },
    { id: '2', name: 'Jane', phone: '0987654321' }
  ];

  beforeEach(async () => {
    const usersService = jasmine.createSpyObj('UsersService', ['getIterableUsers', 'checkIfNameExist', 'addUser', 'getUserByID', 'editUser', 'removeUser']);
    usersService.getIterableUsers.and.returnValue(of(mockUsers));
    usersService.checkIfNameExist.and.returnValue(false);


    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        StoreModule.forRoot({ userState: userReducer })
      ],
      declarations: [ AddUserComponent ],
      providers: [
        { provide: UsersService, useValue: usersService },
      ]
    })
    .compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUser method on UsersService when add method is called', () => {
    component.onSubmit({user:'John Doe', phone:'1112223333'});
    expect(usersServiceSpy.addUser).toHaveBeenCalled();
  });

  it('should call reset method on when add method is called', () => {
    component.onSubmit({user:'John Doe', phone:'1112223333'});
  });

  it('should call checkIfNameExist method on UsersService when add method is called', () => {
    component.onSubmit({user:'John Doe', phone:'1112223333'});
    expect(usersServiceSpy.checkIfNameExist).toHaveBeenCalled();
  });

});
