import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';

import { UsersComponent } from './users.component';
import { UsersService } from './shared/users.service';
import { User } from '../shared/models';
import { userReducer, UserState } from '../state/user/user.reducer';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: Store<UserState>;

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
      declarations: [ UsersComponent ],
      providers: [
        { provide: UsersService, useValue: usersService },
      ]
    })
    .compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
