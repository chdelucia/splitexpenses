/* eslint-disable no-console */
/// <reference types="@angular/localize" />

import { enableProdMode, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { environment } from '@env/environment';
import {
  provideRouter,
  withHashLocation,
  withComponentInputBinding,
  withInMemoryScrolling,
  Routes,
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { userReducer } from '@state/user/user.reducer';
import { expensesReducer } from './app/state/expenses/expenses.reducer';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { authGuard } from './app/core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/expense', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () =>
      import('./app/users/users.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'forecast',
    loadChildren: () =>
      import('./app/forecast/forecast.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'stats',
    loadChildren: () =>
      import('./app/stats/stats.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./app/settings/options.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'expense',
    loadChildren: () =>
      import('./app/expenses/expenses.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'debts',
    loadChildren: () =>
      import('./app/debts/debts.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideStore({ users: userReducer, expenses: expensesReducer }),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: false,
      trace: true,
      traceLimit: 75,
    }),
  ],
}).catch((err) => console.error(err));
