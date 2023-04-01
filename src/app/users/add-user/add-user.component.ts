import { Component } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { User } from 'src/app/shared/models';
import { UsersService } from '../shared/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globalToast, openSnackBar } from 'src/app/shared/utils';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
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

}
