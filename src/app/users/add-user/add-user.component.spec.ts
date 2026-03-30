import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AddUserComponent } from './add-user.component';
import { UsersService } from '@users/shared/users.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let usersServiceSpy: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const usersServiceMock = {
      getIterableUsers: jest.fn().mockReturnValue(of([])),
      checkIfNameExist: jest.fn().mockReturnValue(of(false)),
      addUser: jest.fn().mockReturnValue(of(true)),
    };

    await TestBed.configureTestingModule({
      imports: [
        AddUserComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    usersServiceSpy = TestBed.inject(UsersService) as jest.Mocked<UsersService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUser method on UsersService when onSubmit is called', async () => {
    component.userForm.patchValue({ user: 'John Doe' });
    await component.onSubmit();
    expect(usersServiceSpy.addUser).toHaveBeenCalledWith('John Doe');
  });
});
