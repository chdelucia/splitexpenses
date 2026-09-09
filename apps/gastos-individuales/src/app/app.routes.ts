import { Routes } from '@angular/router';
import { AddExpenseComponent } from '@expenses/add-expense/add-expense.component';
import { ExpensesListComponent } from '@expenses/expenses-list/expenses-list.component';
import { StatsComponent } from '@stats/stats.component';
import { OptionsComponent } from '@settings/options.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'personal',
    pathMatch: 'full',
  },
  {
    path: 'personal',
    component: AddExpenseComponent,
    data: { individualMode: true },
  },
  {
    path: 'personal/details',
    component: ExpensesListComponent,
    data: { individualMode: true, monthlyFilter: true, basePath: '/personal' },
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
    redirectTo: 'personal',
  },
];
