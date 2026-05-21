import { Routes } from '@angular/router';
import { AddExpenseComponent } from '../expenses/add-expense/add-expense.component';
import { ExpensesListComponent } from '../expenses/expenses-list/expenses-list.component';
import { contextGuard } from '@core/guards/context.guard';

export const routes: Routes = [
  {
    path: '',
    component: AddExpenseComponent,
    canActivate: [contextGuard],
    data: { context: 'personal', individualMode: true },
  },
  {
    path: 'details',
    component: ExpensesListComponent,
    canActivate: [contextGuard],
    data: {
      context: 'personal',
      individualMode: true,
      monthlyFilter: true,
      basePath: '/personal',
    },
  },
  {
    path: ':id',
    component: AddExpenseComponent,
    canActivate: [contextGuard],
    data: { context: 'personal', individualMode: true },
  },
];
