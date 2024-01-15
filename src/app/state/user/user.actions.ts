import { createAction, props } from '@ngrx/store';
import { User } from '@shared/models/models';

export const addUser = createAction('[User] Add User', props<{ user: User }>());

export const removeUser = createAction(
  '[Users] Remove User',
  props<{ id: string }>(),
);

export const updateUser = createAction(
  '[Users] Update User',
  props<{ user: User }>(),
);

export const resetUsers = createAction('[Users] Reset Users');

export const addUsers = createAction(
  '[Users] Add Users',
  props<{ users: Map<string, User> }>(),
);
