import { createReducer, on } from '@ngrx/store';
import { addUser, addUsers, editUser, removeUser, resetUsers, updateUser } from './user.actions';
import { User } from '../../shared/models';

export interface UserState {
  users: Map<string, User>;
}

const initialState: UserState = {
  users: new Map<string, User>(),
};

export const userReducer = createReducer(
  initialState,
  on(addUser, (state, { user }) => ({
    ...state,
    users: new Map<string, User>([...state.users, [user.id, user]])
  })),
  on(editUser, (state, { user }) => {
    const newUsers = new Map<string, User>([...state.users]);
    newUsers.set(user.id, user);
    return {
      ...state,
      users: newUsers,
    };
  }),
  on(removeUser, (state, { id }) => {
    const newUsers = new Map<string, User>([...state.users]);
    newUsers.delete(id);
    return {
      ...state,
      users: newUsers,
    };
  }),
  on(updateUser, (state, { user }) => {
    const newUsers = new Map<string, User>([...state.users]);
    newUsers.set(user.id, user);
    return {
      ...state,
      users: newUsers,
    };
  }),
  on(addUsers, (state, { users }) => ({
    ...state,
    users: new Map([...state.users, ...users])
  })),
  on(resetUsers, () => {
    return initialState;
  })

);
