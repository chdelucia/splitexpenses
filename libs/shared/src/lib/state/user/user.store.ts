import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { User } from '@shared/models';

export interface UserState {
  users: Record<string, User>;
}

const initialState: UserState = {
  users: {},
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ users }) => {
    const iterableUsers = computed(() => Object.values(users()));
    const userCount = computed(() => iterableUsers().length);

    return {
      iterableUsers,
      userCount,
    };
  }),
  withMethods((store) => ({
    addUser(user: User): void {
      patchState(store, (state) => ({
        users: { ...state.users, [user.id]: user },
      }));
    },
    addUsers(users: Record<string, User>): void {
      patchState(store, (state) => ({
        users: { ...state.users, ...users },
      }));
    },
    updateUser(user: User): void {
      patchState(store, (state) => ({
        users: { ...state.users, [user.id]: user },
      }));
    },
    removeUser(id: string): void {
      patchState(store, (state) => {
        const newUsers = { ...state.users };
        delete newUsers[id];
        return { users: newUsers };
      });
    },
    resetUsers(): void {
      patchState(store, { users: {} });
    },
  })),
);
