import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '',   component: MainComponent, pathMatch: 'full' },
  { path: 'expense',   component: AddExpenseComponent },
  { path: 'debts/:id', component: DebtsDetailComponent },
  { path: 'details', component: ExpensesListComponent },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'forecast', loadChildren: () => import('./forecast/forecast.module').then(m => m.ForecastModule) },
  { path: 'stats', loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule) },
  { path: 'settings', loadChildren: () => import('./options/options.module').then(m => m.OptionsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
