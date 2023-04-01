import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpensesService } from './shared/expenses.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    AddExpenseComponent,
    ExpensesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExpensesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatNativeDateModule,
  ],
  providers: [
    ExpensesService,
  ]
})
export class ExpensesModule { }
