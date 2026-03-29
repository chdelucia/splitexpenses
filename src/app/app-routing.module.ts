import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/expense', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
    canActivate: [authGuard],
  },
  {
    path: 'forecast',
    loadChildren: () =>
      import('./forecast/forecast.module').then((m) => m.ForecastModule),
    canActivate: [authGuard],
  },
  {
    path: 'stats',
    loadChildren: () =>
      import('./stats/stats.module').then((m) => m.StatsModule),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/options.module').then((m) => m.OptionsModule),
    canActivate: [authGuard],
  },
  {
    path: 'expense',
    loadChildren: () =>
      import('./expenses/expenses.module').then((m) => m.ExpensesModule),
    canActivate: [authGuard],
  },
  {
    path: 'debts',
    loadChildren: () =>
      import('./debts/debts.module').then((m) => m.DebtsModule),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      useHash: true,
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
