import { Component } from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { DebtsService } from '../shared/debts.service';
import { User } from '../shared/models';
import { UsersService } from '../shared/users.service';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent {

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
      this.openSnackBar('usario ya existe');
    } else {
      const user: User = {
        id: '',
        name: name,
        phone: phone || ''
      }
      this.userService.addUser(user);
      this.clearInput();
    }
    this.debtsService.reset();
    this.openSnackBar('Usuario creado correctamente');
  }

  async edit(data: HTMLTableCellElement, userID: string, fieldToEdit: string) {
    let newValue = data.innerText.trim();
    let user: any = await firstValueFrom(this.userService.getUserByID(userID));
    if(user && user.hasOwnProperty(fieldToEdit) && newValue) {
        if(user[fieldToEdit] != newValue) {
          user[fieldToEdit] = newValue;
          this.userService.editUser(user);
          this.openSnackBar('Usuario editado');
        }
    } else {
      data.innerText = user[fieldToEdit] || '';
    }
  }

  delete(name: string) {
    this.userService.removeUser(name);
    this.openSnackBar('Usuario borrado');
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Ok', {
      duration: 4000,
      panelClass: ['blue-snackbar']
    });
  }

}
