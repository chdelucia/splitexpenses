import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../shared/users.service';
import { openSnackBar, globalToast } from '@shared/utils';
import { User } from '@shared/models';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class UsersListComponent {
  private usersService = inject(UsersService);
  private _snackBar = inject(MatSnackBar);

  users = toSignal(this.usersService.getIterableUsers(), { initialValue: [] });

  private toastmsg = {
    OK: $localize`Usuario eliminado correctamente`,
    KO: $localize`Error fatal`,
  };

  delete(userId: string) {
    this.usersService.deleteUser(userId);
    openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
  }

  edit(cell: HTMLElement, user: User, field: 'name' | 'phone') {
    const newValue = cell.innerText.trim();
    if (field === 'name') {
      this.usersService.editUser({ ...user, name: newValue });
    } else if (field === 'phone') {
      this.usersService.editUser({ ...user, phone: newValue });
    }
  }
}
