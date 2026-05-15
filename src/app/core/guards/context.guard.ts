import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ExpensesService } from '@expenses/shared/expenses.service';

export const contextGuard: CanActivateFn = (route) => {
  const expenseService = inject(ExpensesService);
  const context = route.data['context'];
  if (context) {
    expenseService.switchContext(context);
  }
  return true;
};
