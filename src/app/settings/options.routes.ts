import { Routes } from '@angular/router';

export const OPTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./options.component').then((m) => m.OptionsComponent),
    children: [
      { path: '', redirectTo: 'currency', pathMatch: 'full' },
      {
        path: 'currency',
        loadComponent: () =>
          import('./settings-currency/settings-currency.component').then(
            (m) => m.SettingsCurrencyComponent,
          ),
      },
      {
        path: 'travel',
        loadComponent: () =>
          import('./settings-travel/settings-travel.component').then(
            (m) => m.SettingsTravelComponent,
          ),
      },
      {
        path: 'weather',
        loadComponent: () =>
          import('./settings-weather/settings-weather.component').then(
            (m) => m.SettingsWeatherComponent,
          ),
      },
      {
        path: 'graph',
        loadComponent: () =>
          import('./settings-graph/settings-graph.component').then(
            (m) => m.SettingsGraphComponent,
          ),
      },
      {
        path: 'backup',
        loadComponent: () =>
          import('./settings-backup/settings-backup.component').then(
            (m) => m.SettingsBackupComponent,
          ),
      },
      {
        path: 'upload',
        loadComponent: () =>
          import('./settings-upload/settings-upload.component').then(
            (m) => m.SettingsUploadComponent,
          ),
      },
    ],
  },
];
