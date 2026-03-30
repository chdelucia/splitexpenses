import { Routes } from '@angular/router';
import { OptionsComponent } from './options.component';
import { SettingsCurrencyComponent } from './settings-currency/settings-currency.component';
import { SettingsTravelComponent } from './settings-travel/settings-travel.component';
import { SettingsWeatherComponent } from './settings-weather/settings-weather.component';
import { SettingsGraphComponent } from './settings-graph/settings-graph.component';
import { SettingsBackupComponent } from './settings-backup/settings-backup.component';
import { SettingsUploadComponent } from './settings-upload/settings-upload.component';

export const OPTIONS_ROUTES: Routes = [
  {
    path: '',
    component: OptionsComponent,
    children: [
      { path: 'currency', component: SettingsCurrencyComponent },
      { path: 'travel', component: SettingsTravelComponent },
      { path: 'weather', component: SettingsWeatherComponent },
      { path: 'graph', component: SettingsGraphComponent },
      { path: 'backup', component: SettingsBackupComponent },
      { path: 'upload', component: SettingsUploadComponent },
      { path: '', redirectTo: 'currency', pathMatch: 'full' },
    ],
  },
];
