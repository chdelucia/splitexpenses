import { Routes } from '@angular/router';

export const DEBTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./debts.component').then((m) => m.DebtsComponent),
  },
  {
    path: 'details',
    loadComponent: () =>
      import('./debts-detail/debts-detail.component').then(
        (m) => m.DebtsDetailComponent,
      ),
  },
];
