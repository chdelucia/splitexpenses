import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';

import { UsersComponent } from './users.component';
import { UsersService } from '../shared/users.service';
import { DebtsService } from '../shared/debts.service';
import { User } from '../shared/models';
import { userReducer, UserState } from '../state/user/user.reducer';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: Store<UserState>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let debtsServiceSpy: jasmine.SpyObj<DebtsService>;

  const mockUsers: User[] = [
    { id: '1', name: 'John', phone: '1234567890' },
    { id: '2', name: 'Jane', phone: '0987654321' }
  ];

  beforeEach(async () => {
    const usersService = jasmine.createSpyObj('UsersService', ['getIterableUsers', 'checkIfNameExist', 'addUser', 'getUserByID', 'editUser', 'removeUser']);
    usersService.getIterableUsers.and.returnValue(of(mockUsers));
    usersService.checkIfNameExist.and.returnValue(false);

    const debtsService = jasmine.createSpyObj('DebtsService', ['reset']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        StoreModule.forRoot({ userState: userReducer })
      ],
      declarations: [ UsersComponent ],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: DebtsService, useValue: debtsService }
      ]
    })
    .compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    debtsServiceSpy = TestBed.inject(DebtsService) as jasmine.SpyObj<DebtsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUser method on UsersService when add method is called', () => {
    component.add('John Doe', '1112223333');
    expect(usersServiceSpy.addUser).toHaveBeenCalled();
  });

  it('should call reset method on DebtsService when add method is called', () => {
    component.add('John Doe', '1112223333');
    expect(debtsServiceSpy.reset).toHaveBeenCalled();
  });

  it('should call checkIfNameExist method on UsersService when add method is called', () => {
    component.add('John Doe', '1112223333');
    expect(usersServiceSpy.checkIfNameExist).toHaveBeenCalled();
  });

});
