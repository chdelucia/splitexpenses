import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpensesService } from './shared/expenses.service';
import { FormsModule } from '@angular/forms';
import { UsersService } from './shared/users.service';
import { DebtsService } from './shared/debts.service';

@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    AddExpenseComponent,
    ExpensesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    ExpensesService,
    UsersService,
    DebtsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
