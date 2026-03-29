/* eslint-disable no-console */
/// <reference types="@angular/localize" />

import { enableProdMode, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from '@env/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { userReducer } from '@state/user/user.reducer';
import { expensesReducer } from '@state/expenses/expenses.reducer';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { authGuard } from '@core/guards/auth.guard';
import { Route } from '@angular/router';

if (environment.production) {
  enableProdMode();
}

const routes: Route[] = [
  { path: '', redirectTo: '/expense', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () =>
      import('./app/users/users.routes').then((m) => m.USERS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'forecast',
    loadChildren: () =>
      import('./app/forecast/forecast.routes').then((m) => m.FORECAST_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'stats',
    loadChildren: () =>
      import('./app/stats/stats.routes').then((m) => m.STATS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./app/settings/options.routes').then((m) => m.OPTIONS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'expense',
    loadChildren: () =>
      import('./app/expenses/expenses.routes').then((m) => m.EXPENSES_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'debts',
    loadChildren: () =>
      import('./app/debts/debts.routes').then((m) => m.DEBTS_ROUTES),
    canActivate: [authGuard],
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes,
      withHashLocation(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideStore({ users: userReducer, expenses: expensesReducer }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: false,
      trace: true,
      traceLimit: 75,
    }),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
  ],
}).catch((err) => console.error(err));
