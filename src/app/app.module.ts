import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { userReducer } from '@state/user/user.reducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';
import { expensesReducer } from './state/expenses/expenses.reducer';
import { CoreModule } from './core/core.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({ declarations: [AppComponent, WeatherComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        StoreModule.forRoot({ users: userReducer, expenses: expensesReducer }),
        BrowserAnimationsModule,
        SharedModule,
        CoreModule,
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: false, // Pauses recording actions and state changes when the extension window is not open
            trace: true, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
            traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
        })], providers: [
          provideHttpClient(withInterceptorsFromDi()),
          provideCharts(withDefaultRegisterables())
        ] })
export class AppModule {}
