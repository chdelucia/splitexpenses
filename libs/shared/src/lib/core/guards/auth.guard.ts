import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsersService } from '@users/shared/users.service';
import { ExpensesService } from '@expenses/shared/expenses.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UsersService);
  const expenseService = inject(ExpensesService);

  const users = userService.getUsers()();
  const expenses = expenseService.getExpenses()();

  return !!users && !!expenses;
};