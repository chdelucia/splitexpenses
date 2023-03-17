import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpensesService } from './shared/expenses.service';
import { FormsModule } from '@angular/forms';
import { UsersService } from './shared/users.service';
import { DebtsService } from './shared/debts.service';
import { AlertComponent } from './alert/alert.component';
import { SummarygraphComponent } from './summarygraph/summarygraph.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { WeatherComponent } from './weather/weather.component';
import { WeatherService } from './shared/weather.service';
import { HttpClientModule } from '@angular/common/http';
import { WeatherforecastComponent } from './weatherforecast/weatherforecast.component';
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

@NgModule({
  declarations: [
    AppComponent,
    AddExpenseComponent,
    ExpensesListComponent,
    AlertComponent,
    SummarygraphComponent,
    MainComponent,
    SettingsComponent,
    DebtsDetailComponent,
    WeatherComponent,
    WeatherforecastComponent,
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
    NgChartsModule,
    StoreModule.forRoot({users: userReducer}, {}),
    BrowserAnimationsModule
  ],
  providers: [
    ExpensesService,
    UsersService,
    DebtsService,
    WeatherService,
    LocalstorageService,
    CurrencyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
