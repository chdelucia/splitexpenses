import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersListComponent } from './users-list/users-list.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [RouterModule, AddUserComponent, UsersListComponent],
})
export class UsersComponent {}
