import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpensesService } from './shared/expenses.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NavbarComponent } from './navbar/navbar.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AddExpenseComponent,
    ExpensesListComponent,
    MainComponent,
    DebtsDetailComponent,
    WeatherComponent,
    DebtsComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({users: userReducer}, {}),
    BrowserAnimationsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatNativeDateModule,
    SharedModule
  ],
  providers: [
    ExpensesService,
    DebtsService,
    LocalstorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
