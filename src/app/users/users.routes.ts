import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./users-list/users-list.component').then(
        (m) => m.UsersListComponent,
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-user/add-user.component').then((m) => m.AddUserComponent),
  },
];
