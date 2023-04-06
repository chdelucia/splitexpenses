import { Component } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { User } from 'src/app/shared/models';
import { UsersService } from '../shared/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globalToast, openSnackBar } from 'src/app/shared/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  userForm = this.fb.group({
    user: ['', [Validators.required]],
    phone: ['']
  });

  private toastmsg =  {
    OK : $localize`Guardado correctamente`,
    KO : $localize`Error fatal`,
    EXIST: $localize`Usuario ya existe`
  }

  constructor(
    private userService: UsersService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
    ) {}

  ngOnInit(): void {}


  async onSubmit(userForm: any) {
    const {user, phone} = userForm
    let nameExist = await firstValueFrom(this.userService.checkIfNameExist(user));
    if(nameExist){
      openSnackBar(this._snackBar, globalToast.EXIST, this.toastmsg.EXIST);
      return;
    }

    const userObj: User = {
      id: '',
      name: user,
      phone: phone
    }

    this.userService.addUser(userObj);
    openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
    this.resetForm();

  }

  private resetForm(): void {
    this.userForm.reset();

  }
}
