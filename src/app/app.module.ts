import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpensesService } from './shared/expenses.service';
import { FormsModule } from '@angular/forms';
import { DebtsService } from './shared/debts.service';
import { AlertComponent } from './alert/alert.component';
import { MainComponent } from './main/main.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { WeatherComponent } from './weather/weather.component';
import { HttpClientModule } from '@angular/common/http';
import { LocalstorageService } from './shared/localstorage.service';
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
    MainComponent,
    DebtsDetailComponent,
    WeatherComponent,
    DebtsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({users: userReducer}, {}),
    BrowserAnimationsModule
  ],
  providers: [
    ExpensesService,
    DebtsService,
    LocalstorageService,
    CurrencyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
