import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { LocalstorageService } from '../../shared/localstorage.service';
import { Store } from '@ngrx/store';
import { User } from '../../shared/models';
import { addUser, updateUser } from '../../state/user/user.actions';

describe('UsersService', () => {
  let service: UsersService;
  let storageServiceSpy: jasmine.SpyObj<LocalstorageService>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('LocalstorageService', [
      'getData',
      'saveDataToLocalStorage',
    ]);
    let storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: LocalstorageService, useValue: storageSpy },
        { provide: Store, useValue: storeSpy },
      ],
    });

    service = TestBed.inject(UsersService);
    storageServiceSpy = TestBed.inject(
      LocalstorageService,
    ) as jasmine.SpyObj<LocalstorageService>;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return an observable of users map', (done: DoneFn) => {
      const expectedMap = new Map<string, User>([
        ['id1', { id: 'id1', name: 'Alice' }],
      ]);
      storeSpy.select.and.returnValue(of(expectedMap));

      service.getUsers().subscribe((map) => {
        expect(map).toEqual(expectedMap);
        done();
      });
    });
  });

  describe('getUserByID', () => {
    it('should return an observable of user', (done: DoneFn) => {
      const expectedUser = { id: 'id1', name: 'Alice' };
      storeSpy.select.and.returnValue(of(expectedUser));

      service.getUserByID('id1').subscribe((user) => {
        expect(user).toEqual(expectedUser);
        done();
      });
    });
  });

  describe('getIterableUsers', () => {
    it('should return an observable of iterable users', (done: DoneFn) => {
      const expectedIterableUsers = [{ id: 'id1', name: 'Alice' }];
      storeSpy.select.and.returnValue(of(expectedIterableUsers));

      service.getIterableUsers().subscribe((iterableUsers) => {
        expect(iterableUsers).toEqual(expectedIterableUsers);
        done();
      });
    });
  });

  describe('editUser', () => {
    it('should dispatch an updateUser action and save users into local storage', async () => {
      const user = { id: 'id1', name: 'Alice' };
      storeSpy.dispatch.and.stub();

      await service.editUser(user);

      expect(storeSpy.dispatch).toHaveBeenCalledWith(updateUser({ user }));
      expect(storageServiceSpy.saveDataToLocalStorage).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should dispatch an addUser action and save users into local storage', async () => {
      const user = { id: 'id1', name: 'Alice' };
      const users = new Map<string, User>([
        ['id0', { id: 'id0', name: 'Bob' }],
      ]);
      storeSpy.select.and.returnValue(of(users));
      storeSpy.dispatch.and.stub();

      await service.addUser(user);

      expect(user.id).toEqual('id1');
      expect(storeSpy.dispatch).toHaveBeenCalledWith(addUser({ user }));
    });
  });
});
