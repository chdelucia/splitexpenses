import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, zip } from 'rxjs';
import { UsersService } from '../users/shared/users.service';
import { ExpensesService } from '../expenses/shared/expenses.service';
import { Expense, User } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private userService: UsersService,
    private expenseService: ExpensesService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser$: Observable<Map<string, User>> =
      this.userService.getUsers();
    const currentExpense$: Observable<Map<string, Expense>> =
      this.expenseService.getExpenses();

    return zip([currentUser$, currentExpense$]).pipe(
      map(([currentUser, currentExpense]) => {
        if (
          currentUser.size &&
          currentExpense.size &&
          state.url !== '/welcome'
        ) {
          return true;
        } else if (state.url === '/welcome') {
          if (currentUser.size && currentExpense.size) {
            this.router.navigate(['/debts']);
            return false;
          }
          return true;
        } else {
          this.router.navigate(['/welcome']);
          return false;
        }
      }),
    );
  }
}
