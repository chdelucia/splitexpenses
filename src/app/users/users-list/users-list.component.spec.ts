import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UsersService } from '@users/shared/users.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  beforeEach(async () => {
    const usersServiceMock = {
      getIterableUsers: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [UsersListComponent, NoopAnimationsModule],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
