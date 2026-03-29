import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map, zip } from 'rxjs';
import { UsersService } from '@users/shared/users.service';
import { ExpensesService } from '@expenses/shared/expenses.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UsersService);
  const expenseService = inject(ExpensesService);

  const currentUser$ = userService.getUsers();
  const currentExpense$ = expenseService.getExpenses();

  return zip([currentUser$, currentExpense$]).pipe(
    map(() => {
      return true;
    }),
  );
};
