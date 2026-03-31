import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '@users/shared/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globalToast, openSnackBar } from '@shared/utils';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '@shared/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class AddUserComponent {
  private userService = inject(UsersService);
  private _snackBar = inject(MatSnackBar);
  userForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
  });

  private toastmsg = {
    OK: $localize`Guardado correctamente`,
    KO: $localize`Error fatal`,
    EXIST: $localize`Usuario ya existe`,
  };

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
