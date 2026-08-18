import { TestBed } from '@angular/core/testing';
import { UserStore } from './user.store';
import { User } from '@shared/models';

describe('UserStore', () => {
  let store: InstanceType<typeof UserStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStore],
    });
    store = TestBed.inject(UserStore);
  });

  it('should initialize with empty state', () => {
    expect(store.users()).toEqual({});
    expect(store.iterableUsers()).toEqual([]);
    expect(store.userCount()).toBe(0);
  });

  it('should add a user', () => {
    const user: User = { id: 'u1', name: 'User 1' };
    store.addUser(user);

    expect(store.users()).toEqual({ u1: user });
    expect(store.iterableUsers()).toEqual([user]);
    expect(store.userCount()).toBe(1);
  });

  it('should add multiple users', () => {
    const users = {
      u1: { id: 'u1', name: 'User 1' },
      u2: { id: 'u2', name: 'User 2' },
    };
    store.addUsers(users);

    expect(store.userCount()).toBe(2);
  });

  it('should update a user', () => {
    const user: User = { id: 'u1', name: 'User 1' };
    store.addUser(user);

    const updatedUser: User = { id: 'u1', name: 'User One' };
    store.updateUser(updatedUser);

    expect(store.users()['u1'].name).toBe('User One');
  });

  it('should remove a user', () => {
    const user: User = { id: 'u1', name: 'User 1' };
    store.addUser(user);
    store.removeUser('u1');

    expect(store.userCount()).toBe(0);
  });

  it('should reset users', () => {
    store.addUser({ id: 'u1', name: 'User 1' });
    store.resetUsers();

    expect(store.users()).toEqual({});
  });
});
