import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { WeatherComponent } from './weather/weather.component';
import { HttpClientModule } from '@angular/common/http';
import { LocalstorageService } from './shared/localstorage.service';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './state/user/user.reducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { expensesReducer } from './state/expenses/expenses.reducer';
import { NavbarComponent } from './navbar/navbar.component';
import {MatStepperModule} from '@angular/material/stepper';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    WeatherComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({users: userReducer, expenses: expensesReducer}),
    BrowserAnimationsModule,
    SharedModule,
    MatStepperModule
  ],
  providers: [
    LocalstorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
