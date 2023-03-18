import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';
import { SettingsBackupComponent } from './settings-backup/settings-backup.component';
import { SettingsWeatherComponent } from './settings-weather/settings-weather.component';
import { SettingsUploadComponent } from './settings-upload/settings-upload.component';
import { SettingsCurrencyComponent } from './settings-currency/settings-currency.component';
import { SettingsGraphComponent } from './settings-graph/settings-graph.component';
import { SettingsTravelComponent } from './settings-travel/settings-travel.component';
import { CurrencyService } from '../shared/currency.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OptionsComponent,
    SettingsBackupComponent,
    SettingsWeatherComponent,
    SettingsUploadComponent,
    SettingsCurrencyComponent,
    SettingsGraphComponent,
    SettingsTravelComponent,
  ],
  imports: [
    CommonModule,
    OptionsRoutingModule,
    FormsModule
  ],
  providers: [
    CurrencyService
  ]
})
export class OptionsModule { }
