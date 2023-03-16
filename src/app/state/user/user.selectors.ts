import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';
import { User } from '../../shared/models';


export const selectUserState = createFeatureSelector<UserState>('users');

export const selectUsers = createSelector(
  selectUserState,
  (state) => state
);

export const selectUserByID = (id: string) => createSelector(
  selectUsers,
  (state) => state.users.get(id)
);

export const selectIterableUsers = createSelector(
  selectUsers,
  (state) => Array.from(state.users.values())
);

