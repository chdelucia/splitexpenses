import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Store } from '@ngrx/store';
import { addUser, updateUser } from '@state/user/user.actions';
import { of } from 'rxjs';
import { User } from '@shared/models';

describe('UsersService', () => {
  let service: UsersService;
  let storageServiceSpy: jest.Mocked<LocalstorageService>;
  let storeSpy: jest.Mocked<Store>;

  beforeEach(() => {
    const storageSpy = {
      getData: jest.fn().mockReturnValue({ users: {} }),
      saveDataToLocalStorage: jest.fn(),
    };
    const storeSpyMock = {
      select: jest.fn().mockReturnValue(of({})),
      dispatch: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: LocalstorageService, useValue: storageSpy },
        { provide: Store, useValue: storeSpyMock },
      ],
    });

    service = TestBed.inject(UsersService);
    storageServiceSpy = TestBed.inject(LocalstorageService) as jest.Mocked<LocalstorageService>;
    storeSpy = TestBed.inject(Store) as jest.Mocked<Store>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return an observable of users map', (done) => {
      const expectedMap = {
        id1: { id: 'id1', name: 'Alice' },
      };
      storeSpy.select.mockReturnValue(of(expectedMap));

      service.getUsers().subscribe((map) => {
        expect(map).toEqual(expectedMap);
        done();
      });
    });
  });

  describe('getUserByID', () => {
    it('should return an observable of user', (done) => {
      const expectedUser = { id: 'id1', name: 'Alice' };
      storeSpy.select.mockReturnValue(of(expectedUser));

      service.getUserByID('id1').subscribe((user) => {
        expect(user).toEqual(expectedUser);
        done();
      });
    });
  });

  describe('getIterableUsers', () => {
    it('should return an observable of iterable users', (done) => {
      const expectedIterableUsers = [{ id: 'id1', name: 'Alice' }];
      storeSpy.select.mockReturnValue(of(expectedIterableUsers));

      service.getIterableUsers().subscribe((iterableUsers) => {
        expect(iterableUsers).toEqual(expectedIterableUsers);
        done();
      });
    });
  });

  describe('editUser', () => {
    it('should dispatch an updateUser action and save users into local storage', () => {
      const user = { id: 'id1', name: 'Alice' };
      storeSpy.select.mockReturnValue(of({ [user.id]: user }));

      service.editUser(user);

      expect(storeSpy.dispatch).toHaveBeenCalledWith(updateUser({ user }));
      expect(storageServiceSpy.saveDataToLocalStorage).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should dispatch an addUser action and save users into local storage', (done) => {
      const userName = 'Alice';
      const users = {
        '0': { id: '0', name: 'Bob' },
      };
      // Mock checkIfNameExist to return false
      storeSpy.select.mockReturnValueOnce(of(false));
      // Mock users$ to return users
      storeSpy.select.mockReturnValueOnce(of(users));

      service.addUser(userName).subscribe((success) => {
        expect(success).toBe(true);
        expect(storeSpy.dispatch).toHaveBeenCalledWith(
          addUser({ user: { id: '1', name: userName } })
        );
        done();
      });
    });
  });
});
