import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UsersService } from '@users/shared/users.service';
import { UsersListComponent } from './users-list.component';
import { signal } from '@angular/core';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let mockUsersService: any;

  beforeEach(async () => {
    mockUsersService = {
      iterableUsers: signal([]),
      getIterableUsers: jest.fn().mockReturnValue(of([])),
      removeUser: jest.fn(),
      editUser: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
