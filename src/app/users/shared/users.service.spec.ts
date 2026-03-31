import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Store } from '@ngrx/store';
import { addUser, updateUser, addUsers } from '@state/user/user.actions';
import { of, BehaviorSubject } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let storageServiceSpy: jest.Mocked<LocalstorageService>;
  let storeSpy: jest.Mocked<Store>;
  let usersSubject: BehaviorSubject<any>;

  beforeEach(() => {
    usersSubject = new BehaviorSubject({});
    const storageSpy = {
      getData: jest.fn().mockReturnValue({ users: {} }),
      saveDataToLocalStorage: jest
        .fn()
        .mockImplementation(() => Promise.resolve()),
    } as unknown as jest.Mocked<LocalstorageService>;

    const storeSpyInternal = {
      select: jest.fn().mockReturnValue(usersSubject.asObservable()),
      dispatch: jest.fn(),
    } as unknown as jest.Mocked<Store>;

    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: LocalstorageService, useValue: storageSpy },
        { provide: Store, useValue: storeSpyInternal },
      ],
    });

    storageServiceSpy = TestBed.inject(
      LocalstorageService,
    ) as jest.Mocked<LocalstorageService>;
    storeSpy = TestBed.inject(Store) as jest.Mocked<Store>;
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(addUsers({ users: {} }));
  });

  describe('getUsers', () => {
    it('should return an observable of users map', (done: jest.DoneCallback) => {
      const expectedMap = {
        id1: { id: 'id1', name: 'Alice' },
      };
      usersSubject.next(expectedMap);

      service.getUsers().subscribe((map) => {
        expect(map).toEqual(expectedMap);
        done();
      });
    });
  });

  describe('getUserByID', () => {
    it('should return an observable of user', (done: jest.DoneCallback) => {
      const expectedUser = { id: 'id1', name: 'Alice' };
      usersSubject.next(expectedUser);

      service.getUserByID('id1').subscribe((user) => {
        expect(user).toEqual(expectedUser);
        done();
      });
    });
  });

  describe('getIterableUsers', () => {
    it('should return an observable of iterable users', (done: jest.DoneCallback) => {
      const expectedIterableUsers = [{ id: 'id1', name: 'Alice' }];
      usersSubject.next(expectedIterableUsers);

      service.getIterableUsers().subscribe((iterableUsers) => {
        expect(iterableUsers).toEqual(expectedIterableUsers);
        done();
      });
    });
  });

  describe('editUser', () => {
    it('should dispatch an updateUser action and save users into local storage', async () => {
      const user = { id: 'id1', name: 'Alice', email: '', image: '' };
      usersSubject.next({ [user.id]: user });

      service.editUser(user);

      expect(storeSpy.dispatch).toHaveBeenCalledWith(updateUser({ user }));
      // Wait for async saveUsersIntoLocalStorage
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(storageServiceSpy.saveDataToLocalStorage).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should dispatch an addUser action and save users into local storage', async () => {
      const user = { id: 'id1', name: 'Alice', email: '', image: '' };
      const users = {
        '0': { id: '0', name: 'Bob', email: '', image: '' },
      };

      usersSubject.next(users);

      await service.addUser(user);

      expect(user.id).toEqual('1');
      expect(storeSpy.dispatch).toHaveBeenCalledWith(addUser({ user }));

      // Wait for async saveUsersIntoLocalStorage called inside addUser
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(storageServiceSpy.saveDataToLocalStorage).toHaveBeenCalledWith(
        users,
      );
    });
  });
});
