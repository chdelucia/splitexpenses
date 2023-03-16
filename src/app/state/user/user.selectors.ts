import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';
import { User } from '../../shared/models';


export const selectUserState = createFeatureSelector<UserState>('users');

export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);

export const selectUserByID = (id: string) => createSelector(
  selectUsers,
  (users) => users.get(id)
);

export const selectIterableUsers = createSelector(
  selectUsers,
  (users) => Array.from(users.values())
);

export const selectUserCount = createSelector(
  selectIterableUsers,
  (users) => users.length
);
