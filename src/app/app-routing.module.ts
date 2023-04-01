import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebtsDetailComponent } from './debts/debts-detail/debts-detail.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '',   component: MainComponent, pathMatch: 'full' },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'forecast', loadChildren: () => import('./forecast/forecast.module').then(m => m.ForecastModule) },
  { path: 'stats', loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule) },
  { path: 'settings', loadChildren: () => import('./settings/options.module').then(m => m.OptionsModule) },
  { path: 'expense', loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule) },
  { path: 'debts', loadChildren: () => import('./debts/debts.module').then(m => m.DebtsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
