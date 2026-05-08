import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@shared/models';
import { UsersService } from '@users/shared/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globalToast, openSnackBar } from '@shared/utils';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class UsersListComponent {
  private userService = inject(UsersService);
  private _snackBar = inject(MatSnackBar);

  private toastmsg = {
    OK: $localize`Guardado correctamente`,
    KO: $localize`Error fatal`,
    EXIST: $localize`Usuario ya existe`,
  };

  users = toSignal(this.userService.getIterableUsers());

  edit(data: HTMLElement, user: User, fieldToEdit: 'phone' | 'name') {
    const oldValue = user[fieldToEdit];
    const newValue = data.innerText.trim();

    if (newValue && oldValue != newValue) {
      user[fieldToEdit] = newValue;
      this.userService.editUser(user);
      openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
    } else {
      data.innerText = oldValue ?? '';
    }
  }

  delete(userId: string) {
    this.userService.removeUser(userId);
    openSnackBar(this._snackBar, globalToast.OK, 'Usuario borrado');
  }
}
