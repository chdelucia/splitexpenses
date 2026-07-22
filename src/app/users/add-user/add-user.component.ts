import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '@users/shared/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globalToast, openSnackBar } from '@shared/utils';
import { form, FormField, required } from '@angular/forms/signals';
import { User } from '@shared/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  standalone: true,
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AddUserComponent {
  private userService = inject(UsersService);
  private _snackBar = inject(MatSnackBar);

  userModel = signal({
    user: '',
    phone: '',
  });

  userForm = form(this.userModel, (path) => {
    required(path.user);
  });

  private toastmsg = {
    OK: $localize`Guardado correctamente`,
    KO: $localize`Error fatal`,
    EXIST: $localize`Usuario ya existe`,
  };

  async onSubmit() {
    const formData = this.userModel();
    if (formData.user) {
      const nameExist = await firstValueFrom(
        this.userService.checkIfNameExist(formData.user),
      );
      if (nameExist) {
        openSnackBar(this._snackBar, globalToast.EXIST, this.toastmsg.EXIST);
        return;
      }

      const userObj: User = {
        id: '',
        name: formData.user,
        phone: formData.phone || undefined,
      };

      this.userService.addUser(userObj);
      openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.userForm().reset({ user: '', phone: '' });
  }
}
