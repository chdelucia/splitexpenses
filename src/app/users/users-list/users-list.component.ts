import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models';
import { UsersService } from '../shared/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globalToast, openSnackBar } from 'src/app/shared/utils';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  private toastmsg =  {
    OK : $localize`Guardado correctamente`,
    KO : $localize`Error fatal`,
    EXIST: $localize`Usuario ya existe`
  }

  users$: Observable<User[]>;

  constructor(
    private userService: UsersService,
    private _snackBar: MatSnackBar
    ) {
    this.users$ = this.userService.getIterableUsers();
   }

  ngOnInit(): void {
  }

  edit(data: HTMLTableCellElement, user: User, fieldToEdit: "phone" | "name") {
    let oldValue =  user[fieldToEdit];
    const newValue = data.innerText.trim();

    if(newValue && (oldValue != newValue)) {
          user[fieldToEdit] = newValue;
          this.userService.editUser(user);
          openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
    } else {
      data.innerText = oldValue || '';
    }
  }

  delete(name: string) {
    this.userService.removeUser(name);
    openSnackBar(this._snackBar, globalToast.OK, 'Usuario borrado');
  }
}
