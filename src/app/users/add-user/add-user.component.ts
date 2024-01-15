import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '@users/shared/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globalToast, openSnackBar } from '@shared/utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@shared/models';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent {
  userForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
  });

  private toastmsg = {
    OK: $localize`Guardado correctamente`,
    KO: $localize`Error fatal`,
    EXIST: $localize`Usuario ya existe`,
  };

  constructor(
    private userService: UsersService,
    private _snackBar: MatSnackBar,
  ) {}

  async onSubmit() {
    if (this.userForm.value.user) {
      const { user, phone } = this.userForm.value;
      const nameExist = await firstValueFrom(
        this.userService.checkIfNameExist(user),
      );
      if (nameExist) {
        openSnackBar(this._snackBar, globalToast.EXIST, this.toastmsg.EXIST);
        return;
      }

      const userObj: User = {
        id: '',
        name: user,
        phone: phone || undefined,
      };

      this.userService.addUser(userObj);
      openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.userForm.reset();
  }
}
