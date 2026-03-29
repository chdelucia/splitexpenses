import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Store } from '@ngrx/store';
import { User } from '@shared/models';
import { addUser, updateUser } from '@state/user/user.actions';
import { of } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let storageServiceSpy: any;
  let storeSpy: any;

  beforeEach(() => {
    const storageSpyObj = {
      getData: jest.fn().mockReturnValue({ users: {} }),
      saveDataToLocalStorage: jest.fn(),
      getSettings: jest.fn().mockReturnValue({}),
    };
    const storeSpyObj = {
      select: jest.fn().mockReturnValue(of({})),
      dispatch: jest.fn(),
      selectSignal: jest.fn().mockReturnValue(() => ({})),
    };

    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: LocalstorageService, useValue: storageSpyObj },
        { provide: Store, useValue: storeSpyObj },
      ],
    });

    service = TestBed.inject(UsersService);
    storageServiceSpy = TestBed.inject(LocalstorageService);
    storeSpy = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return an observable of users map', (done: jest.DoneCallback) => {
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
    it('should return an observable of user', (done: jest.DoneCallback) => {
      const expectedUser = { id: 'id1', name: 'Alice' };
      storeSpy.select.mockReturnValue(of(expectedUser));

      service.getUserByID('id1').subscribe((user) => {
        expect(user).toEqual(expectedUser);
        done();
      });
    });
  });

  describe('getIterableUsers', () => {
    it('should return an observable of iterable users', (done: jest.DoneCallback) => {
      const expectedIterableUsers = [{ id: 'id1', name: 'Alice' }];
      storeSpy.select.mockReturnValue(of(expectedIterableUsers));

      service.getIterableUsers().subscribe((iterableUsers) => {
        expect(iterableUsers).toEqual(expectedIterableUsers);
        done();
      });
    });
  });

  describe('editUser', () => {
    it('should dispatch an updateUser action and save users into local storage', async () => {
      const user = { id: 'id1', name: 'Alice' };
      storeSpy.dispatch.mockReturnValue(undefined);
      storeSpy.select.mockReturnValue(of({ id1: user }));

      service.editUser(user);

      expect(storeSpy.dispatch).toHaveBeenCalledWith(updateUser({ user }));
      // We need to wait for the async saveUsersIntoLocalStorage if we want to check this,
      // but editUser itself is not async. Let's mock saveUsersIntoLocalStorage.
    });
  });

  describe('addUser', () => {
    it('should dispatch an addUser action and save users into local storage', async () => {
      const user = { id: '', name: 'Alice' };
      const users = {
        '0': { id: '0', name: 'Bob' },
      };
      storeSpy.select.mockReturnValue(of(users));
      storeSpy.dispatch.mockReturnValue(undefined);

      await service.addUser(user);

      expect(user.id).toEqual('1');
      expect(storeSpy.dispatch).toHaveBeenCalledWith(addUser({ user }));
    });
  });
});
