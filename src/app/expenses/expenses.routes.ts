import { Routes } from '@angular/router';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';

export const routes: Routes = [
  { path: '', component: AddExpenseComponent },
  { path: 'details', component: ExpensesListComponent },
  { path: ':id', component: AddExpenseComponent },
];
