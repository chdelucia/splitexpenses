import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '@users/shared/users.service';
import { openSnackBar, globalToast } from '@shared/utils';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AddUserComponent {
  private usersService = inject(UsersService);
  private _snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  userForm: FormGroup = this.fb.group({
    user: ['', Validators.required],
    phone: [''],
  });

  private toastmsg = {
    OK: $localize`Usuario añadido correctamente`,
    KO: $localize`Error fatal`,
    EXIST: $localize`El usuario ya existe`,
  };

  onSubmit() {
    if (this.userForm.invalid) return;

    const userName = this.userForm.value.user;
    this.usersService.addUser(userName).subscribe({
      next: (success: boolean) => {
        if (success) {
          openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
          this.userForm.reset();
        } else {
          openSnackBar(this._snackBar, globalToast.KO, this.toastmsg.EXIST);
        }
      },
      error: () => {
        openSnackBar(this._snackBar, globalToast.KO, this.toastmsg.KO);
      },
    });
  }
}
