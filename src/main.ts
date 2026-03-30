import { enableProdMode, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation, withRouterConfig, withComponentInputBinding } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppComponent } from './app/app.component';
import { environment } from '@env/environment';
import { userReducer } from '@state/user/user.reducer';
import { expensesReducer } from '@state/expenses/expenses.reducer';
import { authGuard } from '@core/guards/auth.guard';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables()),
    provideRouter(
      [
        { path: '', redirectTo: '/expense', pathMatch: 'full' },
        {
          path: 'users',
          loadChildren: () => import('./app/users/users.routes').then(m => m.USERS_ROUTES),
          canActivate: [authGuard],
        },
        {
          path: 'forecast',
          loadComponent: () => import('./app/forecast/forecast.component').then(m => m.ForecastComponent),
          canActivate: [authGuard],
        },
        {
          path: 'stats',
          loadComponent: () => import('./app/stats/stats.component').then(m => m.StatsComponent),
          canActivate: [authGuard],
        },
        {
          path: 'settings',
          loadChildren: () => import('./app/settings/options.routes').then(m => m.OPTIONS_ROUTES),
          canActivate: [authGuard],
        },
        {
          path: 'expense',
          loadChildren: () => import('./app/expenses/expenses.routes').then(m => m.EXPENSES_ROUTES),
          canActivate: [authGuard],
        },
        {
          path: 'debts',
          loadComponent: () => import('./app/debts/debts.component').then(m => m.DebtsComponent),
          canActivate: [authGuard],
        },
      ],
      withHashLocation(),
      withRouterConfig({  }),
      withComponentInputBinding()
    ),
    provideStore({ users: userReducer, expenses: expensesReducer }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: false,
      trace: true,
      traceLimit: 75,
    }),
  ],
}).catch((err) => console.error(err));
