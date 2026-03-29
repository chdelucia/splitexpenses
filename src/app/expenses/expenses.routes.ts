import { Routes } from '@angular/router';

export const EXPENSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./add-expense/add-expense.component').then(
        (m) => m.AddExpenseComponent,
      ),
  },
  {
    path: 'details',
    loadComponent: () =>
      import('./expenses-list/expenses-list.component').then(
        (m) => m.ExpensesListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./add-expense/add-expense.component').then(
        (m) => m.AddExpenseComponent,
      ),
  },
];
