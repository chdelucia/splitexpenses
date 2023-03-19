import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';
import { CurrencyService } from '../shared/currency.service';
import { SettingsBackupComponent } from './settings-backup/settings-backup.component';
import { SettingsWeatherComponent } from './settings-weather/settings-weather.component';
import { SettingsUploadComponent } from './settings-upload/settings-upload.component';
import { SettingsCurrencyComponent } from './settings-currency/settings-currency.component';
import { SettingsGraphComponent } from './settings-graph/settings-graph.component';
import { SettingsTravelComponent } from './settings-travel/settings-travel.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


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
    FormsModule,
    SharedModule
  ],
  providers: [
    CurrencyService
  ]
})
export class OptionsModule { }
