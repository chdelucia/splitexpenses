import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AddUserComponent } from './add-user/add-user.component';

export const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'list', component: UsersListComponent },
  { path: 'add', component: AddUserComponent },
];
