import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { MainComponent } from './main/main.component';
import { SettingsBackupComponent } from './settings/settings-backup/settings-backup.component';
import { SettingsCurrencyComponent } from './settings/settings-currency/settings-currency.component';
import { SettingsGraphComponent } from './settings/settings-graph/settings-graph.component';
import { SettingsTravelComponent } from './settings/settings-travel/settings-travel.component';
import { SettingsUploadComponent } from './settings/settings-upload/settings-upload.component';
import { SettingsWeatherComponent } from './settings/settings-weather/settings-weather.component';
import { SettingsComponent } from './settings/settings.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  { path: '',   component: MainComponent, pathMatch: 'full' },
  { path: 'expense',   component: AddExpenseComponent },
  { path: 'debts/:id', component: DebtsDetailComponent },
  { path: 'details', component: ExpensesListComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'settings', component: SettingsComponent, children:[
    { path: '',   redirectTo:'currency', pathMatch: 'full'},
    { path: 'currency', component: SettingsCurrencyComponent },
    { path: 'travel',   component: SettingsTravelComponent },
    { path: 'weather',  component: SettingsWeatherComponent },
    { path: 'graph',  component: SettingsGraphComponent},
    { path: 'backup',  component: SettingsBackupComponent},
    { path: 'upload',  component: SettingsUploadComponent},
  ]
},
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'forecast', loadChildren: () => import('./forecast/forecast.module').then(m => m.ForecastModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
