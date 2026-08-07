import { createReducer, on } from '@ngrx/store';
import {
  addUser,
  addUsers,
  removeUser,
  resetUsers,
  updateUser,
} from './user.actions';
import { User } from '@shared/models';

export interface UserState {
  users: Record<string, User>;
}

const initialState: UserState = {
  users: {},
};

export const userReducer = createReducer(
  initialState,
  on(
    addUser,
    (state, { user }): UserState => ({
      ...state,
      users: { ...state.users, [user.id]: user },
    }),
  ),
  on(removeUser, (state, { id }): UserState => {
    const newUsers = { ...state.users };
    delete newUsers[id];
    return {
      ...state,
      users: newUsers,
    };
  }),
  on(updateUser, (state, { user }): UserState => {
    return {
      ...state,
      users: { ...state.users, [user.id]: user },
    };
  }),
  on(
    addUsers,
    (state, { users }): UserState => ({
      ...state,
      users: { ...state.users, ...users },
    }),
  ),
  on(resetUsers, (): UserState => {
    return initialState;
  }),
);
