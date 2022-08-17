import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';

const routes: Routes = [
  { path: '',   component: AddExpenseComponent, pathMatch: 'full' },
  { path: 'details', component: ExpensesListComponent },
  { path: 'users', component: AddUserComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
