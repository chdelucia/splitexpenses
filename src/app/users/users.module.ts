import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from './shared/users.service';
import { UsersListComponent } from './users-list/users-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [UsersComponent, UsersListComponent, AddUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [UsersService],
  exports: [AddUserComponent],
})
export class UsersModule {}
