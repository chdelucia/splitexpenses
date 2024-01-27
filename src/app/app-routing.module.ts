import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'forecast',
    loadChildren: () =>
      import('./forecast/forecast.module').then((m) => m.ForecastModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'stats',
    loadChildren: () =>
      import('./stats/stats.module').then((m) => m.StatsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/options.module').then((m) => m.OptionsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'expense',
    loadChildren: () =>
      import('./expenses/expenses.module').then((m) => m.ExpensesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'debts',
    loadChildren: () =>
      import('./debts/debts.module').then((m) => m.DebtsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomeModule),
    canActivate: [AuthGuard],
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
