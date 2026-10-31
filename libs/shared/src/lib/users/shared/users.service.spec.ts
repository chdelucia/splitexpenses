import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { UserStore } from '@state/user/user.store';
import { User } from '@shared/models';

describe('UsersService', () => {
  let service: UsersService;
  let storageServiceSpy: jest.Mocked<LocalstorageService>;
  let userStore: InstanceType<typeof UserStore>;

  beforeEach(() => {
    const storageSpy = {
      getData: jest.fn().mockReturnValue({ users: {} }),
      saveDataToLocalStorage: jest
        .fn()
        .mockImplementation(() => Promise.resolve()),
    } as unknown as jest.Mocked<LocalstorageService>;

    TestBed.configureTestingModule({
      providers: [
        UsersService,
        UserStore,
        { provide: LocalstorageService, useValue: storageSpy },
      ],
    });

    storageServiceSpy = TestBed.inject(
      LocalstorageService,
    ) as jest.Mocked<LocalstorageService>;
    userStore = TestBed.inject(UserStore);
    service = TestBed.inject(UsersService);
  });

  it('should be created and load initial users', () => {
    expect(service).toBeTruthy();
    expect(storageServiceSpy.getData).toHaveBeenCalled();
  });

  describe('getUsers', () => {
    it('should return a signal of users map', () => {
      const expectedUser: User = { id: 'id1', name: 'Alice' };
      userStore.addUser(expectedUser);

      const map = service.getUsers()();
      expect(map).toEqual({ id1: expectedUser });
    });
  });

  describe('getUserByID', () => {
    it('should return a signal of user', () => {
      const expectedUser: User = { id: 'id1', name: 'Alice' };
      userStore.addUser(expectedUser);

      const user = service.getUserByID('id1')();
      expect(user).toEqual(expectedUser);
    });
  });

  describe('getIterableUsers', () => {
    it('should return a signal of iterable users', () => {
      const expectedUser: User = { id: 'id1', name: 'Alice' };
      userStore.addUser(expectedUser);

      const iterable = service.getIterableUsers()();
      expect(iterable).toEqual([expectedUser]);
    });
  });

  describe('editUser', () => {
    it('should update user in store and save to local storage', async () => {
      const user: User = { id: 'id1', name: 'Alice' };
      userStore.addUser(user);

      const updatedUser: User = { id: 'id1', name: 'Alice Smith' };
      service.editUser(updatedUser);

      expect(userStore.users()['id1'].name).toBe('Alice Smith');
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(storageServiceSpy.saveDataToLocalStorage).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should add user to store and save to local storage', async () => {
      const user: User = { id: '', name: 'Bob' };
      await service.addUser(user);

      expect(user.id).toEqual('1');
      expect(userStore.users()['1']).toBeDefined();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(storageServiceSpy.saveDataToLocalStorage).toHaveBeenCalled();
    });
  });
});
