import { Routes } from '@angular/router';
import { AddExpenseComponent } from '@expenses/add-expense/add-expense.component';
import { ExpensesListComponent } from '@expenses/expenses-list/expenses-list.component';
import { DebtsComponent } from '@debts/debts.component';
import { UsersComponent } from '@users/users.component';
import { StatsComponent } from '@stats/stats.component';
import { OptionsComponent } from '@settings/options.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'expense',
    pathMatch: 'full',
  },
  {
    path: 'expense',
    component: AddExpenseComponent,
    data: { individualMode: false },
  },
  {
    path: 'expense/details',
    component: ExpensesListComponent,
    data: { individualMode: false, basePath: '/expense' },
  },
  {
    path: 'debts',
    component: DebtsComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: 'settings',
    component: OptionsComponent,
  },
  {
    path: '**',
    redirectTo: 'expense',
  },
];
