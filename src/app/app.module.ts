import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DebtsService } from './shared/debts.service';
import { MainComponent } from './main/main.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { WeatherComponent } from './weather/weather.component';
import { HttpClientModule } from '@angular/common/http';
import { LocalstorageService } from './shared/localstorage.service';
import { DebtsComponent } from './debts/debts.component';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './state/user/user.reducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { expensesReducer } from './state/expenses/expenses.reducer';


@NgModule({
  declarations: [
    AppComponent,
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
    StoreModule.forRoot({users: userReducer, expenses: expensesReducer}),
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    DebtsService,
    LocalstorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
