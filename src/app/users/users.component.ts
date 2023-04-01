import { Component } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { User } from '../shared/models';
import { firstValueFrom, Observable } from 'rxjs';
import { UsersService } from './shared/users.service';
import { openSnackBar, globalToast } from '../shared/utils';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
   private toastmsg =  {
    OK : $localize`Guardado correctamente`,
    KO : $localize`Error fatal`,
    EXIST: $localize`Usuario ya existe`
  }

  inputValue = '';
  inputPhone = '';
  users$: Observable<User[]>;

  constructor(
    private userService: UsersService,
    private _snackBar: MatSnackBar
    ) {
    this.users$ = this.userService.getIterableUsers();
   }

  ngOnInit(): void {
  }

  clearInput():void {
    this.inputValue = '';
    this.inputPhone = '';
  }

  async add(name: string, phone?: string) {
    let nameExist = await firstValueFrom(this.userService.checkIfNameExist(name));
    if(nameExist){
      openSnackBar(this._snackBar, globalToast.EXIST, this.toastmsg.EXIST);
      return;
    }

    const user: User = {
      id: '',
      name: name,
      phone: phone || ''
    }
    this.userService.addUser(user);
    this.clearInput();
    openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK)

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
