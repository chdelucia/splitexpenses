import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '',   component: MainComponent, pathMatch: 'full' },
  { path: 'debts/:id', component: DebtsDetailComponent },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'forecast', loadChildren: () => import('./forecast/forecast.module').then(m => m.ForecastModule) },
  { path: 'stats', loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule) },
  { path: 'settings', loadChildren: () => import('./settings/options.module').then(m => m.OptionsModule) },
  { path: 'expense', loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
