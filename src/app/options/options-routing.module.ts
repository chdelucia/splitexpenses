import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './options.component';
import { SettingsBackupComponent } from './settings-backup/settings-backup.component';
import { SettingsCurrencyComponent } from './settings-currency/settings-currency.component';
import { SettingsGraphComponent } from './settings-graph/settings-graph.component';
import { SettingsTravelComponent } from './settings-travel/settings-travel.component';
import { SettingsUploadComponent } from './settings-upload/settings-upload.component';
import { SettingsWeatherComponent } from './settings-weather/settings-weather.component';

const routes: Routes = [
  { path: '', component: OptionsComponent, children:[
    { path: '',   redirectTo:'currency', pathMatch: 'full'},
    { path: 'currency', component: SettingsCurrencyComponent },
    { path: 'travel',   component: SettingsTravelComponent },
    { path: 'weather',  component: SettingsWeatherComponent },
    { path: 'graph',  component: SettingsGraphComponent},
    { path: 'backup',  component: SettingsBackupComponent},
    { path: 'upload',  component: SettingsUploadComponent},
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionsRoutingModule { }
