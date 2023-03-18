import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpensesService } from './shared/expenses.service';
import { FormsModule } from '@angular/forms';
import { UsersService } from './shared/users.service';
import { DebtsService } from './shared/debts.service';
import { AlertComponent } from './alert/alert.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { WeatherComponent } from './weather/weather.component';
import { HttpClientModule } from '@angular/common/http';
import { SettingsBackupComponent } from './settings/settings-backup/settings-backup.component';
import { SettingsWeatherComponent } from './settings/settings-weather/settings-weather.component';
import { SettingsUploadComponent } from './settings/settings-upload/settings-upload.component';
import { SettingsCurrencyComponent } from './settings/settings-currency/settings-currency.component';
import { SettingsGraphComponent } from './settings/settings-graph/settings-graph.component';
import { LocalstorageService } from './shared/localstorage.service';
import { SettingsTravelComponent } from './settings/settings-travel/settings-travel.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { CurrencyService } from './shared/currency.service';
import { DebtsComponent } from './debts/debts.component';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './state/user/user.reducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AddExpenseComponent,
    ExpensesListComponent,
    AlertComponent,
    MainComponent,
    SettingsComponent,
    DebtsDetailComponent,
    WeatherComponent,
    SettingsBackupComponent,
    SettingsWeatherComponent,
    SettingsUploadComponent,
    SettingsCurrencyComponent,
    SettingsGraphComponent,
    SettingsTravelComponent,
    StatisticsComponent,
    DebtsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({users: userReducer}, {}),
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    ExpensesService,
    UsersService,
    DebtsService,
    LocalstorageService,
    CurrencyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
