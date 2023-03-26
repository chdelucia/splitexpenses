import { Component } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DebtsService } from '../shared/debts.service';
import { User } from '../shared/models';
import { firstValueFrom, Observable } from 'rxjs';
import { UsersService } from './shared/users.service';
import { openSnackBar, globalToast } from '../shared/utils';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
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
    private debtsService: DebtsService,
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
    let nameExist = await this.userService.checkIfNameExist(name);
    if(nameExist){
      openSnackBar(this._snackBar, globalToast.EXIST, this.toastmsg.EXIST);
    } else {
      const user: User = {
        id: '',
        name: name,
        phone: phone || ''
      }
      this.userService.addUser(user);
      this.clearInput();
      openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK)
    }
    this.debtsService.reset();
  }

  async edit(data: HTMLTableCellElement, userID: string, fieldToEdit: string) {
    let newValue = data.innerText.trim();
    let user: any = await firstValueFrom(this.userService.getUserByID(userID));
    if(user && user.hasOwnProperty(fieldToEdit) && newValue) {
        if(user[fieldToEdit] != newValue) {
          user[fieldToEdit] = newValue;
          this.userService.editUser(user);
          openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
        }
    } else {
      data.innerText = user[fieldToEdit] || '';
    }
  }

  delete(name: string) {
    this.userService.removeUser(name);
    openSnackBar(this._snackBar, globalToast.OK, 'Usuario borrado');
  }

}