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

}
