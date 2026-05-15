import { Routes } from '@angular/router';
import { IndividualAddExpenseComponent } from './individual-add-expense.component';
import { IndividualExpensesListComponent } from './individual-expenses-list.component';

export const routes: Routes = [
  { path: '', component: IndividualAddExpenseComponent },
  { path: 'details', component: IndividualExpensesListComponent },
  { path: ':id', component: IndividualAddExpenseComponent },
];
